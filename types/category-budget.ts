/**
 * Kategori Bütçe Veri Yapısı
 */

export interface CategoryBudget {
  id: string; // Benzersiz ID
  categoryId: string; // Kategori ID (cat_food, cat_transport vb.)
  monthlyLimit: number; // Aylık limit (TL)
  month: string; // Ay (YYYY-MM formatında, örn: "2026-01")
  spent: number; // Harcanan miktar (TL)
  remaining: number; // Kalan miktar (TL)
  percentage: number; // Harcama yüzdesi (0-100)
  isOverBudget: boolean; // Bütçe aşıldı mı?
  createdAt: string; // Oluşturulma tarihi
  updatedAt: string; // Güncellenme tarihi
}

export interface CategoryBudgetSettings {
  categoryId: string; // Kategori ID
  monthlyLimit: number; // Aylık limit (TL)
  enabled: boolean; // Bütçe takibi aktif mi?
  alertAt80Percent: boolean; // %80'de uyar
  alertAt100Percent: boolean; // %100'de uyar
}

export interface BudgetAlert {
  categoryId: string; // Kategori ID
  categoryName: string; // Kategori adı
  monthlyLimit: number; // Aylık limit
  spent: number; // Harcanan
  percentage: number; // Yüzde
  alertType: "warning" | "danger"; // Uyarı tipi (%80 = warning, %100 = danger)
}
