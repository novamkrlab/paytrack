/**
 * Onboarding Ekranı
 * İlk açılışta kullanıcıya uygulamayı tanıtan 3 sayfalık ekran
 */

import { View, Text, FlatList, Dimensions, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRef, useState } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useTranslation } from "react-i18next";

const { width } = Dimensions.get("window");

interface OnboardingPage {
  id: string;
  title: string;
  description: string;
  icon: "house.fill" | "paperplane.fill" | "chevron.left.forwardslash.chevron.right";
  color: string;
}

// Pages will be populated from translations

const ONBOARDING_KEY = "@odeme_takibi:onboarding_completed";

export default function OnboardingScreen() {
  const colors = useColors();
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const pages: OnboardingPage[] = [
    {
      id: "1",
      title: t("onboarding.page1.title"),
      description: t("onboarding.page1.description"),
      icon: "house.fill",
      color: "#0a7ea4",
    },
    {
      id: "2",
      title: t("onboarding.page2.title"),
      description: t("onboarding.page2.description"),
      icon: "chevron.left.forwardslash.chevron.right",
      color: "#22C55E",
    },
    {
      id: "3",
      title: t("onboarding.page3.title"),
      description: t("onboarding.page3.description"),
      icon: "paperplane.fill",
      color: "#F59E0B",
    },
  ];

  const handleNext = () => {
    if (currentIndex < pages.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, "true");
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Onboarding completion error:", error);
      router.replace("/(tabs)");
    }
  };

  const renderPage = ({ item, index }: { item: OnboardingPage; index: number }) => {
    return (
      <View style={[styles.page, { width }]}>
        <View style={styles.content}>
          {/* Icon */}
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: item.color + "20",
              },
            ]}
          >
            <IconSymbol name={item.icon} size={80} color={item.color} />
          </View>

          {/* Title */}
          <Text
            style={[
              styles.title,
              {
                color: colors.foreground,
              },
            ]}
          >
            {item.title}
          </Text>

          {/* Description */}
          <Text
            style={[
              styles.description,
              {
                color: colors.muted,
              },
            ]}
          >
            {item.description}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      {/* Skip Button */}
      {currentIndex < pages.length - 1 && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text
            style={[
              styles.skipText,
              {
                color: colors.muted,
              },
            ]}
          >
            {t("common.skip")}
          </Text>
        </TouchableOpacity>
      )}

      {/* Pages */}
      <FlatList
        ref={flatListRef}
        data={pages}
        renderItem={renderPage}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        scrollEventThrottle={16}
      />

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {pages.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: index === currentIndex ? colors.primary : colors.border,
                width: index === currentIndex ? 24 : 8,
              },
            ]}
          />
        ))}
      </View>

      {/* Next/Start Button */}
      <TouchableOpacity
        style={[
          styles.nextButton,
          {
            backgroundColor: colors.primary,
          },
        ]}
        onPress={handleNext}
      >
        <Text style={styles.nextButtonText}>
          {currentIndex === pages.length - 1 ? t("common.start") : t("common.next")}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 8,
  },
  skipText: {
    fontSize: 16,
    fontWeight: "600",
  },
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  nextButton: {
    marginHorizontal: 32,
    marginBottom: 32,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
