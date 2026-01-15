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
- [ ] Checkpoint oluştur (v3.3 - Privacy Policy)
- [ ] Kullanıcıya teslim et (v3.3)
