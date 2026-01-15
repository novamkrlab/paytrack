/**
 * Ödeme Ekleme Ekranı
 */

import { ScrollView, Text, View, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { TextInputField, DatePickerField, PickerField, SwitchField } from "@/components/form-input";
import { calculatePeriodCount, calculateTotalAmount } from "@/utils/date-helpers";
import { useApp } from "@/lib/app-context";
import {
  PaymentCategory,
  PaymentStatus,
  RecurrenceFrequency,
} from "@/types";

export default function AddPaymentScreen() {
  const router = useRouter();
  const { addPayment } = useApp();

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<PaymentCategory>(PaymentCategory.OTHER);
  const [dueDate, setDueDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [hasInstallments, setHasInstallments] = useState(false);
  const [installmentTotal, setInstallmentTotal] = useState("");
  const [installmentCurrent, setInstallmentCurrent] = useState("");
  const [installmentEndDate, setInstallmentEndDate] = useState<Date | null>(null);
  const [recurrenceEndDate, setRecurrenceEndDate] = useState<Date | null>(null);
  const [hasRecurrence, setHasRecurrence] = useState(false);
  const [recurrenceFrequency, setRecurrenceFrequency] = useState<RecurrenceFrequency>(RecurrenceFrequency.MONTHLY);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categoryOptions = [
    { label: "Kredi Kartı", value: PaymentCategory.CREDIT_CARD },
    { label: "Kredi", value: PaymentCategory.LOAN },
    { label: "Diğer", value: PaymentCategory.OTHER },
  ];

  const recurrenceOptions = [
    { label: "Günlük", value: RecurrenceFrequency.DAILY },
    { label: "Haftalık", value: RecurrenceFrequency.WEEKLY },
    { label: "Aylık", value: RecurrenceFrequency.MONTHLY },
    { label: "Yıllık", value: RecurrenceFrequency.YEARLY },
  ];

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Ödeme adı gerekli";
    if (!amount.trim()) newErrors.amount = "Tutar gerekli";
    else if (isNaN(Number(amount)) || Number(amount) <= 0) newErrors.amount = "Geçerli bir tutar giriniz";
    if (hasInstallments) {
      if (!installmentTotal.trim()) newErrors.installmentTotal = "Toplam taksit sayısı gerekli";
      else if (isNaN(Number(installmentTotal)) || Number(installmentTotal) <= 0) newErrors.installmentTotal = "Geçerli bir sayı giriniz";
      if (!installmentCurrent.trim()) newErrors.installmentCurrent = "Mevcut taksit sayısı gerekli";
      else if (isNaN(Number(installmentCurrent)) || Number(installmentCurrent) <= 0) newErrors.installmentCurrent = "Geçerli bir sayı giriniz";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    const payment = {
      name: name.trim(),
      amount: Number(amount),
      category,
      dueDate: dueDate.toISOString(),
      status: PaymentStatus.PENDING,
      isPaid: false,
      notes: notes.trim() || undefined,
      installments: hasInstallments ? { 
        total: Number(installmentTotal), 
        current: Number(installmentCurrent),
        endDate: installmentEndDate ? installmentEndDate.toISOString() : undefined
      } : undefined,
      recurrence: hasRecurrence ? { 
        frequency: recurrenceFrequency,
        endDate: recurrenceEndDate ? recurrenceEndDate.toISOString() : undefined
      } : undefined,
    };
    await addPayment(payment);
    Alert.alert("Başarılı", "Ödeme eklendi", [{ text: "Tamam", onPress: () => router.back() }]);
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
          <Text className="text-3xl font-bold text-foreground">Ödeme Ekle</Text>
          <Text className="text-base text-muted mt-1">Yeni ödeme bilgilerini girin</Text>
        </View>
        <TextInputField label="Ödeme Adı" value={name} onChangeText={setName} placeholder="Örn: Akbank Kredi Kartı" error={errors.name} required />
        <TextInputField label="Tutar" value={amount} onChangeText={setAmount} placeholder="0.00" keyboardType="numeric" error={errors.amount} required />
        <PickerField label="Kategori" value={category} onChange={(value) => setCategory(value as PaymentCategory)} options={categoryOptions} required />
        <DatePickerField label="Ödeme Tarihi" value={dueDate} onChange={setDueDate} required />
        <TextInputField label="Notlar" value={notes} onChangeText={setNotes} placeholder="Ek notlar (opsiyonel)" multiline />
        <SwitchField label="Taksitli Ödeme" value={hasInstallments} onChange={setHasInstallments} description="Bu ödeme taksitli mi?" />
        {hasInstallments && (
          <View className="ml-4 mb-4">
            <TextInputField label="Toplam Taksit Sayısı" value={installmentTotal} onChangeText={setInstallmentTotal} placeholder="12" keyboardType="numeric" error={errors.installmentTotal} required />
            <TextInputField label="Mevcut Taksit" value={installmentCurrent} onChangeText={setInstallmentCurrent} placeholder="3" keyboardType="numeric" error={errors.installmentCurrent} required />
            <DatePickerField label="Son Taksit Tarihi" value={installmentEndDate || new Date()} onChange={setInstallmentEndDate} />
          </View>
        )}
        <SwitchField label="Tekrarlanan Ödeme" value={hasRecurrence} onChange={setHasRecurrence} description="Bu ödeme düzenli olarak tekrarlanıyor mu?" />
        {hasRecurrence && (
          <View className="ml-4 mb-4">
            <PickerField label="Tekrarlama Sıklığı" value={recurrenceFrequency} onChange={(value) => setRecurrenceFrequency(value as RecurrenceFrequency)} options={recurrenceOptions} required />
            <DatePickerField label="Son Ödeme Tarihi" value={recurrenceEndDate || new Date()} onChange={setRecurrenceEndDate} />
            {recurrenceEndDate && amount && (
              <View className="mt-2 p-3 bg-surface rounded-lg border border-border">
                <Text className="text-xs text-muted mb-1">Toplam Tutar Hesaplaması</Text>
                <Text className="text-sm text-foreground">
                  {calculatePeriodCount(dueDate, recurrenceEndDate, recurrenceFrequency)} dönem × {Number(amount).toLocaleString('tr-TR')} ₺ = {' '}
                  <Text className="font-semibold text-primary">
                    {calculateTotalAmount(Number(amount), dueDate, recurrenceEndDate, recurrenceFrequency).toLocaleString('tr-TR')} ₺
                  </Text>
                </Text>
              </View>
            )}
          </View>
        )}
        <View className="flex-row gap-3 mt-6">
          <TouchableOpacity className="flex-1 bg-surface border border-border rounded-2xl p-4 items-center active:opacity-80" onPress={() => router.back()}>
            <Text className="text-foreground font-semibold text-base">İptal</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-primary rounded-2xl p-4 items-center active:opacity-80" onPress={handleSubmit}>
            <Text className="text-background font-semibold text-base">Kaydet</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
