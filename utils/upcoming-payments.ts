/**
 * Yakında Gelecek Ödemeler Yardımcı Fonksiyonları
 */

import { Payment } from "@/types";
import i18n from "@/i18n";

/**
 * İki tarihin aynı gün olup olmadığını kontrol eder
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Tarihin bugünden kaç gün sonra olduğunu hesaplar
 */
export function getDaysUntil(date: Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Yaklaşan ödemeleri filtreler (bugün + sonraki N gün)
 */
export function getUpcomingPayments(
  payments: Payment[],
  days: number = 7
): Payment[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const futureDate = new Date(today);
  futureDate.setDate(futureDate.getDate() + days);
  
  return payments
    .filter((payment) => {
      const paymentDate = new Date(payment.dueDate);
      paymentDate.setHours(0, 0, 0, 0);
      return paymentDate >= today && paymentDate <= futureDate && payment.status !== "paid";
    })
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
}

/**
 * Bugün ödenecek ödemeleri filtreler
 */
export function getTodayPayments(payments: Payment[]): Payment[] {
  const today = new Date();
  return payments.filter(
    (payment) =>
      isSameDay(new Date(payment.dueDate), today) && payment.status !== "paid"
  );
}

/**
 * Yarın ödenecek ödemeleri filtreler
 */
export function getTomorrowPayments(payments: Payment[]): Payment[] {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return payments.filter(
    (payment) =>
      isSameDay(new Date(payment.dueDate), tomorrow) && payment.status !== "paid"
  );
}

/**
 * Bildirim için özet metin oluşturur
 */
export function generateNotificationSummary(payments: Payment[]): {
  title: string;
  body: string;
} {
  const todayPayments = getTodayPayments(payments);
  const tomorrowPayments = getTomorrowPayments(payments);
  const upcomingPayments = getUpcomingPayments(payments, 7);

  if (upcomingPayments.length === 0) {
    return {
      title: i18n.t("notifications.noUpcoming"),
      body: i18n.t("notifications.noUpcomingBody"),
    };
  }

  const totalAmount = upcomingPayments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );

  let title = "";
  let body = "";

  const locale = i18n.language === "tr" ? "tr-TR" : "en-US";

  if (todayPayments.length > 0) {
    title = i18n.t("notifications.todayCount", { count: todayPayments.length });
    const todayTotal = todayPayments.reduce((sum, p) => sum + p.amount, 0);
    body = `${i18n.t("notifications.total")}: ${todayTotal.toLocaleString(locale)} ₺\n`;
    
    if (tomorrowPayments.length > 0) {
      body += `${i18n.t("notifications.tomorrow")}: ${tomorrowPayments.length}\n`;
    }
    
    if (upcomingPayments.length > todayPayments.length + tomorrowPayments.length) {
      const remainingCount = upcomingPayments.length - todayPayments.length - tomorrowPayments.length;
      body += `${i18n.t("notifications.thisWeek")}: ${i18n.t("notifications.morePayments", { count: remainingCount })}`;
    }
  } else if (tomorrowPayments.length > 0) {
    title = i18n.t("notifications.tomorrowCount", { count: tomorrowPayments.length });
    const tomorrowTotal = tomorrowPayments.reduce((sum, p) => sum + p.amount, 0);
    body = `${i18n.t("notifications.total")}: ${tomorrowTotal.toLocaleString(locale)} ₺\n`;
    
    if (upcomingPayments.length > tomorrowPayments.length) {
      const remainingCount = upcomingPayments.length - tomorrowPayments.length;
      body += `${i18n.t("notifications.thisWeek")}: ${i18n.t("notifications.morePayments", { count: remainingCount })}`;
    }
  } else {
    title = i18n.t("notifications.thisWeekCount", { count: upcomingPayments.length });
    body = `${i18n.t("notifications.total")}: ${totalAmount.toLocaleString(locale)} ₺\n`;
    body += `${i18n.t("notifications.firstPayment")}: ${upcomingPayments[0].name} (${i18n.t("notifications.daysLater", { count: getDaysUntil(new Date(upcomingPayments[0].dueDate)) })})`;
  }

  return { title, body: body.trim() };
}
