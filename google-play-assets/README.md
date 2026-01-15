# Google Play Store Materyalleri

Bu klasör Google Play Console'a yüklenecek tüm materyalleri içerir.

## Dosyalar

### 1. Feature Graphic
- **Dosya**: `feature-graphic.png`
- **Boyut**: 1024x500px
- **Format**: PNG
- **Kullanım**: Google Play Store'da uygulamanın üst banner'ı

### 2. Uygulama Açıklamaları
- **Dosya**: `../google-play-store-listing.md`
- **İçerik**:
  - Kısa açıklama (80 karakter)
  - Uzun açıklama (4000 karakter)
  - Anahtar kelimeler
  - Kategori ve yaş sınırı
  - Gizlilik politikası URL
  - Destek e-posta

### 3. Ekran Görüntüleri (Gerçek Cihazda Alınmalı)

Google Play Console için **en az 2, en fazla 8** ekran görüntüsü gereklidir.

**Önerilen Ekranlar:**
1. **Ana Sayfa / Onboarding** - İlk izlenim
2. **Ödeme Listesi** - Ana özellik
3. **Ödeme Ekleme** - Kullanım kolaylığı
4. **Otomatik Oluşturma** - Öne çıkan özellik
5. **Ayarlar / Bildirimler** - Ek özellikler

**Teknik Gereksinimler:**
- **Boyut**: 1080x1920px (9:16) veya 1080x2340px (modern telefonlar)
- **Format**: PNG veya JPEG
- **Minimum**: 320px (kısa kenar)
- **Maksimum**: 3840px (uzun kenar)

**Ekran Görüntüsü Nasıl Alınır:**

#### Android Cihazda:
1. Uygulamayı Expo Go'da açın
2. Güç + Ses Kısma tuşlarına aynı anda basın
3. Ekran görüntüleri `/sdcard/Pictures/Screenshots/` klasöründe

#### iOS Cihazda:
1. Uygulamayı Expo Go'da açın
2. Güç + Ses Yükseltme tuşlarına aynı anda basın
3. Ekran görüntüleri Fotoğraflar uygulamasında

#### Emülatörde (Android Studio):
1. Android Studio'da emülatörü başlatın
2. Uygulamayı Expo Go'da açın
3. Emülatör yan panelinde kamera ikonuna tıklayın
4. Ekran görüntüleri otomatik olarak kaydedilir

#### Simulator'da (Xcode):
1. Xcode'da iOS Simulator'ü başlatın
2. Uygulamayı Expo Go'da açın
3. Cmd + S tuşlarına basın
4. Ekran görüntüleri Desktop'ta

### 4. Uygulama İkonu
- **Dosya**: `../assets/images/icon.png`
- **Boyut**: 1024x1024px
- **Format**: PNG
- **Kullanım**: Google Play Store'da uygulama ikonu

## Google Play Console'a Yükleme Adımları

1. [Google Play Console](https://play.google.com/console)'a giriş yapın
2. "Tüm uygulamalar" > "Uygulama oluştur" tıklayın
3. Uygulama adı: **Ödeme Takibi**
4. Varsayılan dil: **Türkçe (Türkiye)**
5. Uygulama veya oyun: **Uygulama**
6. Ücretsiz veya ücretli: **Ücretsiz**

### Store Listeleme
1. Sol menüden "Store varlığı" > "Ana Store listeleme"
2. **Uygulama adı**: Ödeme Takibi
3. **Kısa açıklama**: `google-play-store-listing.md` dosyasından kopyalayın
4. **Tam açıklama**: `google-play-store-listing.md` dosyasından kopyalayın
5. **Uygulama ikonu**: `../assets/images/icon.png` yükleyin
6. **Feature graphic**: `feature-graphic.png` yükleyin
7. **Ekran görüntüleri**: Gerçek cihazda aldığınız ekran görüntülerini yükleyin (en az 2, en fazla 8)

### Uygulama Kategorisi
1. **Kategori**: Finans
2. **Etiketler**: ödeme takibi, fatura, kredi kartı, bütçe

### İletişim Bilgileri
1. **Web sitesi**: https://odemetakibi.com (veya boş bırakın)
2. **E-posta**: destek@odemetakibi.com
3. **Telefon**: (Opsiyonel)
4. **Gizlilik politikası**: Uygulamanın Ayarlar > Gizlilik Politikası ekranı

### İçerik Derecelendirmesi
1. Sol menüden "İçerik derecelendirmesi"
2. Anketi doldurun (Şiddet: Hayır, Cinsel içerik: Hayır, vb.)
3. Sonuç: **PEGI 3** (Herkes için uygun)

### Hedef Kitle
1. **Yaş aralığı**: 18-65 (Yetişkinler)
2. **Çocuklara yönelik**: Hayır

### Fiyatlandırma ve Dağıtım
1. **Ücretli/Ücretsiz**: Ücretsiz
2. **Ülkeler**: Tüm ülkeler (veya sadece Türkiye)
3. **Uygulama içi satın almalar**: Hayır (şimdilik)
4. **Reklamlar içerir**: Hayır (şimdilik)

### APK/AAB Yükleme
1. Sol menüden "Üretim" > "Yeni sürüm oluştur"
2. APK veya AAB dosyasını yükleyin
3. Sürüm notlarını yazın
4. "İncelemeye gönder" tıklayın

## Notlar

- **Destek E-posta**: `destek@odemetakibi.com` gerçek bir e-posta adresi olmalı
- **Web Sitesi**: Opsiyonel, ancak profesyonel görünüm için önerilir
- **Gizlilik Politikası**: Google Play zorunlu kılıyor, uygulamada mevcut
- **Ekran Görüntüleri**: Gerçek cihazda alınmalı, mockup değil
- **Feature Graphic**: Hazır, `feature-graphic.png` dosyası
- **Uygulama İkonu**: Hazır, `../assets/images/icon.png` dosyası

## İnceleme Süreci

Google Play inceleme süreci genellikle **1-7 gün** sürer. İnceleme sırasında:
- Uygulama politikalarına uygunluk kontrol edilir
- Gizlilik politikası kontrol edilir
- İçerik derecelendirmesi doğrulanır
- Teknik sorunlar test edilir

Onaylandıktan sonra uygulama Google Play Store'da yayınlanır!
