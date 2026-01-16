import { View, Text, ScrollView, Pressable, TextInput } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { ScreenContainer } from "@/components/screen-container";
import { useApp } from "@/lib/app-context";
import { useColors } from "@/hooks/use-colors";
import { calculateDebtDetail, simulateEarlyPayment, getDebtStrategies } from "@/lib/debt-detail-calculator";
import type { DebtDetail, EarlyPaymentSimulation } from "@/types/debt-detail";

export default function DebtDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state } = useApp();
  const colors = useColors();
  const { t } = useTranslation();

  const [extraPayment, setExtraPayment] = useState("0");
  const [simulation, setSimulation] = useState<EarlyPaymentSimulation | null>(null);

  // Ödemeyi bul
  const payment = useMemo(() => {
    return state.payments.find((p) => p.id === id);
  }, [state.payments, id]);

  // Borç detayını hesapla
  const debtDetail = useMemo(() => {
    if (!payment) return null;
    return calculateDebtDetail(payment);
  }, [payment]);

  // Simülasyonu güncelle
  useEffect(() => {
    if (!debtDetail) return;
    const extra = parseFloat(extraPayment) || 0;
    if (extra > 0) {
      setSimulation(simulateEarlyPayment(debtDetail, extra));
    } else {
      setSimulation(null);
    }
  }, [extraPayment, debtDetail]);

  // Stratejileri al
  const strategies = useMemo(() => {
    if (!debtDetail) return [];
    return getDebtStrategies([debtDetail]);
  }, [debtDetail]);

  if (!payment || !debtDetail) {
    return (
      <ScreenContainer className="p-4">
        <Text className="text-foreground text-center">{t("common.notFound")}</Text>
      </ScreenContainer>
    );
  }

  const formatCurrency = (amount: number) => {
    return `₺${amount.toFixed(2)}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("tr-TR", { year: "numeric", month: "short" });
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
          <Text className="text-3xl font-bold text-foreground mb-2">{debtDetail.name}</Text>
          <Text className="text-muted text-base">
            {t("debtDetail.totalDebt")}: {formatCurrency(debtDetail.totalAmount)}
          </Text>
        </View>

        {/* Özet Kartı */}
        <View className="bg-surface rounded-2xl p-4 mb-4 border border-border">
          <Text className="text-lg font-semibold text-foreground mb-3">
            {t("debtDetail.summary")}
          </Text>
          <View className="gap-2">
            <View className="flex-row justify-between">
              <Text className="text-muted">{t("debtDetail.monthlyPayment")}</Text>
              <Text className="text-foreground font-semibold">
                {formatCurrency(debtDetail.monthlyPayment)}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-muted">{t("debtDetail.remainingMonths")}</Text>
              <Text className="text-foreground font-semibold">
                {debtDetail.remainingMonths} {t("debtDetail.months")}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-muted">{t("debtDetail.totalInterest")}</Text>
              <Text className="text-error font-semibold">
                {formatCurrency(debtDetail.totalInterest)}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-muted">{t("debtDetail.interestRate")}</Text>
              <Text className="text-foreground font-semibold">
                %{debtDetail.interestRate.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Erken Ödeme Simülatörü */}
        <View className="bg-surface rounded-2xl p-4 mb-4 border border-border">
          <Text className="text-lg font-semibold text-foreground mb-3">
            {t("debtDetail.earlyPaymentSimulator")}
          </Text>
          <Text className="text-muted text-sm mb-3">
            {t("debtDetail.earlyPaymentDescription")}
          </Text>
          <View className="mb-3">
            <Text className="text-muted text-sm mb-1">
              {t("debtDetail.extraMonthlyPayment")}
            </Text>
            <TextInput
              className="bg-background border border-border rounded-lg p-3 text-foreground"
              placeholder="0"
              keyboardType="numeric"
              value={extraPayment}
              onChangeText={setExtraPayment}
            />
          </View>

          {simulation && (
            <View className="bg-primary/10 rounded-lg p-3 gap-2">
              <View className="flex-row justify-between">
                <Text className="text-muted">{t("debtDetail.newDuration")}</Text>
                <Text className="text-foreground font-semibold">
                  {simulation.newMonths} {t("debtDetail.months")}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-muted">{t("debtDetail.savedMonths")}</Text>
                <Text className="text-success font-semibold">
                  -{simulation.savedMonths} {t("debtDetail.months")}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-muted">{t("debtDetail.savedInterest")}</Text>
                <Text className="text-success font-semibold">
                  -{formatCurrency(simulation.savedInterest)}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Ödeme Planı */}
        <View className="bg-surface rounded-2xl p-4 mb-4 border border-border">
          <Text className="text-lg font-semibold text-foreground mb-3">
            {t("debtDetail.paymentPlan")}
          </Text>
          <View className="gap-2">
            {debtDetail.paymentPlan.slice(0, 6).map((p) => (
              <View key={p.month} className="flex-row justify-between items-center py-2 border-b border-border">
                <View>
                  <Text className="text-foreground font-medium">
                    {t("debtDetail.month")} {p.month}
                  </Text>
                  <Text className="text-muted text-xs">{formatDate(p.date)}</Text>
                </View>
                <View className="items-end">
                  <Text className="text-foreground font-semibold">
                    {formatCurrency(p.total)}
                  </Text>
                  <Text className="text-muted text-xs">
                    {t("debtDetail.remaining")}: {formatCurrency(p.remainingBalance)}
                  </Text>
                </View>
              </View>
            ))}
            {debtDetail.paymentPlan.length > 6 && (
              <Text className="text-muted text-center text-sm mt-2">
                +{debtDetail.paymentPlan.length - 6} {t("debtDetail.morePayments")}
              </Text>
            )}
          </View>
        </View>

        {/* Strateji Önerileri */}
        <View className="bg-surface rounded-2xl p-4 mb-4 border border-border">
          <Text className="text-lg font-semibold text-foreground mb-3">
            {t("debtDetail.strategies")}
          </Text>
          {strategies.map((strategy) => (
            <View
              key={strategy.type}
              className={`rounded-lg p-3 mb-3 ${
                strategy.recommended ? "bg-primary/10 border border-primary" : "bg-background"
              }`}
            >
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-foreground font-semibold">{strategy.title}</Text>
                {strategy.recommended && (
                  <Text className="text-primary text-xs font-semibold">
                    {t("debtDetail.recommended")}
                  </Text>
                )}
              </View>
              <Text className="text-muted text-sm mb-2">{strategy.description}</Text>
              <Text className="text-success text-xs font-semibold mb-1">
                {t("debtDetail.pros")}:
              </Text>
              {strategy.pros.map((pro, i) => (
                <Text key={i} className="text-muted text-xs ml-2">
                  • {pro}
                </Text>
              ))}
              <Text className="text-error text-xs font-semibold mt-2 mb-1">
                {t("debtDetail.cons")}:
              </Text>
              {strategy.cons.map((con, i) => (
                <Text key={i} className="text-muted text-xs ml-2">
                  • {con}
                </Text>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
