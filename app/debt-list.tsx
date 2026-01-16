import { View, Text, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { ScreenContainer } from "@/components/screen-container";
import { useApp } from "@/lib/app-context";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { PaymentCategory } from "@/types";

export default function DebtListScreen() {
  const router = useRouter();
  const { state } = useApp();
  const colors = useColors();
  const { t } = useTranslation();

  // Borç ödemelerini filtrele (kredi ve kredi kartı)
  const debts = useMemo(() => {
    return state.payments.filter(
      (p) => p.category === PaymentCategory.LOAN || p.category === PaymentCategory.CREDIT_CARD
    );
  }, [state.payments]);

  const formatCurrency = (amount: number) => {
    return `₺${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", { year: "numeric", month: "short", day: "numeric" });
  };

  const getCategoryLabel = (category: PaymentCategory) => {
    if (category === PaymentCategory.LOAN) return t("categories.loan");
    if (category === PaymentCategory.CREDIT_CARD) return t("categories.creditCard");
    return t("categories.other");
  };

  return (
    <ScreenContainer>
      <ScrollView className="flex-1 p-4">
        {/* Header */}
        <View className="mb-6">
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <Text className="text-primary text-base mb-2">← {t("common.back")}</Text>
          </Pressable>
          <Text className="text-3xl font-bold text-foreground mb-2">
            {t("debtList.title")}
          </Text>
          <Text className="text-muted text-base">
            {debts.length} {t("debtList.activeDebts")}
          </Text>
        </View>

        {/* Borç Listesi */}
        {debts.length === 0 ? (
          <View className="bg-surface rounded-2xl p-8 border border-border items-center">
            <View
              className="w-16 h-16 rounded-full items-center justify-center mb-4"
              style={{ backgroundColor: colors.success + "20" }}
            >
              <IconSymbol name="checkmark.circle.fill" size={32} color={colors.success} />
            </View>
            <Text className="text-lg font-semibold text-foreground mb-2">
              {t("debtList.noDebts")}
            </Text>
            <Text className="text-sm text-muted text-center">
              {t("debtList.noDebtsDescription")}
            </Text>
          </View>
        ) : (
          <View className="gap-4">
            {debts.map((debt) => (
              <Pressable
                key={debt.id}
                onPress={() => router.push(`/debt-detail?id=${debt.id}` as any)}
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                className="bg-surface rounded-2xl p-4 border border-border"
              >
                <View className="flex-row items-start justify-between mb-3">
                  <View className="flex-1 mr-3">
                    <Text className="text-lg font-semibold text-foreground mb-1">
                      {debt.name}
                    </Text>
                    <View className="flex-row items-center gap-2">
                      <View
                        className="px-2 py-1 rounded-md"
                        style={{ backgroundColor: colors.primary + "20" }}
                      >
                        <Text className="text-xs font-medium text-primary">
                          {getCategoryLabel(debt.category)}
                        </Text>
                      </View>
                      {debt.installments && (
                        <View
                          className="px-2 py-1 rounded-md"
                          style={{ backgroundColor: colors.muted + "20" }}
                        >
                          <Text className="text-xs font-medium text-muted">
                            {debt.installments.current}/{debt.installments.total} {t("debtList.installment")}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <IconSymbol name="chevron.right" size={20} color={colors.muted} />
                </View>

                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-sm text-muted">{t("debtList.amount")}</Text>
                  <Text className="text-xl font-bold text-foreground">
                    {formatCurrency(debt.amount)}
                  </Text>
                </View>

                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-sm text-muted">{t("debtList.dueDate")}</Text>
                  <Text className="text-sm font-medium text-foreground">
                    {formatDate(debt.dueDate)}
                  </Text>
                </View>

                {debt.status === "overdue" && (
                  <View
                    className="mt-2 px-3 py-2 rounded-lg"
                    style={{ backgroundColor: colors.error + "10" }}
                  >
                    <Text className="text-xs font-semibold text-error">
                      ⚠️ {t("debtList.overdue")}
                    </Text>
                  </View>
                )}

                {debt.status === "pending" && !debt.isPaid && (
                  <View
                    className="mt-2 px-3 py-2 rounded-lg"
                    style={{ backgroundColor: colors.warning + "10" }}
                  >
                    <Text className="text-xs font-semibold text-warning">
                      ⏰ {t("debtList.pending")}
                    </Text>
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
