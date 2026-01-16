/**
 * Bütçe Ayarları Ekranı
 * Kategori bazlı bütçe limitleri belirleme
 */

import { View, Text, ScrollView, Pressable, TextInput, Alert, Switch } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { PaymentCategory } from "@/types";
import { loadBudgets, saveBudgets, calculateBudgetStatus } from "@/utils/budget-storage";
import { getCurrentMonthPayments, calculateCategoryExpenses } from "@/utils/expense-calculations";
import { useApp } from "@/lib/app-context";
import { formatCurrency } from "@/utils/currency-helpers";
import type { Budget, BudgetStatus } from "@/types/budget";

export default function BudgetSettingsScreen() {
  const router = useRouter();
  const colors = useColors();
  const { t } = useTranslation();
  const { state } = useApp();

  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [budgetStatuses, setBudgetStatuses] = useState<BudgetStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Bütçeleri yükle
      const loadedBudgets = await loadBudgets();
      setBudgets(loadedBudgets);

      // Mevcut ay harcamalarını hesapla
      const currentMonthPayments = getCurrentMonthPayments(state.payments);
      const categoryExpenses = calculateCategoryExpenses(currentMonthPayments);

      // Her kategori için bütçe durumunu hesapla
      const statuses: BudgetStatus[] = [];
      for (const budget of loadedBudgets) {
        const expense = categoryExpenses.find((e) => e.category === budget.category);
        const spent = expense ? expense.amount : 0;
        const status = calculateBudgetStatus(budget, spent);
        statuses.push(status);
      }
      setBudgetStatuses(statuses);
    } catch (error) {
      console.error("Bütçe yükleme hatası:", error);
      Alert.alert(t("common.error"), t("expense.budgetLoadError"));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await saveBudgets(budgets);
      Alert.alert(t("common.success"), t("expense.budgetSaved"));
      router.back();
    } catch (error) {
      console.error("Bütçe kaydetme hatası:", error);
      Alert.alert(t("common.error"), t("expense.budgetSaveError"));
    }
  };

  const updateBudget = (category: PaymentCategory, field: "monthlyLimit" | "isActive", value: number | boolean) => {
    setBudgets((prev) =>
      prev.map((b) =>
        b.category === category ? { ...b, [field]: value } : b
      )
    );
  };

  const getCategoryLabel = (category: PaymentCategory) => {
    if (category === PaymentCategory.CREDIT_CARD) return t("categories.creditCard");
    if (category === PaymentCategory.LOAN) return t("categories.loan");
    return t("categories.other");
  };

  const getCategoryColor = (category: PaymentCategory) => {
    if (category === PaymentCategory.CREDIT_CARD) return "#3B82F6"; // Blue
    if (category === PaymentCategory.LOAN) return "#EF4444"; // Red
    return "#8B5CF6"; // Purple
  };

  if (loading) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center">
          <Text className="text-muted">{t("common.loading")}</Text>
        </View>
      </ScreenContainer>
    );
  }

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
            {t("expense.budgetSettings")}
          </Text>
          <Text className="text-muted text-base">
            {t("expense.budgetSettingsDescription")}
          </Text>
        </View>

        {/* Bütçe Listesi */}
        <View className="gap-4">
          {budgets.map((budget, index) => {
            const status = budgetStatuses.find((s) => s.category === budget.category);
            const percentage = status ? status.percentage : 0;
            const isOverBudget = status ? status.isOverBudget : false;

            return (
              <View
                key={budget.category}
                className="bg-surface rounded-2xl p-4 border border-border"
              >
                {/* Kategori Başlığı */}
                <View className="flex-row items-center justify-between mb-4">
                  <View className="flex-row items-center gap-3">
                    <View
                      className="w-10 h-10 rounded-full items-center justify-center"
                      style={{ backgroundColor: getCategoryColor(budget.category) + "20" }}
                    >
                      <View
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: getCategoryColor(budget.category) }}
                      />
                    </View>
                    <Text className="text-lg font-semibold text-foreground">
                      {getCategoryLabel(budget.category)}
                    </Text>
                  </View>
                  <Switch
                    value={budget.isActive}
                    onValueChange={(value) => updateBudget(budget.category, "isActive", value)}
                    trackColor={{ false: colors.border, true: colors.primary }}
                    thumbColor={colors.background}
                  />
                </View>

                {budget.isActive && (
                  <>
                    {/* Bütçe Limiti */}
                    <View className="mb-4">
                      <Text className="text-sm font-medium text-foreground mb-2">
                        {t("expense.monthlyLimit")}
                      </Text>
                      <TextInput
                        className="bg-background border border-border rounded-lg px-4 py-3 text-foreground text-base"
                        placeholder="0"
                        keyboardType="numeric"
                        value={budget.monthlyLimit > 0 ? budget.monthlyLimit.toString() : ""}
                        onChangeText={(text) => {
                          const value = parseFloat(text) || 0;
                          updateBudget(budget.category, "monthlyLimit", value);
                        }}
                      />
                    </View>

                    {/* Bütçe Durumu */}
                    {status && budget.monthlyLimit > 0 && (
                      <View>
                        <View className="flex-row items-center justify-between mb-2">
                          <Text className="text-sm text-muted">{t("expense.spent")}</Text>
                          <Text className="text-sm font-semibold text-foreground">
                            {formatCurrency(status.spent, state.settings.currency as any)}
                          </Text>
                        </View>
                        <View className="flex-row items-center justify-between mb-2">
                          <Text className="text-sm text-muted">{t("expense.remaining")}</Text>
                          <Text
                            className={`text-sm font-semibold ${
                              isOverBudget ? "text-error" : "text-success"
                            }`}
                          >
                            {formatCurrency(status.remaining, state.settings.currency as any)}
                          </Text>
                        </View>

                        {/* İlerleme Çubuğu */}
                        <View className="mt-3">
                          <View className="flex-row items-center justify-between mb-1">
                            <Text className="text-xs text-muted">{t("expense.progress")}</Text>
                            <Text
                              className={`text-xs font-semibold ${
                                isOverBudget ? "text-error" : "text-primary"
                              }`}
                            >
                              {percentage.toFixed(0)}%
                            </Text>
                          </View>
                          <View className="h-2 bg-border rounded-full overflow-hidden">
                            <View
                              className="h-full rounded-full"
                              style={{
                                width: `${Math.min(percentage, 100)}%`,
                                backgroundColor: isOverBudget ? colors.error : colors.primary,
                              }}
                            />
                          </View>
                        </View>

                        {/* Bütçe Aşım Uyarısı */}
                        {isOverBudget && (
                          <View
                            className="mt-3 px-3 py-2 rounded-lg"
                            style={{ backgroundColor: colors.error + "10" }}
                          >
                            <Text className="text-xs font-semibold text-error">
                              ⚠️ {t("expense.budgetExceeded")}
                            </Text>
                          </View>
                        )}
                      </View>
                    )}
                  </>
                )}
              </View>
            );
          })}
        </View>

        {/* Kaydet Butonu */}
        <Pressable
          onPress={handleSave}
          className="bg-primary rounded-2xl p-4 items-center mt-6 active:opacity-80"
        >
          <Text className="text-background font-semibold text-base">{t("common.save")}</Text>
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  );
}
