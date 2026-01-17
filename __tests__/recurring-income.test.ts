/**
 * Tekrarlayan Gelir Testleri
 */

import { describe, it, expect } from "vitest";
import {
  calculateNextIncomeDate,
  shouldGenerateRecurringIncome,
  createRecurringIncomeInstance,
} from "../utils/recurring-income-helpers";
import type { Income, RecurrenceFrequency } from "../types";

describe("Recurring Income Helpers", () => {
  describe("calculateNextIncomeDate", () => {
    it("should calculate next daily date", () => {
      const result = calculateNextIncomeDate("2026-01-15", "daily" as any);
      expect(result).toBe("2026-01-16");
    });

    it("should calculate next weekly date", () => {
      const result = calculateNextIncomeDate("2026-01-15", "weekly" as any);
      expect(result).toBe("2026-01-22");
    });

    it("should calculate next monthly date", () => {
      const result = calculateNextIncomeDate("2026-01-15", "monthly" as any);
      expect(result).toBe("2026-02-15");
    });

    it("should calculate next yearly date", () => {
      const result = calculateNextIncomeDate("2026-01-15", "yearly" as any);
      expect(result).toBe("2027-01-15");
    });

    it("should return same date for none frequency", () => {
      const result = calculateNextIncomeDate("2026-01-15", "none" as any);
      expect(result).toBe("2026-01-15");
    });
  });

  describe("shouldGenerateRecurringIncome", () => {
    it("should return false if no recurrence", () => {
      const income: Income = {
        id: "1",
        name: "Salary",
        amount: 10000,
        type: "regular" as any,
        date: "2026-01-15",
        createdAt: "2026-01-15T00:00:00Z",
        updatedAt: "2026-01-15T00:00:00Z",
      };
      expect(shouldGenerateRecurringIncome(income)).toBe(false);
    });

    it("should return false if frequency is none", () => {
      const income: Income = {
        id: "1",
        name: "Salary",
        amount: 10000,
        type: "regular" as any,
        date: "2026-01-15",
        recurrence: {
          frequency: "none" as any,
          nextDate: "2026-02-15",
        },
        createdAt: "2026-01-15T00:00:00Z",
        updatedAt: "2026-01-15T00:00:00Z",
      };
      expect(shouldGenerateRecurringIncome(income)).toBe(false);
    });

    it("should return false if no nextDate", () => {
      const income: Income = {
        id: "1",
        name: "Salary",
        amount: 10000,
        type: "regular" as any,
        date: "2026-01-15",
        recurrence: {
          frequency: "monthly" as any,
        },
        createdAt: "2026-01-15T00:00:00Z",
        updatedAt: "2026-01-15T00:00:00Z",
      };
      expect(shouldGenerateRecurringIncome(income)).toBe(false);
    });

    it("should return false if repeatCount is 0", () => {
      const income: Income = {
        id: "1",
        name: "Salary",
        amount: 10000,
        type: "regular" as any,
        date: "2026-01-15",
        recurrence: {
          frequency: "monthly" as any,
          nextDate: "2026-02-15",
          repeatCount: 0,
        },
        createdAt: "2026-01-15T00:00:00Z",
        updatedAt: "2026-01-15T00:00:00Z",
      };
      expect(shouldGenerateRecurringIncome(income)).toBe(false);
    });

    it("should return false if nextDate is in future", () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 10);
      const income: Income = {
        id: "1",
        name: "Salary",
        amount: 10000,
        type: "regular" as any,
        date: "2026-01-15",
        recurrence: {
          frequency: "monthly" as any,
          nextDate: futureDate.toISOString().split("T")[0],
        },
        createdAt: "2026-01-15T00:00:00Z",
        updatedAt: "2026-01-15T00:00:00Z",
      };
      expect(shouldGenerateRecurringIncome(income)).toBe(false);
    });

    it("should return true if nextDate is today or past", () => {
      const today = new Date();
      const income: Income = {
        id: "1",
        name: "Salary",
        amount: 10000,
        type: "regular" as any,
        date: "2026-01-15",
        recurrence: {
          frequency: "monthly" as any,
          nextDate: today.toISOString().split("T")[0],
        },
        createdAt: "2026-01-15T00:00:00Z",
        updatedAt: "2026-01-15T00:00:00Z",
      };
      expect(shouldGenerateRecurringIncome(income)).toBe(true);
    });
  });

  describe("createRecurringIncomeInstance", () => {
    it("should create new income instance with updated date", () => {
      const originalIncome: Income = {
        id: "income_1",
        name: "Salary",
        amount: 10000,
        type: "regular" as any,
        date: "2026-01-15",
        recurrence: {
          frequency: "monthly" as any,
          nextDate: "2026-02-15",
        },
        createdAt: "2026-01-15T00:00:00Z",
        updatedAt: "2026-01-15T00:00:00Z",
      };

      const newIncome = createRecurringIncomeInstance(originalIncome, "2026-02-15");

      expect(newIncome.id).toContain("income_1_");
      expect(newIncome.date).toBe("2026-02-15");
      expect(newIncome.autoGenerated).toBe(true);
      expect(newIncome.recurrence?.nextDate).toBe("2026-03-14"); // Şubat 28 gün olduğu için
    });

    it("should decrement repeatCount", () => {
      const originalIncome: Income = {
        id: "income_1",
        name: "Salary",
        amount: 10000,
        type: "regular" as any,
        date: "2026-01-15",
        recurrence: {
          frequency: "monthly" as any,
          nextDate: "2026-02-15",
          repeatCount: 5,
        },
        createdAt: "2026-01-15T00:00:00Z",
        updatedAt: "2026-01-15T00:00:00Z",
      };

      const newIncome = createRecurringIncomeInstance(originalIncome, "2026-02-15");

      expect(newIncome.recurrence?.repeatCount).toBe(4);
    });
  });
});
