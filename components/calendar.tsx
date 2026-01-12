/**
 * Calendar Bileşeni
 * Aylık takvim görünümü
 */

import { View, Text, TouchableOpacity, Platform } from "react-native";
import { useState } from "react";
import * as Haptics from "expo-haptics";
import { Payment, Income } from "@/types";
import { cn } from "@/lib/utils";

interface CalendarProps {
  payments: Payment[];
  incomes: Income[];
  onDatePress?: (date: Date) => void;
}

export function Calendar({ payments, incomes, onDatePress }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Ayın ilk ve son günü
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Ayın kaç gün olduğu
  const daysInMonth = lastDay.getDate();

  // Ayın ilk gününün haftanın hangi günü olduğu (0 = Pazar)
  const firstDayOfWeek = firstDay.getDay();

  // Önceki ay
  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  // Sonraki ay
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Belirli bir tarihte ödeme var mı?
  const hasPayment = (day: number): boolean => {
    const dateStr = new Date(year, month, day).toISOString().split("T")[0];
    return payments.some((p) => p.dueDate.startsWith(dateStr));
  };

  // Belirli bir tarihte gelir var mı?
  const hasIncome = (day: number): boolean => {
    const dateStr = new Date(year, month, day).toISOString().split("T")[0];
    return incomes.some((i) => i.date.startsWith(dateStr));
  };

  // Bugün mü?
  const isToday = (day: number): boolean => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    );
  };

  // Tarih tıklama
  const handleDatePress = (day: number) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    const date = new Date(year, month, day);
    onDatePress?.(date);
  };

  // Takvim günlerini oluştur
  const renderDays = () => {
    const days = [];

    // Boş günler (ayın başlangıcından önceki günler)
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(<View key={`empty-${i}`} className="flex-1 aspect-square" />);
    }

    // Ayın günleri
    for (let day = 1; day <= daysInMonth; day++) {
      const today = isToday(day);
      const payment = hasPayment(day);
      const income = hasIncome(day);

      days.push(
        <TouchableOpacity
          key={day}
          onPress={() => handleDatePress(day)}
          className="flex-1 aspect-square p-1"
        >
          <View
            className={cn(
              "flex-1 items-center justify-center rounded-lg",
              today && "bg-primary"
            )}
          >
            <Text
              className={cn(
                "text-base font-medium",
                today ? "text-background" : "text-foreground"
              )}
            >
              {day}
            </Text>
            {/* İndikatörler */}
            <View className="flex-row gap-1 mt-1">
              {payment && (
                <View className="w-1.5 h-1.5 rounded-full bg-error" />
              )}
              {income && (
                <View className="w-1.5 h-1.5 rounded-full bg-success" />
              )}
            </View>
          </View>
        </TouchableOpacity>
      );
    }

    return days;
  };

  // Ay adları
  const monthNames = [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık",
  ];

  // Gün adları
  const dayNames = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];

  return (
    <View className="bg-surface rounded-2xl p-4 border border-border">
      {/* Başlık */}
      <View className="flex-row items-center justify-between mb-4">
        <TouchableOpacity
          onPress={previousMonth}
          className="p-2 rounded-lg active:opacity-70"
        >
          <Text className="text-xl font-bold text-foreground">‹</Text>
        </TouchableOpacity>

        <Text className="text-lg font-bold text-foreground">
          {monthNames[month]} {year}
        </Text>

        <TouchableOpacity
          onPress={nextMonth}
          className="p-2 rounded-lg active:opacity-70"
        >
          <Text className="text-xl font-bold text-foreground">›</Text>
        </TouchableOpacity>
      </View>

      {/* Gün başlıkları */}
      <View className="flex-row mb-2">
        {dayNames.map((day) => (
          <View key={day} className="flex-1 items-center">
            <Text className="text-xs font-medium text-muted">{day}</Text>
          </View>
        ))}
      </View>

      {/* Takvim günleri */}
      <View className="flex-row flex-wrap">{renderDays()}</View>

      {/* Açıklama */}
      <View className="flex-row items-center justify-center gap-4 mt-4 pt-4 border-t border-border">
        <View className="flex-row items-center gap-2">
          <View className="w-2 h-2 rounded-full bg-error" />
          <Text className="text-xs text-muted">Ödeme</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <View className="w-2 h-2 rounded-full bg-success" />
          <Text className="text-xs text-muted">Gelir</Text>
        </View>
      </View>
    </View>
  );
}
