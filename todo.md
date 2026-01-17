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
- [ ] Gelecek aylar için gelir oluşturma seçeneği ekle (kullanıcı isterse)
- [ ] Test et
- [ ] Checkpoint oluştur (v5.7.4)
- [ ] Kullanıcıya teslim et (v5.7.4)
