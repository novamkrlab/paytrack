/**
 * Ayarlar Ekranı
 */

import { ScrollView, Text, View, Switch, TouchableOpacity, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useApp } from "@/lib/app-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { sendTestNotification } from "@/lib/notifications";

export default function SettingsScreen() {
  const { state, updateSettings, resetAllData } = useApp();
  const colorScheme = useColorScheme();

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

            <View className="border-t border-border pt-4">
              <Text className="text-base font-medium text-foreground mb-2">
                Bildirim Zamanı
              </Text>
              <Text className="text-sm text-muted">
                {state.settings.notificationDaysBefore} gün önceden bildirim
              </Text>
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

          <TouchableOpacity
            className="bg-error rounded-2xl p-4 items-center active:opacity-80"
            onPress={handleResetData}
          >
            <Text className="text-background font-semibold text-base">
              Tüm Verileri Sil
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
