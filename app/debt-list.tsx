import { View, Text, ScrollView, Pressable, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { ScreenContainer } from "@/components/screen-container";
import { useApp } from "@/lib/app-context";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { PaymentCategory } from "@/types";
import { groupRecurringDebts, calculateDebtProgress, type GroupedDebt } from "@/lib/group-recurring-debts";

export default function DebtListScreen() {
  const router = useRouter();
  const { state } = useApp();
  const colors = useColors();
  const { t } = useTranslation();

  const [expandedDebtId, setExpandedDebtId] = useState<string | null>(null);
  const [extraPayments, setExtraPayments] = useState<Record<string, string>>({});

  // Tekrarlayan ödemeleri grupla
  const groupedDebts = useMemo(() => {
    return groupRecurringDebts(state.payments);
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

  const toggleExpand = (debtId: string) => {
    setExpandedDebtId(expandedDebtId === debtId ? null : debtId);
  };

  const calculateEarlyPayoff = (debt: GroupedDebt, extraAmount: number) => {
    if (extraAmount <= 0) return null;

    const monthsToPayoff = Math.ceil(debt.remainingAmount / (debt.monthlyPayment + extraAmount));
    const monthsSaved = debt.remainingInstallments - monthsToPayoff;
    const totalPaid = monthsToPayoff * (debt.monthlyPayment + extraAmount);
    const interestSaved = debt.remainingAmount - totalPaid;

    return {
      monthsToPayoff,
      monthsSaved,
      totalPaid,
      interestSaved: Math.max(0, interestSaved),
    };
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
            {groupedDebts.length} {t("debtList.activeDebts")}
          </Text>
        </View>

        {/* Borç Listesi */}
        {groupedDebts.length === 0 ? (
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
            {groupedDebts.map((debt) => {
              const progress = calculateDebtProgress(debt);
              const isExpanded = expandedDebtId === debt.id;
              const extraPayment = parseFloat(extraPayments[debt.id] || "0");
              const earlyPayoff = calculateEarlyPayoff(debt, extraPayment);
              
              return (
                <View
                  key={debt.id}
                  className="bg-surface rounded-2xl p-4 border border-border"
                >
                  {/* Borç Başlığı */}
                  <Pressable
                    onPress={() => toggleExpand(debt.id)}
                    style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
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
                          <View
                            className="px-2 py-1 rounded-md"
                            style={{ backgroundColor: colors.muted + "20" }}
                          >
                            <Text className="text-xs font-medium text-muted">
                              {debt.paidInstallments}/{debt.totalInstallments} {t("debtList.installment")}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <IconSymbol 
                        name={isExpanded ? "chevron.down" : "chevron.right"} 
                        size={20} 
                        color={colors.muted} 
                      />
                    </View>

                    {/* Toplam Borç */}
                    <View className="flex-row items-center justify-between mb-2">
                      <Text className="text-sm text-muted">{t("debtList.totalDebt")}</Text>
                      <Text className="text-xl font-bold text-foreground">
                        {formatCurrency(debt.totalAmount)}
                      </Text>
                    </View>

                    {/* Kalan Tutar */}
                    <View className="flex-row items-center justify-between mb-2">
                      <Text className="text-sm text-muted">{t("debtList.remaining")}</Text>
                      <Text className="text-lg font-semibold text-error">
                        {formatCurrency(debt.remainingAmount)}
                      </Text>
                    </View>

                    {/* Aylık Ödeme */}
                    <View className="flex-row items-center justify-between mb-3">
                      <Text className="text-sm text-muted">{t("debtList.monthlyPayment")}</Text>
                      <Text className="text-sm font-medium text-foreground">
                        {formatCurrency(debt.monthlyPayment)}
                      </Text>
                    </View>

                    {/* İlerleme Çubuğu */}
                    <View className="mb-2">
                      <View className="flex-row items-center justify-between mb-1">
                        <Text className="text-xs text-muted">{t("debtList.progress")}</Text>
                        <Text className="text-xs font-semibold text-primary">
                          {progress.toFixed(0)}%
                        </Text>
                      </View>
                      <View className="h-2 bg-border rounded-full overflow-hidden">
                        <View
                          className="h-full rounded-full"
                          style={{
                            width: `${progress}%`,
                            backgroundColor: colors.primary,
                          }}
                        />
                      </View>
                    </View>

                    {/* Bir Sonraki Ödeme */}
                    {debt.nextDueDate && (
                      <View className="flex-row items-center justify-between">
                        <Text className="text-xs text-muted">{t("debtList.nextPayment")}</Text>
                        <Text className="text-xs font-medium text-foreground">
                          {formatDate(debt.nextDueDate)}
                        </Text>
                      </View>
                    )}

                    {/* Vadesi Geçmiş Uyarısı */}
                    {debt.hasOverdue && (
                      <View
                        className="mt-2 px-3 py-2 rounded-lg"
                        style={{ backgroundColor: colors.error + "10" }}
                      >
                        <Text className="text-xs font-semibold text-error">
                          ⚠️ {t("debtList.overdue")}
                        </Text>
                      </View>
                    )}
                  </Pressable>

                  {/* Genişletilmiş Detaylar */}
                  {isExpanded && (
                    <View className="mt-4 pt-4 border-t border-border">
                      {/* Erken Ödeme Simülatörü */}
                      <View className="mb-4">
                        <Text className="text-base font-semibold text-foreground mb-2">
                          {t("debtDetail.earlyPaymentSimulator")}
                        </Text>
                        <Text className="text-sm text-muted mb-3">
                          {t("debtDetail.earlyPaymentDescription")}
                        </Text>
                        
                        <Text className="text-sm font-medium text-foreground mb-2">
                          {t("debtDetail.extraMonthlyPayment")}
                        </Text>
                        <TextInput
                          className="bg-background border border-border rounded-lg px-4 py-3 text-foreground text-base mb-3"
                          placeholder="0"
                          keyboardType="numeric"
                          value={extraPayments[debt.id] || ""}
                          onChangeText={(text) => setExtraPayments({ ...extraPayments, [debt.id]: text })}
                        />

                        {earlyPayoff && earlyPayoff.monthsSaved > 0 && (
                          <View className="bg-success/10 rounded-lg p-4">
                            <Text className="text-sm font-semibold text-success mb-2">
                              ✅ {t("debtDetail.savingsEstimate")}
                            </Text>
                            <View className="gap-2">
                              <View className="flex-row justify-between">
                                <Text className="text-xs text-muted">{t("debtDetail.payoffTime")}</Text>
                                <Text className="text-xs font-semibold text-foreground">
                                  {earlyPayoff.monthsToPayoff} {t("debtDetail.months")}
                                </Text>
                              </View>
                              <View className="flex-row justify-between">
                                <Text className="text-xs text-muted">{t("debtDetail.timeSaved")}</Text>
                                <Text className="text-xs font-semibold text-success">
                                  {earlyPayoff.monthsSaved} {t("debtDetail.months")}
                                </Text>
                              </View>
                            </View>
                          </View>
                        )}
                      </View>

                      {/* Ödeme Planı */}
                      <View>
                        <Text className="text-base font-semibold text-foreground mb-3">
                          {t("debtDetail.paymentPlan")}
                        </Text>
                        <View className="gap-2">
                          {debt.payments.slice(0, 6).map((payment, index) => (
                            <View
                              key={payment.id}
                              className="flex-row items-center justify-between py-2 border-b border-border"
                            >
                              <View>
                                <Text className="text-sm font-medium text-foreground">
                                  {t("debtDetail.month")} {index + 1}
                                </Text>
                                <Text className="text-xs text-muted">
                                  {formatDate(payment.dueDate)}
                                </Text>
                              </View>
                              <View className="items-end">
                                <Text className="text-sm font-semibold text-foreground">
                                  {formatCurrency(payment.amount)}
                                </Text>
                                {payment.isPaid && (
                                  <Text className="text-xs font-medium text-success">
                                    ✓ {t("debtDetail.paid")}
                                  </Text>
                                )}
                              </View>
                            </View>
                          ))}
                          {debt.payments.length > 6 && (
                            <Text className="text-xs text-muted text-center py-2">
                              +{debt.payments.length - 6} {t("debtDetail.morePayments")}
                            </Text>
                          )}
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
