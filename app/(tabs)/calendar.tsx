/**
 * Takvim Ekranı
 * Aylık takvim görünümü ve günlük detaylar
 */

import { ScrollView, Text, View } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { Calendar } from "@/components/calendar";
import { PaymentCard } from "@/components/payment-card";
import { IncomeCard } from "@/components/income-card";
import { useApp } from "@/lib/app-context";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

export default function CalendarScreen() {
  const router = useRouter();
  const { state } = useApp();
  const { t, i18n } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Seçili tarihteki ödemeler
  const selectedPayments = selectedDate
    ? state.payments.filter((p) => {
        const paymentDate = new Date(p.dueDate).toDateString();
        return paymentDate === selectedDate.toDateString();
      })
    : [];

  // Seçili tarihteki gelirler
  const selectedIncomes = selectedDate
    ? state.incomes.filter((i) => {
        const incomeDate = new Date(i.date).toDateString();
        return incomeDate === selectedDate.toDateString();
      })
    : [];

  const handleDatePress = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <ScreenContainer>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 32,
        }}
      >
        {/* Başlık */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground">{t("calendar.title")}</Text>
          <Text className="text-base text-muted mt-1">
            {t("calendar.subtitle")}
          </Text>
        </View>

        {/* Takvim */}
        <Calendar
          payments={state.payments}
          incomes={state.incomes}
          onDatePress={handleDatePress}
        />

        {/* Seçili Tarih Detayları */}
        {selectedDate && (
          <View className="mt-6">
            <Text className="text-xl font-bold text-foreground mb-4">
              {selectedDate.toLocaleDateString(i18n.language === "tr" ? "tr-TR" : "en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </Text>

            {selectedPayments.length === 0 && selectedIncomes.length === 0 && (
              <View className="bg-surface rounded-2xl p-8 items-center justify-center border border-border">
                <Text className="text-muted text-center text-base">
                  {t("calendar.noData")}
                </Text>
              </View>
            )}

            {/* Ödemeler */}
            {selectedPayments.length > 0 && (
              <View className="mb-4">
                <Text className="text-base font-semibold text-foreground mb-2">
                  {t("calendar.payments")} ({selectedPayments.length})
                </Text>
                {selectedPayments.map((payment) => (
                  <PaymentCard
                    key={payment.id}
                    payment={payment}
                    onPress={() =>
                      router.push(`/payment-detail?id=${payment.id}` as any)
                    }
                    currency={state.settings.currency}
                  />
                ))}
              </View>
            )}

            {/* Gelirler */}
            {selectedIncomes.length > 0 && (
              <View>
                <Text className="text-base font-semibold text-foreground mb-2">
                  {t("calendar.incomes")} ({selectedIncomes.length})
                </Text>
                {selectedIncomes.map((income) => (
                  <IncomeCard
                    key={income.id}
                    income={income}
                    onPress={() =>
                      router.push(`/income-detail?id=${income.id}` as any)
                    }
                    currency={state.settings.currency}
                  />
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
