/**
 * SummaryCard Bileşeni
 * Aylık özet kartı
 */

import { View, Text } from "react-native";
import { formatCurrency } from "@/utils/helpers";
import { useTranslation } from "react-i18next";

interface SummaryCardProps {
  totalPayments: number;
  totalIncome: number;
  currency?: string;
}

export function SummaryCard({ totalPayments, totalIncome, currency = "TRY" }: SummaryCardProps) {
  const { t } = useTranslation();
  const balance = totalIncome - totalPayments;
  const isPositive = balance >= 0;

  return (
    <View className="bg-primary rounded-3xl p-6 mb-6">
      {/* Başlık */}
      <Text className="text-background/80 text-sm font-medium mb-4">
        {t("home.monthSummary")}
      </Text>

      {/* Gelir */}
      <View className="mb-4">
        <Text className="text-background/80 text-xs mb-1">{t("home.totalIncome")}</Text>
        <Text className="text-background text-2xl font-bold">
          {formatCurrency(totalIncome, currency)}
        </Text>
      </View>

      {/* Gider */}
      <View className="mb-4">
        <Text className="text-background/80 text-xs mb-1">{t("home.totalPayment")}</Text>
        <Text className="text-background text-2xl font-bold">
          {formatCurrency(totalPayments, currency)}
        </Text>
      </View>

      {/* Kalan Bakiye */}
      <View className="pt-4 border-t border-background/20">
        <Text className="text-background/80 text-xs mb-1">{t("home.remainingBalance")}</Text>
        <Text
          className={`text-3xl font-bold ${
            isPositive ? "text-background" : "text-error"
          }`}
        >
          {formatCurrency(balance, currency)}
        </Text>
      </View>
    </View>
  );
}
