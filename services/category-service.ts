/**
 * Kategori Yönetimi Servisi
 * Kullanıcı kategorilerini yönetir (ekleme, düzenleme, silme)
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Category } from "@/types/category";
import { DEFAULT_CATEGORIES } from "@/types/category";

const STORAGE_KEY = "@categories";

/**
 * Kategorileri yükle
 * İlk yüklemede varsayılan kategorileri ekle
 */
export async function loadCategories(): Promise<Category[]> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    
    if (stored) {
      return JSON.parse(stored);
    }
    
    // İlk yüklemede varsayılan kategorileri ekle
    const now = new Date().toISOString();
    const categories: Category[] = DEFAULT_CATEGORIES.map((cat) => ({
      ...cat,
      createdAt: now,
      updatedAt: now,
    }));
    
    await saveCategories(categories);
    return categories;
  } catch (error) {
    console.error("Error loading categories:", error);
    // Hata durumunda varsayılan kategorileri döndür
    const now = new Date().toISOString();
    return DEFAULT_CATEGORIES.map((cat) => ({
      ...cat,
      createdAt: now,
      updatedAt: now,
    }));
  }
}

/**
 * Kategorileri kaydet
 */
export async function saveCategories(categories: Category[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  } catch (error) {
    console.error("Error saving categories:", error);
    throw error;
  }
}

/**
 * Yeni kategori ekle
 */
export async function addCategory(
  categoryData: Omit<Category, "id" | "createdAt" | "updatedAt">
): Promise<Category> {
  try {
    const categories = await loadCategories();
    const now = new Date().toISOString();
    
    const newCategory: Category = {
      ...categoryData,
      id: `cat_custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
      updatedAt: now,
    };
    
    categories.push(newCategory);
    await saveCategories(categories);
    
    return newCategory;
  } catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
}

/**
 * Kategori güncelle
 */
export async function updateCategory(category: Category): Promise<void> {
  try {
    const categories = await loadCategories();
    const index = categories.findIndex((c) => c.id === category.id);
    
    if (index === -1) {
      throw new Error("Category not found");
    }
    
    // Varsayılan kategorilerin bazı alanları değiştirilemez
    if (categories[index].isDefault) {
      // Sadece renk değiştirilebilir
      categories[index] = {
        ...categories[index],
        color: category.color,
        updatedAt: new Date().toISOString(),
      };
    } else {
      // Özel kategoriler tamamen değiştirilebilir
      categories[index] = {
        ...category,
        updatedAt: new Date().toISOString(),
      };
    }
    
    await saveCategories(categories);
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
}

/**
 * Kategori sil
 * Varsayılan kategoriler silinemez
 */
export async function deleteCategory(id: string): Promise<void> {
  try {
    const categories = await loadCategories();
    const category = categories.find((c) => c.id === id);
    
    if (!category) {
      throw new Error("Category not found");
    }
    
    if (category.isDefault) {
      throw new Error("Cannot delete default category");
    }
    
    const filtered = categories.filter((c) => c.id !== id);
    await saveCategories(filtered);
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
}

/**
 * Kategoriyi ID'ye göre bul
 */
export async function getCategoryById(id: string): Promise<Category | undefined> {
  try {
    const categories = await loadCategories();
    return categories.find((c) => c.id === id);
  } catch (error) {
    console.error("Error getting category:", error);
    return undefined;
  }
}

/**
 * Varsayılan kategorileri sıfırla
 */
export async function resetToDefaultCategories(): Promise<void> {
  try {
    const now = new Date().toISOString();
    const categories: Category[] = DEFAULT_CATEGORIES.map((cat) => ({
      ...cat,
      createdAt: now,
      updatedAt: now,
    }));
    
    await saveCategories(categories);
  } catch (error) {
    console.error("Error resetting categories:", error);
    throw error;
  }
}
