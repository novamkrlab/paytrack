/**
 * Finansal Asistan Chatbot Ekranı
 */

import {
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { ChatMessage } from '@/components/chat-message';
import { useColors } from '@/hooks/use-colors';
import { useApp } from '@/lib/app-context';
import { useChatMutation, getSampleQuestions } from '@/lib/chatbot-api';
import { getAllQuickReplies, type QuickReply } from '@/lib/chatbot-quick-replies';
import { calculateFinancialHealthScore } from '@/lib/financial-health';
import type { ChatMessage as ChatMessageType } from '@/types/chatbot';
import { PaymentCategory, type Payment, type Income } from '@/types';

export default function ChatbotScreen() {
  const { t, i18n } = useTranslation();
  const colors = useColors();
  const { state } = useApp();
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  const mutation = useChatMutation();

  // Finansal verileri hesapla
  const financialContext = {
    monthlyIncome: state.incomes.reduce(
      (sum: number, income: Income) => sum + income.amount,
      0
    ),
    monthlyExpenses: state.payments
      .filter((payment: Payment) => !payment.isPaid)
      .reduce((sum: number, payment: Payment) => sum + payment.amount, 0),
    totalDebt: state.payments
      .filter(
        (payment: Payment) =>
          !payment.isPaid &&
          (payment.category === PaymentCategory.LOAN ||
            payment.category === PaymentCategory.CREDIT_CARD)
      )
      .reduce((sum: number, payment: Payment) => sum + payment.amount, 0),
    currentSavings: Math.max(
      0,
      state.incomes.reduce((sum: number, income: Income) => sum + income.amount, 0) -
        state.payments
          .filter((payment: Payment) => payment.isPaid)
          .reduce((sum: number, payment: Payment) => sum + payment.amount, 0)
    ),
    healthScore: calculateFinancialHealthScore({
      monthlyIncome: state.incomes.reduce(
        (sum: number, income: Income) => sum + income.amount,
        0
      ),
      monthlyExpenses: state.payments
        .filter((payment: Payment) => !payment.isPaid)
        .reduce((sum: number, payment: Payment) => sum + payment.amount, 0),
      totalDebt: state.payments
        .filter(
          (payment: Payment) =>
            !payment.isPaid &&
            (payment.category === PaymentCategory.LOAN ||
              payment.category === PaymentCategory.CREDIT_CARD)
        )
        .reduce((sum: number, payment: Payment) => sum + payment.amount, 0),
      currentSavings: Math.max(
        0,
        state.incomes.reduce((sum: number, income: Income) => sum + income.amount, 0) -
          state.payments
            .filter((payment: Payment) => payment.isPaid)
            .reduce((sum: number, payment: Payment) => sum + payment.amount, 0)
      ),
    }).totalScore,
  };

  // Hoşgeldin mesajı
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: t('chatbot.welcome'),
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    // Kullanıcı mesajını ekle
    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');

    // Backend'e gönder
    mutation.mutate(
      {
        message: inputText,
        context: financialContext,
      },
      {
        onSuccess: (data) => {
          const assistantMessage: ChatMessageType = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: typeof data.reply === 'string' ? data.reply : JSON.stringify(data.reply),
            timestamp: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, assistantMessage]);
        },
        onError: (error) => {
          const errorMessage: ChatMessageType = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: t('chatbot.error'),
            timestamp: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, errorMessage]);
          console.error('Chatbot error:', error);
        },
      }
    );
  };

  const handleSampleQuestion = (question: string) => {
    setInputText(question);
  };

  const sampleQuestions = getSampleQuestions(i18n.language as 'tr' | 'en');
  const quickReplies = getAllQuickReplies();

  // Hazır cevap butonuna tıklandığında
  const handleQuickReply = (reply: QuickReply) => {
    const question = t(reply.question);
    const answer = t(reply.answer);

    // Kullanıcı mesajını ekle
    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      role: 'user',
      content: question,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Asistan cevabını ekle
    setTimeout(() => {
      const assistantMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: answer,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 500);
  };

  return (
    <ScreenContainer edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}
        >
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => ({
              opacity: pressed ? 0.6 : 1,
              marginRight: 12,
            })}
          >
            <Text style={{ fontSize: 24, color: colors.tint }}>←</Text>
          </Pressable>
          <Text style={{ fontSize: 20, marginRight: 8 }}>🤖</Text>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.foreground }}>
            {t('chatbot.title')}
          </Text>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{ paddingVertical: 16 }}
          style={{ flex: 1 }}
        >
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {mutation.isPending && (
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', paddingHorizontal: 16 }}>
              <View
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 16,
                  padding: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <ActivityIndicator size="small" color={colors.tint} />
              </View>
            </View>
          )}

          {/* Hazır Cevaplar (Quick Replies) */}
          {messages.length === 1 && (
            <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: colors.foreground, marginBottom: 12 }}>
                {t('chatbot.quickRepliesTitle')}
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {quickReplies.map((reply) => (
                  <Pressable
                    key={reply.id}
                    onPress={() => handleQuickReply(reply)}
                    style={({ pressed }) => ({
                      backgroundColor: colors.tint + '20',
                      borderRadius: 20,
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderWidth: 1,
                      borderColor: colors.tint,
                      opacity: pressed ? 0.7 : 1,
                    })}
                  >
                    <Text style={{ fontSize: 13, color: colors.tint, fontWeight: '500' }}>
                      {t(reply.question)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {/* Sample Questions */}
          {messages.length === 1 && (
            <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
              <Text style={{ fontSize: 14, color: colors.muted, marginBottom: 12 }}>
                {t('chatbot.sampleQuestions')}
              </Text>
              {sampleQuestions.map((question, index) => (
                <Pressable
                  key={index}
                  onPress={() => handleSampleQuestion(question)}
                  style={({ pressed }) => ({
                    backgroundColor: colors.surface,
                    borderRadius: 12,
                    padding: 12,
                    marginBottom: 8,
                    borderWidth: 1,
                    borderColor: colors.border,
                    opacity: pressed ? 0.7 : 1,
                  })}
                >
                  <Text style={{ fontSize: 14, color: colors.foreground }}>
                    {question}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            backgroundColor: colors.background,
          }}
        >
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder={t('chatbot.placeholder')}
            placeholderTextColor={colors.muted}
            style={{
              flex: 1,
              backgroundColor: colors.surface,
              borderRadius: 20,
              paddingHorizontal: 16,
              paddingVertical: 10,
              fontSize: 15,
              color: colors.foreground,
              marginRight: 8,
              borderWidth: 1,
              borderColor: colors.border,
            }}
            multiline
            maxLength={500}
            onSubmitEditing={handleSend}
            blurOnSubmit={false}
          />
          <Pressable
            onPress={handleSend}
            disabled={!inputText.trim() || mutation.isPending}
            style={({ pressed }) => ({
              backgroundColor: inputText.trim() && !mutation.isPending ? colors.tint : colors.border,
              width: 40,
              height: 40,
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Text style={{ fontSize: 20, color: '#FFFFFF' }}>→</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
