# Ödeme ve Gelir Takibi Uygulaması - Tasarım Planı

## Genel Bakış
Kullanıcıların kredi kartı taksitleri, kredi ödemeleri, diğer borçlar ve gelirlerini (düzenli ve düzenli olmayan) takip edebileceği, ödeme günü yaklaştığında bildirim alan mobil uygulama. Tüm veriler telefonda yerel olarak saklanır (AsyncStorage).

## Platform ve Yönelim
- **Platform**: iOS ve Android (React Native + Expo)
- **Yönelim**: Mobil dikey (9:16), tek elle kullanım
- **Tasarım Standardı**: Apple Human Interface Guidelines (HIG) - iOS native app hissi

## Renk Paleti
- **Primary (Ana Renk)**: `#0a7ea4` - Turkuaz mavi (güven, finans, profesyonellik)
- **Success (Başarı)**: `#22C55E` - Yeşil (ödeme tamamlandı)
- **Warning (Uyarı)**: `#F59E0B` - Turuncu (yaklaşan ödeme)
- **Error (Hata)**: `#EF4444` - Kırmızı (gecikmiş ödeme)
- **Background**: Beyaz (light mode), Koyu gri (dark mode)
- **Surface**: Kartlar için hafif gri tonları

## Ekran Listesi

### 1. Ana Ekran (Home)
**Amaç**: Kullanıcının finansal durumunu hızlıca görmesi

**İçerik**:
- Üst kısım: Aylık özet kartı
  - Bu ay toplam ödenecek tutar
  - Bu ay toplam gelir
  - Kalan bakiye (gelir - gider)
- Yaklaşan ödemeler listesi (önümüzdeki 7 gün)
  - Her ödeme kartı: İsim, tutar, tarih, durum badge'i
  - Renk kodlu: Yeşil (ödendi), Turuncu (yaklaşıyor), Kırmızı (gecikti)
- Alt kısım: Hızlı eylem butonları
  - "Ödeme Ekle" butonu
  - "Gelir Ekle" butonu

**Fonksiyonellik**:
- Ödeme kartına tıklayınca detay sayfası açılır
- Ödeme kartını sola kaydırınca "Ödendi" işaretleme
- Aşağı çekerek yenileme (pull-to-refresh)

### 2. Ödemeler Ekranı (Payments)
**Amaç**: Tüm ödemeleri kategorilere göre görüntüleme

**İçerik**:
- Üst kısım: Segmented control (filtre)
  - Tümü / Kredi Kartı / Kredi / Diğer Borçlar
- Ödeme listesi (tarih sıralı)
  - Her ödeme kartı: Kategori ikonu, isim, tutar, tarih, durum
- Sağ üst: "+" butonu (yeni ödeme ekle)

**Fonksiyonellik**:
- Kategoriye göre filtreleme
- Ödeme kartına tıklayınca detay/düzenleme
- Sola kaydırarak silme veya ödendi işaretleme

### 3. Gelirler Ekranı (Income)
**Amaç**: Tüm gelirleri görüntüleme ve yönetme

**İçerik**:
- Üst kısım: Segmented control
  - Tümü / Düzenli / Düzenli Olmayan
- Gelir listesi
  - Her gelir kartı: İsim, tutar, tarih, tekrar durumu (düzenli ise)
- Sağ üst: "+" butonu (yeni gelir ekle)

**Fonksiyonellik**:
- Düzenli gelirlerde otomatik tekrar bilgisi
- Gelir kartına tıklayınca detay/düzenleme
- Sola kaydırarak silme

### 4. Takvim Ekranı (Calendar)
**Amaç**: Ödemeleri ve gelirleri takvim görünümünde gösterme

**İçerik**:
- Aylık takvim görünümü
- Her gün içinde:
  - Kırmızı nokta: Ödeme var
  - Yeşil nokta: Gelir var
