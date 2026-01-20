/**
 * Finansal Öneri Servisi
 * Kullanıcının finansal durumuna göre akıllı öneriler üretir
 */

import type { Payment, Income } from '@/types';
import type { Expense } from '@/types/expense';
import { PaymentCategory } from '@/types';

export interface FinancialSuggestion {
  id: string;
  type: 'debt' | 'savings' | 'budget' | 'emergency' | 'investment';
  priority: number; // 1-5, 1 en yüksek öncelik
  icon: string;
  title: string;
  description: string;
  action?: {
    label: string;
    route: string;
  };
}

interface FinancialData {
  payments: Payment[];
  incomes: Income[];
  expenses: Expense[];
}

/**
 * Kullanıcının finansal durumuna göre öneriler oluştur
 */
export function generateFinancialSuggestions(data: FinancialData): FinancialSuggestion[] {
  const suggestions: FinancialSuggestion[] = [];

  // Mevcut ay bilgileri
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // Sadece bu ayın verilerini filtrele
  const currentMonthIncomes = data.incomes.filter(income => {
    const date = new Date(income.date);
    return date.getFullYear() === currentYear && date.getMonth() === currentMonth;
  });

  const currentMonthPayments = data.payments.filter(payment => {
    const date = new Date(payment.dueDate);
    return date.getFullYear() === currentYear && date.getMonth() === currentMonth;
  });

  const currentMonthExpenses = data.expenses.filter(expense => {
    const date = new Date(expense.date);
    return date.getFullYear() === currentYear && date.getMonth() === currentMonth;
  });

  // Aylık gelir hesapla
  const monthlyIncome = currentMonthIncomes.reduce((sum, income) => sum + income.amount, 0);

  // Aylık harcama hesapla
  const monthlyExpenses = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Bu aydaki ödenmemiş ödemeler
  const unpaidPayments = currentMonthPayments.filter(p => !p.isPaid);
  const monthlyUnpaidPayments = unpaidPayments.reduce((sum, p) => sum + p.amount, 0);

  // Bu aydaki borçlar (kredi ve kredi kartı)
  const monthlyDebts = unpaidPayments.filter(
    p => p.category === PaymentCategory.LOAN || p.category === PaymentCategory.CREDIT_CARD
  );
  const monthlyDebt = monthlyDebts.reduce((sum, d) => sum + d.amount, 0);

  // Mevcut birikim (tüm zamanların toplamı)
  const totalIncome = data.incomes.reduce((sum, income) => sum + income.amount, 0);
  const totalPaidPayments = data.payments.filter(p => p.isPaid).reduce((sum, p) => sum + p.amount, 0);
  const totalExpenses = data.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const currentSavings = Math.max(0, totalIncome - totalPaidPayments - totalExpenses);

  // Aylık toplam gider
  const monthlyTotalExpenses = monthlyUnpaidPayments + monthlyExpenses;

  // Tasarruf oranı
  const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyTotalExpenses) / monthlyIncome) * 100 : 0;

  // 1. Borç Uyarısı (Yüksek borç varsa)
  if (monthlyDebt > monthlyIncome * 0.5) {
    suggestions.push({
      id: 'high_debt',
      type: 'debt',
      priority: 1,
      icon: '⚠️',
      title: 'Yüksek Borç Yükü',
      description: `Bu ayki borç ödemeleriniz (${monthlyDebt.toFixed(0)} ₺) aylık gelirinizin %${((monthlyDebt / monthlyIncome) * 100).toFixed(0)}'ini aşıyor. Borç ödeme planı oluşturmanızı öneriyoruz.`,
      action: {
        label: 'Borçlarımı Görüntüle',
        route: '/debt-list',
      },
    });
  }

  // 2. Acil Fon Uyarısı (3 aylık gider kadar birikim yoksa)
  const emergencyFundTarget = monthlyTotalExpenses * 3;
  if (currentSavings < emergencyFundTarget) {
    suggestions.push({
      id: 'emergency_fund',
      type: 'emergency',
      priority: 2,
      icon: '🛡️',
      title: 'Acil Fon Oluşturun',
      description: `Acil durum fonu hedefi ${emergencyFundTarget.toFixed(0)} ₺. Şu an ${currentSavings.toFixed(0)} ₺ birikiminiz var. ${(emergencyFundTarget - currentSavings).toFixed(0)} ₺ daha biriktirmeniz gerekiyor.`,
      action: {
        label: 'Tasarruf Planı',
        route: '/(tabs)/goals',
      },
    });
  }

  // 3. Düşük Tasarruf Oranı (%20'nin altındaysa)
  if (savingsRate < 20 && savingsRate >= 0) {
    suggestions.push({
      id: 'low_savings_rate',
      type: 'savings',
      priority: 3,
      icon: '💰',
      title: 'Tasarruf Oranını Artırın',
      description: `Tasarruf oranınız %${savingsRate.toFixed(0)}. İdeal oran en az %20. Harcamalarınızı gözden geçirin ve gereksiz giderleri azaltın.`,
      action: {
        label: 'Harcamalarımı İncele',
        route: '/expense-list',
      },
    });
  }

  // 4. Bütçe Aşımı (Harcamalar gelirden fazlaysa)
  if (monthlyExpenses > totalIncome) {
    suggestions.push({
      id: 'budget_exceeded',
      type: 'budget',
      priority: 1,
      icon: '🚨',
      title: 'Bütçe Aşımı!',
      description: `Aylık giderleriniz (${monthlyExpenses.toFixed(0)} ₺) gelirinizden (${totalIncome.toFixed(0)} ₺) fazla. Acilen harcama kesintisi yapmalısınız.`,
      action: {
        label: 'Bütçe Ayarları',
        route: '/budget-settings',
      },
    });
  }

  // 5. Yatırım Önerisi (İyi tasarruf oranı ve düşük borç varsa)
  if (savingsRate >= 30 && monthlyDebt < monthlyIncome * 0.2 && currentSavings > emergencyFundTarget) {
    suggestions.push({
      id: 'investment_ready',
      type: 'investment',
      priority: 4,
      icon: '📈',
      title: 'Yatırım Yapmaya Hazırsınız',
      description: `Finansal durumunuz sağlam! Tasarruf oranınız %${savingsRate.toFixed(0)} ve acil fonunuz hazır. Yatırım seçeneklerini değerlendirebilirsiniz.`,
      action: {
        label: 'Finansal Sağlık',
        route: '/health-score',
      },
    });
  }

  // 6. Vadesi Yaklaşan Ödeme Uyarısı
  const upcomingPayments = unpaidPayments.filter(p => {
    const dueDate = new Date(p.dueDate);
    const today = new Date();
    const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilDue <= 7 && daysUntilDue >= 0;
  });

  if (upcomingPayments.length > 0) {
    const totalUpcoming = upcomingPayments.reduce((sum, p) => sum + p.amount, 0);
    suggestions.push({
      id: 'upcoming_payments',
      type: 'debt',
      priority: 2,
      icon: '📅',
      title: `${upcomingPayments.length} Ödeme Yaklaşıyor`,
      description: `7 gün içinde ${totalUpcoming.toFixed(0)} ₺ tutarında ${upcomingPayments.length} ödemeniz var. Ödeme yapmayı unutmayın!`,
      action: {
        label: 'Ödemeleri Görüntüle',
        route: '/(tabs)/payments',
      },
    });
  }

  // Öncelik sırasına göre sırala ve en fazla 3 öneri döndür
  return suggestions.sort((a, b) => a.priority - b.priority).slice(0, 3);
}
