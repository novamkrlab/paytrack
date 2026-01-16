/**
 * Sağlık Skoru Geçmişi Grafik Bileşeni
 * Son 6 ayın sağlık skorunu çizgi grafik olarak gösterir
 */

import { View, Text, Dimensions } from 'react-native';
import Svg, { Line, Circle, Text as SvgText, Polyline } from 'react-native-svg';
import { useColors } from '@/hooks/use-colors';
import type { HealthScoreHistoryEntry } from '@/types/health-score-history';

interface HealthScoreChartProps {
  data: HealthScoreHistoryEntry[];
}

export function HealthScoreChart({ data }: HealthScoreChartProps) {
  const colors = useColors();
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 64; // 32px padding on each side
  const chartHeight = 200;
  const padding = 40;

  if (data.length === 0) {
    return (
      <View style={{ height: chartHeight, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: colors.muted, fontSize: 14 }}>
          Henüz veri yok
        </Text>
      </View>
    );
  }

  // Ay isimlerini kısalt (örn: "2026-01" → "Oca")
  const monthNames = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
  const getMonthLabel = (month: string) => {
    const [, monthNum] = month.split('-');
    return monthNames[parseInt(monthNum, 10) - 1];
  };

  // Veri noktalarını hesapla
  const maxScore = 100;
  const minScore = 0;
  const scoreRange = maxScore - minScore;

  const points = data.map((entry, index) => {
    const x = padding + (index * (chartWidth - 2 * padding)) / (data.length - 1 || 1);
    const y = chartHeight - padding - ((entry.score - minScore) / scoreRange) * (chartHeight - 2 * padding);
    return { x, y, score: entry.score, month: getMonthLabel(entry.month) };
  });

  // Polyline için points string'i oluştur
  const polylinePoints = points.map(p => `${p.x},${p.y}`).join(' ');

  // Renk belirleme (skor bazlı)
  const getScoreColor = (score: number) => {
    if (score >= 70) return '#22C55E'; // Yeşil
    if (score >= 40) return '#F59E0B'; // Sarı
    return '#EF4444'; // Kırmızı
  };

  return (
    <View style={{ width: chartWidth, height: chartHeight }}>
      <Svg width={chartWidth} height={chartHeight}>
        {/* Y ekseni çizgileri (grid) */}
        {[0, 25, 50, 75, 100].map((value) => {
          const y = chartHeight - padding - ((value - minScore) / scoreRange) * (chartHeight - 2 * padding);
          return (
            <Line
              key={value}
              x1={padding}
              y1={y}
              x2={chartWidth - padding}
              y2={y}
              stroke={colors.border}
              strokeWidth="1"
              strokeDasharray="4,4"
            />
          );
        })}

        {/* Çizgi grafik */}
        <Polyline
          points={polylinePoints}
          fill="none"
          stroke={colors.tint}
          strokeWidth="3"
        />

        {/* Veri noktaları */}
        {points.map((point, index) => (
          <Circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="5"
            fill={getScoreColor(point.score)}
            stroke="#FFFFFF"
            strokeWidth="2"
          />
        ))}

        {/* X ekseni etiketleri (aylar) */}
        {points.map((point, index) => (
          <SvgText
            key={`label-${index}`}
            x={point.x}
            y={chartHeight - 10}
            fontSize="12"
            fill={colors.muted}
            textAnchor="middle"
          >
            {point.month}
          </SvgText>
        ))}

        {/* Y ekseni etiketleri (skorlar) */}
        {[0, 25, 50, 75, 100].map((value) => {
          const y = chartHeight - padding - ((value - minScore) / scoreRange) * (chartHeight - 2 * padding);
          return (
            <SvgText
              key={`y-${value}`}
              x={padding - 10}
              y={y + 4}
              fontSize="12"
              fill={colors.muted}
              textAnchor="end"
            >
              {value}
            </SvgText>
          );
        })}
      </Svg>
    </View>
  );
}
