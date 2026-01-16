/**
 * Harcama Özeti Kartı (Yeni)
 * Günlük harcamaları gösterir (borçlardan ayrı)
 */

import { View, Text, Pressable, TouchableOpacity, Platform } from "react-native";
import { useRouter } from "expo-router";
import { IconSymbol } from "./ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "@/utils/currency-helpers";
import * as Haptics from "expo-haptics";
import { useApp } from "@/lib/app-context";
import { getCurrentMonthExpenseSummary } from "@/utils/expense-helpers";

export function ExpenseSummaryCardNew() {
  const router = useRouter();
  const colors = useColors();
  const { t } = useTranslation();
  const { state } = useApp();

  const summary = getCurrentMonthExpenseSummary(state.expenses);

  return (
    <Pressable
      onPress={() => router.push("/expense-list" as any)}
      className="bg-surface rounded-2xl p-6 border border-border"
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
    >
      <View className="flex-row items-center justify-between mb-6">
        <View className="flex-row items-center gap-3">
          <View
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: colors.primary + "20" }}
          >
            <IconSymbol name="chart.pie.fill" size={20} color={colors.primary} />
          </View>
          <View>
            <Text className="text-lg font-semibold text-foreground">
              {t("expenses.title")}
            </Text>
            <Text className="text-xs text-muted">
              {t("expense.thisMonth", "Bu Ay")}
            </Text>
          </View>
        </View>
        <IconSymbol name="chevron.right" size={20} color={colors.muted} />
      </View>

      {/* Toplam Harcama */}
      <View className="mb-4">
        <Text className="text-3xl font-bold text-foreground">
          {formatCurrency(summary.totalAmount, state.settings.currency)}
        </Text>
        <Text className="text-sm text-muted mt-1">
          {t("expenses.totalExpenses")}
        </Text>
      </View>

      {/* Zorunlu vs İstek Ayrımı */}
      <View className="gap-3">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <View className="w-3 h-3 rounded-full bg-error" />
            <Text className="text-sm text-foreground">
              {t("expenseTypes.essential")}
            </Text>
          </View>
          <Text className="text-sm font-semibold text-foreground">
            {formatCurrency(summary.essentialAmount, state.settings.currency)}
          </Text>
        </View>

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <View className="w-3 h-3 rounded-full bg-warning" />
            <Text className="text-sm text-foreground">
              {t("expenseTypes.discretionary")}
            </Text>
          </View>
          <Text className="text-sm font-semibold text-foreground">
            {formatCurrency(summary.discretionaryAmount, state.settings.currency)}
          </Text>
        </View>

        {summary.otherAmount > 0 && (
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <View className="w-3 h-3 rounded-full bg-muted" />
              <Text className="text-sm text-foreground">
                {t("expenseTypes.other")}
              </Text>
            </View>
            <Text className="text-sm font-semibold text-foreground">
              {formatCurrency(summary.otherAmount, state.settings.currency)}
            </Text>
          </View>
        )}
      </View>

      {/* Harcama Ekle Butonu */}
      <TouchableOpacity
        onPress={(e) => {
          e.stopPropagation();
          if (Platform.OS !== "web") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
          router.push("/add-expense" as any);
        }}
        className="mt-4 pt-4 border-t border-border"
        activeOpacity={0.7}
      >
        <Text className="text-xs text-primary font-medium text-center">
          + {t("expenses.addExpense")}
        </Text>
      </TouchableOpacity>
    </Pressable>
  );
}
