# Ödeme Takibi - Kullanıcı Kılavuzu

**Ödeme Takibi**, kredi kartı taksitleri, kredi ödemeleri, diğer borçlar ve gelirlerinizi (düzenli ve düzenli olmayan) takip edebileceğiniz, ödeme günü yaklaştığında bildirim alan mobil uygulamadır.

## Özellikler

### ✅ Temel Özellikler
- **Ödeme Takibi**: Kredi kartı, kredi ve diğer ödemelerinizi kaydedin
- **Gelir Takibi**: Düzenli (maaş, kira) ve düzenli olmayan (bonus, proje) gelirlerinizi kaydedin
- **Aylık Özet**: Gelir, gider ve kalan bakiyenizi görüntüleyin
- **Yaklaşan Ödemeler**: Önümüzdeki 7 gün içindeki ödemeleri ana ekranda görün
- **Bildirimler**: Ödeme tarihi yaklaştığında otomatik bildirim alın
- **Kategori Filtreleme**: Ödemeleri ve gelirleri kategorilere göre filtreleyin
- **Yerel Veri Saklama**: Tüm verileriniz telefonunuzda güvenle saklanır

### 📱 Ekranlar

#### 1. Ana Sayfa
- Aylık özet kartı (toplam gelir, gider, bakiye)
- Yaklaşan ödemeler listesi
- Hızlı ödeme/gelir ekleme butonları
- Test verileri yükleme butonu (geliştirme amaçlı)

#### 2. Ödemeler
- Tüm ödemelerinizi görüntüleyin
- Kategorilere göre filtreleyin (Kredi Kartı, Kredi, Diğer)
- Ödeme durumlarını takip edin (Bekliyor, Ödendi, Gecikti)
- Taksit bilgilerini görün

#### 3. Gelirler
- Tüm gelirlerinizi görüntüleyin
- Düzenli ve düzenli olmayan gelirleri filtreleyin
- Tekrarlayan gelir bilgilerini görün

#### 4. Takvim
- Ödemelerinizi takvim görünümünde görüntüleyin (yakında eklenecek)

#### 5. Ayarlar
- Bildirim ayarları (açma/kapama, bildirim zamanı)
- Para birimi seçimi
- Tema seçimi (Açık/Koyu/Sistem)
- Test bildirimi gönderme
- Tüm verileri silme

## Kullanım

### İlk Kullanım

1. **Uygulamayı Açın**: Uygulama ilk açıldığında boş bir ekran göreceksiniz
2. **Test Verileri Yükleyin** (Opsiyonel): Ana sayfadaki "Test Verileri Yükle" butonuna basarak örnek verilerle uygulamayı test edebilirsiniz
3. **Bildirim İzni Verin**: Ayarlar > Bildirimler bölümünden bildirimleri açın

### Ödeme Ekleme

1. Ana sayfada "Ödeme Ekle" butonuna basın (şu an için Context API üzerinden çalışıyor, UI formu yakında eklenecek)
2. Alternatif olarak test verilerini yükleyerek örnek ödemeleri görebilirsiniz

### Gelir Ekleme

1. Ana sayfada "Gelir Ekle" butonuna basın (şu an için Context API üzerinden çalışıyor, UI formu yakında eklenecek)
2. Alternatif olarak test verilerini yükleyerek örnek gelirleri görebilirsiniz

### Bildirimler

- Ayarlar > Bildirimler bölümünden bildirimleri açın
- Varsayılan olarak ödeme tarihinden 3 gün önce bildirim alırsınız
- "Test Bildirimi Gönder" butonu ile bildirimlerin çalıştığını test edebilirsiniz

## Veri Yapısı

### Ödeme (Payment)
- İsim
- Tutar
- Kategori (Kredi Kartı, Kredi, Diğer)
- Ödeme Tarihi
- Durum (Bekliyor, Ödendi, Gecikti)
- Taksit Bilgisi (opsiyonel)
- Tekrarlama Bilgisi (opsiyonel)
- Notlar (opsiyonel)

### Gelir (Income)
- İsim
- Tutar
- Tip (Düzenli, Düzenli Olmayan)
- Tarih
- Tekrarlama Bilgisi (opsiyonel)
- Notlar (opsiyonel)

## Teknik Detaylar

### Teknoloji Stack
- **React Native 0.81** + **Expo SDK 54**
- **TypeScript 5.9**
- **NativeWind 4** (Tailwind CSS)
- **AsyncStorage** (Yerel veri saklama)
- **expo-notifications** (Bildirimler)
- **Context API** (State yönetimi)

### Veri Saklama
- Tüm veriler telefonda yerel olarak saklanır (AsyncStorage)
- Bulut senkronizasyonu yoktur
- Verileriniz sadece sizin telefonunuzda kalır

### Bildirimler
- Yerel bildirimler kullanılır
- Ödeme tarihinden ayarlanan gün kadar önce bildirim gönderilir
- Ödenen ödemeler için bildirim gönderilmez

## Gelecek Özellikler

- ✨ Ödeme/Gelir ekleme/düzenleme UI formları
- ✨ Detay ekranları
- ✨ Takvim görünümü (tam özellikli)
- ✨ Sola kaydırma ile hızlı işlemler
- ✨ Grafik ve istatistikler
- ✨ Veri yedekleme/geri yükleme
- ✨ Widget desteği

## Sorun Giderme

### Bildirimler Çalışmıyor
1. Ayarlar > Bildirimler bölümünden bildirimlerin açık olduğundan emin olun
2. Telefon ayarlarından uygulamaya bildirim izni verildiğinden emin olun
3. "Test Bildirimi Gönder" butonu ile test edin

### Veriler Kayboldu
- Uygulamayı silip yeniden yüklerseniz veriler kaybolur
- Veri yedekleme özelliği henüz eklenmemiştir

### Uygulama Çöküyor
- Uygulamayı kapatıp tekrar açın
- Gerekirse Ayarlar > Veri Yönetimi > Tüm Verileri Sil ile verileri sıfırlayın

## Destek

Herhangi bir sorun veya öneri için lütfen geliştirici ile iletişime geçin.

---

**Versiyon**: 1.0.0  
**Son Güncelleme**: Ocak 2026
