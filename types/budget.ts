/**
 * Bütçe Veri Tipleri
 */

import { PaymentCategory } from "@/types";

/**
 * Bütçe limiti
 */
export interface Budget {
  /** Kategori */
  category: PaymentCategory;
  /** Aylık limit (TL) */
  monthlyLimit: number;
  /** Aktif mi? */
  isActive: boolean;
}

/**
 * Kategori bazlı harcama özeti
 */
export interface CategoryExpense {
  /** Kategori */
  category: PaymentCategory;
  /** Toplam harcama */
  amount: number;
  /** Ödeme sayısı */
  count: number;
  /** Yüzde (toplam harcama içindeki pay) */
  percentage: number;
}

/**
 * Aylık harcama özeti
 */
export interface MonthlyExpenseSummary {
  /** Ay (YYYY-MM formatında) */
  month: string;
  /** Toplam harcama */
  totalExpense: number;
  /** Kategori bazlı harcamalar */
  byCategory: CategoryExpense[];
  /** Bütçe aşımı var mı? */
  hasOverBudget: boolean;
  /** Bütçe aşan kategoriler */
  overBudgetCategories: PaymentCategory[];
}

/**
 * Bütçe durumu
 */
export interface BudgetStatus {
  /** Kategori */
  category: PaymentCategory;
  /** Bütçe limiti */
  limit: number;
  /** Harcanan tutar */
  spent: number;
  /** Kalan tutar */
  remaining: number;
  /** Kullanım yüzdesi */
  percentage: number;
  /** Bütçe aşıldı mı? */
  isOverBudget: boolean;
}
