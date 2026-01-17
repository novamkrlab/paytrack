/**
 * İstatistikler Ekranı
 * Kategori bazlı harcama analizi ve bütçe durumu
 */

import { ScrollView, Text, View, RefreshControl } from "react-native";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { CategoryPieChart } from "@/components/charts/pie-chart";
import { BudgetStatusCard } from "@/components/budget/budget-status-card";
import { useApp } from "@/lib/app-context";
import { useTranslation } from "react-i18next";
import { useColors } from "@/hooks/use-colors";
import { getCurrentMonthCategoryExpenses } from "@/services/category-statistics-service";
import { getCurrentMonthBudgets } from "@/services/category-budget-service";
import { loadCategories } from "@/services/category-service";
import type { CategoryExpenseData } from "@/services/category-statistics-service";
import type { CategoryBudget } from "@/types/category-budget";
import type { Category } from "@/types/category";

export default function StatisticsScreen() {
  const { state } = useApp();
  const { t } = useTranslation();
  const colors = useColors();

  const [refreshing, setRefreshing] = useState(false);
  const [categoryExpenses, setCategoryExpenses] = useState<CategoryExpenseData[]>([]);
  const [budgets, setBudgets] = useState<CategoryBudget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [state.expenses]);

  const loadData = async () => {
    try {
      const [loadedCategories, expenseData, budgetData] = await Promise.all([
        loadCategories(),
        getCurrentMonthCategoryExpenses(state.expenses),
        getCurrentMonthBudgets(state.expenses),
      ]);

      setCategories(loadedCategories);
      setCategoryExpenses(expenseData);
      setBudgets(budgetData);
    } catch (error) {
      console.error("İstatistik yükleme hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
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

  // Toplam harcama
  const totalExpenses = categoryExpenses.reduce((sum, item) => sum + item.totalAmount, 0);

  // Mevcut ay bilgisi
  const now = new Date();
  const monthNames = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
  ];
  const currentMonthName = monthNames[now.getMonth()];
  const currentYear = now.getFullYear();

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
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        <View className="p-4 gap-6">
          {/* Başlık */}
          <View>
            <Text className="text-3xl font-bold text-foreground">İstatistikler</Text>
            <Text className="text-sm text-muted mt-1">
              {currentMonthName} {currentYear} - Harcama Analizi
            </Text>
          </View>

          {/* Toplam Harcama Kartı */}
          <View className="bg-primary/10 border border-primary/20 rounded-2xl p-4">
            <Text className="text-sm text-muted mb-1">Bu Ay Toplam Harcama</Text>
            <Text className="text-3xl font-bold text-primary">
              {totalExpenses.toLocaleString("tr-TR")} ₺
            </Text>
            {categoryExpenses.length > 0 && (
              <Text className="text-xs text-muted mt-2">
                {categoryExpenses.length} farklı kategoride harcama
              </Text>
            )}
          </View>

          {/* Kategori Dağılımı - Pasta Grafik */}
          {categoryExpenses.length > 0 ? (
            <CategoryPieChart
              data={categoryExpenses}
              title="Kategori Bazlı Harcama Dağılımı"
            />
          ) : (
            <View className="bg-surface rounded-2xl p-8 items-center">
              <Text className="text-4xl mb-2">📊</Text>
              <Text className="text-base font-semibold text-foreground mb-1">
                Henüz Harcama Yok
              </Text>
              <Text className="text-sm text-muted text-center">
                Bu ay henüz harcama eklemediniz. Harcama ekledikçe burada kategori bazlı dağılımı görebileceksiniz.
              </Text>
            </View>
          )}

          {/* Bütçe Durumu */}
          {budgets.length > 0 && (
            <View className="gap-4">
              <Text className="text-xl font-bold text-foreground">Bütçe Durumu</Text>
              {budgets.map((budget) => {
                const categoryInfo = getCategoryInfo(budget.categoryId);
                return (
                  <BudgetStatusCard
                    key={budget.id}
                    budget={budget}
                    categoryName={categoryInfo.name}
                    categoryIcon={categoryInfo.icon}
                    categoryColor={categoryInfo.color}
                  />
                );
              })}
            </View>
          )}

          {/* Bütçe Ayarı Yok Mesajı */}
          {budgets.length === 0 && (
            <View className="bg-surface rounded-2xl p-6 items-center">
              <Text className="text-4xl mb-2">💰</Text>
              <Text className="text-base font-semibold text-foreground mb-1">
                Bütçe Belirleyin
              </Text>
              <Text className="text-sm text-muted text-center mb-4">
                Kategoriler için aylık bütçe limiti belirleyerek harcamalarınızı kontrol altında tutun.
              </Text>
              <Text className="text-xs text-primary">
                Ayarlar → Bütçe Ayarları'ndan bütçe belirleyebilirsiniz
              </Text>
            </View>
          )}

          {/* Boşluk (Tab bar için) */}
          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
