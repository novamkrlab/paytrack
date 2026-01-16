/**
 * Finansal Sağlık Skoru - Hesaplama Fonksiyonları
 */

import type {
  FinancialHealthScore,
  FinancialHealthInput,
  HealthScoreCategory,
  HealthScoreBreakdown,
} from '@/types/financial-health';

/**
 * Borç yönetimi skorunu hesapla (0-30 puan)
 * Borç/Gelir oranına göre puanlama
 */
function calculateDebtManagementScore(
  totalDebt: number,
  monthlyIncome: number
): number {
  if (monthlyIncome === 0) return 0;
  
  const debtToIncomeRatio = totalDebt / (monthlyIncome * 12); // Yıllık gelire göre
  
  if (debtToIncomeRatio === 0) return 30;
  if (debtToIncomeRatio <= 0.2) return 25;
  if (debtToIncomeRatio <= 0.4) return 15;
  if (debtToIncomeRatio <= 0.6) return 5;
  return 0;
}

/**
 * Acil fon skorunu hesapla (0-20 puan)
 * Mevcut birikim / Aylık harcama oranına göre
 */
function calculateEmergencyFundScore(
  currentSavings: number,
  monthlyExpenses: number
): number {
  if (monthlyExpenses === 0) return currentSavings > 0 ? 20 : 0;
  
  const monthsCovered = currentSavings / monthlyExpenses;
  
  if (monthsCovered >= 6) return 20;
  if (monthsCovered >= 3) return 15;
  if (monthsCovered >= 1) return 10;
  if (monthsCovered > 0) return 5;
  return 0;
}

/**
 * Tasarruf oranı skorunu hesapla (0-30 puan)
 * (Gelir - Harcama) / Gelir oranına göre
 */
function calculateSavingsRateScore(
  monthlyIncome: number,
  monthlyExpenses: number
): number {
  if (monthlyIncome === 0) return 0;
  
  const savingsRate = (monthlyIncome - monthlyExpenses) / monthlyIncome;
  
  if (savingsRate >= 0.3) return 30;
  if (savingsRate >= 0.2) return 25;
  if (savingsRate >= 0.1) return 15;
  if (savingsRate >= 0.05) return 10;
  if (savingsRate > 0) return 5;
  return 0;
}

/**
 * FIRE hedefi ilerleme skorunu hesapla (0-20 puan)
 * FIRE ilerleme yüzdesine göre
 */
function calculateFireProgressScore(
  fireProgressPercent?: number
): number {
  if (fireProgressPercent === undefined || fireProgressPercent === null) return 0;
  
  if (fireProgressPercent >= 80) return 20;
  if (fireProgressPercent >= 60) return 15;
  if (fireProgressPercent >= 40) return 10;
  if (fireProgressPercent >= 20) return 5;
  if (fireProgressPercent > 0) return 2;
  return 0;
}

/**
 * Skor kategorisini belirle
 */
function determineCategory(totalScore: number): HealthScoreCategory {
  if (totalScore >= 71) return 'good';
  if (totalScore >= 41) return 'moderate';
  return 'critical';
}

/**
 * Önerileri oluştur
 */
function generateRecommendations(
  input: FinancialHealthInput,
  scores: {
    debtManagement: number;
    emergencyFund: number;
    savingsRate: number;
    fireProgress: number;
  }
): string[] {
  const recommendations: string[] = [];
  
  // Borç yönetimi önerisi
  if (scores.debtManagement < 15) {
    recommendations.push('healthScore.recommendations.reduceDebt');
  }
  
  // Acil fon önerisi
  if (scores.emergencyFund < 15) {
    const targetAmount = input.monthlyExpenses * 3;
    recommendations.push('healthScore.recommendations.buildEmergencyFund');
  }
  
  // Tasarruf oranı önerisi
  if (scores.savingsRate < 15) {
    recommendations.push('healthScore.recommendations.increaseSavings');
  }
  
  // FIRE hedefi önerisi
  if (scores.fireProgress < 10) {
    recommendations.push('healthScore.recommendations.setFireGoal');
  }
  
  // Genel pozitif öneri
  if (recommendations.length === 0) {
    recommendations.push('healthScore.recommendations.keepGoing');
  }
  
  return recommendations;
}

/**
 * Finansal sağlık skorunu hesapla
 */
export function calculateFinancialHealthScore(
  input: FinancialHealthInput
): FinancialHealthScore {
  const debtManagement = calculateDebtManagementScore(
    input.totalDebt,
    input.monthlyIncome
  );
  
  const emergencyFund = calculateEmergencyFundScore(
    input.currentSavings,
    input.monthlyExpenses
  );
  
  const savingsRate = calculateSavingsRateScore(
    input.monthlyIncome,
    input.monthlyExpenses
  );
  
  const fireProgress = calculateFireProgressScore(
    input.fireProgressPercent
  );
  
  const totalScore = debtManagement + emergencyFund + savingsRate + fireProgress;
  const category = determineCategory(totalScore);
  
  const recommendations = generateRecommendations(input, {
    debtManagement,
    emergencyFund,
    savingsRate,
    fireProgress,
  });
  
  return {
    totalScore,
    debtManagement,
    emergencyFund,
    savingsRate,
    fireProgress,
    category,
    recommendations,
  };
}

/**
 * Skor detaylarını al (kategorilere göre)
 */
export function getHealthScoreBreakdown(
  score: FinancialHealthScore
): HealthScoreBreakdown[] {
  const getStatus = (score: number, max: number): 'excellent' | 'good' | 'fair' | 'poor' => {
    const percentage = (score / max) * 100;
    if (percentage >= 80) return 'excellent';
    if (percentage >= 60) return 'good';
    if (percentage >= 40) return 'fair';
    return 'poor';
  };
  
  return [
    {
      category: 'healthScore.categories.debtManagement',
      score: score.debtManagement,
      maxScore: 30,
      percentage: (score.debtManagement / 30) * 100,
      status: getStatus(score.debtManagement, 30),
    },
    {
      category: 'healthScore.categories.emergencyFund',
      score: score.emergencyFund,
      maxScore: 20,
      percentage: (score.emergencyFund / 20) * 100,
      status: getStatus(score.emergencyFund, 20),
    },
    {
      category: 'healthScore.categories.savingsRate',
      score: score.savingsRate,
      maxScore: 30,
      percentage: (score.savingsRate / 30) * 100,
      status: getStatus(score.savingsRate, 30),
    },
    {
      category: 'healthScore.categories.fireProgress',
      score: score.fireProgress,
      maxScore: 20,
      percentage: (score.fireProgress / 20) * 100,
      status: getStatus(score.fireProgress, 20),
    },
  ];
}

/**
 * Skor rengini al
 */
export function getScoreColor(category: HealthScoreCategory): string {
  switch (category) {
    case 'good':
      return '#22C55E'; // Yeşil
    case 'moderate':
      return '#F59E0B'; // Sarı
    case 'critical':
      return '#EF4444'; // Kırmızı
  }
}

/**
 * Skor mesajını al
 */
export function getScoreMessage(category: HealthScoreCategory): string {
  switch (category) {
    case 'good':
      return 'healthScore.messages.good';
    case 'moderate':
      return 'healthScore.messages.moderate';
    case 'critical':
      return 'healthScore.messages.critical';
  }
}
