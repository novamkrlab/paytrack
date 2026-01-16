/**
 * Harcama Takibi Testleri (Yeni Sistem)
 */

import { describe, it, expect } from "vitest";
import type { Expense } from "@/types/expense";
import { ExpenseCategory, ExpenseType, getExpenseType, getCategoriesByType } from "@/types/expense";
import {
  getExpensesForMonth,
  getCurrentMonthExpenses,
  calculateCategoryExpenseSummary,
  calculateTypeExpenseSummary,
  calculateMonthlyExpenseSummary,
  getExpenseTrend,
} from "@/utils/expense-helpers";

// Test verileri
const mockExpenses: Expense[] = [
  {
    id: "1",
    name: "Market Alışverişi",
    amount: 500,
    category: ExpenseCategory.GROCERIES,
    type: ExpenseType.ESSENTIAL,
    date: "2024-01-15",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Elektrik Faturası",
    amount: 300,
    category: ExpenseCategory.ELECTRICITY,
    type: ExpenseType.ESSENTIAL,
    date: "2024-01-20",
    createdAt: "2024-01-20",
    updatedAt: "2024-01-20",
  },
  {
    id: "3",
    name: "Sinema",
    amount: 150,
    category: ExpenseCategory.ENTERTAINMENT,
    type: ExpenseType.DISCRETIONARY,
    date: "2024-01-25",
    createdAt: "2024-01-25",
    updatedAt: "2024-01-25",
  },
  {
    id: "4",
    name: "Kıyafet",
    amount: 400,
    category: ExpenseCategory.CLOTHING,
    type: ExpenseType.DISCRETIONARY,
    date: "2024-02-10",
    createdAt: "2024-02-10",
    updatedAt: "2024-02-10",
  },
];

describe("Expense Type System", () => {
  it("getExpenseType - Kategori tipini döner", () => {
    expect(getExpenseType(ExpenseCategory.GROCERIES)).toBe(ExpenseType.ESSENTIAL);
    expect(getExpenseType(ExpenseCategory.ENTERTAINMENT)).toBe(ExpenseType.DISCRETIONARY);
    expect(getExpenseType(ExpenseCategory.HEALTHCARE)).toBe(ExpenseType.OTHER);
  });

  it("getCategoriesByType - Tipe göre kategorileri filtreler", () => {
    const essentialCategories = getCategoriesByType(ExpenseType.ESSENTIAL);
    expect(essentialCategories).toContain(ExpenseCategory.GROCERIES);
    expect(essentialCategories).toContain(ExpenseCategory.ELECTRICITY);
    expect(essentialCategories).not.toContain(ExpenseCategory.ENTERTAINMENT);

    const discretionaryCategories = getCategoriesByType(ExpenseType.DISCRETIONARY);
    expect(discretionaryCategories).toContain(ExpenseCategory.ENTERTAINMENT);
    expect(discretionaryCategories).toContain(ExpenseCategory.CLOTHING);
    expect(discretionaryCategories).not.toContain(ExpenseCategory.GROCERIES);
  });
});

describe("Expense Filtering", () => {
  it("getExpensesForMonth - Belirli bir aya ait harcamaları filtreler", () => {
    const januaryExpenses = getExpensesForMonth(mockExpenses, 2024, 1);
    expect(januaryExpenses).toHaveLength(3);
    expect(januaryExpenses.every((e) => e.date.startsWith("2024-01"))).toBe(true);

    const februaryExpenses = getExpensesForMonth(mockExpenses, 2024, 2);
    expect(februaryExpenses).toHaveLength(1);
    expect(februaryExpenses[0].name).toBe("Kıyafet");
  });
});

describe("Expense Summary Calculations", () => {
  it("calculateCategoryExpenseSummary - Kategori bazlı özet hesaplar", () => {
    const januaryExpenses = getExpensesForMonth(mockExpenses, 2024, 1);
    const categorySummary = calculateCategoryExpenseSummary(januaryExpenses);

    expect(categorySummary).toHaveLength(3);

    // En yüksek harcama GROCERIES olmalı
    expect(categorySummary[0].category).toBe(ExpenseCategory.GROCERIES);
    expect(categorySummary[0].amount).toBe(500);

    // Yüzdeler toplamı 100 olmalı
    const totalPercentage = categorySummary.reduce((sum, s) => sum + s.percentage, 0);
    expect(totalPercentage).toBeCloseTo(100, 1);
  });

  it("calculateTypeExpenseSummary - Tip bazlı özet hesaplar", () => {
    const januaryExpenses = getExpensesForMonth(mockExpenses, 2024, 1);
    const typeSummary = calculateTypeExpenseSummary(januaryExpenses);

    expect(typeSummary).toHaveLength(2); // Essential ve Discretionary

    const essentialSummary = typeSummary.find((s) => s.type === ExpenseType.ESSENTIAL);
    expect(essentialSummary?.amount).toBe(800); // 500 + 300

    const discretionarySummary = typeSummary.find((s) => s.type === ExpenseType.DISCRETIONARY);
    expect(discretionarySummary?.amount).toBe(150);
  });

  it("calculateMonthlyExpenseSummary - Aylık özet hesaplar", () => {
    const summary = calculateMonthlyExpenseSummary(mockExpenses, 2024, 1);

    expect(summary.month).toBe("2024-01");
    expect(summary.totalAmount).toBe(950); // 500 + 300 + 150
    expect(summary.essentialAmount).toBe(800);
    expect(summary.discretionaryAmount).toBe(150);
    expect(summary.otherAmount).toBe(0);
  });

  it("getExpenseTrend - Son N ay için trend hesaplar", () => {
    const trend = getExpenseTrend(mockExpenses, 3);

    expect(trend).toHaveLength(3);
    expect(trend[0].month).toMatch(/^\d{4}-\d{2}$/);
    expect(trend.every((t) => typeof t.total === "number")).toBe(true);
    expect(trend.every((t) => typeof t.essential === "number")).toBe(true);
    expect(trend.every((t) => typeof t.discretionary === "number")).toBe(true);
  });
});

describe("Edge Cases", () => {
  it("Boş harcama listesi için özet hesaplar", () => {
    const summary = calculateMonthlyExpenseSummary([], 2024, 1);

    expect(summary.totalAmount).toBe(0);
    expect(summary.essentialAmount).toBe(0);
    expect(summary.discretionaryAmount).toBe(0);
    expect(summary.byCategory).toHaveLength(0);
  });

  it("Tek kategorili harcama için yüzde hesaplar", () => {
    const singleExpense: Expense[] = [
      {
        id: "1",
        name: "Test",
        amount: 100,
        category: ExpenseCategory.GROCERIES,
        type: ExpenseType.ESSENTIAL,
        date: "2024-01-15",
        createdAt: "2024-01-15",
        updatedAt: "2024-01-15",
      },
    ];

    const summary = calculateCategoryExpenseSummary(singleExpense);

    expect(summary).toHaveLength(1);
    expect(summary[0].percentage).toBe(100);
  });
});
