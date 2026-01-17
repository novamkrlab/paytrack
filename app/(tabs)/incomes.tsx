/**
 * Gelirler Ekranı
 */

import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IncomeCard } from "@/components/income-card";
import { useApp } from "@/lib/app-context";
import { IncomeType } from "@/types";
import { useTranslation } from "react-i18next";

type FilterType = "all" | IncomeType;

export default function IncomesScreen() {
  const router = useRouter();
  const { state } = useApp();
  const { t } = useTranslation();
  const [filter, setFilter] = useState<FilterType>("all");

  const filteredIncomes = state.incomes.filter((income) => {
    if (filter === "all") return true;
    return income.type === filter;
  });

  // Yakın tarihten uzak tarihe sırala (en yakın tarih en üstte)
  const sortedIncomes = [...filteredIncomes].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <ScreenContainer>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 }}
      >
        <View className="mb-6 flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-3xl font-bold text-foreground">{t("incomes.title")}</Text>
            <Text className="text-base text-muted mt-1">
              {t("incomes.subtitle")}
            </Text>
          </View>
          <TouchableOpacity
            className="bg-success w-12 h-12 rounded-full items-center justify-center active:opacity-80 ml-3"
            onPress={() => router.push("/add-income" as any)}
          >
            <Text className="text-background font-bold text-2xl">+</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row gap-2 mb-6">
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
              {t("common.all")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`px-4 py-2 rounded-full ${
              filter === IncomeType.REGULAR ? "bg-primary" : "bg-surface border border-border"
            }`}
            onPress={() => setFilter(IncomeType.REGULAR)}
          >
            <Text
              className={`text-sm font-medium ${
                filter === IncomeType.REGULAR ? "text-background" : "text-foreground"
              }`}
            >
              {t("incomes.regular")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`px-4 py-2 rounded-full ${
              filter === IncomeType.IRREGULAR ? "bg-primary" : "bg-surface border border-border"
            }`}
            onPress={() => setFilter(IncomeType.IRREGULAR)}
          >
            <Text
              className={`text-sm font-medium ${
                filter === IncomeType.IRREGULAR ? "text-background" : "text-foreground"
              }`}
            >
              {t("incomes.irregular")}
            </Text>
          </TouchableOpacity>
        </View>

        {sortedIncomes.length > 0 ? (
          <View>
            {sortedIncomes.map((income, index) => (
              <IncomeCard
                key={`${income.id}-${index}`}
                income={income}
                onPress={() => router.push(`/income-detail?id=${income.id}` as any)}
                currency={state.settings.currency}
              />
            ))}
          </View>
        ) : (
          <View className="bg-surface rounded-2xl p-8 items-center justify-center border border-border">
            <Text className="text-muted text-center text-base">
              {filter === "all" ? t("incomes.noIncomes") : t("incomes.noIncomesInCategory")}
            </Text>
          </View>
        )}


      </ScrollView>
    </ScreenContainer>
  );
}
