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
import { useTranslation } from "react-i18next";
import { formatCurrency } from "@/utils/currency-helpers";

export default function IncomeDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t, i18n } = useTranslation();
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
          <Text className="text-xl text-foreground">{t("incomeDetail.notFound")}</Text>
          <TouchableOpacity
            className="mt-4 bg-primary rounded-2xl px-6 py-3"
            onPress={() => router.back()}
          >
            <Text className="text-background font-semibold">{t("incomeDetail.goBack")}</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  const typeOptions = [
    { label: t("incomes.regular"), value: IncomeType.REGULAR },
    { label: t("incomes.irregular"), value: IncomeType.IRREGULAR },
  ];

  const recurrenceOptions = [
    { label: t("recurrence.daily"), value: RecurrenceFrequency.DAILY },
    { label: t("recurrence.weekly"), value: RecurrenceFrequency.WEEKLY },
    { label: t("recurrence.monthly"), value: RecurrenceFrequency.MONTHLY },
    { label: t("recurrence.yearly"), value: RecurrenceFrequency.YEARLY },
  ];

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = t("incomeDetail.nameRequired");
    if (!amount.trim()) newErrors.amount = t("incomeDetail.amountRequired");
    else if (isNaN(Number(amount)) || Number(amount) <= 0) newErrors.amount = t("incomeDetail.validAmount");
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
    Alert.alert(t("incomeDetail.success"), t("incomeDetail.updated"));
  };

  const handleDelete = () => {
    // Aynı isme sahip diğer gelirleri bul (tekrarlar)
    const relatedIncomes = state.incomes.filter(
      (i) => i.name === income.name && i.id !== income.id
    );

    if (relatedIncomes.length > 0) {
      // Tekrarlanan gelir mi kontrol et
      const isRecurring = income.recurrence;
      
      // Eğer tekrarlanan gelir ise, bundan sonraki gelirleri bul (tarihe göre)
      let futureIncomes: typeof state.incomes = [];
      if (isRecurring) {
        const currentDate = new Date(income.date);
        const baseName = income.name.replace(/ \(\d+\)$/, ''); // "Maaş (2)" -> "Maaş"
        
        futureIncomes = state.incomes.filter((i) => {
          if (i.id === income.id) return false;
          const iBaseName = i.name.replace(/ \(\d+\)$/, '');
          const iDate = new Date(i.date);
          return iBaseName === baseName && iDate > currentDate;
        });
      }

      // Seçenekleri hazırla
      const buttons: any[] = [
        { text: t("incomeDetail.cancel"), style: "cancel" },
        {
          text: "Sadece bunu sil",
          onPress: async () => {
            await deleteIncome(income.id);
            router.back();
          },
        },
      ];

      // Eğer tekrarlanan gelir ve gelecek gelirler varsa, "Bundan sonrakini sil" seçeneği ekle
      if (isRecurring && futureIncomes.length > 0) {
        buttons.push({
          text: `Bundan sonrakini sil (${futureIncomes.length + 1})`,
          style: "destructive",
          onPress: async () => {
            // Bu geliri ve gelecek gelirleri sil
            await deleteIncome(income.id);
            for (const futureIncome of futureIncomes) {
              await deleteIncome(futureIncome.id);
            }
            Alert.alert(t("incomeDetail.success"), t("incomeDetail.deleted", { count: futureIncomes.length + 1 }));
            router.back();
          },
        });
      }

      // "Tümünü sil" seçeneği
      buttons.push({
        text: `Tümünü sil (${relatedIncomes.length + 1})`,
        style: "destructive",
        onPress: async () => {
          // Bu geliri ve tüm tekrarları sil
          await deleteIncome(income.id);
          for (const relatedIncome of relatedIncomes) {
            await deleteIncome(relatedIncome.id);
          }
          Alert.alert(t("incomeDetail.success"), t("incomeDetail.deleted", { count: relatedIncomes.length + 1 }));
          router.back();
        },
      });

      // Tekrarlar varsa, seçenek sun
      Alert.alert(
        t("incomeDetail.deleteTitle"),
        t("incomeDetail.deleteMessage") + ` (${relatedIncomes.length})`,
        buttons
      );
    } else {
      // Tekrar yoksa, normal silme
      Alert.alert(
        t("incomeDetail.deleteTitle"),
        t("incomeDetail.deleteMessage"),
        [
          { text: t("incomeDetail.cancel"), style: "cancel" },
          {
            text: t("incomeDetail.delete"),
            style: "destructive",
            onPress: async () => {
              await deleteIncome(income.id);
              router.back();
            },
          },
        ]
      );
    }
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
          <Text className="text-base text-primary font-medium">{t("common.back")}</Text>
        </TouchableOpacity>

        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground">{isEditing ? t("incomeDetail.editTitle") : t("incomeDetail.title")}</Text>
          <Text className="text-base text-muted mt-1">{isEditing ? t("incomeDetail.subtitle") : income.name}</Text>
        </View>

        {!isEditing ? (
          <View className="gap-4">
            <View className="bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-sm text-muted mb-1">{t("incomeDetail.amount")}</Text>
              <Text className="text-2xl font-bold text-success">{formatCurrency(income.amount, state.settings.currency)}</Text>
            </View>
            <View className="bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-sm text-muted mb-1">{t("incomeDetail.type")}</Text>
              <Text className="text-base text-foreground">{INCOME_TYPE_NAMES[income.type]}</Text>
            </View>
            <View className="bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-sm text-muted mb-1">{t("incomeDetail.date")}</Text>
              <Text className="text-base text-foreground">{new Date(income.date).toLocaleDateString(i18n.language === "tr" ? "tr-TR" : "en-US")}</Text>
            </View>
            {income.notes && (
              <View className="bg-surface rounded-2xl p-4 border border-border">
                <Text className="text-sm text-muted mb-1">{t("incomeDetail.notes")}</Text>
                <Text className="text-base text-foreground">{income.notes}</Text>
              </View>
            )}
            <View className="flex-row gap-3 mt-4">
              <TouchableOpacity className="flex-1 bg-surface border border-border rounded-2xl p-4 items-center" onPress={() => setIsEditing(true)}>
                <Text className="text-foreground font-semibold">{t("incomeDetail.edit")}</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 bg-error rounded-2xl p-4 items-center" onPress={handleDelete}>
                <Text className="text-background font-semibold">{t("incomeDetail.delete")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View>
            <TextInputField label={t("incomeDetail.name")} value={name} onChangeText={setName} error={errors.name} required />
            <TextInputField label={t("incomeDetail.amount")} value={amount} onChangeText={setAmount} keyboardType="numeric" error={errors.amount} required />
            <PickerField label={t("incomeDetail.type")} value={type} onChange={(value) => setType(value as IncomeType)} options={typeOptions} required />
            <DatePickerField label={t("incomeDetail.date")} value={date} onChange={setDate} required />
            <TextInputField label={t("incomeDetail.notes")} value={notes} onChangeText={setNotes} multiline />
            <SwitchField label={t("incomeDetail.recurringIncome")} value={hasRecurrence} onChange={setHasRecurrence} />
            {hasRecurrence && (
              <View className="ml-4 mb-4">
                <PickerField label={t("incomeDetail.frequency")} value={recurrenceFrequency} onChange={(value) => setRecurrenceFrequency(value as RecurrenceFrequency)} options={recurrenceOptions} required />
              </View>
            )}
            <View className="flex-row gap-3 mt-6">
              <TouchableOpacity className="flex-1 bg-surface border border-border rounded-2xl p-4 items-center" onPress={() => setIsEditing(false)}>
                <Text className="text-foreground font-semibold">{t("incomeDetail.cancel")}</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 bg-success rounded-2xl p-4 items-center" onPress={handleSave}>
                <Text className="text-background font-semibold">{t("incomeDetail.save")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
