/**
 * Ana Ekran (Home)
 * Aylık özet ve yaklaşan ödemeler
 */

import { ScrollView, Text, View, TouchableOpacity, RefreshControl, Platform } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { seedData } from "@/scripts/seed-data";
import { ScreenContainer } from "@/components/screen-container";
import { SummaryCard } from "@/components/summary-card";
import { PaymentCard } from "@/components/payment-card";
import { FireOverviewCard } from "@/components/fire-overview-card";
import { DebtOverviewCard } from "@/components/debt-overview-card";
import { HealthScoreCard } from "@/components/health-score-card";
import { ExpenseSummaryCardNew } from "@/components/expense-summary-card-new";
import { useApp } from "@/lib/app-context";
import {
  getUpcomingPayments,
  calculateMonthlyPaymentTotal,
  calculateMonthlyIncomeTotal,
} from "@/utils/helpers";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import * as Haptics from "expo-haptics";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { loadFireSettings } from "@/lib/fire-storage";
import { getFireSummary } from "@/lib/fire-calculator";
import { calculateDebtSummary } from "@/lib/debt-calculator";
import type { FireSummary } from "@/types/fire";
import type { DebtSummary } from "@/types/debt";
import { PaymentCategory, type Payment, type Income } from "@/types";
import { calculateFinancialHealthScore } from "@/lib/financial-health";
import type { FinancialHealthScore } from "@/types/financial-health";
import { getCurrentMonthExpenseSummary } from "@/utils/expense-calculations";
import { loadBudgets, getBudgetMap } from "@/utils/budget-storage";
import type { MonthlyExpenseSummary } from "@/types/budget";

