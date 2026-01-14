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
    const y = year;
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`;
    return payments.some((p) => p.dueDate.startsWith(dateStr));
  };

  // Belirli bir tarihte gelir var mı?
  const hasIncome = (day: number): boolean => {
    const y = year;
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`;
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

  // Takvim günlerini oluştur (satır satır)
  const renderCalendar = () => {
    const weeks = [];
    let currentWeek = [];
    
    // Boş günler (ayın başlangıcından önceki günler)
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push(
        <View key={`empty-${i}`} style={{ width: '14.28%', aspectRatio: 1 }} />
      );
    }

    // Ayın günleri
    for (let day = 1; day <= daysInMonth; day++) {
      const today = isToday(day);
      const payment = hasPayment(day);
      const income = hasIncome(day);

      currentWeek.push(
        <TouchableOpacity
          key={day}
          onPress={() => handleDatePress(day)}
          style={{ width: '14.28%', aspectRatio: 1, padding: 2 }}
        >
          <View
            className={cn(
              "flex-1 items-center justify-center rounded-lg",
              today && "bg-primary"
            )}
          >
            <Text
              className={cn(
                "text-sm font-semibold",
                today ? "text-white" : "text-foreground"
              )}
              style={{ color: today ? "#FFFFFF" : undefined }}
            >
              {day}
            </Text>
            {/* İndikatörler */}
            <View className="flex-row gap-1 mt-0.5">
              {payment && (
                <View className="w-1 h-1 rounded-full bg-error" />
              )}
              {income && (
                <View className="w-1 h-1 rounded-full bg-success" />
              )}
            </View>
          </View>
        </TouchableOpacity>
      );

      // Hafta tamamlandı mı?
      if (currentWeek.length === 7) {
        weeks.push(
          <View key={`week-${weeks.length}`} className="flex-row">
            {currentWeek}
          </View>
        );
        currentWeek = [];
      }
    }

    // Son haftayı ekle (eksikse)
    if (currentWeek.length > 0) {
      // Kalan günleri boş view ile doldur
      while (currentWeek.length < 7) {
        currentWeek.push(
          <View key={`empty-end-${currentWeek.length}`} style={{ width: '14.28%', aspectRatio: 1 }} />
        );
      }
      weeks.push(
        <View key={`week-${weeks.length}`} className="flex-row">
          {currentWeek}
        </View>
      );
    }

    return weeks;
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
      <View>{renderCalendar()}</View>

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
