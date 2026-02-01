/**
 * Kategori Bütçe Yönetim Servisi
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import type { CategoryBudget, CategoryBudgetSettings, BudgetAlert } from "@/types/category-budget";
import type { Expense } from "@/types/expense";
import { loadCategories } from "./category-service";

const STORAGE_KEY = "@category_budgets";

/**
 * Kategori bütçe ayarlarını yükle
 */
export async function loadBudgetSettings(): Promise<CategoryBudgetSettings[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error("Error loading budget settings:", error);
    return [];
  }
}

/**
 * Kategori bütçe ayarlarını kaydet
 */
export async function saveBudgetSettings(settings: CategoryBudgetSettings[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error("Error saving budget settings:", error);
    throw error;
  }
}

/**
 * Tek bir kategori için bütçe ayarını güncelle
 */
export async function updateCategoryBudget(
  categoryId: string,
  monthlyLimit: number,
  enabled: boolean = true
): Promise<void> {
  const settings = await loadBudgetSettings();
  const existingIndex = settings.findIndex((s) => s.categoryId === categoryId);

  const newSetting: CategoryBudgetSettings = {
    categoryId,
    monthlyLimit,
    enabled,
    alertAt80Percent: true,
    alertAt100Percent: true,
  };

  if (existingIndex >= 0) {
    settings[existingIndex] = newSetting;
  } else {
    settings.push(newSetting);
  }

  await saveBudgetSettings(settings);
}

/**
 * Kategori bütçe ayarını sil
 */
export async function deleteCategoryBudget(categoryId: string): Promise<void> {
  const settings = await loadBudgetSettings();
  const filtered = settings.filter((s) => s.categoryId !== categoryId);
  await saveBudgetSettings(filtered);
}

/**
 * Belirli bir ay için kategori bütçelerini hesapla
 */
export async function calculateCategoryBudgets(
  expenses: Expense[],
  month: string // YYYY-MM formatında
): Promise<CategoryBudget[]> {
  const settings = await loadBudgetSettings();
  const categories = await loadCategories();
  
  // Sadece aktif bütçeleri işle
  const activeSettings = settings.filter((s) => s.enabled);

  const budgets: CategoryBudget[] = [];

  for (const setting of activeSettings) {
    // Bu kategoriye ait harcamaları filtrele
    const categoryExpenses = expenses.filter((expense) => {
      // Expense'in tarihini kontrol et (YYYY-MM formatına dönüştür)
      const expenseMonth = expense.date.substring(0, 7); // "2026-01-15" -> "2026-01"
      // Hem ay hem de kategori eşleşmesini kontrol et
      return expenseMonth === month && expense.category === setting.categoryId;
    });

    // Toplam harcamayı hesapla
    const spent = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const remaining = Math.max(0, setting.monthlyLimit - spent);
    const percentage = setting.monthlyLimit > 0 
      ? Math.min(100, (spent / setting.monthlyLimit) * 100) 
      : 0;
    const isOverBudget = spent > setting.monthlyLimit;

    // Kategori adını bul
    const category = categories.find((c) => c.id === setting.categoryId);

    budgets.push({
      id: `budget_${setting.categoryId}_${month}`,
      categoryId: setting.categoryId,
      monthlyLimit: setting.monthlyLimit,
      month,
      spent,
      remaining,
      percentage,
      isOverBudget,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  return budgets;
}

/**
 * Bütçe uyarılarını kontrol et
 */
export async function checkBudgetAlerts(
  expenses: Expense[],
  month: string
): Promise<BudgetAlert[]> {
  const budgets = await calculateCategoryBudgets(expenses, month);
  const settings = await loadBudgetSettings();
  const categories = await loadCategories();
  const alerts: BudgetAlert[] = [];

  for (const budget of budgets) {
    const setting = settings.find((s) => s.categoryId === budget.categoryId);
    const category = categories.find((c) => c.id === budget.categoryId);

    if (!setting || !category) continue;

    // %100 aşım kontrolü
    if (setting.alertAt100Percent && budget.percentage >= 100) {
      alerts.push({
        categoryId: budget.categoryId,
        categoryName: category.name,
        monthlyLimit: budget.monthlyLimit,
        spent: budget.spent,
        percentage: budget.percentage,
        alertType: "danger",
      });
    }
    // %80 uyarı kontrolü (sadece %100'ü geçmemişse)
    else if (setting.alertAt80Percent && budget.percentage >= 80 && budget.percentage < 100) {
      alerts.push({
        categoryId: budget.categoryId,
        categoryName: category.name,
        monthlyLimit: budget.monthlyLimit,
        spent: budget.spent,
        percentage: budget.percentage,
        alertType: "warning",
      });
    }
  }

  return alerts;
}

/**
 * Geçerli ay için bütçe durumunu al
 */
export async function getCurrentMonthBudgets(expenses: Expense[]): Promise<CategoryBudget[]> {
  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  return calculateCategoryBudgets(expenses, month);
}

/**
 * Tüm bütçeleri sıfırla
 */
export async function resetAllBudgets(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
