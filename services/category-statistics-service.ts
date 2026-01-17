/**
 * Kategori İstatistik Servisi
 * Grafik verileri hesaplama
 */

import type { Expense } from "@/types/expense";
import type { Category } from "@/types/category";
import { loadCategories } from "./category-service";

export interface CategoryExpenseData {
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  totalAmount: number;
  percentage: number;
  expenseCount: number;
}

export interface MonthlyTrendData {
  month: string; // "2026-01", "2026-02" vb.
  monthName: string; // "Ocak", "Şubat" vb.
  totalAmount: number;
  categoryBreakdown: {
    categoryId: string;
    categoryName: string;
    amount: number;
  }[];
}

/**
 * Belirli bir ay için kategori bazlı harcama dağılımını hesapla
 */
export async function calculateCategoryExpenses(
  expenses: Expense[],
  month: string // YYYY-MM formatında
): Promise<CategoryExpenseData[]> {
  const categories = await loadCategories();
  
  // Bu aya ait harcamaları filtrele
  const monthExpenses = expenses.filter((expense) => {
    const expenseMonth = expense.date.substring(0, 7); // "2026-01-15" -> "2026-01"
    return expenseMonth === month;
  });

  // Toplam harcamayı hesapla
  const totalAmount = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Her kategori için harcama toplamını hesapla
  const categoryData: CategoryExpenseData[] = [];

  for (const category of categories) {
    // Harcamaları category ID ile filtrele
    const categoryExpenses = monthExpenses.filter((expense) => {
      return expense.category === category.id;
    });

    const categoryTotal = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const percentage = totalAmount > 0 ? (categoryTotal / totalAmount) * 100 : 0;

    // Sadece harcaması olan kategorileri ekle
    if (categoryTotal > 0) {
      categoryData.push({
        categoryId: category.id,
        categoryName: category.name,
        categoryIcon: category.icon,
        categoryColor: category.color,
        totalAmount: categoryTotal,
        percentage,
        expenseCount: categoryExpenses.length,
      });
    }
  }

  // Harcama miktarına göre sırala (en yüksekten en düşüğe)
  return categoryData.sort((a, b) => b.totalAmount - a.totalAmount);
}

/**
 * Son N ay için aylık trend verilerini hesapla
 */
export async function calculateMonthlyTrends(
  expenses: Expense[],
  monthCount: number = 6
): Promise<MonthlyTrendData[]> {
  const categories = await loadCategories();
  const trends: MonthlyTrendData[] = [];

  const now = new Date();
  const monthNames = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
  ];

  // Son N ayı oluştur
  for (let i = monthCount - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const monthName = monthNames[date.getMonth()];

    // Bu aya ait harcamaları filtrele
    const monthExpenses = expenses.filter((expense) => {
      const expenseMonth = expense.date.substring(0, 7);
      return expenseMonth === month;
    });

    const totalAmount = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Kategori bazlı dağılım
    const categoryBreakdown: { categoryId: string; categoryName: string; amount: number }[] = [];
    
    for (const category of categories) {
      // Harcamaları category ID ile filtrele
      const categoryExpenses = monthExpenses.filter((expense) => expense.category === category.id);
      const categoryTotal = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);

      if (categoryTotal > 0) {
        categoryBreakdown.push({
          categoryId: category.id,
          categoryName: category.name,
          amount: categoryTotal,
        });
      }
    }

    trends.push({
      month,
      monthName,
      totalAmount,
      categoryBreakdown,
    });
  }

  return trends;
}

/**
 * Geçerli ay için kategori harcama verilerini al
 */
export async function getCurrentMonthCategoryExpenses(
  expenses: Expense[]
): Promise<CategoryExpenseData[]> {
  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  return calculateCategoryExpenses(expenses, month);
}

/**
 * En çok harcama yapılan top N kategoriyi al
 */
export async function getTopCategories(
  expenses: Expense[],
  month: string,
  topN: number = 5
): Promise<CategoryExpenseData[]> {
  const categoryData = await calculateCategoryExpenses(expenses, month);
  return categoryData.slice(0, topN);
}
