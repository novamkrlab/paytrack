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
import { useTranslation } from "react-i18next";

export default function AddIncomeScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { addIncome } = useApp();

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<IncomeType>(IncomeType.REGULAR);
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [hasRecurrence, setHasRecurrence] = useState(false);
  const [recurrenceFrequency, setRecurrenceFrequency] = useState<RecurrenceFrequency>(RecurrenceFrequency.MONTHLY);
  const [isInfinite, setIsInfinite] = useState(true); // Süresiz tekrar
  const [repeatCount, setRepeatCount] = useState(""); // Kaç kez tekrarlanacak
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const handleSubmit = async () => {
    if (!validate()) return;
    const income = {
      name: name.trim(),
      amount: Number(amount),
      type,
      date: date.toISOString(),
      notes: notes.trim() || undefined,
      recurrence: hasRecurrence
        ? {
            frequency: recurrenceFrequency,
            nextDate: date.toISOString().split("T")[0], // İlk tekrar tarihi
            repeatCount: isInfinite ? undefined : Number(repeatCount) || undefined,
          }
        : undefined,
    };
    await addIncome(income);
    Alert.alert(t("incomeDetail.success"), t("incomeDetail.addTitle"), [{ text: t("incomeDetail.ok"), onPress: () => router.back() }]);
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
          <Text className="text-3xl font-bold text-foreground">{t("incomeDetail.addTitle")}</Text>
          <Text className="text-base text-muted mt-1">{t("incomeDetail.subtitle")}</Text>
        </View>
        <TextInputField label={t("incomeDetail.name")} value={name} onChangeText={setName} placeholder={t("incomeDetail.name")} error={errors.name} required />
        <TextInputField label={t("incomeDetail.amount")} value={amount} onChangeText={setAmount} placeholder="0.00" keyboardType="numeric" error={errors.amount} required />
        <PickerField label={t("incomeDetail.type")} value={type} onChange={(value) => setType(value as IncomeType)} options={typeOptions} required />
        <DatePickerField label={t("incomeDetail.date")} value={date} onChange={setDate} required />
        <TextInputField label={t("incomeDetail.notes")} value={notes} onChangeText={setNotes} placeholder={t("incomeDetail.notes")} multiline />
        <SwitchField label={t("incomeDetail.recurringIncome")} value={hasRecurrence} onChange={setHasRecurrence} />
        {hasRecurrence && (
          <View className="ml-4 mb-4">
            <PickerField
              label={t("incomeDetail.frequency")}
              value={recurrenceFrequency}
              onChange={(value) => setRecurrenceFrequency(value as RecurrenceFrequency)}
              options={recurrenceOptions}
              required
            />
            <SwitchField
              label={t("incomeDetail.infiniteRepeat")}
              value={isInfinite}
              onChange={setIsInfinite}
            />
            {!isInfinite && (
              <TextInputField
                label={t("incomeDetail.repeatCount")}
                value={repeatCount}
                onChangeText={setRepeatCount}
                placeholder="12"
                keyboardType="numeric"
              />
            )}
          </View>
        )}
        <View className="flex-row gap-3 mt-6">
          <TouchableOpacity className="flex-1 bg-surface border border-border rounded-2xl p-4 items-center active:opacity-80" onPress={() => router.back()}>
            <Text className="text-foreground font-semibold text-base">{t("incomeDetail.cancel")}</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-success rounded-2xl p-4 items-center active:opacity-80" onPress={handleSubmit}>
            <Text className="text-background font-semibold text-base">{t("common.add")}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
