/**
 * Chat Mesaj Bileşeni
 */

import { View, Text } from 'react-native';
import { useColors } from '@/hooks/use-colors';
import type { ChatMessage as ChatMessageType } from '@/types/chatbot';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const colors = useColors();
  const isUser = message.role === 'user';

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: 12,
        paddingHorizontal: 16,
      }}
    >
      <View
        style={{
          maxWidth: '80%',
          backgroundColor: isUser ? colors.tint : colors.surface,
          borderRadius: 16,
          padding: 12,
          borderWidth: isUser ? 0 : 1,
          borderColor: colors.border,
        }}
      >
        <Text
          style={{
            fontSize: 15,
            color: isUser ? '#FFFFFF' : colors.foreground,
            lineHeight: 22,
          }}
        >
          {message.content}
        </Text>
        <Text
          style={{
            fontSize: 11,
            color: isUser ? '#FFFFFF99' : colors.muted,
            marginTop: 4,
          }}
        >
          {new Date(message.timestamp).toLocaleTimeString('tr-TR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    </View>
  );
}
