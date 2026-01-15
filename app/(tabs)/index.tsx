/**
 * Ana Ekran (Home)
 * Aylık özet ve yaklaşan ödemeler
 */

import { ScrollView, Text, View, TouchableOpacity, RefreshControl } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { seedData } from "@/scripts/seed-data";
import { ScreenContainer } from "@/components/screen-container";
import { SummaryCard } from "@/components/summary-card";
import { PaymentCard } from "@/components/payment-card";
import { useApp } from "@/lib/app-context";
import {
  getUpcomingPayments,
  calculateMonthlyPaymentTotal,
  calculateMonthlyIncomeTotal,
} from "@/utils/helpers";
import { useTranslation } from "react-i18next";

export default function HomeScreen() {
  const router = useRouter();
  const { state } = useApp();
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = useState(false);

  // Mevcut ay bilgileri
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // Aylık toplamlar
  const totalPayments = calculateMonthlyPaymentTotal(state.payments, currentYear, currentMonth);
  const totalIncome = calculateMonthlyIncomeTotal(state.incomes, currentYear, currentMonth);

  // Yaklaşan ödemeler (önümüzdeki 7 gün)
  const upcomingPayments = getUpcomingPayments(state.payments);

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
        {/* Başlık */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground">{t("home.title")}</Text>
          <Text className="text-base text-muted mt-1">
            {t("home.subtitle")}
          </Text>
        </View>

        {/* Özet Kartı */}
        <SummaryCard
          totalPayments={totalPayments}
          totalIncome={totalIncome}
          currency={state.settings.currency}
        />

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

        {/* Hızlı Eylem Butonları */}
        <View className="mt-8 gap-3">
          <TouchableOpacity
            className="bg-primary rounded-2xl p-4 items-center active:opacity-80"
            onPress={() => {
              router.push("/add-payment" as any);
            }}
          >
            <Text className="text-background font-semibold text-base">
              {t("payments.addPayment")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-success rounded-2xl p-4 items-center active:opacity-80"
            onPress={() => {
              router.push("/add-income" as any);
            }}
          >
            <Text className="text-background font-semibold text-base">
              {t("incomes.addIncome")}
            </Text>
          </TouchableOpacity>

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
