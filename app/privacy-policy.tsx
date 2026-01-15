/**
 * Gizlilik Politikası Sayfası
 * Google Play Store gereksinimi için gizlilik politikası
 */

import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useTranslation } from "react-i18next";

export default function PrivacyPolicyScreen() {
  const colors = useColors();
  const { t } = useTranslation();

  return (
    <ScreenContainer>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
          <IconSymbol name="chevron.right" size={24} color={colors.foreground} style={{ transform: [{ rotate: "180deg" }] }} />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: colors.foreground,
          }}
        >
          {t("privacyPolicy.title")}
        </Text>
      </View>

      {/* Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 32,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            color: colors.muted,
            marginBottom: 24,
            lineHeight: 20,
          }}
        >
          {t("privacyPolicy.lastUpdated")}: 15 {t("common.january")} 2026
        </Text>

        {/* Giriş */}
        <Section title={t("privacyPolicy.intro")} colors={colors}>
          {t("privacyPolicy.dataCollection.content")}
        </Section>

        {/* Veri Toplama */}
        <Section title={t("privacyPolicy.dataCollection.title")} colors={colors}>
          {t("privacyPolicy.dataCollection.content")}
        </Section>

         {/* Veri Saklama */}
        <Section title={t("privacyPolicy.dataStorage.title")} colors={colors}>
          {t("privacyPolicy.dataStorage.content")}
        </Section>

        {/* Üçüncü Taraf Paylaşım */}
        <Section title={t("privacyPolicy.dataSharing.title")} colors={colors}>
          {t("privacyPolicy.dataSharing.content")}
        </Section>

        {/* Bildirimler */}
        <Section title={t("privacyPolicy.notifications.title")} colors={colors}>
          {t("privacyPolicy.notifications.content")}
        </Section>

          {/* İzinler */}
        <Section title={t("privacyPolicy.permissions.title")} colors={colors}>
          {t("privacyPolicy.permissions.content")}
        </Section>

        {/* Veri Güvenliği */}
        <Section title={t("privacyPolicy.security.title")} colors={colors}>
          {t("privacyPolicy.security.content")}
        </Section>

        {/* Çocukların Gizliliği */}
        <Section title={t("privacyPolicy.children.title")} colors={colors}>
          {t("privacyPolicy.children.content")}
        </Section>

        {/* Değişiklikler */}
        <Section title={t("privacyPolicy.changes.title")} colors={colors}>
          {t("privacyPolicy.changes.content")}
        </Section>

          {/* İletişim */}
        <Section title={t("privacyPolicy.contact.title")} colors={colors}>
          {t("privacyPolicy.contact.content")}
        </Section>

        {/* Footer */}
        <Text
          style={{
            fontSize: 12,
            color: colors.muted,
            textAlign: "center",
            marginTop: 32,
            lineHeight: 18,
          }}
        >
          {t("privacyPolicy.footer")}
        </Text>
      </ScrollView>
    </ScreenContainer>
  );
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
  colors: any;
}

function Section({ title, children, colors }: SectionProps) {
  return (
    <View style={{ marginBottom: 24 }}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          color: colors.foreground,
          marginBottom: 8,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: colors.foreground,
          lineHeight: 22,
        }}
      >
        {children}
      </Text>
    </View>
  );
}
