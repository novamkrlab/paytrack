/**
 * Bütçe Durumu Kartı Komponenti
 * Kategori bazlı bütçe durumunu gösterir
 */

import { View, Text } from "react-native";
import type { CategoryBudget } from "@/types/category-budget";

interface BudgetStatusCardProps {
  budget: CategoryBudget;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
}

export function BudgetStatusCard({
  budget,
  categoryName,
  categoryIcon,
  categoryColor,
}: BudgetStatusCardProps) {
  // Durum rengi belirle
  const getStatusColor = () => {
    if (budget.isOverBudget) return "#EF4444"; // Kırmızı
    if (budget.percentage >= 80) return "#F59E0B"; // Turuncu
    return "#22C55E"; // Yeşil
  };

  const statusColor = getStatusColor();

  return (
    <View className="bg-surface rounded-2xl border border-border p-4">
      {/* Kategori Başlığı */}
      <View className="flex-row items-center gap-2 mb-3">
        <Text style={{ fontSize: 20 }}>{categoryIcon}</Text>
        <Text className="text-base font-semibold text-foreground flex-1">
          {categoryName}
        </Text>
        {budget.isOverBudget && (
          <View className="bg-error/10 px-2 py-1 rounded-md">
            <Text className="text-xs font-semibold text-error">Aşıldı</Text>
          </View>
        )}
      </View>

      {/* Progress Bar */}
      <View className="mb-3">
        <View className="bg-border rounded-full h-2 overflow-hidden">
          <View
            className="h-full rounded-full"
            style={{
              width: `${Math.min(100, budget.percentage)}%`,
              backgroundColor: statusColor,
            }}
          />
        </View>
      </View>

      {/* Tutarlar */}
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-xs text-muted mb-1">Harcanan</Text>
          <Text className="text-base font-semibold text-foreground">
            {budget.spent.toLocaleString("tr-TR")} ₺
          </Text>
        </View>
        <View className="items-center">
          <Text className="text-xs text-muted mb-1">Yüzde</Text>
          <Text
            className="text-base font-semibold"
            style={{ color: statusColor }}
          >
            %{budget.percentage.toFixed(0)}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-xs text-muted mb-1">Kalan</Text>
          <Text className="text-base font-semibold text-foreground">
            {budget.remaining.toLocaleString("tr-TR")} ₺
          </Text>
        </View>
      </View>

      {/* Limit Bilgisi */}
      <View className="mt-3 pt-3 border-t border-border">
        <Text className="text-xs text-muted text-center">
          Aylık Limit: {budget.monthlyLimit.toLocaleString("tr-TR")} ₺
        </Text>
      </View>
    </View>
  );
}
