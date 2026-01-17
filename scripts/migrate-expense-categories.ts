/**
 * Harcama Kategori Migrasyon Scripti
 * Eski ExpenseCategory enum'ını yeni Category ID sistemine dönüştürür
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

// Eski kategori enum'ı
enum OldExpenseCategory {
  RENT = "RENT",
  GROCERIES = "GROCERIES",
  UTILITIES = "UTILITIES",
  TRANSPORTATION = "TRANSPORTATION",
  ENTERTAINMENT = "ENTERTAINMENT",
  HEALTHCARE = "HEALTHCARE",
  EDUCATION = "EDUCATION",
  SHOPPING = "SHOPPING",
  DINING = "DINING",
  OTHER = "OTHER",
}

// Eski → Yeni kategori mapping
const CATEGORY_MAPPING: Record<string, string> = {
  RENT: "cat_rent",
  GROCERIES: "cat_food",
  UTILITIES: "cat_bills",
  TRANSPORTATION: "cat_transport",
  ENTERTAINMENT: "cat_entertainment",
  HEALTHCARE: "cat_health",
  EDUCATION: "cat_education",
  SHOPPING: "cat_shopping",
  DINING: "cat_restaurant",
  OTHER: "cat_other",
};

interface OldExpense {
  id: string;
  name: string;
  amount: number;
  category: string; // Eski enum değeri
  date: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

interface NewExpense extends Omit<OldExpense, "category"> {
  category: string; // Yeni category ID
}

/**
 * Harcamaları migrate et
 */
export async function migrateExpenseCategories(): Promise<{
  success: boolean;
  migratedCount: number;
  errors: string[];
}> {
  const errors: string[] = [];
  let migratedCount = 0;

  try {
    // Mevcut harcamaları yükle
    const expensesJson = await AsyncStorage.getItem("expenses");
    if (!expensesJson) {
      return { success: true, migratedCount: 0, errors: [] };
    }

    const expenses: OldExpense[] = JSON.parse(expensesJson);
    
    // Her harcamayı migrate et
    const migratedExpenses: NewExpense[] = expenses.map((expense) => {
      const oldCategory = expense.category;
      const newCategory = CATEGORY_MAPPING[oldCategory] || "cat_other";

      // Eğer kategori değiştiyse say
      if (oldCategory !== newCategory) {
        migratedCount++;
      }

      return {
        ...expense,
        category: newCategory,
      };
    });

    // Migrate edilmiş verileri kaydet
    await AsyncStorage.setItem("expenses", JSON.stringify(migratedExpenses));

    // Migration flag'i kaydet (bir daha çalışmasın)
    await AsyncStorage.setItem("expense_categories_migrated", "true");

    return { success: true, migratedCount, errors };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    errors.push(errorMessage);
    return { success: false, migratedCount, errors };
  }
}

/**
 * Migration'ın yapılıp yapılmadığını kontrol et
 */
export async function isMigrationDone(): Promise<boolean> {
  try {
    const flag = await AsyncStorage.getItem("expense_categories_migrated");
    return flag === "true";
  } catch {
    return false;
  }
}

/**
 * Migration'ı sıfırla (test için)
 */
export async function resetMigration(): Promise<void> {
  await AsyncStorage.removeItem("expense_categories_migrated");
}
