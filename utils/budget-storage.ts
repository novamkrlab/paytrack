/**
 * Bütçe Depolama Fonksiyonları
 * AsyncStorage kullanarak bütçe verilerini saklar
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { PaymentCategory } from "@/types";
import type { Budget, BudgetStatus } from "@/types/budget";

const BUDGET_STORAGE_KEY = "@paytrack_budgets";

/**
 * Tüm bütçeleri yükler
 */
export async function loadBudgets(): Promise<Budget[]> {
  try {
    const data = await AsyncStorage.getItem(BUDGET_STORAGE_KEY);
    if (!data) return getDefaultBudgets();
    return JSON.parse(data);
  } catch (error) {
    console.error("Bütçe yükleme hatası:", error);
    return getDefaultBudgets();
  }
}

/**
 * Bütçeleri kaydeder
 */
export async function saveBudgets(budgets: Budget[]): Promise<void> {
  try {
    await AsyncStorage.setItem(BUDGET_STORAGE_KEY, JSON.stringify(budgets));
  } catch (error) {
    console.error("Bütçe kaydetme hatası:", error);
    throw error;
  }
}

/**
 * Varsayılan bütçeleri döner (tüm kategoriler için 0 limit)
 */
export function getDefaultBudgets(): Budget[] {
  return [
    {
      category: PaymentCategory.CREDIT_CARD,
      monthlyLimit: 0,
      isActive: false,
    },
    {
      category: PaymentCategory.LOAN,
      monthlyLimit: 0,
      isActive: false,
    },
    {
      category: PaymentCategory.OTHER,
      monthlyLimit: 0,
      isActive: false,
    },
  ];
}

/**
 * Belirli bir kategori için bütçeyi günceller
 */
export async function updateBudget(
  category: PaymentCategory,
  monthlyLimit: number,
  isActive: boolean
): Promise<void> {
  const budgets = await loadBudgets();
  const index = budgets.findIndex((b) => b.category === category);

  if (index >= 0) {
    budgets[index] = { category, monthlyLimit, isActive };
  } else {
    budgets.push({ category, monthlyLimit, isActive });
  }

  await saveBudgets(budgets);
}

/**
 * Bütçe durumunu hesaplar
 * @param budget Bütçe
 * @param spent Harcanan tutar
 * @returns Bütçe durumu
 */
export function calculateBudgetStatus(
  budget: Budget,
  spent: number
): BudgetStatus {
  const remaining = budget.monthlyLimit - spent;
  const percentage =
    budget.monthlyLimit > 0 ? (spent / budget.monthlyLimit) * 100 : 0;
  const isOverBudget = spent > budget.monthlyLimit;

  return {
    category: budget.category,
    limit: budget.monthlyLimit,
    spent,
    remaining,
    percentage,
    isOverBudget,
  };
}

/**
 * Bütçe Map'ini döner (kategori → limit)
 */
export function getBudgetMap(budgets: Budget[]): Map<PaymentCategory, number> {
  const map = new Map<PaymentCategory, number>();
  for (const budget of budgets) {
    if (budget.isActive) {
      map.set(budget.category, budget.monthlyLimit);
    }
  }
  return map;
}
