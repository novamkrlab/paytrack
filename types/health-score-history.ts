/**
 * Finansal Sağlık Skoru Geçmişi Veri Modeli
 */

export interface HealthScoreHistoryEntry {
  month: string; // YYYY-MM formatında (örn: "2026-01")
  score: number; // 0-100 arası skor
  breakdown: {
    debtManagement: number;
    emergencyFund: number;
    savingsRate: number;
    fireProgress: number;
  };
  timestamp: number; // Unix timestamp
}

export interface HealthScoreHistory {
  entries: HealthScoreHistoryEntry[];
}
