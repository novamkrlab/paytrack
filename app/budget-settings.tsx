/**
 * Bütçe Ayarları Ekranı
 * Kategori bazlı bütçe limitleri belirleme (Yeni Kategori Sistemi)
 */

import { View, Text, ScrollView, Pressable, TextInput, Alert, Switch, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { loadCategories } from "@/services/category-service";
import {
  loadBudgetSettings,
  saveBudgetSettings,
  updateCategoryBudget,
  getCurrentMonthBudgets,
} from "@/services/category-budget-service";
import { useApp } from "@/lib/app-context";
import type { Category } from "@/types/category";
import type { CategoryBudgetSettings } from "@/types/category-budget";

export default function BudgetSettingsScreen() {
  const router = useRouter();
  const colors = useColors();
  const { t } = useTranslation();
  const { state } = useApp();

  const [categories, setCategories] = useState<Category[]>([]);
  const [budgetSettings, setBudgetSettings] = useState<CategoryBudgetSettings[]>([]);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingLimit, setEditingLimit] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [loadedCategories, loadedSettings] = await Promise.all([
        loadCategories(),
        loadBudgetSettings(),
      ]);
      
      setCategories(loadedCategories);
      setBudgetSettings(loadedSettings);
    } catch (error) {
      console.error("Bütçe yükleme hatası:", error);
      Alert.alert(t("common.error"), "Bütçe ayarları yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const getBudgetSetting = (categoryId: string): CategoryBudgetSettings | undefined => {
    return budgetSettings.find((s) => s.categoryId === categoryId);
  };

  const handleToggleBudget = async (categoryId: string, enabled: boolean) => {
    try {
      const setting = getBudgetSetting(categoryId);
      const monthlyLimit = setting?.monthlyLimit || 0;

      await updateCategoryBudget(categoryId, monthlyLimit, enabled);
      await loadData();
    } catch (error) {
      console.error("Bütçe toggle hatası:", error);
      Alert.alert(t("common.error"), "Bütçe ayarı güncellenirken bir hata oluştu");
    }
  };

  const handleStartEdit = (categoryId: string) => {
    const setting = getBudgetSetting(categoryId);
    setEditingCategoryId(categoryId);
    setEditingLimit(setting?.monthlyLimit?.toString() || "");
  };

  const handleSaveEdit = async () => {
    if (!editingCategoryId) return;

    const limit = parseFloat(editingLimit);
    if (isNaN(limit) || limit < 0) {
      Alert.alert(t("common.error"), "Geçerli bir tutar girin");
      return;
    }

    try {
      await updateCategoryBudget(editingCategoryId, limit, true);
      await loadData();
      setEditingCategoryId(null);
      setEditingLimit("");
    } catch (error) {
      console.error("Bütçe kaydetme hatası:", error);
      Alert.alert(t("common.error"), "Bütçe kaydedilirken bir hata oluştu");
    }
  };

  const handleCancelEdit = () => {
    setEditingCategoryId(null);
    setEditingLimit("");
  };

  if (loading) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center">
          <Text className="text-muted">{t("common.loading")}</Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      {/* Header */}
      <View className="flex-row items-center px-4 pt-4 pb-2">
        <Pressable
          onPress={() => router.back()}
          className="mr-3"
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
        >
          <IconSymbol name="chevron.left" size={24} color={colors.foreground} />
        </Pressable>
        <Text className="text-2xl font-bold text-foreground">Bütçe Ayarları</Text>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <View className="py-4 gap-4">
          <Text className="text-sm text-muted">
            Her kategori için aylık bütçe limiti belirleyin. Bütçenizin %80'ine ve %100'üne ulaştığınızda bildirim alacaksınız.
          </Text>

          {categories.map((category) => {
            const setting = getBudgetSetting(category.id);
            const isEnabled = setting?.enabled || false;
            const isEditing = editingCategoryId === category.id;

            return (
              <View
                key={category.id}
                className="bg-surface rounded-2xl border border-border p-4"
              >
                {/* Kategori Başlığı */}
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center gap-2 flex-1">
                    <Text style={{ fontSize: 24 }}>{category.icon}</Text>
                    <Text className="text-base font-semibold text-foreground">
                      {category.name}
                    </Text>
                  </View>
                  <Switch
                    value={isEnabled}
                    onValueChange={(value) => handleToggleBudget(category.id, value)}
                    trackColor={{ false: colors.border, true: category.color }}
                    thumbColor={colors.background}
                  />
                </View>

                {/* Bütçe Limiti */}
                {isEnabled && (
                  <View className="gap-2">
                    {isEditing ? (
                      // Düzenleme Modu
                      <View className="gap-2">
                        <Text className="text-xs text-muted">Aylık Limit (₺)</Text>
                        <TextInput
                          value={editingLimit}
                          onChangeText={setEditingLimit}
                          placeholder="0.00"
                          placeholderTextColor={colors.muted}
                          keyboardType="decimal-pad"
                          className="bg-background border border-border rounded-lg px-3 py-2 text-foreground"
                        />
                        <View className="flex-row gap-2">
                          <TouchableOpacity
                            onPress={handleSaveEdit}
                            className="flex-1 bg-primary rounded-lg py-2 items-center"
                          >
                            <Text className="text-background font-semibold">Kaydet</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={handleCancelEdit}
                            className="flex-1 bg-surface border border-border rounded-lg py-2 items-center"
                          >
                            <Text className="text-foreground font-semibold">İptal</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : (
                      // Görüntüleme Modu
                      <TouchableOpacity
                        onPress={() => handleStartEdit(category.id)}
                        className="bg-background rounded-lg p-3"
                      >
                        <View className="flex-row items-center justify-between">
                          <Text className="text-xs text-muted">Aylık Limit</Text>
                          <Text className="text-base font-semibold text-foreground">
                            {setting?.monthlyLimit ? `${setting.monthlyLimit.toLocaleString("tr-TR")} ₺` : "Belirle"}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            );
          })}

          {/* Bilgi Notu */}
          <View className="bg-primary/10 border border-primary/20 rounded-xl p-4 mt-4">
            <Text className="text-sm text-foreground">
              💡 <Text className="font-semibold">İpucu:</Text> Bütçe takibi harcamalarınızı kontrol altında tutmanıza yardımcı olur. 
              Gerçekçi limitler belirleyin ve düzenli olarak gözden geçirin.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
