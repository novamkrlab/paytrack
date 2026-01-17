/**
 * Uygulama Context ve Reducer
 * Tüm ödeme ve gelir verilerini yöneten global state
 */

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { scheduleAllPaymentNotifications, cancelAllNotifications } from "@/lib/notifications";
import { onPaymentChanged } from "@/services/budget-notification";
import { checkAndGenerateRecurringIncomes } from "@/services/recurring-income-service";
import i18n from "@/i18n";
import {
  AppState,
  Payment,
  Income,
  AppSettings,
  DEFAULT_SETTINGS,
  PaymentStatus,
} from "@/types";
import type { Category } from "@/types/category";
import { loadCategories } from "@/services/category-service";

// AsyncStorage anahtarları
const STORAGE_KEYS = {
  PAYMENTS: "@odeme_takibi:payments",
  INCOMES: "@odeme_takibi:incomes",
  EXPENSES: "@odeme_takibi:expenses",
  SETTINGS: "@odeme_takibi:settings",
  CATEGORIES: "@categories",
};

// Action tipleri
import type { Expense } from "@/types/expense";

type AppAction =
  | { type: "SET_PAYMENTS"; payload: Payment[] }
  | { type: "ADD_PAYMENT"; payload: Payment }
  | { type: "UPDATE_PAYMENT"; payload: Payment }
  | { type: "DELETE_PAYMENT"; payload: string }
  | { type: "SET_INCOMES"; payload: Income[] }
  | { type: "ADD_INCOME"; payload: Income }
  | { type: "UPDATE_INCOME"; payload: Income }
  | { type: "DELETE_INCOME"; payload: string }
  | { type: "SET_EXPENSES"; payload: Expense[] }
  | { type: "ADD_EXPENSE"; payload: Expense }
  | { type: "UPDATE_EXPENSE"; payload: Expense }
  | { type: "DELETE_EXPENSE"; payload: string }
  | { type: "SET_CATEGORIES"; payload: Category[] }
  | { type: "UPDATE_SETTINGS"; payload: Partial<AppSettings> }
  | { type: "RESET_ALL" };

// Başlangıç durumu
const initialState: AppState = {
  payments: [],
  incomes: [],
  expenses: [],
  categories: [],
  settings: DEFAULT_SETTINGS,
};

// Reducer fonksiyonu
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_PAYMENTS":
      return { ...state, payments: action.payload };

    case "ADD_PAYMENT":
      return { ...state, payments: [...state.payments, action.payload] };

    case "UPDATE_PAYMENT":
      return {
        ...state,
        payments: state.payments.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
      };

    case "DELETE_PAYMENT":
      return {
        ...state,
        payments: state.payments.filter((p) => p.id !== action.payload),
      };

    case "SET_INCOMES":
      return { ...state, incomes: action.payload };

    case "ADD_INCOME":
      return { ...state, incomes: [...state.incomes, action.payload] };

    case "UPDATE_INCOME":
      return {
        ...state,
        incomes: state.incomes.map((i) =>
          i.id === action.payload.id ? action.payload : i
        ),
      };

    case "DELETE_INCOME":
      return {
        ...state,
        incomes: state.incomes.filter((i) => i.id !== action.payload),
      };

    case "SET_EXPENSES":
      return { ...state, expenses: action.payload };

    case "ADD_EXPENSE":
      return { ...state, expenses: [...state.expenses, action.payload] };

    case "UPDATE_EXPENSE":
      return {
        ...state,
        expenses: state.expenses.map((e) =>
          e.id === action.payload.id ? action.payload : e
        ),
      };

    case "DELETE_EXPENSE":
      return {
        ...state,
        expenses: state.expenses.filter((e) => e.id !== action.payload),
      };

    case "SET_CATEGORIES":
      return { ...state, categories: action.payload };

    case "UPDATE_SETTINGS":
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };

    case "RESET_ALL":
      return initialState;

    default:
      return state;
  }
}

