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
  category: string; // Kategori ID (cat_food, cat_transport vb.) veya eski enum değeri
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
  category: string; // Kategori ID veya eski enum değeri
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
 * Kategori İkonları (Emoji)
 */
export const CATEGORY_ICON_MAP: Record<ExpenseCategory, string> = {
  // Zorunlu
  [ExpenseCategory.RENT]: "🏠", // Ev
  [ExpenseCategory.ELECTRICITY]: "⚡", // Şimşek
  [ExpenseCategory.WATER]: "💧", // Damla
  [ExpenseCategory.GAS]: "🔥", // Ateş
  [ExpenseCategory.PHONE_INTERNET]: "📱", // Telefon
  [ExpenseCategory.TRANSPORTATION]: "🚗", // Araba
  [ExpenseCategory.GROCERIES]: "🛒", // Alışveriş Sepeti
  
  // İstek
  [ExpenseCategory.ENTERTAINMENT]: "🎬", // Sinema
  [ExpenseCategory.CLOTHING]: "👕", // T-shirt
  [ExpenseCategory.DINING_OUT]: "☕", // Kahve
  [ExpenseCategory.GIFTS]: "🎁", // Hediye
  [ExpenseCategory.HOBBIES]: "🎮", // Oyun
  [ExpenseCategory.TRAVEL]: "✈️", // Uçak
  
  // Diğer
  [ExpenseCategory.HEALTHCARE]: "💊", // İlaç
  [ExpenseCategory.EDUCATION]: "📚", // Kitap
  [ExpenseCategory.MAINTENANCE]: "🔧", // Anahtar
  [ExpenseCategory.OTHER]: "💵", // Para
};

/**
 * Kategori tipini döner (yeni sistem için)
 */
export function getExpenseType(category: string): ExpenseType {
  // Yeni kategori ID'leri için
  if (category.startsWith('cat_')) {
    // Varsayılan olarak OTHER döndür, gerçek mapping başka bir yerde
    return ExpenseType.OTHER;
  }
  // Eski enum değerleri için
  return CATEGORY_TYPE_MAP[category as ExpenseCategory] || ExpenseType.OTHER;
}

/**
 * Kategori ikonunu döner (yeni sistem için)
 */
export function getCategoryIcon(category: string): string {
  // Yeni kategori ID'leri için - kategori objesinden alınmalı
  if (category.startsWith('cat_')) {
    return "💵"; // Varsayılan
  }
  // Eski enum değerleri için
  return CATEGORY_ICON_MAP[category as ExpenseCategory] || "💵";
}

/**
 * Kategorileri tipe göre filtreler
 */
export function getCategoriesByType(type: ExpenseType): ExpenseCategory[] {
  return Object.entries(CATEGORY_TYPE_MAP)
    .filter(([_, t]) => t === type)
    .map(([cat, _]) => cat as ExpenseCategory);
}
