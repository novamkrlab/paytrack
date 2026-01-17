/**
 * Harcama Ekleme Ekranı (Yeni Kategori Sistemi)
 */
import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useApp } from "@/lib/app-context";
import { useColors } from "@/hooks/use-colors";
import { useTranslation } from "react-i18next";
import * as Haptics from "expo-haptics";
import { IconSymbol } from "@/components/ui/icon-symbol";
import type { Category } from "@/types/category";

export default function AddExpenseScreen() {
  const { t } = useTranslation();
  const { addExpense, state } = useApp();
  const colors = useColors();
  
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = state.categories || [];

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert(t("common.error"), "Harcama adı gerekli");
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert(t("common.error"), "Geçerli bir tutar girin");
      return;
    }

    if (!category) {
      Alert.alert(t("common.error"), "Kategori seçin");
      return;
    }

    setIsSubmitting(true);

    try {
      await addExpense({
        name: name.trim(),
        amount: amountNum,
        category,
        date: new Date(date).toISOString(),
        notes: notes.trim(),
      });

      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      router.back();
    } catch (error) {
      Alert.alert(t("common.error"), "Harcama eklenemedi");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between py-4">
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ opacity: 0.8 }}
          >
            <IconSymbol name="chevron.left" size={24} color={colors.tint} />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-foreground">
            Yeni Harcama
          </Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Form */}
        <View className="gap-6 mt-4">
          {/* Harcama Adı */}
          <View>
            <Text className="text-sm font-medium text-muted mb-2">
              Harcama Adı *
            </Text>
            <TextInput
              className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground"
              placeholder="Örn: Market alışverişi"
              placeholderTextColor={colors.muted}
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Tutar */}
          <View>
            <Text className="text-sm font-medium text-muted mb-2">
              Tutar *
            </Text>
            <TextInput
              className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground"
              placeholder="0.00"
              placeholderTextColor={colors.muted}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />
          </View>

          {/* Kategori Seçimi */}
          <View>
            <Text className="text-sm font-medium text-muted mb-2">
              Kategori *
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="gap-2"
              contentContainerStyle={{ gap: 8 }}
            >
              {categories.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => {
                      setCategory(cat.id);
                      if (Platform.OS !== "web") {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }
                    }}
                    style={{
                      backgroundColor: isSelected ? cat.color : colors.surface,
                      borderWidth: 1,
                      borderColor: isSelected ? cat.color : colors.border,
                      paddingHorizontal: 16,
                      paddingVertical: 12,
                      borderRadius: 12,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Text style={{ fontSize: 20 }}>{cat.icon}</Text>
                    <Text
                      style={{
                        color: isSelected ? "#FFFFFF" : colors.foreground,
                        fontWeight: isSelected ? "600" : "400",
                      }}
                    >
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Tarih */}
          <View>
            <Text className="text-sm font-medium text-muted mb-2">
              Tarih *
            </Text>
            <TextInput
              className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground"
              value={date}
              onChangeText={setDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.muted}
            />
          </View>

          {/* Notlar */}
          <View>
            <Text className="text-sm font-medium text-muted mb-2">
              Notlar
            </Text>
            <TextInput
              className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground"
              placeholder="İsteğe bağlı not ekleyin"
              placeholderTextColor={colors.muted}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isSubmitting}
          style={{
            backgroundColor: colors.tint,
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: "center",
            marginTop: 32,
            opacity: isSubmitting ? 0.6 : 1,
          }}
        >
          <Text className="text-white font-semibold text-lg">
            {isSubmitting ? "Ekleniyor..." : "Harcama Ekle"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}
