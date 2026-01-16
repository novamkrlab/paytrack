/**
 * Harcama Ekleme Ekranı
 */

import { useState } from "react";
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
import { ExpenseCategory, getExpenseType } from "@/types/expense";
import { useTranslation } from "react-i18next";
import * as Haptics from "expo-haptics";

export default function AddExpenseScreen() {
  const { t } = useTranslation();
  const { addExpense } = useApp();
  const colors = useColors();

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<ExpenseCategory | null>(null);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Kategorileri tipe göre grupla
  const essentialCategories: ExpenseCategory[] = [
    ExpenseCategory.RENT,
    ExpenseCategory.ELECTRICITY,
    ExpenseCategory.WATER,
    ExpenseCategory.GAS,
    ExpenseCategory.PHONE_INTERNET,
    ExpenseCategory.TRANSPORTATION,
    ExpenseCategory.GROCERIES,
  ];

  const discretionaryCategories: ExpenseCategory[] = [
    ExpenseCategory.ENTERTAINMENT,
    ExpenseCategory.CLOTHING,
    ExpenseCategory.DINING_OUT,
    ExpenseCategory.GIFTS,
    ExpenseCategory.HOBBIES,
    ExpenseCategory.TRAVEL,
  ];

  const otherCategories: ExpenseCategory[] = [
    ExpenseCategory.HEALTHCARE,
    ExpenseCategory.EDUCATION,
    ExpenseCategory.MAINTENANCE,
    ExpenseCategory.OTHER,
  ];

  const handleSubmit = async () => {
    // Validasyon
    if (!name.trim()) {
      Alert.alert(t("common.error"), t("expenses.expenseName") + " gerekli");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert(t("common.error"), "Geçerli bir tutar girin");
      return;
    }

    if (!category) {
      Alert.alert(t("common.error"), t("expenses.selectCategory"));
      return;
    }

    setIsSubmitting(true);

    try {
      await addExpense({
        name: name.trim(),
        amount: parseFloat(amount),
        category,
        date,
        notes: notes.trim() || undefined,
      });

      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      router.back();
    } catch (error) {
      console.error("Harcama ekleme hatası:", error);
      Alert.alert(t("common.error"), "Harcama eklenirken bir hata oluştu");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCategoryButton = (cat: ExpenseCategory) => {
    const isSelected = category === cat;
    return (
      <TouchableOpacity
        key={cat}
        onPress={() => {
          setCategory(cat);
          if (Platform.OS !== "web") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
        }}
        className={`p-3 rounded-lg border ${
          isSelected ? "border-primary bg-primary/10" : "border-border bg-surface"
        }`}
      >
        <Text
          className={`text-sm ${isSelected ? "text-primary font-semibold" : "text-foreground"}`}
        >
          {t(`expenseCategories.${cat}`)}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenContainer>
      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        <View className="gap-6">
          {/* Başlık */}
          <View>
            <Text className="text-2xl font-bold text-foreground">
              {t("expenses.addExpense")}
            </Text>
          </View>

          {/* Harcama Adı */}
          <View className="gap-2">
            <Text className="text-sm font-medium text-foreground">
              {t("expenses.expenseName")}
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Örn: Market alışverişi"
              placeholderTextColor={colors.muted}
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
            />
          </View>

          {/* Tutar */}
          <View className="gap-2">
            <Text className="text-sm font-medium text-foreground">
              {t("expenses.amount")}
            </Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor={colors.muted}
              keyboardType="decimal-pad"
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
            />
          </View>

          {/* Tarih */}
          <View className="gap-2">
            <Text className="text-sm font-medium text-foreground">
              {t("expenses.date")}
            </Text>
            <TextInput
              value={date}
              onChangeText={setDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.muted}
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
            />
          </View>

          {/* Kategori Seçimi */}
          <View className="gap-3">
            <Text className="text-sm font-medium text-foreground">
              {t("expenses.category")}
            </Text>

            {/* Zorunlu Giderler */}
            <View className="gap-2">
              <Text className="text-xs font-semibold text-muted uppercase">
                {t("expenseTypes.essential")}
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {essentialCategories.map(renderCategoryButton)}
              </View>
            </View>

            {/* İstek Harcamaları */}
            <View className="gap-2">
              <Text className="text-xs font-semibold text-muted uppercase">
                {t("expenseTypes.discretionary")}
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {discretionaryCategories.map(renderCategoryButton)}
              </View>
            </View>

            {/* Diğer */}
            <View className="gap-2">
              <Text className="text-xs font-semibold text-muted uppercase">
                {t("expenseTypes.other")}
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {otherCategories.map(renderCategoryButton)}
              </View>
            </View>
          </View>

          {/* Notlar */}
          <View className="gap-2">
            <Text className="text-sm font-medium text-foreground">
              {t("expenses.notes")} ({t("common.optional")})
            </Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Ek bilgi..."
              placeholderTextColor={colors.muted}
              multiline
              numberOfLines={3}
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              style={{ textAlignVertical: "top" }}
            />
          </View>

          {/* Butonlar */}
          <View className="flex-row gap-3 pb-8">
            <TouchableOpacity
              onPress={() => router.back()}
              className="flex-1 bg-surface border border-border rounded-full py-4 items-center"
            >
              <Text className="text-foreground font-semibold">
                {t("common.cancel")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isSubmitting}
              className={`flex-1 bg-primary rounded-full py-4 items-center ${
                isSubmitting ? "opacity-50" : ""
              }`}
            >
              <Text className="text-background font-semibold">
                {isSubmitting ? t("common.saving") : t("common.save")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
