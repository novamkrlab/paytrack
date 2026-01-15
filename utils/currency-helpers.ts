/**
 * Para Birimi Yardımcı Fonksiyonları
 */

import i18n from "@/i18n";

/**
 * Para birimi sembolünü döndürür
 */
export function getCurrencySymbol(): string {
  return i18n.language === "tr" ? "₺" : "$";
}

/**
 * Locale'i döndürür
 */
export function getLocale(): string {
  return i18n.language === "tr" ? "tr-TR" : "en-US";
}

/**
 * Tutarı para birimi formatında döndürür
 * @param amount - Tutar
 * @param showSymbol - Para birimi sembolünü göster (varsayılan: true)
 * @returns Formatlanmış tutar (örn: "1,234.56 $" veya "1.234,56 ₺")
 */
export function formatCurrency(amount: number, showSymbol: boolean = true): string {
  const locale = getLocale();
  const symbol = getCurrencySymbol();
  const formatted = amount.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  return showSymbol ? `${formatted} ${symbol}` : formatted;
}

/**
 * Tutarı kısa formatta döndürür (K, M, B)
 * @param amount - Tutar
 * @returns Kısa formatlanmış tutar (örn: "1.2K $" veya "1,2K ₺")
 */
export function formatCurrencyShort(amount: number): string {
  const symbol = getCurrencySymbol();
  const locale = getLocale();
  
  if (amount >= 1000000000) {
    return `${(amount / 1000000000).toLocaleString(locale, { maximumFractionDigits: 1 })}B ${symbol}`;
  } else if (amount >= 1000000) {
    return `${(amount / 1000000).toLocaleString(locale, { maximumFractionDigits: 1 })}M ${symbol}`;
  } else if (amount >= 1000) {
    return `${(amount / 1000).toLocaleString(locale, { maximumFractionDigits: 1 })}K ${symbol}`;
  }
  
  return formatCurrency(amount);
}
