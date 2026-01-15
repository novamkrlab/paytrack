# Google Play'e Uygulama Yükleme Rehberi

**Ödeme Takibi** uygulamanızı Google Play Store'a yüklemek için adım adım rehber.

---

## 📋 Ön Hazırlık (Yapılması Gerekenler)

### 1. Google Play Console Hesabı Oluşturma

**Adım 1:** [Google Play Console](https://play.google.com/console) adresine gidin

**Adım 2:** Google hesabınızla giriş yapın (yoksa oluşturun)

**Adım 3:** Geliştirici kaydı yapın
- **Ücret:** $25 (tek seferlik, ömür boyu geçerli)
- **Ödeme:** Kredi kartı ile
- **Süre:** Kayıt onayı 24-48 saat sürebilir

**Adım 4:** Geliştirici bilgilerini doldurun
- Ad/Soyad veya Şirket adı
- E-posta adresi
- Telefon numarası
- Adres bilgileri

---

## 🏗️ Uygulama Build Alma (Manus'tan)

### Expo ile Build Alma

Manus platformunda uygulamanız zaten hazır. Şimdi Google Play için **AAB** (Android App Bundle) dosyası oluşturmanız gerekiyor.

**Seçenek 1: Manus UI'dan Publish (Önerilen)**

1. Manus UI'da sağ üstteki **"Publish"** butonuna tıklayın
2. Platform olarak **"Android"** seçin
3. Build tipi olarak **"AAB"** seçin
4. Build başlayacak (10-15 dakika sürebilir)
5. Build tamamlandığında **AAB dosyasını indirin**

**Seçenek 2: Expo CLI ile Manuel Build**

```bash
# Terminal'de proje dizinine gidin
cd /home/ubuntu/odeme_takibi

# Expo hesabınıza giriş yapın
npx expo login

# Android AAB build başlatın
npx eas build --platform android --profile production
```

**Not:** Expo hesabınız yoksa [expo.dev](https://expo.dev) adresinden ücretsiz hesap oluşturun.

---

## 📱 Google Play Console'da Uygulama Oluşturma

### Adım 1: Yeni Uygulama Oluşturma

1. [Google Play Console](https://play.google.com/console) → **"Tüm uygulamalar"** → **"Uygulama oluştur"**

2. **Uygulama detayları:**
   - **Uygulama adı:** Ödeme Takibi
   - **Varsayılan dil:** Türkçe (Türkiye)
   - **Uygulama veya oyun:** Uygulama
   - **Ücretsiz veya ücretli:** Ücretsiz

3. **Beyanlar:**
   - ✅ Geliştirici Programı Politikalarını kabul ediyorum
   - ✅ ABD ihracat yasalarına uyuyorum

4. **"Uygulama oluştur"** butonuna tıklayın

---

### Adım 2: Uygulama Bilgilerini Doldurma

#### A) Store Ayarları → Ana Store Kaydı

**Uygulama adı:**
```
Ödeme Takibi
```

**Kısa açıklama (80 karakter):**
```
Ödemelerinizi ve gelirlerinizi takip edin. Kredi kartı, kredi, fatura ödemeleri.
```

**Tam açıklama (4000 karakter):**
```
Ödeme Takibi ile tüm ödemelerinizi ve gelirlerinizi tek bir yerde yönetin!

🎯 ÖZELLİKLER

💳 Ödeme Takibi
• Kredi kartı ödemeleri
• Kredi taksitleri
• Fatura ödemeleri
• Taksitli ödemeler
• Tekrarlayan ödemeler (aylık, yıllık)
• Ödeme hatırlatıcıları

💰 Gelir Takibi
• Maaş ve gelir kayıtları
• Pasif gelir takibi
• Gelir kategorileri
• Tekrarlayan gelirler

📅 Takvim Görünümü
• Aylık ödeme takvimi
• Günlük ödeme ve gelir özeti
• Yaklaşan ödemeler
• Ödeme geçmişi

🔔 Akıllı Bildirimler
• Günlük ödeme hatırlatıcıları
• Özelleştirilebilir bildirim saati
• Yaklaşan ödemeler için uyarılar

🌍 Çoklu Dil Desteği
• Türkçe
• İngilizce
• Otomatik dil algılama

💱 Para Birimi Desteği
• Türk Lirası (₺)
• Dolar ($)
• Otomatik format (1.234,56 ₺ / 1,234.56 $)

🎨 Tema Desteği
• Açık tema
• Koyu tema
• Otomatik tema (sistem ayarına göre)

🔒 Gizlilik
• Tüm veriler cihazınızda saklanır
• Bulut senkronizasyonu yok
• Üçüncü taraf paylaşım yok
• Reklam yok

✨ Kullanım Kolaylığı
• Basit ve sezgisel arayüz
• Hızlı ödeme ekleme
• Kategori bazlı filtreleme
• Arama ve sıralama

📊 Finansal Özet
• Aylık toplam ödemeler
• Aylık toplam gelirler
• Net bakiye hesaplama
• Kategori bazlı analiz

Ödeme Takibi, kişisel finans yönetiminizi kolaylaştırmak için tasarlandı. Tüm ödemelerinizi ve gelirlerinizi tek bir uygulamada takip edin, hiçbir ödemeyi kaçırmayın!

İndirin ve finansal kontrolü elinize alın! 💪
```

**Uygulama simgesi:**
- `/home/ubuntu/odeme_takibi/assets/images/icon.png` dosyasını yükleyin
- Boyut: 512x512 px (PNG, 32-bit)

**Öne çıkan grafik:**
- Boyut: 1024x500 px
- **Henüz yok** - Oluşturmanız gerekecek (aşağıda açıklama var)

---

#### B) Ekran Görüntüleri

Google Play en az **2 ekran görüntüsü** ister. İdeal olarak 4-8 ekran görüntüsü yükleyin.

**Gerekli boyutlar:**
- Telefon: 16:9 veya 9:16 (örn: 1080x1920 px)
- 7 inç tablet: 16:9 veya 9:16 (örn: 1200x1920 px)
- 10 inç tablet: 16:9 veya 9:16 (örn: 1600x2560 px)

**Önerilen ekranlar:**
1. Ana sayfa (özet görünümü)
2. Ödemeler listesi
3. Ödeme detayı
4. Takvim görünümü
5. Gelirler listesi
6. Ayarlar (tema ve dil seçenekleri)

**Ekran görüntüsü nasıl alınır:**
- Manus UI'da Preview panelini açın
- Tarayıcınızın Developer Tools'unu açın (F12)
- Mobil görünüm seçin (375x667 veya 390x844)
- Ekran görüntüsü alın (Ctrl+Shift+S veya screenshot tool)

---

#### C) Kategori ve İletişim

**Uygulama kategorisi:**
- **Kategori:** Finans
- **Alt kategori:** Kişisel Finans

**İletişim bilgileri:**
- **E-posta:** [sizin-email@example.com]
- **Telefon:** (opsiyonel)
- **Web sitesi:** (opsiyonel)

---

### Adım 3: İçerik Derecelendirmesi

1. **"İçerik derecelendirmesi"** bölümüne gidin
2. **"Anketi başlat"** butonuna tıklayın
3. **Kategori:** Yardımcı programlar
4. **Sorular:**
   - Şiddet içeriği var mı? **Hayır**
   - Cinsel içerik var mı? **Hayır**
   - Küfür var mı? **Hayır**
   - Kumar var mı? **Hayır**
   - Uyuşturucu var mı? **Hayır**
   - Kullanıcı etkileşimi var mı? **Hayır**
   - Konum paylaşımı var mı? **Hayır**
   - Kişisel bilgi paylaşımı var mı? **Hayır**

5. **"Gönder"** → Derecelendirme otomatik hesaplanacak (muhtemelen **PEGI 3 / Everyone**)

---

### Adım 4: Hedef Kitle ve İçerik

**Hedef yaş grubu:**
- ✅ 18 yaş ve üzeri (finansal uygulama)

**Reklam içeriği:**
- ❌ Hayır, reklamım yok

**Veri güvenliği:**
1. **"Veri güvenliği"** bölümüne gidin
2. **Veri toplama:**
   - ❌ Uygulama kullanıcı verisi toplamıyor
3. **Veri paylaşımı:**
   - ❌ Uygulama veri paylaşmıyor
4. **Güvenlik uygulamaları:**
   - ✅ Veriler şifrelenir (cihazda)
   - ✅ Kullanıcı verileri silinebilir

---

### Adım 5: Gizlilik Politikası

1. **"Gizlilik politikası"** bölümüne gidin
2. **Privacy Policy URL'si girin:**

**Seçenek 1: GitHub Pages (Ücretsiz)**
- GitHub hesabınızda yeni repo oluşturun
- `PRIVACY_POLICY.md` dosyasını yükleyin
- Settings → Pages → Enable
- URL: `https://[kullaniciadi].github.io/[repo-adi]/PRIVACY_POLICY.md`

**Seçenek 2: Netlify (Ücretsiz)**
- [Netlify](https://netlify.com) hesabı oluşturun
- `PRIVACY_POLICY.md` dosyasını yükleyin
- URL: `https://[site-adi].netlify.app/PRIVACY_POLICY.md`

**Seçenek 3: Kendi web siteniz**
- Eğer web siteniz varsa, dosyayı oraya yükleyin

**Önemli:** E-posta adresini değiştirmeyi unutmayın!

---

### Adım 6: AAB Dosyasını Yükleme

#### A) Üretim Sürümü Oluşturma

1. **Sol menüden:** Üretim → Sürümler → **"Yeni sürüm oluştur"**

2. **App signing:**
   - Google Play App Signing'i etkinleştirin (önerilen)
   - Google otomatik olarak imzalama anahtarı oluşturacak

3. **AAB dosyasını yükleyin:**
   - Manus'tan indirdiğiniz `.aab` dosyasını sürükle-bırak yapın
   - Yükleme 2-5 dakika sürebilir

4. **Sürüm adı:**
   - **Sürüm adı:** 1.0.0
   - **Sürüm kodu:** 1 (otomatik gelir)

5. **Sürüm notları:**

**Türkçe (tr-TR):**
```
İlk sürüm! 🎉

✨ Özellikler:
• Ödeme ve gelir takibi
• Taksitli ödemeler
• Tekrarlayan ödemeler
• Takvim görünümü
• Günlük bildirimler
• Türkçe ve İngilizce dil desteği
• Açık/Koyu tema
• Tüm veriler cihazınızda güvende
```

**İngilizce (en-US):**
```
First release! 🎉

✨ Features:
• Payment and income tracking
• Installment payments
• Recurring payments
• Calendar view
• Daily notifications
• Turkish and English language support
• Light/Dark theme
• All data stored securely on your device
```

6. **"İncele"** butonuna tıklayın

---

#### B) Ülke/Bölge Seçimi

1. **"Ülkeler/bölgeler"** bölümüne gidin
2. **Tüm ülkeleri seç** veya manuel olarak seçin:
   - ✅ Türkiye (öncelik)
   - ✅ ABD
   - ✅ Avrupa ülkeleri
   - ✅ Diğer...

---

### Adım 7: İnceleme ve Yayınlama

1. **Sol menüden:** Üretim → **"İncelemeye gönder"**

2. **Eksik bilgileri kontrol edin:**
   - Store kaydı tamamlandı mı? ✅
   - Ekran görüntüleri yüklendi mi? ✅
   - İçerik derecelendirmesi yapıldı mı? ✅
   - Gizlilik politikası eklendi mi? ✅
   - AAB dosyası yüklendi mi? ✅

3. **"İncelemeye gönder"** butonuna tıklayın

4. **Bekleme süresi:**
   - Google incelemesi: **1-7 gün**
   - İlk uygulama: Genellikle 2-3 gün
   - E-posta bildirimi gelecek

---

## 🎨 Öne Çıkan Grafik Oluşturma (Feature Graphic)

Google Play **1024x500 px** boyutunda bir banner ister. Bu, uygulama sayfanızın en üstünde görünür.

**Tasarım önerileri:**
- Uygulama logosu (sol veya ortada)
- Uygulama adı: "Ödeme Takibi"
- Slogan: "Ödemelerinizi Takip Edin"
- Arka plan: Gradient (turkuaz-mavi)
- Ekran görüntüsü (opsiyonel)

**Araçlar:**
- [Canva](https://canva.com) (ücretsiz, şablon var)
- [Figma](https://figma.com) (ücretsiz)
- Adobe Photoshop

**Örnek içerik:**
```
[Logo] Ödeme Takibi
Tüm ödemelerinizi tek bir yerde yönetin
```

---

## ✅ Kontrol Listesi

Yayınlamadan önce kontrol edin:

- [ ] Google Play Console hesabı oluşturuldu ($25 ödendi)
- [ ] Uygulama oluşturuldu
- [ ] Store kaydı dolduruldu (ad, açıklama, simge)
- [ ] Ekran görüntüleri yüklendi (en az 2, ideal 4-8)
- [ ] Öne çıkan grafik yüklendi (1024x500 px)
- [ ] İçerik derecelendirmesi tamamlandı
- [ ] Hedef kitle ve içerik ayarları yapıldı
- [ ] Veri güvenliği formu dolduruldu
- [ ] Gizlilik politikası URL'si eklendi
- [ ] AAB dosyası yüklendi
- [ ] Sürüm notları eklendi (Türkçe ve İngilizce)
- [ ] Ülkeler/bölgeler seçildi
- [ ] İncelemeye gönderildi

---

## 🚀 Yayınlandıktan Sonra

### 1. Uygulama Linki

Uygulamanız yayınlandıktan sonra Google Play linkiniz:
```
https://play.google.com/store/apps/details?id=space.manus.odeme_takibi.t20260109002309
```

### 2. Güncelleme Yayınlama

Yeni özellikler ekledikten sonra güncelleme yayınlamak için:

1. Manus'ta yeni checkpoint oluşturun
2. Yeni AAB build alın (version code otomatik artacak)
3. Google Play Console → Üretim → Yeni sürüm oluştur
4. Yeni AAB'yi yükleyin
5. Sürüm notlarını güncelleyin
6. İncelemeye gönderin

### 3. İstatistikler

Google Play Console'da:
- İndirme sayıları
- Kullanıcı yorumları
- Çökme raporları
- Kullanıcı demografisi

---

## ❓ Sık Sorulan Sorular

**S: AAB dosyası nerede?**
C: Manus UI → Publish → Android → AAB → Build → İndir

**S: İnceleme ne kadar sürer?**
C: 1-7 gün, genellikle 2-3 gün

**S: Uygulama reddedilirse ne olur?**
C: Google e-posta gönderir, sorunu düzeltip tekrar gönderirsiniz

**S: Privacy Policy zorunlu mu?**
C: Evet, Google Play politikası gereği zorunlu

**S: Ekran görüntüleri nasıl alınır?**
C: Manus Preview → F12 → Mobil görünüm → Screenshot

**S: Öne çıkan grafik zorunlu mu?**
C: Evet, 1024x500 px boyutunda

**S: Ücret ne kadar?**
C: Sadece $25 (tek seferlik, geliştirici kaydı)

**S: Güncelleme nasıl yayınlanır?**
C: Yeni AAB build alıp Google Play Console'a yükleyin

---

## 📞 Destek

Sorun yaşarsanız:
- [Google Play Console Yardım](https://support.google.com/googleplay/android-developer)
- [Expo Docs](https://docs.expo.dev)
- Manus destek: help.manus.im

---

**İyi şanslar! 🎉**

Uygulamanız Google Play'de yayınlandığında bize de haber verin! 😊
