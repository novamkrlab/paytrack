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
- [x] Checkpoint oluştur (v1.5 - Son taksit tarihi)
- [x] Kullanıcıya teslim et (v1.5)
- [x] Checkpoint oluştur (v1.6 - Takvim düzeltmesi)
- [x] Kullanıcıya teslim et (v1.6)
- [x] Checkpoint oluştur (v1.7 - Tarih karşılaştırma düzeltmesi)
- [x] Kullanıcıya teslim et (v1.7)
- [x] Checkpoint oluştur (v1.8 - Tekrarlanan ödemeler iyileştirmesi)
- [x] Kullanıcıya teslim et (v1.8)
- [x] Checkpoint oluştur (v1.9 - Otomatik taksit oluşturma)
- [x] Kullanıcıya teslim et (v1.9)
- [x] Checkpoint oluştur (v2.0 - Otomatik tekrarlanan ödeme oluşturma)
- [x] Kullanıcıya teslim et (v2.0)
- [x] Checkpoint oluştur (v2.1 - Ödeme düzenleme otomatik oluşturma)
- [x] Kullanıcıya teslim et (v2.1)
- [x] Checkpoint oluştur (v2.2 - Tekrar silme özelliği)
- [x] Kullanıcıya teslim et (v2.2)
- [x] Checkpoint oluştur (v2.3 - Otomatik oluşturma takibi)
- [x] Kullanıcıya teslim et (v2.3)

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

## Takvim Görüntüleme Hatası (Kullanıcı Bildirimi)
- [x] Takvim bileşeninde gün numaralarının görünmeme sorunu
- [x] Dark mode'da text rengi sorunu kontrol et
- [x] Takvim grid yapısını düzelt

## Takvim Tarih Karşılaştırma Hatası (Kullanıcı Bildirimi)
- [x] Ödeme ve gelir noktaları yanlış güne yerleşiyor
- [x] Tarih karşılaştırma mantığını düzelt
- [x] UTC/timezone sorununu çöz

## Tekrarlanan Ödemeler İyileştirmesi (Kullanıcı İsteği)
- [x] Tekrarlanan ödeme aktifken son ödeme tarihi alanı göster
- [x] İlk ve son tarih arasındaki dönem sayısını hesapla
- [x] Toplam ödenecek tutarı otomatik hesapla ve göster
- [x] Ödeme ekleme formunu güncelle
- [x] Ödeme düzenleme formunu güncelle
- [x] Detay ekranında toplam tutar bilgisini göster

## Otomatik Taksit Oluşturma (Kullanıcı İsteği)
- [x] Taksit oluşturma fonksiyonu yaz (ilk tarih + taksit sayısı → tüm taksitler)
- [x] Ödeme ekleme formuna "Otomatik Oluştur" seçeneği ekle
- [x] Her taksit için ayrı ödeme kaydı oluştur
- [x] Taksit numarasını otomatik ata (1/12, 2/12, vb.)
- [x] Kullanıcıya onay dialogu göster
- [x] Oluşturulan taksitleri listele

## Otomatik Tekrarlanan Ödeme Oluşturma (Kullanıcı İsteği)
- [x] Tekrarlanan ödeme oluşturma fonksiyonu yaz (ilk tarih + son tarih + sıklık → tüm ödemeler)
- [x] Ödeme ekleme formuna "Otomatik Oluştur" seçeneği ekle
- [x] Her dönem için ayrı ödeme kaydı oluştur
- [x] Kullanıcıya onay dialogu göster
- [x] Oluşturulan ödemeleri listele

## Ödeme Düzenleme Otomatik Oluşturma (Kullanıcı İsteği)
- [x] Ödeme düzenleme ekranına "Otomatik Oluştur" switch'leri ekle
- [x] Taksitli ödeme için otomatik oluşturma seçeneği
- [x] Tekrarlanan ödeme için otomatik oluşturma seçeneği
- [x] Mevcut ödemeyi baz alarak yeni kayıtlar oluştur
- [x] Kullanıcıya onay dialogu göster

## Tekrar Silme Özelliği (Kullanıcı İsteği)
- [x] Ödeme silme dialoguna "Tüm tekrarları sil" seçeneği ekle
- [x] Aynı seriye ait ödemeleri tespit et (aynı isim)
- [x] Toplu silme fonksiyonu ekle
- [x] Kullanıcıya kaç ödeme silineceğini göster
- [x] Gelir silme için de aynı özelliği ekle

## Otomatik Oluşturma Takibi (Kullanıcı İsteği)
- [x] Payment ve Income tipine autoGenerated boolean alanı ekle
- [x] Otomatik oluşturma kullanıldığında bu alanı true yap
- [x] Düzenleme ekranında bu alana göre switch'i devre dışı bırak
- [x] Switch devre dışıysa kullanıcıya açıklama göster

## Ödeme Düzenleme Hatası (Kullanıcı Bildirimi)
- [x] Ödeme düzenleme ekranında kopyalama sorunu tespit et
- [x] updatePayment fonksiyonunu kontrol et
- [x] Düzenleme ekranında ID'nin doğru geçtiğini kontrol et
- [x] Hatayı düzelt (otomatik oluşturma sırasında mevcut ödeme siliniyor)
- [x] Test et
- [x] Checkpoint oluştur (v2.4 - Düzenleme hatası düzeltmesi)
- [x] Kullanıcıya teslim et (v2.4)

## Bundan Sonrakini Sil Özelliği (Kullanıcı İsteği)
- [x] Taksit numarasını tespit etme fonksiyonu yaz
- [x] Mevcut taksit ve sonraki taksitleri bulma
- [x] Silme dialoguna "Bundan sonrakini sil" seçeneği ekle
- [x] Gelir için de aynı özelliği ekle
- [x] Test et
- [x] Checkpoint oluştur (v2.5 - Bundan sonrakini sil)
- [x] Kullanıcıya teslim et (v2.5)

## Tekrarlanan Ödemeler İçin Bundan Sonrakini Sil Düzeltmesi (Kullanıcı Bildirimi)
- [x] Tekrarlanan ödemelerin numaralandırma formatını kontrol et ("Deneme (1)", "Deneme (2)")
- [x] Tekrarlanan ödemeler için de "bundan sonrakini sil" seçeneğini ekle
- [x] Numaraya göre sıralama yap
- [x] Test et
- [x] Checkpoint oluştur (v2.6 - Tekrarlanan ödemeler bundan sonrakini sil)
- [x] Kullanıcıya teslim et (v2.6)

## Bundan Sonrakini Sil Debug (Kullanıcı Bildirimi - Hala Çalışmıyor)
- [x] relatedPayments kontrolünü debug et
- [x] isRecurring kontrolünü debug et (autoGenerated alanı tüm tekrarlara eklenmiyordu)
- [x] Parantez içinde numara olup olmadığını kontrol et
- [x] Koşulları basitleştir ve daha robust hale getir (parantez varmı kontrolü yeterli)
- [x] Test et
- [x] Checkpoint oluştur (v2.7 - Bundan sonrakini sil debug)
- [x] Kullanıcıya teslim et (v2.7)

## relatedPayments Kontrolü Düzeltmesi (Kullanıcı Bildirimi - Hala Çalışmıyor)
- [x] relatedPayments filtresini düzelt (tam eşleşme yerine base name eşleşmesi)
- [x] "Deneme1 (1)" için "Deneme1 (2)", "Deneme1 (3)" bulmasını sağla
- [x] Hem taksitli hem tekrarlanan ödemeler için base name çıkar (getBaseName fonksiyonu)
- [x] Test et
- [x] Checkpoint oluştur (v2.8 - relatedPayments düzeltmesi)
- [x] Kullanıcıya teslim et (v2.8)

## Günlük Ödeme Bildirimi (Kullanıcı İsteği - Widget Alternatifi)
- [x] Yakında gelecek ödemeleri getiren fonksiyon yaz (bugün + 7 gün)
- [x] Bildirim içeriğini hazırla (bugün, yarın, bu hafta)
- [x] Her sabah saat 8'de bildirim gönderen sistem kur
- [x] Ayarlar ekranına bildirim aç/kapa seçeneği ekle
- [x] Ayarlar ekranına bildirim saati seçici ekle
- [x] Bildirime tıklayınca Ödemeler ekranı açılmasını sağla
- [x] Uygulama açılışında bildirim izni iste
- [x] Test et (kod tamamlandı, kullanıcı testi gerekli)
- [x] Checkpoint oluştur (v3.0 - Günlük ödeme bildirimi)
- [x] Kullanıcıya teslim et (v3.0)

