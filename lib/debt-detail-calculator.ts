import type { DebtDetail, DebtPayment, EarlyPaymentSimulation, DebtStrategy } from '@/types/debt-detail';
import type { Payment } from '@/types';
import { PaymentCategory } from '@/types';

/**
 * Ödeme verisinden borç detayı hesapla
 */
export function calculateDebtDetail(payment: Payment): DebtDetail | null {
  // Sadece kredi ve kredi kartı için
  if (payment.category !== PaymentCategory.LOAN && payment.category !== PaymentCategory.CREDIT_CARD) {
    return null;
  }

  const totalAmount = payment.amount;
  const interestRate = 0; // Payment tipinde interestRate yok, varsayılan 0
  const monthlyRate = interestRate / 100 / 12;
  
  // Taksit sayısını belirle
  let remainingMonths = 12; // Varsayılan
  if (payment.installments) {
    remainingMonths = payment.installments.total;
  } else if (payment.recurrence?.endDate) {
    const start = new Date(payment.dueDate);
    const end = new Date(payment.recurrence.endDate);
    remainingMonths = Math.max(1, Math.round((end.getTime() - start.getTime()) / (30 * 24 * 60 * 60 * 1000)));
  }

  // Aylık ödeme hesapla (faizli)
  let monthlyPayment: number;
  if (monthlyRate === 0) {
    monthlyPayment = totalAmount / remainingMonths;
  } else {
    // Aylık ödeme formülü: P * [r(1+r)^n] / [(1+r)^n - 1]
    monthlyPayment = totalAmount * (monthlyRate * Math.pow(1 + monthlyRate, remainingMonths)) / 
                     (Math.pow(1 + monthlyRate, remainingMonths) - 1);
  }

  // Ödeme planını oluştur
  const paymentPlan: DebtPayment[] = [];
  let remainingBalance = totalAmount;
  const startDate = new Date(payment.dueDate);

  for (let month = 1; month <= remainingMonths; month++) {
    const interest = remainingBalance * monthlyRate;
    const principal = monthlyPayment - interest;
    remainingBalance -= principal;

    // Kalan bakiye negatif olmasın
    if (remainingBalance < 0) remainingBalance = 0;

    const paymentDate = new Date(startDate);
    paymentDate.setMonth(paymentDate.getMonth() + month - 1);

    paymentPlan.push({
      month,
      date: paymentDate,
      principal,
      interest,
      total: monthlyPayment,
      remainingBalance,
    });
  }

  // Toplam faiz hesapla
  const totalInterest = paymentPlan.reduce((sum, p) => sum + p.interest, 0);

  return {
    id: payment.id,
    name: payment.name,
    totalAmount,
    interestRate,
    monthlyPayment,
    remainingMonths,
    totalInterest,
    paymentPlan,
  };
}

/**
 * Erken ödeme simülasyonu
 */
export function simulateEarlyPayment(
  debtDetail: DebtDetail,
  extraPayment: number
): EarlyPaymentSimulation {
  const { totalAmount, interestRate, monthlyPayment } = debtDetail;
  const monthlyRate = interestRate / 100 / 12;
  const newMonthlyPayment = monthlyPayment + extraPayment;

  // Yeni süreyi hesapla
  let newMonths = 0;
  let newTotalInterest = 0;
  let balance = totalAmount;

  while (balance > 0 && newMonths < 1000) {
    const interest = balance * monthlyRate;
    const principal = Math.min(newMonthlyPayment - interest, balance);
    balance -= principal;
    newTotalInterest += interest;
    newMonths++;
  }

  const savedInterest = debtDetail.totalInterest - newTotalInterest;
  const savedMonths = debtDetail.remainingMonths - newMonths;

  return {
    extraPayment,
    newMonths,
    savedInterest,
    savedMonths,
    newTotalInterest,
  };
}

/**
 * Borç ödeme stratejileri
 */
export function getDebtStrategies(debts: DebtDetail[]): DebtStrategy[] {
  const strategies: DebtStrategy[] = [
    {
      type: 'snowball',
      title: 'Snowball (Kar Topu)',
      description: 'En küçük borçtan başlayarak ödeme yapın.',
      pros: [
        'Hızlı kazanımlar motivasyon sağlar',
        'Borç sayısı hızla azalır',
        'Psikolojik olarak daha kolay',
      ],
      cons: [
        'Toplam faiz daha yüksek olabilir',
        'Matematiksel olarak optimal değil',
      ],
      recommended: debts.length > 3, // Çok borç varsa motivasyon önemli
    },
    {
      type: 'avalanche',
      title: 'Avalanche (Çığ)',
      description: 'En yüksek faizli borçtan başlayarak ödeme yapın.',
      pros: [
        'En az faiz ödersiniz',
        'Matematiksel olarak en optimal',
        'Toplam maliyet en düşük',
      ],
      cons: [
        'İlk kazanımlar uzun sürebilir',
        'Motivasyon kaybı riski',
      ],
      recommended: debts.some(d => d.interestRate > 15), // Yüksek faizli borç varsa
    },
  ];

  return strategies;
}

/**
 * Borçları stratejiye göre sırala
 */
export function sortDebtsByStrategy(
  debts: DebtDetail[],
  strategy: 'snowball' | 'avalanche'
): DebtDetail[] {
  if (strategy === 'snowball') {
    // En küçük borçtan başla
    return [...debts].sort((a, b) => a.totalAmount - b.totalAmount);
  } else {
    // En yüksek faizden başla
    return [...debts].sort((a, b) => b.interestRate - a.interestRate);
  }
}
