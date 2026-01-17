/**
 * Akıllı Bildirim Servisi
 * Ödeme hatırlatmaları, özetler ve uyarılar için gelişmiş bildirim mantığı
 */

import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Payment } from "@/types";

const STORAGE_KEY = "@notification_settings";

interface NotificationSettings {
  enabled: boolean;
  reminderDays: 1 | 3 | 7;
  reminderTime: "morning" | "noon" | "evening";
  dailySummary: boolean;
  weeklySummary: boolean;
  monthlySummary: boolean;
  overdueAlerts: boolean;
  successNotifications: boolean;
  sound: boolean;
  vibration: boolean;
}

const DEFAULT_SETTINGS: NotificationSettings = {
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
};

/**
 * Bildirim ayarlarını yükle
 */
export async function getNotificationSettings(): Promise<NotificationSettings> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.error("Error loading notification settings:", error);
    return DEFAULT_SETTINGS;
  }
}

/**
 * Bildirim zamanını saat olarak döndür
 */
function getNotificationHour(time: "morning" | "noon" | "evening"): number {
  switch (time) {
    case "morning":
      return 9;
    case "noon":
      return 12;
    case "evening":
      return 18;
    default:
      return 9;
  }
}

/**
 * Ödeme hatırlatması planla
 * X gün önceden hatırlatma
 */
export async function schedulePaymentReminder(payment: Payment) {
  try {
    const settings = await getNotificationSettings();
    
    if (!settings.enabled) {
      return;
    }

    const paymentDate = new Date(payment.dueDate);
    const reminderDate = new Date(paymentDate);
    reminderDate.setDate(reminderDate.getDate() - settings.reminderDays);
    reminderDate.setHours(getNotificationHour(settings.reminderTime), 0, 0, 0);

    // Geçmiş tarih kontrolü
    if (reminderDate < new Date()) {
      return;
    }

    const seconds = Math.floor((reminderDate.getTime() - Date.now()) / 1000);
    
    if (seconds > 0) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `💳 Yakında Ödeme: ${payment.name}`,
          body: `${settings.reminderDays} gün sonra ${payment.amount}₺ ödemeniz var`,
          data: { paymentId: payment.id, type: "reminder" },
          sound: settings.sound,
          vibrate: settings.vibration ? [0, 250, 250, 250] : undefined,
        },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds },
      });
    }
  } catch (error) {
    console.error("Error scheduling payment reminder:", error);
  }
}

/**
 * Geciken ödeme uyarısı gönder
 */
export async function sendOverdueAlert(payment: Payment) {
  try {
    const settings = await getNotificationSettings();
    
    if (!settings.enabled || !settings.overdueAlerts) {
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "⚠️ Geciken Ödeme!",
        body: `${payment.name} ödemeniz gecikti (${payment.amount}₺)`,
        data: { paymentId: payment.id, type: "overdue" },
        sound: settings.sound,
        vibrate: settings.vibration ? [0, 250, 250, 250] : undefined,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: null, // Hemen gönder
    });
  } catch (error) {
    console.error("Error sending overdue alert:", error);
  }
}

/**
 * Ödeme başarı bildirimi gönder
 */
export async function sendPaymentSuccessNotification(payment: Payment) {
  try {
    const settings = await getNotificationSettings();
    
    if (!settings.enabled || !settings.successNotifications) {
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "✅ Ödeme Tamamlandı",
        body: `${payment.name} ödemeniz başarıyla kaydedildi (${payment.amount}₺)`,
        data: { paymentId: payment.id, type: "success" },
        sound: settings.sound,
        vibrate: settings.vibration ? [0, 250, 250, 250] : undefined,
      },
      trigger: null, // Hemen gönder
    });
  } catch (error) {
    console.error("Error sending success notification:", error);
  }
}

/**
 * Günlük özet bildirimi planla
 */
