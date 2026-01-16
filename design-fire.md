# Finansal Özgürlük (FIRE) ve Borç Yönetimi Modülü Tasarımı

## Genel Bakış

PayTrack uygulamasına eklenecek kapsamlı finansal planlama modülü. Kullanıcıların finansal özgürlük hedeflerini takip etmelerini ve borçlarını yönetmelerini sağlar.

## Özellikler

### 1. Finansal Özgürlük (FIRE) Hesaplamaları

#### 1.1 FIRE Sayısı Hesaplama
- **Formül:** Yıllık Harcama × 25 (4% kuralı)
- **Girdi:** Hedef aylık harcama
- **Çıktı:** Ulaşılması gereken toplam sermaye

#### 1.2 Emeklilik Yaşı Tahmini
- **Girdi:**
  - Mevcut birikim
  - Aylık tasarruf miktarı
  - Beklenen yıllık getiri (%)
  - FIRE sayısı
  - Mevcut yaş
- **Çıktı:** Tahmini emeklilik yaşı

#### 1.3 Aylık Tasarruf Hedefi
- **Girdi:**
  - FIRE sayısı
  - Mevcut birikim
  - Hedef emeklilik yaşı
  - Mevcut yaş
  - Beklenen yıllık getiri (%)
- **Çıktı:** Hedefe ulaşmak için gereken aylık tasarruf

#### 1.4 Yatırım Simülasyonu
- Yıllara göre birikim artışı grafiği
- Faiz geliri vs ana para ayrımı
- İlerleme yüzdesi

### 2. Borç Yönetimi

#### 2.1 Toplam Borç Özeti
- Aktif borçların toplamı
- Aylık toplam taksit tutarı
- Ortalama faiz oranı

#### 2.2 Borç Ödeme Stratejileri
- **Kar Topu (Snowball):** En küçük borçtan başla
- **Çığ (Avalanche):** En yüksek faizli borçtan başla
- Her strateji için tahmini ödeme süresi

#### 2.3 Borç Takibi
- Kalan borç miktarı
- Ödenen toplam tutar
- Ödenen faiz tutarı
- Kalan taksit sayısı

## Ekran Yapısı

### Ana Sayfa Özet Kartları

#### FIRE Özet Kartı
```
┌─────────────────────────────────┐
│ 🎯 Finansal Özgürlük            │
│                                 │
│ FIRE Sayınız: ₺2,500,000       │
│ Mevcut Birikim: ₺450,000       │
│                                 │
│ [████████░░░░░░░░] 18%         │
│                                 │
│ Tahmini Süre: 12 yıl 4 ay      │
└─────────────────────────────────┘
```

#### Borç Özet Kartı
```
┌─────────────────────────────────┐
│ 💳 Borç Yönetimi                │
│                                 │
│ Toplam Borç: ₺85,000           │
│ Aylık Taksit: ₺3,200           │
│                                 │
│ 3 aktif borç                    │
│ Ortalama Faiz: %1.8            │
└─────────────────────────────────┘
```

### Hedefler Sekmesi

#### Tab Yapısı
- **Genel Bakış:** Özet bilgiler ve ilerleme
- **FIRE Hesaplama:** Detaylı hesaplamalar ve simülasyon
- **Borç Yönetimi:** Borç listesi ve stratejiler
- **Ayarlar:** Kullanıcı bilgileri ve hedefler

#### Genel Bakış Ekranı
- Büyük ilerleme çubuğu
- Temel metrikler (kartlar halinde)
- Hızlı eylemler (hesapla, güncelle)

#### FIRE Hesaplama Ekranı
- Form: Kullanıcı bilgileri girişi
  - Mevcut yaş
  - Hedef emeklilik yaşı
  - Mevcut birikim
  - Aylık gelir
  - Aylık harcama (otomatik hesaplanabilir)
  - Hedef aylık harcama (emeklilik sonrası)
  - Beklenen yıllık getiri (%)
- Sonuçlar:
  - FIRE Sayısı
  - Tahmini emeklilik yaşı
  - Gereken aylık tasarruf
  - İlerleme yüzdesi
- Grafik: Yıllara göre birikim projeksiyonu

#### Borç Yönetimi Ekranı
- Borç listesi (uygulamadaki ödemelerden otomatik)
- Her borç için:
  - Borç adı
  - Toplam tutar
  - Kalan tutar
  - Aylık taksit
  - Faiz oranı
  - Kalan ay
- Ödeme stratejileri karşılaştırması
- Önerilen strateji

## Veri Modeli

### FireSettings (AsyncStorage)
```typescript
interface FireSettings {
  currentAge: number;
  targetRetirementAge: number;
  currentSavings: number;
  monthlyIncome: number;
  monthlyExpenses: number; // Otomatik hesaplanabilir
  targetMonthlyExpenses: number;
  expectedAnnualReturn: number; // Yüzde (örn: 10 = %10)
  lastUpdated: string; // ISO date
}
```

