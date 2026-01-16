/**
 * İlerleme Halkası Bileşeni
 * Dairesel ilerleme göstergesi
 */

import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useColors } from '@/hooks/use-colors';

interface ProgressRingProps {
  /** İlerleme yüzdesi (0-100) */
  progress: number;
  /** Halka boyutu */
  size?: number;
  /** Çizgi kalınlığı */
  strokeWidth?: number;
  /** Merkezdeki metin */
  label?: string;
  /** Renk (opsiyonel, varsayılan primary) */
  color?: string;
}

export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 10,
  label,
  color,
}: ProgressRingProps) {
  const colors = useColors();
  const ringColor = color || colors.primary;

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progressValue = Math.min(100, Math.max(0, progress));
  const strokeDashoffset = circumference - (progressValue / 100) * circumference;

  return (
    <View className="items-center justify-center" style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        {/* Arka plan halkası */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.border}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* İlerleme halkası */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={ringColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View className="absolute items-center justify-center">
        <Text className="text-2xl font-bold text-foreground">
          {Math.round(progressValue)}%
        </Text>
        {label && (
          <Text className="text-xs text-muted mt-1">{label}</Text>
        )}
      </View>
    </View>
  );
}
