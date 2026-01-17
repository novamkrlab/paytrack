/**
 * Kategori Yönetimi Sayfası
 * Kullanıcılar kategorilerini görüntüleyebilir, ekleyebilir, düzenleyebilir ve silebilir
 */

import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  FlatList,
} from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import type { Category } from "@/types/category";
import { AVAILABLE_ICONS, AVAILABLE_COLORS } from "@/types/category";
import {
  loadCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "@/services/category-service";

export default function CategoriesScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  
  // Form state
  const [formName, setFormName] = useState("");
  const [formIcon, setFormIcon] = useState("💰");
  const [formColor, setFormColor] = useState("#64748B");
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    loadCategoriesData();
  }, []);

  const loadCategoriesData = async () => {
    const data = await loadCategories();
    setCategories(data);
  };

  const handleAddCategory = async () => {
    if (!formName.trim()) {
      Alert.alert("Hata", "Kategori adı boş olamaz");
      return;
    }

    try {
      await addCategory({
        name: formName.trim(),
        icon: formIcon,
        color: formColor,
        isCustom: true,
        isDefault: false,
      });
      
      await loadCategoriesData();
      setShowAddModal(false);
      resetForm();
      Alert.alert("Başarılı", "Kategori eklendi");
    } catch (error) {
      Alert.alert("Hata", "Kategori eklenemedi");
    }
  };

  const handleEditCategory = async () => {
    if (!selectedCategory) return;
    
    if (!formName.trim()) {
      Alert.alert("Hata", "Kategori adı boş olamaz");
      return;
    }

    try {
      await updateCategory({
        ...selectedCategory,
        name: formName.trim(),
        icon: formIcon,
        color: formColor,
      });
      
      await loadCategoriesData();
      setShowEditModal(false);
      setSelectedCategory(null);
      resetForm();
      Alert.alert("Başarılı", "Kategori güncellendi");
    } catch (error) {
      Alert.alert("Hata", "Kategori güncellenemedi");
    }
  };

  const handleDeleteCategory = (category: Category) => {
    if (category.isDefault) {
      Alert.alert("Uyarı", "Varsayılan kategoriler silinemez");
      return;
    }

    Alert.alert(
      "Kategori Sil",
      `"${category.name}" kategorisini silmek istediğinize emin misiniz?`,
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteCategory(category.id);
              await loadCategoriesData();
              Alert.alert("Başarılı", "Kategori silindi");
            } catch (error) {
              Alert.alert("Hata", "Kategori silinemedi");
            }
          },
        },
      ]
    );
  };

  const openEditModal = (category: Category) => {
    setSelectedCategory(category);
    setFormName(category.name);
    setFormIcon(category.icon);
    setFormColor(category.color);
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormName("");
    setFormIcon("💰");
    setFormColor("#64748B");
  };

  const renderCategoryItem = (category: Category) => (
    <TouchableOpacity
      key={category.id}
      onPress={() => openEditModal(category)}
      className="bg-surface rounded-xl p-4 mb-3 flex-row items-center justify-between border border-border"
    >
      <View className="flex-row items-center flex-1">
        <View
          className="w-12 h-12 rounded-full items-center justify-center mr-3"
          style={{ backgroundColor: category.color + "20" }}
        >
          <Text className="text-2xl">{category.icon}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-base font-semibold text-foreground">
            {category.name}
          </Text>
          {category.isDefault && (
            <Text className="text-xs text-muted mt-1">Varsayılan Kategori</Text>
          )}
        </View>
      </View>
      
      {!category.isDefault && (
        <TouchableOpacity
          onPress={() => handleDeleteCategory(category)}
          className="ml-3 p-2"
        >
          <Text className="text-error text-lg">🗑️</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  const renderIconPicker = () => (
    <Modal visible={showIconPicker} transparent animationType="slide">
      <View className="flex-1 bg-black/70 justify-end" style={{ zIndex: 9999 }}>
        <View className="bg-surface rounded-t-3xl p-6 max-h-[70%]">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold text-foreground">İkon Seç</Text>
            <TouchableOpacity onPress={() => setShowIconPicker(false)}>
              <Text className="text-primary text-lg">Kapat</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={AVAILABLE_ICONS}
            numColumns={6}
            keyExtractor={(item, index) => `icon-${index}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setFormIcon(item);
                  setShowIconPicker(false);
                }}
                className="w-[16.66%] aspect-square items-center justify-center"
              >
                <View
                  className={`w-12 h-12 rounded-full items-center justify-center ${
                    formIcon === item ? "bg-primary/20" : "bg-background"
                  }`}
                >
                  <Text className="text-2xl">{item}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );

  const renderColorPicker = () => (
    <Modal visible={showColorPicker} transparent animationType="slide">
      <View className="flex-1 bg-black/70 justify-end" style={{ zIndex: 9999 }}>
        <View className="bg-surface rounded-t-3xl p-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold text-foreground">Renk Seç</Text>
            <TouchableOpacity onPress={() => setShowColorPicker(false)}>
              <Text className="text-primary text-lg">Kapat</Text>
            </TouchableOpacity>
          </View>
          
          <View className="flex-row flex-wrap">
            {AVAILABLE_COLORS.map((color) => (
              <TouchableOpacity
                key={color.hex}
                onPress={() => {
                  setFormColor(color.hex);
                  setShowColorPicker(false);
                }}
                className="w-[20%] p-2"
              >
                <View
                  className={`w-full aspect-square rounded-full items-center justify-center ${
                    formColor === color.hex ? "border-4 border-foreground" : ""
                  }`}
                  style={{ backgroundColor: color.hex }}
                >
                  {formColor === color.hex && (
                    <Text className="text-white text-xl">✓</Text>
                  )}
                </View>
                <Text className="text-xs text-muted text-center mt-1">
                  {color.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderFormModal = (isEdit: boolean) => (
    <Modal
      visible={(isEdit ? showEditModal : showAddModal) && !showIconPicker && !showColorPicker}
      transparent
      animationType="slide"
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-surface rounded-t-3xl p-6">
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-xl font-bold text-foreground">
              {isEdit ? "Kategori Düzenle" : "Yeni Kategori"}
            </Text>
            <TouchableOpacity
              onPress={() => {
                isEdit ? setShowEditModal(false) : setShowAddModal(false);
                resetForm();
              }}
            >
              <Text className="text-muted text-lg">İptal</Text>
            </TouchableOpacity>
          </View>

          {/* Kategori Adı */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-foreground mb-2">
              Kategori Adı *
            </Text>
            <TextInput
              value={formName}
              onChangeText={setFormName}
              placeholder="Örn: Evcil Hayvan"
              className="bg-background rounded-xl p-4 text-foreground"
              placeholderTextColor="#9BA1A6"
            />
          </View>

          {/* İkon Seçimi */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-foreground mb-2">
              İkon
            </Text>
            <TouchableOpacity
              onPress={() => setShowIconPicker(true)}
              className="bg-background rounded-xl p-4 flex-row items-center justify-between"
            >
              <View className="flex-row items-center">
                <Text className="text-3xl mr-3">{formIcon}</Text>
                <Text className="text-foreground">İkon Seç</Text>
              </View>
              <Text className="text-primary">→</Text>
            </TouchableOpacity>
          </View>

          {/* Renk Seçimi */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-foreground mb-2">
              Renk
            </Text>
            <TouchableOpacity
              onPress={() => setShowColorPicker(true)}
              className="bg-background rounded-xl p-4 flex-row items-center justify-between"
            >
              <View className="flex-row items-center">
                <View
                  className="w-8 h-8 rounded-full mr-3"
                  style={{ backgroundColor: formColor }}
                />
                <Text className="text-foreground">Renk Seç</Text>
              </View>
              <Text className="text-primary">→</Text>
            </TouchableOpacity>
          </View>

          {/* Kaydet Butonu */}
          <TouchableOpacity
            onPress={isEdit ? handleEditCategory : handleAddCategory}
            className="bg-primary rounded-full p-4 items-center"
          >
            <Text className="text-background font-semibold text-base">
              {isEdit ? "Güncelle" : "Ekle"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <ScreenContainer className="p-6">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-6">
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-primary text-lg">← Geri</Text>
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-foreground">Kategoriler</Text>
        <View className="w-16" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Açıklama */}
        <Text className="text-sm text-muted mb-6">
          Harcamalarınızı kategorilere ayırarak daha iyi takip edin. Kendi kategorilerinizi oluşturabilirsiniz.
        </Text>

        {/* Kategoriler */}
        {categories.map(renderCategoryItem)}

        {/* Yeni Kategori Ekle Butonu */}
        <TouchableOpacity
          onPress={() => setShowAddModal(true)}
          className="bg-primary/10 rounded-xl p-4 flex-row items-center justify-center mt-3 border-2 border-dashed border-primary"
        >
          <Text className="text-primary text-3xl mr-2">+</Text>
          <Text className="text-primary font-semibold text-base">
            Yeni Kategori Ekle
          </Text>
        </TouchableOpacity>

        <View className="h-8" />
      </ScrollView>

      {/* Modals */}
      {renderFormModal(false)}
      {renderFormModal(true)}
      {renderIconPicker()}
      {renderColorPicker()}
    </ScreenContainer>
  );
}