- Seçilen günün detayları alt kısımda liste olarak
  - O güne ait tüm ödemeler ve gelirler

**Fonksiyonellik**:
- Aylık takvim gezinme (sağa-sola kaydırma)
- Güne tıklayınca o günün detayları görünür
- Detay listesinden ödeme/gelir kartına tıklayınca detay sayfası

### 5. Ayarlar Ekranı (Settings)
**Amaç**: Uygulama ayarları ve tercihler

**İçerik**:
- Bildirim ayarları
  - Bildirimleri aç/kapat
  - Bildirim zamanı (kaç gün önceden)
- Tema ayarları
  - Açık / Koyu / Sistem
- Para birimi seçimi
  - TRY, USD, EUR vb.
- Veri yönetimi
  - Tüm verileri sil
  - Verileri dışa aktar (JSON)
  - Verileri içe aktar

**Fonksiyonellik**:
- Toggle switch'ler ile ayar değiştirme
- Veri silme için onay dialogu

### 6. Ödeme/Gelir Ekleme/Düzenleme Ekranı (Add/Edit)
**Amaç**: Yeni ödeme veya gelir ekleme, mevcut olanı düzenleme

**İçerik (Ödeme için)**:
- Form alanları:
  - İsim (text input)
  - Tutar (numeric input)
  - Kategori seçimi (Kredi Kartı / Kredi / Diğer)
  - Ödeme tarihi (date picker)
  - Taksit bilgisi (opsiyonel)
    - Taksit sayısı
    - Kaçıncı taksit
  - Tekrarlama (opsiyonel)
    - Aylık / Yıllık / Özel
  - Notlar (text area)
- Alt kısım: "Kaydet" butonu

**İçerik (Gelir için)**:
- Form alanları:
  - İsim (text input)
  - Tutar (numeric input)
  - Gelir tipi (Düzenli / Düzenli Olmayan)
  - Gelir tarihi (date picker)
  - Tekrarlama (düzenli ise)
    - Aylık / Haftalık / Yıllık
  - Notlar (text area)
- Alt kısım: "Kaydet" butonu

**Fonksiyonellik**:
- Form validasyonu
- Düzenleme modunda mevcut verileri doldurma
- Kaydet butonuna basınca veri kaydedilir ve önceki ekrana dönülür

### 7. Detay Ekranı (Detail)
**Amaç**: Ödeme veya gelirin detaylarını görüntüleme

**İçerik**:
- Üst kısım: Büyük tutar gösterimi
- Detay bilgileri:
  - İsim
  - Kategori/Tip
  - Tarih
  - Durum (ödendi/ödenmedi)
  - Taksit bilgisi (varsa)
  - Tekrarlama bilgisi (varsa)
  - Notlar (varsa)
- Alt kısım: Eylem butonları
  - "Düzenle" butonu
  - "Sil" butonu
  - "Ödendi Olarak İşaretle" butonu (ödeme için)

**Fonksiyonellik**:
- Düzenle butonuna basınca düzenleme ekranı açılır
- Sil butonuna basınca onay dialogu
- Ödendi işaretleme ile durum güncellenir

## Tab Bar Navigasyon
- **Ana Ekran** (house.fill ikonu)
- **Ödemeler** (creditcard.fill ikonu)
- **Gelirler** (dollarsign.circle.fill ikonu)
- **Takvim** (calendar ikonu)
- **Ayarlar** (gearshape.fill ikonu)

## Kullanıcı Akışları

### Ana Akış 1: Yeni Ödeme Ekleme
1. Kullanıcı Ana Ekran'da "Ödeme Ekle" butonuna basar
2. Ekleme ekranı açılır (modal veya yeni sayfa)
3. Kullanıcı form alanlarını doldurur
4. "Kaydet" butonuna basar
5. Ödeme kaydedilir, Ana Ekran'a döner
6. Ana Ekran'da yeni ödeme listede görünür

