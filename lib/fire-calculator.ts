/**
 * Finansal Özgürlük (FIRE) Hesaplama Fonksiyonları
 */

import type {
  FireCalculationInput,
  FireCalculationResult,
  FireSettings,
  FireSummary,
  ProjectionPoint,
} from '@/types/fire';
import { FIRE_CONSTANTS } from '@/types/fire';

/**
 * FIRE sayısını hesapla (4% kuralı)
 * @param targetMonthlyExpenses Hedef aylık harcama
 * @returns FIRE sayısı
 */
export function calculateFireNumber(targetMonthlyExpenses: number): number {
  const annualExpenses = targetMonthlyExpenses * 12;
  return annualExpenses * FIRE_CONSTANTS.FIRE_MULTIPLIER;
}

/**
 * Emeklilik yaşını tahmin et
 * @param input Hesaplama girdileri
 * @returns Tahmini emeklilik yaşı
 */
export function estimateRetirementAge(input: FireCalculationInput): number {
  const { currentAge, currentSavings, monthlySavings, expectedAnnualReturn, targetMonthlyExpenses } = input;

  const fireNumber = calculateFireNumber(targetMonthlyExpenses);
  
  if (currentSavings >= fireNumber) {
    return currentAge; // Zaten hedefe ulaşılmış
  }

  if (monthlySavings <= 0) {
    return FIRE_CONSTANTS.MAX_AGE; // Tasarruf yapılmıyorsa hedefe ulaşılamaz
  }

  const monthlyRate = expectedAnnualReturn / 100 / 12;
  const remainingAmount = fireNumber - currentSavings;

  // Bileşik faiz formülü ile ay sayısını hesapla
  // FV = PV(1+r)^n + PMT[((1+r)^n - 1) / r]
  // Çözüm için iteratif yaklaşım kullan
  
  let months = 0;
  let currentAmount = currentSavings;
  const maxMonths = (FIRE_CONSTANTS.MAX_AGE - currentAge) * 12;

  while (currentAmount < fireNumber && months < maxMonths) {
    currentAmount = currentAmount * (1 + monthlyRate) + monthlySavings;
    months++;
  }

  const years = months / 12;
  const estimatedAge = currentAge + years;

  return Math.min(estimatedAge, FIRE_CONSTANTS.MAX_AGE);
}

/**
 * Gereken aylık tasarrufu hesapla
 * @param currentSavings Mevcut birikim
 * @param fireNumber FIRE sayısı
 * @param yearsToRetirement Emekliliğe kalan yıl
 * @param annualReturn Yıllık getiri (%)
 * @returns Gereken aylık tasarruf
 */
