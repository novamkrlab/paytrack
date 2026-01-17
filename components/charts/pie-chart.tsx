/**
 * Pasta Grafik Komponenti
 * Kategori bazlı harcama dağılımını gösterir
 */

import { View, Text, Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { useColors } from "@/hooks/use-colors";
import type { CategoryExpenseData } from "@/services/category-statistics-service";

interface CategoryPieChartProps {
  data: CategoryExpenseData[];
  title?: string;
}

export function CategoryPieChart({ data, title }: CategoryPieChartProps) {
  const colors = useColors();
  const screenWidth = Dimensions.get("window").width;

  if (data.length === 0) {
    return (
      <View className="bg-surface rounded-2xl p-4 items-center justify-center" style={{ minHeight: 200 }}>
        <Text className="text-muted">Henüz harcama verisi yok</Text>
      </View>
    );
  }

  // Grafik verilerini hazırla
  const chartData = data.map((item) => ({
    name: item.categoryName,
    amount: item.totalAmount,
    color: item.categoryColor,
    legendFontColor: colors.foreground,
    legendFontSize: 12,
  }));

  return (
    <View className="bg-surface rounded-2xl p-4">
      {title && (
        <Text className="text-lg font-semibold text-foreground mb-4">{title}</Text>
      )}
      
      <PieChart
        data={chartData}
        width={screenWidth - 64} // Padding'i çıkar
        height={220}
        chartConfig={{
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => colors.foreground,
        }}
        accessor="amount"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute // Yüzde yerine mutlak değer göster
      />

      {/* Detaylı Liste */}
      <View className="mt-4 gap-2">
        {data.map((item) => (
          <View key={item.categoryId} className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2 flex-1">
              <View
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.categoryColor }}
              />
              <Text className="text-sm text-foreground">{item.categoryIcon} {item.categoryName}</Text>
            </View>
            <View className="items-end">
              <Text className="text-sm font-semibold text-foreground">
                {item.totalAmount.toLocaleString("tr-TR")} ₺
              </Text>
              <Text className="text-xs text-muted">
                %{item.percentage.toFixed(1)}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
