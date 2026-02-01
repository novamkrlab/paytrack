/**
 * Takvim Ekranı
 * Aylık takvim görünümü ve günlük detaylar
 */

import { ScrollView, Text, View } from "react-native";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { Calendar } from "@/components/calendar";
import { PaymentCard } from "@/components/payment-card";
import { IncomeCard } from "@/components/income-card";
import { CategoryPieChart } from "@/components/charts/pie-chart";
import { BudgetStatusCard } from "@/components/budget/budget-status-card";
import { useApp } from "@/lib/app-context";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { calculateCategoryExpenses } from "@/services/category-statistics-service";
import { getCurrentMonthBudgets } from "@/services/category-budget-service";
import { loadCategories } from "@/services/category-service";
import type { CategoryExpenseData } from "@/services/category-statistics-service";
import type { CategoryBudget } from "@/types/category-budget";
import type { Category } from "@/types/category";

export default function CalendarScreen() {
  const router = useRouter();
  const { state } = useApp();
  const { t, i18n } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [categoryExpenses, setCategoryExpenses] = useState<CategoryExpenseData[]>([]);
  const [budgets, setBudgets] = useState<CategoryBudget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Ay değiştiğinde istatistikleri yükle
  useEffect(() => {
    loadMonthStatistics();
  }, [currentMonth, currentYear, state.expenses]);

  const loadMonthStatistics = async () => {
    try {
      const month = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`;
      const [loadedCategories, expenseData, budgetData] = await Promise.all([
        loadCategories(),
        calculateCategoryExpenses(state.expenses, month),
        getCurrentMonthBudgets(state.expenses),
      ]);

      setCategories(loadedCategories);
      setCategoryExpenses(expenseData);
      setBudgets(budgetData);
    } catch (error) {
      console.error("İstatistik yükleme hatası:", error);
    }
  };

  // Kategori bilgilerini al
  const getCategoryInfo = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return {
      name: category?.name || "Bilinmeyen",
      icon: category?.icon || "❓",
      color: category?.color || "#999999",
    };
  };

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

  const handleMonthChange = (year: number, month: number) => {
    setCurrentYear(year);
    setCurrentMonth(month);
  };

  // Seçili ayın toplam ödemeleri
  const monthlyPayments = state.payments.filter((p) => {
    const paymentDate = new Date(p.dueDate);
    return (
      paymentDate.getMonth() === currentMonth &&
      paymentDate.getFullYear() === currentYear
    );
  });

  const totalMonthlyPayments = monthlyPayments.reduce(
    (sum, p) => sum + p.amount,
    0
  );

  // Seçili ayın toplam gelirleri
  const monthlyIncomes = state.incomes.filter((i) => {
    const incomeDate = new Date(i.date);
    return (
      incomeDate.getMonth() === currentMonth &&
      incomeDate.getFullYear() === currentYear
    );
  });

  const totalMonthlyIncomes = monthlyIncomes.reduce(
    (sum, i) => sum + i.amount,
    0
  );

  // Seçili ayın toplam harcamaları
  const monthlyExpenses = state.expenses.filter((e) => {
    const expenseDate = new Date(e.date);
    return (
      expenseDate.getMonth() === currentMonth &&
      expenseDate.getFullYear() === currentYear
    );
  });

  const totalMonthlyExpenses = monthlyExpenses.reduce(
    (sum, e) => sum + e.amount,
    0
  );

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
          onMonthChange={handleMonthChange}
        />

        {/* Aylık Özet */}
        <View className="mt-6 flex-row gap-3">
          {/* Toplam Gelir */}
          <View className="flex-1 bg-success/10 rounded-2xl p-4 border border-success/20">
            <Text className="text-success text-2xl mb-1">↑</Text>
            <Text className="text-xs text-success/70 mb-1">
              {t("calendar.totalIncome")}
            </Text>
            <Text className="text-xl font-bold text-success">
              {totalMonthlyIncomes.toLocaleString()} {state.settings.currency}
            </Text>
          </View>

          {/* Toplam Ödeme */}
          <View className="flex-1 bg-error/10 rounded-2xl p-4 border border-error/20">
            <Text className="text-error text-2xl mb-1">↓</Text>
            <Text className="text-xs text-error/70 mb-1">
              {t("calendar.totalPayments")}
            </Text>
            <Text className="text-xl font-bold text-error">
              {totalMonthlyPayments.toLocaleString()} {state.settings.currency}
            </Text>
          </View>
        </View>

        {/* Toplam Harcama */}
        <View className="mt-3">
          <View className="bg-warning/10 rounded-2xl p-4 border border-warning/20">
            <Text className="text-warning text-2xl mb-1">↓</Text>
            <Text className="text-xs text-warning/70 mb-1">
              {t("calendar.totalExpenses")}
            </Text>
            <Text className="text-xl font-bold text-warning">
              {totalMonthlyExpenses.toLocaleString()} {state.settings.currency}
            </Text>
          </View>
        </View>

        {/* Kategori Bazlı Harcama Dağılımı */}
        {categoryExpenses.length > 0 && (
          <View className="mt-6">
            <Text className="text-xl font-bold text-foreground mb-4">
              {t("statistics.categoryDistribution")}
            </Text>
            <CategoryPieChart
              data={categoryExpenses}
            />
          </View>
        )}

        {/* Bütçe Durumu */}
        {budgets.length > 0 && (
          <View className="mt-6">
            <Text className="text-xl font-bold text-foreground mb-4">
              {t("statistics.budgetStatus")}
            </Text>
            {budgets.map((budget) => {
              const categoryInfo = getCategoryInfo(budget.categoryId);
              return (
                <BudgetStatusCard
                  key={budget.categoryId}
                  budget={budget}
                  categoryName={categoryInfo.name}
                  categoryIcon={categoryInfo.icon}
                  categoryColor={categoryInfo.color}
                />
              );
            })}
          </View>
        )}

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