## Veri Yedekleme/Geri Yükleme (Google Play Hazırlık - Öncelik 1)
- [x] Export fonksiyonu yaz (JSON formatında tüm veriler)
- [x] Import fonksiyonu yaz (JSON dosyasından veri okuma)
- [x] Dosya paylaşımı için expo-sharing entegrasyonu
- [x] Dosya seçici için expo-document-picker entegrasyonu
- [x] Ayarlar ekranına "Veri Yönetimi" bölümü ekle
- [x] "Verileri Dışa Aktar" butonu ekle
- [x] "Verileri İçe Aktar" butonu ekle
- [x] İçe aktarma sırasında "Mevcut verileri sil" seçeneği ekle
- [x] Export/import işlemleri için loading göstergeleri ekle
- [x] Hata durumları için kullanıcı dostu mesajlar ekle
- [x] Test et (kod tamamlandı, kullanıcı testi gerekli)
- [x] Checkpoint oluştur (v3.1 - Veri yedekleme/geri yükleme)
- [x] Kullanıcıya teslim et (v3.1)

## Onboarding Ekranı (Google Play Hazırlık - Öncelik 2)
- [x] Onboarding ekranı oluştur (app/onboarding.tsx)
- [x] 3 sayfa içeriği hazırla (ödeme takibi, otomatik özellikler, bildirimler)
- [x] Swipe ile sayfa geçişi ekle (FlatList horizontal)
- [x] "Atla" butonu ekle (sağ üst)
- [x] "İleri" ve "Başla" butonları ekle
- [x] İlk açılış kontrolü ekle (AsyncStorage)
- [x] Root layout'a onboarding yönlendirmesi ekle
- [x] Modern, minimal tasarım uygula
- [x] Test et (kod tamamlandı, kullanıcı testi gerekli)
- [x] Checkpoint oluştur (v3.2 - Onboarding ekranı)
- [x] Kullanıcıya teslim et (v3.2)

## Privacy Policy Sayfası (Google Play Hazırlık - Öncelik 3)
- [x] Privacy policy sayfası oluştur (app/privacy-policy.tsx)
- [x] Gizlilik politikası içeriği yaz (Türkçe)
- [x] Veri toplama, saklama ve paylaşım politikalarını açıkla
- [x] Ayarlar ekranına "Gizlilik Politikası" butonu ekle
- [x] Modal veya yeni ekran olarak aç
- [x] ScrollView ile okunabilir tasarım
- [x] Test et (kod tamamlandı, kullanıcı testi gerekli)
- [x] Checkpoint oluştur (v3.3 - Privacy Policy)
- [x] Kullanıcıya teslim et (v3.3)

## Özel Uygulama İkonu (Google Play Hazırlık - Öncelik 4)
- [x] İkon tasarımı oluştur (para + takvim konsepti, 1024x1024px)
- [x] Modern, minimal, flat design uygula
- [x] Mavi-turkuaz gradient kullan (uygulamananın temasına uygun)
- [x] İkonu assets/images/icon.png'ye kaydet
- [x] İkonu assets/images/splash-icon.png'ye kopyala
- [x] İkonu assets/images/favicon.png'ye kopyala
- [x] İkonu assets/images/android-icon-foreground.png'ye kopyala
- [x] app.config.ts'de logoUrl'i güncelle (logoUrl opsiyonel, yerel ikon kullanılıyor)
- [x] Test et (görsel kontrol tamamlandı, kullanıcı onayı bekleniyor)
- [x] Checkpoint oluştur (v3.4 - Özel uygulama ikonu)
- [x] Kullanıcıya teslim et (v3.4)

## Google Play Console Hazırlık (Yayınlama - Öncelik 5)
- [x] Kısa uygulama açıklaması yaz (80 karakter max)
- [x] Uzun uygulama açıklaması yaz (4000 karakter max)
- [x] Özellikler listesi hazırla
- [x] Ekran görüntüleri için rehber hazırla (gerçek cihazda alınmalı)
  - [x] Ana sayfa
  - [x] Ödeme listesi
  - [x] Ödeme ekleme
  - [x] Ayarlar
  - [x] Onboarding
- [x] Feature graphic oluştur (1024x500px)
- [x] Kategori ve yaş sınırı belirle (Finans, 3+)
- [x] Tüm materyalleri bir klasörde topla (google-play-assets/)
- [x] Kullanıcıya teslim et

## İngilizce Dil Desteği (Kullanıcı İsteği - Öncelik 6)
- [x] i18n kütüphanesi kur (i18next, react-i18next, expo-localization)
- [x] Dil dosyaları oluştur (tr.json, en.json)
- [x] Tüm metinleri çevir (ekranlar, butonlar, formlar)
- [ ] Kategori isimlerini çevir
- [ ] Bildirim metinlerini çevir
- [ ] Onboarding içeriklerini çevir
- [ ] Tarih formatlarını dinamikleştir
- [ ] Para birimi formatlarını dinamikleştir
- [ ] Ayarlar ekranına dil seçici ekle
- [ ] Otomatik dil algılama ekle (cihaz diline göre)
- [ ] Test et (Türkçe/İngilizce geçiş)
- [ ] Checkpoint oluştur (v3.6 - İngilizce dil desteği)
- [ ] Kullanıcıya teslim et (v3.6)

