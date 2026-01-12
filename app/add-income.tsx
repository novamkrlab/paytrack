/**
 * Gelir Ekleme Ekranı
 */

import { ScrollView, Text, View, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import {
  TextInputField,
  DatePickerField,
  PickerField,
  SwitchField,
} from "@/components/form-input";
import { useApp } from "@/lib/app-context";
import { IncomeType, RecurrenceFrequency } from "@/types";

export default function AddIncomeScreen() {
  const router = useRouter();
  const { addIncome } = useApp();

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<IncomeType>(IncomeType.REGULAR);
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [hasRecurrence, setHasRecurrence] = useState(false);
  const [recurrenceFrequency, setRecurrenceFrequency] = useState<RecurrenceFrequency>(RecurrenceFrequency.MONTHLY);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const typeOptions = [
    { label: "Düzenli", value: IncomeType.REGULAR },
    { label: "Düzenli Olmayan", value: IncomeType.IRREGULAR },
  ];

  const recurrenceOptions = [
    { label: "Günlük", value: RecurrenceFrequency.DAILY },
    { label: "Haftalık", value: RecurrenceFrequency.WEEKLY },
    { label: "Aylık", value: RecurrenceFrequency.MONTHLY },
    { label: "Yıllık", value: RecurrenceFrequency.YEARLY },
  ];

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Gelir adı gerekli";
    if (!amount.trim()) newErrors.amount = "Tutar gerekli";
    else if (isNaN(Number(amount)) || Number(amount) <= 0) newErrors.amount = "Geçerli bir tutar giriniz";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    const income = {
      name: name.trim(),
      amount: Number(amount),
      type,
      date: date.toISOString(),
      notes: notes.trim() || undefined,
      recurrence: hasRecurrence ? { frequency: recurrenceFrequency } : undefined,
    };
    await addIncome(income);
    Alert.alert("Başarılı", "Gelir eklendi", [{ text: "Tamam", onPress: () => router.back() }]);
  };

  return (
    <ScreenContainer>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 }}>
        {/* Geri Dönme Butonu */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center mb-4"
        >
          <Text className="text-2xl text-primary mr-2">‹</Text>
          <Text className="text-base text-primary font-medium">Geri</Text>
        </TouchableOpacity>

        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground">Gelir Ekle</Text>
          <Text className="text-base text-muted mt-1">Yeni gelir bilgilerini girin</Text>
        </View>
        <TextInputField label="Gelir Adı" value={name} onChangeText={setName} placeholder="Örn: Maaş" error={errors.name} required />
        <TextInputField label="Tutar" value={amount} onChangeText={setAmount} placeholder="0.00" keyboardType="numeric" error={errors.amount} required />
        <PickerField label="Tip" value={type} onChange={(value) => setType(value as IncomeType)} options={typeOptions} required />
        <DatePickerField label="Tarih" value={date} onChange={setDate} required />
        <TextInputField label="Notlar" value={notes} onChangeText={setNotes} placeholder="Ek notlar (opsiyonel)" multiline />
        <SwitchField label="Tekrarlanan Gelir" value={hasRecurrence} onChange={setHasRecurrence} description="Bu gelir düzenli olarak tekrarlanıyor mu?" />
        {hasRecurrence && (
          <View className="ml-4 mb-4">
            <PickerField label="Tekrarlama Sıklığı" value={recurrenceFrequency} onChange={(value) => setRecurrenceFrequency(value as RecurrenceFrequency)} options={recurrenceOptions} required />
          </View>
        )}
        <View className="flex-row gap-3 mt-6">
          <TouchableOpacity className="flex-1 bg-surface border border-border rounded-2xl p-4 items-center active:opacity-80" onPress={() => router.back()}>
            <Text className="text-foreground font-semibold text-base">İptal</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-success rounded-2xl p-4 items-center active:opacity-80" onPress={handleSubmit}>
            <Text className="text-background font-semibold text-base">Kaydet</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
