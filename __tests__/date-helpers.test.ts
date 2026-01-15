import { describe, it, expect } from "vitest";
import { calculatePeriodCount, calculateTotalAmount } from "../utils/date-helpers";
import { RecurrenceFrequency } from "../types";

describe("date-helpers", () => {
  describe("calculatePeriodCount", () => {
    it("should calculate daily periods correctly", () => {
      const start = new Date("2026-01-01");
      const end = new Date("2026-01-10");
      const count = calculatePeriodCount(start, end, RecurrenceFrequency.DAILY);
      expect(count).toBe(9);
    });

    it("should calculate weekly periods correctly", () => {
      const start = new Date("2026-01-01");
      const end = new Date("2026-01-29");
      const count = calculatePeriodCount(start, end, RecurrenceFrequency.WEEKLY);
      expect(count).toBe(4);
    });

    it("should calculate monthly periods correctly", () => {
      const start = new Date("2026-01-01");
      const end = new Date("2026-12-01");
      const count = calculatePeriodCount(start, end, RecurrenceFrequency.MONTHLY);
      expect(count).toBe(11);
    });

    it("should calculate yearly periods correctly", () => {
      const start = new Date("2026-01-01");
      const end = new Date("2030-01-01");
      const count = calculatePeriodCount(start, end, RecurrenceFrequency.YEARLY);
      expect(count).toBe(4);
    });

    it("should return at least 1 for same dates", () => {
      const start = new Date("2026-01-01");
      const end = new Date("2026-01-01");
      const count = calculatePeriodCount(start, end, RecurrenceFrequency.MONTHLY);
      expect(count).toBeGreaterThanOrEqual(1);
    });
  });

  describe("calculateTotalAmount", () => {
    it("should calculate total amount for monthly payments", () => {
      const amount = 1000;
      const start = new Date("2026-01-01");
      const end = new Date("2026-12-01");
      const total = calculateTotalAmount(amount, start, end, RecurrenceFrequency.MONTHLY);
      expect(total).toBe(11000); // 11 months × 1000
    });

    it("should calculate total amount for yearly payments", () => {
      const amount = 5000;
      const start = new Date("2026-01-01");
      const end = new Date("2030-01-01");
      const total = calculateTotalAmount(amount, start, end, RecurrenceFrequency.YEARLY);
      expect(total).toBe(20000); // 4 years × 5000
    });

    it("should handle zero amount", () => {
      const amount = 0;
      const start = new Date("2026-01-01");
      const end = new Date("2026-12-01");
      const total = calculateTotalAmount(amount, start, end, RecurrenceFrequency.MONTHLY);
      expect(total).toBe(0);
    });
  });
});
