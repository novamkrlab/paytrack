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
  const [repeatType, setRepeatType] = useState<"infinite" | "count" | "date">("infinite"); // Tekrar tipi
  const [repeatCount, setRepeatCount] = useState(""); // Kaç kez tekrarlanacak
  const [endDate, setEndDate] = useState(new Date()); // Bitiş tarihi
  const [generateFuture, setGenerateFuture] = useState(false); // Gelecek gelirleri şimdi oluştur
  const [futureMonths, setFutureMonths] = useState("6"); // Kaç ay için oluşturulacak
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
            repeatCount: repeatType === "count" ? Number(repeatCount) || undefined : undefined,
            endDate: repeatType === "date" ? endDate.toISOString().split("T")[0] : undefined,
          }
        : undefined,
    };
    await addIncome(income, generateFuture ? Number(futureMonths) : undefined);
    
    const message = generateFuture 
      ? t("incomeDetail.futureGenerated", { count: Number(futureMonths) })
      : t("incomeDetail.addTitle");
    
    Alert.alert(t("incomeDetail.success"), message, [{ text: t("incomeDetail.ok"), onPress: () => router.back() }]);
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
            <PickerField
              label={t("incomeDetail.repeatType")}
              value={repeatType}
              onChange={(value) => setRepeatType(value as "infinite" | "count" | "date")}
              options={[
                { label: t("incomeDetail.infinite"), value: "infinite" },
                { label: t("incomeDetail.count"), value: "count" },
                { label: t("incomeDetail.untilDate"), value: "date" },
              ]}
              required
            />
            {repeatType === "count" && (
              <TextInputField
                label={t("incomeDetail.repeatCount")}
                value={repeatCount}
                onChangeText={setRepeatCount}
                placeholder="12"
                keyboardType="numeric"
              />
            )}
            {repeatType === "date" && (
              <DatePickerField
                label={t("incomeDetail.endDate")}
                value={endDate}
                onChange={setEndDate}
                required
              />
            )}
          </View>
        )}
        
        {/* Gelecek Gelirleri Şimdi Oluştur */}
        {hasRecurrence && (
          <View className="mb-4">
            <SwitchField
              label={t("incomeDetail.generateFuture")}
              value={generateFuture}
              onChange={setGenerateFuture}
            />
            {generateFuture && (
              <View className="mt-4">
                <PickerField
                  label={t("incomeDetail.futureMonths")}
                  value={futureMonths}
                  onChange={setFutureMonths}
                  options={[
                    { label: t("incomeDetail.months", { count: 1 }), value: "1" },
                    { label: t("incomeDetail.months", { count: 3 }), value: "3" },
                    { label: t("incomeDetail.months", { count: 6 }), value: "6" },
                    { label: t("incomeDetail.months", { count: 12 }), value: "12" },
                    { label: t("incomeDetail.months", { count: 24 }), value: "24" },
                  ]}
                  required
                />
              </View>
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
