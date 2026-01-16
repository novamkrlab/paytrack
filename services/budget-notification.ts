/**
 * Bütçe Aşım Bildirim Servisi
 * Bütçe %80'e ulaştığında veya aşıldığında bildirim gönderir
 */

import * as Notifications from "expo-notifications";
import { Payment, PaymentCategory } from "@/types";
import { loadBudgets, getBudgetMap, calculateBudgetStatus } from "@/utils/budget-storage";
import { getCurrentMonthPayments, calculateCategoryExpenses } from "@/utils/expense-calculations";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BUDGET_NOTIFICATION_KEY = "@paytrack_budget_notifications";
const WARNING_THRESHOLD = 80; // %80'de uyarı
const EXCEEDED_THRESHOLD = 100; // %100'de aşım uyarısı

interface BudgetNotificationState {
  /** Son bildirim gönderilen ay (YYYY-MM formatında) */
  lastNotificationMonth: string;
  /** Hangi kategoriler için uyarı gönderildi */
  warningsSent: Record<PaymentCategory, boolean>;
  /** Hangi kategoriler için aşım uyarısı gönderildi */
  exceededSent: Record<PaymentCategory, boolean>;
}

/**
 * Bildirim durumunu yükler
 */
async function loadNotificationState(): Promise<BudgetNotificationState> {
  try {
    const data = await AsyncStorage.getItem(BUDGET_NOTIFICATION_KEY);
    if (!data) {
      return {
        lastNotificationMonth: "",
        warningsSent: {} as Record<PaymentCategory, boolean>,
        exceededSent: {} as Record<PaymentCategory, boolean>,
      };
    }
    return JSON.parse(data);
  } catch (error) {
    console.error("Bildirim durumu yükleme hatası:", error);
    return {
      lastNotificationMonth: "",
      warningsSent: {} as Record<PaymentCategory, boolean>,
      exceededSent: {} as Record<PaymentCategory, boolean>,
    };
  }
}

/**
 * Bildirim durumunu kaydeder
 */
async function saveNotificationState(state: BudgetNotificationState): Promise<void> {
  try {
    await AsyncStorage.setItem(BUDGET_NOTIFICATION_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Bildirim durumu kaydetme hatası:", error);
  }
}

/**
 * Mevcut ayı döner (YYYY-MM formatında)
 */
function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

/**
 * Kategori adını döner
 */
function getCategoryName(category: PaymentCategory, language: string = "tr"): string {
  if (language === "tr") {
    if (category === PaymentCategory.CREDIT_CARD) return "Kredi Kartı";
    if (category === PaymentCategory.LOAN) return "Kredi";
    return "Diğer";
  } else {
    if (category === PaymentCategory.CREDIT_CARD) return "Credit Card";
    if (category === PaymentCategory.LOAN) return "Loan";
    return "Other";
  }
}

/**
 * Bütçe durumunu kontrol eder ve gerekirse bildirim gönderir
 */
export async function checkBudgetAndNotify(
  payments: Payment[],
  language: string = "tr"
): Promise<void> {
  try {
    // Bütçeleri yükle
    const budgets = await loadBudgets();
    const activeBudgets = budgets.filter((b) => b.isActive && b.monthlyLimit > 0);

    if (activeBudgets.length === 0) {
      return; // Aktif bütçe yok
    }

    // Mevcut ay ödemelerini al
    const currentMonthPayments = getCurrentMonthPayments(payments);
    const categoryExpenses = calculateCategoryExpenses(currentMonthPayments);

    // Bildirim durumunu yükle
    const currentMonth = getCurrentMonth();
    let notificationState = await loadNotificationState();

    // Yeni ay başladıysa durumu sıfırla
    if (notificationState.lastNotificationMonth !== currentMonth) {
      notificationState = {
        lastNotificationMonth: currentMonth,
        warningsSent: {} as Record<PaymentCategory, boolean>,
        exceededSent: {} as Record<PaymentCategory, boolean>,
      };
    }

    // Her bütçe için kontrol et
    for (const budget of activeBudgets) {
      const expense = categoryExpenses.find((e) => e.category === budget.category);
      const spent = expense ? expense.amount : 0;
      const status = calculateBudgetStatus(budget, spent);

      // %80 uyarısı
      if (
        status.percentage >= WARNING_THRESHOLD &&
        status.percentage < EXCEEDED_THRESHOLD &&
        !notificationState.warningsSent[budget.category]
      ) {
        await sendBudgetWarningNotification(budget.category, status.percentage, language);
        notificationState.warningsSent[budget.category] = true;
      }

      // %100 aşım uyarısı
      if (
        status.percentage >= EXCEEDED_THRESHOLD &&
        !notificationState.exceededSent[budget.category]
      ) {
        await sendBudgetExceededNotification(budget.category, status.percentage, language);
        notificationState.exceededSent[budget.category] = true;
      }
    }

    // Durumu kaydet
    await saveNotificationState(notificationState);
  } catch (error) {
    console.error("Bütçe kontrol hatası:", error);
  }
}

/**
 * %80 uyarı bildirimi gönderir
 */
async function sendBudgetWarningNotification(
  category: PaymentCategory,
  percentage: number,
  language: string
): Promise<void> {
  const categoryName = getCategoryName(category, language);
  const title = language === "tr" ? "⚠️ Bütçe Uyarısı" : "⚠️ Budget Warning";
  const body =
    language === "tr"
      ? `${categoryName} bütçenizin %${percentage.toFixed(0)}'ine ulaştınız!`
      : `You've reached ${percentage.toFixed(0)}% of your ${categoryName} budget!`;

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: null, // Hemen gönder
  });
}

/**
 * Bütçe aşım bildirimi gönderir
 */
async function sendBudgetExceededNotification(
  category: PaymentCategory,
  percentage: number,
  language: string
): Promise<void> {
  const categoryName = getCategoryName(category, language);
  const title = language === "tr" ? "🚨 Bütçe Aşıldı!" : "🚨 Budget Exceeded!";
  const body =
    language === "tr"
      ? `${categoryName} bütçenizi aştınız! (%${percentage.toFixed(0)})`
      : `You've exceeded your ${categoryName} budget! (${percentage.toFixed(0)}%)`;

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: null, // Hemen gönder
  });
}

/**
 * Ödeme eklendiğinde veya güncellendiğinde bütçe kontrolü yap
 */
export async function onPaymentChanged(payments: Payment[], language: string = "tr"): Promise<void> {
  await checkBudgetAndNotify(payments, language);
}
