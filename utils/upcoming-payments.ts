/**
 * Yakında Gelecek Ödemeler Yardımcı Fonksiyonları
 */

import { Payment } from "@/types";

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
      title: "Yaklaşan Ödeme Yok",
      body: "Önümüzdeki 7 gün içinde ödenecek ödeme bulunmuyor.",
    };
  }

  const totalAmount = upcomingPayments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );

  let title = "";
  let body = "";

  if (todayPayments.length > 0) {
    title = `Bugün ${todayPayments.length} Ödeme Var`;
    const todayTotal = todayPayments.reduce((sum, p) => sum + p.amount, 0);
    body = `Toplam: ${todayTotal.toLocaleString("tr-TR")} ₺\n`;
    
    if (tomorrowPayments.length > 0) {
      body += `Yarın: ${tomorrowPayments.length} ödeme\n`;
    }
    
    if (upcomingPayments.length > todayPayments.length + tomorrowPayments.length) {
      const remainingCount = upcomingPayments.length - todayPayments.length - tomorrowPayments.length;
      body += `Bu hafta: ${remainingCount} ödeme daha`;
    }
  } else if (tomorrowPayments.length > 0) {
    title = `Yarın ${tomorrowPayments.length} Ödeme Var`;
    const tomorrowTotal = tomorrowPayments.reduce((sum, p) => sum + p.amount, 0);
    body = `Toplam: ${tomorrowTotal.toLocaleString("tr-TR")} ₺\n`;
    
    if (upcomingPayments.length > tomorrowPayments.length) {
      const remainingCount = upcomingPayments.length - tomorrowPayments.length;
      body += `Bu hafta: ${remainingCount} ödeme daha`;
    }
  } else {
    title = `Bu Hafta ${upcomingPayments.length} Ödeme Var`;
    body = `Toplam: ${totalAmount.toLocaleString("tr-TR")} ₺\n`;
    body += `İlk ödeme: ${upcomingPayments[0].name} (${getDaysUntil(new Date(upcomingPayments[0].dueDate))} gün sonra)`;
  }

  return { title, body: body.trim() };
}
