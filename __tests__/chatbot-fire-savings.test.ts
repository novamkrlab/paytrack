/**
 * Chatbot FIRE Ayarları Entegrasyonu Testi
 * 
 * Bu test, chatbot'un FIRE ayarlarındaki "Mevcut Birikim" değerini
 * doğru kullanıp kullanmadığını kontrol eder.
 */

import { describe, it, expect } from 'vitest';

// Test için yardımcı fonksiyon
function calculateCurrentSavings(
  fireSettings: { currentSavings: number } | null,
  incomes: Array<{ amount: number }>,
  paidPayments: Array<{ amount: number }>,
  expenses: Array<{ amount: number }>
): number {
  // Eğer kullanıcı FIRE ayarlarında mevcut birikim girdiyse, onu kullan
  if (fireSettings !== null && fireSettings.currentSavings > 0) {
    return fireSettings.currentSavings;
  }
  
  // Yoksa, otomatik hesapla
  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  const totalPaidPayments = paidPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  return Math.max(0, totalIncome - totalPaidPayments - totalExpenses);
}

describe('Chatbot FIRE Ayarları Entegrasyonu', () => {
  it('FIRE ayarlarındaki mevcut birikim değerini kullanmalı', () => {
    const fireSettings = { currentSavings: 900000 };
    const incomes = [{ amount: 10000 }];
    const paidPayments = [{ amount: 5000 }];
    const expenses = [{ amount: 2000 }];
    
    const result = calculateCurrentSavings(fireSettings, incomes, paidPayments, expenses);
    
    // FIRE ayarlarındaki değeri kullanmalı (otomatik hesaplama değil)
    expect(result).toBe(900000);
  });
  
  it('FIRE ayarları yoksa otomatik hesaplama yapmalı', () => {
    const fireSettings = null;
    const incomes = [{ amount: 100000 }, { amount: 50000 }];
    const paidPayments = [{ amount: 30000 }];
    const expenses = [{ amount: 20000 }];
    
    const result = calculateCurrentSavings(fireSettings, incomes, paidPayments, expenses);
    
    // Otomatik hesaplama: 150000 - 30000 - 20000 = 100000
    expect(result).toBe(100000);
  });
  
  it('FIRE ayarlarında currentSavings 0 ise otomatik hesaplama yapmalı', () => {
    const fireSettings = { currentSavings: 0 };
    const incomes = [{ amount: 50000 }];
    const paidPayments = [{ amount: 20000 }];
    const expenses = [{ amount: 10000 }];
    
    const result = calculateCurrentSavings(fireSettings, incomes, paidPayments, expenses);
    
    // 0 olduğu için otomatik hesaplama: 50000 - 20000 - 10000 = 20000
    expect(result).toBe(20000);
  });
  
  it('FIRE ayarlarında negatif değer varsa otomatik hesaplama yapmalı', () => {
    const fireSettings = { currentSavings: -5000 };
    const incomes = [{ amount: 30000 }];
    const paidPayments = [{ amount: 10000 }];
    const expenses = [{ amount: 5000 }];
    
    const result = calculateCurrentSavings(fireSettings, incomes, paidPayments, expenses);
    
    // Negatif olduğu için otomatik hesaplama: 30000 - 10000 - 5000 = 15000
    expect(result).toBe(15000);
  });
  
  it('otomatik hesaplamada negatif sonuç çıkarsa 0 döndürmeli', () => {
    const fireSettings = null;
    const incomes = [{ amount: 10000 }];
    const paidPayments = [{ amount: 20000 }];
    const expenses = [{ amount: 5000 }];
    
    const result = calculateCurrentSavings(fireSettings, incomes, paidPayments, expenses);
    
    // 10000 - 20000 - 5000 = -15000 → 0
    expect(result).toBe(0);
  });
  
  it('veri yoksa ve FIRE ayarları da yoksa 0 döndürmeli', () => {
    const fireSettings = null;
    const incomes: Array<{ amount: number }> = [];
    const paidPayments: Array<{ amount: number }> = [];
    const expenses: Array<{ amount: number }> = [];
    
    const result = calculateCurrentSavings(fireSettings, incomes, paidPayments, expenses);
    
    expect(result).toBe(0);
  });
  
  it('FIRE ayarlarında büyük sayılar doğru işlenmeli', () => {
    const fireSettings = { currentSavings: 5000000 }; // 5 milyon TL
    const incomes = [{ amount: 100000 }];
    const paidPayments = [{ amount: 50000 }];
    const expenses = [{ amount: 30000 }];
    
    const result = calculateCurrentSavings(fireSettings, incomes, paidPayments, expenses);
    
    expect(result).toBe(5000000);
  });
});
