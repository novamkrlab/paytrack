/**
 * Ana Giriş Ekranı
 * İlk açılış kontrolü yapar ve onboarding veya tabs'a yönlendirir
 */

import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColors } from "@/hooks/use-colors";

const ONBOARDING_KEY = "@odeme_takibi:onboarding_completed";

export default function Index() {
  const colors = useColors();

  useEffect(() => {
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    try {
      const hasCompletedOnboarding = await AsyncStorage.getItem(ONBOARDING_KEY);
      
      if (hasCompletedOnboarding === "true") {
        router.replace("/(tabs)");
      } else {
        router.replace("/onboarding");
      }
    } catch (error) {
      console.error("Onboarding check error:", error);
      // Hata durumunda direkt tabs'a yönlendir
      router.replace("/(tabs)");
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.background,
      }}
    >
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}
