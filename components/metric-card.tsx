/**
 * Metrik Kartı Bileşeni
 * Sayısal metrikleri göstermek için kart
 */

import { View, Text } from 'react-native';
import { IconSymbol } from './ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import type { ComponentProps } from 'react';

interface MetricCardProps {
  /** Başlık */
  title: string;
  /** Değer */
  value: string;
  /** Alt açıklama (opsiyonel) */
  subtitle?: string;
  /** İkon adı (opsiyonel) */
  icon?: ComponentProps<typeof IconSymbol>['name'];
  /** İkon rengi (opsiyonel) */
  iconColor?: string;
  /** Kart rengi (opsiyonel) */
  variant?: 'default' | 'success' | 'warning' | 'error';
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  iconColor,
  variant = 'default',
}: MetricCardProps) {
  const colors = useColors();

  const variantColors = {
    default: colors.primary,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
  };

  const accentColor = variantColors[variant];
  const finalIconColor = iconColor || accentColor;

  return (
    <View className="bg-surface rounded-2xl p-4 border border-border">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-sm text-muted">{title}</Text>
        {icon && (
          <IconSymbol
            name={icon}
            size={20}
            color={finalIconColor}
          />
        )}
      </View>
      <Text className="text-2xl font-bold text-foreground mb-1">
        {value}
      </Text>
      {subtitle && (
        <Text className="text-xs text-muted">
          {subtitle}
        </Text>
      )}
    </View>
  );
}
