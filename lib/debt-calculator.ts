/**
 * Borç Yönetimi Hesaplama Fonksiyonları
 */

import {
  DebtPayoffStrategy,
  DEBT_CONSTANTS,
  type DebtItem,
  type DebtPayoffOrder,
  type DebtPayoffPlan,
  type DebtStatistics,
  type DebtSummary,
  type MonthlyPayoffPlan,
  type StrategyComparison,
} from '@/types/debt';


/**
 * Borç özetini hesapla
 * @param debts Borç listesi
 * @returns Borç özeti
 */
export function calculateDebtSummary(debts: DebtItem[]): DebtSummary {
  if (debts.length === 0) {
    return {
      totalDebt: 0,
      monthlyPayment: 0,
      averageInterestRate: 0,
      activeDebts: 0,
      debts: [],
      totalPaid: 0,
      totalInterestPaid: 0,
    };
  }

  const totalDebt = debts.reduce((sum, debt) => sum + debt.remainingAmount, 0);
  const monthlyPayment = debts.reduce((sum, debt) => sum + debt.monthlyPayment, 0);
  
  // Ağırlıklı ortalama faiz oranı
  const weightedInterestSum = debts.reduce(
    (sum, debt) => sum + debt.interestRate * debt.remainingAmount,
    0
  );
  const averageInterestRate = totalDebt > 0 ? weightedInterestSum / totalDebt : 0;

  const totalPaid = debts.reduce(
    (sum, debt) => sum + (debt.totalAmount - debt.remainingAmount),
    0
  );

  // Basit faiz hesabı (gerçek faiz daha karmaşık olabilir)
  const totalInterestPaid = debts.reduce((sum, debt) => {
    const paidAmount = debt.totalAmount - debt.remainingAmount;
    const estimatedInterest = paidAmount * (debt.interestRate / 100);
    return sum + estimatedInterest;
  }, 0);

  return {
    totalDebt,
    monthlyPayment,
    averageInterestRate,
    activeDebts: debts.length,
    debts,
    totalPaid,
    totalInterestPaid,
  };
}

/**
 * Kar Topu (Snowball) stratejisi ile ödeme planı oluştur
 * En küçük borçtan başlayarak ödeme yapar
 * @param debts Borç listesi
 * @param extraPayment Ekstra ödeme tutarı (opsiyonel)
 * @returns Ödeme planı
 */
export function calculateSnowballStrategy(
  debts: DebtItem[],
  extraPayment: number = 0
): DebtPayoffPlan {
  // Borçları kalan tutara göre sırala (küçükten büyüğe)
  const sortedDebts = [...debts].sort((a, b) => a.remainingAmount - b.remainingAmount);
  
  return calculatePayoffPlan(sortedDebts, DebtPayoffStrategy.SNOWBALL, extraPayment);
}

/**
 * Çığ (Avalanche) stratejisi ile ödeme planı oluştur
 * En yüksek faizli borçtan başlayarak ödeme yapar
 * @param debts Borç listesi
 * @param extraPayment Ekstra ödeme tutarı (opsiyonel)
 * @returns Ödeme planı
 */
export function calculateAvalancheStrategy(
  debts: DebtItem[],
  extraPayment: number = 0
): DebtPayoffPlan {
  // Borçları faiz oranına göre sırala (yüksekten düşüğe)
  const sortedDebts = [...debts].sort((a, b) => b.interestRate - a.interestRate);
  
  return calculatePayoffPlan(sortedDebts, DebtPayoffStrategy.AVALANCHE, extraPayment);
}

/**
 * Ödeme planını hesapla
 * @param sortedDebts Sıralanmış borç listesi
 * @param strategy Strateji türü
 * @param extraPayment Ekstra ödeme tutarı
 * @returns Ödeme planı
 */
