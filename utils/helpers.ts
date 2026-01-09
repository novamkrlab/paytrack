/**
 * Yardımcı Fonksiyonlar
 */

import { Payment, PaymentStatus } from "@/types";

/**
 * Tarihi Türkçe formatta gösterir
 * @param dateString ISO 8601 tarih string'i
 * @returns Türkçe formatlanmış tarih (örn: "15 Ocak 2026")
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const months = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

/**
 * Tarihi kısa formatta gösterir
 * @param dateString ISO 8601 tarih string'i
 * @returns Kısa formatlanmış tarih (örn: "15.01.2026")
 */
export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

/**
 * Para birimini formatlar
 * @param amount Tutar
 * @param currency Para birimi (varsayılan: TRY)
 * @returns Formatlanmış tutar (örn: "1.234,56 ₺")
 */
export function formatCurrency(amount: number, currency: string = "TRY"): string {
  const currencySymbols: Record<string, string> = {
    TRY: "₺",
    USD: "$",
    EUR: "€",
    GBP: "£",
  };

  const symbol = currencySymbols[currency] || currency;
  const formatted = amount.toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return currency === "TRY" ? `${formatted} ${symbol}` : `${symbol}${formatted}`;
}

/**
 * İki tarih arasındaki gün farkını hesaplar
 * @param date1 İlk tarih
 * @param date2 İkinci tarih
 * @returns Gün farkı
 */
export function getDaysDifference(date1: Date, date2: Date): number {
  const diffTime = date2.getTime() - date1.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Ödeme durumuna göre renk döndürür
 * @param status Ödeme durumu
 * @returns Tailwind renk sınıfı
 */
export function getStatusColor(status: PaymentStatus): string {
  switch (status) {
    case PaymentStatus.PAID:
      return "text-success";
    case PaymentStatus.OVERDUE:
      return "text-error";
    case PaymentStatus.PENDING:
      return "text-warning";
    default:
      return "text-muted";
  }
}

/**
 * Ödeme durumuna göre arka plan rengi döndürür
 * @param status Ödeme durumu
 * @returns Tailwind arka plan renk sınıfı
 */
export function getStatusBgColor(status: PaymentStatus): string {
  switch (status) {
    case PaymentStatus.PAID:
      return "bg-success/10";
    case PaymentStatus.OVERDUE:
      return "bg-error/10";
    case PaymentStatus.PENDING:
      return "bg-warning/10";
    default:
      return "bg-muted/10";
  }
}

/**
 * Yaklaşan ödemeleri filtreler (önümüzdeki 7 gün)
 * @param payments Tüm ödemeler
 * @returns Yaklaşan ödemeler
 */
export function getUpcomingPayments(payments: Payment[]): Payment[] {
  const today = new Date();
  const sevenDaysLater = new Date();
  sevenDaysLater.setDate(today.getDate() + 7);

  return payments
    .filter((payment) => {
      if (payment.isPaid) return false;
      const dueDate = new Date(payment.dueDate);
      return dueDate >= today && dueDate <= sevenDaysLater;
    })
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
}

/**
 * Gecikmiş ödemeleri filtreler
 * @param payments Tüm ödemeler
 * @returns Gecikmiş ödemeler
 */
export function getOverduePayments(payments: Payment[]): Payment[] {
  const today = new Date();
  return payments
    .filter((payment) => {
      if (payment.isPaid) return false;
      const dueDate = new Date(payment.dueDate);
      return dueDate < today;
    })
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
}

/**
 * Belirli bir ay için ödemeleri filtreler
 * @param payments Tüm ödemeler
 * @param year Yıl
 * @param month Ay (0-11)
 * @returns O aya ait ödemeler
 */
export function getPaymentsByMonth(
  payments: Payment[],
  year: number,
  month: number
): Payment[] {
  return payments.filter((payment) => {
    const dueDate = new Date(payment.dueDate);
    return dueDate.getFullYear() === year && dueDate.getMonth() === month;
  });
}

/**
 * Belirli bir tarih için ödemeleri ve gelirleri döndürür
 * @param payments Tüm ödemeler
 * @param incomes Tüm gelirler
 * @param dateString Tarih
 * @returns O tarihe ait ödemeler ve gelirler
 */
export function getItemsByDate(
  payments: Payment[],
  incomes: any[],
  dateString: string
): { payments: Payment[]; incomes: any[] } {
  const targetDate = new Date(dateString);
  targetDate.setHours(0, 0, 0, 0);

  const filteredPayments = payments.filter((payment) => {
    const paymentDate = new Date(payment.dueDate);
    paymentDate.setHours(0, 0, 0, 0);
    return paymentDate.getTime() === targetDate.getTime();
  });

  const filteredIncomes = incomes.filter((income) => {
    const incomeDate = new Date(income.date);
    incomeDate.setHours(0, 0, 0, 0);
    return incomeDate.getTime() === targetDate.getTime();
  });

  return { payments: filteredPayments, incomes: filteredIncomes };
}

/**
 * Aylık toplam ödeme tutarını hesaplar
 * @param payments Ödemeler
 * @param year Yıl
 * @param month Ay (0-11)
 * @returns Toplam tutar
 */
export function calculateMonthlyPaymentTotal(
  payments: Payment[],
  year: number,
  month: number
): number {
  const monthlyPayments = getPaymentsByMonth(payments, year, month);
  return monthlyPayments.reduce((total, payment) => total + payment.amount, 0);
}

/**
 * Aylık toplam gelir tutarını hesaplar
 * @param incomes Gelirler
 * @param year Yıl
 * @param month Ay (0-11)
 * @returns Toplam tutar
 */
export function calculateMonthlyIncomeTotal(
  incomes: any[],
  year: number,
  month: number
): number {
  const monthlyIncomes = incomes.filter((income) => {
    const incomeDate = new Date(income.date);
    return incomeDate.getFullYear() === year && incomeDate.getMonth() === month;
  });
  return monthlyIncomes.reduce((total, income) => total + income.amount, 0);
}
