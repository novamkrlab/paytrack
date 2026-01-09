/**
 * PaymentCard Bileşeni
 * Ödeme kartı gösterimi
 */

import { View, Text, Pressable, Platform } from "react-native";
import * as Haptics from "expo-haptics";
import { Payment, CATEGORY_NAMES, STATUS_NAMES } from "@/types";
import { formatDateShort, formatCurrency, getStatusColor, getStatusBgColor } from "@/utils/helpers";
import { cn } from "@/lib/utils";

interface PaymentCardProps {
  payment: Payment;
  onPress?: () => void;
  currency?: string;
}

export function PaymentCard({ payment, onPress, currency = "TRY" }: PaymentCardProps) {
  const handlePress = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <View className="bg-surface rounded-2xl p-4 mb-3 border border-border">
        {/* Üst kısım: İsim ve durum badge */}
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-base font-semibold text-foreground flex-1" numberOfLines={1}>
            {payment.name}
          </Text>
          <View className={cn("px-3 py-1 rounded-full", getStatusBgColor(payment.status))}>
            <Text className={cn("text-xs font-medium", getStatusColor(payment.status))}>
              {STATUS_NAMES[payment.status]}
            </Text>
          </View>
        </View>

        {/* Orta kısım: Kategori ve taksit bilgisi */}
        <View className="flex-row items-center mb-2">
          <Text className="text-sm text-muted">
            {CATEGORY_NAMES[payment.category]}
          </Text>
          {payment.installments && (
            <Text className="text-sm text-muted ml-2">
              • {payment.installments.current}/{payment.installments.total} Taksit
            </Text>
          )}
        </View>

        {/* Alt kısım: Tutar ve tarih */}
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-bold text-foreground">
            {formatCurrency(payment.amount, currency)}
          </Text>
          <Text className="text-sm text-muted">
            {formatDateShort(payment.dueDate)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
