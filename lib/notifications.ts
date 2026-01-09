/**
 * Bildirim Yönetimi
 * Yerel bildirimler için yardımcı fonksiyonlar
 */

import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { Payment } from "@/types";
import { formatCurrency, formatDate } from "@/utils/helpers";

// Bildirim davranışını yapılandır
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Bildirim izni iste
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === "web") {
    return false; // Web'de bildirim desteği yok
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === "granted";
}

/**
 * Ödeme için bildirim planla
 * @param payment Ödeme bilgisi
 * @param daysBefore Kaç gün önceden bildirim gönderilecek
 */
export async function schedulePaymentNotification(
  payment: Payment,
  daysBefore: number = 3
): Promise<string | null> {
  if (Platform.OS === "web") {
    return null;
  }

  try {
    // İzin kontrolü
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      console.log("Bildirim izni verilmedi");
      return null;
    }

    // Bildirim tarihini hesapla
    const dueDate = new Date(payment.dueDate);
    const notificationDate = new Date(dueDate);
    notificationDate.setDate(dueDate.getDate() - daysBefore);
    notificationDate.setHours(9, 0, 0, 0); // Sabah 9:00'da bildirim

    // Eğer bildirim tarihi geçmişse, bildirim planlanmaz
    if (notificationDate < new Date()) {
      console.log("Bildirim tarihi geçmiş, planlanmadı");
      return null;
    }

    // Bildirimi planla
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Ödeme Hatırlatması",
        body: `${payment.name} - ${formatCurrency(payment.amount, "TRY")} ödemesi ${formatDate(payment.dueDate)} tarihinde yapılacak.`,
        data: {
          paymentId: payment.id,
          type: "payment_reminder",
        },
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: notificationDate,
      },
    });

    console.log(`Bildirim planlandı: ${notificationId}`);
    return notificationId;
  } catch (error) {
    console.error("Bildirim planlama hatası:", error);
    return null;
  }
}

/**
 * Tüm ödemeler için bildirimleri planla
 * @param payments Ödemeler listesi
 * @param daysBefore Kaç gün önceden bildirim gönderilecek
 */
export async function scheduleAllPaymentNotifications(
  payments: Payment[],
  daysBefore: number = 3
): Promise<void> {
  if (Platform.OS === "web") {
    return;
  }

  // Önce tüm mevcut bildirimleri iptal et
  await Notifications.cancelAllScheduledNotificationsAsync();

  // Ödenmemiş ödemeler için bildirimleri planla
  const unpaidPayments = payments.filter((p) => !p.isPaid);

  for (const payment of unpaidPayments) {
    await schedulePaymentNotification(payment, daysBefore);
  }

  console.log(`${unpaidPayments.length} ödeme için bildirim planlandı`);
}

/**
 * Belirli bir ödeme için bildirimi iptal et
 * @param paymentId Ödeme ID'si
 */
export async function cancelPaymentNotification(paymentId: string): Promise<void> {
  if (Platform.OS === "web") {
    return;
  }

  try {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    
    for (const notification of scheduledNotifications) {
      if (notification.content.data?.paymentId === paymentId) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
        console.log(`Bildirim iptal edildi: ${notification.identifier}`);
      }
    }
  } catch (error) {
    console.error("Bildirim iptal hatası:", error);
  }
}

/**
 * Tüm bildirimleri iptal et
 */
export async function cancelAllNotifications(): Promise<void> {
  if (Platform.OS === "web") {
    return;
  }

  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log("Tüm bildirimler iptal edildi");
  } catch (error) {
    console.error("Bildirim iptal hatası:", error);
  }
}

/**
 * Anlık bildirim gönder (test amaçlı)
 */
export async function sendTestNotification(): Promise<void> {
  if (Platform.OS === "web") {
    return;
  }

  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      console.log("Bildirim izni verilmedi");
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Test Bildirimi",
        body: "Bildirimler başarıyla çalışıyor!",
        data: { type: "test" },
      },
      trigger: null, // Hemen gönder
    });

    console.log("Test bildirimi gönderildi");
  } catch (error) {
    console.error("Test bildirimi hatası:", error);
  }
}
