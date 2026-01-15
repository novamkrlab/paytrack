/**
 * Ayarlar Ekranı
 */

import { ScrollView, Text, View, Switch, TouchableOpacity, Alert, Platform, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useApp } from "@/lib/app-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { sendTestNotification } from "@/lib/notifications";
import { useEffect, useState } from "react";
import {
  scheduleDailyNotification,
  cancelDailyNotification,
  saveDailyNotificationSettings,
  getDailyNotificationSettings,
  requestNotificationPermission,
} from "@/services/daily-notification";

export default function SettingsScreen() {
  const { state, updateSettings, resetAllData, exportData, importData } = useApp();
  const colorScheme = useColorScheme();
  const [dailyNotificationEnabled, setDailyNotificationEnabled] = useState(true);
  const [dailyNotificationHour, setDailyNotificationHour] = useState(8);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  // Bildirim ayarlarını yükle
  useEffect(() => {
    loadDailyNotificationSettings();
  }, []);

  const loadDailyNotificationSettings = async () => {
    const settings = await getDailyNotificationSettings();
    setDailyNotificationEnabled(settings.enabled);
    setDailyNotificationHour(settings.hour);
  };

  const handleDailyNotificationToggle = async (value: boolean) => {
    setDailyNotificationEnabled(value);
    await saveDailyNotificationSettings(value, dailyNotificationHour);

    if (value) {
      // Bildirim izni iste
      const granted = await requestNotificationPermission();
      if (granted) {
        await scheduleDailyNotification(state.payments, dailyNotificationHour);
        Alert.alert(
          "Başarılı",
          `Her gün saat ${dailyNotificationHour}:00'da yakında gelecek ödemeler bildirilecek.`
        );
      } else {
        Alert.alert(
          "Bildirim İzni Gerekli",
          "Günlük bildirimler için bildirim iznini ayarlardan açmanız gerekiyor."
        );
        setDailyNotificationEnabled(false);
        await saveDailyNotificationSettings(false, dailyNotificationHour);
      }
    } else {
      await cancelDailyNotification();
      Alert.alert("Başarılı", "Günlük bildirimler kapatıldı.");
    }
  };

  const handleChangeNotificationHour = () => {
    Alert.prompt(
      "Bildirim Saati",
      "Günlük bildirimin gönderileceği saati girin (0-23):",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Kaydet",
          onPress: async (text?: string) => {
            const hour = parseInt(text || "8");
            if (hour >= 0 && hour <= 23) {
              setDailyNotificationHour(hour);
              await saveDailyNotificationSettings(dailyNotificationEnabled, hour);
              if (dailyNotificationEnabled) {
                await scheduleDailyNotification(state.payments, hour);
              }
              Alert.alert("Başarılı", `Bildirim saati ${hour}:00 olarak ayarlandı.`);
            } else {
              Alert.alert("Hata", "Lütfen 0-23 arasında bir saat girin.");
            }
          },
        },
      ],
      "plain-text",
      dailyNotificationHour.toString()
    );
  };

  const handleExportData = async () => {
    setIsExporting(true);
    const result = await exportData();
    setIsExporting(false);
    
    if (result.success) {
      Alert.alert("Başarılı", result.message);
    } else {
      Alert.alert("Hata", result.message);
    }
  };

  const handleImportData = () => {
    Alert.alert(
      "Verileri İçe Aktar",
      "Mevcut verilerinizi korumak istiyor musunuz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Mevcut Verileri Sil",
          style: "destructive",
          onPress: async () => {
            setIsImporting(true);
            const result = await importData(true);
            setIsImporting(false);
            Alert.alert(result.success ? "Başarılı" : "Hata", result.message);
          },
        },
        {
          text: "Birleştir",
          onPress: async () => {
            setIsImporting(true);
            const result = await importData(false);
            setIsImporting(false);
            Alert.alert(result.success ? "Başarılı" : "Hata", result.message);
          },
        },
      ]
    );
  };

  const handleResetData = () => {
    Alert.alert(
      "Tüm Verileri Sil",
      "Tüm ödemeler, gelirler ve ayarlar silinecek. Bu işlem geri alınamaz. Devam etmek istiyor musunuz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: async () => {
            await resetAllData();
            Alert.alert("Başarılı", "Tüm veriler silindi");
          },
        },
      ]
    );
  };

  return (
    <ScreenContainer>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 }}
      >
        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground">Ayarlar</Text>
          <Text className="text-base text-muted mt-1">
            Uygulama tercihlerinizi yönetin
          </Text>
        </View>

        {/* Bildirim Ayarları */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-foreground mb-3">
            Bildirimler
          </Text>

          <View className="bg-surface rounded-2xl p-4 border border-border">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-1">
                <Text className="text-base font-medium text-foreground">
                  Bildirimleri Aç
                </Text>
                <Text className="text-sm text-muted mt-1">
                  Ödeme hatırlatmaları alın
                </Text>
              </View>
              <Switch
                value={state.settings.notificationsEnabled}
                onValueChange={(value) =>
                  updateSettings({ notificationsEnabled: value })
                }
              />
            </View>

            <View className="border-t border-border pt-4 mb-4">
              <Text className="text-base font-medium text-foreground mb-2">
                Bildirim Zamanı
              </Text>
              <Text className="text-sm text-muted">
                {state.settings.notificationDaysBefore} gün önceden bildirim
              </Text>
            </View>

            {/* Günlük Bildirim */}
            <View className="border-t border-border pt-4">
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-1">
                  <Text className="text-base font-medium text-foreground">
                    Günlük Ödeme Özeti
                  </Text>
                  <Text className="text-sm text-muted mt-1">
                    Her gün yakında gelecek ödemeleri bildir
                  </Text>
                </View>
                <Switch
                  value={dailyNotificationEnabled}
                  onValueChange={handleDailyNotificationToggle}
                />
              </View>

              {dailyNotificationEnabled && (
                <TouchableOpacity
                  onPress={handleChangeNotificationHour}
                  className="bg-background rounded-xl p-3"
                >
                  <Text className="text-sm font-medium text-foreground">
                    Bildirim Saati: {dailyNotificationHour}:00
                  </Text>
                  <Text className="text-xs text-muted mt-1">
                    Değiştirmek için dokun
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* Para Birimi */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-foreground mb-3">
            Para Birimi
          </Text>

          <View className="bg-surface rounded-2xl p-4 border border-border">
            <Text className="text-base font-medium text-foreground">
              {state.settings.currency}
            </Text>
          </View>
        </View>

        {/* Tema */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-foreground mb-3">
            Tema
          </Text>

          <View className="bg-surface rounded-2xl p-4 border border-border">
            <Text className="text-base font-medium text-foreground">
              {state.settings.theme === "system"
                ? "Sistem"
                : state.settings.theme === "light"
                ? "Açık"
                : "Koyu"}
            </Text>
          </View>
        </View>

        {/* Test */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-foreground mb-3">
            Test
          </Text>

          <TouchableOpacity
            className="bg-primary rounded-2xl p-4 items-center active:opacity-80"
            onPress={async () => {
              await sendTestNotification();
              Alert.alert("Başarılı", "Test bildirimi gönderildi");
            }}
          >
            <Text className="text-background font-semibold text-base">
              Test Bildirimi Gönder
            </Text>
          </TouchableOpacity>
        </View>

        {/* Veri Yönetimi */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-foreground mb-3">
            Veri Yönetimi
          </Text>

          <View className="gap-3">
            {/* Dışa Aktar */}
            <TouchableOpacity
              className="bg-primary rounded-2xl p-4 items-center active:opacity-80"
              onPress={handleExportData}
              disabled={isExporting}
            >
              {isExporting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-background font-semibold text-base">
                  Verileri Dışa Aktar
                </Text>
              )}
            </TouchableOpacity>

            {/* İçe Aktar */}
            <TouchableOpacity
              className="bg-success rounded-2xl p-4 items-center active:opacity-80"
              onPress={handleImportData}
              disabled={isImporting}
            >
              {isImporting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-background font-semibold text-base">
                  Verileri İçe Aktar
                </Text>
              )}
            </TouchableOpacity>

            {/* Tüm Verileri Sil */}
            <TouchableOpacity
              className="bg-error rounded-2xl p-4 items-center active:opacity-80"
              onPress={handleResetData}
            >
              <Text className="text-background font-semibold text-base">
                Tüm Verileri Sil
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Gizlilik Politikası */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-foreground mb-3">
            Yasal
          </Text>

          <TouchableOpacity
            className="bg-surface rounded-2xl p-4 active:opacity-80"
            onPress={() => router.push("/privacy-policy")}
          >
            <Text className="text-foreground font-semibold text-base">
              Gizlilik Politikası
            </Text>
            <Text className="text-muted text-sm mt-1">
              Veri toplama ve kullanım politikamız
            </Text>
          </TouchableOpacity>
        </View>

        {/* Uygulama Bilgisi */}
        <View className="items-center mt-8">
          <Text className="text-sm text-muted">Ödeme Takibi v1.0.0</Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