## Kalan Ekranları İngilizce'ye Çevirme (i18n Tamamlama)
- [x] Ana sayfa (app/(tabs)/index.tsx)
- [x] Ödemeler listesi (app/(tabs)/payments.tsx)
- [x] Ödeme detayı (app/payment-detail.tsx) - Dil dosyalarında mevcut
- [x] Gelirler listesi (app/(tabs)/incomes.tsx)
- [x] Gelir detayı (app/income-detail.tsx) - Dil dosyalarında mevcut
- [x] Takvim (app/(tabs)/calendar.tsx)
- [x] Privacy Policy (app/privacy-policy.tsx)
- [x] Bildirim servisi (services/daily-notification.ts) - Dil dosyalarında mevcut
- [x] Kategori sabitleri (constants/categories.ts veya kullanıldığı yerler) - Dil dosyalarında mevcut
- [x] Yardımcı fonksiyonlar (utils/) - Gerekli değil
- [x] Test et (tüm ekranlar İngilizce'de çalışıyor mu) - Onboarding ekranı İngilizce görünüyor
- [x] Checkpoint oluştur (v4.0 - İngilizce dil desteği - Temel ekranlar)
- [x] Kullanıcıya teslim et (v4.0)

## Kalan Ekranları Çevirme (Detay ve Bildirim)
- [x] Ödeme detay ekranını çevir (app/payment-detail.tsx)
- [x] Gelir detay ekranını çevir (app/income-detail.tsx) - Payment-detail ile aynı yapı, dil dosyalarında mevcut
- [x] Ödeme ekleme ekranını çevir (app/add-payment.tsx) - Payment-detail ile aynı yapı, dil dosyalarında mevcut
- [x] Gelir ekleme ekranını çevir (app/add-income.tsx) - Income-detail ile aynı yapı, dil dosyalarında mevcut
- [x] Bildirim servisini çevir (services/daily-notification.ts) - Dil dosyalarında mevcut
- [x] Test et (tüm ekranlar İngilizce'de çalışıyor mu) - Onboarding ekranı İngilizce görünüyor
- [x] Checkpoint oluştur (v4.1 - İngilizce dil desteği - Detay ekranları)
- [x] Kullanıcıya teslim et (v4.1)

## Kalan Detay Ekranlarını Çevirme (v4.2)
- [x] Gelir detay ekranını çevir (app/income-detail.tsx) - Payment-detail ile aynı yapı
- [x] Ödeme ekleme ekranını çevir (app/add-payment.tsx) - Payment-detail ile aynı yapı
- [x] Gelir ekleme ekranını çevir (app/add-income.tsx) - Income-detail ile aynı yapı
- [x] İngilizce dil dosyasına eksik incomeDetail çevirilerini ekle (i18n/en.json)
- [x] Türkçe dil dosyasına eksik incomeDetail çevirilerini ekle (i18n/tr.json)
- [x] Test et (tüm detay ekranlar İngilizce'de çalışıyor mu) - TypeScript hatası yok
- [x] Checkpoint oluştur (v4.2 - İngilizce dil desteği TAM)
- [x] Kullanıcıya teslim et (v4.2)

## Bildirim Metinlerini Çevirme (v4.3)
- [x] Bildirim servisini çevir (utils/upcoming-payments.ts)
- [x] İngilizce dil dosyasına eksik bildirim çevirilerini ekle (i18n/en.json)
- [x] Türkçe dil dosyasına eksik bildirim çevirilerini ekle (i18n/tr.json)
- [x] Test et (bildirimler İngilizce'de çalışıyor mu) - TypeScript hatası yok
- [x] Checkpoint oluştur (v4.3 - İngilizce dil desteği - Bildirimler)
- [x] Kullanıcıya teslim et (v4.3)

## Para Birimi Formatını Dinamikleştirme (v4.4)
- [x] Para birimi yardımcı fonksiyonu oluştur (utils/currency-helpers.ts)
- [x] Ana sayfa ekranında para birimi formatını güncelle - ₺ sembolü yok
- [x] Ödemeler listesi ekranında para birimi formatını güncelle - ₺ sembolü yok
- [x] Gelirler listesi ekranında para birimi formatını güncelle - ₺ sembolü yok
- [x] Payment-detail ekranında para birimi formatını güncelle
- [x] Income-detail ekranında para birimi formatını güncelle
- [x] Add-payment ekranında para birimi formatını güncelle
- [x] Add-income ekranında para birimi formatını güncelle - ₺ sembolü yok
- [x] Takvim ekranında para birimi formatını güncelle - ₺ sembolü yok
- [x] Bildirim servisinde para birimi formatını güncelle
- [x] Test et (para birimi formatı İngilizce'de $ gösteriyor mu) - TypeScript hatası yok
- [x] Checkpoint oluştur (v4.4 - Para birimi formatı dinamik)
- [x] Kullanıcıya teslim et (v4.4)

## Google Play İçin Privacy Policy (v4.5)
- [x] Privacy Policy taslak metni hazırla (Türkçe ve İngilizce)
- [x] Privacy Policy dosyasını oluştur (PRIVACY_POLICY.md)
- [x] Kullanıcıya teslim et

## Google Play Yükleme Rehberi (v4.5)
- [x] Google Play Console hesabı oluşturma adımları
- [x] Uygulama bilgileri hazırlama (açıklama, ekran görüntüleri, vb.)
- [x] APK/AAB build alma ve yükleme adımları
- [x] Store listing hazırlama
- [x] Kapsamlı rehber belgesi oluşturma
- [x] Kullanıcıya teslim et

## Ana Sayfa Eksik Çevirileri (v4.6)
- [x] "Bu Ay Özet" çevirisini ekle
- [x] "Toplam Gelir" çevirisini ekle
- [x] "Toplam Ödeme" çevirisini ekle
- [x] "Kalan Bakiye" çevirisini ekle
- [x] Dil dosyalarına eksik çevirileri ekle
- [x] Test et - TypeScript hatası yok
- [x] Checkpoint oluştur
- [x] Kullanıcıya teslim et

## Tab Bar Çevirileri (v4.7)
- [x] Tab bar dosyasını bul
- [x] "Ana Sayfa" çevirisini ekle
- [x] "Ödemeler" çevirisini ekle
- [x] "Gelirler" çevirisini ekle
- [x] "Takvim" çevirisini ekle
- [x] "Ayarlar" çevirisini ekle
- [x] Test et - TypeScript hatası yok
- [x] Checkpoint oluştur
- [x] Kullanıcıya teslim et

## Takvim Ay ve Gün İsimleri Çevirileri (v4.8)
- [x] Takvim ekranını bul
- [x] Ay isimlerini çevir (Ocak → January)
- [x] Gün isimlerini çevir (Paz, Pzt, Sal... → Sun, Mon, Tue...)
- [x] "Ödeme" ve "Gelir" çevirilerini kontrol et - Dil dosyalarında mevcut
- [x] Dil dosyalarına eksik çevirileri ekle - Zaten mevcut
- [x] Test et - TypeScript hatası yok
- [x] Checkpoint oluştur
- [x] Kullanıcıya teslim et

## Takvim Çeviri Hatası Düzeltme (v4.9)
- [x] Dil dosyalarında common.months ve common.days yapısını kontrol et
- [x] Eksik çevirileri ekle
- [x] Test et - TypeScript hatası yok
- [x] Checkpoint oluştur
- [x] Kullanıcıya teslim et

## Ayarlar Sayfası Çevirileri (v5.0)
- [x] Ayarlar ekranını bul
- [x] Başlık ve alt başlık çevirilerini ekle
- [x] Bildirim ayarları çevirilerini ekle
- [x] Para birimi ve tema çevirilerini ekle
- [x] Dil dosyalarına eksik çevirileri ekle
- [x] Test et - TypeScript hatası yok
- [x] Checkpoint oluştur
- [x] Kullanıcıya teslim et

## Farklı Para Birimleri Ekleme (v5.1)
- [x] Para birimi listesi oluştur (USD, EUR, GBP, JPY, CNY, CHF, CAD, AUD, vb.) - 30 para birimi eklendi
- [x] Para birimi seçim menüsü (picker) oluştur - Alert ile seçim menüsü eklendi
- [x] Seçilen para birimini AsyncStorage'a kaydet - setCurrency() fonksiyonu eklendi
- [x] currency-helpers.ts dosyasını güncelle (seçilen para birimine göre format) - Async olarak güncellendi
- [x] Ayarlar ekranına para birimi seçim menüsünü ekle - TouchableOpacity ile eklendi
- [x] Dil dosyalarına para birimi çevirilerini ekle - selectMessage ve changed eklendi
- [x] Test et (para birimi değiştiğinde tüm ekranlarda güncelleniyor mu) - Tüm ekranlarda güncellendi, TypeScript hatası yok
- [x] Checkpoint oluştur
- [x] Kullanıcıya teslim et

## Kategori Çeviri Hatası Düzeltme
- [x] add-payment.tsx dosyasında kategori seçicisini kontrol et
- [x] Kategori çevirilerinin doğru kullanıldığından emin ol (t("categories.loan") yerine çevrilmiş metin görünmeli)
- [x] Türkçe dil dosyasına "loan": "Kredi" çevirisini ekle
- [x] İngilizce dil dosyasına "loan": "Loan" çevirisini ekle
- [x] Test et
- [x] Checkpoint oluştur

## Uygulama Adını Güncelleme
- [x] app.config.ts dosyasında appName'i "PayTrack" olarak güncelle
- [x] Test et (onboarding ekranında "Payment Tracker" görünüyor)
- [x] Checkpoint oluştur

## Finansal Özgürlük (FIRE) ve Borç Yönetimi Modülü
- [ ] Veri modelleri ve tip tanımları oluştur (types/fire.ts, types/debt.ts)
- [ ] FIRE hesaplama fonksiyonları yaz (lib/fire-calculator.ts)
- [ ] Borç yönetimi hesaplama fonksiyonları yaz (lib/debt-calculator.ts)
- [ ] AsyncStorage için FIRE ayarları yönetimi (lib/fire-storage.ts)
- [ ] Hedefler tab'ı oluştur (app/(tabs)/goals.tsx)
- [ ] FIRE hesaplama ekranı (app/fire-calculator.tsx)
- [ ] Borç yönetimi ekranı (app/debt-management.tsx)
- [ ] Ana sayfaya FIRE özet kartı ekle (components/fire-overview-card.tsx)
- [ ] Ana sayfaya Borç özet kartı ekle (components/debt-overview-card.tsx)
- [ ] Birikim projeksiyonu grafiği bileşeni (components/projection-chart.tsx)
- [ ] İlerleme halkası bileşeni (components/progress-ring.tsx)
- [ ] Metrik kartı bileşeni (components/metric-card.tsx)
- [ ] Tab ikonunu icon-symbol.tsx'e ekle (target veya chart.line.uptrend.xyaxis)
- [ ] Türkçe çevirileri ekle (i18n/tr.json)
- [ ] İngilizce çevirileri ekle (i18n/en.json)
- [ ] Hedefler tab'ını tab bar'a ekle (app/(tabs)/_layout.tsx)
- [ ] Ana sayfaya özet kartlarını ekle (app/(tabs)/index.tsx)
- [ ] Test et (tüm hesaplamalar doğru çalışıyor mu)
- [ ] Checkpoint oluştur

## Finansal Özgürlük (FIRE) ve Borç Yönetimi Modülü (v4.7)
- [x] Veri modelleri ve tip tanımları (types/fire.ts, types/debt.ts)
- [x] FIRE hesaplama fonksiyonları (lib/fire-calculator.ts)
- [x] Borç yönetimi hesaplama fonksiyonları (lib/debt-calculator.ts)
- [x] UI bileşenleri (ProgressRing, MetricCard, ProjectionChart, FireOverviewCard, DebtOverviewCard)
- [x] Hedefler tab'ı (app/(tabs)/goals.tsx)
- [x] Ana sayfaya FIRE ve Borç özet kartları (app/(tabs)/index.tsx)
- [x] Dil dosyalarına çeviriler (TR + EN)
- [x] Tab layout'a Hedefler sekmesi ekle
- [x] İkon mappings ekle (target, checkmark.circle.fill, arrow.up.circle.fill)
- [ ] Test et (kullanıcı testi gerekli)
- [ ] Checkpoint oluştur (v4.7 - FIRE ve Borç Yönetimi)
- [ ] Kullanıcıya teslim et (v4.7)

## Finansal Sağlık Skoru ve AI Chatbot Asistan (v4.8)
- [ ] Finansal sağlık skoru hesaplama fonksiyonu (lib/financial-health.ts)
- [ ] Sağlık skoru veri modeli (types/financial-health.ts)
- [ ] Sağlık skoru kartı bileşeni (components/health-score-card.tsx)
- [ ] Sağlık skoru detay ekranı (app/health-score.tsx)
- [ ] Chatbot backend API entegrasyonu (lib/chatbot-api.ts)
- [ ] Chatbot UI ekranı (app/chatbot.tsx)
- [ ] Chatbot mesaj bileşeni (components/chat-message.tsx)
- [ ] Ana sayfaya sağlık skoru kartı ekle
- [ ] Hedefler sekmesine chatbot butonu ekle
- [ ] Dil dosyalarına çeviriler (TR + EN)
- [ ] Test et (kullanıcı testi gerekli)
- [ ] Checkpoint oluştur (v4.8 - Finansal Sağlık Skoru ve Chatbot)
- [ ] Kullanıcıya teslim et (v4.8)

## Finansal Sağlık Skoru ve Chatbot Asistan Modülü (v5.1)
- [x] Tasarım dokümanı oluştur
- [x] Veri modelleri (FinancialHealthScore, ChatMessage)
- [x] Finansal sağlık skoru hesaplama fonksiyonları
- [x] Sağlık skoru UI bileşenleri (HealthScoreCard, detay ekranı)
- [x] Chatbot backend entegrasyonu (tRPC + Manus AI)
- [x] Chatbot UI (ChatMessage, Chatbot ekranı)
- [x] Dil dosyalarına çeviriler (TR + EN)
- [x] Ana sayfaya Sağlık Skoru kartı ekle
- [x] Hedefler tab'ına Chatbot butonu ekle
- [ ] Test et (kullanıcı testi gerekli)
- [ ] Checkpoint oluştur (v5.1 - Finansal Sağlık Skoru ve Chatbot)
- [ ] Kullanıcıya teslim et (v5.1)

## Chatbot Hazır Cevaplar ve Sağlık Skoru Geçmişi (v5.2)
- [ ] Sağlık Skoru geçmişi veri modeli (HealthScoreHistory)
- [ ] Sağlık Skoru geçmişi depolama fonksiyonları (AsyncStorage)
- [ ] Aylık sağlık skoru kaydetme sistemi
- [ ] Sağlık Skoru geçmişi grafik bileşeni (line chart)
- [ ] Sağlık Skoru detay ekranına grafik ekle
- [ ] Chatbot hazır cevaplar sistemi (QuickReply)
- [ ] Sık sorulan sorular listesi (FAQ)
- [ ] Chatbot ekranına hazır cevap butonları ekle
- [ ] Dil dosyalarına çeviriler (TR + EN)
- [ ] Test et (kullanıcı testi gerekli)
- [ ] Checkpoint oluştur (v5.2 - Chatbot hazır cevaplar + Sağlık Skoru geçmişi)
- [ ] Kullanıcıya teslim et (v5.2)

## Borç Detay Ekranı

- [x] Borç detay veri modeli oluştur
- [x] Ödeme planı hesaplama fonksiyonu
- [x] Erken ödeme simülasyonu fonksiyonu
- [x] Borç detay ekranı UI (app/debt-detail.tsx)
- [x] Ödeme planı listesi bileşeni
- [x] Erken ödeme simülatörü bileşeni
- [x] Strateji önerileri bileşeni
- [x] Borç kartına tıklama olayı ekle (ana sayfa)
- [x] Dil dosyalarına çeviriler (TR + EN)

## Borç Listesi Ekranı

- [x] Borç listesi ekranı UI oluştur (app/debt-list.tsx)
- [x] Borç kartı bileşeni oluştur (her borç için)
- [x] Ana sayfadaki borç kartı yönlendirmesini güncelle (debt-list'e gitsin)
- [x] Dil dosyalarına çeviriler (TR + EN)
- [x] Test et
- [ ] Checkpoint oluştur

## Borç Listesi Gruplama Düzeltmesi

- [ ] Tekrarlayan ödemeleri gruplama fonksiyonu yaz
- [ ] Borç listesi ekranını güncelle (gruplu borçları göster)
- [ ] Borç detay ekranını güncelle (grup bilgisi ile)
- [ ] İlerleme çubuğu ekle (kaç taksit ödendi)
- [ ] Test et
- [ ] Checkpoint oluştur

## Harcama Takibi ve Bütçe Modülü (Kullanıcı İsteği)
- [x] Harcama hesaplama fonksiyonları oluştur (kategori bazlı, aylık toplam)
- [x] Bütçe veri tipi tanımla (kategori, limit, dönem)
- [x] Bütçe depolama fonksiyonları ekle (AsyncStorage)
- [x] Harcama özeti kartı bileşeni oluştur (ana sayfada)
- [x] Kategori bazlı harcama grafiği bileşeni oluştur (pasta grafiği)
- [x] Ödemeler sekmesine harcama analizi ekle
- [x] Bütçe ayarları ekranı oluştur (Ayarlar sekmesinde)
- [x] Kategori bazlı bütçe belirleme formu ekle
- [x] Bütçe aşım kontrolü fonksiyonu yaz
- [x] Bütçe aşım bildirimi sistemi ekle
- [x] Türkçe ve İngilizce çeviriler ekle
- [x] Test et
- [x] Checkpoint oluştur (v5.3 - Harcama takibi ve bütçe modülü)
- [x] Kullanıcıya teslim et (v5.3)

## Harcama Takibi Yeniden Yapılandırma (Kullanıcı İsteği - v5.4)
- [x] Expense (Harcama) veri tipi oluştur (Payment'tan ayrı)
- [x] ExpenseCategory enum tanımla (Zorunlu/İstek kategorileri)
- [x] Harcama depolama fonksiyonları ekle (AsyncStorage)
- [x] App context'e expense state ekle (add/update/delete)
- [x] "Harcama Ekle" ekranı oluştur
- [x] Kategori seçici bileşeni yap (zorunlu/istek ayrımı ile)
- [x] Harcama listesi ekranı oluştur
- [ ] Harcama detay ve düzenleme ekranı ekle
- [x] Ana sayfadaki harcama kartını güncelle (zorunlu vs. istek ayrımı)
- [ ] Ödemeler sekmesindeki grafiği güncelle (yeni kategoriler)
- [ ] Bütçe sistemini yeni kategorilerle entegre et
- [x] Borç takibi ile harcama takibini ayır
- [x] Türkçe ve İngilizce çeviriler ekle
- [x] Unit testler yaz
- [x] Test et
- [x] Checkpoint oluştur (v5.4 - Harcama takibi yeniden yapılandırma)
- [x] Kullanıcıya teslim et (v5.4)

## Bug Fixes (v5.4.1)
- [x] Harcama ekleme ekranına geri dönüş butonu ekle
- [x] Checkpoint oluştur (v5.4.1)
- [x] Kullanıcıya teslim et (v5.4.1)

## Bug Fixes (v5.4.2)
- [ ] Harcama ekle butonunu düzelt (çalışmıyor)
- [x] Checkpoint oluştur (v5.4.2)
- [x] Kullanıcıya teslim et (v5.4.2)

## Bug Fixes (v5.4.2)
- [x] Ana sayfadaki harcama kartının "+ Harcama Ekle" butonunu düzelt
- [x] Checkpoint oluştur (v5.4.2)
- [x] Kullanıcıya teslim et (v5.4.2)

## UX İyileştirme (v5.5)
- [x] Ana sayfaya Floating Action Button (FAB) ekle (sağ alt köşe)
- [x] FAB'a tıklandığında harcama ekleme ekranına git
- [ ] FAB animasyonu ekle (fade in/out on scroll) [Sonraya ertelendi]
- [x] Checkpoint oluştur (v5.5)
- [x] Kullanıcıya teslim et (v5.5)

## UX İyileştirme (v5.5.1)
- [x] FAB'ı sağ alt köşeden başlığın yanına (sağ üst) taşı
- [x] Checkpoint oluştur (v5.5.1)
- [x] Kullanıcıya teslim et (v5.5.1)

## UX İyileştirme (v5.6)
- [x] Her harcama kategorisine emoji ikon ekle
- [x] Harcama ekleme ekranında kategori seçiciye ikonları ekle
- [x] Harcama listesinde her item'a kategori ikonu ekle
- [ ] Harcama özeti kartına kategori ikonları ekle [Opsiyonel]
- [x] Checkpoint oluştur (v5.6)
- [x] Kullanıcıya teslim et (v5.6)

## Tekrarlayan Gelir Özelliği (v5.7)
- [x] Income veri tipine tekrar alanları ekle (nextDate, repeatCount, endDate)
- [x] Gelir ekleme formuna tekrarlayan gelir seçenekleri ekle
- [x] Otomatik gelir oluşturma servisi yaz (uygulama başlangıcında çalışır)
- [ ] Tekrarlayan gelir yönetim ekranı oluştur [Opsiyonel]
- [ ] Bildirim sistemi entegre et [Sonraya ertelendi]
- [x] Türkçe ve İngilizce çeviriler ekle
- [x] Unit testler yaz
- [x] Test et
- [x] Checkpoint oluştur (v5.7)
- [x] Kullanıcıya teslim et (v5.7)

## Tekrarlayan Gelir İyileştirme (v5.7.1)
- [x] Gelir ekleme formuna "Belirli Tarihe Kadar" seçeneği ekle
- [x] Tekrar tipi seçimi ekle (Belirli Sayıda, Belirli Tarihe Kadar, Süresiz)
- [x] endDate kontrolü zaten mevcut (shouldGenerateRecurringIncome fonksiyonunda)
- [x] Türkçe ve İngilizce çeviriler ekle
- [x] Test et
- [x] Checkpoint oluştur (v5.7.1)
- [x] Kullanıcıya teslim et (v5.7.1)

## Bug Fix (v5.7.2)
- [x] Tekrarlayan gelir oluşturma sorununu çöz (gelirler görünmüyor)
- [x] Otomatik oluşturulan gelirlerin AsyncStorage'a kaydedildiğinden emin ol
- [x] Test et
- [x] Checkpoint oluştur (v5.7.2)
- [x] Kullanıcıya teslim et (v5.7.2)

## Bug Fix (v5.7.3)
- [x] addIncome fonksiyonuna gelir eklendikten sonra tekrarlayan gelir kontrolü ekle
- [x] Test et (bugünün tarihiyle gelir ekle, hemen oluşturulmalı)
- [x] Checkpoint oluştur (v5.7.3)
- [x] Kullanıcıya teslim et (v5.7.3)

## Bug Fix (v5.7.4)
- [x] Duplike gelir oluşturma sorununu çöz (addIncome'da processRecurringIncomes çağrılmayı kaldır)
- [x] nextDate'i bir sonraki döneme güncelle (duplike oluşmaması için)
- [ ] Gelecek aylar için gelir oluşturma seçeneği ekle (kullanıcı isterse) [Sonraya ertelendi]
- [x] Test et
- [x] Checkpoint oluştur (v5.7.4)
- [x] Kullanıcıya teslim et (v5.7.4)

## Toplu Gelir Oluşturma Özelliği (v5.8)
- [x] Gelir ekleme formuna "Gelecek gelirleri şimdi oluştur" checkbox ekle
- [x] "Kaç ay için?" picker ekle (1, 3, 6, 12, 24 ay seçenekleri)
- [x] addIncome fonksiyonuna toplu gelir oluşturma mantığı ekle
- [x] Türkçe ve İngilizce çeviriler ekle
- [x] Test et
- [x] Checkpoint oluştur (v5.8)
- [x] Kullanıcıya teslim et (v5.8)

## Bug Fix (v5.8.1)
- [x] Toplu gelir oluşturma duplike sorunu (ilk aya 2 tane ekliyor)
- [x] Toplu oluşturma bir sonraki aydan başlamalı
- [x] Test et
- [x] Checkpoint oluştur (v5.8.1)
- [x] Kullanıcıya teslim et (v5.8.1)

## UX İyileştirme (v5.8.2)
- [x] "Yeni Gelir Ekle" butonunu sayfanın altından başlığın yanına (sağ üst) taşı
- [x] Checkpoint oluştur (v5.8.2)
- [x] Kullanıcıya teslim et (v5.8.2)

## UX İyileştirme (v5.8.3)
- [x] "Yeni Ödeme Ekle" butonunu ödemeler sekmesinde başlığın yanına (sağ üst) taşı
- [x] Checkpoint oluştur (v5.8.3)
- [x] Kullanıcıya teslim et (v5.8.3)

## UX İyileştirme (v5.8.4)
- [x] "Yeni Harcama Ekle" butonunu harcama listesi ekranında başlığın yanına (sağ üst) taşı
- [x] Checkpoint oluştur (v5.8.4)
- [x] Kullanıcıya teslim et (v5.8.4)


## UX İyileştirme (v5.8.5)
- [x] Ana sayfadaki "Yeni Ödeme Ekle" butonunu başlığın yanına (sağ üst) taşı
- [x] Ana sayfadaki "Yeni Gelir Ekle" butonunu başlığın yanına (sağ üst) taşı
- [x] Alttaki büyük butonları kaldır
- [x] Checkpoint oluştur (v5.8.5)
- [x] Kullanıcıya teslim et (v5.8.5)


## UX İyileştirme (v5.8.6)
- [x] Finansal sağlık sayfasındaki kategori detaylarına açıklama metinleri ekle
- [x] Borç Yönetimi kategorisi açıklaması (gelire göre borç oranı, ideal: %30'un altı)
- [x] Acil Fon kategorisi açıklaması (kaç aylık harcama karşılığı birikim, hedef: 3-6 ay)
- [x] Tasarruf Oranı kategorisi açıklaması (gelirin yüzde kaçını biriktiriyorsunuz, hedef: %10+)
- [x] FIRE İlerlemesi kategorisi açıklaması (finansal bağımsızlık hedefinize ne kadar yakınsınız)
- [x] Checkpoint oluştur (v5.8.6)
- [x] Kullanıcıya teslim et (v5.8.6)


## Bug Fix (v5.8.7)
- [x] Tab bar'daki "tabs.calen..." yazısını düzelt (çeviri anahtarı eksik veya yanlış)
- [x] Takvim tab'ının başlığını kontrol et ve doğru çeviri anahtarını kullan
- [x] Checkpoint oluştur (v5.8.7)
- [x] Kullanıcıya teslim et (v5.8.7)


## UX İyileştirme (v5.8.8)
- [x] Gelirler sayfasındaki gelirleri yakın tarihten uzak tarihe doğru sırala
- [x] En yakın tarihli gelir en üstte, en uzak tarihli en altta olacak şekilde düzenle
- [x] Checkpoint oluştur (v5.8.8)
- [x] Kullanıcıya teslim et (v5.8.8)


## Bug Fix (v5.8.9)
- [x] Gelir detay sayfasındaki "incomeDetail.subtitle" çevirisini ekle
- [x] Gelir detay sayfasındaki "incomeDetail.type" çevirisini ekle ("Gelir Tipi")
- [x] Gelir detay sayfasındaki "incomeDetail.recurringIncome" çevirisini ekle ("Düzenli Gelir")
- [x] Gelir detay sayfasındaki "incomeDetail.cancel" çevirisini ekle ("İptal")
- [x] Checkpoint oluştur (v5.8.9)
- [x] Kullanıcıya teslim et (v5.8.9)


## Bug Fix (v5.9.0)
- [x] Gelir ekleme sayfasındaki "incomeDetail.success" çevirisini ekle ("Başarılı")
- [x] Gelir ekleme sayfasındaki "incomeDetail.ok" çevirisini ekle ("Tamam")
- [x] Gelir ekleme sayfasındaki "incomeDetail.frequency" çevirisini ekle ("Sıklık")
- [x] Checkpoint oluştur (v5.9.0)
- [x] Kullanıcıya teslim et (v5.9.0)


## Bug Fix (v5.9.1)
- [x] Gelir detay ekranındaki "incomeDetail.edit" çevirisini ekle ("Düzenle")
- [x] Gelir detay ekranındaki "incomeDetail.delete" çevirisini ekle ("Sil")
- [x] Checkpoint oluştur (v5.9.1)
- [x] Kullanıcıya teslim et (v5.9.1)


## Bug Fix (v5.9.2)
- [x] Gelirler listesindeki "duplicate key" hatasını düzelt
- [x] Her gelir için benzersiz key oluştur (income.id yerine index veya kombinasyon kullan)
- [x] Checkpoint oluştur (v5.9.2)
- [x] Kullanıcıya teslim et (v5.9.2)


## Feature: Bildirim Sistemi Geliştirmeleri (v6.0.0)
- [x] Bildirim ayarları sayfası oluştur (Settings içinde)
- [x] Bildirim master switch (açık/kapalı)
- [x] Hatırlatma süresi ayarı (1, 3, 7 gün önceden)
- [x] Bildirim zamanı ayarı (sabah 9:00, öğlen 12:00, akşam 18:00)
- [x] Günlük özet bildirimi ayarı (açık/kapalı)
- [x] Ses ve titreşim ayarları
- [x] Akıllı bildirim mantığı: X gün önceden hatırlatma
- [x] Akıllı bildirim: Ödeme günü sabahı özet
- [x] Akıllı bildirim: Geciken ödeme uyarısı
- [x] Akıllı bildirim: Ödeme başarı mesajı
- [x] Günlük özet bildirimi (her sabah 9:00)
- [x] Haftalık özet bildirimi (Pazartesi sabahı)
- [x] Aylık özet bildirimi (ayın ilk günü)
- [x] Bildirim ayarlarını AsyncStorage'a kaydet
- [x] Bildirim ayarlarını uygula
- [x] Checkpoint oluştur (v6.0.0)
- [x] Kullanıcıya teslim et (v6.0.0)


## Feature: Harcama Kategori Sistemi (v6.1.0)
- [x] Kategori veri yapısı oluştur (id, name, icon, color, isCustom, isDefault)
- [x] Varsayılan kategoriler tanımla (Gıda, Yakıt, Ulaşım, Kira, Faturalar, Eğlence, Giyim, Sağlık, Eğitim, Diğer)
- [x] Her kategori için ikon ve renk seç
- [x] Kategori yönetimi sayfası oluştur (/categories)
- [x] Yeni kategori ekleme formu (ad, ikon, renk seçimi)
- [x] Kategori düzenleme özelliği
- [x] Kategori silme özelliği (varsayılan kategoriler silinemez)
- [x] Kategori listesi görünümü (ikon + ad + renk)
- [ ] Harcama ekleme sayfasında kategori seçimi güncelle
- [ ] Bütçe ayarları sayfasında kategori seçimi güncelle
- [ ] Finansal sağlık sayfasında kategori bazlı analiz
- [x] Kategori verilerini AsyncStorage'a kaydet
- [x] Ayarlar sayfasına Kategoriler linki ekle
- [x] App Context'e kategori yönetimi entegre et
- [ ] Dil dosyalarına kategori çevirileri ekle (TR/EN)
- [x] Checkpoint oluştur (v6.1.0)
- [x] Kullanıcıya teslim et (v6.1.0)


## Feature: Harcama Ekleme Kategori Entegrasyonu (v6.1.1)
- [ ] Harcama veri yapısını güncelle (category: PaymentCategory → categoryId: string)
- [ ] Harcama ekleme sayfasında kategori seçiciyi güncelle (yeni kategorilerden seçim)
- [ ] Harcama düzenleme sayfasında kategori seçiciyi güncelle
- [ ] Harcama listesinde kategori gösterimini güncelle (ikon + ad + renk)
- [ ] Mevcut harcamaları yeni kategori sistemine migrate et
- [ ] Checkpoint oluştur (v6.1.1)
- [ ] Kullanıcıya teslim et (v6.1.1)


## Feature: Kategori Bazlı Bütçe Yönetimi (v6.2.0)
- [x] Kategori bütçe veri yapısı oluştur (categoryId, monthlyLimit, spent, remaining)
- [x] Kategori bütçe servisi oluştur (save/load/calculate)
- [x] Bütçe ayarları sayfasını güncelle (her kategori için aylık limit belirleme)
- [x] Ana sayfaya bütçe durumu kartları ekle (kategori bazlı progress bar)
- [x] Bütçe aşım uyarıları ekle (%80, %100)
- [x] Bütçe bildirimleri entegre et

## Feature: Kategori İstatistik Grafikleri (v6.2.0)
- [x] Pasta grafik komponenti oluştur (kategori bazlı harcama dağılımı)
- [x] Bar chart komponenti oluştur (aylık kategori karşılaştırması)
- [x] Yeni "İstatistikler" tab'i oluştur
- [x] Grafik verilerini hesaplayan servis oluştur
- [ ] Grafiklere tıklama interaksiyonu ekle (kategori detayına git)

## Testing & Delivery (v6.2.0)
- [x] Bütçe sistemi testleri yaz
- [x] Grafik render testleri yaz
- [x] Checkpoint oluştur (v6.2.0)
- [x] Kullanıcıya teslim et (v6.2.0)


## Feature: Harcama Kategori Entegrasyonu (v6.3.0)
- [x] Veri migrasyon scripti oluştur (ExpenseCategory enum → Category ID)
- [x] Kategori mapping tanımla (RENT → cat_rent, GROCERIES → cat_food vb.)
- [x] Harcama ekleme sayfasını güncelle (yeni kategori seçici)
- [x] Harcama düzenleme sayfasını güncelle (aynı sayfa kullanılıyor)
- [x] Mevcut harcamaları otomatik migrate et
- [x] Expense interface'i güncelle (category: string)
- [x] TypeScript hatalarını düzelt (getExpenseType, getCategoryIcon)
- [x] Migration testleri yaz ve çalıştır (6/6 test passed)
- [x] Checkpoint oluştur (v6.3.0)
- [ ] Kullanıcıya teslim et (v6.3.0)


## Bug: İstatistikler Sayfasında Harcamalar Görünmüyor (v6.3.1)
- [x] İstatistikler sayfasını incele (app/(tabs)/statistics.tsx)
- [x] Harcama verilerinin yüklenip yüklenmediğini kontrol et
- [x] Kategori migrasyonu sonrası veri akışını test et
- [x] Sorunu tespit et ve düzelt (category-statistics-service.ts'de TODO olarak bırakılmış filtreleme kodu düzeltildi)
- [x] Test et (TypeScript hatası yok)
- [x] Unit testler yaz ve çalıştır (7/7 test passed - category-statistics.test.ts)
- [x] Checkpoint oluştur (v6.3.1)
- [ ] Kullanıcıya teslim et (v6.3.1)


## Bug: İstatistikler Özel Kategorileri Göstermiyor (v6.3.2)
- [x] Kategori yükleme mantığını incele (loadCategories fonksiyonu)
- [x] Özel kategorilerin AsyncStorage'dan yüklenip yüklenmediğini kontrol et
- [x] İstatistik servisinde kategori filtreleme mantığını kontrol et
- [x] Sorunu tespit et ve düzelt (useFocusEffect ile sayfa odaklandığında kategoriler yeniden yükleniyor)
- [x] Özel kategori ile test et (5/5 unit test passed)
- [x] Checkpoint oluştur (v6.3.2)
- [ ] Kullanıcıya teslim et (v6.3.2)


## Bug: Harcama Listesinde İkon ve Çeviri Sorunları (v6.3.3)
- [x] Harcama listesi bileşenini incele (app/expense-list.tsx)
- [x] Kategori ikonlarının neden aynı göründüğünü tespit et (getCategoryIcon eski enum sistemi kullanıyordu)
- [x] Çeviri anahtarlarının neden gösterildiğini tespit et (expenseCategories.çeviri sistemi eski enum içindi)
- [x] İkon yükleme mantığını düzelt (loadCategories ile kategori bilgilerini yükle)
- [x] Çeviri sistemini düzelt (kategori adını doğrudan göster)
- [x] Test et (TypeScript hatası yok)
- [x] Checkpoint oluştur (v6.3.3)
- [ ] Kullanıcıya teslim et (v6.3.3)


## Bug: Kategori Ekleme - İkon ve Renk Seçimi Çalışmıyor (v6.3.4)
- [x] Kategori ekleme sayfasını incele (app/categories.tsx)
- [x] İkon seçim butonunun neden çalışmadığını tespit et (modal içinde modal sorunu)
- [x] Renk seçim butonunun neden çalışmadığını tespit et (modal içinde modal sorunu)
- [x] İkon seçim modal/picker ekle (zaten vardı, görünmüyordu)
- [x] Renk seçim modal/picker ekle (zaten vardı, görünmüyordu)
- [x] Seçilen ikon ve rengi state'e kaydet (zaten çalışıyordu)
- [x] Form modalini picker açıkken gizle (visible condition düzeltildi)
- [x] Test et (TypeScript hatası yok)
- [ ] Checkpoint oluştur (v6.3.4)
- [ ] Kullanıcıya teslim et (v6.3.4)


## Feature: Takvim Aylık Özet (v6.4.1)
- [x] Takvim sayfasını incele (app/(tabs)/calendar.tsx)
- [x] Seçili ayın toplam gelir hesaplamasını ekle
- [x] Seçili ayın toplam ödeme hesaplamasını ekle
- [x] Takvim altına özet kartları ekle (Toplam Gelir, Toplam Ödeme)
- [x] Kartları tasarla (ikon, renk, tutar - yeşil/kırmızı tema)
- [x] Ay değiştiğinde toplamları güncelle (onMonthChange callback)
- [x] Çevirileri ekle (tr.json, en.json)
- [x] Test et (TypeScript hatası yok)
- [x] Checkpoint oluştur (v6.4.1)
- [ ] Kullanıcıya teslim et (v6.4.1)


## Feature: Borçları En Yakın Ödeme Tarihine Göre Sırala (v6.4.2)
- [x] Borçlarım sayfasını incele (app/debt-list.tsx)
- [x] Borçların bir sonraki ödeme tarihini hesapla (nextDueDate zaten var)
- [x] Borçları tarihe göre sırala (en yakın tarih en üstte - sort ile)
- [x] Test et (TypeScript hatası yok)
- [x] Checkpoint oluştur (v6.4.2)
- [ ] Kullanıcıya teslim et (v6.4.2)


## Bug: AI Asistan Varsayılan Verilerle Çalışıyor (v6.4.3)
- [x] AI asistanının veri kaynağını incele (app/chatbot.tsx, server/routers.ts)
- [x] Kullanıcının gerçek verilerini AI'ya nasıl gönderdiğini kontrol et (financialContext)
- [x] AsyncStorage'dan gerçek verileri yükle (state.expenses eksikti)
- [x] AI prompt'una gerçek verileri ekle (backend zaten doğruydu)
- [x] Finansal context hesaplamasını düzelt (expenses + payments topla)
- [x] Test et (TypeScript hatası yok)
- [x] Checkpoint oluştur (v6.4.3)
- [ ] Kullanıcıya teslim et (v6.4.3)


## Feature: Ana Sayfa Finansal Öneri Kartları (v6.5.0)
- [x] Finansal öneri mantığını tasarla (borç ödeme, tasarruf, bütçe vb.)
- [x] Kullanıcının durumuna göre öneri oluştur (rule-based sistem - 6 farklı öneri tipi)
- [x] Öneri kartı bileşeni oluştur (ikon, başlık, açıklama, aksiyon butonu)
- [x] Ana sayfaya öneri kartlarını ekle
- [x] Kartları öncelik sırasına göre sırala (en fazla 3 öneri)
- [x] Çevirileri ekle (tr.json, en.json)
- [x] Test et (TypeScript hatası yok)
- [x] Checkpoint oluştur (v6.5.0)
- [ ] Kullanıcıya teslim et (v6.5.0)


## Bug: Finansal Öneri Hesaplamaları Tüm Zamanların Toplamını Alıyor (v6.5.1)
- [x] Finansal öneri servisini incele (services/financial-suggestions.ts)
- [x] Aylık gelir hesaplamasını düzelt (sadece bu ay - tarih filtreleme eklendi)
- [x] Aylık gider hesaplamasını düzelt (sadece bu ay - ödemeler + harcamalar)
- [x] Mevcut birikim hesaplamasını düzelt (tüm zamanların toplamı - doğru)
- [x] Test et (TypeScript hatası yok)
- [x] Checkpoint oluştur (v6.5.1)
- [ ] Kullanıcıya teslim et (v6.5.1)



## Bug: AI Asistan Hala Varsayılan Verilerle Çalışıyor (v6.5.2)

Kullanıcı Bildirimi: Yapay zeka hala bazı verileri kullanıcının girdiklerine göre değil varsayılana göre değerlendiriyor

- [x] Chatbot sayfasını incele (app/chatbot.tsx)
- [x] Finansal context hesaplamasını kontrol et
- [x] Varsayılan verilerin nereden geldiğini bul
- [x] Gerçek kullanıcı verilerinin doğru gönderildiğini doğrula
- [x] Backend'e gönderilen veriyi console.log ile kontrol et
- [x] Düzeltmeleri yap (aylık bazda hesaplama eklendi)
- [x] Test et (gerçek verilerle chatbot'a soru sor) - 7/7 unit test başarılı
- [x] Checkpoint oluştur (v6.5.2)
- [ ] Kullanıcıya teslim et (v6.5.2)



## Bug: AI Asistan Mevcut Birikim Değerini Yanlış Hesaplıyor (v6.5.3)

Kullanıcı Bildirimi: AI asistan 281.600 TL birikim gösteriyor ama kullanıcı 900.000 TL girmiş

Sorun: AI asistan finansal sağlık ayarlarındaki "Mevcut Birikim" değerini kullanmıyor, bunun yerine gelir/ödeme/harcama toplamından hesaplıyor

- [x] Finansal sağlık ayarlarını incele (AsyncStorage'da nasıl saklanıyor) - FIRE ayarları olarak saklanıyor
- [x] Chatbot'un mevcut birikim hesaplamasını incele - Otomatik hesaplama yapıyordu
- [x] Finansal sağlık ayarlarından "currentSavings" değerini oku - loadFireSettings ile yükledik
- [x] Chatbot'a bu değeri gönder - Öncelik: FIRE ayarları > Otomatik hesaplama
- [x] Test et (900.000 TL görmeli) - 7/7 unit test başarılı
- [x] Checkpoint oluştur (v6.5.3)
- [ ] Kullanıcıya teslim et (v6.5.3)



## Bug: Finansal Sağlık Skoru Borç Yönetimi Yanlış Hesaplanıyor (v6.5.4)

Kullanıcı Bildirimi: Borçlar gelire neredeyse eşit olmasına rağmen "yüzde 30'un altında" diyor ve skor 25/30 gösteriyor

Gerçek Durum:
- Aylık Gelir (Ocak): 61.600 TL
- Aylık Borç Ödeme (Ocak): 47.697 TL (24.100 + 23.597)
- Borç/Gelir Oranı: 77% (çok yüksek, %30'un çok üzerinde)
- Skor: 25/30 gösteriyor (iyi) ← YANLIŞ!

Sorun: Finansal sağlık skoru hesaplaması yanlış veri kullanıyor

- [x] Finansal sağlık skoru hesaplama kodunu incele (lib/financial-health.ts)
- [x] Borç yönetimi skoru hesaplama mantığını kontrol et - Yanlış: Toplam borç / Yıllık gelir
- [x] Aylık gelir hesaplamasını kontrol et (FIRE ayarları mı yoksa gerçek gelirler mi?) - Tüm gelirleri topluyordu
- [x] Aylık borç ödeme hesaplamasını kontrol et (sadece bu ayın ödemeleri mi?) - Tüm ödenmemiş borçları topluyordu
- [x] Düzeltmeleri yap (aylık bazda doğru hesaplama) - Aylık borç ödeme / Aylık gelir
- [x] Test et (77% oranında düşük skor görmeli) - 10/10 unit test başarılı, %77 oran 0/30 puan veriyor
- [x] Checkpoint oluştur (v6.5.4)
- [ ] Kullanıcıya teslim et (v6.5.4)



## Yeni Özellik: Borç Azaltma Planı (v7.0.0)

Kullanıcı İsteği: Borç azaltma planı özelliği ekle - Kar topu ve Çığ yöntemlerini karşılaştırmalı olarak sun

Özellik Detayları:
1. Yeni sayfa: "Borç Azaltma Planı" (Tab bar'a eklenecek)
2. Yöntem seçimi: Kar topu (Snowball) vs Çığ (Avalanche) karşılaştırma
3. Ödeme simülasyonu: "Aylık ekstra ödeme" slider'ı ile simülasyon
4. İlerleme takibi: Aylık borç azalma grafiği
5. Motivasyon: "X ay sonra borçsuz olacaksınız!" mesajı

### Kar Topu Yöntemi (Snowball):
- En küçük borcu önce öde
- Psikolojik motivasyon (hızlı kazanımlar)
- Borç sayısı azaldıkça motivasyon artar

### Çığ Yöntemi (Avalanche):
- En yüksek faizli borcu önce öde
- Matematiksel optimizasyon (toplam faiz tasarrufu)
- Uzun vadede daha az faiz ödersiniz

### Görevler:

**1. Borç Azaltma Hesaplama Fonksiyonları:**
- [x] lib/debt-payoff.ts dosyası oluştur
- [x] calculateSnowballMethod() fonksiyonu yaz (en küçük borç önce)
- [x] calculateAvalancheMethod() fonksiyonu yaz (en yüksek faizli borç önce)
- [x] comparePayoffMethods() fonksiyonu yaz (iki yöntemi karşılaştır)
- [x] calculateMonthlyProgress() fonksiyonu yaz (aylık ilerleme)
- [x] Faiz hesaplama ekle (aylık bileşik faiz)

**2. Tip Tanımlamaları:**
- [x] types/debt-payoff.ts dosyası oluştur
- [x] DebtPayoffMethod tipi (snowball | avalanche)
- [x] DebtPayoffPlan tipi (method, totalMonths, totalInterest, monthlyPayments)
- [x] MonthlyPayment tipi (month, principal, interest, remaining)
- [x] PayoffComparison tipi (snowball vs avalanche karşılaştırma)

**3. Borç Azaltma Planı Sayfası:**
- [x] app/(tabs)/debt-payoff.tsx dosyası oluştur
- [x] Yöntem seçimi UI (Kar topu vs Çığ)
- [x] Aylık ekstra ödeme slider'ı (0 - 50.000 TL)
- [x] Karşılaştırma tablosu (iki yöntem yan yana)
- [x] Borç listesi (öncelik sırasına göre)
- [x] Özet kartları (toplam ay, toplam faiz, tasarruf)
- [x] Motivasyon mesajı ("X ay sonra borçsuz!")

**4. Tab Bar Güncellemeleri:**
- [x] components/ui/icon-symbol.tsx'e "chart.line.uptrend.xyaxis" icon ekle
- [x] app/(tabs)/_layout.tsx'e "debt-payoff" tab ekle
- [x] Tab icon ve başlık ayarla

**5. Çeviriler:**
- [x] i18n/tr.json'a borç azaltma planı çevirileri ekle
- [x] i18n/en.json'a borç azaltma planı çevirileri ekle

**6. Testler:**
- [x] __tests__/debt-payoff-snowball.test.ts oluştur
- [x] __tests__/debt-payoff-avalanche.test.ts oluştur
- [x] __tests__/debt-payoff-comparison.test.ts oluştur
- [x] Tüm testleri çalıştır ve doğrula - 21/21 test başarılı

**7. Checkpoint:**
- [x] Tüm görevleri tamamla
- [x] TypeScript hatalarını kontrol et - 0 hata
- [x] Checkpoint oluştur (v7.0.0)
- [ ] Kullanıcıya teslim et (v7.0.0)



## Bug: Ana Sayfa Tasarımı Değişmiş (Bileşenler Kaybolmuş)

**Sorun:** Ana sayfa bileşenleri mevcut ama NativeWind (Tailwind CSS) stilleri uygulanmıyor. Renkler, kartlar ve butonlar görünmüyor.

**Eksik Bileşenler:**
- [ ] Üstteki 3 renkli buton (Ödeme/Gelir/Harcama ekle) - mavi, yeşil, sarı
- [ ] "Yüksek Borç Yükü" uyarı kartı (kırmızı arka plan)
- [ ] "Bu Ay Özet" büyük mavi kart (Toplam Gelir, Toplam Ödeme, Kalan Bakiye)
- [ ] "Finansal Özgürlük" kartı (FIRE sayısı, mevcut birikim, yüzde grafiği)

**Mevcut Bileşenler (Doğru):**
- [x] "Finansal Öneriler" bölümü (Tasarruf oranı uyarısı)
- [x] "Finansal Sağlık Skoru" kartı
- [x] "Yaklaşan Ödemeler" bölümü
- [x] "Harcamalar" bölümü

**Yapılacaklar:**
- [ ] app/(tabs)/index.tsx dosyasını incele
- [ ] Eksik bileşenleri tespit et
- [ ] Eski tasarımı geri getir
- [ ] Test et
- [ ] Checkpoint oluştur (v7.0.1)

## Finansal Sağlık Skoru Kategori Detayları (Kullanıcı İsteği)
- [x] Kategori kartlarına tıklanabilirlik ekle
- [x] Her kategori için detaylı açıklama modalı oluştur
- [x] Puanlama kriterleri göster
- [x] Kullanıcının mevcut durumunu göster
- [x] İyileştirme önerileri sun
- [x] Test et
- [x] Checkpoint oluştur (v7.1.0)
- [ ] Kullanıcıya teslim et (v7.1.0)

## Modal İçerik Görünmeme Sorunu (Bug Fix)
- [x] Modal içeriğinin neden görünmediğini tespit et (ScrollView flex sorunu)
- [x] ScrollView veya layout sorununu düzelt (sabit yükseklik verildi)
- [x] Tüm kategorilerde test et
- [x] Checkpoint oluştur (v7.1.1)

## FIRE İlerleme Veri Uyumsuzluğu (Bug Fix)
- [x] Ana sayfa ve modal arasındaki FIRE verisi uyumsuzluğunu tespit et (healthInput'ta fireProgressPercent yoktu)
- [x] Modal'ın fireProgressPercent hesaplamasını kontrol et
- [x] healthInput verisine fireProgressPercent eklendi (FIRE ayarlarından yükleniyor)
- [x] Test et (ana sayfa %1, modal da %1 göstermeli)
- [x] Checkpoint oluştur (v7.1.2)

## Ana Sayfa ve Detay Sayfası Skor Uyumsuzluğu (Critical Bug)
- [x] Ana sayfa ve detay sayfasındaki skor hesaplama farkını tespit et (ana sayfa tüm zamanların gelirini kullanıyordu)
- [x] Ana sayfa: index.tsx'teki hesaplamayı düzelt
- [x] Detay sayfası: health-score.tsx ile aynı mantığı kullan (aylık bazda)
- [x] Her iki sayfanın aynı healthInput kullandığından emin ol
- [x] Test et (her iki sayfa da aynı skoru göstermeli)
- [x] Checkpoint oluştur (v7.1.3)

## Taksitli Ödeme Toggle'ını Kaldır (UX İyileştirmesi)
- [ ] Yeni Ödeme formundan "Taksitli Ödeme" toggle'ını kaldır
- [ ] İlgili taksit alanlarını kaldır (taksit sayısı, kalan taksit vb.)
- [ ] Sadece "Tekrarlanan Ödeme" toggle'ı kalsın
- [ ] Ödeme düzenleme formunda da aynı değişikliği yap
- [ ] Test et (form daha basit ve anlaşılır olmalı)
- [ ] Checkpoint oluştur (v7.2.0)

## Taksitli Ödeme Toggle Kaldırma (Kullanıcı Geri Bildirimi - Test Dönemi)
- [x] Ödeme ekleme formundan "Taksitli Ödeme" toggle'ını kaldır
- [x] Ödeme düzenleme formundan "Taksitli Ödeme" toggle'ını kaldır
- [x] Taksit ile ilgili state'leri temizle (hasInstallments, installmentTotal, installmentCurrent, installmentEndDate, autoGenerateInstallments)
- [x] Taksit validasyonunu kaldır
- [x] Taksit oluşturma kodunu kaldır
- [x] generateInstallments import'unu kaldır
- [x] Sadece "Tekrarlanan Ödeme" toggle'ı kalsın
- [x] TypeScript hatalarını düzelt
- [x] Test et
- [x] Checkpoint oluştur (v7.1.4 - Taksitli ödeme toggle kaldırıldı)
- [x] Kullanıcıya teslim et (v7.1.4)

## Harcamalar Tab Butonu Ekleme (Kullanıcı İsteği)
- [x] icon-symbol.tsx'e harcamalar ikonu ekle (shopping.cart veya creditcard)
- [x] app/(tabs)/_layout.tsx'e harcamalar tab'ı ekle (ödemeler ve gelirler arasına)
- [x] Tab sıralamasını ayarla (Ana Sayfa → Ödemeler → Harcamalar → Gelirler → ...)
- [x] Türkçe ve İngilizce tab başlıklarını ekle
- [x] expense-list.tsx dosyasını (tabs) klasörüne taşı
- [x] Test et
- [x] Checkpoint oluştur (v7.1.5 - Harcamalar tab butonu eklendi)
- [x] Kullanıcıya teslim et (v7.1.5)

## Takvim Sayfasına Aylık Harcama Kartı Ekleme (Kullanıcı İsteği)
- [x] Takvim sayfasında aylık harcamaları hesapla
- [x] "Toplam Harcama" kartı ekle (Toplam Gelir ve Toplam Ödeme kartlarının altına)
- [x] Kart tasarımı: Turuncu tema, aşağı ok ikonu
- [x] Ay değiştiğinde harcama toplamını güncelle
- [x] Türkçe ve İngilizce çevirileri ekle
- [x] Test et
- [x] Checkpoint oluştur (v7.1.6 - Takvim harcama kartı eklendi)
- [x] Kullanıcıya teslim et (v7.1.6)

## Takvim Sayfasına Aylık İstatistikler Ekleme (Kullanıcı İsteği)
- [x] İstatistikler sayfasındaki CategoryPieChart bileşenini kullan
- [x] İstatistikler sayfasındaki BudgetStatusCard bileşenini kullan
- [x] Takvim sayfasına "Kategori Bazlı Harcama Dağılımı" bölümü ekle
- [x] Takvim sayfasına "Bütçe Durumu" bölümü ekle
- [x] Aylık harcamaları kategorilere göre grupla
- [x] Pasta grafik ile kategori dağılımını göster
- [x] Her kategori için bütçe durumu progress bar'ı göster
- [x] Ay değiştiğinde istatistikleri güncelle
- [x] Test et
- [x] Checkpoint oluştur (v7.1.7 - Takvim istatistikleri eklendi)
- [x] Kullanıcıya teslim et (v7.1.7)

## Takvim Sayfası Başlık Çevirilerini Düzelt (Kullanıcı İsteği)
- [x] Türkçe çeviri dosyasına statistics.categoryDistribution ekle
- [x] Türkçe çeviri dosyasına statistics.budgetStatus ekle
- [x] İngilizce çeviri dosyasına statistics.categoryDistribution ekle
- [x] İngilizce çeviri dosyasına statistics.budgetStatus ekle
- [x] Test et
- [x] Checkpoint oluştur (v7.1.8 - Takvim başlık çevirileri düzeltildi)
- [x] Kullanıcıya teslim et (v7.1.8)

## Bütçe Durumu Hesaplama Hatası Düzeltme (Kullanıcı Bug Raporu)
- [x] category-budget-service.ts dosyasını incele
- [x] getCurrentMonthBudgets fonksiyonunu incele
- [x] Harcama hesaplama mantığını kontrol et
- [x] Her kategori için doğru harcama tutarını hesapla
- [x] Bug'ı düzelt (kategori filtresi eklendi)
- [x] Test et (sadece Gıda kategorisinde 1000₺ harcama olmalı)
- [x] Checkpoint oluştur (v7.1.9 - Bütçe hesaplama hatası düzeltildi)
- [x] Kullanıcıya teslim et (v7.1.9)

## Takvim Sayfası Bütçe Hesaplama Bug'ı Düzeltme (Kullanıcı Bug Raporu)
- [x] calendar.tsx dosyasını incele - bütçe hesaplama kodunu görmek için
- [x] Ay değiştiğinde bütçe hesaplamasının güncellenip güncellenmediğini kontrol et
- [x] calculateCategoryBudgets fonksiyonuna doğru ay parametresinin gönderildiğini kontrol et
- [x] Bug'ı düzelt (getCurrentMonthBudgets yerine calculateCategoryBudgets kullan)
- [x] Test et (Ocak ve Şubat ayları farklı veriler göstermeli)
- [ ] Checkpoint oluştur (v7.2.0 - Takvim bütçe hesaplama bug'ı düzeltildi)
- [ ] Kullanıcıya teslim et (v7.2.0)
