/**
 * Akıllı Bildirim Sistemi Testleri
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getNotificationSettings,
  schedulePaymentReminder,
  sendOverdueAlert,
  sendPaymentSuccessNotification,
  scheduleDailySummary,
  scheduleWeeklySummary,
  scheduleMonthlySummary,
  scheduleAllSmartNotifications,
  checkOverduePayments,
} from "@/services/smart-notifications";
import type { Payment } from "@/types";
import { PaymentCategory, PaymentStatus } from "@/types";

// Mock expo-notifications
vi.mock("expo-notifications", () => ({
  scheduleNotificationAsync: vi.fn(),
  cancelAllScheduledNotificationsAsync: vi.fn(),
  SchedulableTriggerInputTypes: {
    TIME_INTERVAL: "timeInterval",
    DAILY: "daily",
    WEEKLY: "weekly",
    CALENDAR: "calendar",
  },
  AndroidNotificationPriority: {
    HIGH: "high",
  },
}));

// Mock AsyncStorage
vi.mock("@react-native-async-storage/async-storage", () => ({
  default: {
    getItem: vi.fn(),
    setItem: vi.fn(),
  },
}));

describe("Smart Notifications Service", () => {
  const mockPayment: Payment = {
    id: "payment_1",
    name: "Elektrik Faturası",
    amount: 450,
    category: PaymentCategory.OTHER,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 gün sonra
    status: PaymentStatus.PENDING,
    isPaid: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Default ayarlar
    (AsyncStorage.getItem as any).mockResolvedValue(
      JSON.stringify({
        enabled: true,
        reminderDays: 3,
        reminderTime: "morning",
        dailySummary: true,
        weeklySummary: false,
        monthlySummary: false,
        overdueAlerts: true,
        successNotifications: true,
        sound: true,
        vibration: true,
      })
    );
  });

  describe("getNotificationSettings", () => {
    it("should return default settings when no stored settings exist", async () => {
      (AsyncStorage.getItem as any).mockResolvedValue(null);
      
      const settings = await getNotificationSettings();
      
      expect(settings.enabled).toBe(true);
      expect(settings.reminderDays).toBe(3);
      expect(settings.reminderTime).toBe("morning");
    });

    it("should return stored settings when they exist", async () => {
      const customSettings = {
        enabled: false,
        reminderDays: 7,
        reminderTime: "evening",
        dailySummary: false,
        weeklySummary: true,
        monthlySummary: true,
        overdueAlerts: false,
        successNotifications: false,
        sound: false,
        vibration: false,
      };
      (AsyncStorage.getItem as any).mockResolvedValue(JSON.stringify(customSettings));
      
      const settings = await getNotificationSettings();
      
      expect(settings.enabled).toBe(false);
      expect(settings.reminderDays).toBe(7);
      expect(settings.reminderTime).toBe("evening");
    });
  });

  describe("schedulePaymentReminder", () => {
    it("should schedule a reminder for unpaid payment", async () => {
      await schedulePaymentReminder(mockPayment);
      
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.objectContaining({
            title: expect.stringContaining("Yakında Ödeme"),
            body: expect.stringContaining("450₺"),
          }),
          trigger: expect.objectContaining({
            type: "timeInterval",
          }),
        })
      );
    });

    it("should not schedule reminder when notifications are disabled", async () => {
      (AsyncStorage.getItem as any).mockResolvedValue(
        JSON.stringify({
          enabled: false,
          reminderDays: 3,
          reminderTime: "morning",
        })
      );
      
      await schedulePaymentReminder(mockPayment);
      
      expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
    });

    it("should not schedule reminder for past dates", async () => {
      const pastPayment = {
        ...mockPayment,
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 gün önce
      };
      
      await schedulePaymentReminder(pastPayment);
      
      expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
    });
  });

  describe("sendOverdueAlert", () => {
    it("should send overdue alert for late payment", async () => {
      await sendOverdueAlert(mockPayment);
      
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.objectContaining({
            title: expect.stringContaining("Geciken Ödeme"),
            body: expect.stringContaining(mockPayment.name),
          }),
          trigger: null, // Hemen gönder
        })
      );
    });

    it("should not send alert when overdueAlerts is disabled", async () => {
      (AsyncStorage.getItem as any).mockResolvedValue(
        JSON.stringify({
          enabled: true,
          overdueAlerts: false,
        })
      );
      
      await sendOverdueAlert(mockPayment);
      
      expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
    });
  });

  describe("sendPaymentSuccessNotification", () => {
    it("should send success notification when payment is marked as paid", async () => {
      await sendPaymentSuccessNotification(mockPayment);
      
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.objectContaining({
            title: expect.stringContaining("Tamamlandı"),
            body: expect.stringContaining(mockPayment.name),
          }),
          trigger: null, // Hemen gönder
        })
      );
    });

    it("should not send notification when successNotifications is disabled", async () => {
      (AsyncStorage.getItem as any).mockResolvedValue(
        JSON.stringify({
          enabled: true,
          successNotifications: false,
        })
      );
      
      await sendPaymentSuccessNotification(mockPayment);
      
      expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
    });
  });

  describe("scheduleDailySummary", () => {
    it("should schedule daily summary when there are payments today", async () => {
      const todayPayment = {
        ...mockPayment,
        dueDate: new Date().toISOString(),
      };
      
      await scheduleDailySummary([todayPayment]);
      
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.objectContaining({
            title: expect.stringContaining("Günlük Ödeme Özeti"),
          }),
        })
      );
    });

    it("should not schedule summary when no payments today", async () => {
      await scheduleDailySummary([mockPayment]); // 7 gün sonra
      
      expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
    });
  });

  describe("scheduleAllSmartNotifications", () => {
    it("should cancel existing notifications and schedule new ones", async () => {
      const payments = [mockPayment];
      
      await scheduleAllSmartNotifications(payments);
      
      expect(Notifications.cancelAllScheduledNotificationsAsync).toHaveBeenCalled();
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalled();
    });
  });

  describe("checkOverduePayments", () => {
    it("should send alerts for overdue payments", async () => {
      const overduePayment = {
        ...mockPayment,
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 gün önce
        isPaid: false,
      };
      
      await checkOverduePayments([overduePayment]);
      
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.objectContaining({
            title: expect.stringContaining("Geciken Ödeme"),
          }),
        })
      );
    });

    it("should not send alerts for paid overdue payments", async () => {
      const paidOverduePayment = {
        ...mockPayment,
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        isPaid: true,
      };
      
      await checkOverduePayments([paidOverduePayment]);
      
      expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
    });
  });
});
