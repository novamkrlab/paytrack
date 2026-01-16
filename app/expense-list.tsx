/**
 * Harcama Listesi Ekranı
 */

import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useApp } from "@/lib/app-context";
import { useColors } from "@/hooks/use-colors";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "@/utils/currency-helpers";
import { getCurrentMonthExpenses } from "@/utils/expense-helpers";
import type { Expense } from "@/types/expense";
import { router } from "expo-router";

export default function ExpenseListScreen() {
  const { t } = useTranslation();
  const { state, deleteExpense } = useApp();
  const colors = useColors();

  const expenses = getCurrentMonthExpenses(state.expenses);

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
              <View
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: typeColor }}
              />
              <Text className="text-base font-semibold text-foreground">
                {item.name}
              </Text>
            </View>
            <Text className="text-xs text-muted">
              {t(`expenseCategories.${item.category}`)} • {item.date}
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
        <View className="mb-6">
          <Text className="text-2xl font-bold text-foreground">
            {t("expenses.title")}
          </Text>
          <Text className="text-sm text-muted mt-1">
            Bu ay {expenses.length} harcama
          </Text>
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
