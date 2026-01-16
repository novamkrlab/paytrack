/**
 * Harcama Hesaplama Fonksiyonları
 */

import { Payment, PaymentCategory } from "@/types";
import type { CategoryExpense, MonthlyExpenseSummary } from "@/types/budget";

/**
 * Belirli bir ay için ödemeleri filtreler
 * @param payments Tüm ödemeler
 * @param year Yıl (örn: 2024)
 * @param month Ay (1-12)
 * @returns O aya ait ödemeler
 */
export function getPaymentsForMonth(
  payments: Payment[],
  year: number,
  month: number
): Payment[] {
  return payments.filter((payment) => {
    const paymentDate = new Date(payment.dueDate);
    return (
      paymentDate.getFullYear() === year &&
      paymentDate.getMonth() + 1 === month &&
      payment.isPaid // Sadece ödenen ödemeler
    );
  });
}

/**
 * Mevcut ay için ödemeleri getirir
 * @param payments Tüm ödemeler
 * @returns Bu aya ait ödemeler
 */
export function getCurrentMonthPayments(payments: Payment[]): Payment[] {
  const now = new Date();
  return getPaymentsForMonth(payments, now.getFullYear(), now.getMonth() + 1);
}

/**
 * Kategori bazlı harcama hesaplar
 * @param payments Ödemeler
 * @returns Kategori bazlı harcama listesi
 */
export function calculateCategoryExpenses(
  payments: Payment[]
): CategoryExpense[] {
  // Toplam harcama
  const totalExpense = payments.reduce((sum, p) => sum + p.amount, 0);

  // Kategorilere göre grupla
  const categoryMap = new Map<PaymentCategory, { amount: number; count: number }>();

  for (const payment of payments) {
    const existing = categoryMap.get(payment.category) || { amount: 0, count: 0 };
    categoryMap.set(payment.category, {
      amount: existing.amount + payment.amount,
      count: existing.count + 1,
    });
  }

  // CategoryExpense dizisine dönüştür
  const categoryExpenses: CategoryExpense[] = [];
  for (const [category, data] of categoryMap.entries()) {
    categoryExpenses.push({
      category,
      amount: data.amount,
      count: data.count,
      percentage: totalExpense > 0 ? (data.amount / totalExpense) * 100 : 0,
    });
  }

  // Tutara göre sırala (en yüksek önce)
  return categoryExpenses.sort((a, b) => b.amount - a.amount);
}

/**
 * Aylık harcama özetini hesaplar
 * @param payments Tüm ödemeler
 * @param year Yıl
 * @param month Ay (1-12)
 * @param budgets Bütçe limitleri (opsiyonel)
 * @returns Aylık harcama özeti
 */
export function calculateMonthlyExpenseSummary(
  payments: Payment[],
  year: number,
  month: number,
  budgets?: Map<PaymentCategory, number>
): MonthlyExpenseSummary {
  // O aya ait ödemeleri filtrele
  const monthPayments = getPaymentsForMonth(payments, year, month);

  // Toplam harcama
  const totalExpense = monthPayments.reduce((sum, p) => sum + p.amount, 0);

  // Kategori bazlı harcamalar
  const byCategory = calculateCategoryExpenses(monthPayments);

  // Bütçe aşımı kontrolü
  let hasOverBudget = false;
  const overBudgetCategories: PaymentCategory[] = [];

  if (budgets) {
    for (const categoryExpense of byCategory) {
      const limit = budgets.get(categoryExpense.category);
      if (limit && categoryExpense.amount > limit) {
        hasOverBudget = true;
        overBudgetCategories.push(categoryExpense.category);
      }
    }
  }

  return {
    month: `${year}-${String(month).padStart(2, "0")}`,
    totalExpense,
    byCategory,
    hasOverBudget,
    overBudgetCategories,
  };
}

/**
 * Mevcut ay için harcama özetini hesaplar
 * @param payments Tüm ödemeler
 * @param budgets Bütçe limitleri (opsiyonel)
 * @returns Mevcut ay harcama özeti
 */
export function getCurrentMonthExpenseSummary(
  payments: Payment[],
  budgets?: Map<PaymentCategory, number>
): MonthlyExpenseSummary {
  const now = new Date();
  return calculateMonthlyExpenseSummary(
    payments,
    now.getFullYear(),
    now.getMonth() + 1,
    budgets
  );
}

/**
 * Son N ay için harcama trendini hesaplar
 * @param payments Tüm ödemeler
 * @param monthCount Kaç ay geriye gidilecek
 * @returns Aylık harcama listesi (en eski → en yeni)
 */
export function getExpenseTrend(
  payments: Payment[],
  monthCount: number = 6
): { month: string; amount: number }[] {
  const now = new Date();
  const trend: { month: string; amount: number }[] = [];

  for (let i = monthCount - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    const monthPayments = getPaymentsForMonth(payments, year, month);
    const amount = monthPayments.reduce((sum, p) => sum + p.amount, 0);

    trend.push({
      month: `${year}-${String(month).padStart(2, "0")}`,
      amount,
    });
  }

  return trend;
}