function calculatePayoffPlan(
  sortedDebts: DebtItem[],
  strategy: DebtPayoffStrategy,
  extraPayment: number
): DebtPayoffPlan {
  const monthlyPlan: MonthlyPayoffPlan[] = [];
  const payoffOrder: DebtPayoffOrder[] = [];
  
  // Her borç için kopyasını oluştur
  const workingDebts = sortedDebts.map(debt => ({
    ...debt,
    currentRemaining: debt.remainingAmount,
  }));

  let month = 0;
  let totalPayment = 0;
  let totalInterest = 0;
  const minMonthlyPayment = sortedDebts.reduce((sum, debt) => sum + debt.monthlyPayment, 0);
  const totalAvailablePayment = minMonthlyPayment + extraPayment;

  while (workingDebts.some(debt => debt.currentRemaining > 0) && month < DEBT_CONSTANTS.MAX_CALCULATION_MONTHS) {
    month++;
    let monthlyPaymentTotal = 0;
    let monthlyPrincipalTotal = 0;
    let monthlyInterestTotal = 0;
    let remainingPayment = totalAvailablePayment;

    // Her borç için minimum ödeme yap
    for (const debt of workingDebts) {
      if (debt.currentRemaining <= 0) continue;

      const monthlyInterest = (debt.currentRemaining * debt.interestRate) / 100;
      const minPayment = Math.min(debt.monthlyPayment, debt.currentRemaining + monthlyInterest);
      const principalPayment = Math.max(0, minPayment - monthlyInterest);

      debt.currentRemaining -= principalPayment;
      monthlyPaymentTotal += minPayment;
      monthlyPrincipalTotal += principalPayment;
      monthlyInterestTotal += monthlyInterest;
      remainingPayment -= minPayment;
      totalInterest += monthlyInterest;
    }

    // Kalan ödemeyi ilk borca (stratejiye göre sıralanmış) ekle
    if (remainingPayment > 0) {
      const targetDebt = workingDebts.find(debt => debt.currentRemaining > 0);
      if (targetDebt) {
        const extraPrincipal = Math.min(remainingPayment, targetDebt.currentRemaining);
        targetDebt.currentRemaining -= extraPrincipal;
        monthlyPaymentTotal += extraPrincipal;
        monthlyPrincipalTotal += extraPrincipal;
      }
    }

    totalPayment += monthlyPaymentTotal;

    const remainingDebt = workingDebts.reduce((sum, debt) => sum + Math.max(0, debt.currentRemaining), 0);

    monthlyPlan.push({
      month,
      totalPayment: monthlyPaymentTotal,
      principalPayment: monthlyPrincipalTotal,
      interestPayment: monthlyInterestTotal,
      remainingDebt,
    });

    // Ödenen borçları kaydet
    for (const debt of workingDebts) {
      if (debt.currentRemaining <= 0 && !payoffOrder.find(p => p.debtId === debt.id)) {
        const debtPayments = monthlyPlan.filter((_, idx) => idx < month);
        const debtTotalPayment = debtPayments.reduce((sum, p) => sum + p.totalPayment, 0);
        const debtInterest = debtPayments.reduce((sum, p) => sum + p.interestPayment, 0);

        payoffOrder.push({
          debtId: debt.id,
          debtName: debt.name,
          order: payoffOrder.length + 1,
          monthsToPayoff: month,
          totalPayment: debt.totalAmount,
          interestPayment: debtInterest,
        });
      }
    }
  }

  return {
    strategy,
    totalMonths: month,
    totalPayment,
    totalInterest,
    monthlyPlan,
    payoffOrder,
  };
}

/**
 * Strateji karşılaştırması yap
 * @param debts Borç listesi
 * @param extraPayment Ekstra ödeme tutarı
 * @returns Karşılaştırma sonuçları
 */
export function compareStrategies(
  debts: DebtItem[],
  extraPayment: number = 0
): StrategyComparison {
  const snowball = calculateSnowballStrategy(debts, extraPayment);
  const avalanche = calculateAvalancheStrategy(debts, extraPayment);

  const timeDifference = snowball.totalMonths - avalanche.totalMonths;
  const costDifference = snowball.totalInterest - avalanche.totalInterest;

  // Genellikle Avalanche daha az faiz öder
  const recommendedStrategy: DebtPayoffStrategy = 
    avalanche.totalInterest < snowball.totalInterest ? DebtPayoffStrategy.AVALANCHE : DebtPayoffStrategy.SNOWBALL;

  return {
    snowball,
    avalanche,
    timeDifference,
    costDifference,
    recommendedStrategy,
  };
}

