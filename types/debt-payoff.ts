/**
 * Borç Azaltma Planı Tip Tanımlamaları
 */

/**
 * Borç azaltma yöntemi
 */
export type DebtPayoffMethod = 'snowball' | 'avalanche';

/**
 * Borç bilgisi (ödeme verilerinden türetilir)
 */
export interface DebtInfo {
  id: string;
  name: string;
  balance: number; // Kalan borç miktarı
  interestRate: number; // Yıllık faiz oranı (örn: 0.25 = %25)
  minimumPayment: number; // Minimum aylık ödeme
  dueDate: string; // Vade tarihi
}

/**
 * Aylık ödeme detayı
 */
export interface MonthlyPayment {
  month: number; // Kaçıncı ay
  debtId: string; // Hangi borca ödeme yapıldı
  debtName: string; // Borç adı
  principal: number; // Anapara ödemesi
  interest: number; // Faiz ödemesi
  totalPayment: number; // Toplam ödeme (anapara + faiz)
  remainingBalance: number; // Kalan borç
  isFullyPaid: boolean; // Borç tamamen ödendi mi?
}

/**
 * Borç azaltma planı
 */
export interface DebtPayoffPlan {
  method: DebtPayoffMethod; // Hangi yöntem kullanıldı
  totalMonths: number; // Kaç ayda bitecek
  totalInterest: number; // Toplam ödenecek faiz
  totalPrincipal: number; // Toplam anapara
  totalPayment: number; // Toplam ödeme (anapara + faiz)
  monthlyExtraPayment: number; // Aylık ekstra ödeme miktarı
  monthlyPayments: MonthlyPayment[]; // Aylık ödeme detayları
  debtOrder: string[]; // Borçların ödeme sırası (debt ID'leri)
}

/**
 * İki yöntemin karşılaştırması
 */
export interface PayoffComparison {
  snowball: DebtPayoffPlan;
  avalanche: DebtPayoffPlan;
  monthsDifference: number; // Ay farkı (pozitif = kar topu daha uzun)
  interestDifference: number; // Faiz farkı (pozitif = kar topu daha fazla faiz)
  recommendedMethod: DebtPayoffMethod; // Önerilen yöntem
}

/**
 * Borç azaltma özeti
 */
export interface DebtPayoffSummary {
  totalDebts: number; // Toplam borç sayısı
  totalBalance: number; // Toplam borç miktarı
  averageInterestRate: number; // Ortalama faiz oranı
  totalMinimumPayment: number; // Toplam minimum aylık ödeme
  availableExtraPayment: number; // Kullanılabilir ekstra ödeme (gelir - harcama - minimum ödeme)
}
