import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import type { FinancialSuggestion } from '@/services/financial-suggestions';

interface FinancialSuggestionCardProps {
  suggestion: FinancialSuggestion;
}

const TYPE_COLORS = {
  debt: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-600 dark:text-red-400',
  },
  savings: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    text: 'text-green-600 dark:text-green-400',
  },
  budget: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    text: 'text-orange-600 dark:text-orange-400',
  },
  emergency: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-600 dark:text-blue-400',
  },
  investment: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    text: 'text-purple-600 dark:text-purple-400',
  },
};

export function FinancialSuggestionCard({ suggestion }: FinancialSuggestionCardProps) {
  const router = useRouter();
  const colors = TYPE_COLORS[suggestion.type];

  const handlePress = () => {
    if (suggestion.action) {
      router.push(suggestion.action.route as any);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        { opacity: pressed ? 0.7 : 1 },
      ]}
      className={`p-4 rounded-xl border ${colors.bg} ${colors.border} mb-3`}
    >
      <View className="flex-row items-start gap-3">
        {/* İkon */}
        <Text className="text-2xl">{suggestion.icon}</Text>

        {/* İçerik */}
        <View className="flex-1">
          {/* Başlık */}
          <Text className={`text-base font-semibold mb-1 ${colors.text}`}>
            {suggestion.title}
          </Text>

          {/* Açıklama */}
          <Text className="text-sm text-muted leading-relaxed mb-2">
            {suggestion.description}
          </Text>

          {/* Aksiyon Butonu */}
          {suggestion.action && (
            <Text className={`text-sm font-medium ${colors.text}`}>
              {suggestion.action.label} →
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}