/**
 * Borç istatistiklerini hesapla
 * @param debts Borç listesi
 * @returns İstatistikler
 */
export function calculateDebtStatistics(debts: DebtItem[]): DebtStatistics {
  if (debts.length === 0) {
    return {
      totalDebt: 0,
      totalPaid: 0,
      paymentProgress: 0,
      averageMonthlyPayment: 0,
      estimatedPayoffDate: new Date().toISOString(),
    };
  }

  const totalDebt = debts.reduce((sum, debt) => sum + debt.totalAmount, 0);
  const remainingDebt = debts.reduce((sum, debt) => sum + debt.remainingAmount, 0);
  const totalPaid = totalDebt - remainingDebt;
  const paymentProgress = totalDebt > 0 ? (totalPaid / totalDebt) * 100 : 0;
  const averageMonthlyPayment = debts.reduce((sum, debt) => sum + debt.monthlyPayment, 0);

  // En uzun sürecek borcu bul
  const maxMonths = Math.max(...debts.map(debt => debt.remainingMonths));
  const estimatedPayoffDate = new Date();
  estimatedPayoffDate.setMonth(estimatedPayoffDate.getMonth() + maxMonths);

  // En yüksek faizli borç
  const highestInterestDebt = debts.reduce((max, debt) => 
    debt.interestRate > max.interestRate ? debt : max
  , debts[0]);

  // En büyük borç
  const largestDebt = debts.reduce((max, debt) => 
    debt.remainingAmount > max.remainingAmount ? debt : max
  , debts[0]);

  return {
    totalDebt,
    totalPaid,
    paymentProgress,
    averageMonthlyPayment,
    estimatedPayoffDate: estimatedPayoffDate.toISOString(),
    highestInterestDebt,
    largestDebt,
  };
}

/**
 * Borç ödeme süresini hesapla
 * @param remainingAmount Kalan borç
 * @param monthlyPayment Aylık ödeme
 * @param interestRate Aylık faiz oranı (%)
 * @returns Kalan ay sayısı
 */
export function calculateRemainingMonths(
  remainingAmount: number,
  monthlyPayment: number,
  interestRate: number
): number {
  if (monthlyPayment <= 0 || remainingAmount <= 0) {
    return 0;
  }

  const monthlyRate = interestRate / 100;

  if (monthlyRate === 0) {
    return Math.ceil(remainingAmount / monthlyPayment);
  }

  // Aylık ödeme faizden küçükse borç hiç bitmez
  const monthlyInterest = remainingAmount * monthlyRate;
  if (monthlyPayment <= monthlyInterest) {
    return DEBT_CONSTANTS.MAX_CALCULATION_MONTHS;
  }

  // Kredi formülü: n = -log(1 - (P * r / PMT)) / log(1 + r)
  const numerator = Math.log(1 - (remainingAmount * monthlyRate / monthlyPayment));
  const denominator = Math.log(1 + monthlyRate);
  
  const months = -numerator / denominator;
  
  return Math.ceil(Math.min(months, DEBT_CONSTANTS.MAX_CALCULATION_MONTHS));
}

/**
 * Toplam ödenecek tutarı hesapla
 * @param principal Ana para
 * @param monthlyPayment Aylık ödeme
 * @param interestRate Aylık faiz oranı (%)
 * @param months Ay sayısı
 * @returns Toplam ödenecek tutar
 */
export function calculateTotalPayment(
  principal: number,
  monthlyPayment: number,
  interestRate: number,
  months: number
): number {
  return monthlyPayment * months;
}

/**
 * Toplam faiz tutarını hesapla
 * @param totalPayment Toplam ödeme
 * @param principal Ana para
 * @returns Toplam faiz
 */
export function calculateTotalInterest(totalPayment: number, principal: number): number {
  return Math.max(0, totalPayment - principal);
}