export function calculateRequiredMonthlySavings(
  currentSavings: number,
  fireNumber: number,
  yearsToRetirement: number,
  annualReturn: number
): number {
  if (yearsToRetirement <= 0) {
    return 0;
  }

  if (currentSavings >= fireNumber) {
    return 0; // Zaten hedefe ulaşılmış
  }

  const monthlyRate = annualReturn / 100 / 12;
  const months = yearsToRetirement * 12;
  const remainingAmount = fireNumber - currentSavings;

  if (monthlyRate === 0) {
    // Faiz yoksa basit bölme
    return remainingAmount / months;
  }

  // PMT formülü: PMT = (FV - PV(1+r)^n) / [((1+r)^n - 1) / r]
  const futureValueOfCurrentSavings = currentSavings * Math.pow(1 + monthlyRate, months);
  const remainingToSave = fireNumber - futureValueOfCurrentSavings;
  
  const annuityFactor = (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
  
  return Math.max(0, remainingToSave / annuityFactor);
}

/**
 * Birikim projeksiyonunu hesapla
 * @param input Hesaplama girdileri
 * @param maxYears Maksimum yıl sayısı
 * @returns Projeksiyon verileri
 */
export function calculateProjection(
  input: FireCalculationInput,
  maxYears: number = FIRE_CONSTANTS.MAX_PROJECTION_YEARS
): ProjectionPoint[] {
  const { currentAge, currentSavings, monthlySavings, expectedAnnualReturn, targetMonthlyExpenses } = input;

  const fireNumber = calculateFireNumber(targetMonthlyExpenses);
  const monthlyRate = expectedAnnualReturn / 100 / 12;
  const projection: ProjectionPoint[] = [];

  let currentAmount = currentSavings;
  let totalPrincipal = currentSavings;

  // İlk yıl (mevcut durum)
  projection.push({
    year: new Date().getFullYear(),
    age: currentAge,
    totalSavings: currentAmount,
    principal: totalPrincipal,
    interest: 0,
  });

  // Gelecek yıllar
  for (let year = 1; year <= maxYears; year++) {
    // 12 aylık hesaplama
    for (let month = 0; month < 12; month++) {
      currentAmount = currentAmount * (1 + monthlyRate) + monthlySavings;
      totalPrincipal += monthlySavings;
    }

    const interest = currentAmount - totalPrincipal;

    projection.push({
      year: new Date().getFullYear() + year,
      age: currentAge + year,
      totalSavings: currentAmount,
      principal: totalPrincipal,
      interest: interest,
    });

    // Hedefe ulaşıldıysa dur
    if (currentAmount >= fireNumber) {
      break;
    }
  }

  return projection;
}

/**
 * Tam FIRE hesaplaması yap
 * @param settings FIRE ayarları
 * @returns Hesaplama sonuçları
 */
export function calculateFire(settings: FireSettings): FireCalculationResult {
  try {
    // Validasyon
    if (settings.currentAge < FIRE_CONSTANTS.MIN_AGE || settings.currentAge > FIRE_CONSTANTS.MAX_AGE) {
      return {
        fireNumber: 0,
        estimatedRetirementAge: 0,
        yearsToRetirement: 0,
        monthsToRetirement: 0,
        monthlyTargetSavings: 0,
        currentProgress: 0,
        projectionData: [],
        isValid: false,
        errorMessage: 'Geçersiz yaş değeri',
      };
    }

    if (settings.targetRetirementAge <= settings.currentAge) {
      return {
        fireNumber: 0,
        estimatedRetirementAge: 0,
        yearsToRetirement: 0,
        monthsToRetirement: 0,
        monthlyTargetSavings: 0,
        currentProgress: 0,
        projectionData: [],
        isValid: false,
        errorMessage: 'Hedef emeklilik yaşı mevcut yaştan büyük olmalı',
      };
    }

    const fireNumber = calculateFireNumber(settings.targetMonthlyExpenses);
    const monthlySavings = settings.monthlyIncome - settings.monthlyExpenses;

    const input: FireCalculationInput = {
      currentAge: settings.currentAge,
      targetRetirementAge: settings.targetRetirementAge,
      currentSavings: settings.currentSavings,
      monthlySavings: Math.max(0, monthlySavings),
      targetMonthlyExpenses: settings.targetMonthlyExpenses,
      expectedAnnualReturn: settings.expectedAnnualReturn,
    };

    const estimatedAge = estimateRetirementAge(input);
    const yearsToRetirement = Math.max(0, estimatedAge - settings.currentAge);
    const monthsToRetirement = Math.round(yearsToRetirement * 12);

    const yearsToTarget = settings.targetRetirementAge - settings.currentAge;
    const monthlyTargetSavings = calculateRequiredMonthlySavings(
      settings.currentSavings,
      fireNumber,
      yearsToTarget,
      settings.expectedAnnualReturn
    );

    const currentProgress = fireNumber > 0 ? Math.min(100, (settings.currentSavings / fireNumber) * 100) : 0;

    const projectionData = calculateProjection(input);

    return {
      fireNumber,
      estimatedRetirementAge: estimatedAge,
      yearsToRetirement,
      monthsToRetirement,
      monthlyTargetSavings,
      currentProgress,
      projectionData,
      isValid: true,
    };
  } catch (error) {
    return {
      fireNumber: 0,
      estimatedRetirementAge: 0,
      yearsToRetirement: 0,
      monthsToRetirement: 0,
      monthlyTargetSavings: 0,
      currentProgress: 0,
      projectionData: [],
      isValid: false,
      errorMessage: error instanceof Error ? error.message : 'Hesaplama hatası',
    };
  }
}

/**
 * FIRE özet bilgilerini oluştur (ana sayfa kartı için)
 * @param settings FIRE ayarları
 * @returns Özet bilgiler
 */
export function getFireSummary(settings: FireSettings | null): FireSummary {
  if (!settings || settings.targetMonthlyExpenses === 0) {
    return {
      fireNumber: 0,
      currentSavings: 0,
      progress: 0,
      yearsRemaining: 0,
      monthsRemaining: 0,
      isConfigured: false,
    };
  }

  const result = calculateFire(settings);

  return {
    fireNumber: result.fireNumber,
    currentSavings: settings.currentSavings,
    progress: result.currentProgress,
    yearsRemaining: Math.floor(result.yearsToRetirement),
    monthsRemaining: result.monthsToRetirement % 12,
    isConfigured: true,
  };
}

/**
 * Yıllık harcamayı hesapla
 * @param monthlyExpenses Aylık harcama
 * @returns Yıllık harcama
 */
export function calculateAnnualExpenses(monthlyExpenses: number): number {
  return monthlyExpenses * 12;
}

/**
 * Tasarruf oranını hesapla
 * @param monthlyIncome Aylık gelir
 * @param monthlyExpenses Aylık harcama
 * @returns Tasarruf oranı (yüzde)
 */
export function calculateSavingsRate(monthlyIncome: number, monthlyExpenses: number): number {
  if (monthlyIncome <= 0) {
    return 0;
  }
  const savings = monthlyIncome - monthlyExpenses;
  return Math.max(0, (savings / monthlyIncome) * 100);
}
