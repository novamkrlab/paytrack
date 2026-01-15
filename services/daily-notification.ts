/**
 * Günlük Bildirim Servisi
 * Her sabah saat 8'de yaklaşan ödemeleri bildirir
 */

import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Payment } from "@/types";
import {
  getUpcomingPayments,
  generateNotificationSummary,
} from "@/utils/upcoming-payments";

const DAILY_NOTIFICATION_ID = "daily-payment-notification";
const NOTIFICATION_ENABLED_KEY = "daily_notification_enabled";
const NOTIFICATION_HOUR_KEY = "daily_notification_hour";

/**
 * Günlük bildirimi zamanla
 */
export async function scheduleDailyNotification(
  payments: Payment[],
  hour: number = 8
): Promise<void> {
  try {
    // Önceki bildirimi iptal et
    await Notifications.cancelScheduledNotificationAsync(DAILY_NOTIFICATION_ID);

    // Bildirim izni kontrol et
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      console.log("Bildirim izni verilmedi");
      return;
    }

    // Bildirim etkin mi kontrol et
    const enabled = await AsyncStorage.getItem(NOTIFICATION_ENABLED_KEY);
    if (enabled === "false") {
      console.log("Günlük bildirim devre dışı");
      return;
    }

    // Yaklaşan ödemeleri al
    const upcomingPayments = getUpcomingPayments(payments, 7);

    // Eğer yaklaşan ödeme yoksa bildirim gönderme
    if (upcomingPayments.length === 0) {
      console.log("Yaklaşan ödeme yok, bildirim zamanlanmadı");
      return;
    }

    // Bildirim içeriğini hazırla
    const { title, body } = generateNotificationSummary(upcomingPayments);

    // Her gün belirlenen saatte çalışacak trigger oluştur
    const trigger: Notifications.DailyTriggerInput = {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute: 0,
    };

    // Bildirimi zamanla
    await Notifications.scheduleNotificationAsync({
      identifier: DAILY_NOTIFICATION_ID,
      content: {
        title,
        body,
        data: { screen: "payments" },
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger,
    });

    console.log(`Günlük bildirim zamanlandı: Her gün saat ${hour}:00`);
  } catch (error) {
    console.error("Günlük bildirim zamanlama hatası:", error);
  }
}

/**
 * Günlük bildirimi iptal et
 */
export async function cancelDailyNotification(): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(DAILY_NOTIFICATION_ID);
    console.log("Günlük bildirim iptal edildi");
  } catch (error) {
    console.error("Günlük bildirim iptal hatası:", error);
  }
}

/**
 * Bildirim ayarlarını kaydet
 */
export async function saveDailyNotificationSettings(
  enabled: boolean,
  hour: number = 8
): Promise<void> {
  try {
    await AsyncStorage.setItem(
      NOTIFICATION_ENABLED_KEY,
      enabled.toString()
    );
    await AsyncStorage.setItem(NOTIFICATION_HOUR_KEY, hour.toString());
    console.log(`Bildirim ayarları kaydedildi: ${enabled ? "Açık" : "Kapalı"}, Saat: ${hour}:00`);
  } catch (error) {
    console.error("Bildirim ayarları kaydetme hatası:", error);
  }
}

/**
 * Bildirim ayarlarını oku
 */
export async function getDailyNotificationSettings(): Promise<{
  enabled: boolean;
  hour: number;
}> {
  try {
    const enabled = await AsyncStorage.getItem(NOTIFICATION_ENABLED_KEY);
    const hour = await AsyncStorage.getItem(NOTIFICATION_HOUR_KEY);

    return {
      enabled: enabled !== "false", // Varsayılan: true
      hour: hour ? parseInt(hour) : 8, // Varsayılan: 8
    };
  } catch (error) {
    console.error("Bildirim ayarları okuma hatası:", error);
    return { enabled: true, hour: 8 };
  }
}

/**
 * Bildirim izni iste
 */
export async function requestNotificationPermission(): Promise<boolean> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    
    if (existingStatus === "granted") {
      return true;
    }

    const { status } = await Notifications.requestPermissionsAsync();
    return status === "granted";
  } catch (error) {
    console.error("Bildirim izni isteme hatası:", error);
    return false;
  }
}
