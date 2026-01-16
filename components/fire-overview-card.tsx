/**
 * FIRE Özet Kartı Bileşeni
 * Ana sayfada gösterilecek özet bilgiler
 */

import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from './ui/icon-symbol';
import { ProgressRing } from './progress-ring';
import { useColors } from '@/hooks/use-colors';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/utils/currency-helpers';
import type { FireSummary } from '@/types/fire';

interface FireOverviewCardProps {
  summary: FireSummary;
  currency: string;
}

export function FireOverviewCard({ summary, currency }: FireOverviewCardProps) {
  const router = useRouter();
  const colors = useColors();
  const { t } = useTranslation();

  if (!summary.isConfigured) {
    return (
      <Pressable
        onPress={() => router.push('/goals' as any)}
        className="bg-surface rounded-2xl p-6 border border-border"
      >
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: colors.primary + '20' }}>
              <IconSymbol name="chart.line.uptrend.xyaxis" size={20} color={colors.primary} />
            </View>
            <Text className="text-lg font-semibold text-foreground">
              {t('fire.title')}
            </Text>
          </View>
          <IconSymbol name="chevron.right" size={20} color={colors.muted} />
        </View>
        <Text className="text-sm text-muted text-center">
          {t('fire.notConfigured')}
        </Text>
        <Text className="text-xs text-primary text-center mt-2">
          {t('fire.tapToSetup')}
        </Text>
      </Pressable>
    );
  }

  const yearsText = summary.yearsRemaining > 0
    ? `${summary.yearsRemaining} ${t('common.year')}`
    : '';
  const monthsText = summary.monthsRemaining > 0
    ? `${summary.monthsRemaining} ${t('common.month')}`
    : '';
  const timeRemaining = [yearsText, monthsText].filter(Boolean).join(' ');

  return (
    <Pressable
      onPress={() => router.push('/goals' as any)}
      className="bg-surface rounded-2xl p-6 border border-border"
    >
      <View className="flex-row items-center justify-between mb-6">
        <View className="flex-row items-center gap-3">
          <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: colors.primary + '20' }}>
            <IconSymbol name="chart.line.uptrend.xyaxis" size={20} color={colors.primary} />
          </View>
          <Text className="text-lg font-semibold text-foreground">
            {t('fire.title')}
          </Text>
        </View>
        <IconSymbol name="chevron.right" size={20} color={colors.muted} />
      </View>

      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-sm text-muted mb-2">{t('fire.fireNumber')}</Text>
          <Text className="text-2xl font-bold text-foreground mb-4">
            {formatCurrency(summary.fireNumber, currency as any)}
          </Text>

          <Text className="text-sm text-muted mb-1">{t('fire.currentSavings')}</Text>
          <Text className="text-lg font-semibold text-foreground mb-4">
            {formatCurrency(summary.currentSavings, currency as any)}
          </Text>

          {timeRemaining && (
            <>
              <Text className="text-sm text-muted mb-1">{t('fire.timeRemaining')}</Text>
              <Text className="text-base font-medium text-foreground">
                {timeRemaining}
              </Text>
            </>
          )}
        </View>

        <ProgressRing
          progress={summary.progress}
          size={100}
          strokeWidth={8}
        />
      </View>
    </Pressable>
  );
}
