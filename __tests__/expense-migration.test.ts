import { describe, it, expect, beforeEach, vi } from "vitest";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { migrateExpenseCategories, isMigrationDone } from "@/scripts/migrate-expense-categories";
import type { Expense } from "@/types/expense";

// Mock AsyncStorage
vi.mock("@react-native-async-storage/async-storage", () => ({
  default: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  },
}));

describe("Expense Category Migration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should migrate old expense categories to new category IDs", async () => {
    // Mock eski harcamalar (ExpenseCategory enum ile)
    const oldExpenses: any[] = [
      {
        id: "exp1",
        amount: 1000,
        category: "RENT",
        description: "Kira",
        date: "2024-01-15",
      },
      {
        id: "exp2",
        amount: 500,
        category: "GROCERIES",
        description: "Market",
        date: "2024-01-16",
      },
      {
        id: "exp3",
        amount: 200,
        category: "FUEL",
        description: "Benzin",
        date: "2024-01-17",
      },
    ];

    // Mock AsyncStorage responses
    (AsyncStorage.getItem as any).mockImplementation((key: string) => {
      if (key === "expenses") {
        return Promise.resolve(JSON.stringify(oldExpenses));
      }
      if (key === "expense_categories_migrated") {
        return Promise.resolve(null);
      }
      return Promise.resolve(null);
    });

    // Migration'ı çalıştır
    const result = await migrateExpenseCategories();

    // Sonuçları kontrol et
    expect(result.success).toBe(true);
    expect(result.migratedCount).toBe(3);
    expect(result.errors).toHaveLength(0);

    // AsyncStorage.setItem çağrılarını kontrol et
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "expenses",
      expect.any(String)
    );
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "expense_categories_migrated",
      "true"
    );

    // Migrate edilmiş verileri kontrol et
    const savedExpenses = JSON.parse(
      (AsyncStorage.setItem as any).mock.calls.find(
        (call: any) => call[0] === "expenses"
      )[1]
    );

    expect(savedExpenses[0].category).toBe("cat_rent");
    expect(savedExpenses[1].category).toBe("cat_food");
    expect(savedExpenses[2].category).toBe("cat_other"); // FUEL mapping yok, cat_other olur
  });

  it("should handle expenses with already migrated categories", async () => {
    // Mock karışık harcamalar (bazıları eski, bazıları yeni)
    const mixedExpenses: any[] = [
      {
        id: "exp1",
        amount: 1000,
        category: "RENT", // Eski
        description: "Kira",
        date: "2024-01-15",
      },
      {
        id: "exp2",
        amount: 500,
        category: "cat_food", // Yeni (ama mapping'de yok, sayılır)
        description: "Market",
        date: "2024-01-16",
      },
    ];

    (AsyncStorage.getItem as any).mockImplementation((key: string) => {
      if (key === "expenses") {
        return Promise.resolve(JSON.stringify(mixedExpenses));
      }
      if (key === "expense_categories_migrated") {
        return Promise.resolve(null);
      }
      return Promise.resolve(null);
    });

    const result = await migrateExpenseCategories();

    expect(result.success).toBe(true);
    // cat_food mapping'de yok, cat_other olur, 2 değişiklik
    expect(result.migratedCount).toBe(2);

    const savedExpenses = JSON.parse(
      (AsyncStorage.setItem as any).mock.calls.find(
        (call: any) => call[0] === "expenses"
      )[1]
    );

    expect(savedExpenses[0].category).toBe("cat_rent");
    expect(savedExpenses[1].category).toBe("cat_other"); // cat_food mapping'de yok
  });

  it("should handle unknown categories by mapping to cat_other", async () => {
    const unknownExpenses: any[] = [
      {
        id: "exp1",
        amount: 1000,
        category: "UNKNOWN_CATEGORY",
        description: "Bilinmeyen",
        date: "2024-01-15",
      },
    ];

    (AsyncStorage.getItem as any).mockImplementation((key: string) => {
      if (key === "expenses") {
        return Promise.resolve(JSON.stringify(unknownExpenses));
      }
      if (key === "expense_categories_migrated") {
        return Promise.resolve(null);
      }
      return Promise.resolve(null);
    });

    const result = await migrateExpenseCategories();

    expect(result.success).toBe(true);
    expect(result.migratedCount).toBe(1);

    const savedExpenses = JSON.parse(
      (AsyncStorage.setItem as any).mock.calls.find(
        (call: any) => call[0] === "expenses"
      )[1]
    );

    expect(savedExpenses[0].category).toBe("cat_other");
  });

  it("should skip migration if already done", async () => {
    (AsyncStorage.getItem as any).mockImplementation((key: string) => {
      if (key === "expense_categories_migrated") {
        return Promise.resolve("true");
      }
      return Promise.resolve(null);
    });

    const isDone = await isMigrationDone();
    expect(isDone).toBe(true);

    const result = await migrateExpenseCategories();
    expect(result.success).toBe(true);
    expect(result.migratedCount).toBe(0);
  });

  it("should handle empty expense list", async () => {
    (AsyncStorage.getItem as any).mockImplementation((key: string) => {
      if (key === "expenses") {
        return Promise.resolve(JSON.stringify([]));
      }
      if (key === "expense_categories_migrated") {
        return Promise.resolve(null);
      }
      return Promise.resolve(null);
    });

    const result = await migrateExpenseCategories();

    expect(result.success).toBe(true);
    expect(result.migratedCount).toBe(0);
    expect(result.errors).toHaveLength(0);
  });

  it("should handle null expense data", async () => {
    (AsyncStorage.getItem as any).mockImplementation((key: string) => {
      if (key === "expenses") {
        return Promise.resolve(null);
      }
      if (key === "expense_categories_migrated") {
        return Promise.resolve(null);
      }
      return Promise.resolve(null);
    });

    const result = await migrateExpenseCategories();

    expect(result.success).toBe(true);
    expect(result.migratedCount).toBe(0);
    expect(result.errors).toHaveLength(0);
  });
});
