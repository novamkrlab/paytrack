/**
 * Taksit Yardımcı Fonksiyonları
 */

import { Payment, PaymentCategory, PaymentStatus, RecurrenceFrequency } from "@/types";

/**
 * Taksitli ödeme için tüm taksitleri otomatik oluşturur
 */
export function generateInstallments(
  baseName: string,
  amount: number,
  category: PaymentCategory,
  startDate: Date,
  totalInstallments: number,
  notes?: string
): Payment[] {
  const installments: Payment[] = [];

  for (let i = 1; i <= totalInstallments; i++) {
    // Her taksit için tarih hesapla (aylık)
    const installmentDate = new Date(startDate);
    installmentDate.setMonth(installmentDate.getMonth() + (i - 1));

    // Son taksit tarihi hesapla
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + (totalInstallments - 1));

    const installment: Payment = {
      id: `${Date.now()}-${i}`,
      name: `${baseName} ${i}/${totalInstallments}`,
      amount,
      category,
      dueDate: installmentDate.toISOString(),
      status: PaymentStatus.PENDING,
      installments: {
        current: i,
        total: totalInstallments,
      },

      notes: notes ? `${notes} (Taksit ${i}/${totalInstallments})` : `Taksit ${i}/${totalInstallments}`,
      isPaid: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    installments.push(installment);
  }

  return installments;
}

/**
 * Taksit bilgisi metnini formatlar
 */
export function formatInstallmentInfo(current: number, total: number): string {
  return `${current}/${total} Taksit`;
}

/**
 * Kalan taksit sayısını hesaplar
 */
export function calculateRemainingInstallments(current: number, total: number): number {
  return Math.max(0, total - current + 1);
}

/**
 * Tekrarlanan ödeme için tüm ödemeleri otomatik oluşturur
 */
export function generateRecurringPayments(
  baseName: string,
  amount: number,
  category: PaymentCategory,
  startDate: Date,
  endDate: Date,
  frequency: RecurrenceFrequency,
  notes?: string
): Payment[] {
  const payments: Payment[] = [];
  let currentDate = new Date(startDate);
  const finalDate = new Date(endDate);
  let index = 1;

  while (currentDate <= finalDate) {
    const payment: Payment = {
      id: `${Date.now()}-${index}`,
      name: `${baseName} (${index})`,
      amount,
      category,
      dueDate: currentDate.toISOString(),
      status: PaymentStatus.PENDING,
      recurrence: {
        frequency,
        endDate: endDate.toISOString(),
      },
      notes: notes ? `${notes} (Tekrar ${index})` : `Tekrar ${index}`,
      isPaid: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    payments.push(payment);

    // Bir sonraki tarihi hesapla
    const nextDate = new Date(currentDate);
    switch (frequency) {
      case RecurrenceFrequency.DAILY:
        nextDate.setDate(nextDate.getDate() + 1);
        break;
      case RecurrenceFrequency.WEEKLY:
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case RecurrenceFrequency.MONTHLY:
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      case RecurrenceFrequency.YEARLY:
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
    }

    currentDate = nextDate;
    index++;

    // Sonsuz döngüyü önle
    if (index > 1000) break;
  }

  return payments;
}
