/**
 * Ödemeler Ekranı
 * Tüm ödemeleri listeleme ve filtreleme
 */

import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { PaymentCard } from "@/components/payment-card";
import { useApp } from "@/lib/app-context";
import { PaymentCategory } from "@/types";

type FilterType = "all" | PaymentCategory;

export default function PaymentsScreen() {
  const router = useRouter();
  const { state } = useApp();
  const [filter, setFilter] = useState<FilterType>("all");

  // Filtrelenmiş ödemeler
  const filteredPayments = state.payments.filter((payment) => {
    if (filter === "all") return true;
    return payment.category === filter;
  });

  // Tarihe göre sıralama (yakın tarihler önce)
  const sortedPayments = [...filteredPayments].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  return (
    <ScreenContainer>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 }}
      >
        {/* Başlık */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground">Ödemeler</Text>
          <Text className="text-base text-muted mt-1">
            Tüm ödemelerinizi görüntüleyin
          </Text>
        </View>

        {/* Filtre Butonları */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
          <View className="flex-row gap-2">
            <TouchableOpacity
              className={`px-4 py-2 rounded-full ${
                filter === "all" ? "bg-primary" : "bg-surface border border-border"
              }`}
              onPress={() => setFilter("all")}
            >
              <Text
                className={`text-sm font-medium ${
                  filter === "all" ? "text-background" : "text-foreground"
                }`}
              >
                Tümü
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`px-4 py-2 rounded-full ${
                filter === PaymentCategory.CREDIT_CARD
                  ? "bg-primary"
                  : "bg-surface border border-border"
              }`}
              onPress={() => setFilter(PaymentCategory.CREDIT_CARD)}
            >
              <Text
                className={`text-sm font-medium ${
                  filter === PaymentCategory.CREDIT_CARD ? "text-background" : "text-foreground"
                }`}
              >
                Kredi Kartı
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`px-4 py-2 rounded-full ${
                filter === PaymentCategory.LOAN ? "bg-primary" : "bg-surface border border-border"
              }`}
              onPress={() => setFilter(PaymentCategory.LOAN)}
            >
              <Text
                className={`text-sm font-medium ${
                  filter === PaymentCategory.LOAN ? "text-background" : "text-foreground"
                }`}
              >
                Kredi
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`px-4 py-2 rounded-full ${
                filter === PaymentCategory.OTHER ? "bg-primary" : "bg-surface border border-border"
              }`}
              onPress={() => setFilter(PaymentCategory.OTHER)}
            >
              <Text
                className={`text-sm font-medium ${
                  filter === PaymentCategory.OTHER ? "text-background" : "text-foreground"
                }`}
              >
                Diğer
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Ödemeler Listesi */}
        {sortedPayments.length > 0 ? (
          <View>
            {sortedPayments.map((payment) => (
              <PaymentCard
                key={payment.id}
                payment={payment}
                currency={state.settings.currency}
                onPress={() => {
                  console.log("Payment detail:", payment.id);
                }}
              />
            ))}
          </View>
        ) : (
          <View className="bg-surface rounded-2xl p-8 items-center justify-center border border-border">
            <Text className="text-muted text-center text-base">
              {filter === "all"
                ? "Henüz ödeme eklenmemiş"
                : "Bu kategoride ödeme bulunmuyor"}
            </Text>
          </View>
        )}

        {/* Ödeme Ekle Butonu */}
        <TouchableOpacity
          className="bg-primary rounded-2xl p-4 items-center mt-6 active:opacity-80"
          onPress={() => {
            router.push("/add-payment" as any);
          }}
        >
          <Text className="text-background font-semibold text-base">
            Yeni Ödeme Ekle
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}