### Ana Akış 2: Ödeme Ödendi İşaretleme
1. Kullanıcı Ana Ekran'da bir ödeme kartını görür
2. Kartı sola kaydırır
3. "Ödendi" butonu görünür
4. Butona basar
5. Ödeme durumu güncellenir, kart yeşil renk alır
6. Haptic feedback (hafif titreşim)

### Ana Akış 3: Yaklaşan Ödemeleri Görüntüleme
1. Kullanıcı Ana Ekran'da yaklaşan ödemeler listesini görür
2. Turuncu renkte yaklaşan ödemeler dikkat çeker
3. Bir ödeme kartına tıklar
4. Detay ekranı açılır
5. Detayları inceler
6. "Düzenle" veya "Ödendi İşaretle" yapabilir

### Ana Akış 4: Takvimde Ödeme/Gelir Görüntüleme
1. Kullanıcı Takvim sekmesine gider
2. Aylık takvim görünümünü görür
3. Kırmızı ve yeşil noktalı günleri görür
4. Bir güne tıklar
5. O günün ödemeleri ve gelirleri alt kısımda listelenir
6. Listeden bir öğeye tıklayınca detay ekranı açılır

### Ana Akış 5: Bildirim Alma
1. Ödeme tarihi 3 gün öncesine gelir (ayarlara göre)
2. Sistem yerel bildirim oluşturur
3. Kullanıcı bildirim alır (push notification)
4. Bildirime tıklar
5. Uygulama açılır, ilgili ödemenin detay ekranı gösterilir

## Etkileşim Tasarımı

### Geri Bildirimler
- **Buton basma**: Scale animasyonu (0.97) + hafif haptic
- **Kart tıklama**: Opacity değişimi (0.7)
- **Sola kaydırma**: Swipe animasyonu + eylem butonları
- **Veri kaydedildi**: Başarı toastı + haptic (medium)
- **Hata durumu**: Hata toastı + haptic (error)

### Animasyonlar
- **Ekran geçişleri**: Sağdan sola slide (iOS native)
- **Modal açılma**: Alttan yukarı slide
- **Liste öğeleri**: Fade in (250ms)
- **Durum değişimi**: Renk geçişi (300ms)

### Haptic Feedback
- Buton basma: Light impact
- Toggle switch: Medium impact
- Ödeme ödendi: Success notification
- Silme işlemi: Warning notification

## Veri Yapısı (Özet)

### Payment (Ödeme)
- id, name, amount, category, dueDate, isPaid, installments, recurrence, notes, createdAt

### Income (Gelir)
- id, name, amount, type (regular/irregular), date, recurrence, notes, createdAt

### Settings (Ayarlar)
- notificationsEnabled, notificationDays, theme, currency

## Teknik Notlar
- **Yerel Depolama**: AsyncStorage kullanılacak
- **Bildirimler**: expo-notifications ile yerel bildirimler
- **Tarih İşlemleri**: JavaScript Date objesi
- **Form Validasyonu**: Basit client-side validation
- **Durum Yönetimi**: React Context + useReducer (basit yapı için yeterli)
- **Veri Formatı**: JSON (AsyncStorage'da string olarak saklanacak)

## Öncelikli Özellikler (MVP)
1. ✅ Ödeme ekleme/düzenleme/silme
2. ✅ Gelir ekleme/düzenleme/silme
3. ✅ Ana ekranda özet ve yaklaşan ödemeler
4. ✅ Ödeme durumu işaretleme (ödendi/ödenmedi)
5. ✅ Yerel bildirimler (ödeme tarihi yaklaştığında)
6. ✅ Takvim görünümü
7. ✅ Ayarlar (bildirim, tema)

## Gelecek Özellikler (Sonraki Versiyonlar)
- Veri yedekleme/geri yükleme
- Grafik ve istatistikler
- Kategori özelleştirme
- Çoklu para birimi desteği
- Widget desteği (iOS/Android)
