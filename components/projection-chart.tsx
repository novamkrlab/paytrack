/**
 * Birikim Projeksiyonu Grafiği Bileşeni
 * Basit çizgi grafik (React Native SVG ile)
 */

import { View, Text, Dimensions } from 'react-native';
import Svg, { Line, Circle, Polyline, Text as SvgText } from 'react-native-svg';
import { useColors } from '@/hooks/use-colors';
import type { ProjectionPoint } from '@/types/fire';

interface ProjectionChartProps {
  /** Projeksiyon verileri */
  data: ProjectionPoint[];
  /** FIRE hedef sayısı (çizgi olarak gösterilir) */
  fireNumber: number;
  /** Grafik yüksekliği */
  height?: number;
}

export function ProjectionChart({
  data,
  fireNumber,
  height = 200,
}: ProjectionChartProps) {
  const colors = useColors();
  const screenWidth = Dimensions.get('window').width;
  const width = screenWidth - 48; // padding düşüldükten sonra
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  if (data.length === 0) {
    return (
      <View className="bg-surface rounded-2xl p-4 border border-border items-center justify-center" style={{ height }}>
        <Text className="text-muted">Veri yok</Text>
      </View>
    );
  }

  // Veri aralığını bul
  const maxValue = Math.max(
    ...data.map(d => d.totalSavings),
    fireNumber
  );
  const minValue = 0;

  // Noktaları hesapla
  const points = data.map((point, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth;
    const y = padding + chartHeight - ((point.totalSavings - minValue) / (maxValue - minValue)) * chartHeight;
    return { x, y, point };
  });

  // FIRE çizgisi Y koordinatı
  const fireY = padding + chartHeight - ((fireNumber - minValue) / (maxValue - minValue)) * chartHeight;

  // Polyline için points string'i
  const polylinePoints = points.map(p => `${p.x},${p.y}`).join(' ');

  // Y ekseni etiketleri
  const yLabels = [
    { value: maxValue, y: padding },
    { value: maxValue / 2, y: padding + chartHeight / 2 },
    { value: 0, y: padding + chartHeight },
  ];

  // X ekseni etiketleri (her 5 yılda bir)
  const xLabels = data.filter((_, index) => index % 5 === 0 || index === data.length - 1);

  return (
    <View className="bg-surface rounded-2xl p-4 border border-border">
      <Text className="text-sm font-semibold text-foreground mb-4">Birikim Projeksiyonu</Text>
      <Svg width={width} height={height}>
        {/* Y ekseni çizgileri */}
        {yLabels.map((label, index) => (
          <Line
            key={`y-line-${index}`}
            x1={padding}
            y1={label.y}
            x2={padding + chartWidth}
            y2={label.y}
            stroke={colors.border}
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        ))}

        {/* FIRE hedef çizgisi */}
        <Line
          x1={padding}
          y1={fireY}
          x2={padding + chartWidth}
          y2={fireY}
          stroke={colors.success}
          strokeWidth="2"
          strokeDasharray="8 4"
        />

        {/* Projeksiyon çizgisi */}
        <Polyline
          points={polylinePoints}
          fill="none"
          stroke={colors.primary}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Nokta işaretleri (sadece başlangıç ve bitiş) */}
        {[points[0], points[points.length - 1]].map((p, index) => (
          <Circle
            key={`point-${index}`}
            cx={p.x}
            cy={p.y}
            r="5"
            fill={colors.primary}
          />
        ))}

        {/* Y ekseni etiketleri */}
        {yLabels.map((label, index) => (
          <SvgText
            key={`y-label-${index}`}
            x={padding - 10}
            y={label.y + 5}
            fill={colors.muted}
            fontSize="10"
            textAnchor="end"
          >
            {formatCurrency(label.value)}
          </SvgText>
        ))}

        {/* X ekseni etiketleri */}
        {xLabels.map((point, index) => {
          const pointData = points.find(p => p.point.year === point.year);
          if (!pointData) return null;
          return (
            <SvgText
              key={`x-label-${index}`}
              x={pointData.x}
              y={padding + chartHeight + 20}
              fill={colors.muted}
              fontSize="10"
              textAnchor="middle"
            >
              {point.year}
            </SvgText>
          );
        })}
      </Svg>

      {/* Lejant */}
      <View className="flex-row items-center justify-center mt-4 gap-4">
        <View className="flex-row items-center gap-2">
          <View className="w-4 h-1 rounded" style={{ backgroundColor: colors.primary }} />
          <Text className="text-xs text-muted">Birikim</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <View className="w-4 h-1 rounded" style={{ backgroundColor: colors.success }} />
          <Text className="text-xs text-muted">FIRE Hedefi</Text>
        </View>
      </View>
    </View>
  );
}

/**
 * Para birimini kısalt (örn: 1.5M, 500K)
 */
function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`;
  }
  return value.toFixed(0);
}