### DebtSummary (Hesaplanacak)
```typescript
interface DebtSummary {
  totalDebt: number;
  monthlyPayment: number;
  averageInterestRate: number;
  activeDebts: number;
  debts: DebtItem[];
}

interface DebtItem {
  id: string;
  name: string;
  totalAmount: number;
  remainingAmount: number;
  monthlyPayment: number;
  interestRate: number;
  remainingMonths: number;
}
```

### FireCalculationResult
```typescript
interface FireCalculationResult {
  fireNumber: number;
  estimatedRetirementAge: number;
  yearsToRetirement: number;
  monthlyTargetSavings: number;
  currentProgress: number; // Yüzde
  projectionData: ProjectionPoint[];
}

interface ProjectionPoint {
  year: number;
  age: number;
  totalSavings: number;
  principal: number;
  interest: number;
}
```

## Hesaplama Fonksiyonları

### 1. FIRE Sayısı
```typescript
function calculateFireNumber(targetMonthlyExpenses: number): number {
  return targetMonthlyExpenses * 12 * 25;
}
```

### 2. Emeklilik Yaşı Tahmini
```typescript
function estimateRetirementAge(
  currentAge: number,
  currentSavings: number,
  monthlySavings: number,
  annualReturn: number,
  fireNumber: number
): number {
  // Bileşik faiz formülü ile hesaplama
  // FV = PV(1+r)^n + PMT[((1+r)^n - 1) / r]
}
```

### 3. Gereken Aylık Tasarruf
```typescript
function calculateRequiredMonthlySavings(
  currentSavings: number,
  fireNumber: number,
  yearsToRetirement: number,
  annualReturn: number
): number {
  // PMT formülü
}
```

### 4. Borç Ödeme Stratejileri
```typescript
function calculateSnowballStrategy(debts: DebtItem[]): PayoffPlan;
function calculateAvalancheStrategy(debts: DebtItem[]): PayoffPlan;
```

## UI Bileşenleri

### Yeni Bileşenler
1. `FireOverviewCard` - Ana sayfa özet kartı
2. `DebtOverviewCard` - Ana sayfa borç kartı
3. `FireCalculator` - FIRE hesaplama formu
4. `ProjectionChart` - Birikim projeksiyonu grafiği
5. `DebtList` - Borç listesi
6. `StrategyComparison` - Strateji karşılaştırma
7. `ProgressRing` - Dairesel ilerleme göstergesi
8. `MetricCard` - Metrik kartı (tekrar kullanılabilir)

### Tab İkonu
- SF Symbol: `target` veya `chart.line.uptrend.xyaxis`
- Material Icon: `track_changes` veya `trending_up`

## Çeviriler

### Türkçe
- `goals.title`: "Hedefler"
- `goals.fire.title`: "Finansal Özgürlük"
- `goals.fire.number`: "FIRE Sayınız"
- `goals.fire.currentSavings`: "Mevcut Birikim"
- `goals.fire.progress`: "İlerleme"
- `goals.fire.estimatedTime`: "Tahmini Süre"
- `goals.debt.title`: "Borç Yönetimi"
- `goals.debt.totalDebt`: "Toplam Borç"
- `goals.debt.monthlyPayment`: "Aylık Taksit"
- `goals.debt.activeDebts`: "Aktif Borç"
- `goals.debt.averageRate`: "Ortalama Faiz"

### İngilizce
- `goals.title`: "Goals"
- `goals.fire.title`: "Financial Independence"
- `goals.fire.number`: "FIRE Number"
- `goals.fire.currentSavings`: "Current Savings"
- `goals.fire.progress`: "Progress"
- `goals.fire.estimatedTime`: "Estimated Time"
- `goals.debt.title`: "Debt Management"
- `goals.debt.totalDebt`: "Total Debt"
- `goals.debt.monthlyPayment`: "Monthly Payment"
- `goals.debt.activeDebts`: "Active Debts"
- `goals.debt.averageRate`: "Average Rate"

## Uygulama Adımları

1. ✅ Tasarım dokümanı oluştur
2. ⏳ Veri modelleri ve tipler tanımla
3. ⏳ Hesaplama fonksiyonları yaz
4. ⏳ UI bileşenlerini oluştur
5. ⏳ Tab yapısını güncelle
6. ⏳ Ana sayfaya kartları ekle
7. ⏳ Çevirileri ekle
8. ⏳ Test et
9. ⏳ Checkpoint oluştur

## Notlar

- Tüm para birimleri kullanıcının seçtiği para birimine göre gösterilecek
- Hesaplamalar AsyncStorage'da saklanacak
- Borç verileri mevcut ödeme kayıtlarından otomatik çekilecek
- Grafikler için basit SVG veya React Native chart kütüphanesi kullanılacak
- Karanlık mod desteği olacak
