/**
 * Finansal Özgürlük (FIRE) Veri Modelleri
 */

/**
 * Kullanıcının FIRE ayarları
 * AsyncStorage'da saklanır
 */
export interface FireSettings {
  /** Kullanıcının mevcut yaşı */
  currentAge: number;
  /** Hedef emeklilik yaşı */
  targetRetirementAge: number;
  /** Mevcut birikim miktarı */
  currentSavings: number;
  /** Aylık gelir */
  monthlyIncome: number;
  /** Aylık harcama (otomatik hesaplanabilir veya manuel girilebilir) */
  monthlyExpenses: number;
  /** Hedef aylık harcama (emeklilik sonrası) */
  targetMonthlyExpenses: number;
  /** Beklenen yıllık getiri oranı (yüzde olarak, örn: 10 = %10) */
  expectedAnnualReturn: number;
  /** Son güncelleme tarihi */
  lastUpdated: string; // ISO date string
}

/**
 * FIRE hesaplama sonuçları
 */
export interface FireCalculationResult {
  /** FIRE sayısı (ulaşılması gereken toplam sermaye) */
  fireNumber: number;
  /** Tahmini emeklilik yaşı */
  estimatedRetirementAge: number;
  /** Emekliliğe kalan yıl */
  yearsToRetirement: number;
  /** Emekliliğe kalan ay */
  monthsToRetirement: number;
  /** Hedefe ulaşmak için gereken aylık tasarruf */
  monthlyTargetSavings: number;
  /** Mevcut ilerleme yüzdesi (0-100) */
  currentProgress: number;
  /** Yıllara göre birikim projeksiyonu */
  projectionData: ProjectionPoint[];
  /** Hesaplama başarılı mı */
  isValid: boolean;
  /** Hata mesajı (varsa) */
  errorMessage?: string;
}

/**
 * Birikim projeksiyonu için tek bir veri noktası
 */
export interface ProjectionPoint {
  /** Yıl (örn: 2024, 2025, ...) */
  year: number;
  /** Kullanıcının yaşı */
  age: number;
  /** Toplam birikim */
  totalSavings: number;
  /** Ana para (yatırılan toplam) */
  principal: number;
  /** Faiz geliri */
  interest: number;
}

/**
 * FIRE özet bilgileri (ana sayfa kartı için)
 */
export interface FireSummary {
  /** FIRE sayısı */
  fireNumber: number;
  /** Mevcut birikim */
  currentSavings: number;
  /** İlerleme yüzdesi */
  progress: number;
  /** Emekliliğe kalan süre (yıl) */
  yearsRemaining: number;
  /** Emekliliğe kalan süre (ay) */
  monthsRemaining: number;
  /** Ayarlar yapılandırılmış mı */
  isConfigured: boolean;
}

/**
 * FIRE hesaplama için girdi parametreleri
 */
export interface FireCalculationInput {
  currentAge: number;
  targetRetirementAge: number;
  currentSavings: number;
  monthlySavings: number;
  targetMonthlyExpenses: number;
  expectedAnnualReturn: number;
}

/**
 * Varsayılan FIRE ayarları
 */
export const DEFAULT_FIRE_SETTINGS: FireSettings = {
  currentAge: 30,
  targetRetirementAge: 50,
  currentSavings: 0,
  monthlyIncome: 0,
  monthlyExpenses: 0,
  targetMonthlyExpenses: 0,
  expectedAnnualReturn: 10, // %10
  lastUpdated: new Date().toISOString(),
};

/**
 * FIRE hesaplama sabitleri
 */
export const FIRE_CONSTANTS = {
  /** 4% kuralı çarpanı (25 = 1/0.04) */
  FIRE_MULTIPLIER: 25,
  /** Minimum yaş */
  MIN_AGE: 18,
  /** Maksimum yaş */
  MAX_AGE: 100,
  /** Minimum yıllık getiri (%) */
  MIN_ANNUAL_RETURN: 0,
  /** Maksimum yıllık getiri (%) */
  MAX_ANNUAL_RETURN: 50,
  /** Projeksiyonda gösterilecek maksimum yıl */
  MAX_PROJECTION_YEARS: 50,
} as const;
