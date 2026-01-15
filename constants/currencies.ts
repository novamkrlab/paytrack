export type CurrencyCode = 'TRY' | 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CNY' | 'CHF' | 'CAD' | 'AUD' | 'RUB' | 'INR' | 'BRL' | 'MXN' | 'ZAR' | 'KRW' | 'SGD' | 'HKD' | 'NOK' | 'SEK' | 'DKK' | 'PLN' | 'THB' | 'IDR' | 'MYR' | 'PHP' | 'CZK' | 'ILS' | 'CLP' | 'AED' | 'SAR';

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  name: string;
  nameEn: string;
  nameTr: string;
  decimalPlaces: number;
}

export const CURRENCIES: Currency[] = [
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira', nameEn: 'Turkish Lira', nameTr: 'Türk Lirası', decimalPlaces: 2 },
  { code: 'USD', symbol: '$', name: 'US Dollar', nameEn: 'US Dollar', nameTr: 'ABD Doları', decimalPlaces: 2 },
  { code: 'EUR', symbol: '€', name: 'Euro', nameEn: 'Euro', nameTr: 'Euro', decimalPlaces: 2 },
  { code: 'GBP', symbol: '£', name: 'British Pound', nameEn: 'British Pound', nameTr: 'İngiliz Sterlini', decimalPlaces: 2 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', nameEn: 'Japanese Yen', nameTr: 'Japon Yeni', decimalPlaces: 0 },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', nameEn: 'Chinese Yuan', nameTr: 'Çin Yuanı', decimalPlaces: 2 },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', nameEn: 'Swiss Franc', nameTr: 'İsviçre Frangı', decimalPlaces: 2 },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', nameEn: 'Canadian Dollar', nameTr: 'Kanada Doları', decimalPlaces: 2 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', nameEn: 'Australian Dollar', nameTr: 'Avustralya Doları', decimalPlaces: 2 },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble', nameEn: 'Russian Ruble', nameTr: 'Rus Rublesi', decimalPlaces: 2 },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', nameEn: 'Indian Rupee', nameTr: 'Hint Rupisi', decimalPlaces: 2 },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', nameEn: 'Brazilian Real', nameTr: 'Brezilya Reali', decimalPlaces: 2 },
  { code: 'MXN', symbol: 'MX$', name: 'Mexican Peso', nameEn: 'Mexican Peso', nameTr: 'Meksika Pesosu', decimalPlaces: 2 },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand', nameEn: 'South African Rand', nameTr: 'Güney Afrika Randı', decimalPlaces: 2 },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won', nameEn: 'South Korean Won', nameTr: 'Güney Kore Wonu', decimalPlaces: 0 },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', nameEn: 'Singapore Dollar', nameTr: 'Singapur Doları', decimalPlaces: 2 },
  { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar', nameEn: 'Hong Kong Dollar', nameTr: 'Hong Kong Doları', decimalPlaces: 2 },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone', nameEn: 'Norwegian Krone', nameTr: 'Norveç Kronu', decimalPlaces: 2 },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona', nameEn: 'Swedish Krona', nameTr: 'İsveç Kronu', decimalPlaces: 2 },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone', nameEn: 'Danish Krone', nameTr: 'Danimarka Kronu', decimalPlaces: 2 },
  { code: 'PLN', symbol: 'zł', name: 'Polish Zloty', nameEn: 'Polish Zloty', nameTr: 'Polonya Zlotisi', decimalPlaces: 2 },
  { code: 'THB', symbol: '฿', name: 'Thai Baht', nameEn: 'Thai Baht', nameTr: 'Tayland Bahtı', decimalPlaces: 2 },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', nameEn: 'Indonesian Rupiah', nameTr: 'Endonezya Rupisi', decimalPlaces: 0 },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', nameEn: 'Malaysian Ringgit', nameTr: 'Malezya Ringgiti', decimalPlaces: 2 },
  { code: 'PHP', symbol: '₱', name: 'Philippine Peso', nameEn: 'Philippine Peso', nameTr: 'Filipin Pesosu', decimalPlaces: 2 },
  { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna', nameEn: 'Czech Koruna', nameTr: 'Çek Kronu', decimalPlaces: 2 },
  { code: 'ILS', symbol: '₪', name: 'Israeli Shekel', nameEn: 'Israeli Shekel', nameTr: 'İsrail Şekeli', decimalPlaces: 2 },
  { code: 'CLP', symbol: 'CLP$', name: 'Chilean Peso', nameEn: 'Chilean Peso', nameTr: 'Şili Pesosu', decimalPlaces: 0 },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', nameEn: 'UAE Dirham', nameTr: 'BAE Dirhemi', decimalPlaces: 2 },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', nameEn: 'Saudi Riyal', nameTr: 'Suudi Arabistan Riyali', decimalPlaces: 2 },
];

export const DEFAULT_CURRENCY: CurrencyCode = 'TRY';

export function getCurrencyByCode(code: CurrencyCode): Currency | undefined {
  return CURRENCIES.find((c) => c.code === code);
}

export function getCurrencySymbol(code: CurrencyCode): string {
  return getCurrencyByCode(code)?.symbol || code;
}

export function getCurrencyName(code: CurrencyCode, language: 'en' | 'tr' = 'en'): string {
  const currency = getCurrencyByCode(code);
  if (!currency) return code;
  return language === 'tr' ? currency.nameTr : currency.nameEn;
}
