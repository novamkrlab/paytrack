/**
 * Para Birimi Yardımcı Fonksiyonları
 */

import i18n from "@/i18n";
import { getCurrencyByCode, DEFAULT_CURRENCY, type CurrencyCode } from "@/constants/currencies";

/**
 * Para birimi sembolünü döndürür
 */
export function getCurrencySymbol(currencyCode: CurrencyCode = DEFAULT_CURRENCY): string {
  const currencyInfo = getCurrencyByCode(currencyCode);
  return currencyInfo?.symbol || currencyCode;
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
 * @param currencyCode - Para birimi kodu (varsayılan: TRY)
 * @param showSymbol - Para birimi sembolünü göster (varsayılan: true)
 * @returns Formatlanmış tutar (örn: "1,234.56 $" veya "1.234,56 ₺")
 */
export function formatCurrency(
  amount: number,
  currencyCode: CurrencyCode = DEFAULT_CURRENCY,
  showSymbol: boolean = true
): string {
  const currencyInfo = getCurrencyByCode(currencyCode);
  const locale = getLocale();
  const symbol = currencyInfo?.symbol || currencyCode;
  const decimalPlaces = currencyInfo?.decimalPlaces || 2;

  const formatted = amount.toLocaleString(locale, {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });

  return showSymbol ? `${formatted} ${symbol}` : formatted;
}

/**
 * Tutarı kısa formatta döndürür (K, M, B)
 * @param amount - Tutar
 * @param currencyCode - Para birimi kodu (varsayılan: TRY)
 * @returns Kısa formatlanmış tutar (örn: "1.2K $" veya "1,2K ₺")
 */
export function formatCurrencyShort(
  amount: number,
  currencyCode: CurrencyCode = DEFAULT_CURRENCY
): string {
  const symbol = getCurrencySymbol(currencyCode);
  const locale = getLocale();

  if (amount >= 1000000000) {
    return `${(amount / 1000000000).toLocaleString(locale, { maximumFractionDigits: 1 })}B ${symbol}`;
  } else if (amount >= 1000000) {
    return `${(amount / 1000000).toLocaleString(locale, { maximumFractionDigits: 1 })}M ${symbol}`;
  } else if (amount >= 1000) {
    return `${(amount / 1000).toLocaleString(locale, { maximumFractionDigits: 1 })}K ${symbol}`;
  }

  return formatCurrency(amount, currencyCode);
}