export async function scheduleDailySummary(payments: Payment[]) {
  try {
    const settings = await getNotificationSettings();
    
    if (!settings.enabled || !settings.dailySummary) {
      return;
    }

    // Bugünün ödemelerini filtrele
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayPayments = payments.filter((payment) => {
      const paymentDate = new Date(payment.dueDate);
      return paymentDate >= today && paymentDate < tomorrow && !payment.isPaid;
    });

    if (todayPayments.length === 0) {
      return;
    }

    const totalAmount = todayPayments.reduce((sum, p) => sum + p.amount, 0);

    // Her gün sabah bildirim gönder
    const notificationTime = new Date();
    notificationTime.setHours(getNotificationHour(settings.reminderTime), 0, 0, 0);

    // Eğer zaman geçmişse yarına planla
    if (notificationTime < new Date()) {
      notificationTime.setDate(notificationTime.getDate() + 1);
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "📊 Günlük Ödeme Özeti",
        body: `Bugün ${todayPayments.length} ödemeniz var (Toplam: ${totalAmount}₺)`,
        data: { type: "daily_summary" },
        sound: settings.sound,
        vibrate: settings.vibration ? [0, 250, 250, 250] : undefined,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: notificationTime.getHours(),
        minute: 0,
      },
    });
  } catch (error) {
    console.error("Error scheduling daily summary:", error);
  }
}

/**
 * Haftalık özet bildirimi planla
 */
export async function scheduleWeeklySummary(payments: Payment[]) {
  try {
    const settings = await getNotificationSettings();
    
    if (!settings.enabled || !settings.weeklySummary) {
      return;
    }

    // Bu haftanın ödemelerini filtrele
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay()); // Pazar
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    const weekPayments = payments.filter((payment) => {
      const paymentDate = new Date(payment.dueDate);
      return paymentDate >= weekStart && paymentDate < weekEnd && !payment.isPaid;
    });

    if (weekPayments.length === 0) {
      return;
    }

    const totalAmount = weekPayments.reduce((sum, p) => sum + p.amount, 0);

    // Her Pazartesi sabah 9:00
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "📅 Haftalık Ödeme Planı",
        body: `Bu hafta ${weekPayments.length} ödemeniz var (Toplam: ${totalAmount}₺)`,
        data: { type: "weekly_summary" },
        sound: settings.sound,
        vibrate: settings.vibration ? [0, 250, 250, 250] : undefined,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: 2, // Pazartesi (1=Pazar, 2=Pazartesi)
        hour: 9,
        minute: 0,
      },
    });
  } catch (error) {
    console.error("Error scheduling weekly summary:", error);
  }
}

/**
 * Aylık özet bildirimi planla
 */
export async function scheduleMonthlySummary(payments: Payment[]) {
  try {
    const settings = await getNotificationSettings();
    
    if (!settings.enabled || !settings.monthlySummary) {
      return;
    }

    // Geçen ayın ödemelerini filtrele
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const lastMonthPayments = payments.filter((payment) => {
      const paymentDate = new Date(payment.dueDate);
      return paymentDate >= lastMonth && paymentDate < thisMonth;
    });

    const paidPayments = lastMonthPayments.filter((p) => p.isPaid);
    const totalAmount = paidPayments.reduce((sum, p) => sum + p.amount, 0);

    // Her ayın ilk günü sabah 9:00
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "📈 Aylık Finansal Rapor",
        body: `Geçen ay ${paidPayments.length} ödeme yaptınız (Toplam: ${totalAmount}₺)`,
        data: { type: "monthly_summary" },
        sound: settings.sound,
        vibrate: settings.vibration ? [0, 250, 250, 250] : undefined,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        day: 1,
        hour: 9,
        minute: 0,
      },
    });
  } catch (error) {
    console.error("Error scheduling monthly summary:", error);
  }
}

/**
 * Tüm akıllı bildirimleri planla
 */
export async function scheduleAllSmartNotifications(payments: Payment[]) {
  try {
    // Önce tüm bildirimleri iptal et
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Ödeme hatırlatmalarını planla
    for (const payment of payments) {
      if (!payment.isPaid) {
        await schedulePaymentReminder(payment);
      }
    }

    // Özet bildirimlerini planla
    await scheduleDailySummary(payments);
    await scheduleWeeklySummary(payments);
    await scheduleMonthlySummary(payments);

    console.log("All smart notifications scheduled successfully");
  } catch (error) {
    console.error("Error scheduling all smart notifications:", error);
  }
}

/**
 * Geciken ödemeleri kontrol et ve uyar
 */
export async function checkOverduePayments(payments: Payment[]) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overduePayments = payments.filter((payment) => {
      const paymentDate = new Date(payment.dueDate);
      return paymentDate < today && !payment.isPaid;
    });

    for (const payment of overduePayments) {
      await sendOverdueAlert(payment);
    }
  } catch (error) {
    console.error("Error checking overdue payments:", error);
  }
}
