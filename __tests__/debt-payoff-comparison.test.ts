/**
 * Borç Azaltma Yöntemleri Karşılaştırma Testi
 */

import { describe, it, expect } from 'vitest';
import { comparePayoffMethods, getDebtPayoffSummary } from '@/lib/debt-payoff';
import type { DebtInfo } from '@/types/debt-payoff';

describe('Borç Azaltma Yöntemleri Karşılaştırma', () => {
  const debts: DebtInfo[] = [
    {
      id: '1',
      name: 'Kredi Kartı A',
      balance: 10000,
      interestRate: 0.25, // %25
      minimumPayment: 500,
      dueDate: '2026-02-01',
    },
    {
      id: '2',
      name: 'Kredi',
      balance: 50000,
      interestRate: 0.15, // %15
      minimumPayment: 2500,
      dueDate: '2026-02-01',
    },
    {
      id: '3',
      name: 'Kredi Kartı B',
      balance: 5000,
      interestRate: 0.30, // %30
      minimumPayment: 250,
      dueDate: '2026-02-01',
    },
  ];
  
  it('her iki yöntemi de karşılaştırmalı', () => {
    const comparison = comparePayoffMethods(debts, 5000);
    
    // Kar topu planı
    expect(comparison.snowball).toBeDefined();
    expect(comparison.snowball.method).toBe('snowball');
    
    // Çığ planı
    expect(comparison.avalanche).toBeDefined();
    expect(comparison.avalanche.method).toBe('avalanche');
  });
  
  it('ay farkını hesaplamalı', () => {
    const comparison = comparePayoffMethods(debts, 5000);
    
    // Ay farkı = kar topu ayı - çığ ayı
    const expectedDifference = comparison.snowball.totalMonths - comparison.avalanche.totalMonths;
    expect(comparison.monthsDifference).toBe(expectedDifference);
  });
  
  it('faiz farkını hesaplamalı', () => {
    const comparison = comparePayoffMethods(debts, 5000);
    
    // Faiz farkı = kar topu faizi - çığ faizi
    const expectedDifference = comparison.snowball.totalInterest - comparison.avalanche.totalInterest;
    expect(comparison.interestDifference).toBeCloseTo(expectedDifference, 2);
  });
  
  it('önerilen yöntemi belirlemeli', () => {
    const comparison = comparePayoffMethods(debts, 5000);
    
    // Önerilen yöntem "snowball" veya "avalanche" olmalı
    expect(['snowball', 'avalanche']).toContain(comparison.recommendedMethod);
    
    // Eğer faiz farkı 1000 TL'den fazlaysa, çığ önerilmeli
    if (comparison.interestDifference > 1000) {
      expect(comparison.recommendedMethod).toBe('avalanche');
    }
  });
  
  it('borç özeti doğru hesaplanmalı', () => {
    const summary = getDebtPayoffSummary(debts, 100000, 50000);
    
    // Toplam borç sayısı
    expect(summary.totalDebts).toBe(3);
    
    // Toplam borç miktarı
    expect(summary.totalBalance).toBe(65000);
    
    // Toplam minimum ödeme
    expect(summary.totalMinimumPayment).toBe(3250);
    
    // Ortalama faiz oranı
    const expectedAverage = (0.25 + 0.15 + 0.30) / 3;
    expect(summary.averageInterestRate).toBeCloseTo(expectedAverage, 4);
    
    // Kullanılabilir ekstra ödeme
    // Gelir - Harcama - Minimum Ödeme = 100000 - 50000 - 3250 = 46750
    expect(summary.availableExtraPayment).toBe(46750);
  });
  
  it('kullanılabilir ekstra ödeme negatif olamaz', () => {
    // Gelir < Harcama + Minimum Ödeme
    const summary = getDebtPayoffSummary(debts, 10000, 50000);
    
    // Kullanılabilir ekstra ödeme 0 olmalı (negatif değil)
    expect(summary.availableExtraPayment).toBe(0);
  });
  
  it('borç yoksa özet boş olmalı', () => {
    const summary = getDebtPayoffSummary([], 100000, 50000);
    
    expect(summary.totalDebts).toBe(0);
    expect(summary.totalBalance).toBe(0);
    expect(summary.totalMinimumPayment).toBe(0);
    expect(summary.averageInterestRate).toBe(0);
  });
});
