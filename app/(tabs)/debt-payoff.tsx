import { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { ScreenContainer } from '@/components/screen-container';
import { useApp } from '@/lib/app-context';
import { useTranslation } from 'react-i18next';
import { useColors } from '@/hooks/use-colors';
import { PaymentCategory, type Payment } from '@/types';
import type { DebtInfo, DebtPayoffMethod } from '@/types/debt-payoff';
import {
  comparePayoffMethods,
  getDebtPayoffSummary,
  calculateMonthlyProgress,
} from '@/lib/debt-payoff';

export default function DebtPayoffScreen() {
  const { t } = useTranslation();
  const colors = useColors();
  const { state } = useApp();
  
  const [selectedMethod, setSelectedMethod] = useState<DebtPayoffMethod>('snowball');
  const [extraPayment, setExtraPayment] = useState(0);
  
  // Borçları DebtInfo formatına dönüştür
  const debts: DebtInfo[] = useMemo(() => {
    return state.payments
      .filter(
        (payment: Payment) =>
          !payment.isPaid &&
          (payment.category === PaymentCategory.LOAN || payment.category === PaymentCategory.CREDIT_CARD)
      )
      .map((payment: Payment) => ({
        id: payment.id,
        name: payment.name,
        balance: payment.amount,
        interestRate: 0.25, // %25 varsayılan faiz (TODO: Kullanıcıdan al)
        minimumPayment: payment.amount * 0.05, // %5 minimum ödeme (TODO: Kullanıcıdan al)
        dueDate: payment.dueDate,
      }));
  }, [state.payments]);
  
  // Aylık gelir ve harcama
  const monthlyIncome = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const monthStart = new Date(currentYear, currentMonth, 1);
    const monthEnd = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);
    
    return state.incomes
      .filter((income: any) => {
        const date = new Date(income.date);
        return date >= monthStart && date <= monthEnd;
      })
      .reduce((sum: number, income: any) => sum + income.amount, 0);
  }, [state.incomes]);
  
  const monthlyExpenses = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const monthStart = new Date(currentYear, currentMonth, 1);
    const monthEnd = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);
    
    return state.payments
      .filter((payment: Payment) => {
        const date = new Date(payment.dueDate);
        return !payment.isPaid && date >= monthStart && date <= monthEnd;
      })
      .reduce((sum: number, payment: Payment) => sum + payment.amount, 0);
  }, [state.payments]);
  
  // Borç özeti
  const summary = useMemo(
    () => getDebtPayoffSummary(debts, monthlyIncome, monthlyExpenses),
    [debts, monthlyIncome, monthlyExpenses]
  );
  
  // İki yöntemi karşılaştır
  const comparison = useMemo(
    () => (debts.length > 0 ? comparePayoffMethods(debts, extraPayment) : null),
    [debts, extraPayment]
  );
  
  // Seçili yöntemin planı
  const selectedPlan = comparison
    ? selectedMethod === 'snowball'
      ? comparison.snowball
      : comparison.avalanche
    : null;
  
  // Aylık ilerleme (grafik için)
  const progress = selectedPlan ? calculateMonthlyProgress(selectedPlan) : [];
  
  // Borç yoksa
  if (debts.length === 0) {
    return (
      <ScreenContainer className="p-6">
        <View className="flex-1 items-center justify-center">
          <Text className="text-2xl font-bold text-foreground mb-2">
            {t('debtPayoff.noDebts')}
          </Text>
          <Text className="text-base text-muted text-center">
            {t('debtPayoff.noDebtsDescription')}
          </Text>
        </View>
      </ScreenContainer>
    );
  }
  
  return (
    <ScreenContainer className="p-6">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="gap-6">
          {/* Başlık */}
          <View>
            <Text className="text-2xl font-bold text-foreground">
              {t('debtPayoff.title')}
            </Text>
            <Text className="text-sm text-muted mt-1">
              {t('debtPayoff.subtitle')}
            </Text>
          </View>
          
          {/* Özet Kartları */}
          <View className="flex-row gap-3">
            <View className="flex-1 bg-surface rounded-xl p-4 border border-border">
              <Text className="text-xs text-muted mb-1">{t('debtPayoff.totalDebts')}</Text>
              <Text className="text-xl font-bold text-foreground">{summary.totalDebts}</Text>
            </View>
            <View className="flex-1 bg-surface rounded-xl p-4 border border-border">
              <Text className="text-xs text-muted mb-1">{t('debtPayoff.totalBalance')}</Text>
              <Text className="text-xl font-bold text-foreground">
                {summary.totalBalance.toLocaleString('tr-TR')} ₺
              </Text>
            </View>
          </View>
          
          {/* Aylık Ekstra Ödeme Slider */}
          <View className="bg-surface rounded-xl p-4 border border-border">
            <Text className="text-sm font-semibold text-foreground mb-2">
              {t('debtPayoff.extraPayment')}
            </Text>
            <Text className="text-2xl font-bold text-primary mb-4">
              {extraPayment.toLocaleString('tr-TR')} ₺
            </Text>
            <Slider
              minimumValue={0}
              maximumValue={50000}
              step={1000}
              value={extraPayment}
              onValueChange={setExtraPayment}
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor={colors.border}
              thumbTintColor={colors.primary}
            />
            <View className="flex-row justify-between mt-2">
              <Text className="text-xs text-muted">0 ₺</Text>
              <Text className="text-xs text-muted">50.000 ₺</Text>
            </View>
            {summary.availableExtraPayment > 0 && (
              <Text className="text-xs text-muted mt-2">
                {t('debtPayoff.availableExtra')}: {summary.availableExtraPayment.toLocaleString('tr-TR')} ₺
              </Text>
            )}
          </View>
          
          {/* Yöntem Seçimi */}
          <View>
            <Text className="text-sm font-semibold text-foreground mb-3">
              {t('debtPayoff.selectMethod')}
            </Text>
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setSelectedMethod('snowball')}
                className={`flex-1 rounded-xl p-4 border-2 ${
                  selectedMethod === 'snowball'
                    ? 'bg-primary/10 border-primary'
                    : 'bg-surface border-border'
                }`}
              >
                <Text
                  className={`text-sm font-semibold mb-1 ${
                    selectedMethod === 'snowball' ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  {t('debtPayoff.snowball')}
                </Text>
                <Text className="text-xs text-muted">{t('debtPayoff.snowballDesc')}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => setSelectedMethod('avalanche')}
                className={`flex-1 rounded-xl p-4 border-2 ${
                  selectedMethod === 'avalanche'
                    ? 'bg-primary/10 border-primary'
                    : 'bg-surface border-border'
                }`}
              >
                <Text
                  className={`text-sm font-semibold mb-1 ${
                    selectedMethod === 'avalanche' ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  {t('debtPayoff.avalanche')}
                </Text>
                <Text className="text-xs text-muted">{t('debtPayoff.avalancheDesc')}</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Karşılaştırma */}
          {comparison && (
            <View className="bg-surface rounded-xl p-4 border border-border">
              <Text className="text-sm font-semibold text-foreground mb-3">
                {t('debtPayoff.comparison')}
              </Text>
              
              <View className="gap-3">
                {/* Kar topu */}
                <View className="flex-row justify-between items-center">
                  <Text className="text-sm text-muted">{t('debtPayoff.snowball')}</Text>
                  <View className="items-end">
                    <Text className="text-sm font-semibold text-foreground">
                      {comparison.snowball.totalMonths} {t('debtPayoff.months')}
                    </Text>
                    <Text className="text-xs text-muted">
                      {comparison.snowball.totalInterest.toLocaleString('tr-TR')} ₺ {t('debtPayoff.interest')}
                    </Text>
                  </View>
                </View>
                
                {/* Çığ */}
                <View className="flex-row justify-between items-center">
                  <Text className="text-sm text-muted">{t('debtPayoff.avalanche')}</Text>
                  <View className="items-end">
                    <Text className="text-sm font-semibold text-foreground">
                      {comparison.avalanche.totalMonths} {t('debtPayoff.months')}
                    </Text>
                    <Text className="text-xs text-muted">
                      {comparison.avalanche.totalInterest.toLocaleString('tr-TR')} ₺ {t('debtPayoff.interest')}
                    </Text>
                  </View>
                </View>
                
                {/* Fark */}
                {comparison.interestDifference > 0 && (
                  <View className="bg-success/10 rounded-lg p-3 mt-2">
                    <Text className="text-xs text-success font-semibold">
                      {t('debtPayoff.savingsWithAvalanche')}: {comparison.interestDifference.toLocaleString('tr-TR')} ₺
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}
          
          {/* Seçili Plan Özeti */}
          {selectedPlan && (
            <View className="bg-primary/10 rounded-xl p-4 border border-primary">
              <Text className="text-lg font-bold text-primary mb-3">
                {selectedMethod === 'snowball' ? t('debtPayoff.snowball') : t('debtPayoff.avalanche')}
              </Text>
              
              <View className="gap-2">
                <View className="flex-row justify-between">
                  <Text className="text-sm text-foreground">{t('debtPayoff.payoffTime')}</Text>
                  <Text className="text-sm font-semibold text-foreground">
                    {selectedPlan.totalMonths} {t('debtPayoff.months')}
                  </Text>
                </View>
                
                <View className="flex-row justify-between">
                  <Text className="text-sm text-foreground">{t('debtPayoff.totalInterest')}</Text>
                  <Text className="text-sm font-semibold text-foreground">
                    {selectedPlan.totalInterest.toLocaleString('tr-TR')} ₺
                  </Text>
                </View>
                
                <View className="flex-row justify-between">
                  <Text className="text-sm text-foreground">{t('debtPayoff.totalPayment')}</Text>
                  <Text className="text-sm font-semibold text-foreground">
                    {selectedPlan.totalPayment.toLocaleString('tr-TR')} ₺
                  </Text>
                </View>
              </View>
              
              {/* Motivasyon Mesajı */}
              <View className="bg-background rounded-lg p-3 mt-3">
                <Text className="text-sm text-foreground text-center">
                  🎉 {selectedPlan.totalMonths} {t('debtPayoff.monthsUntilDebtFree')}!
                </Text>
              </View>
            </View>
          )}
          
          {/* Borç Listesi (Öncelik Sırasına Göre) */}
          {selectedPlan && (
            <View>
              <Text className="text-sm font-semibold text-foreground mb-3">
                {t('debtPayoff.paymentOrder')}
              </Text>
              
              {selectedPlan.debtOrder.map((debtId, index) => {
                const debt = debts.find(d => d.id === debtId);
                if (!debt) return null;
                
                return (
                  <View
                    key={debtId}
                    className="bg-surface rounded-xl p-4 border border-border mb-3"
                  >
                    <View className="flex-row items-center mb-2">
                      <View className="w-8 h-8 rounded-full bg-primary items-center justify-center mr-3">
                        <Text className="text-sm font-bold text-background">{index + 1}</Text>
                      </View>
                      <Text className="text-sm font-semibold text-foreground flex-1">
                        {debt.name}
                      </Text>
                    </View>
                    
                    <View className="flex-row justify-between">
                      <Text className="text-xs text-muted">{t('debtPayoff.balance')}</Text>
                      <Text className="text-xs font-semibold text-foreground">
                        {debt.balance.toLocaleString('tr-TR')} ₺
                      </Text>
                    </View>
                    
                    <View className="flex-row justify-between mt-1">
                      <Text className="text-xs text-muted">{t('debtPayoff.interestRate')}</Text>
                      <Text className="text-xs font-semibold text-foreground">
                        %{(debt.interestRate * 100).toFixed(0)}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
