# Proje TODO Listesi

## Tasarım ve Yapılandırma
- [x] Uygulama logosu oluştur
- [x] app.config.ts dosyasını marka bilgileriyle güncelle
- [x] Tema renklerini finans uygulamasına uygun şekilde ayarla
- [x] Tab bar ikonlarını icon-symbol.tsx'e ekle

## Veri Modeli ve Depolama
- [x] Payment (Ödeme) veri tipini tanımla
- [x] Income (Gelir) veri tipini tanımla
- [x] Settings (Ayarlar) veri tipini tanımla
- [x] AsyncStorage yardımcı fonksiyonlarını oluştur
- [x] Context ve reducer yapısını kur

## Ekranlar ve Bileşenler
- [x] Ana Ekran (Home) - Özet kartı ve yaklaşan ödemeler
- [x] Ödemeler Ekranı - Tüm ödemeleri listeleme ve filtreleme
- [x] Gelirler Ekranı - Tüm gelirleri listeleme
- [x] Takvim Ekranı - Aylık takvim görünümü (temel yapı)
- [x] Ayarlar Ekranı - Bildirim ve tema ayarları
- [ ] Ödeme/Gelir Ekleme Ekranı - Form ekranı
- [ ] Detay Ekranı - Ödeme/gelir detayları

## Bileşenler
- [x] PaymentCard bileşeni - Ödeme kartı
- [x] IncomeCard bileşeni - Gelir kartı
- [x] SummaryCard bileşeni - Özet kartı
- [ ] CalendarView bileşeni - Takvim görünümü
- [ ] FormInput bileşenleri - Text, numeric, date picker
- [ ] StatusBadge bileşeni - Durum göstergesi

## Fonksiyonellik
- [x] Ödeme ekleme/düzenleme/silme işlemleri (Context API)
- [x] Gelir ekleme/düzenleme/silme işlemleri (Context API)
- [x] Ödeme durumu güncelleme (ödendi/ödenmedi)
- [ ] Sola kaydırma ile hızlı işlemler
- [x] Tarih hesaplamaları ve sıralama
- [x] Filtreleme ve kategori seçimi
- [x] Aylık özet hesaplamaları

## Bildirim Sistemi
- [x] expo-notifications kurulumu ve izin yönetimi
- [x] Yerel bildirim oluşturma fonksiyonu
- [x] Bildirim zamanlama (ödeme tarihine göre)
- [ ] Bildirime tıklayınca ilgili ekrana yönlendirme
- [x] Bildirim ayarlarını yönetme

## Test ve İyileştirme
- [x] Tüm kullanıcı akışlarını test et (temel fonksiyonlar)
- [x] Haptic feedback ekle (butonlarda)
- [ ] Animasyonları iyileştir
- [x] Hata durumlarını kontrol et
- [x] Dark mode uyumluluğunu test et

## Teslim
- [x] Checkpoint oluştur (v1.0)
- [x] Kullanıcıya teslim et (v1.0)
- [x] Checkpoint oluştur (v1.1 - Form ekranları)
- [x] Kullanıcıya teslim et (v1.1)
- [x] Checkpoint oluştur (v1.2 - Detay ekranları)
- [x] Kullanıcıya teslim et (v1.2)
- [x] Checkpoint oluştur (v1.3 - Takvim görünümü)
- [x] Kullanıcıya teslim et (v1.3)
- [x] Checkpoint oluştur (v1.4 - Geri dönme butonları)
- [x] Kullanıcıya teslim et (v1.4)
- [ ] Checkpoint oluştur (v1.5 - Son taksit tarihi)
- [ ] Kullanıcıya teslim et (v1.5)

## Yeni Özellikler (Kullanıcı İsteği)
- [x] Ödeme ekleme formu ekranı
- [x] Gelir ekleme formu ekranı
- [ ] Ödeme detay ve düzenleme ekranı
- [ ] Gelir detay ve düzenleme ekranı
- [x] Form input bileşenleri (TextInput, DatePicker, Picker)
- [ ] Silme onay dialogu
- [x] Form validasyonu

## Detay ve Düzenleme Ekranları (Yeni)
- [x] Ödeme detay ekranı oluştur
- [x] Gelir detay ekranı oluştur
- [x] Düzenleme modu ekle
- [x] Silme onay dialogu ekle
- [x] "Ödendi" olarak işaretleme butonu
- [x] Kart bileşenlerine tıklama olayı ekle

## Takvim Görünümü (Yeni)
- [x] Takvim bileşeni oluştur
- [x] Ay değiştirme butonları ekle
- [x] Ödemeleri takvimde göster (kırmızı nokta)
- [x] Gelirleri takvimde göster (yeşil nokta)
- [x] Tarihe tıklayınca o günün detaylarını göster
- [x] Bugünü vurgula
- [x] Takvim ekranını güncelle

## Geri Dönme Butonları (Kullanıcı İsteği)
- [x] Ödeme detay ekranına geri dönme butonu ekle
- [x] Gelir detay ekranına geri dönme butonu ekle
- [x] Ödeme ekleme ekranına geri dönme butonu ekle
- [x] Gelir ekleme ekranına geri dönme butonu ekle

## Son Taksit Tarihi (Kullanıcı İsteği)
- [x] Payment tipine endDate alanı ekle
- [x] Ödeme ekleme formuna son taksit tarihi alanı ekle
- [x] Ödeme düzenleme formuna son taksit tarihi alanı ekle
- [x] PaymentCard'da son taksit tarihini göster
- [x] Detay ekranında son taksit bilgisini göster
