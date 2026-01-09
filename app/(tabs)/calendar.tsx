/**
 * Takvim Ekranı
 */

import { ScrollView, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";

export default function CalendarScreen() {
  return (
    <ScreenContainer>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 }}
      >
        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground">Takvim</Text>
          <Text className="text-base text-muted mt-1">
            Ödemelerinizi takvimde görüntüleyin
          </Text>
        </View>

        <View className="bg-surface rounded-2xl p-8 items-center justify-center border border-border">
          <Text className="text-muted text-center text-base">
            Takvim görünümü yakında eklenecek
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
