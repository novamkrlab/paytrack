/**
 * Finansal Sağlık Skoru - Veri Modelleri
 */

export type HealthScoreCategory = 'critical' | 'moderate' | 'good';

export interface FinancialHealthScore {
  /** Toplam skor (0-100) */
  totalScore: number;
  
  /** Borç yönetimi skoru (0-30) */
  debtManagement: number;
  
  /** Acil fon skoru (0-20) */
  emergencyFund: number;
  
  /** Tasarruf oranı skoru (0-30) */
  savingsRate: number;
  
  /** FIRE hedefi ilerleme skoru (0-20) */
  fireProgress: number;
  
  /** Skor kategorisi */
  category: HealthScoreCategory;
  
  /** Öneriler listesi */
  recommendations: string[];
}

export interface FinancialHealthInput {
  /** Aylık gelir */
  monthlyIncome: number;
  
  /** Aylık harcama */
  monthlyExpenses: number;
  
  /** Toplam borç */
  totalDebt: number;
  
  /** Mevcut birikim */
  currentSavings: number;
  
  /** FIRE hedef sayısı (opsiyonel) */
  fireTarget?: number;
  
  /** Mevcut FIRE ilerleme yüzdesi (opsiyonel) */
  fireProgressPercent?: number;
}

export interface HealthScoreBreakdown {
  category: string;
  score: number;
  maxScore: number;
  percentage: number;
  status: 'excellent' | 'good' | 'fair' | 'poor';
  recommendation?: string;
}
