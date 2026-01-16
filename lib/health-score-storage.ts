/**
 * Finansal Sağlık Skoru Geçmişi Depolama
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { HealthScoreHistory, HealthScoreHistoryEntry } from '@/types/health-score-history';
import type { FinancialHealthScore } from '@/types/financial-health';

const HEALTH_SCORE_HISTORY_KEY = '@health_score_history';

/**
 * Sağlık skoru geçmişini yükle
 */
export async function loadHealthScoreHistory(): Promise<HealthScoreHistory> {
  try {
    const data = await AsyncStorage.getItem(HEALTH_SCORE_HISTORY_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Sağlık skoru geçmişi yüklenemedi:', error);
  }
  return { entries: [] };
}

/**
 * Sağlık skoru geçmişini kaydet
 */
export async function saveHealthScoreHistory(history: HealthScoreHistory): Promise<void> {
  try {
    await AsyncStorage.setItem(HEALTH_SCORE_HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Sağlık skoru geçmişi kaydedilemedi:', error);
    throw error;
  }
}

/**
 * Mevcut ayın sağlık skorunu kaydet veya güncelle
 */
export async function saveCurrentMonthScore(score: FinancialHealthScore): Promise<void> {
  try {
    const history = await loadHealthScoreHistory();
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Mevcut ay için kayıt var mı kontrol et
    const existingIndex = history.entries.findIndex(entry => entry.month === currentMonth);

    const newEntry: HealthScoreHistoryEntry = {
      month: currentMonth,
      score: score.totalScore,
      breakdown: {
        debtManagement: score.debtManagement,
        emergencyFund: score.emergencyFund,
        savingsRate: score.savingsRate,
        fireProgress: score.fireProgress,
      },
      timestamp: Date.now(),
    };

    if (existingIndex >= 0) {
      // Mevcut ayı güncelle
      history.entries[existingIndex] = newEntry;
    } else {
      // Yeni ay ekle
      history.entries.push(newEntry);
    }

    // Son 12 ayı tut
    history.entries.sort((a, b) => a.month.localeCompare(b.month));
    if (history.entries.length > 12) {
      history.entries = history.entries.slice(-12);
    }

    await saveHealthScoreHistory(history);
  } catch (error) {
    console.error('Sağlık skoru kaydedilemedi:', error);
    throw error;
  }
}

/**
 * Son N ayın sağlık skorunu getir
 */
export async function getRecentHealthScores(months: number = 6): Promise<HealthScoreHistoryEntry[]> {
  try {
    const history = await loadHealthScoreHistory();
    return history.entries.slice(-months);
  } catch (error) {
    console.error('Sağlık skoru geçmişi alınamadı:', error);
    return [];
  }
}
