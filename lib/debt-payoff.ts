/**
 * Borç Azaltma Planı Hesaplama Fonksiyonları
 * 
 * Kar topu (Snowball) ve Çığ (Avalanche) yöntemlerini karşılaştırmalı olarak hesaplar.
 */

import type {
  DebtInfo,
  DebtPayoffMethod,
  DebtPayoffPlan,
  MonthlyPayment,
  PayoffComparison,
  DebtPayoffSummary,
} from '@/types/debt-payoff';

/**
 * Kar topu yöntemi (Snowball): En küçük borcu önce öde
 * Psikolojik motivasyon için idealdir.
 */
export function calculateSnowballMethod(
  debts: DebtInfo[],
  monthlyExtraPayment: number
): DebtPayoffPlan {
  // En küçükten büyüğe sırala (balance'a göre)
  const sortedDebts = [...debts].sort((a, b) => a.balance - b.balance);
  
  return calculatePayoffPlan(sortedDebts, monthlyExtraPayment, 'snowball');
}

/**
 * Çığ yöntemi (Avalanche): En yüksek faizli borcu önce öde
 * Matematiksel optimizasyon için idealdir.
 */
export function calculateAvalancheMethod(
  debts: DebtInfo[],
  monthlyExtraPayment: number
): DebtPayoffPlan {
  // En yüksek faizden düşüğe sırala (interestRate'e göre)
  const sortedDebts = [...debts].sort((a, b) => b.interestRate - a.interestRate);
  
  return calculatePayoffPlan(sortedDebts, monthlyExtraPayment, 'avalanche');
}

/**
 * İki yöntemi karşılaştır
 */
export function comparePayoffMethods(
  debts: DebtInfo[],
  monthlyExtraPayment: number
): PayoffComparison {
  const snowball = calculateSnowballMethod(debts, monthlyExtraPayment);
  const avalanche = calculateAvalancheMethod(debts, monthlyExtraPayment);
  
  const monthsDifference = snowball.totalMonths - avalanche.totalMonths;
  const interestDifference = snowball.totalInterest - avalanche.totalInterest;
  
  // Çığ yöntemi genellikle daha az faiz ödetir
  const recommendedMethod: DebtPayoffMethod = 
    interestDifference > 1000 ? 'avalanche' : 'snowball';
  
  return {
    snowball,
    avalanche,
    monthsDifference,
    interestDifference,
    recommendedMethod,
  };
}

/**
 * Borç azaltma özeti
 */
export function getDebtPayoffSummary(
  debts: DebtInfo[],
  monthlyIncome: number,
  monthlyExpenses: number
): DebtPayoffSummary {
  const totalDebts = debts.length;
  const totalBalance = debts.reduce((sum, debt) => sum + debt.balance, 0);
  const totalMinimumPayment = debts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
  
  const averageInterestRate = totalDebts > 0
    ? debts.reduce((sum, debt) => sum + debt.interestRate, 0) / totalDebts
    : 0;
  
  const availableExtraPayment = Math.max(0, monthlyIncome - monthlyExpenses - totalMinimumPayment);
  
  return {
    totalDebts,
    totalBalance,
    averageInterestRate,
    totalMinimumPayment,
    availableExtraPayment,
  };
}

/**
 * Borç azaltma planını hesapla (genel fonksiyon)
 */
