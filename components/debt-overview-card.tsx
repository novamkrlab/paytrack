/**
 * Borç Özet Kartı Bileşeni
 * Ana sayfada gösterilecek borç özet bilgileri
 */

import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from './ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/utils/currency-helpers';
import type { DebtSummary } from '@/types/debt';

interface DebtOverviewCardProps {
  summary: DebtSummary;
  currency: string;
}

export function DebtOverviewCard({ summary, currency }: DebtOverviewCardProps) {
  const router = useRouter();
  const colors = useColors();
  const { t } = useTranslation();

  if (summary.activeDebts === 0) {
    return (
      <Pressable
        onPress={() => router.push('/goals' as any)}
        className="bg-surface rounded-2xl p-6 border border-border"
      >
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: colors.success + '20' }}>
              <IconSymbol name="checkmark.circle.fill" size={20} color={colors.success} />
            </View>
            <Text className="text-lg font-semibold text-foreground">
              {t('debt.title')}
            </Text>
          </View>
          <IconSymbol name="chevron.right" size={20} color={colors.muted} />
        </View>
        <Text className="text-sm text-muted text-center">
          {t('debt.noDebts')}
        </Text>
        <Text className="text-xs text-success text-center mt-2">
          {t('debt.debtFree')}
        </Text>
      </Pressable>
    );
  }

  const paymentProgress = summary.totalPaid > 0
    ? (summary.totalPaid / (summary.totalDebt + summary.totalPaid)) * 100
    : 0;

  // İlk borcu bul (detay ekranı için)
  const firstDebtId = summary.debts && summary.debts.length > 0 ? summary.debts[0].id : null;

  return (
    <Pressable
      onPress={() => {
        if (firstDebtId) {
          router.push(`/debt-detail?id=${firstDebtId}` as any);
        } else {
          router.push('/goals' as any);
        }
      }}
      className="bg-surface rounded-2xl p-6 border border-border"
    >
      <View className="flex-row items-center justify-between mb-6">
        <View className="flex-row items-center gap-3">
          <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: colors.error + '20' }}>
            <IconSymbol name="creditcard.fill" size={20} color={colors.error} />
          </View>
          <Text className="text-lg font-semibold text-foreground">
            {t('debt.title')}
          </Text>
        </View>
        <IconSymbol name="chevron.right" size={20} color={colors.muted} />
      </View>

      <View className="gap-4">
        <View>
          <Text className="text-sm text-muted mb-2">{t('debt.totalDebt')}</Text>
          <Text className="text-2xl font-bold text-error">
            {formatCurrency(summary.totalDebt, currency as any)}
          </Text>
        </View>

        <View className="flex-row items-center justify-between">
          <View className="flex-1 mr-4">
            <Text className="text-sm text-muted mb-1">{t('debt.monthlyPayment')}</Text>
            <Text className="text-lg font-semibold text-foreground">
              {formatCurrency(summary.monthlyPayment, currency as any)}
            </Text>
          </View>

          <View className="flex-1">
            <Text className="text-sm text-muted mb-1">{t('debt.activeDebts')}</Text>
            <Text className="text-lg font-semibold text-foreground">
              {summary.activeDebts}
            </Text>
          </View>
        </View>

        {summary.totalPaid > 0 && (
          <View>
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-xs text-muted">{t('debt.paymentProgress')}</Text>
              <Text className="text-xs font-medium text-foreground">
                {Math.round(paymentProgress)}%
              </Text>
            </View>
            <View className="h-2 bg-border rounded-full overflow-hidden">
              <View
                className="h-full rounded-full"
                style={{
                  width: `${paymentProgress}%`,
                  backgroundColor: colors.success,
                }}
              />
            </View>
          </View>
        )}
      </View>
    </Pressable>
  );
}
