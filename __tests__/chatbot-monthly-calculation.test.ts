/**
 * Chatbot Aylık Finansal Context Hesaplama Testi
 * 
 * Bu test, chatbot'un finansal context hesaplamasının
 * aylık bazda doğru çalışıp çalışmadığını kontrol eder.
 */

import { describe, it, expect } from 'vitest';

// Test için yardımcı fonksiyon
function calculateMonthlyFinancialContext(
  incomes: Array<{ date: string; amount: number }>,
  payments: Array<{ dueDate: string; amount: number; isPaid: boolean; category: string }>,
  expenses: Array<{ date: string; amount: number }>
) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  const monthStart = new Date(currentYear, currentMonth, 1);
  const monthEnd = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);
  
  const isInCurrentMonth = (dateString: string) => {
    const date = new Date(dateString);
    return date >= monthStart && date <= monthEnd;
  };
  
  // Aylık gelir
  const monthlyIncome = incomes
    .filter((income) => isInCurrentMonth(income.date))
    .reduce((sum, income) => sum + income.amount, 0);
  
  // Aylık ödemeler
  const monthlyPayments = payments
    .filter((payment) => !payment.isPaid && isInCurrentMonth(payment.dueDate))
    .reduce((sum, payment) => sum + payment.amount, 0);
  
  // Aylık harcamalar
  const monthlyExpensesAmount = expenses
    .filter((expense) => isInCurrentMonth(expense.date))
    .reduce((sum, expense) => sum + expense.amount, 0);
  
  // Toplam aylık gider
  const totalMonthlyExpenses = monthlyPayments + monthlyExpensesAmount;
  
  // Mevcut birikim (tüm zamanlar)
  const totalIncomeAllTime = incomes.reduce((sum, income) => sum + income.amount, 0);
  const paidPayments = payments
    .filter((payment) => payment.isPaid)
    .reduce((sum, payment) => sum + payment.amount, 0);
  const totalExpensesAllTime = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const currentSavings = Math.max(0, totalIncomeAllTime - paidPayments - totalExpensesAllTime);
  
  return {
    monthlyIncome,
    monthlyExpenses: totalMonthlyExpenses,
    currentSavings,
  };
}

