/**
 * Kategori Servisi Testleri
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  loadCategories,
  saveCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
  resetToDefaultCategories,
} from "@/services/category-service";
import { DEFAULT_CATEGORIES } from "@/types/category";
import type { Category } from "@/types/category";

// Mock AsyncStorage
vi.mock("@react-native-async-storage/async-storage", () => ({
  default: {
    getItem: vi.fn(),
    setItem: vi.fn(),
  },
}));

describe("Category Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("loadCategories", () => {
    it("should return default categories when no stored categories exist", async () => {
      (AsyncStorage.getItem as any).mockResolvedValue(null);
      
      const categories = await loadCategories();
      
      expect(categories).toHaveLength(DEFAULT_CATEGORIES.length);
      expect(categories[0].name).toBe("Gıda");
      expect(categories[0].icon).toBe("🍔");
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it("should return stored categories when they exist", async () => {
      const storedCategories: Category[] = [
        {
          id: "cat_custom_1",
          name: "Test Kategori",
          icon: "🎯",
          color: "#FF0000",
          isCustom: true,
          isDefault: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      (AsyncStorage.getItem as any).mockResolvedValue(JSON.stringify(storedCategories));
      
      const categories = await loadCategories();
      
      expect(categories).toHaveLength(1);
      expect(categories[0].name).toBe("Test Kategori");
    });

    it("should return default categories on error", async () => {
      (AsyncStorage.getItem as any).mockRejectedValue(new Error("Storage error"));
      
      const categories = await loadCategories();
      
      expect(categories).toHaveLength(DEFAULT_CATEGORIES.length);
    });
  });

  describe("saveCategories", () => {
    it("should save categories to AsyncStorage", async () => {
      const categories: Category[] = [
        {
          id: "cat_test",
          name: "Test",
          icon: "🎯",
          color: "#FF0000",
          isCustom: true,
          isDefault: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      
      await saveCategories(categories);
      
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "@categories",
        JSON.stringify(categories)
      );
    });

    it("should throw error when save fails", async () => {
      (AsyncStorage.setItem as any).mockRejectedValue(new Error("Save error"));
      const categories: Category[] = [];
      
      await expect(saveCategories(categories)).rejects.toThrow();
    });
  });

  describe("addCategory", () => {
    it("should add a new custom category", async () => {
      (AsyncStorage.getItem as any).mockResolvedValue(JSON.stringify([]));
      (AsyncStorage.setItem as any).mockResolvedValue(undefined);
      
      const newCategory = await addCategory({
        name: "Evcil Hayvan",
        icon: "🐕",
        color: "#FFA500",
        isCustom: true,
        isDefault: false,
      });
      
      expect(newCategory.name).toBe("Evcil Hayvan");
      expect(newCategory.icon).toBe("🐕");
      expect(newCategory.id).toContain("cat_custom_");
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });

    it("should generate unique ID for new category", async () => {
      (AsyncStorage.getItem as any).mockResolvedValue(JSON.stringify([]));
      (AsyncStorage.setItem as any).mockResolvedValue(undefined);
      
      const category1 = await addCategory({
        name: "Kategori 1",
        icon: "🎯",
        color: "#FF0000",
        isCustom: true,
        isDefault: false,
      });
      
      const category2 = await addCategory({
        name: "Kategori 2",
        icon: "🎯",
        color: "#FF0000",
        isCustom: true,
        isDefault: false,
      });
      
      expect(category1.id).not.toBe(category2.id);
    });
  });

  describe("updateCategory", () => {
    it("should update a custom category", async () => {
      const existingCategory: Category = {
        id: "cat_custom_1",
        name: "Eski Ad",
        icon: "🎯",
        color: "#FF0000",
        isCustom: true,
        isDefault: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      (AsyncStorage.getItem as any).mockResolvedValue(JSON.stringify([existingCategory]));
      (AsyncStorage.setItem as any).mockResolvedValue(undefined);
      
      const updatedCategory: Category = {
        ...existingCategory,
        name: "Yeni Ad",
        icon: "🚀",
        color: "#00FF00",
      };
      
      await updateCategory(updatedCategory);
      
      expect(AsyncStorage.setItem).toHaveBeenCalled();
      const savedData = (AsyncStorage.setItem as any).mock.calls[0][1];
      const saved = JSON.parse(savedData);
      expect(saved[0].name).toBe("Yeni Ad");
      expect(saved[0].icon).toBe("🚀");
    });

    it("should only update color for default categories", async () => {
      const defaultCategory: Category = {
        id: "cat_food",
        name: "Gıda",
        icon: "🍔",
        color: "#10B981",
        isCustom: false,
        isDefault: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      (AsyncStorage.getItem as any).mockResolvedValue(JSON.stringify([defaultCategory]));
      (AsyncStorage.setItem as any).mockResolvedValue(undefined);
      
      const updatedCategory: Category = {
        ...defaultCategory,
        name: "Yeni Ad", // Bu değişmemeli
        icon: "🚀", // Bu değişmemeli
        color: "#FF0000", // Sadece bu değişmeli
      };
      
      await updateCategory(updatedCategory);
      
      const savedData = (AsyncStorage.setItem as any).mock.calls[0][1];
      const saved = JSON.parse(savedData);
      expect(saved[0].name).toBe("Gıda"); // Değişmedi
      expect(saved[0].icon).toBe("🍔"); // Değişmedi
      expect(saved[0].color).toBe("#FF0000"); // Değişti
    });

    it("should throw error when category not found", async () => {
      (AsyncStorage.getItem as any).mockResolvedValue(JSON.stringify([]));
      
      const category: Category = {
        id: "nonexistent",
        name: "Test",
        icon: "🎯",
        color: "#FF0000",
        isCustom: true,
        isDefault: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      await expect(updateCategory(category)).rejects.toThrow("Category not found");
    });
  });

  describe("deleteCategory", () => {
    it("should delete a custom category", async () => {
      const customCategory: Category = {
        id: "cat_custom_1",
        name: "Özel Kategori",
        icon: "🎯",
        color: "#FF0000",
        isCustom: true,
        isDefault: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      (AsyncStorage.getItem as any).mockResolvedValue(JSON.stringify([customCategory]));
      (AsyncStorage.setItem as any).mockResolvedValue(undefined);
      
      await deleteCategory("cat_custom_1");
      
      const savedData = (AsyncStorage.setItem as any).mock.calls[0][1];
      const saved = JSON.parse(savedData);
      expect(saved).toHaveLength(0);
    });

    it("should throw error when trying to delete default category", async () => {
      const defaultCategory: Category = {
        id: "cat_food",
        name: "Gıda",
        icon: "🍔",
        color: "#10B981",
        isCustom: false,
        isDefault: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      (AsyncStorage.getItem as any).mockResolvedValue(JSON.stringify([defaultCategory]));
      
      await expect(deleteCategory("cat_food")).rejects.toThrow("Cannot delete default category");
    });

    it("should throw error when category not found", async () => {
      (AsyncStorage.getItem as any).mockResolvedValue(JSON.stringify([]));
      
      await expect(deleteCategory("nonexistent")).rejects.toThrow("Category not found");
    });
  });

  describe("getCategoryById", () => {
    it("should return category when found", async () => {
      const category: Category = {
        id: "cat_test",
        name: "Test",
        icon: "🎯",
        color: "#FF0000",
        isCustom: true,
        isDefault: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      (AsyncStorage.getItem as any).mockResolvedValue(JSON.stringify([category]));
      
      const found = await getCategoryById("cat_test");
      
      expect(found).toBeDefined();
      expect(found?.name).toBe("Test");
    });

    it("should return undefined when category not found", async () => {
      (AsyncStorage.getItem as any).mockResolvedValue(JSON.stringify([]));
      
      const found = await getCategoryById("nonexistent");
      
      expect(found).toBeUndefined();
    });

    it("should return undefined on error", async () => {
      (AsyncStorage.getItem as any).mockRejectedValue(new Error("Storage error"));
      
      const found = await getCategoryById("cat_test");
      
      expect(found).toBeUndefined();
    });
  });

  describe("resetToDefaultCategories", () => {
    it("should reset categories to defaults", async () => {
      (AsyncStorage.setItem as any).mockResolvedValue(undefined);
      
      await resetToDefaultCategories();
      
      expect(AsyncStorage.setItem).toHaveBeenCalled();
      const savedData = (AsyncStorage.setItem as any).mock.calls[0][1];
      const saved = JSON.parse(savedData);
      expect(saved).toHaveLength(DEFAULT_CATEGORIES.length);
      expect(saved[0].name).toBe("Gıda");
    });
  });
});
