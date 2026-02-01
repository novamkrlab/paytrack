/**
 * Finansal Sağlık Skoru - Kategori Detay Modalı
 */

import { Modal, View, Text, Pressable, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useColors } from '@/hooks/use-colors';
import type { FinancialHealthInput } from '@/types/financial-health';

type CategoryType = 'debtManagement' | 'emergencyFund' | 'savingsRate' | 'fireProgress';

interface HealthScoreDetailModalProps {
  visible: boolean;
  onClose: () => void;
  category: CategoryType;
  score: number;
  maxScore: number;
  healthInput: FinancialHealthInput;
}

export function HealthScoreDetailModal({
  visible,
  onClose,
  category,
  score,
  maxScore,
  healthInput,
}: HealthScoreDetailModalProps) {
  const { t } = useTranslation();
  const colors = useColors();

  // Kategori başlığı
  const categoryTitle = t(`healthScore.categories.${category}`);

  // Kategori açıklaması
  const categoryDescription = t(`healthScore.${category}Description`);

  // Puanlama kriterleri ve mevcut durum
  const getCriteriaAndStatus = () => {
    switch (category) {
      case 'debtManagement':
        const debtRatio = healthInput.monthlyIncome > 0
          ? (healthInput.totalDebt / healthInput.monthlyIncome) * 100
          : 0;
        return {
          criteria: [
            t('healthScore.details.debtManagement.criteria1'),
            t('healthScore.details.debtManagement.criteria2'),
            t('healthScore.details.debtManagement.criteria3'),
            t('healthScore.details.debtManagement.criteria4'),
          ],
          currentStatus: t('healthScore.details.debtManagement.currentStatus', {
            ratio: debtRatio.toFixed(1),
          }),
          tips: [
            t('healthScore.details.debtManagement.tip1'),
            t('healthScore.details.debtManagement.tip2'),
            t('healthScore.details.debtManagement.tip3'),
          ],
        };

      case 'emergencyFund':
        const monthsCovered = healthInput.monthlyExpenses > 0
          ? healthInput.currentSavings / healthInput.monthlyExpenses
          : 0;
        return {
          criteria: [
            t('healthScore.details.emergencyFund.criteria1'),
            t('healthScore.details.emergencyFund.criteria2'),
            t('healthScore.details.emergencyFund.criteria3'),
            t('healthScore.details.emergencyFund.criteria4'),
          ],
          currentStatus: t('healthScore.details.emergencyFund.currentStatus', {
            months: monthsCovered.toFixed(1),
          }),
          tips: [
            t('healthScore.details.emergencyFund.tip1'),
            t('healthScore.details.emergencyFund.tip2'),
            t('healthScore.details.emergencyFund.tip3'),
          ],
        };

      case 'savingsRate':
        const savingsRate = healthInput.monthlyIncome > 0
          ? ((healthInput.monthlyIncome - healthInput.monthlyExpenses) / healthInput.monthlyIncome) * 100
          : 0;
        return {
          criteria: [
            t('healthScore.details.savingsRate.criteria1'),
            t('healthScore.details.savingsRate.criteria2'),
            t('healthScore.details.savingsRate.criteria3'),
            t('healthScore.details.savingsRate.criteria4'),
          ],
          currentStatus: t('healthScore.details.savingsRate.currentStatus', {
            rate: savingsRate.toFixed(1),
          }),
          tips: [
            t('healthScore.details.savingsRate.tip1'),
            t('healthScore.details.savingsRate.tip2'),
            t('healthScore.details.savingsRate.tip3'),
          ],
        };

      case 'fireProgress':
        const firePercent = healthInput.fireProgressPercent || 0;
        return {
          criteria: [
            t('healthScore.details.fireProgress.criteria1'),
            t('healthScore.details.fireProgress.criteria2'),
            t('healthScore.details.fireProgress.criteria3'),
            t('healthScore.details.fireProgress.criteria4'),
          ],
          currentStatus: t('healthScore.details.fireProgress.currentStatus', {
            percent: firePercent.toFixed(1),
          }),
          tips: [
            t('healthScore.details.fireProgress.tip1'),
            t('healthScore.details.fireProgress.tip2'),
            t('healthScore.details.fireProgress.tip3'),
          ],
        };
    }
  };

  const { criteria, currentStatus, tips } = getCriteriaAndStatus();

  // Skor rengi
  const percentage = (score / maxScore) * 100;
  const scoreColor =
    percentage >= 80
      ? '#22C55E'
      : percentage >= 60
      ? '#3B82F6'
      : percentage >= 40
      ? '#F59E0B'
      : '#EF4444';

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'flex-end',
        }}
      >
        <View
          style={{
            backgroundColor: colors.background,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            maxHeight: '90%',
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 20,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.foreground }}>
              {categoryTitle}
            </Text>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => ({
                opacity: pressed ? 0.6 : 1,
                padding: 4,
              })}
            >
              <Text style={{ fontSize: 24, color: colors.muted }}>×</Text>
            </Pressable>
          </View>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 20 }}
          >
            {/* Skor Göstergesi */}
            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 16,
                padding: 20,
                marginBottom: 24,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <View
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  backgroundColor: scoreColor + '20',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 8,
                  borderColor: scoreColor,
                  marginBottom: 12,
                }}
              >
                <Text style={{ fontSize: 32, fontWeight: 'bold', color: scoreColor }}>
                  {score}
                </Text>
              </View>
              <Text style={{ fontSize: 16, color: colors.muted }}>
                {t('healthScore.details.maxScore', { max: maxScore })}
              </Text>
            </View>

            {/* Açıklama */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: colors.foreground, marginBottom: 8 }}>
                {t('healthScore.details.description')}
              </Text>
              <Text style={{ fontSize: 14, color: colors.muted, lineHeight: 20 }}>
                {categoryDescription}
              </Text>
            </View>

            {/* Mevcut Durum */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: colors.foreground, marginBottom: 8 }}>
                {t('healthScore.details.currentStatus')}
              </Text>
              <View
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <Text style={{ fontSize: 15, color: colors.foreground, fontWeight: '500' }}>
                  {currentStatus}
                </Text>
              </View>
            </View>

            {/* Puanlama Kriterleri */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: colors.foreground, marginBottom: 8 }}>
                {t('healthScore.details.criteria')}
              </Text>
              {criteria.map((criterion, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    marginBottom: 8,
                  }}
                >
                  <Text style={{ fontSize: 14, color: colors.foreground, marginRight: 8 }}>
                    •
                  </Text>
                  <Text style={{ fontSize: 14, color: colors.foreground, flex: 1, lineHeight: 20 }}>
                    {criterion}
                  </Text>
                </View>
              ))}
            </View>

            {/* İyileştirme Önerileri */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: colors.foreground, marginBottom: 8 }}>
                💡 {t('healthScore.details.tips')}
              </Text>
              {tips.map((tip, index) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: colors.surface,
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 8,
                    borderWidth: 1,
                    borderColor: colors.border,
                  }}
                >
                  <Text style={{ fontSize: 14, color: colors.foreground, lineHeight: 20 }}>
                    {tip}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
