/**
 * Uygulama Context ve Reducer
 * Tüm ödeme ve gelir verilerini yöneten global state
 */

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { scheduleAllPaymentNotifications, cancelAllNotifications } from "@/lib/notifications";
import {
  AppState,
  Payment,
  Income,
  AppSettings,
  DEFAULT_SETTINGS,
  PaymentStatus,
} from "@/types";

// AsyncStorage anahtarları
const STORAGE_KEYS = {
  PAYMENTS: "@odeme_takibi:payments",
  INCOMES: "@odeme_takibi:incomes",
  SETTINGS: "@odeme_takibi:settings",
};

// Action tipleri
type AppAction =
  | { type: "SET_PAYMENTS"; payload: Payment[] }
  | { type: "ADD_PAYMENT"; payload: Payment }
  | { type: "UPDATE_PAYMENT"; payload: Payment }
  | { type: "DELETE_PAYMENT"; payload: string }
  | { type: "SET_INCOMES"; payload: Income[] }
  | { type: "ADD_INCOME"; payload: Income }
  | { type: "UPDATE_INCOME"; payload: Income }
  | { type: "DELETE_INCOME"; payload: string }
  | { type: "UPDATE_SETTINGS"; payload: Partial<AppSettings> }
  | { type: "RESET_ALL" };

// Başlangıç durumu
const initialState: AppState = {
  payments: [],
  incomes: [],
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
  addIncome: (income: Omit<Income, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateIncome: (income: Income) => Promise<void>;
  deleteIncome: (id: string) => Promise<void>;
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
  }, []);

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
      const [paymentsJson, incomesJson, settingsJson] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.PAYMENTS),
        AsyncStorage.getItem(STORAGE_KEYS.INCOMES),
        AsyncStorage.getItem(STORAGE_KEYS.SETTINGS),
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
      }

      if (settingsJson) {
        const settings: AppSettings = JSON.parse(settingsJson);
        dispatch({ type: "UPDATE_SETTINGS", payload: settings });
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
    await savePayments([...state.payments, updatedPayment]);
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
    }
  };

  // Gelir ekleme
  const addIncome = async (incomeData: Omit<Income, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    const newIncome: Income = {
      ...incomeData,
      id: `income_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
      updatedAt: now,
    };
    dispatch({ type: "ADD_INCOME", payload: newIncome });
    await saveIncomes([...state.incomes, newIncome]);
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