describe('Chatbot Aylık Finansal Context Hesaplama', () => {
  it('sadece bu ayın gelirlerini hesaplamalı', () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const incomes = [
      { date: new Date(currentYear, currentMonth, 5).toISOString(), amount: 5000 }, // Bu ay
      { date: new Date(currentYear, currentMonth, 15).toISOString(), amount: 2000 }, // Bu ay
      { date: new Date(currentYear, currentMonth - 1, 10).toISOString(), amount: 3000 }, // Geçen ay
      { date: new Date(currentYear, currentMonth - 2, 20).toISOString(), amount: 4000 }, // 2 ay önce
    ];
    
    const result = calculateMonthlyFinancialContext(incomes, [], []);
    
    expect(result.monthlyIncome).toBe(7000); // Sadece bu ayın gelirleri (5000 + 2000)
  });
  
  it('sadece bu ayın ödenmemiş ödemelerini hesaplamalı', () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const payments = [
      { dueDate: new Date(currentYear, currentMonth, 10).toISOString(), amount: 1000, isPaid: false, category: 'RENT' }, // Bu ay, ödenmemiş
      { dueDate: new Date(currentYear, currentMonth, 20).toISOString(), amount: 500, isPaid: false, category: 'UTILITIES' }, // Bu ay, ödenmemiş
      { dueDate: new Date(currentYear, currentMonth, 15).toISOString(), amount: 300, isPaid: true, category: 'RENT' }, // Bu ay, ödenmiş (dahil edilmemeli)
      { dueDate: new Date(currentYear, currentMonth - 1, 10).toISOString(), amount: 2000, isPaid: false, category: 'RENT' }, // Geçen ay (dahil edilmemeli)
    ];
    
    const result = calculateMonthlyFinancialContext([], payments, []);
    
    expect(result.monthlyExpenses).toBe(1500); // Sadece bu ayın ödenmemiş ödemeleri (1000 + 500)
  });
  
  it('sadece bu ayın harcamalarını hesaplamalı', () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const expenses = [
      { date: new Date(currentYear, currentMonth, 5).toISOString(), amount: 200 }, // Bu ay
      { date: new Date(currentYear, currentMonth, 15).toISOString(), amount: 300 }, // Bu ay
      { date: new Date(currentYear, currentMonth - 1, 10).toISOString(), amount: 500 }, // Geçen ay (dahil edilmemeli)
    ];
    
    const result = calculateMonthlyFinancialContext([], [], expenses);
    
    expect(result.monthlyExpenses).toBe(500); // Sadece bu ayın harcamaları (200 + 300)
  });
  
  it('aylık giderleri doğru hesaplamalı (ödemeler + harcamalar)', () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const payments = [
      { dueDate: new Date(currentYear, currentMonth, 10).toISOString(), amount: 1000, isPaid: false, category: 'RENT' },
    ];
    
    const expenses = [
      { date: new Date(currentYear, currentMonth, 5).toISOString(), amount: 500 },
    ];
    
    const result = calculateMonthlyFinancialContext([], payments, expenses);
    
    expect(result.monthlyExpenses).toBe(1500); // Ödemeler + harcamalar (1000 + 500)
  });
  
  it('mevcut birikimi tüm zamanların toplamından hesaplamalı', () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const incomes = [
      { date: new Date(currentYear, currentMonth, 5).toISOString(), amount: 5000 }, // Bu ay
      { date: new Date(currentYear, currentMonth - 1, 10).toISOString(), amount: 4000 }, // Geçen ay
      { date: new Date(currentYear, currentMonth - 2, 15).toISOString(), amount: 3000 }, // 2 ay önce
    ];
    
    const payments = [
      { dueDate: new Date(currentYear, currentMonth, 10).toISOString(), amount: 1000, isPaid: true, category: 'RENT' }, // Ödenmiş
      { dueDate: new Date(currentYear, currentMonth - 1, 15).toISOString(), amount: 2000, isPaid: true, category: 'UTILITIES' }, // Ödenmiş
    ];
    
    const expenses = [
      { date: new Date(currentYear, currentMonth, 5).toISOString(), amount: 500 },
      { date: new Date(currentYear, currentMonth - 1, 10).toISOString(), amount: 300 },
    ];
    
    const result = calculateMonthlyFinancialContext(incomes, payments, expenses);
    
    // Toplam gelir: 12000
    // Ödenmiş ödemeler: 3000
    // Toplam harcamalar: 800
    // Birikim: 12000 - 3000 - 800 = 8200
    expect(result.currentSavings).toBe(8200);
  });
  
  it('veri yoksa 0 döndürmeli', () => {
    const result = calculateMonthlyFinancialContext([], [], []);
    
    expect(result.monthlyIncome).toBe(0);
    expect(result.monthlyExpenses).toBe(0);
    expect(result.currentSavings).toBe(0);
  });
  
  it('negatif birikim durumunda 0 döndürmeli', () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const incomes = [
      { date: new Date(currentYear, currentMonth, 5).toISOString(), amount: 1000 },
    ];
    
    const payments = [
      { dueDate: new Date(currentYear, currentMonth, 10).toISOString(), amount: 2000, isPaid: true, category: 'RENT' },
    ];
    
    const expenses = [
      { date: new Date(currentYear, currentMonth, 5).toISOString(), amount: 500 },
    ];
    
    const result = calculateMonthlyFinancialContext(incomes, payments, expenses);
    
    // Toplam gelir: 1000
    // Ödenmiş ödemeler: 2000
    // Toplam harcamalar: 500
    // Birikim: 1000 - 2000 - 500 = -1500 → 0
    expect(result.currentSavings).toBe(0);
  });
});
