/**
 * Çığ (Avalanche) Yöntemi Testi
 * 
 * En yüksek faizli borcu önce öder.
 */

import { describe, it, expect } from 'vitest';
import { calculateAvalancheMethod } from '@/lib/debt-payoff';
import type { DebtInfo } from '@/types/debt-payoff';

describe('Çığ (Avalanche) Yöntemi', () => {
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
  
  it('en yüksek faizli borcu önce ödemeli (Kredi Kartı B → Kredi Kartı A → Kredi)', () => {
    const plan = calculateAvalancheMethod(debts, 0);
    
    // Borç sırası: En yüksek faizden düşüğe
    expect(plan.debtOrder[0]).toBe('3'); // Kredi Kartı B (%30)
    expect(plan.debtOrder[1]).toBe('1'); // Kredi Kartı A (%25)
    expect(plan.debtOrder[2]).toBe('2'); // Kredi (%15)
  });
  
  it('ekstra ödeme olmadan minimum ödeme ile hesaplama yapmalı', () => {
    const plan = calculateAvalancheMethod(debts, 0);
    
    // Toplam borç: 65.000 TL
    expect(plan.totalPrincipal).toBeCloseTo(65000, 2);
    
    // Toplam faiz > 0 (faiz ödeniyor)
    expect(plan.totalInterest).toBeGreaterThan(0);
    
    // Toplam ödeme = anapara + faiz
    expect(plan.totalPayment).toBe(plan.totalPrincipal + plan.totalInterest);
  });
  
  it('ekstra ödeme ile daha hızlı borç ödemeli', () => {
    const planWithoutExtra = calculateAvalancheMethod(debts, 0);
    const planWithExtra = calculateAvalancheMethod(debts, 5000);
    
    // Ekstra ödeme ile daha az ay
    expect(planWithExtra.totalMonths).toBeLessThan(planWithoutExtra.totalMonths);
    
    // Ekstra ödeme ile daha az faiz
    expect(planWithExtra.totalInterest).toBeLessThan(planWithoutExtra.totalInterest);
  });
  
  it('kar topu yönteminden daha az faiz ödemeli (genellikle)', async () => {
    const { calculateSnowballMethod } = await import('@/lib/debt-payoff');
    
    const snowballPlan = calculateSnowballMethod(debts, 5000);
    const avalanchePlan = calculateAvalancheMethod(debts, 5000);
    
    // Çığ yöntemi genellikle daha az faiz ödetir
    // (Bu durumda her iki yöntem de aynı borç sırasını veriyor, bu yüzden eşit veya daha az olmalı)
    expect(avalanchePlan.totalInterest).toBeLessThanOrEqual(snowballPlan.totalInterest);
  });
  
  it('aylık ödemeler doğru hesaplanmalı', () => {
    const plan = calculateAvalancheMethod(debts, 0);
    
    // Aylık ödeme sayısı > 0
    expect(plan.monthlyPayments.length).toBeGreaterThan(0);
    
    // Her aylık ödeme doğru formatta
    for (const payment of plan.monthlyPayments) {
      expect(payment.month).toBeGreaterThan(0);
      expect(payment.debtId).toBeTruthy();
      expect(payment.principal).toBeGreaterThanOrEqual(0);
      expect(payment.interest).toBeGreaterThanOrEqual(0);
      expect(payment.totalPayment).toBe(payment.principal + payment.interest);
      expect(payment.remainingBalance).toBeGreaterThanOrEqual(0);
    }
  });
  
  it('method alanı "avalanche" olmalı', () => {
    const plan = calculateAvalancheMethod(debts, 0);
    
    expect(plan.method).toBe('avalanche');
  });
  
  it('ekstra ödeme kaydedilmeli', () => {
    const extraPayment = 5000;
    const plan = calculateAvalancheMethod(debts, extraPayment);
    
    expect(plan.monthlyExtraPayment).toBe(extraPayment);
  });
});
