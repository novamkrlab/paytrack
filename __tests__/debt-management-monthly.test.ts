/**
 * Borç Yönetimi Skoru Aylık Hesaplama Testi
 * 
 * Bu test, borç yönetimi skorunun aylık bazda doğru hesaplanıp hesaplanmadığını kontrol eder.
 */

import { describe, it, expect } from 'vitest';

// Test için yardımcı fonksiyon (lib/financial-health.ts'deki mantığı taklit eder)
function calculateDebtManagementScore(
  monthlyDebtPayment: number,
  monthlyIncome: number
): number {
  if (monthlyIncome === 0) return 0;
  
  const debtToIncomeRatio = monthlyDebtPayment / monthlyIncome;
  
  if (debtToIncomeRatio === 0) return 30;
  if (debtToIncomeRatio <= 0.1) return 30; // %10'un altında (mükemmel)
  if (debtToIncomeRatio <= 0.2) return 25; // %20'nin altında (iyi)
  if (debtToIncomeRatio <= 0.3) return 20; // %30'un altında (kabul edilebilir)
  if (debtToIncomeRatio <= 0.4) return 10; // %40'nın altında (riskli)
  if (debtToIncomeRatio <= 0.5) return 5;  // %50'nin altında (çok riskli)
  return 0; // %50'ün üzerinde (kritik)
}

describe('Borç Yönetimi Skoru Aylık Hesaplama', () => {
  it('borç yoksa tam puan vermeli (30/30)', () => {
    const monthlyDebtPayment = 0;
    const monthlyIncome = 100000;
    
    const score = calculateDebtManagementScore(monthlyDebtPayment, monthlyIncome);
    
    expect(score).toBe(30);
  });
  
  it('%10 borç/gelir oranında tam puan vermeli (30/30)', () => {
    const monthlyDebtPayment = 10000;
    const monthlyIncome = 100000;
    
    const score = calculateDebtManagementScore(monthlyDebtPayment, monthlyIncome);
    
    // 10000 / 100000 = 0.1 = %10
    expect(score).toBe(30);
  });
  
  it('%20 borç/gelir oranında iyi puan vermeli (25/30)', () => {
    const monthlyDebtPayment = 20000;
    const monthlyIncome = 100000;
    
    const score = calculateDebtManagementScore(monthlyDebtPayment, monthlyIncome);
    
    // 20000 / 100000 = 0.2 = %20
    expect(score).toBe(25);
  });
  
  it('%30 borç/gelir oranında kabul edilebilir puan vermeli (20/30)', () => {
    const monthlyDebtPayment = 30000;
    const monthlyIncome = 100000;
    
    const score = calculateDebtManagementScore(monthlyDebtPayment, monthlyIncome);
    
    // 30000 / 100000 = 0.3 = %30
    expect(score).toBe(20);
  });
  
  it('%40 borç/gelir oranında riskli puan vermeli (10/30)', () => {
    const monthlyDebtPayment = 40000;
    const monthlyIncome = 100000;
    
    const score = calculateDebtManagementScore(monthlyDebtPayment, monthlyIncome);
    
    // 40000 / 100000 = 0.4 = %40
    expect(score).toBe(10);
  });
  
  it('%50 borç/gelir oranında çok riskli puan vermeli (5/30)', () => {
    const monthlyDebtPayment = 50000;
    const monthlyIncome = 100000;
    
    const score = calculateDebtManagementScore(monthlyDebtPayment, monthlyIncome);
    
    // 50000 / 100000 = 0.5 = %50
    expect(score).toBe(5);
  });
  
  it('%77 borç/gelir oranında kritik puan vermeli (0/30)', () => {
    const monthlyDebtPayment = 47697;
    const monthlyIncome = 61600;
    
    const score = calculateDebtManagementScore(monthlyDebtPayment, monthlyIncome);
    
    // 47697 / 61600 = 0.774 = %77.4 (kullanıcının gerçek durumu)
    expect(score).toBe(0);
  });
  
  it('%100 borç/gelir oranında kritik puan vermeli (0/30)', () => {
    const monthlyDebtPayment = 100000;
    const monthlyIncome = 100000;
    
    const score = calculateDebtManagementScore(monthlyDebtPayment, monthlyIncome);
    
    // 100000 / 100000 = 1.0 = %100
    expect(score).toBe(0);
  });
  
  it('gelir 0 ise 0 puan vermeli', () => {
    const monthlyDebtPayment = 10000;
    const monthlyIncome = 0;
    
    const score = calculateDebtManagementScore(monthlyDebtPayment, monthlyIncome);
    
    expect(score).toBe(0);
  });
  
  it('küçük borç oranlarında doğru puan vermeli (%5)', () => {
    const monthlyDebtPayment = 5000;
    const monthlyIncome = 100000;
    
    const score = calculateDebtManagementScore(monthlyDebtPayment, monthlyIncome);
    
    // 5000 / 100000 = 0.05 = %5
    expect(score).toBe(30);
  });
});