// Context tipi
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Yardımcı fonksiyonlar
  addPayment: (payment: Omit<Payment, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updatePayment: (payment: Payment) => Promise<void>;
  deletePayment: (id: string) => Promise<void>;
  markPaymentAsPaid: (id: string) => Promise<void>;
  togglePaymentStatus: (id: string) => Promise<void>;
  addIncome: (income: Omit<Income, "id" | "createdAt" | "updatedAt">, futureMonths?: number) => Promise<void>;
  updateIncome: (income: Income) => Promise<void>;
  deleteIncome: (id: string) => Promise<void>;
  addExpense: (expense: Omit<Expense, "id" | "createdAt" | "updatedAt" | "type">) => Promise<void>;
  updateExpense: (expense: Expense) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  updateSettings: (settings: Partial<AppSettings>) => Promise<void>;
  resetAllData: () => Promise<void>;
  // Veri yedekleme/geri yükleme
  exportData: () => Promise<{ success: boolean; message: string }>;
  importData: (replaceExisting: boolean) => Promise<{ success: boolean; message: string }>;
}

// Context oluşturma
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider bileşeni
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Uygulama başlangıcında verileri yükle
  useEffect(() => {
    loadData();
    // Geciken ödemeleri kontrol et
    checkOverduePaymentsOnStartup();
  }, []);

  // Geciken ödemeleri kontrol et
  const checkOverduePaymentsOnStartup = async () => {
    try {
      const { checkOverduePayments } = await import("@/services/smart-notifications");
      await checkOverduePayments(state.payments);
    } catch (error) {
      console.error("Geciken ödeme kontrol hatası:", error);
    }
  };

  // Ödemeler veya ayarlar değiştiğinde bildirimleri güncelle
  useEffect(() => {
    if (state.settings.notificationsEnabled) {
      scheduleAllPaymentNotifications(
        state.payments,
        state.settings.notificationDaysBefore
      );
    } else {
      cancelAllNotifications();
    }
  }, [state.payments, state.settings.notificationsEnabled, state.settings.notificationDaysBefore]);

  // Verileri AsyncStorage'dan yükle
  const loadData = async () => {
    try {
      const [paymentsJson, incomesJson, expensesJson, settingsJson, categoriesData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.PAYMENTS),
        AsyncStorage.getItem(STORAGE_KEYS.INCOMES),
        AsyncStorage.getItem(STORAGE_KEYS.EXPENSES),
        AsyncStorage.getItem(STORAGE_KEYS.SETTINGS),
        loadCategories(), // Kategorileri yükle
      ]);

      if (paymentsJson) {
        const payments: Payment[] = JSON.parse(paymentsJson);
        // Ödeme durumlarını güncelle (gecikmiş ödemeleri işaretle)
        const updatedPayments = payments.map(updatePaymentStatus);
        dispatch({ type: "SET_PAYMENTS", payload: updatedPayments });
      }

      if (incomesJson) {
        const incomes: Income[] = JSON.parse(incomesJson);
        dispatch({ type: "SET_INCOMES", payload: incomes });
        
        // Tekrarlayan gelirleri kontrol et ve otomatik oluştur
        const { newIncomes, updatedIncomes } = await (async () => {
          const { processRecurringIncomes } = await import("@/services/recurring-income-service");
          return processRecurringIncomes(incomes);
        })();

        // Yeni gelirleri ve güncellenmiş gelirleri birleştir
        if (newIncomes.length > 0 || updatedIncomes.length > 0) {
          const allIncomes = [...incomes];
          
          // Güncellenmiş gelirleri uygula
          updatedIncomes.forEach((updated) => {
            const index = allIncomes.findIndex((i) => i.id === updated.id);
            if (index !== -1) {
              allIncomes[index] = updated;
            }
          });
          
          // Yeni gelirleri ekle
          allIncomes.push(...newIncomes);
          
          // State'i güncelle
          dispatch({ type: "SET_INCOMES", payload: allIncomes });
          
          // AsyncStorage'a kaydet
          await AsyncStorage.setItem(STORAGE_KEYS.INCOMES, JSON.stringify(allIncomes));
          
          console.log(`✅ ${newIncomes.length} yeni tekrarlayan gelir oluşturuldu`);
        }
      }

      if (expensesJson) {
        const expenses: Expense[] = JSON.parse(expensesJson);
        dispatch({ type: "SET_EXPENSES", payload: expenses });
      }

      if (settingsJson) {
        const settings: AppSettings = JSON.parse(settingsJson);
        dispatch({ type: "UPDATE_SETTINGS", payload: settings });
      }

      // Kategorileri yükle
      if (categoriesData && categoriesData.length > 0) {
        dispatch({ type: "SET_CATEGORIES", payload: categoriesData });
      }
    } catch (error) {
      console.error("Veri yükleme hatası:", error);
    }
  };

  // Ödemeleri kaydet
  const savePayments = async (payments: Payment[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
    } catch (error) {
      console.error("Ödeme kaydetme hatası:", error);
    }
  };

  // Gelirleri kaydet
  const saveIncomes = async (incomes: Income[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.INCOMES, JSON.stringify(incomes));
    } catch (error) {
      console.error("Gelir kaydetme hatası:", error);
    }
  };

  // Harcamaları kaydet
  const saveExpenses = async (expenses: Expense[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    } catch (error) {
      console.error("Harcama kaydetme hatası:", error);
    }
  };

  // Ayarları kaydet
  const saveSettings = async (settings: AppSettings) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error("Ayar kaydetme hatası:", error);
    }
  };

  // Ödeme durumunu güncelle (gecikmiş kontrolü)
  const updatePaymentStatus = (payment: Payment): Payment => {
    if (payment.isPaid) {
      return { ...payment, status: PaymentStatus.PAID };
    }
    const today = new Date();
    const dueDate = new Date(payment.dueDate);
    if (dueDate < today) {
      return { ...payment, status: PaymentStatus.OVERDUE };
    }
    return { ...payment, status: PaymentStatus.PENDING };
  };

  // Ödeme ekleme
  const addPayment = async (
    paymentData: Omit<Payment, "id" | "createdAt" | "updatedAt">
  ) => {
    const now = new Date().toISOString();
    const newPayment: Payment = {
      ...paymentData,
      id: `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
      updatedAt: now,
    };
    const updatedPayment = updatePaymentStatus(newPayment);
    dispatch({ type: "ADD_PAYMENT", payload: updatedPayment });
    const newPayments = [...state.payments, updatedPayment];
    await savePayments(newPayments);
    // Bütçe kontrolü
    await onPaymentChanged(newPayments, i18n.language);
    // Akıllı bildirim planla
    try {
      const { schedulePaymentReminder } = await import("@/services/smart-notifications");
      await schedulePaymentReminder(updatedPayment);
    } catch (error) {
      console.error("Bildirim planlama hatası:", error);
    }
  };

  // Ödeme güncelleme
  const updatePayment = async (payment: Payment) => {
    const updatedPayment = {
      ...payment,
      updatedAt: new Date().toISOString(),
    };
    const finalPayment = updatePaymentStatus(updatedPayment);
    dispatch({ type: "UPDATE_PAYMENT", payload: finalPayment });
    const updatedPayments = state.payments.map((p) =>
      p.id === finalPayment.id ? finalPayment : p
    );
    await savePayments(updatedPayments);
    // Bütçe kontrolü
    await onPaymentChanged(updatedPayments, i18n.language);
  };

  // Ödeme silme
  const deletePayment = async (id: string) => {
    dispatch({ type: "DELETE_PAYMENT", payload: id });
    const updatedPayments = state.payments.filter((p) => p.id !== id);
    await savePayments(updatedPayments);
  };

  // Ödeme ödendi işaretleme
  const markPaymentAsPaid = async (id: string) => {
    const payment = state.payments.find((p) => p.id === id);
    if (payment) {
      const updatedPayment: Payment = {
        ...payment,
        isPaid: true,
        status: PaymentStatus.PAID,
        updatedAt: new Date().toISOString(),
      };
      dispatch({ type: "UPDATE_PAYMENT", payload: updatedPayment });
      const updatedPayments = state.payments.map((p) =>
        p.id === id ? updatedPayment : p
      );
      await savePayments(updatedPayments);
      // Başarı bildirimi gönder
      try {
        const { sendPaymentSuccessNotification } = await import("@/services/smart-notifications");
        await sendPaymentSuccessNotification(updatedPayment);
      } catch (error) {
        console.error("Başarı bildirimi hatası:", error);
      }
    }
  };

  // Gelir ekleme
  const addIncome = async (incomeData: Omit<Income, "id" | "createdAt" | "updatedAt">, futureMonths?: number) => {
    const now = new Date().toISOString();
    const newIncome: Income = {
      ...incomeData,
      id: `income_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
      updatedAt: now,
    };
    
    const updatedIncomes = [...state.incomes, newIncome];
    dispatch({ type: "ADD_INCOME", payload: newIncome });
    await saveIncomes(updatedIncomes);
    
    // Eğer tekrarlayan gelirse, nextDate'i bir sonraki döneme güncelle
    if (newIncome.recurrence && newIncome.recurrence.frequency !== "none") {
      const { calculateNextIncomeDate, createRecurringIncomeInstance } = await import("@/utils/recurring-income-helpers");
      
      let allIncomes = [...updatedIncomes];
      
      // Eğer futureMonths belirtilmişse, gelecek aylar için gelirleri oluştur
      if (futureMonths && futureMonths > 0) {
        const futureIncomes: Income[] = [];
        // Bir sonraki aydan başlat (ilk gelir zaten mevcut)
        let currentDate = calculateNextIncomeDate(
          newIncome.recurrence.nextDate!,
          newIncome.recurrence.frequency
        );
        
        for (let i = 0; i < futureMonths; i++) {
          const futureIncome = createRecurringIncomeInstance(newIncome, currentDate);
          futureIncomes.push(futureIncome);
          currentDate = calculateNextIncomeDate(currentDate, newIncome.recurrence.frequency);
        }
        
        // Orijinal gelirin nextDate'ini son oluşturulan gelirden sonraya güncelle
        newIncome.recurrence.nextDate = currentDate;
        
        // Tüm gelirleri ekle
        allIncomes = allIncomes.map((i) => i.id === newIncome.id ? newIncome : i);
        allIncomes.push(...futureIncomes);
        
        console.log(`✅ Tekrarlayan gelir eklendi + ${futureMonths} aylık gelir oluşturuldu`);
      } else {
        // Sadece nextDate'i bir sonraki döneme güncelle (duplike oluşmaması için)
        const nextDate = calculateNextIncomeDate(
          newIncome.recurrence.nextDate!,
          newIncome.recurrence.frequency
        );
        
        newIncome.recurrence.nextDate = nextDate;
        allIncomes = allIncomes.map((i) => i.id === newIncome.id ? newIncome : i);
        
        console.log(`✅ Tekrarlayan gelir eklendi, bir sonraki tarih: ${nextDate}`);
      }
      
      dispatch({ type: "SET_INCOMES", payload: allIncomes });
      await saveIncomes(allIncomes);
    }
  };

  // Gelir güncelleme
  const updateIncome = async (income: Income) => {
    const updatedIncome = {
      ...income,
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: "UPDATE_INCOME", payload: updatedIncome });
    const updatedIncomes = state.incomes.map((i) =>
      i.id === updatedIncome.id ? updatedIncome : i
    );
    await saveIncomes(updatedIncomes);
  };

  // Gelir silme
  const deleteIncome = async (id: string) => {
    dispatch({ type: "DELETE_INCOME", payload: id });
    const updatedIncomes = state.incomes.filter((i) => i.id !== id);
    await saveIncomes(updatedIncomes);
  };

  // Harcama ekleme
  const addExpense = async (
    expenseData: Omit<Expense, "id" | "createdAt" | "updatedAt" | "type">
  ) => {
    const now = new Date().toISOString();
    const { getExpenseType } = await import("@/types/expense");
    const newExpense: Expense = {
      ...expenseData,
      id: `expense_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: getExpenseType(expenseData.category),
      createdAt: now,
      updatedAt: now,
    };
    dispatch({ type: "ADD_EXPENSE", payload: newExpense });
    await saveExpenses([...state.expenses, newExpense]);
  };

  // Harcama güncelleme
  const updateExpense = async (expense: Expense) => {
    const updatedExpense = {
      ...expense,
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: "UPDATE_EXPENSE", payload: updatedExpense });
    const updatedExpenses = state.expenses.map((e) =>
      e.id === updatedExpense.id ? updatedExpense : e
    );
    await saveExpenses(updatedExpenses);
  };

  // Harcama silme
  const deleteExpense = async (id: string) => {
    dispatch({ type: "DELETE_EXPENSE", payload: id });
    const updatedExpenses = state.expenses.filter((e) => e.id !== id);
    await saveExpenses(updatedExpenses);
  };

  // Ayarları güncelleme
  const updateSettings = async (settingsUpdate: Partial<AppSettings>) => {
    const newSettings = { ...state.settings, ...settingsUpdate };
    dispatch({ type: "UPDATE_SETTINGS", payload: settingsUpdate });
    await saveSettings(newSettings);
  };

  // Ödeme durumunu toggle etme
  const togglePaymentStatus = async (id: string) => {
    const payment = state.payments.find((p) => p.id === id);
    if (!payment) return;
    const updatedPayment = {
      ...payment,
      isPaid: !payment.isPaid,
      updatedAt: new Date().toISOString(),
    };
    const finalPayment = updatePaymentStatus(updatedPayment);
    dispatch({ type: "UPDATE_PAYMENT", payload: finalPayment });
    const updatedPayments = state.payments.map((p) =>
      p.id === finalPayment.id ? finalPayment : p
    );
    await savePayments(updatedPayments);
    // Bütçe kontrolü
    await onPaymentChanged(updatedPayments, i18n.language);
  };

  // Tüm verileri sıfırlama
  const resetAllData = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.PAYMENTS),
        AsyncStorage.removeItem(STORAGE_KEYS.INCOMES),
        AsyncStorage.removeItem(STORAGE_KEYS.SETTINGS),
      ]);
      dispatch({ type: "RESET_ALL" });
    } catch (error) {
      console.error("Reset error:", error);
    }
  };

  // Verileri dışa aktar
  const exportData = async (): Promise<{ success: boolean; message: string }> => {
    try {
      const { exportData: exportDataFn } = await import("@/services/data-backup");
      return await exportDataFn(state.payments, state.incomes, state.settings);
    } catch (error) {
      console.error("Export error:", error);
      return {
        success: false,
        message: `Dışa aktarma hatası: ${error instanceof Error ? error.message : "Bilinmeyen hata"}`,
      };
    }
  };

  // Verileri içe aktar
  const importData = async (replaceExisting: boolean): Promise<{ success: boolean; message: string }> => {
    try {
      const { importData: importDataFn, mergeData } = await import("@/services/data-backup");
      const result = await importDataFn();

      if (!result.success || !result.data) {
        return result;
      }

      // Verileri birleştir veya değiştir
      const { payments, incomes } = mergeData(
        state.payments,
        state.incomes,
        result.data.payments,
        result.data.incomes,
        replaceExisting
      );

      // State'ı güncelle
      dispatch({ type: "SET_PAYMENTS", payload: payments });
      dispatch({ type: "SET_INCOMES", payload: incomes });

      // AsyncStorage'a kaydet
      await savePayments(payments);
      await saveIncomes(incomes);

      // Bildirimleri yeniden zamanla
      await scheduleAllPaymentNotifications(payments);

      return {
        success: true,
        message: `${result.data.payments.length} ödeme ve ${result.data.incomes.length} gelir başarıyla içe aktarıldı`,
      };
    } catch (error) {
      console.error("Import error:", error);
      return {
        success: false,
        message: `İçe aktarma hatası: ${error instanceof Error ? error.message : "Bilinmeyen hata"}`,
      };
    }
  };

  const value: AppContextType = {
    state,
    dispatch,
    addPayment,
    updatePayment,
    deletePayment,
    markPaymentAsPaid,
    togglePaymentStatus,
    addIncome,
    updateIncome,
    deleteIncome,
    addExpense,
    updateExpense,
    deleteExpense,
    updateSettings,
    resetAllData,
    exportData,
    importData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Hook: Context kullanımı
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp hook'u AppProvider içinde kullanılmalıdır");
  }
  return context;
}
