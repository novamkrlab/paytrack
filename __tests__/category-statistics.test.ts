import { describe, it, expect, beforeEach, vi } from "vitest";
import { calculateCategoryExpenses, getCurrentMonthCategoryExpenses } from "@/services/category-statistics-service";
import type { Expense } from "@/types/expense";

// Mock category service
vi.mock("@/services/category-service", () => ({
  loadCategories: vi.fn(() => Promise.resolve([
    { id: "cat_food", name: "Gıda", icon: "🍔", color: "#FF6B6B", isCustom: false },
    { id: "cat_transport", name: "Ulaşım", icon: "🚗", color: "#4ECDC4", isCustom: false },
    { id: "cat_rent", name: "Kira", icon: "🏠", color: "#95E1D3", isCustom: false },
  ])),
}));

describe("Category Statistics Service", () => {
  const mockExpenses: Expense[] = [
    {
      id: "exp1",
      name: "Market",
      amount: 500,
      category: "cat_food",
      date: "2026-01-15",
      type: "other" as any,
      createdAt: "2026-01-15T10:00:00Z",
      updatedAt: "2026-01-15T10:00:00Z",
    },
    {
      id: "exp2",
      name: "Benzin",
      amount: 300,
      category: "cat_transport",
      date: "2026-01-20",
      type: "other" as any,
      createdAt: "2026-01-20T10:00:00Z",
      updatedAt: "2026-01-20T10:00:00Z",
    },
    {
      id: "exp3",
      name: "Kira",
      amount: 5000,
      category: "cat_rent",
      date: "2026-01-01",
      type: "other" as any,
      createdAt: "2026-01-01T10:00:00Z",
      updatedAt: "2026-01-01T10:00:00Z",
    },
    {
      id: "exp4",
      name: "Market 2",
      amount: 200,
      category: "cat_food",
      date: "2026-01-25",
      type: "other" as any,
      createdAt: "2026-01-25T10:00:00Z",
      updatedAt: "2026-01-25T10:00:00Z",
    },
    {
      id: "exp5",
      name: "Geçen ay market",
      amount: 1000,
      category: "cat_food",
      date: "2025-12-15",
      type: "other" as any,
      createdAt: "2025-12-15T10:00:00Z",
      updatedAt: "2025-12-15T10:00:00Z",
    },
  ];

  it("should calculate category expenses for a specific month", async () => {
    const result = await calculateCategoryExpenses(mockExpenses, "2026-01");

    expect(result).toHaveLength(3); // 3 kategori
    
    // Kira en yüksek
    expect(result[0].categoryId).toBe("cat_rent");
    expect(result[0].totalAmount).toBe(5000);
    expect(result[0].expenseCount).toBe(1);
    
    // Gıda ikinci (500 + 200 = 700)
    expect(result[1].categoryId).toBe("cat_food");
    expect(result[1].totalAmount).toBe(700);
    expect(result[1].expenseCount).toBe(2);
    
    // Ulaşım üçüncü
    expect(result[2].categoryId).toBe("cat_transport");
    expect(result[2].totalAmount).toBe(300);
    expect(result[2].expenseCount).toBe(1);
  });

  it("should calculate percentages correctly", async () => {
    const result = await calculateCategoryExpenses(mockExpenses, "2026-01");
    
    // Toplam: 5000 + 700 + 300 = 6000
    const total = 6000;
    
    expect(result[0].percentage).toBeCloseTo((5000 / total) * 100, 1); // ~83.33%
    expect(result[1].percentage).toBeCloseTo((700 / total) * 100, 1);  // ~11.67%
    expect(result[2].percentage).toBeCloseTo((300 / total) * 100, 1);  // ~5%
  });

  it("should only include categories with expenses", async () => {
    const singleExpense: Expense[] = [
      {
        id: "exp1",
        name: "Market",
        amount: 500,
        category: "cat_food",
        date: "2026-01-15",
        type: "other" as any,
        createdAt: "2026-01-15T10:00:00Z",
        updatedAt: "2026-01-15T10:00:00Z",
      },
    ];

    const result = await calculateCategoryExpenses(singleExpense, "2026-01");

    expect(result).toHaveLength(1);
    expect(result[0].categoryId).toBe("cat_food");
  });

  it("should return empty array for month with no expenses", async () => {
    const result = await calculateCategoryExpenses(mockExpenses, "2026-02");

    expect(result).toHaveLength(0);
  });

  it("should filter expenses by month correctly", async () => {
    // Ocak 2026
    const jan2026 = await calculateCategoryExpenses(mockExpenses, "2026-01");
    expect(jan2026).toHaveLength(3);
    
    // Aralık 2025
    const dec2025 = await calculateCategoryExpenses(mockExpenses, "2025-12");
    expect(dec2025).toHaveLength(1);
    expect(dec2025[0].categoryId).toBe("cat_food");
    expect(dec2025[0].totalAmount).toBe(1000);
  });

  it("should sort by total amount descending", async () => {
    const result = await calculateCategoryExpenses(mockExpenses, "2026-01");

    // İlk kategori en yüksek harcama
    expect(result[0].totalAmount).toBeGreaterThan(result[1].totalAmount);
    expect(result[1].totalAmount).toBeGreaterThan(result[2].totalAmount);
  });

  it("should handle empty expense array", async () => {
    const result = await calculateCategoryExpenses([], "2026-01");

    expect(result).toHaveLength(0);
  });
});
