/**
 * Yardımcı Fonksiyonlar Test
 */

import { describe, it, expect } from "vitest";
import {
  formatDate,
  formatDateShort,
  formatCurrency,
  getDaysDifference,
  getUpcomingPayments,
  calculateMonthlyPaymentTotal,
} from "../utils/helpers";
import { Payment, PaymentCategory, PaymentStatus } from "../types";

describe("Helper Functions", () => {
  describe("formatDate", () => {
    it("should format date in Turkish", () => {
      const date = new Date(2026, 0, 15).toISOString(); // 15 Ocak 2026
      const formatted = formatDate(date);
      expect(formatted).toBe("15 Ocak 2026");
    });
  });

  describe("formatDateShort", () => {
    it("should format date in short format", () => {
      const date = new Date(2026, 0, 15).toISOString();
      const formatted = formatDateShort(date);
      expect(formatted).toBe("15.01.2026");
    });
  });

  describe("formatCurrency", () => {
    it("should format TRY currency", () => {
      const formatted = formatCurrency(1234.56, "TRY");
      expect(formatted).toContain("1.234,56");
      expect(formatted).toContain("₺");
    });

    it("should format USD currency", () => {
      const formatted = formatCurrency(1234.56, "USD");
      expect(formatted).toContain("$");
    });
  });

  describe("getDaysDifference", () => {
    it("should calculate days difference", () => {
      const date1 = new Date(2026, 0, 1);
      const date2 = new Date(2026, 0, 10);
      const diff = getDaysDifference(date1, date2);
      expect(diff).toBe(9);
    });
  });

  describe("getUpcomingPayments", () => {
    it("should return upcoming payments within 7 days", () => {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 8);

      const payments: Payment[] = [
        {
          id: "1",
          name: "Payment 1",
          amount: 100,
          category: PaymentCategory.OTHER,
          dueDate: tomorrow.toISOString(),
          status: PaymentStatus.PENDING,
          isPaid: false,
          createdAt: today.toISOString(),
          updatedAt: today.toISOString(),
        },
        {
          id: "2",
          name: "Payment 2",
          amount: 200,
          category: PaymentCategory.OTHER,
          dueDate: nextWeek.toISOString(),
          status: PaymentStatus.PENDING,
          isPaid: false,
          createdAt: today.toISOString(),
          updatedAt: today.toISOString(),
        },
      ];

      const upcoming = getUpcomingPayments(payments);
      expect(upcoming.length).toBe(1);
      expect(upcoming[0].id).toBe("1");
    });

    it("should not return paid payments", () => {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const payments: Payment[] = [
        {
          id: "1",
          name: "Payment 1",
          amount: 100,
          category: PaymentCategory.OTHER,
          dueDate: tomorrow.toISOString(),
          status: PaymentStatus.PAID,
          isPaid: true,
          createdAt: today.toISOString(),
          updatedAt: today.toISOString(),
        },
      ];

      const upcoming = getUpcomingPayments(payments);
      expect(upcoming.length).toBe(0);
    });
  });

  describe("calculateMonthlyPaymentTotal", () => {
    it("should calculate total payments for a month", () => {
      const payments: Payment[] = [
        {
          id: "1",
          name: "Payment 1",
          amount: 100,
          category: PaymentCategory.OTHER,
          dueDate: new Date(2026, 0, 15).toISOString(), // Ocak 2026
          status: PaymentStatus.PENDING,
          isPaid: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Payment 2",
          amount: 200,
          category: PaymentCategory.OTHER,
          dueDate: new Date(2026, 0, 20).toISOString(), // Ocak 2026
          status: PaymentStatus.PENDING,
          isPaid: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "3",
          name: "Payment 3",
          amount: 300,
          category: PaymentCategory.OTHER,
          dueDate: new Date(2026, 1, 15).toISOString(), // Şubat 2026
          status: PaymentStatus.PENDING,
          isPaid: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      const total = calculateMonthlyPaymentTotal(payments, 2026, 0); // Ocak 2026
      expect(total).toBe(300);
    });
  });
});
