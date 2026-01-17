/**
 * Bildirim Ayarları Sayfası
 * Gelişmiş bildirim özelleştirme seçenekleri
 */

import { ScrollView, Text, View, Switch, TouchableOpacity, Alert } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useApp } from "@/lib/app-context";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { requestNotificationPermission } from "@/services/daily-notification";

interface NotificationSettings {
  enabled: boolean;
  reminderDays: 1 | 3 | 7;
  reminderTime: "morning" | "noon" | "evening";
  dailySummary: boolean;
  weeklySummary: boolean;
  monthlySummary: boolean;
  overdueAlerts: boolean;
  successNotifications: boolean;
  sound: boolean;
  vibration: boolean;
}

const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: true,
  reminderDays: 3,
  reminderTime: "morning",
  dailySummary: true,
  weeklySummary: false,
  monthlySummary: false,
  overdueAlerts: true,
  successNotifications: true,
  sound: true,
  vibration: true,
};

const STORAGE_KEY = "@notification_settings";

export default function NotificationSettingsScreen() {
  const { state, updateSettings } = useApp();
  const { t } = useTranslation();
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading notification settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: NotificationSettings) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
      
      // Global ayarları da güncelle
      updateSettings({
        notificationsEnabled: newSettings.enabled,
        notificationDaysBefore: newSettings.reminderDays,
      });
    } catch (error) {
      console.error("Error saving notification settings:", error);
      Alert.alert(t("common.error"), "Ayarlar kaydedilemedi");
    }
  };

  const handleToggle = async (key: keyof NotificationSettings) => {
    if (key === "enabled" && !settings.enabled) {
      // Bildirim izni iste
      const granted = await requestNotificationPermission();
      if (!granted) {
        Alert.alert(
          "İzin Gerekli",
          "Bildirimler için izin vermeniz gerekiyor. Lütfen ayarlardan bildirimleri aktif edin."
        );
        return;
      }
    }

    const newSettings = { ...settings, [key]: !settings[key] };
    await saveSettings(newSettings);
  };

  const handleReminderDaysChange = async (days: 1 | 3 | 7) => {
    const newSettings = { ...settings, reminderDays: days };
    await saveSettings(newSettings);
  };

  const handleReminderTimeChange = async (time: "morning" | "noon" | "evening") => {
    const newSettings = { ...settings, reminderTime: time };
    await saveSettings(newSettings);
  };

  const getReminderTimeText = (time: string) => {
    switch (time) {
      case "morning":
        return "Sabah (09:00)";
      case "noon":
        return "Öğlen (12:00)";
      case "evening":
        return "Akşam (18:00)";
      default:
        return time;
    }
  };

  if (loading) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center">
          <Text className="text-muted">Yükleniyor...</Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 }}
      >
        {/* Header */}
        <View className="mb-6">
          <TouchableOpacity onPress={() => router.back()} className="mb-4">
            <Text className="text-primary text-base">← Geri</Text>
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-foreground">Bildirim Ayarları</Text>
          <Text className="text-base text-muted mt-1">
            Bildirim tercihlerinizi özelleştirin
          </Text>
        </View>

        {/* Master Switch */}
        <View className="bg-surface rounded-2xl p-4 border border-border mb-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-base font-semibold text-foreground">
                Bildirimleri Etkinleştir
              </Text>
              <Text className="text-sm text-muted mt-1">
                Tüm bildirimleri aç/kapat
              </Text>
            </View>
            <Switch
              value={settings.enabled}
              onValueChange={() => handleToggle("enabled")}
            />
          </View>
        </View>

        {settings.enabled && (
          <>
            {/* Hatırlatma Ayarları */}
            <View className="mb-4">
              <Text className="text-lg font-semibold text-foreground mb-3">
                Hatırlatma Ayarları
              </Text>

              <View className="bg-surface rounded-2xl p-4 border border-border mb-3">
                <Text className="text-base font-medium text-foreground mb-3">
                  Kaç Gün Önceden Hatırlat?
                </Text>
                <View className="flex-row gap-2">
                  {([1, 3, 7] as const).map((days) => (
                    <TouchableOpacity
                      key={days}
                      onPress={() => handleReminderDaysChange(days)}
                      className={`flex-1 p-3 rounded-xl ${
                        settings.reminderDays === days
                          ? "bg-primary"
                          : "bg-background border border-border"
                      }`}
                    >
                      <Text
                        className={`text-center font-semibold ${
                          settings.reminderDays === days ? "text-white" : "text-foreground"
                        }`}
                      >
                        {days} Gün
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View className="bg-surface rounded-2xl p-4 border border-border">
                <Text className="text-base font-medium text-foreground mb-3">
                  Bildirim Zamanı
                </Text>
                <View className="gap-2">
                  {(["morning", "noon", "evening"] as const).map((time) => (
                    <TouchableOpacity
                      key={time}
                      onPress={() => handleReminderTimeChange(time)}
                      className={`p-3 rounded-xl ${
                        settings.reminderTime === time
                          ? "bg-primary"
                          : "bg-background border border-border"
                      }`}
                    >
                      <Text
                        className={`text-center font-semibold ${
                          settings.reminderTime === time ? "text-white" : "text-foreground"
                        }`}
                      >
                        {getReminderTimeText(time)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* Özet Bildirimleri */}
            <View className="mb-4">
              <Text className="text-lg font-semibold text-foreground mb-3">
                Özet Bildirimleri
              </Text>

              <View className="bg-surface rounded-2xl border border-border overflow-hidden">
                <View className="p-4 border-b border-border">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-base font-medium text-foreground">
                        Günlük Özet
                      </Text>
                      <Text className="text-sm text-muted mt-1">
                        Her sabah bugünün ödemelerini göster
                      </Text>
                    </View>
                    <Switch
                      value={settings.dailySummary}
                      onValueChange={() => handleToggle("dailySummary")}
                    />
                  </View>
                </View>

                <View className="p-4 border-b border-border">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-base font-medium text-foreground">
                        Haftalık Özet
                      </Text>
                      <Text className="text-sm text-muted mt-1">
                        Her Pazartesi haftalık planı göster
                      </Text>
                    </View>
                    <Switch
                      value={settings.weeklySummary}
                      onValueChange={() => handleToggle("weeklySummary")}
                    />
                  </View>
                </View>

                <View className="p-4">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-base font-medium text-foreground">
                        Aylık Özet
                      </Text>
                      <Text className="text-sm text-muted mt-1">
                        Ayın ilk günü geçen ay raporunu göster
                      </Text>
                    </View>
                    <Switch
                      value={settings.monthlySummary}
                      onValueChange={() => handleToggle("monthlySummary")}
                    />
                  </View>
                </View>
              </View>
            </View>

            {/* Uyarı Bildirimleri */}
            <View className="mb-4">
              <Text className="text-lg font-semibold text-foreground mb-3">
                Uyarı Bildirimleri
              </Text>

              <View className="bg-surface rounded-2xl border border-border overflow-hidden">
                <View className="p-4 border-b border-border">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-base font-medium text-foreground">
                        Geciken Ödeme Uyarıları
                      </Text>
                      <Text className="text-sm text-muted mt-1">
                        Ödeme tarihi geçen ödemeler için uyar
                      </Text>
                    </View>
                    <Switch
                      value={settings.overdueAlerts}
                      onValueChange={() => handleToggle("overdueAlerts")}
                    />
                  </View>
                </View>

                <View className="p-4">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-base font-medium text-foreground">
                        Başarı Bildirimleri
                      </Text>
                      <Text className="text-sm text-muted mt-1">
                        Ödeme yapıldığında bildir
                      </Text>
                    </View>
                    <Switch
                      value={settings.successNotifications}
                      onValueChange={() => handleToggle("successNotifications")}
                    />
                  </View>
                </View>
              </View>
            </View>

            {/* Ses ve Titreşim */}
            <View className="mb-4">
              <Text className="text-lg font-semibold text-foreground mb-3">
                Ses ve Titreşim
              </Text>

              <View className="bg-surface rounded-2xl border border-border overflow-hidden">
                <View className="p-4 border-b border-border">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-base font-medium text-foreground">
                        Bildirim Sesi
                      </Text>
                      <Text className="text-sm text-muted mt-1">
                        Bildirim geldiğinde ses çal
                      </Text>
                    </View>
                    <Switch
                      value={settings.sound}
                      onValueChange={() => handleToggle("sound")}
                    />
                  </View>
                </View>

                <View className="p-4">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-base font-medium text-foreground">
                        Titreşim
                      </Text>
                      <Text className="text-sm text-muted mt-1">
                        Bildirim geldiğinde titre
                      </Text>
                    </View>
                    <Switch
                      value={settings.vibration}
                      onValueChange={() => handleToggle("vibration")}
                    />
                  </View>
                </View>
              </View>
            </View>
          </>
        )}

        {/* Bilgi Notu */}
        <View className="bg-surface rounded-2xl p-4 border border-border">
          <Text className="text-sm text-muted leading-relaxed">
            💡 <Text className="font-semibold">İpucu:</Text> Bildirimler, ödeme tarihlerinizi
            hatırlamanıza ve finansal hedeflerinizi takip etmenize yardımcı olur. İhtiyacınıza göre
            özelleştirin.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
