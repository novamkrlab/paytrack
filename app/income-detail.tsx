/**
 * Gelir Detay Ekranı
 */

import { ScrollView, Text, View, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import {
  TextInputField,
  DatePickerField,
  PickerField,
  SwitchField,
} from "@/components/form-input";
import { useApp } from "@/lib/app-context";
import {
  IncomeType,
  RecurrenceFrequency,
  INCOME_TYPE_NAMES,
} from "@/types";

export default function IncomeDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { state, updateIncome, deleteIncome } = useApp();
  
  const income = state.incomes.find((i) => i.id === params.id);
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState(income?.name || "");
  const [amount, setAmount] = useState(income?.amount.toString() || "");
  const [type, setType] = useState<IncomeType>(income?.type || IncomeType.REGULAR);
  const [date, setDate] = useState(income?.date ? new Date(income.date) : new Date());
  const [notes, setNotes] = useState(income?.notes || "");
  const [hasRecurrence, setHasRecurrence] = useState(!!income?.recurrence);
  const [recurrenceFrequency, setRecurrenceFrequency] = useState<RecurrenceFrequency>(
    income?.recurrence?.frequency || RecurrenceFrequency.MONTHLY
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!income) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center p-6">
          <Text className="text-xl text-foreground">Gelir bulunamadı</Text>
          <TouchableOpacity
            className="mt-4 bg-primary rounded-2xl px-6 py-3"
            onPress={() => router.back()}
          >
            <Text className="text-background font-semibold">Geri Dön</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

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

  const handleSave = async () => {
    if (!validate()) return;
    const updatedIncome = {
      ...income,
      name: name.trim(),
      amount: Number(amount),
      type,
      date: date.toISOString(),
      notes: notes.trim() || undefined,
      recurrence: hasRecurrence ? { frequency: recurrenceFrequency } : undefined,
    };
    await updateIncome(updatedIncome);
    setIsEditing(false);
    Alert.alert("Başarılı", "Gelir güncellendi");
  };

  const handleDelete = () => {
    Alert.alert(
      "Geliri Sil",
      "Bu geliri silmek istediğinizden emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: async () => {
            await deleteIncome(income.id);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <ScreenContainer>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 }}>
        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground">{isEditing ? "Gelir Düzenle" : "Gelir Detayı"}</Text>
          <Text className="text-base text-muted mt-1">{isEditing ? "Bilgileri güncelleyin" : income.name}</Text>
        </View>

        {!isEditing ? (
          <View className="gap-4">
            <View className="bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-sm text-muted mb-1">Tutar</Text>
              <Text className="text-2xl font-bold text-success">{income.amount.toFixed(2)} ₺</Text>
            </View>
            <View className="bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-sm text-muted mb-1">Tip</Text>
              <Text className="text-base text-foreground">{INCOME_TYPE_NAMES[income.type]}</Text>
            </View>
            <View className="bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-sm text-muted mb-1">Tarih</Text>
              <Text className="text-base text-foreground">{new Date(income.date).toLocaleDateString("tr-TR")}</Text>
            </View>
            {income.notes && (
              <View className="bg-surface rounded-2xl p-4 border border-border">
                <Text className="text-sm text-muted mb-1">Notlar</Text>
                <Text className="text-base text-foreground">{income.notes}</Text>
              </View>
            )}
            <View className="flex-row gap-3 mt-4">
              <TouchableOpacity className="flex-1 bg-surface border border-border rounded-2xl p-4 items-center" onPress={() => setIsEditing(true)}>
                <Text className="text-foreground font-semibold">Düzenle</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 bg-error rounded-2xl p-4 items-center" onPress={handleDelete}>
                <Text className="text-background font-semibold">Sil</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View>
            <TextInputField label="Gelir Adı" value={name} onChangeText={setName} error={errors.name} required />
            <TextInputField label="Tutar" value={amount} onChangeText={setAmount} keyboardType="numeric" error={errors.amount} required />
            <PickerField label="Tip" value={type} onChange={(value) => setType(value as IncomeType)} options={typeOptions} required />
            <DatePickerField label="Tarih" value={date} onChange={setDate} required />
            <TextInputField label="Notlar" value={notes} onChangeText={setNotes} multiline />
            <SwitchField label="Tekrarlanan Gelir" value={hasRecurrence} onChange={setHasRecurrence} />
            {hasRecurrence && (
              <View className="ml-4 mb-4">
                <PickerField label="Sıklık" value={recurrenceFrequency} onChange={(value) => setRecurrenceFrequency(value as RecurrenceFrequency)} options={recurrenceOptions} required />
              </View>
            )}
            <View className="flex-row gap-3 mt-6">
              <TouchableOpacity className="flex-1 bg-surface border border-border rounded-2xl p-4 items-center" onPress={() => setIsEditing(false)}>
                <Text className="text-foreground font-semibold">İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 bg-success rounded-2xl p-4 items-center" onPress={handleSave}>
                <Text className="text-background font-semibold">Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
