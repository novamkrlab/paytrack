import { Payment, PaymentCategory } from "@/types";

/**
 * Gruplu borç tipi
 */
export interface GroupedDebt {
  /** Grup ID (ilk ödemenin ID'si) */
  id: string;
  /** Borç adı (ilk ödemenin adı) */
  name: string;
  /** Kategori */
  category: PaymentCategory;
  /** Toplam borç tutarı (tüm taksitlerin toplamı) */
  totalAmount: number;
  /** Ödenen tutar */
  paidAmount: number;
  /** Kalan tutar */
  remainingAmount: number;
  /** Toplam taksit sayısı */
  totalInstallments: number;
  /** Ödenen taksit sayısı */
  paidInstallments: number;
  /** Kalan taksit sayısı */
  remainingInstallments: number;
  /** Aylık ödeme tutarı */
  monthlyPayment: number;
  /** İlk ödeme tarihi */
  firstDueDate: string;
  /** Son ödeme tarihi */
  lastDueDate: string;
  /** Bir sonraki ödeme tarihi */
  nextDueDate: string | null;

  /** Tüm ödemeler */
  payments: Payment[];
  /** Vadesi geçmiş ödeme var mı? */
  hasOverdue: boolean;
}

/**
 * Tekrarlayan ödemeleri grupla
 * Aynı isimde ve kategoride olan ödemeleri tek borç olarak gruplar
 */
export function groupRecurringDebts(payments: Payment[]): GroupedDebt[] {
  // Sadece kredi ve kredi kartı ödemelerini filtrele
  const debtPayments = payments.filter(
    (p) => p.category === PaymentCategory.LOAN || p.category === PaymentCategory.CREDIT_CARD
  );

  // İsim ve kategoriye göre grupla
  // Parantez içindeki sayıları temizle (örn: "Denizbank (1)" -> "Denizbank")
  const groups = new Map<string, Payment[]>();
  
  for (const payment of debtPayments) {
    // Parantez içindeki sayıyı temizle
    const cleanName = payment.name.replace(/\s*\(\d+\)\s*$/, "").trim();
    const key = `${cleanName}-${payment.category}`;
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(payment);
  }

  // Her grubu GroupedDebt'e dönüştür
  const groupedDebts: GroupedDebt[] = [];

  for (const [key, groupPayments] of groups.entries()) {
    // Tarihe göre sırala (en eski önce)
    groupPayments.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    const firstPayment = groupPayments[0];
    const lastPayment = groupPayments[groupPayments.length - 1];
    
    // Temiz ismi kullan (parantez olmadan)
    const cleanName = firstPayment.name.replace(/\s*\(\d+\)\s*$/, "").trim();

    // Toplam tutar
    const totalAmount = groupPayments.reduce((sum, p) => sum + p.amount, 0);

    // Ödenen tutar
    const paidAmount = groupPayments
      .filter((p) => p.isPaid)
      .reduce((sum, p) => sum + p.amount, 0);

    // Kalan tutar
    const remainingAmount = totalAmount - paidAmount;

    // Taksit sayıları
    const totalInstallments = groupPayments.length;
    const paidInstallments = groupPayments.filter((p) => p.isPaid).length;
    const remainingInstallments = totalInstallments - paidInstallments;

    // Aylık ödeme (ortalama)
    const monthlyPayment = totalAmount / totalInstallments;

    // Bir sonraki ödeme tarihi (ilk ödenmemiş ödeme)
    const nextPayment = groupPayments.find((p) => !p.isPaid);
    const nextDueDate = nextPayment ? nextPayment.dueDate : null;

    // Vadesi geçmiş ödeme var mı?
    const now = new Date();
    const hasOverdue = groupPayments.some(
      (p) => !p.isPaid && new Date(p.dueDate) < now
    );

    groupedDebts.push({
      id: firstPayment.id,
      name: cleanName,
      category: firstPayment.category,
      totalAmount,
      paidAmount,
      remainingAmount,
      totalInstallments,
      paidInstallments,
      remainingInstallments,
      monthlyPayment,
      firstDueDate: firstPayment.dueDate,
      lastDueDate: lastPayment.dueDate,
      nextDueDate,

      payments: groupPayments,
      hasOverdue,
    });
  }

  // Kalan tutara göre sırala (en yüksek önce)
  return groupedDebts.sort((a, b) => b.remainingAmount - a.remainingAmount);
}

/**
 * Borç ilerleme yüzdesini hesapla
 */
export function calculateDebtProgress(debt: GroupedDebt): number {
  if (debt.totalInstallments === 0) return 0;
  return (debt.paidInstallments / debt.totalInstallments) * 100;
}
