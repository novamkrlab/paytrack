/**
 * Taksit Yardımcı Fonksiyonları
 */

import { Payment, PaymentCategory, PaymentStatus } from "@/types";

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