function calculatePayoffPlan(
  sortedDebts: DebtInfo[],
  monthlyExtraPayment: number,
  method: DebtPayoffMethod
): DebtPayoffPlan {
  // Borçları kopyala (orijinali değiştirmemek için)
  const debts = sortedDebts.map(debt => ({ ...debt }));
  
  const monthlyPayments: MonthlyPayment[] = [];
  const debtOrder: string[] = debts.map(debt => debt.id);
  
  let totalInterest = 0;
  let totalPrincipal = 0;
  let month = 0;
  const maxMonths = 600; // 50 yıl (sonsuz döngüyü önlemek için)
  
  // Tüm borçlar ödenene kadar devam et
  while (debts.some(debt => debt.balance > 0) && month < maxMonths) {
    month++;
    
    // Bu ayki toplam ödeme
    let remainingExtraPayment = monthlyExtraPayment;
    
    // Her borç için minimum ödeme yap
    for (const debt of debts) {
      if (debt.balance <= 0) continue;
      
      // Aylık faiz hesapla (yıllık faizi 12'ye böl)
      const monthlyInterestRate = debt.interestRate / 12;
      const interestPayment = debt.balance * monthlyInterestRate;
      
      // Minimum ödeme (faiz + anapara)
      const minimumPayment = Math.min(debt.minimumPayment, debt.balance + interestPayment);
      const principalPayment = minimumPayment - interestPayment;
      
      // Borcu güncelle
      debt.balance -= principalPayment;
      
      // Toplam faiz ve anapara
      totalInterest += interestPayment;
      totalPrincipal += principalPayment;
      
      // Aylık ödeme kaydı
      monthlyPayments.push({
        month,
        debtId: debt.id,
        debtName: debt.name,
        principal: principalPayment,
        interest: interestPayment,
        totalPayment: minimumPayment,
        remainingBalance: Math.max(0, debt.balance),
        isFullyPaid: debt.balance <= 0,
      });
    }
    
    // Ekstra ödemeyi ilk borçtan başlayarak dağıt
    for (const debt of debts) {
      if (debt.balance <= 0 || remainingExtraPayment <= 0) continue;
      
      // Aylık faiz hesapla
      const monthlyInterestRate = debt.interestRate / 12;
      const interestPayment = debt.balance * monthlyInterestRate;
      
      // Ekstra ödeme (sadece anapara)
      const extraPrincipal = Math.min(remainingExtraPayment, debt.balance);
      debt.balance -= extraPrincipal;
      remainingExtraPayment -= extraPrincipal;
      
      // Toplam anapara
      totalPrincipal += extraPrincipal;
      
      // Aylık ödeme kaydı (ekstra ödeme)
      if (extraPrincipal > 0) {
        monthlyPayments.push({
          month,
          debtId: debt.id,
          debtName: debt.name,
          principal: extraPrincipal,
          interest: 0, // Ekstra ödeme sadece anapara
          totalPayment: extraPrincipal,
          remainingBalance: Math.max(0, debt.balance),
          isFullyPaid: debt.balance <= 0,
        });
      }
    }
  }
  
  return {
    method,
    totalMonths: month,
    totalInterest,
    totalPrincipal,
    totalPayment: totalInterest + totalPrincipal,
    monthlyExtraPayment,
    monthlyPayments,
    debtOrder,
  };
}

/**
 * Aylık ilerleme hesapla (grafik için)
 */
export function calculateMonthlyProgress(plan: DebtPayoffPlan): {
  month: number;
  totalRemaining: number;
  totalPaid: number;
}[] {
  const progress: { month: number; totalRemaining: number; totalPaid: number }[] = [];
  
  // Başlangıç durumu
  const initialBalance = plan.totalPrincipal;
  progress.push({ month: 0, totalRemaining: initialBalance, totalPaid: 0 });
  
  // Her ay için toplam kalan borç hesapla
  const monthlyTotals = new Map<number, number>();
  
  for (const payment of plan.monthlyPayments) {
    if (!monthlyTotals.has(payment.month)) {
      monthlyTotals.set(payment.month, 0);
    }
    
    // Bu ayki toplam kalan borç (en son güncellenen değer)
    monthlyTotals.set(payment.month, payment.remainingBalance);
  }
  
  // Her ay için ilerleme ekle
  for (let month = 1; month <= plan.totalMonths; month++) {
    const totalRemaining = monthlyTotals.get(month) || 0;
    const totalPaid = initialBalance - totalRemaining;
    
    progress.push({ month, totalRemaining, totalPaid });
  }
  
  return progress;
}
