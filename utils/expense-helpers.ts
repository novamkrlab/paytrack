/**
 * Harcama Yardımcı Fonksiyonları
 */

import type {
  Expense,
  ExpenseCategory,
  CategoryExpenseSummary,
  TypeExpenseSummary,
  MonthlyExpenseSummary,
} from "@/types/expense";
import { ExpenseType } from "@/types/expense";
import { getExpenseType, getCategoriesByType } from "@/types/expense";

/**
 * Belirli bir ay için harcamaları filtreler
 */
export function getExpensesForMonth(
  expenses: Expense[],
  year: number,
  month: number
): Expense[] {
  return expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return (
      expenseDate.getFullYear() === year &&
      expenseDate.getMonth() + 1 === month
    );
  });
}

/**
 * Mevcut ay için harcamaları getirir
 */
export function getCurrentMonthExpenses(expenses: Expense[]): Expense[] {
  const now = new Date();
  return getExpensesForMonth(expenses, now.getFullYear(), now.getMonth() + 1);
}

/**
 * Kategori bazlı harcama özeti hesaplar
 */
export function calculateCategoryExpenseSummary(
  expenses: Expense[]
): CategoryExpenseSummary[] {
  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Kategorilere göre grupla
  const categoryMap = new Map<string, { amount: number; count: number }>();

  for (const expense of expenses) {
    const existing = categoryMap.get(expense.category) || { amount: 0, count: 0 };
    categoryMap.set(expense.category, {
      amount: existing.amount + expense.amount,
      count: existing.count + 1,
    });
  }

  // CategoryExpenseSummary dizisine dönüştür
  const summaries: CategoryExpenseSummary[] = [];
  for (const [category, data] of categoryMap.entries()) {
    summaries.push({
      category,
      type: getExpenseType(category),
      amount: data.amount,
      count: data.count,
      percentage: totalAmount > 0 ? (data.amount / totalAmount) * 100 : 0,
    });
  }

  // Tutara göre sırala (en yüksek önce)
  return summaries.sort((a, b) => b.amount - a.amount);
}

/**
 * Tip bazlı harcama özeti hesaplar (Zorunlu vs İstek)
 */
export function calculateTypeExpenseSummary(
  expenses: Expense[]
): TypeExpenseSummary[] {
  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
  const categoryExpenses = calculateCategoryExpenseSummary(expenses);

  // Tiplere göre grupla
  const typeMap = new Map<ExpenseType, { amount: number; count: number; categories: CategoryExpenseSummary[] }>();

  for (const catExpense of categoryExpenses) {
    const existing = typeMap.get(catExpense.type) || { amount: 0, count: 0, categories: [] };
    typeMap.set(catExpense.type, {
      amount: existing.amount + catExpense.amount,
      count: existing.count + catExpense.count,
      categories: [...existing.categories, catExpense],
    });
  }

  // TypeExpenseSummary dizisine dönüştür
  const summaries: TypeExpenseSummary[] = [];
  for (const [type, data] of typeMap.entries()) {
    summaries.push({
      type,
      amount: data.amount,
      count: data.count,
      percentage: totalAmount > 0 ? (data.amount / totalAmount) * 100 : 0,
      categories: data.categories,
    });
  }

  // Tutara göre sırala
  return summaries.sort((a, b) => b.amount - a.amount);
}

/**
 * Aylık harcama özetini hesaplar
 */
export function calculateMonthlyExpenseSummary(
  expenses: Expense[],
  year: number,
  month: number
): MonthlyExpenseSummary {
  const monthExpenses = getExpensesForMonth(expenses, year, month);

  const totalAmount = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const essentialAmount = monthExpenses
    .filter((e) => e.type === ExpenseType.ESSENTIAL)
    .reduce((sum, e) => sum + e.amount, 0);
  const discretionaryAmount = monthExpenses
    .filter((e) => e.type === ExpenseType.DISCRETIONARY)
    .reduce((sum, e) => sum + e.amount, 0);
  const otherAmount = monthExpenses
    .filter((e) => e.type === ExpenseType.OTHER)
    .reduce((sum, e) => sum + e.amount, 0);

  const byType = calculateTypeExpenseSummary(monthExpenses);
  const byCategory = calculateCategoryExpenseSummary(monthExpenses);

  return {
    month: `${year}-${String(month).padStart(2, "0")}`,
    totalAmount,
    essentialAmount,
    discretionaryAmount,
    otherAmount,
    byType,
    byCategory,
  };
}

/**
 * Mevcut ay için harcama özetini hesaplar
 */
export function getCurrentMonthExpenseSummary(
  expenses: Expense[]
): MonthlyExpenseSummary {
  const now = new Date();
  return calculateMonthlyExpenseSummary(
    expenses,
    now.getFullYear(),
    now.getMonth() + 1
  );
}

/**
 * Son N ay için harcama trendini hesaplar
 */
export function getExpenseTrend(
  expenses: Expense[],
  monthCount: number = 6
): { month: string; essential: number; discretionary: number; other: number; total: number }[] {
  const now = new Date();
  const trend: { month: string; essential: number; discretionary: number; other: number; total: number }[] = [];

  for (let i = monthCount - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    const summary = calculateMonthlyExpenseSummary(expenses, year, month);

    trend.push({
      month: summary.month,
      essential: summary.essentialAmount,
      discretionary: summary.discretionaryAmount,
      other: summary.otherAmount,
      total: summary.totalAmount,
    });
  }

  return trend;
}