export default function HomeScreen() {
  const router = useRouter();
  const { state } = useApp();
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = useState(false);
  const [fireSummary, setFireSummary] = useState<FireSummary | null>(null);
  const [debtSummary, setDebtSummary] = useState<DebtSummary | null>(null);
  const [healthScore, setHealthScore] = useState<FinancialHealthScore | null>(null);
  const [expenseSummary, setExpenseSummary] = useState<MonthlyExpenseSummary | null>(null);

  // Mevcut ay bilgileri
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // Aylık toplamlar
  const totalPayments = calculateMonthlyPaymentTotal(state.payments, currentYear, currentMonth);
  const totalIncome = calculateMonthlyIncomeTotal(state.incomes, currentYear, currentMonth);

  // Yaklaşan ödemeler (önümüzdeki 7 gün)
  const upcomingPayments = getUpcomingPayments(state.payments);

  // FIRE ve Borç özetlerini yükle
  useEffect(() => {
    loadSummaries();
  }, [state.payments]);

  const loadSummaries = async () => {
    // FIRE özeti
    const fireSettings = await loadFireSettings();
    const fire = getFireSummary(fireSettings);
    setFireSummary(fire);

    // Borç özeti (kredi ve kredi kartı ödemelerinden)
    const debtPayments = state.payments.filter(
      p => p.category === PaymentCategory.LOAN || p.category === PaymentCategory.CREDIT_CARD
    );
    const debts = debtPayments.map(p => {
      const installmentCount = typeof p.installments === 'number' ? p.installments : (p.installments?.total || 1);
      return {
        id: p.id,
        name: p.name,
        totalAmount: p.amount * installmentCount,
        remainingAmount: p.amount,
        monthlyPayment: p.amount,
        interestRate: 0, // Basitleştirilmiş
        remainingMonths: installmentCount,
        category: p.category.toString(),
        currency: state.settings.currency,
        createdAt: p.createdAt,
      };
    });
    const debt = calculateDebtSummary(debts);
    setDebtSummary(debt);

    // Finansal Sağlık Skoru
    const monthlyIncome = state.incomes.reduce(
      (sum: number, income: Income) => sum + income.amount,
      0
    );
    const monthlyExpenses = state.payments
      .filter((payment: Payment) => !payment.isPaid)
      .reduce((sum: number, payment: Payment) => sum + payment.amount, 0);
    const totalDebt = debtPayments.reduce((sum: number, p: Payment) => sum + p.amount, 0);
    const currentSavings = Math.max(
      0,
      state.incomes.reduce((sum: number, income: Income) => sum + income.amount, 0) -
        state.payments
          .filter((payment: Payment) => payment.isPaid)
          .reduce((sum: number, payment: Payment) => sum + payment.amount, 0)
    );
    const health = calculateFinancialHealthScore({
      monthlyIncome,
      monthlyExpenses,
      totalDebt,
      currentSavings,
    });
    setHealthScore(health);

    // Harcama özeti
    const budgets = await loadBudgets();
    const budgetMap = getBudgetMap(budgets);
    const expense = getCurrentMonthExpenseSummary(state.payments, budgetMap);
    setExpenseSummary(expense);
  };

  // Yenileme fonksiyonu
  const onRefresh = async () => {
    setRefreshing(true);
    // Veri yenileme işlemi (şu an için sadece animasyon)
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <ScreenContainer>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Başlık ve Hızlı Eylem Butonları */}
        <View className="mb-6 flex-row items-start justify-between">
          <View className="flex-1">
            <Text className="text-3xl font-bold text-foreground">{t("home.title")}</Text>
            <Text className="text-base text-muted mt-1">
              {t("home.subtitle")}
            </Text>
          </View>
          
          {/* Hızlı Eylem Butonları */}
          <View className="flex-row gap-2 ml-3">
            {/* Yeni Ödeme Ekle */}
            <TouchableOpacity
              onPress={() => {
                if (Platform.OS !== "web") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                router.push("/add-payment" as any);
              }}
              className="bg-primary rounded-full w-12 h-12 items-center justify-center"
              activeOpacity={0.8}
            >
              <IconSymbol name="plus" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Yeni Gelir Ekle */}
            <TouchableOpacity
              onPress={() => {
                if (Platform.OS !== "web") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                router.push("/add-income" as any);
              }}
              className="bg-success rounded-full w-12 h-12 items-center justify-center"
              activeOpacity={0.8}
            >
              <IconSymbol name="plus" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Harcama Ekle (FAB) */}
            <TouchableOpacity
              onPress={() => {
                if (Platform.OS !== "web") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                router.push("/add-expense" as any);
              }}
              className="bg-warning rounded-full w-12 h-12 items-center justify-center"
              activeOpacity={0.8}
            >
              <IconSymbol name="plus" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Özet Kartı */}
        <SummaryCard
          totalPayments={totalPayments}
          totalIncome={totalIncome}
          currency={state.settings.currency}
        />

        {/* FIRE Özet Kartı */}
        {fireSummary && (
          <View className="mt-4">
            <FireOverviewCard
              summary={fireSummary}
              currency={state.settings.currency}
            />
          </View>
        )}

        {/* Borç Özet Kartı */}
        {debtSummary && (
          <View className="mt-4">
            <DebtOverviewCard
              summary={debtSummary}
              currency={state.settings.currency}
            />
          </View>
        )}

        {/* Harcama Özeti Kartı (Yeni) */}
        <View className="mt-4">
          <ExpenseSummaryCardNew />
        </View>

        {/* Finansal Sağlık Skoru Kartı */}
        {healthScore && (
          <View className="mt-4">
            <HealthScoreCard score={healthScore} />
          </View>
        )}

        {/* Yaklaşan Ödemeler Başlığı */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-xl font-bold text-foreground">
            {t("home.upcomingPayments")}
          </Text>
          {upcomingPayments.length > 0 && (
            <TouchableOpacity onPress={() => router.push("/(tabs)/payments")}>
              <Text className="text-sm text-primary font-medium">{t("common.viewAll")}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Yaklaşan Ödemeler Listesi */}
        {upcomingPayments.length > 0 ? (
          <View>
            {upcomingPayments.map((payment) => (
              <PaymentCard
                key={payment.id}
                payment={payment}
                onPress={() => router.push(`/payment-detail?id=${payment.id}` as any)}
                currency={state.settings.currency}
              />
            ))}
          </View>
        ) : (
          <View className="bg-surface rounded-2xl p-8 items-center justify-center border border-border">
            <Text className="text-muted text-center text-base">
              {t("home.noUpcomingPayments")}
            </Text>
          </View>
        )}

        {/* Test Verileri Yükle Butonu */}
        <View className="mt-8">
          <TouchableOpacity
            className="bg-muted/20 rounded-2xl p-4 items-center active:opacity-80 border border-border"
            onPress={async () => {
              await seedData();
              onRefresh();
            }}
          >
            <Text className="text-foreground font-semibold text-base">
              {t("home.loadTestData")}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>


    </ScreenContainer>
  );
}
