/**
 * Test Verileri Ekleme Script'i
 * Geliştirme amaçlı örnek veriler
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Payment,
  Income,
  PaymentCategory,
  IncomeType,
  PaymentStatus,
  RecurrenceFrequency,
} from "../types";

const STORAGE_KEYS = {
  PAYMENTS: "@odeme_takibi:payments",
  INCOMES: "@odeme_takibi:incomes",
};

// Örnek ödemeler
const samplePayments: Payment[] = [
  {
    id: "payment_1",
    name: "Akbank Kredi Kartı",
    amount: 2500,
    category: PaymentCategory.CREDIT_CARD,
    dueDate: new Date(2026, 0, 15).toISOString(), // 15 Ocak 2026
    status: PaymentStatus.PENDING,
    isPaid: false,
    installments: {
      total: 12,
      current: 3,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "payment_2",
    name: "İş Bankası Konut Kredisi",
    amount: 8500,
    category: PaymentCategory.LOAN,
    dueDate: new Date(2026, 0, 20).toISOString(), // 20 Ocak 2026
    status: PaymentStatus.PENDING,
    isPaid: false,
    recurrence: {
      frequency: RecurrenceFrequency.MONTHLY,
    },
    notes: "Konut kredisi taksiti",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "payment_3",
    name: "Elektrik Faturası",
    amount: 450,
    category: PaymentCategory.OTHER,
    dueDate: new Date(2026, 0, 12).toISOString(), // 12 Ocak 2026
    status: PaymentStatus.PENDING,
    isPaid: false,
    recurrence: {
      frequency: RecurrenceFrequency.MONTHLY,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "payment_4",
    name: "İnternet Faturası",
    amount: 350,
    category: PaymentCategory.OTHER,
    dueDate: new Date(2026, 0, 10).toISOString(), // 10 Ocak 2026
    status: PaymentStatus.PENDING,
    isPaid: false,
    recurrence: {
      frequency: RecurrenceFrequency.MONTHLY,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "payment_5",
    name: "Garanti Kredi Kartı",
    amount: 1200,
    category: PaymentCategory.CREDIT_CARD,
    dueDate: new Date(2025, 11, 28).toISOString(), // 28 Aralık 2025 (geçmiş)
    status: PaymentStatus.OVERDUE,
    isPaid: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Örnek gelirler
const sampleIncomes: Income[] = [
  {
    id: "income_1",
    name: "Maaş",
    amount: 25000,
    type: IncomeType.REGULAR,
    date: new Date(2026, 0, 1).toISOString(), // 1 Ocak 2026
    recurrence: {
      frequency: RecurrenceFrequency.MONTHLY,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "income_2",
    name: "Freelance Proje",
    amount: 5000,
    type: IncomeType.IRREGULAR,
    date: new Date(2026, 0, 5).toISOString(), // 5 Ocak 2026
    notes: "Web sitesi geliştirme projesi",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "income_3",
    name: "Kira Geliri",
    amount: 8000,
    type: IncomeType.REGULAR,
    date: new Date(2026, 0, 1).toISOString(), // 1 Ocak 2026
    recurrence: {
      frequency: RecurrenceFrequency.MONTHLY,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function seedData() {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(samplePayments));
    await AsyncStorage.setItem(STORAGE_KEYS.INCOMES, JSON.stringify(sampleIncomes));
    console.log("✅ Test verileri başarıyla eklendi!");
  } catch (error) {
    console.error("❌ Test verileri eklenirken hata:", error);
  }
}

export async function clearData() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.PAYMENTS);
    await AsyncStorage.removeItem(STORAGE_KEYS.INCOMES);
    console.log("✅ Tüm veriler temizlendi!");
  } catch (error) {
    console.error("❌ Veriler temizlenirken hata:", error);
  }
}
