/**
 * IncomeCard Bileşeni
 * Gelir kartı gösterimi
 */

import { View, Text, Pressable, Platform } from "react-native";
import * as Haptics from "expo-haptics";
import { Income, INCOME_TYPE_NAMES, RECURRENCE_NAMES } from "@/types";
import { formatDateShort, formatCurrency } from "@/utils/helpers";

interface IncomeCardProps {
  income: Income;
  onPress?: () => void;
  currency?: string;
}

export function IncomeCard({ income, onPress, currency = "TRY" }: IncomeCardProps) {
  const handlePress = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <View className="bg-surface rounded-2xl p-4 mb-3 border border-border">
        {/* Üst kısım: İsim ve tip badge */}
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-base font-semibold text-foreground flex-1" numberOfLines={1}>
            {income.name}
          </Text>
          <View className="bg-success/10 px-3 py-1 rounded-full">
            <Text className="text-xs font-medium text-success">
              {INCOME_TYPE_NAMES[income.type]}
            </Text>
          </View>
        </View>

        {/* Orta kısım: Tekrarlama bilgisi */}
        {income.recurrence && (
          <View className="mb-2">
            <Text className="text-sm text-muted">
              {RECURRENCE_NAMES[income.recurrence.frequency]}
            </Text>
          </View>
        )}

        {/* Alt kısım: Tutar ve tarih */}
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-bold text-success">
            +{formatCurrency(income.amount, currency)}
          </Text>
          <Text className="text-sm text-muted">
            {formatDateShort(income.date)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
