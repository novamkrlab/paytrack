/**
 * Borç Detay Ekranı için veri modelleri
 */

export interface DebtPayment {
  month: number;
  date: Date;
  principal: number; // Anapara
  interest: number; // Faiz
  total: number; // Toplam ödeme
  remainingBalance: number; // Kalan bakiye
}

export interface DebtDetail {
  id: string;
  name: string;
  totalAmount: number; // Toplam borç
  interestRate: number; // Yıllık faiz oranı (%)
  monthlyPayment: number; // Aylık ödeme
  remainingMonths: number; // Kalan ay sayısı
  totalInterest: number; // Toplam ödenecek faiz
  paymentPlan: DebtPayment[]; // Ödeme planı
}

export interface EarlyPaymentSimulation {
  extraPayment: number; // Ekstra ödeme miktarı
  newMonths: number; // Yeni süre
  savedInterest: number; // Tasarruf edilen faiz
  savedMonths: number; // Kazanılan ay
  newTotalInterest: number; // Yeni toplam faiz
}

export interface DebtStrategy {
  type: 'snowball' | 'avalanche';
  title: string;
  description: string;
  pros: string[];
  cons: string[];
  recommended: boolean;
}
