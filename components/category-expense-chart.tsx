/**
 * Kategori Bazlı Harcama Grafiği Bileşeni
 * Pasta grafiği ile kategori dağılımını gösterir
 */

import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { useColors } from "@/hooks/use-colors";
import { formatCurrency } from "@/utils/currency-helpers";
import type { CategoryExpense } from "@/types/budget";
import { PaymentCategory } from "@/types";
import Svg, { Circle, Text as SvgText } from "react-native-svg";

interface CategoryExpenseChartProps {
  expenses: CategoryExpense[];
  currency: string;
}

export function CategoryExpenseChart({ expenses, currency }: CategoryExpenseChartProps) {
  const { t } = useTranslation();
  const colors = useColors();

  const getCategoryLabel = (category: PaymentCategory) => {
    if (category === PaymentCategory.CREDIT_CARD) return t("categories.creditCard");
    if (category === PaymentCategory.LOAN) return t("categories.loan");
    return t("categories.other");
  };

  const getCategoryColor = (category: PaymentCategory) => {
    if (category === PaymentCategory.CREDIT_CARD) return "#3B82F6"; // Blue
    if (category === PaymentCategory.LOAN) return "#EF4444"; // Red
    return "#8B5CF6"; // Purple
  };

  if (expenses.length === 0) {
    return (
      <View className="bg-surface rounded-2xl p-6 border border-border">
        <Text className="text-base font-semibold text-foreground mb-4">
          {t("expense.byCategory")}
        </Text>
        <View className="items-center py-8">
          <Text className="text-sm text-muted text-center">
            {t("expense.noExpenses")}
          </Text>
        </View>
      </View>
    );
  }

  // Toplam harcama
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Pasta grafiği için açılar hesapla
  const radius = 80;
  const centerX = 100;
  const centerY = 100;
  const strokeWidth = 40;

  let currentAngle = -90; // 12 saat pozisyonundan başla

  return (
    <View className="bg-surface rounded-2xl p-6 border border-border">
      <Text className="text-base font-semibold text-foreground mb-6">
        {t("expense.byCategory")}
      </Text>

      {/* Pasta Grafiği */}
      <View className="items-center mb-6">
        <Svg width={200} height={200}>
          {/* Arka plan çemberi */}
          <Circle
            cx={centerX}
            cy={centerY}
            r={radius}
            stroke={colors.border}
            strokeWidth={strokeWidth}
            fill="none"
          />

          {/* Kategori dilimleri */}
          {expenses.map((expense, index) => {
            const angle = (expense.percentage / 100) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;

            // SVG arc için koordinatları hesapla
            const startX = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
            const startY = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
            const endX = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
            const endY = centerY + radius * Math.sin((endAngle * Math.PI) / 180);

            const largeArcFlag = angle > 180 ? 1 : 0;

            // Circumference hesapla
            const circumference = 2 * Math.PI * radius;
            const dashArray = `${(angle / 360) * circumference} ${circumference}`;
            const dashOffset = -((startAngle + 90) / 360) * circumference;

            currentAngle = endAngle;

            return (
              <Circle
                key={expense.category}
                cx={centerX}
                cy={centerY}
                r={radius}
                stroke={getCategoryColor(expense.category)}
                strokeWidth={strokeWidth}
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}
                fill="none"
                strokeLinecap="butt"
              />
            );
          })}

          {/* Merkez metni */}
          <SvgText
            x={centerX}
            y={centerY - 10}
            textAnchor="middle"
            fontSize="14"
            fill={colors.muted}
          >
            {t("expense.totalExpense")}
          </SvgText>
          <SvgText
            x={centerX}
            y={centerY + 15}
            textAnchor="middle"
            fontSize="18"
            fontWeight="bold"
            fill={colors.foreground}
          >
            {formatCurrency(totalExpense, currency as any)}
          </SvgText>
        </Svg>
      </View>

      {/* Kategori Listesi */}
      <View className="gap-3">
        {expenses.map((expense) => (
          <View key={expense.category} className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2 flex-1">
              <View
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: getCategoryColor(expense.category) }}
              />
              <Text className="text-sm text-foreground flex-1">
                {getCategoryLabel(expense.category)}
              </Text>
            </View>
            <View className="flex-row items-center gap-3">
              <Text className="text-sm font-semibold text-foreground">
                {formatCurrency(expense.amount, currency as any)}
              </Text>
              <Text className="text-xs text-muted w-12 text-right">
                {expense.percentage.toFixed(0)}%
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
