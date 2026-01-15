/**
 * Ödeme Detay Ekranı
 */

import { ScrollView, Text, View, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { TextInputField, DatePickerField, PickerField, SwitchField } from "@/components/form-input";
import { calculatePeriodCount, calculateTotalAmount } from "@/utils/date-helpers";
import { generateInstallments, generateRecurringPayments } from "@/utils/installment-helpers";
import { useApp } from "@/lib/app-context";
import {
  PaymentCategory,
  RecurrenceFrequency,
  CATEGORY_NAMES,
  STATUS_NAMES,
} from "@/types";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "@/utils/currency-helpers";

export default function PaymentDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t, i18n } = useTranslation();
  const { state, addPayment, updatePayment, deletePayment, togglePaymentStatus } = useApp();
  
  const payment = state.payments.find((p) => p.id === params.id);
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState(payment?.name || "");
  const [amount, setAmount] = useState(payment?.amount.toString() || "");
  const [category, setCategory] = useState<PaymentCategory>(payment?.category || PaymentCategory.OTHER);
  const [dueDate, setDueDate] = useState(payment?.dueDate ? new Date(payment.dueDate) : new Date());
  const [notes, setNotes] = useState(payment?.notes || "");
  const [hasInstallments, setHasInstallments] = useState(!!payment?.installments);
  const [installmentTotal, setInstallmentTotal] = useState(payment?.installments?.total.toString() || "");
  const [installmentCurrent, setInstallmentCurrent] = useState(payment?.installments?.current.toString() || "");
  const [installmentEndDate, setInstallmentEndDate] = useState<Date | null>(
    payment?.installments?.endDate ? new Date(payment.installments.endDate) : null
  );
  const [hasRecurrence, setHasRecurrence] = useState(!!payment?.recurrence);
  const [recurrenceFrequency, setRecurrenceFrequency] = useState<RecurrenceFrequency>(
    payment?.recurrence?.frequency || RecurrenceFrequency.MONTHLY
  );
  const [recurrenceEndDate, setRecurrenceEndDate] = useState<Date | null>(
    payment?.recurrence?.endDate ? new Date(payment.recurrence.endDate) : null
  );
  const [autoGenerateInstallments, setAutoGenerateInstallments] = useState(false);
  const [autoGenerateRecurrence, setAutoGenerateRecurrence] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!payment) {
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center p-6">
          <Text className="text-xl text-foreground">{t("paymentDetail.notFound")}</Text>
          <TouchableOpacity
            className="mt-4 bg-primary rounded-2xl px-6 py-3"
            onPress={() => router.back()}
          >
            <Text className="text-background font-semibold">{t("paymentDetail.goBack")}</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  const categoryOptions = [
    { label: t("categories.creditCard"), value: PaymentCategory.CREDIT_CARD },
    { label: t("categories.loan"), value: PaymentCategory.LOAN },
    { label: t("categories.other"), value: PaymentCategory.OTHER },
  ];

  const recurrenceOptions = [
    { label: t("recurrence.daily"), value: RecurrenceFrequency.DAILY },
    { label: t("recurrence.weekly"), value: RecurrenceFrequency.WEEKLY },
    { label: t("recurrence.monthly"), value: RecurrenceFrequency.MONTHLY },
    { label: t("recurrence.yearly"), value: RecurrenceFrequency.YEARLY },
  ];

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = t("paymentDetail.nameRequired");
    if (!amount.trim()) newErrors.amount = t("paymentDetail.amountRequired");
    else if (isNaN(Number(amount)) || Number(amount) <= 0) newErrors.amount = t("paymentDetail.validAmount");
    if (hasInstallments) {
      if (!installmentTotal.trim() || isNaN(Number(installmentTotal)) || Number(installmentTotal) <= 0)
        newErrors.installmentTotal = t("paymentDetail.validNumber");
      if (!installmentCurrent.trim() || isNaN(Number(installmentCurrent)) || Number(installmentCurrent) <= 0)
        newErrors.installmentCurrent = t("paymentDetail.validNumber");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    // Otomatik tekrarlanan ödeme oluşturma aktifse
    if (hasRecurrence && autoGenerateRecurrence && recurrenceEndDate) {
      const recurringPayments = generateRecurringPayments(
        name.trim(),
        Number(amount),
        category,
        dueDate,
        recurrenceEndDate,
        recurrenceFrequency,
        notes.trim() || undefined
      );

      // Mevcut ödemeyi sil (çünkü yeni ödemeler zaten ilk ödemeyi içeriyor)
      await deletePayment(payment.id);

      // Tüm tekrarlanan ödemeleri ekle
      for (const newPayment of recurringPayments) {
        await addPayment({ ...newPayment, autoGenerated: true });
      }

      Alert.alert(
        t("paymentDetail.success"),
        t("paymentDetail.recurringCreated", { count: recurringPayments.length }),
        [{ text: t("paymentDetail.ok"), onPress: () => router.back() }]
      );
      return;
    }

    // Otomatik taksit oluşturma aktifse
    if (hasInstallments && autoGenerateInstallments) {
      const installments = generateInstallments(
        name.trim(),
        Number(amount),
        category,
        dueDate,
        Number(installmentTotal),
        notes.trim() || undefined
      );

      // Mevcut ödemeyi sil (çünkü yeni taksitler zaten ilk taksiti içeriyor)
      await deletePayment(payment.id);

      // Tüm taksitleri ekle
      for (const installment of installments) {
        await addPayment({ ...installment, autoGenerated: true });
      }

      Alert.alert(
        t("paymentDetail.success"),
        t("paymentDetail.installmentsCreated", { count: installments.length }),
        [{ text: t("paymentDetail.ok"), onPress: () => router.back() }]
      );
      return;
    }

    // Normal güncelleme
    const updatedPayment = {
      ...payment,
      name: name.trim(),
      amount: Number(amount),
      category,
      dueDate: dueDate.toISOString(),
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
    await updatePayment(updatedPayment);
    setIsEditing(false);
    Alert.alert(t("paymentDetail.success"), t("paymentDetail.updated"));
  };

  const handleDelete = () => {
    // Base name'ı çıkar (parantez içindeki numara veya taksit bilgisini kaldır)
    const getBaseName = (name: string) => {
      // "Deneme1 (2)" -> "Deneme1" veya "Deneme 2/12" -> "Deneme"
      return name.replace(/ \(\d+\)$/, '').replace(/ \d+\/\d+$/, '');
    };
    
    const baseName = getBaseName(payment.name);
    
    // Aynı base name'e sahip diğer ödemeleri bul (tekrarlar)
    const relatedPayments = state.payments.filter(
      (p) => getBaseName(p.name) === baseName && p.id !== payment.id
    );

    if (relatedPayments.length > 0) {
      // Taksitli ödeme mi kontrol et ("Deneme 2/12" formatı)
      const isInstallment = payment.installments && payment.installments.current && payment.installments.total;
      // Tekrarlanan ödeme mi kontrol et ("Deneme (2)" formatı - parantez içinde numara)
      const hasNumberInParentheses = /\(\d+\)$/.test(payment.name);
      
      // Eğer taksitli ödeme ise, bundan sonraki taksitleri bul
      let futurePayments: typeof state.payments = [];
      if (isInstallment) {
        const currentInstallment = payment.installments!.current;
        const baseName = payment.name.replace(/ \d+\/\d+$/, ''); // "Deneme 2/12" -> "Deneme"
        
        futurePayments = state.payments.filter((p) => {
          if (!p.installments || p.id === payment.id) return false;
          const pBaseName = p.name.replace(/ \d+\/\d+$/, '');
          return pBaseName === baseName && p.installments.current > currentInstallment;
        });
      } else if (hasNumberInParentheses) {
        // Tekrarlanan ödeme için numaraya göre gelecek ödemeleri bul
        const numberMatch = payment.name.match(/\((\d+)\)$/);
        if (numberMatch) {
          const currentNumber = parseInt(numberMatch[1]);
          const baseName = payment.name.replace(/ \(\d+\)$/, ''); // "Deneme (2)" -> "Deneme"
          
          futurePayments = state.payments.filter((p) => {
            if (p.id === payment.id) return false;
            const pNumberMatch = p.name.match(/\((\d+)\)$/);
            if (!pNumberMatch) return false;
            const pNumber = parseInt(pNumberMatch[1]);
            const pBaseName = p.name.replace(/ \(\d+\)$/, '');
            return pBaseName === baseName && pNumber > currentNumber;
          });
        }
      }

      // Seçenekleri hazırla
      const buttons: any[] = [
        { text: t("paymentDetail.cancel"), style: "cancel" },
        {
          text: t("paymentDetail.deleteOnlyThis"),
          onPress: async () => {
            await deletePayment(payment.id);
            router.back();
          },
        },
      ];

      // Eğer taksitli ödeme veya tekrarlanan ödeme ve gelecek ödemeler varsa, "Bundan sonrakini sil" seçeneği ekle
      if ((isInstallment || hasNumberInParentheses) && futurePayments.length > 0) {
        buttons.push({
          text: `Bundan sonrakini sil (${futurePayments.length + 1})`,
          style: "destructive",
          onPress: async () => {
            // Bu ödemeyi ve gelecek taksitleri sil
            await deletePayment(payment.id);
            for (const futurePayment of futurePayments) {
              await deletePayment(futurePayment.id);
            }
            Alert.alert(t("paymentDetail.success"), t("paymentDetail.deleted", { count: futurePayments.length + 1 }));
            router.back();
          },
        });
      }

      // "Tümünü sil" seçeneği
      buttons.push({
        text: `Tümünü sil (${relatedPayments.length + 1})`,
        style: "destructive",
        onPress: async () => {
          // Bu ödemeyi ve tüm tekrarları sil
          await deletePayment(payment.id);
          for (const relatedPayment of relatedPayments) {
            await deletePayment(relatedPayment.id);
          }
          Alert.alert(t("paymentDetail.success"), t("paymentDetail.deleted", { count: relatedPayments.length + 1 }));
          router.back();
        },
      });

      // Tekrarlar varsa, seçenek sun
      Alert.alert(
        t("paymentDetail.deleteTitle"),
        t("paymentDetail.deleteMultipleMessage", { count: relatedPayments.length }),
        buttons
      );
    } else {
      // Tekrar yoksa, normal silme
      Alert.alert(
        t("paymentDetail.deleteTitle"),
        t("paymentDetail.deleteMessage"),
        [
          { text: t("paymentDetail.cancel"), style: "cancel" },
          {
            text: t("paymentDetail.delete"),
            style: "destructive",
            onPress: async () => {
              await deletePayment(payment.id);
              router.back();
            },
          },
        ]
      );
    }
  };

  const handleTogglePaid = async () => {
    await togglePaymentStatus(payment.id);
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
          <Text className="text-3xl font-bold text-foreground">{isEditing ? t("paymentDetail.editTitle") : t("paymentDetail.title")}</Text>
          <Text className="text-base text-muted mt-1">{isEditing ? t("paymentDetail.subtitle") : payment.name}</Text>
        </View>

        {!isEditing ? (
          <View className="gap-4">
            <View className="bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-sm text-muted mb-1">{t("paymentDetail.amount")}</Text>
              <Text className="text-2xl font-bold text-foreground">{formatCurrency(payment.amount, state.settings.currency)}</Text>
            </View>
            <View className="bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-sm text-muted mb-1">{t("paymentDetail.category")}</Text>
              <Text className="text-base text-foreground">{CATEGORY_NAMES[payment.category]}</Text>
            </View>
            <View className="bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-sm text-muted mb-1">{t("paymentDetail.paymentDate")}</Text>
              <Text className="text-base text-foreground">{new Date(payment.dueDate).toLocaleDateString(i18n.language === "tr" ? "tr-TR" : "en-US")}</Text>
            </View>
            <View className="bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-sm text-muted mb-1">{t("paymentDetail.status")}</Text>
              <Text className="text-base text-foreground">{STATUS_NAMES[payment.status]}</Text>
            </View>
            {payment.installments && (
              <View className="bg-surface rounded-2xl p-4 border border-border">
                <Text className="text-sm text-muted mb-1">{t("paymentDetail.installment")}</Text>
                <Text className="text-base text-foreground">{payment.installments.current} / {payment.installments.total}</Text>
                {payment.installments.endDate && (
                  <Text className="text-sm text-muted mt-1">
                    {t("paymentDetail.lastInstallment")}: {new Date(payment.installments.endDate).toLocaleDateString(i18n.language === "tr" ? "tr-TR" : "en-US")}
                  </Text>
                )}
              </View>
            )}
            {payment.notes && (
              <View className="bg-surface rounded-2xl p-4 border border-border">
                <Text className="text-sm text-muted mb-1">{t("paymentDetail.notes")}</Text>
                <Text className="text-base text-foreground">{payment.notes}</Text>
              </View>
            )}
            <View className="flex-row gap-3 mt-4">
              <TouchableOpacity className="flex-1 bg-primary rounded-2xl p-4 items-center" onPress={handleTogglePaid}>
                <Text className="text-background font-semibold">{payment.isPaid ? "Ödenmedi Yap" : "Ödendi Yap"}</Text>
              </TouchableOpacity>
            </View>
            <View className="flex-row gap-3">
              <TouchableOpacity className="flex-1 bg-surface border border-border rounded-2xl p-4 items-center" onPress={() => setIsEditing(true)}>
                <Text className="text-foreground font-semibold">{t("paymentDetail.edit")}</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 bg-error rounded-2xl p-4 items-center" onPress={handleDelete}>
                <Text className="text-background font-semibold">{t("paymentDetail.delete")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View>
            <TextInputField label={t("paymentDetail.name")} value={name} onChangeText={setName} error={errors.name} required />
            <TextInputField label={t("paymentDetail.amount")} value={amount} onChangeText={setAmount} keyboardType="numeric" error={errors.amount} required />
            <PickerField label={t("paymentDetail.category")} value={category} onChange={(value) => setCategory(value as PaymentCategory)} options={categoryOptions} required />
            <DatePickerField label={t("paymentDetail.paymentDate")} value={dueDate} onChange={setDueDate} required />
            <TextInputField label={t("paymentDetail.notes")} value={notes} onChangeText={setNotes} multiline />
            <SwitchField label={t("paymentDetail.installmentPayment")} value={hasInstallments} onChange={setHasInstallments} />
            {hasInstallments && (
              <View className="ml-4 mb-4">
                <SwitchField 
                  label={t("paymentDetail.autoGenerateInstallments")} 
                  value={autoGenerateInstallments || !!payment.autoGenerated} 
                  onChange={setAutoGenerateInstallments} 
                  description={payment.autoGenerated ? t("paymentDetail.willCreateInstallments", { count: Number(installmentTotal) }) : t("paymentDetail.willCreateInstallments", { count: Number(installmentTotal) })} 
                  disabled={payment.autoGenerated}
                />
                <TextInputField label={t("paymentDetail.totalInstallments")} value={installmentTotal} onChangeText={setInstallmentTotal} keyboardType="numeric" error={errors.installmentTotal} required />
                <TextInputField label={t("paymentDetail.currentInstallment")} value={installmentCurrent} onChangeText={setInstallmentCurrent} keyboardType="numeric" error={errors.installmentCurrent} required />
                <DatePickerField label={t("paymentDetail.lastInstallmentDate")} value={installmentEndDate || new Date()} onChange={setInstallmentEndDate} />
                {autoGenerateInstallments && (
                  <View className="mt-2 p-3 bg-surface rounded-lg border border-border">
                    <Text className="text-xs text-muted mb-1">⚠️ {t("paymentDetail.autoGenerateInstallments")}</Text>
                    <Text className="text-sm text-foreground">
                      {t("paymentDetail.willCreateInstallments", { count: Number(installmentTotal) })}
                    </Text>
                  </View>
                )}
              </View>
            )}
            <SwitchField label={t("paymentDetail.recurringPayment")} value={hasRecurrence} onChange={setHasRecurrence} />
            {hasRecurrence && (
              <View className="ml-4 mb-4">
                <SwitchField 
                  label={t("paymentDetail.autoGenerateRecurring")} 
                  value={autoGenerateRecurrence || !!payment.autoGenerated} 
                  onChange={setAutoGenerateRecurrence} 
                  description={payment.autoGenerated ? t("paymentDetail.willCreateRecurring", { count: 0 }) : t("paymentDetail.willCreateRecurring", { count: recurrenceEndDate ? calculatePeriodCount(dueDate, recurrenceEndDate, recurrenceFrequency) : 0 })} 
                  disabled={payment.autoGenerated}
                />
                <PickerField label={t("paymentDetail.frequency")} value={recurrenceFrequency} onChange={(value) => setRecurrenceFrequency(value as RecurrenceFrequency)} options={recurrenceOptions} required />
                <DatePickerField label={t("paymentDetail.lastPaymentDate")} value={recurrenceEndDate || new Date()} onChange={setRecurrenceEndDate} />
                {recurrenceEndDate && amount && (
                  <View className="mt-2 p-3 bg-surface rounded-lg border border-border">
                    <Text className="text-xs text-muted mb-1">{t("paymentDetail.totalAmountCalculation")}</Text>
                    <Text className="text-sm text-foreground">
                      {calculatePeriodCount(dueDate, recurrenceEndDate, recurrenceFrequency)} {t("paymentDetail.periods")} × {formatCurrency(Number(amount), state.settings.currency)} = {' '}
                      <Text className="font-semibold">
                        {formatCurrency(calculateTotalAmount(Number(amount), dueDate, recurrenceEndDate, recurrenceFrequency), state.settings.currency)}
                      </Text>
                    </Text>
                  </View>
                )}
                {autoGenerateRecurrence && recurrenceEndDate && (
                  <View className="mt-2 p-3 bg-surface rounded-lg border border-border">
                    <Text className="text-xs text-muted mb-1">⚠️ {t("paymentDetail.autoGenerateRecurring")}</Text>
                    <Text className="text-sm text-foreground">
                      {t("paymentDetail.willCreateRecurring", { count: calculatePeriodCount(dueDate, recurrenceEndDate, recurrenceFrequency) })}
                    </Text>
                  </View>
                )}
              </View>
            )}
            <View className="flex-row gap-3 mt-6">
              <TouchableOpacity className="flex-1 bg-surface border border-border rounded-2xl p-4 items-center" onPress={() => setIsEditing(false)}>
                <Text className="text-foreground font-semibold">{t("paymentDetail.cancel")}</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 bg-primary rounded-2xl p-4 items-center" onPress={handleSave}>
                <Text className="text-background font-semibold">{t("paymentDetail.save")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
