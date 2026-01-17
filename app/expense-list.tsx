/**
 * Harcama Listesi Ekranı
 */

import { View, Text, FlatList, TouchableOpacity, Alert, Pressable } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useApp } from "@/lib/app-context";
import { useColors } from "@/hooks/use-colors";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "@/utils/currency-helpers";
import { getCurrentMonthExpenses } from "@/utils/expense-helpers";
import type { Expense } from "@/types/expense";
import { router } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { loadCategories } from "@/services/category-service";
import { useState, useEffect } from "react";
import type { Category } from "@/types/category";

export default function ExpenseListScreen() {
  const { t } = useTranslation();
  const { state, deleteExpense } = useApp();
  const colors = useColors();
  const [categories, setCategories] = useState<Category[]>([]);

  const expenses = getCurrentMonthExpenses(state.expenses);

  useEffect(() => {
    loadCategories().then(setCategories);
  }, []);

  // Kategori bilgilerini al
  const getCategoryInfo = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return {
      name: category?.name || "Bilinmeyen",
      icon: category?.icon || "💵",
      color: category?.color || "#999999",
    };
  };

  const handleDelete = (expense: Expense) => {
    Alert.alert(
      t("expenses.deleteExpense"),
      `"${expense.name}" harcamasını silmek istediğinize emin misiniz?`,
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: async () => {
            await deleteExpense(expense.id);
          },
        },
      ]
    );
  };

  const renderExpenseItem = ({ item }: { item: Expense }) => {
    const typeColor =
      item.type === "essential"
        ? colors.error
        : item.type === "discretionary"
        ? colors.warning
        : colors.muted;

    return (
      <TouchableOpacity
        onPress={() => handleDelete(item)}
        className="bg-surface rounded-xl p-4 mb-3 border border-border"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <View className="flex-row items-center gap-2 mb-1">
              <Text className="text-xl">{getCategoryInfo(item.category).icon}</Text>
              <Text className="text-base font-semibold text-foreground">
                {item.name}
              </Text>
              <View
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: typeColor }}
              />
            </View>
            <Text className="text-xs text-muted">
              {getCategoryInfo(item.category).name} • {item.date}
            </Text>
            {item.notes && (
              <Text className="text-xs text-muted mt-1">{item.notes}</Text>
            )}
          </View>
          <Text className="text-lg font-bold text-foreground">
            {formatCurrency(item.amount, state.settings.currency)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenContainer>
      <View className="flex-1 p-4">
        {/* Header with Back Button */}
        <View className="flex-row items-center mb-6">
          <Pressable
            onPress={() => router.back()}
            className="mr-3"
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
          </Pressable>
          <View className="flex-1">
            <Text className="text-2xl font-bold text-foreground">
              {t("expenses.title")}
            </Text>
            <Text className="text-sm text-muted mt-1">
              Bu ay {expenses.length} harcama
            </Text>
          </View>
          <TouchableOpacity
            className="bg-primary w-12 h-12 rounded-full items-center justify-center active:opacity-80 ml-3"
            onPress={() => router.push("/add-expense" as any)}
          >
            <Text className="text-background font-bold text-2xl">+</Text>
          </TouchableOpacity>
        </View>

        {expenses.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-base text-muted text-center">
              {t("expenses.noExpenses")}
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/add-expense" as any)}
              className="mt-4 bg-primary rounded-full px-6 py-3"
            >
              <Text className="text-background font-semibold">
                {t("expenses.addExpense")}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={expenses}
            renderItem={renderExpenseItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </ScreenContainer>
  );
}
