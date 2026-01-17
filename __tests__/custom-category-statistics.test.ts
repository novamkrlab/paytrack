import { describe, it, expect, beforeEach, vi } from "vitest";
import { calculateCategoryExpenses } from "@/services/category-statistics-service";
import type { Expense } from "@/types/expense";
import type { Category } from "@/types/category";

// Mock category service - hem varsayılan hem özel kategoriler
const mockCategories: Category[] = [
    {
      id: "cat_food",
      name: "Gıda",
      icon: "🍔",
      color: "#FF6B6B",
      isCustom: false,
      isDefault: true,
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    },
    {
      id: "cat_transport",
      name: "Ulaşım",
      icon: "🚗",
      color: "#4ECDC4",
      isCustom: false,
      isDefault: true,
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    },
    {
      id: "cat_custom_1234567890_abc123",
      name: "Evcil Hayvan",
      icon: "🐕",
      color: "#FFA500",
      isCustom: true,
      isDefault: false,
      createdAt: "2026-01-10T00:00:00Z",
      updatedAt: "2026-01-10T00:00:00Z",
    },
    {
      id: "cat_custom_9876543210_xyz789",
      name: "Hobi",
      icon: "🎨",
      color: "#9B59B6",
      isCustom: true,
      isDefault: false,
      createdAt: "2026-01-15T00:00:00Z",
      updatedAt: "2026-01-15T00:00:00Z",
    },
  ];

vi.mock("@/services/category-service", () => ({
  loadCategories: vi.fn(() => Promise.resolve(mockCategories)),
}));

describe("Custom Category Statistics", () => {

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
      name: "Köpek Maması",
      amount: 250,
      category: "cat_custom_1234567890_abc123",
      date: "2026-01-12",
      type: "other" as any,
      createdAt: "2026-01-12T10:00:00Z",
      updatedAt: "2026-01-12T10:00:00Z",
    },
    {
      id: "exp4",
      name: "Boya Malzemesi",
      amount: 400,
      category: "cat_custom_9876543210_xyz789",
      date: "2026-01-18",
      type: "other" as any,
      createdAt: "2026-01-18T10:00:00Z",
      updatedAt: "2026-01-18T10:00:00Z",
    },
  ];

  it("should include custom categories in statistics", async () => {
    const result = await calculateCategoryExpenses(mockExpenses, "2026-01");

    // 4 kategori olmalı (2 varsayılan + 2 özel)
    expect(result).toHaveLength(4);
    
    // Kategori ID'lerini kontrol et
    const categoryIds = result.map(r => r.categoryId);
    expect(categoryIds).toContain("cat_food");
    expect(categoryIds).toContain("cat_transport");
    expect(categoryIds).toContain("cat_custom_1234567890_abc123");
    expect(categoryIds).toContain("cat_custom_9876543210_xyz789");
  });

  it("should correctly calculate custom category totals", async () => {
    const result = await calculateCategoryExpenses(mockExpenses, "2026-01");

    // Gıda kategorisi
    const foodCategory = result.find(r => r.categoryId === "cat_food");
    expect(foodCategory?.totalAmount).toBe(500);
    expect(foodCategory?.categoryName).toBe("Gıda");
    expect(foodCategory?.categoryIcon).toBe("🍔");

    // Özel kategori 1 (Evcil Hayvan)
    const petCategory = result.find(r => r.categoryId === "cat_custom_1234567890_abc123");
    expect(petCategory?.totalAmount).toBe(250);
    expect(petCategory?.categoryName).toBe("Evcil Hayvan");
    expect(petCategory?.categoryIcon).toBe("🐕");
    expect(petCategory?.categoryColor).toBe("#FFA500");

    // Özel kategori 2 (Hobi)
    const hobbyCategory = result.find(r => r.categoryId === "cat_custom_9876543210_xyz789");
    expect(hobbyCategory?.totalAmount).toBe(400);
    expect(hobbyCategory?.categoryName).toBe("Hobi");
    expect(hobbyCategory?.categoryIcon).toBe("🎨");
    expect(hobbyCategory?.categoryColor).toBe("#9B59B6");
  });

  it("should sort all categories by amount including custom ones", async () => {
    const result = await calculateCategoryExpenses(mockExpenses, "2026-01");

    // Sıralama: Gıda (500) > Hobi (400) > Ulaşım (300) > Evcil Hayvan (250)
    expect(result[0].categoryId).toBe("cat_food");
    expect(result[0].totalAmount).toBe(500);
    
    expect(result[1].categoryId).toBe("cat_custom_9876543210_xyz789");
    expect(result[1].totalAmount).toBe(400);
    
    expect(result[2].categoryId).toBe("cat_transport");
    expect(result[2].totalAmount).toBe(300);
    
    expect(result[3].categoryId).toBe("cat_custom_1234567890_abc123");
    expect(result[3].totalAmount).toBe(250);
  });

  it("should calculate percentages correctly with custom categories", async () => {
    const result = await calculateCategoryExpenses(mockExpenses, "2026-01");

    // Toplam: 500 + 300 + 250 + 400 = 1450
    const total = 1450;

    expect(result[0].percentage).toBeCloseTo((500 / total) * 100, 1); // ~34.48%
    expect(result[1].percentage).toBeCloseTo((400 / total) * 100, 1); // ~27.59%
    expect(result[2].percentage).toBeCloseTo((300 / total) * 100, 1); // ~20.69%
    expect(result[3].percentage).toBeCloseTo((250 / total) * 100, 1); // ~17.24%
  });

  it("should handle only custom category expenses", async () => {
    const onlyCustomExpenses: Expense[] = [
      {
        id: "exp1",
        name: "Köpek Maması",
        amount: 250,
        category: "cat_custom_1234567890_abc123",
        date: "2026-01-12",
        type: "other" as any,
        createdAt: "2026-01-12T10:00:00Z",
        updatedAt: "2026-01-12T10:00:00Z",
      },
    ];

    const result = await calculateCategoryExpenses(onlyCustomExpenses, "2026-01");

    expect(result).toHaveLength(1);
    expect(result[0].categoryId).toBe("cat_custom_1234567890_abc123");
    expect(result[0].totalAmount).toBe(250);
    expect(result[0].percentage).toBe(100);
  });
});
