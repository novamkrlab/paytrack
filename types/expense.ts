/**
 * Harcama (Expense) Veri Tipleri
 * Günlük harcamaları takip etmek için (borç ödemelerinden ayrı)
 */

/**
 * Harcama Kategorileri
 */
export enum ExpenseCategory {
  // Zorunlu Giderler (Essential)
  RENT = "rent",
  ELECTRICITY = "electricity",
  WATER = "water",
  GAS = "gas",
  PHONE_INTERNET = "phone_internet",
  TRANSPORTATION = "transportation",
  GROCERIES = "groceries",
  
  // İstek Harcamaları (Discretionary)
  ENTERTAINMENT = "entertainment",
  CLOTHING = "clothing",
  DINING_OUT = "dining_out",
  GIFTS = "gifts",
  HOBBIES = "hobbies",
  TRAVEL = "travel",
  
  // Diğer
  HEALTHCARE = "healthcare",
  EDUCATION = "education",
  MAINTENANCE = "maintenance",
  OTHER = "other",
}

/**
 * Harcama Tipi (Zorunlu vs İstek)
 */
export enum ExpenseType {
  ESSENTIAL = "essential", // Zorunlu
  DISCRETIONARY = "discretionary", // İstek
  OTHER = "other",
}

/**
 * Kategori → Tip Eşleştirmesi
 */
export const CATEGORY_TYPE_MAP: Record<ExpenseCategory, ExpenseType> = {
  // Zorunlu
  [ExpenseCategory.RENT]: ExpenseType.ESSENTIAL,
  [ExpenseCategory.ELECTRICITY]: ExpenseType.ESSENTIAL,
  [ExpenseCategory.WATER]: ExpenseType.ESSENTIAL,
  [ExpenseCategory.GAS]: ExpenseType.ESSENTIAL,
  [ExpenseCategory.PHONE_INTERNET]: ExpenseType.ESSENTIAL,
  [ExpenseCategory.TRANSPORTATION]: ExpenseType.ESSENTIAL,
  [ExpenseCategory.GROCERIES]: ExpenseType.ESSENTIAL,
  
  // İstek
  [ExpenseCategory.ENTERTAINMENT]: ExpenseType.DISCRETIONARY,
  [ExpenseCategory.CLOTHING]: ExpenseType.DISCRETIONARY,
  [ExpenseCategory.DINING_OUT]: ExpenseType.DISCRETIONARY,
  [ExpenseCategory.GIFTS]: ExpenseType.DISCRETIONARY,
  [ExpenseCategory.HOBBIES]: ExpenseType.DISCRETIONARY,
  [ExpenseCategory.TRAVEL]: ExpenseType.DISCRETIONARY,
  
  // Diğer
  [ExpenseCategory.HEALTHCARE]: ExpenseType.OTHER,
  [ExpenseCategory.EDUCATION]: ExpenseType.OTHER,
  [ExpenseCategory.MAINTENANCE]: ExpenseType.OTHER,
  [ExpenseCategory.OTHER]: ExpenseType.OTHER,
};

/**
 * Harcama (Expense) Veri Yapısı
 */
export interface Expense {
  id: string;
  name: string;
  amount: number;
  category: ExpenseCategory;
  type: ExpenseType; // Otomatik hesaplanır (CATEGORY_TYPE_MAP'ten)
  date: string; // ISO 8601 format (YYYY-MM-DD)
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Kategori bazlı harcama özeti
 */
export interface CategoryExpenseSummary {
  category: ExpenseCategory;
  type: ExpenseType;
  amount: number;
  count: number;
  percentage: number;
}

/**
 * Tip bazlı harcama özeti (Zorunlu vs İstek)
 */
export interface TypeExpenseSummary {
  type: ExpenseType;
  amount: number;
  count: number;
  percentage: number;
  categories: CategoryExpenseSummary[];
}

/**
 * Aylık harcama özeti
 */
export interface MonthlyExpenseSummary {
  month: string; // YYYY-MM
  totalAmount: number;
  essentialAmount: number;
  discretionaryAmount: number;
  otherAmount: number;
  byType: TypeExpenseSummary[];
  byCategory: CategoryExpenseSummary[];
}

/**
 * Kategori tipini döner
 */
export function getExpenseType(category: ExpenseCategory): ExpenseType {
  return CATEGORY_TYPE_MAP[category] || ExpenseType.OTHER;
}

/**
 * Kategorileri tipe göre filtreler
 */
export function getCategoriesByType(type: ExpenseType): ExpenseCategory[] {
  return Object.entries(CATEGORY_TYPE_MAP)
    .filter(([_, t]) => t === type)
    .map(([cat, _]) => cat as ExpenseCategory);
}
