/**
 * Tarih Hesaplama Yardımcı Fonksiyonları
 */

import { RecurrenceFrequency } from "@/types";

/**
 * İki tarih arasındaki dönem sayısını hesaplar
 */
export function calculatePeriodCount(
  startDate: Date,
  endDate: Date,
  frequency: RecurrenceFrequency
): number {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Tarih farkını milisaniye cinsinden hesapla
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  switch (frequency) {
    case RecurrenceFrequency.DAILY:
      return diffDays;
    case RecurrenceFrequency.WEEKLY:
      return Math.ceil(diffDays / 7);
    case RecurrenceFrequency.MONTHLY:
      const months =
        (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth());
      return Math.max(1, months);
    case RecurrenceFrequency.YEARLY:
      return Math.max(1, end.getFullYear() - start.getFullYear());
    default:
      return 1;
  }
}

/**
 * Toplam tutarı hesaplar (dönemlik tutar × dönem sayısı)
 */
export function calculateTotalAmount(
  amount: number,
  startDate: Date,
  endDate: Date,
  frequency: RecurrenceFrequency
): number {
  const periodCount = calculatePeriodCount(startDate, endDate, frequency);
  return amount * periodCount;
}
