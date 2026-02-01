/**
 * Finansal Sağlık Skoru - Detay Ekranı
 */

import { ScrollView, View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { useApp } from '@/lib/app-context';
import { HealthScoreChart } from '@/components/health-score-chart';
import {
  calculateFinancialHealthScore,
  getHealthScoreBreakdown,
  getScoreColor,
  getScoreMessage,
} from '@/lib/financial-health';
import type { FinancialHealthInput } from '@/types/financial-health';
import { PaymentCategory, type Payment, type Income } from '@/types';
import { useMemo, useEffect, useState } from 'react';
import { HealthScoreDetailModal } from '@/components/health-score-detail-modal';
import { saveCurrentMonthScore, getRecentHealthScores } from '@/lib/health-score-storage';
import type { HealthScoreHistoryEntry } from '@/types/health-score-history';
import { loadFireSettings } from '@/lib/fire-storage';
import { getFireSummary } from '@/lib/fire-calculator';

export default function HealthScoreScreen() {
  const { t } = useTranslation();
  const colors = useColors();
  const { state } = useApp();
  const [fireProgressPercent, setFireProgressPercent] = useState<number>(0);

  // FIRE ilerleme yüzdesini yükle
  useEffect(() => {
    const loadFireProgress = async () => {
      try {
        const fireSettings = await loadFireSettings();
        if (fireSettings) {
          const fireSummary = getFireSummary(fireSettings);
          setFireProgressPercent(fireSummary.progress);
        }
      } catch (error) {
        console.error('FIRE ilerleme yüklenemedi:', error);
      }
    };
    loadFireProgress();
  }, []);

  // Finansal verileri hesapla (AYLIK BAZDA)
  const healthInput: FinancialHealthInput = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Bu ayın başlangıç ve bitiş tarihleri
    const monthStart = new Date(currentYear, currentMonth, 1);
    const monthEnd = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);
    
    // Tarihin bu ay içinde olup olmadığını kontrol et
    const isInCurrentMonth = (dateString: string) => {
      const date = new Date(dateString);
      return date >= monthStart && date <= monthEnd;
    };
    
    // AYLIK GELİR (sadece bu ay)
    const monthlyIncome = state.incomes
      .filter((income: Income) => isInCurrentMonth(income.date))
      .reduce((sum: number, income: Income) => sum + income.amount, 0);

    // AYLIK BORÇ ÖDEMESİ (sadece bu ay, ödenmemiş, kredi ve kredi kartı)
    const monthlyDebtPayment = state.payments
      .filter(
        (payment: Payment) =>
          !payment.isPaid &&
          isInCurrentMonth(payment.dueDate) &&
          (payment.category === PaymentCategory.LOAN || payment.category === PaymentCategory.CREDIT_CARD)
      )
      .reduce((sum: number, payment: Payment) => sum + payment.amount, 0);

    // AYLIK HARCAMA (sadece bu ay, ödenmemiş tüm ödemeler)
    const monthlyExpenses = state.payments
      .filter((payment: Payment) => !payment.isPaid && isInCurrentMonth(payment.dueDate))
      .reduce((sum: number, payment: Payment) => sum + payment.amount, 0);

    // MEVCUT BİRİKİM (tüm zamanların toplamı)
    const totalIncomeAllTime = state.incomes.reduce(
      (sum: number, income: Income) => sum + income.amount,
      0
    );
    const paidPayments = state.payments
      .filter((payment: Payment) => payment.isPaid)
      .reduce((sum: number, payment: Payment) => sum + payment.amount, 0);
    const totalExpensesAllTime = state.expenses.reduce(
      (sum: number, expense: any) => sum + expense.amount,
      0
    );
    const currentSavings = Math.max(0, totalIncomeAllTime - paidPayments - totalExpensesAllTime);

    return {
      monthlyIncome,
      monthlyExpenses,
      totalDebt: monthlyDebtPayment, // Artık aylık borç ödemesi
      currentSavings,
      fireProgressPercent,
    };
  }, [state.payments, state.incomes, state.expenses, fireProgressPercent]);

  const healthScore = useMemo(
    () => calculateFinancialHealthScore(healthInput),
    [healthInput]
  );

  const breakdown = useMemo(
    () => getHealthScoreBreakdown(healthScore),
    [healthScore]
  );

  const scoreColor = getScoreColor(healthScore.category);
  const scoreMessage = getScoreMessage(healthScore.category);

  // Geçmiş verileri yükle
  const [historyData, setHistoryData] = useState<HealthScoreHistoryEntry[]>([]);

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'debtManagement' | 'emergencyFund' | 'savingsRate' | 'fireProgress' | null>(null);
  const [selectedScore, setSelectedScore] = useState(0);
  const [selectedMaxScore, setSelectedMaxScore] = useState(0);

  // Kategori kartına tıklama
  const handleCategoryPress = (category: 'debtManagement' | 'emergencyFund' | 'savingsRate' | 'fireProgress', score: number, maxScore: number) => {
    setSelectedCategory(category);
    setSelectedScore(score);
    setSelectedMaxScore(maxScore);
    setModalVisible(true);
  };

  useEffect(() => {
    // Mevcut ayın skorunu kaydet
    saveCurrentMonthScore(healthScore).catch(console.error);

    // Geçmiş verileri yükle
    getRecentHealthScores(6).then(setHistoryData).catch(console.error);
  }, [healthScore]);

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => ({
              opacity: pressed ? 0.6 : 1,
              marginRight: 12,
            })}
          >
            <Text style={{ fontSize: 24, color: colors.tint }}>←</Text>
          </Pressable>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.foreground }}>
            {t('healthScore.title')}
          </Text>
        </View>

        {/* Skor Göstergesi */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 24,
            alignItems: 'center',
            marginBottom: 24,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <View
            style={{
              width: 140,
              height: 140,
              borderRadius: 70,
              backgroundColor: scoreColor + '20',
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 10,
              borderColor: scoreColor,
              marginBottom: 16,
            }}
          >
            <Text style={{ fontSize: 48, fontWeight: 'bold', color: scoreColor }}>
              {healthScore.totalScore}
            </Text>
          </View>
          <Text style={{ fontSize: 18, fontWeight: '600', color: colors.foreground }}>
            {t(scoreMessage)}
          </Text>
        </View>

        {/* Geçmiş Grafik */}
        {historyData.length > 0 && (
          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: colors.foreground, marginBottom: 16 }}>
              {t('healthScore.history')}
            </Text>
            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 16,
                padding: 16,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <HealthScoreChart data={historyData} />
            </View>
          </View>
        )}

        {/* Kategori Detayları */}
        <Text style={{ fontSize: 18, fontWeight: '600', color: colors.foreground, marginBottom: 16 }}>
          {t('healthScore.breakdown')}
        </Text>

        {breakdown.map((item, index) => {
          const categoryKey = item.category.split('.').pop() as 'debtManagement' | 'emergencyFund' | 'savingsRate' | 'fireProgress';
          return (
          <Pressable
            key={index}
            onPress={() => handleCategoryPress(categoryKey, item.score, item.maxScore)}
            style={({ pressed }) => ({
              backgroundColor: colors.surface,
              borderRadius: 12,
              padding: 16,
              marginBottom: 12,
              borderWidth: 1,
              borderColor: colors.border,
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: colors.foreground }}>
                {t(item.category)}
              </Text>
              <Text style={{ fontSize: 16, fontWeight: '600', color: colors.foreground }}>
                {item.score}/{item.maxScore}
              </Text>
            </View>
            <View
              style={{
                height: 8,
                backgroundColor: colors.border,
                borderRadius: 4,
                overflow: 'hidden',
                marginBottom: 8,
              }}
            >
              <View
                style={{
                  height: '100%',
                  width: `${item.percentage}%`,
                  backgroundColor:
                    item.status === 'excellent' || item.status === 'good'
                      ? '#22C55E'
                      : item.status === 'fair'
                      ? '#F59E0B'
                      : '#EF4444',
                }}
              />
            </View>
            {/* Kategori Açıklaması */}
            <Text style={{ fontSize: 13, color: colors.muted, lineHeight: 18 }}>
              {t(`healthScore.${item.category}Description`)}
            </Text>
            {/* Tıklama İpucu */}
            <Text style={{ fontSize: 12, color: colors.tint, marginTop: 8, fontWeight: '500' }}>
              {t('healthScore.tapForDetails')}
            </Text>
          </Pressable>
        );
        })}

        {/* Öneriler */}
        <Text style={{ fontSize: 18, fontWeight: '600', color: colors.foreground, marginTop: 8, marginBottom: 16 }}>
          💡 {t('healthScore.recommendationsTitle')}
        </Text>

        {healthScore.recommendations.map((rec, index) => (
          <View
            key={index}
            style={{
              backgroundColor: colors.surface,
              borderRadius: 12,
              padding: 16,
              marginBottom: 12,
              borderWidth: 1,
              borderColor: colors.border,
              flexDirection: 'row',
              alignItems: 'flex-start',
            }}
          >
            <Text style={{ fontSize: 16, marginRight: 8 }}>•</Text>
            <Text style={{ fontSize: 15, color: colors.foreground, flex: 1 }}>
              {t(rec)}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Detay Modalı */}
      {selectedCategory && (
        <HealthScoreDetailModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          category={selectedCategory}
          score={selectedScore}
          maxScore={selectedMaxScore}
          healthInput={healthInput}
        />
      )}
    </ScreenContainer>
  );
}
