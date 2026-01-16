/**
 * Finansal Sağlık Skoru Kartı - Ana Sayfa İçin
 */

import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useColors } from '@/hooks/use-colors';
import { getScoreColor, getScoreMessage } from '@/lib/financial-health';
import type { FinancialHealthScore } from '@/types/financial-health';

interface HealthScoreCardProps {
  score: FinancialHealthScore;
}

export function HealthScoreCard({ score }: HealthScoreCardProps) {
  const { t } = useTranslation();
  const colors = useColors();
  const scoreColor = getScoreColor(score.category);
  const scoreMessage = getScoreMessage(score.category);

  return (
    <Pressable
      onPress={() => router.push('/health-score')}
      style={({ pressed }) => [
        {
          backgroundColor: colors.surface,
          borderRadius: 16,
          padding: 20,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: colors.border,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <Text style={{ fontSize: 20, marginRight: 8 }}>🏥</Text>
        <Text style={{ fontSize: 18, fontWeight: '600', color: colors.foreground, flex: 1 }}>
          {t('healthScore.title')}
        </Text>
      </View>

      {/* Skor Göstergesi */}
      <View style={{ alignItems: 'center', marginVertical: 16 }}>
        <View
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: scoreColor + '20',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 8,
            borderColor: scoreColor,
          }}
        >
          <Text style={{ fontSize: 36, fontWeight: 'bold', color: scoreColor }}>
            {score.totalScore}
          </Text>
        </View>
        <Text style={{ fontSize: 16, fontWeight: '600', color: colors.foreground, marginTop: 12 }}>
          {t(scoreMessage)}
        </Text>
      </View>

      {/* İlerleme Çubuğu */}
      <View style={{ marginTop: 8 }}>
        <View
          style={{
            height: 8,
            backgroundColor: colors.border,
            borderRadius: 4,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              height: '100%',
              width: `${score.totalScore}%`,
              backgroundColor: scoreColor,
            }}
          />
        </View>
        <Text style={{ fontSize: 14, color: colors.muted, marginTop: 8, textAlign: 'right' }}>
          {score.totalScore}/100
        </Text>
      </View>

      {/* Detay Butonu */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 12 }}>
        <Text style={{ fontSize: 14, color: colors.tint, fontWeight: '600' }}>
          {t('common.viewDetails')}
        </Text>
        <Text style={{ fontSize: 14, color: colors.tint, marginLeft: 4 }}>→</Text>
      </View>
    </Pressable>
  );
}
