/**
 * Harcama Özeti Kartı Bileşeni
 * Ana sayfada gösterilecek aylık harcama özeti
 */

import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { IconSymbol } from "./ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "@/utils/currency-helpers";
import type { MonthlyExpenseSummary } from "@/types/budget";
import { PaymentCategory } from "@/types";

interface ExpenseSummaryCardProps {
  summary: MonthlyExpenseSummary;
  currency: string;
}

export function ExpenseSummaryCard({ summary, currency }: ExpenseSummaryCardProps) {
  const router = useRouter();
  const colors = useColors();
  const { t } = useTranslation();

  const getCategoryLabel = (category: PaymentCategory) => {
    if (category === PaymentCategory.CREDIT_CARD) return t("categories.creditCard");
    if (category === PaymentCategory.LOAN) return t("categories.loan");
    return t("categories.other");
  };

  const getCategoryColor = (category: PaymentCategory) => {
    if (category === PaymentCategory.CREDIT_CARD) return "#3B82F6"; // Blue
    if (category === PaymentCategory.LOAN) return "#EF4444"; // Red
    return "#8B5CF6"; // Purple
  };

  return (
    <Pressable
      onPress={() => router.push("/payments" as any)}
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
          <Text className="text-lg font-semibold text-foreground">
            {t("expense.title")}
          </Text>
        </View>
        <IconSymbol name="chevron.right" size={20} color={colors.muted} />
      </View>

      {/* Toplam Harcama */}
      <View className="mb-4">
        <Text className="text-sm text-muted mb-2">{t("expense.totalExpense")}</Text>
        <Text className="text-3xl font-bold text-foreground">
          {formatCurrency(summary.totalExpense, currency as any)}
        </Text>
      </View>

      {/* Bütçe Aşım Uyarısı */}
      {summary.hasOverBudget && (
        <View
          className="mb-4 px-3 py-2 rounded-lg flex-row items-center gap-2"
          style={{ backgroundColor: colors.error + "10" }}
        >
          <Text className="text-xs font-semibold text-error">
            ⚠️ {t("expense.budgetExceeded")}
          </Text>
        </View>
      )}

      {/* Kategori Dağılımı */}
      {summary.byCategory.length > 0 && (
        <View>
          <Text className="text-sm font-medium text-foreground mb-3">
            {t("expense.byCategory")}
          </Text>
          <View className="gap-2">
            {summary.byCategory.slice(0, 3).map((cat) => (
              <View key={cat.category} className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2 flex-1">
                  <View
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getCategoryColor(cat.category) }}
                  />
                  <Text className="text-sm text-muted flex-1">
                    {getCategoryLabel(cat.category)}
                  </Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Text className="text-sm font-semibold text-foreground">
                    {formatCurrency(cat.amount, currency as any)}
                  </Text>
                  <Text className="text-xs text-muted w-12 text-right">
                    {cat.percentage.toFixed(0)}%
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Harcama Yok Mesajı */}
      {summary.byCategory.length === 0 && (
        <View className="items-center py-4">
          <Text className="text-sm text-muted text-center">
            {t("expense.noExpenses")}
          </Text>
        </View>
      )}
    </Pressable>
  );
}
