/**
 * Harcama Takibi ve Bütçe Modülü Testleri
 */

import { describe, it, expect } from "vitest";
import { Payment, PaymentCategory, PaymentStatus } from "@/types";
import {
  getPaymentsForMonth,
  getCurrentMonthPayments,
  calculateCategoryExpenses,
  calculateMonthlyExpenseSummary,
  getExpenseTrend,
} from "@/utils/expense-calculations";
import {
  getDefaultBudgets,
  calculateBudgetStatus,
  getBudgetMap,
} from "@/utils/budget-storage";
import type { Budget } from "@/types/budget";

// Test verileri
const mockPayments: Payment[] = [
  {
    id: "1",
    name: "Kredi Kartı Ödemesi",
    amount: 1000,
    category: PaymentCategory.CREDIT_CARD,
    dueDate: "2024-01-15",
    isPaid: true,
    status: PaymentStatus.PAID,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Konut Kredisi",
    amount: 2000,
    category: PaymentCategory.LOAN,
    dueDate: "2024-01-20",
    isPaid: true,
    status: PaymentStatus.PAID,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-20",
  },
  {
    id: "3",
    name: "Elektrik Faturası",
    amount: 500,
    category: PaymentCategory.OTHER,
    dueDate: "2024-01-25",
    isPaid: true,
    status: PaymentStatus.PAID,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-25",
  },
  {
    id: "4",
    name: "Şubat Kredi Kartı",
    amount: 1500,
    category: PaymentCategory.CREDIT_CARD,
    dueDate: "2024-02-15",
    isPaid: false,
    status: PaymentStatus.PENDING,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
];

describe("Harcama Hesaplama Fonksiyonları", () => {
  it("getPaymentsForMonth - Belirli bir aya ait ödemeleri filtreler", () => {
    const januaryPayments = getPaymentsForMonth(mockPayments, 2024, 1);
    expect(januaryPayments).toHaveLength(3);
    expect(januaryPayments.every((p) => p.isPaid)).toBe(true);
  });

  it("calculateCategoryExpenses - Kategori bazlı harcamaları hesaplar", () => {
    const januaryPayments = getPaymentsForMonth(mockPayments, 2024, 1);
    const categoryExpenses = calculateCategoryExpenses(januaryPayments);

    expect(categoryExpenses).toHaveLength(3);

    // En yüksek harcama Loan kategorisinde olmalı
    expect(categoryExpenses[0].category).toBe(PaymentCategory.LOAN);
    expect(categoryExpenses[0].amount).toBe(2000);
    expect(categoryExpenses[0].count).toBe(1);

    // Yüzdeler toplamı 100 olmalı
    const totalPercentage = categoryExpenses.reduce((sum, e) => sum + e.percentage, 0);
    expect(totalPercentage).toBeCloseTo(100, 1);
  });

  it("calculateMonthlyExpenseSummary - Aylık harcama özetini hesaplar", () => {
    const summary = calculateMonthlyExpenseSummary(mockPayments, 2024, 1);

    expect(summary.month).toBe("2024-01");
    expect(summary.totalExpense).toBe(3500); // 1000 + 2000 + 500
    expect(summary.byCategory).toHaveLength(3);
    expect(summary.hasOverBudget).toBe(false);
    expect(summary.overBudgetCategories).toHaveLength(0);
  });

  it("calculateMonthlyExpenseSummary - Bütçe aşımını tespit eder", () => {
    const budgetMap = new Map<PaymentCategory, number>();
    budgetMap.set(PaymentCategory.CREDIT_CARD, 500); // 1000 harcandı, limit 500
    budgetMap.set(PaymentCategory.LOAN, 3000); // 2000 harcandı, limit 3000
    budgetMap.set(PaymentCategory.OTHER, 1000); // 500 harcandı, limit 1000

    const summary = calculateMonthlyExpenseSummary(mockPayments, 2024, 1, budgetMap);

    expect(summary.hasOverBudget).toBe(true);
    expect(summary.overBudgetCategories).toContain(PaymentCategory.CREDIT_CARD);
    expect(summary.overBudgetCategories).not.toContain(PaymentCategory.LOAN);
  });

  it("getExpenseTrend - Son N ay için harcama trendini döner", () => {
    const trend = getExpenseTrend(mockPayments, 3);

    expect(trend).toHaveLength(3);
    expect(trend[0].month).toMatch(/^\d{4}-\d{2}$/); // YYYY-MM formatında
    expect(trend.every((t) => typeof t.amount === "number")).toBe(true);
  });
});

describe("Bütçe Depolama Fonksiyonları", () => {
  it("getDefaultBudgets - Varsayılan bütçeleri döner", () => {
    const budgets = getDefaultBudgets();

    expect(budgets).toHaveLength(3);
    expect(budgets.every((b) => b.monthlyLimit === 0)).toBe(true);
    expect(budgets.every((b) => b.isActive === false)).toBe(true);
  });

  it("calculateBudgetStatus - Bütçe durumunu hesaplar", () => {
    const budget: Budget = {
      category: PaymentCategory.CREDIT_CARD,
      monthlyLimit: 1000,
      isActive: true,
    };

    const status = calculateBudgetStatus(budget, 800);

    expect(status.category).toBe(PaymentCategory.CREDIT_CARD);
    expect(status.limit).toBe(1000);
    expect(status.spent).toBe(800);
    expect(status.remaining).toBe(200);
    expect(status.percentage).toBe(80);
    expect(status.isOverBudget).toBe(false);
  });

  it("calculateBudgetStatus - Bütçe aşımını tespit eder", () => {
    const budget: Budget = {
      category: PaymentCategory.LOAN,
      monthlyLimit: 1500,
      isActive: true,
    };

    const status = calculateBudgetStatus(budget, 2000);

    expect(status.spent).toBe(2000);
    expect(status.remaining).toBe(-500);
    expect(status.percentage).toBeCloseTo(133.33, 1);
    expect(status.isOverBudget).toBe(true);
  });

  it("getBudgetMap - Aktif bütçeleri Map'e dönüştürür", () => {
    const budgets: Budget[] = [
      {
        category: PaymentCategory.CREDIT_CARD,
        monthlyLimit: 1000,
        isActive: true,
      },
      {
        category: PaymentCategory.LOAN,
        monthlyLimit: 2000,
        isActive: false, // Pasif
      },
      {
        category: PaymentCategory.OTHER,
        monthlyLimit: 500,
        isActive: true,
      },
    ];

    const budgetMap = getBudgetMap(budgets);

    expect(budgetMap.size).toBe(2); // Sadece aktif olanlar
    expect(budgetMap.get(PaymentCategory.CREDIT_CARD)).toBe(1000);
    expect(budgetMap.get(PaymentCategory.LOAN)).toBeUndefined(); // Pasif
    expect(budgetMap.get(PaymentCategory.OTHER)).toBe(500);
  });
});

describe("Edge Cases", () => {
  it("Boş ödeme listesi için harcama hesaplar", () => {
    const summary = calculateMonthlyExpenseSummary([], 2024, 1);

    expect(summary.totalExpense).toBe(0);
    expect(summary.byCategory).toHaveLength(0);
    expect(summary.hasOverBudget).toBe(false);
  });

  it("Sıfır limitli bütçe için yüzde hesaplar", () => {
    const budget: Budget = {
      category: PaymentCategory.OTHER,
      monthlyLimit: 0,
      isActive: true,
    };

    const status = calculateBudgetStatus(budget, 100);

    expect(status.percentage).toBe(0); // Sıfıra bölme hatası olmamalı
    expect(status.isOverBudget).toBe(true); // 100 > 0
  });

  it("Sadece ödenmemiş ödemeler harcamaya dahil edilmez", () => {
    const unpaidPayments: Payment[] = [
      {
        id: "1",
        name: "Ödenmemiş",
        amount: 1000,
        category: PaymentCategory.CREDIT_CARD,
        dueDate: "2024-01-15",
        isPaid: false,
        status: PaymentStatus.PENDING,
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
      },
    ];

    const januaryPayments = getPaymentsForMonth(unpaidPayments, 2024, 1);
    expect(januaryPayments).toHaveLength(0); // isPaid: false olanlar filtrelenir
  });
});
