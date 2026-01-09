/**
 * Gelirler Ekranı
 */

import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IncomeCard } from "@/components/income-card";
import { useApp } from "@/lib/app-context";
import { IncomeType } from "@/types";

type FilterType = "all" | IncomeType;

export default function IncomesScreen() {
  const { state } = useApp();
  const [filter, setFilter] = useState<FilterType>("all");

  const filteredIncomes = state.incomes.filter((income) => {
    if (filter === "all") return true;
    return income.type === filter;
  });

  const sortedIncomes = [...filteredIncomes].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <ScreenContainer>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 }}
      >
        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground">Gelirler</Text>
          <Text className="text-base text-muted mt-1">
            Tüm gelirlerinizi görüntüleyin
          </Text>
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
              Tümü
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
              Düzenli
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
              Düzenli Olmayan
            </Text>
          </TouchableOpacity>
        </View>

        {sortedIncomes.length > 0 ? (
          <View>
            {sortedIncomes.map((income) => (
              <IncomeCard
                key={income.id}
                income={income}
                currency={state.settings.currency}
                onPress={() => console.log("Income detail:", income.id)}
              />
            ))}
          </View>
        ) : (
          <View className="bg-surface rounded-2xl p-8 items-center justify-center border border-border">
            <Text className="text-muted text-center text-base">
              {filter === "all" ? "Henüz gelir eklenmemiş" : "Bu kategoride gelir bulunmuyor"}
            </Text>
          </View>
        )}

        <TouchableOpacity
          className="bg-success rounded-2xl p-4 items-center mt-6 active:opacity-80"
          onPress={() => console.log("Add income")}
        >
          <Text className="text-background font-semibold text-base">
            Yeni Gelir Ekle
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}
