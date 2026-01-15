import { describe, it, expect } from "vitest";
import { generateInstallments, formatInstallmentInfo, calculateRemainingInstallments } from "../utils/installment-helpers";
import { PaymentCategory } from "../types";

describe("installment-helpers", () => {
  describe("generateInstallments", () => {
    it("should generate correct number of installments", () => {
      const installments = generateInstallments(
        "Kredi Kartı",
        1000,
        PaymentCategory.CREDIT_CARD,
        new Date("2026-01-01"),
        12
      );
      
      expect(installments).toHaveLength(12);
    });

    it("should generate installments with correct names", () => {
      const installments = generateInstallments(
        "Kredi Kartı",
        1000,
        PaymentCategory.CREDIT_CARD,
        new Date("2026-01-01"),
        3
      );
      
      expect(installments[0].name).toBe("Kredi Kartı 1/3");
      expect(installments[1].name).toBe("Kredi Kartı 2/3");
      expect(installments[2].name).toBe("Kredi Kartı 3/3");
    });

    it("should generate installments with correct dates", () => {
      const startDate = new Date("2026-01-15");
      const installments = generateInstallments(
        "Kredi",
        5000,
        PaymentCategory.LOAN,
        startDate,
        3
      );
      
      const firstDate = new Date(installments[0].dueDate);
      const secondDate = new Date(installments[1].dueDate);
      const thirdDate = new Date(installments[2].dueDate);
      
      expect(firstDate.getMonth()).toBe(0); // Ocak
      expect(secondDate.getMonth()).toBe(1); // Şubat
      expect(thirdDate.getMonth()).toBe(2); // Mart
    });

    it("should set correct installment numbers", () => {
      const installments = generateInstallments(
        "Test",
        1000,
        PaymentCategory.OTHER,
        new Date("2026-01-01"),
        5
      );
      
      expect(installments[0].installments?.current).toBe(1);
      expect(installments[0].installments?.total).toBe(5);
      expect(installments[4].installments?.current).toBe(5);
      expect(installments[4].installments?.total).toBe(5);
    });

    it("should set all installments as unpaid", () => {
      const installments = generateInstallments(
        "Test",
        1000,
        PaymentCategory.OTHER,
        new Date("2026-01-01"),
        3
      );
      
      installments.forEach(inst => {
        expect(inst.isPaid).toBe(false);
      });
    });
  });

  describe("formatInstallmentInfo", () => {
    it("should format installment info correctly", () => {
      expect(formatInstallmentInfo(1, 12)).toBe("1/12 Taksit");
      expect(formatInstallmentInfo(5, 10)).toBe("5/10 Taksit");
    });
  });

  describe("calculateRemainingInstallments", () => {
    it("should calculate remaining installments correctly", () => {
      expect(calculateRemainingInstallments(1, 12)).toBe(12);
      expect(calculateRemainingInstallments(5, 12)).toBe(8);
      expect(calculateRemainingInstallments(12, 12)).toBe(1);
    });

    it("should not return negative numbers", () => {
      expect(calculateRemainingInstallments(15, 12)).toBe(0);
    });
  });
});
