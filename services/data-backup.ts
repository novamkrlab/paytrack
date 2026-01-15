/**
 * Veri Yedekleme ve Geri Yükleme Servisi
 */

import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";
import { Payment, Income, AppSettings } from "@/types";

export interface BackupData {
  version: string;
  exportDate: string;
  payments: Payment[];
  incomes: Income[];
  settings: AppSettings;
}

/**
 * Verileri JSON dosyası olarak dışa aktar
 */
export async function exportData(
  payments: Payment[],
  incomes: Income[],
  settings: AppSettings
): Promise<{ success: boolean; message: string; filePath?: string }> {
  try {
    // Yedekleme verisini hazırla
    const backupData: BackupData = {
      version: "1.0",
      exportDate: new Date().toISOString(),
      payments,
      incomes,
      settings,
    };

    // JSON'a çevir
    const jsonData = JSON.stringify(backupData, null, 2);

    // Dosya adı oluştur (tarih damgalı)
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const fileName = `odeme-takibi-yedek-${timestamp}.json`;
    const filePath = `${FileSystem.documentDirectory}${fileName}`;

    // Dosyayı kaydet
    await FileSystem.writeAsStringAsync(filePath, jsonData, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    // Dosyayı paylaş
    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(filePath, {
        mimeType: "application/json",
        dialogTitle: "Yedek Dosyasını Kaydet",
        UTI: "public.json",
      });
    }

    return {
      success: true,
      message: "Veriler başarıyla dışa aktarıldı",
      filePath,
    };
  } catch (error) {
    console.error("Export hatası:", error);
    return {
      success: false,
      message: `Dışa aktarma hatası: ${error instanceof Error ? error.message : "Bilinmeyen hata"}`,
    };
  }
}

/**
 * JSON dosyasından verileri içe aktar
 */
export async function importData(): Promise<{
  success: boolean;
  message: string;
  data?: BackupData;
}> {
  try {
    // Dosya seçici aç
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/json",
      copyToCacheDirectory: true,
    });

    if (result.canceled) {
      return {
        success: false,
        message: "İçe aktarma iptal edildi",
      };
    }

    const file = result.assets[0];

    // Dosyayı oku
    const fileContent = await FileSystem.readAsStringAsync(file.uri, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    // JSON'u parse et
    const backupData: BackupData = JSON.parse(fileContent);

    // Veri formatını doğrula
    if (!backupData.version || !backupData.payments || !backupData.incomes) {
      return {
        success: false,
        message: "Geçersiz yedek dosyası formatı",
      };
    }

    return {
      success: true,
      message: "Veriler başarıyla içe aktarıldı",
      data: backupData,
    };
  } catch (error) {
    console.error("Import hatası:", error);
    return {
      success: false,
      message: `İçe aktarma hatası: ${error instanceof Error ? error.message : "Bilinmeyen hata"}`,
    };
  }
}

/**
 * İçe aktarılan verileri mevcut verilerle birleştir
 */
export function mergeData(
  currentPayments: Payment[],
  currentIncomes: Income[],
  importedPayments: Payment[],
  importedIncomes: Income[],
  replaceExisting: boolean
): {
  payments: Payment[];
  incomes: Income[];
} {
  if (replaceExisting) {
    // Mevcut verileri sil, sadece içe aktarılanları kullan
    return {
      payments: importedPayments,
      incomes: importedIncomes,
    };
  }

  // Mevcut verilerle birleştir (ID çakışmalarını önle)
  const existingPaymentIds = new Set(currentPayments.map((p) => p.id));
  const existingIncomeIds = new Set(currentIncomes.map((i) => i.id));

  // Çakışan ID'leri yeniden oluştur
  const mergedPayments = [
    ...currentPayments,
    ...importedPayments.map((p) => {
      if (existingPaymentIds.has(p.id)) {
        return { ...p, id: `${p.id}-imported-${Date.now()}` };
      }
      return p;
    }),
  ];

  const mergedIncomes = [
    ...currentIncomes,
    ...importedIncomes.map((i) => {
      if (existingIncomeIds.has(i.id)) {
        return { ...i, id: `${i.id}-imported-${Date.now()}` };
      }
      return i;
    }),
  ];

  return {
    payments: mergedPayments,
    incomes: mergedIncomes,
  };
}

/**
 * Yedek dosyası bilgilerini oku (içe aktarmadan önce önizleme için)
 */
export async function getBackupInfo(
  filePath: string
): Promise<{
  success: boolean;
  info?: {
    version: string;
    exportDate: string;
    paymentCount: number;
    incomeCount: number;
  };
  message?: string;
}> {
  try {
    const fileContent = await FileSystem.readAsStringAsync(filePath, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    const backupData: BackupData = JSON.parse(fileContent);

    return {
      success: true,
      info: {
        version: backupData.version,
        exportDate: backupData.exportDate,
        paymentCount: backupData.payments.length,
        incomeCount: backupData.incomes.length,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: `Dosya bilgisi okunamadı: ${error instanceof Error ? error.message : "Bilinmeyen hata"}`,
    };
  }
}
