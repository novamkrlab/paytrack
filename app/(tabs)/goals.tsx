/**
 * Hedefler Tab'ı
 * Finansal Özgürlük (FIRE) ve Borç Yönetimi
 */

import { useState, useEffect } from 'react';
import { ScrollView, Text, View, TextInput, Pressable, Alert } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { MetricCard } from '@/components/metric-card';
import { ProgressRing } from '@/components/progress-ring';
import { ProjectionChart } from '@/components/projection-chart';
import { useColors } from '@/hooks/use-colors';
import { useTranslation } from 'react-i18next';
import { loadFireSettings, saveFireSettings } from '@/lib/fire-storage';
import { calculateFire, getFireSummary } from '@/lib/fire-calculator';
import type { FireSettings } from '@/types/fire';
import { DEFAULT_FIRE_SETTINGS } from '@/types/fire';
import { formatCurrency } from '@/utils/currency-helpers';


export default function GoalsScreen() {
  const colors = useColors();
  const { t } = useTranslation();
  const currency = 'TRY'; // Varsayılan para birimi
  const [settings, setSettings] = useState<FireSettings>(DEFAULT_FIRE_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const saved = await loadFireSettings();
      if (saved) {
        setSettings(saved);
      }
    } catch (error) {
      console.error('Ayarlar yüklenemedi:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await saveFireSettings(settings);
      Alert.alert(t('common.success'), t('fire.settingsSaved'));
    } catch (error) {
      Alert.alert(t('common.error'), t('fire.settingsSaveError'));
    }
  };

  const result = calculateFire(settings);
  const summary = getFireSummary(settings);

  if (isLoading) {
    return (
      <ScreenContainer className="p-6">
        <Text className="text-muted text-center">{t('common.loading')}</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-6">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="gap-6">
          {/* Başlık */}
          <View>
            <Text className="text-3xl font-bold text-foreground mb-2">
              {t('fire.title')}
            </Text>
            <Text className="text-sm text-muted">
              {t('fire.subtitle')}
            </Text>
          </View>

          {/* İlerleme Halkası */}
          {summary.isConfigured && (
            <View className="items-center py-6">
              <ProgressRing
                progress={result.currentProgress}
                size={140}
                strokeWidth={12}
                label={t('fire.progress')}
              />
              <Text className="text-2xl font-bold text-foreground mt-4">
                {formatCurrency(result.fireNumber, currency as any)}
              </Text>
              <Text className="text-sm text-muted mt-1">
                {t('fire.fireNumber')}
              </Text>
            </View>
          )}

          {/* Metrikler */}
          {summary.isConfigured && result.isValid && (
            <View className="gap-4">
              <View className="flex-row gap-4">
                <View className="flex-1">
                  <MetricCard
                    title={t('fire.yearsToRetirement')}
                    value={Math.floor(result.yearsToRetirement).toString()}
                    subtitle={t('common.year')}
                    icon="calendar"
                    variant="default"
                  />
                </View>
                <View className="flex-1">
                  <MetricCard
                    title={t('fire.monthlyTarget')}
                    value={formatCurrency(result.monthlyTargetSavings, currency as any)}
                    subtitle={t('common.perMonth')}
                    icon="arrow.up.circle.fill"
                    variant="success"
                  />
                </View>
              </View>
            </View>
          )}

          {/* Projeksiyon Grafiği */}
          {summary.isConfigured && result.projectionData.length > 0 && (
            <ProjectionChart
              data={result.projectionData.slice(0, 20)} // İlk 20 yıl
              fireNumber={result.fireNumber}
              height={220}
            />
          )}

          {/* Ayarlar Formu */}
          <View className="bg-surface rounded-2xl p-6 border border-border gap-4">
            <Text className="text-lg font-semibold text-foreground mb-2">
              {t('fire.settings')}
            </Text>

            {/* Mevcut Yaş */}
            <View>
              <Text className="text-sm text-muted mb-2">{t('fire.currentAge')}</Text>
              <TextInput
                className="bg-background border border-border rounded-xl px-4 py-3 text-foreground"
                value={settings.currentAge.toString()}
                onChangeText={(text) => setSettings({ ...settings, currentAge: parseInt(text) || 0 })}
                keyboardType="numeric"
                placeholderTextColor={colors.muted}
              />
            </View>

            {/* Hedef Emeklilik Yaşı */}
            <View>
              <Text className="text-sm text-muted mb-2">{t('fire.targetRetirementAge')}</Text>
              <TextInput
                className="bg-background border border-border rounded-xl px-4 py-3 text-foreground"
                value={settings.targetRetirementAge.toString()}
                onChangeText={(text) => setSettings({ ...settings, targetRetirementAge: parseInt(text) || 0 })}
                keyboardType="numeric"
                placeholderTextColor={colors.muted}
              />
            </View>

            {/* Mevcut Birikim */}
            <View>
              <Text className="text-sm text-muted mb-2">{t('fire.currentSavings')}</Text>
              <TextInput
                className="bg-background border border-border rounded-xl px-4 py-3 text-foreground"
                value={settings.currentSavings.toString()}
                onChangeText={(text) => setSettings({ ...settings, currentSavings: parseFloat(text) || 0 })}
                keyboardType="numeric"
                placeholderTextColor={colors.muted}
              />
            </View>

            {/* Aylık Gelir */}
            <View>
              <Text className="text-sm text-muted mb-2">{t('fire.monthlyIncome')}</Text>
              <TextInput
                className="bg-background border border-border rounded-xl px-4 py-3 text-foreground"
                value={settings.monthlyIncome.toString()}
                onChangeText={(text) => setSettings({ ...settings, monthlyIncome: parseFloat(text) || 0 })}
                keyboardType="numeric"
                placeholderTextColor={colors.muted}
              />
            </View>

            {/* Aylık Harcama */}
            <View>
              <Text className="text-sm text-muted mb-2">{t('fire.monthlyExpenses')}</Text>
              <TextInput
                className="bg-background border border-border rounded-xl px-4 py-3 text-foreground"
                value={settings.monthlyExpenses.toString()}
                onChangeText={(text) => setSettings({ ...settings, monthlyExpenses: parseFloat(text) || 0 })}
                keyboardType="numeric"
                placeholderTextColor={colors.muted}
              />
            </View>

            {/* Hedef Aylık Harcama */}
            <View>
              <Text className="text-sm text-muted mb-2">{t('fire.targetMonthlyExpenses')}</Text>
              <TextInput
                className="bg-background border border-border rounded-xl px-4 py-3 text-foreground"
                value={settings.targetMonthlyExpenses.toString()}
                onChangeText={(text) => setSettings({ ...settings, targetMonthlyExpenses: parseFloat(text) || 0 })}
                keyboardType="numeric"
                placeholderTextColor={colors.muted}
              />
            </View>

            {/* Beklenen Yıllık Getiri */}
            <View>
              <Text className="text-sm text-muted mb-2">{t('fire.expectedAnnualReturn')}</Text>
              <TextInput
                className="bg-background border border-border rounded-xl px-4 py-3 text-foreground"
                value={settings.expectedAnnualReturn.toString()}
                onChangeText={(text) => setSettings({ ...settings, expectedAnnualReturn: parseFloat(text) || 0 })}
                keyboardType="numeric"
                placeholderTextColor={colors.muted}
              />
            </View>

            {/* Kaydet Butonu */}
            <Pressable
              onPress={handleSave}
              className="bg-primary rounded-xl py-4 items-center mt-4"
            >
              <Text className="text-background font-semibold text-base">
                {t('common.save')}
              </Text>
            </Pressable>
          </View>

          {/* Alt boşluk */}
          <View className="h-8" />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
