/**
 * Borç Yönetimi Veri Modelleri
 */

/**
 * Tek bir borç kalemi
 */
export interface DebtItem {
  /** Borç ID'si (ödeme kaydından gelir) */
  id: string;
  /** Borç adı */
  name: string;
  /** Toplam borç tutarı (başlangıç) */
  totalAmount: number;
  /** Kalan borç tutarı */
  remainingAmount: number;
  /** Aylık taksit tutarı */
  monthlyPayment: number;
  /** Aylık faiz oranı (yüzde olarak, örn: 1.5 = %1.5) */
  interestRate: number;
  /** Kalan taksit sayısı */
  remainingMonths: number;
  /** Borç kategorisi */
  category: string;
  /** Para birimi */
  currency: string;
  /** Oluşturulma tarihi */
  createdAt: string;
  /** Son ödeme tarihi */
  lastPaymentDate?: string;
}

/**
 * Borç özet bilgileri
 */
export interface DebtSummary {
  /** Toplam borç tutarı */
  totalDebt: number;
  /** Aylık toplam taksit tutarı */
  monthlyPayment: number;
  /** Ortalama faiz oranı */
  averageInterestRate: number;
  /** Aktif borç sayısı */
  activeDebts: number;
  /** Borç listesi */
  debts: DebtItem[];
  /** Toplam ödenen tutar */
  totalPaid: number;
  /** Toplam ödenen faiz */
  totalInterestPaid: number;
}

/**
 * Borç ödeme stratejisi türü
 */
export enum DebtPayoffStrategy {
  /** Kar Topu: En küçük borçtan başla */
  SNOWBALL = 'snowball',
  /** Çığ: En yüksek faizli borçtan başla */
  AVALANCHE = 'avalanche',
}

/**
 * Borç ödeme planı
 */
export interface DebtPayoffPlan {
  /** Strateji türü */
  strategy: DebtPayoffStrategy;
  /** Toplam ödeme süresi (ay) */
  totalMonths: number;
  /** Toplam ödenecek tutar */
  totalPayment: number;
  /** Toplam ödenecek faiz */
  totalInterest: number;
  /** Aylık ödeme planı */
  monthlyPlan: MonthlyPayoffPlan[];
  /** Borç ödeme sırası */
  payoffOrder: DebtPayoffOrder[];
}

/**
 * Aylık ödeme planı
 */
export interface MonthlyPayoffPlan {
  /** Ay numarası (1'den başlar) */
  month: number;
  /** O aydaki toplam ödeme */
  totalPayment: number;
  /** Ana para ödemesi */
  principalPayment: number;
  /** Faiz ödemesi */
  interestPayment: number;
  /** Kalan toplam borç */
  remainingDebt: number;
}

/**
 * Borç ödeme sırası
 */
export interface DebtPayoffOrder {
  /** Borç ID'si */
  debtId: string;
  /** Borç adı */
  debtName: string;
  /** Ödeme sırası (1'den başlar) */
  order: number;
  /** Tahmini ödeme süresi (ay) */
  monthsToPayoff: number;
  /** Ödenecek toplam tutar */
  totalPayment: number;
  /** Ödenecek faiz */
  interestPayment: number;
}

/**
 * Strateji karşılaştırması
 */
export interface StrategyComparison {
  /** Kar Topu stratejisi planı */
  snowball: DebtPayoffPlan;
  /** Çığ stratejisi planı */
  avalanche: DebtPayoffPlan;
  /** Fark (ay) */
  timeDifference: number;
  /** Fark (tutar) */
  costDifference: number;
  /** Önerilen strateji */
  recommendedStrategy: DebtPayoffStrategy;
}

/**
 * Borç istatistikleri
 */
export interface DebtStatistics {
  /** Toplam borç */
  totalDebt: number;
  /** Ödenen toplam */
  totalPaid: number;
  /** Ödeme yüzdesi */
  paymentProgress: number;
  /** Ortalama aylık ödeme */
  averageMonthlyPayment: number;
  /** Tahmini bitirme tarihi */
  estimatedPayoffDate: string;
  /** En yüksek faizli borç */
  highestInterestDebt?: DebtItem;
  /** En büyük borç */
  largestDebt?: DebtItem;
}

/**
 * Borç hesaplama sabitleri
 */
export const DEBT_CONSTANTS = {
  /** Minimum faiz oranı (%) */
  MIN_INTEREST_RATE: 0,
  /** Maksimum faiz oranı (%) */
  MAX_INTEREST_RATE: 100,
  /** Minimum aylık ödeme */
  MIN_MONTHLY_PAYMENT: 0,
  /** Maksimum hesaplama süresi (ay) */
  MAX_CALCULATION_MONTHS: 600, // 50 yıl
} as const;
