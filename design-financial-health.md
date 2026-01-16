# Finansal Sağlık Skoru ve AI Chatbot Asistan - Tasarım Dokümanı

## 📊 Finansal Sağlık Skoru

### Hesaplama Formülü

**Toplam Skor: 0-100 puan**

1. **Borç Yönetimi (30 puan)**
   - Borç/Gelir Oranı:
     - 0% → 30 puan
     - 1-20% → 25 puan
     - 21-40% → 15 puan
     - 41-60% → 5 puan
     - 60%+ → 0 puan

2. **Acil Fon (20 puan)**
   - Mevcut Birikim / Aylık Harcama:
     - 6+ ay → 20 puan
     - 3-6 ay → 15 puan
     - 1-3 ay → 10 puan
     - 0-1 ay → 5 puan
     - Yok → 0 puan

3. **Tasarruf Oranı (30 puan)**
   - (Gelir - Harcama) / Gelir:
     - 30%+ → 30 puan
     - 20-30% → 25 puan
     - 10-20% → 15 puan
     - 5-10% → 10 puan
     - 0-5% → 5 puan
     - Negatif → 0 puan

4. **FIRE Hedefi (20 puan)**
   - FIRE İlerleme Yüzdesi:
     - 80%+ → 20 puan
     - 60-80% → 15 puan
     - 40-60% → 10 puan
     - 20-40% → 5 puan
     - 0-20% → 2 puan
     - Hedef yok → 0 puan

### Skor Kategorileri

- **0-40 (Kırmızı)**: Kritik - Acil önlem gerekli
- **41-70 (Sarı)**: Orta - İyileştirme gerekli
- **71-100 (Yeşil)**: İyi - Doğru yoldasınız

### Öneriler

Her kategori için özel öneriler:
- Düşük borç yönetimi → "Önce borçlarınızı kapatın"
- Düşük acil fon → "3 aylık harcamanızı biriktirin"
- Düşük tasarruf → "Harcamalarınızı azaltın"
- Düşük FIRE → "Hedeflerinizi gözden geçirin"

---

## 🤖 AI Chatbot Asistan

### Amaç
Yeni başlayanlar için finansal rehberlik sağlamak.

### Özellikler

1. **Soru-Cevap Sistemi**
   - Kullanıcı soru sorar
   - Backend AI (Manus) cevap verir
   - Sohbet geçmişi saklanır (AsyncStorage)

2. **Örnek Sorular**
   - "Borcum var, yatırım yapmalı mıyım?"
   - "Acil fon ne kadar olmalı?"
   - "FIRE nedir?"
   - "Hangi yatırım aracını seçmeliyim?"
   - "Tasarruf oranım düşük, ne yapmalıyım?"

3. **Sistem Promptu**
```
Sen bir finansal danışman asistandır. Kullanıcıya basit, anlaşılır ve Türkçe cevaplar ver.
Kullanıcının finansal durumu:
- Aylık gelir: {income}
- Aylık harcama: {expenses}
- Toplam borç: {debt}
- Mevcut birikim: {savings}
- Finansal sağlık skoru: {score}/100

Cevaplarında:
- Kısa ve öz ol (max 150 kelime)
- Örnekler ver
- Sayılarla açıkla
- Pozitif ve motive edici ol
```

4. **UI Tasarımı**
   - Sohbet baloncukları (kullanıcı sağda, AI solda)
   - Yazma animasyonu (typing indicator)
   - Hızlı cevap butonları (örnek sorular)
   - Sohbet geçmişi (scroll)

---

## 🎨 UI Bileşenleri

### 1. HealthScoreCard (Ana Sayfa)
```
┌─────────────────────────────────┐
│ 🏥 Finansal Sağlık Skoru        │
│                                 │
│        [85]                     │
│     İyi Durumdasınız!           │
│                                 │
│ ▓▓▓▓▓▓▓▓▓░ 85/100              │
│                                 │
│ Detayları Gör →                 │
└─────────────────────────────────┘
```

### 2. HealthScoreDetail (Detay Ekranı)
```
┌─────────────────────────────────┐
│ Finansal Sağlık Skoru           │
│                                 │
│        [85]                     │
│     İyi Durumdasınız!           │
│                                 │
│ Borç Yönetimi      ▓▓▓▓░ 25/30 │
│ Acil Fon           ▓▓▓▓░ 20/20 │
│ Tasarruf Oranı     ▓▓▓▓░ 25/30 │
│ FIRE Hedefi        ▓▓▓░░ 15/20 │
│                                 │
│ 💡 Öneriler:                    │
│ • FIRE hedefinizi artırın       │
│ • Tasarruf oranınızı koruyun    │
└─────────────────────────────────┘
```

### 3. ChatbotScreen (Chatbot Ekranı)
```
┌─────────────────────────────────┐
│ 🤖 Finansal Asistan             │
├─────────────────────────────────┤
│                                 │
│  ┌─────────────────────┐        │
│  │ Merhaba! Size nasıl │        │
│  │ yardımcı olabilirim?│        │
│  └─────────────────────┘        │
│                                 │
│        ┌─────────────────────┐  │
│        │ Borcum var, yatırım │  │
│        │ yapmalı mıyım?      │  │
│        └─────────────────────┘  │
│                                 │
│  ┌─────────────────────┐        │
│  │ Önce borcunuzu      │        │
│  │ kapatmanızı öneririm│        │
│  │ çünkü...            │        │
│  └─────────────────────┘        │
│                                 │
├─────────────────────────────────┤
│ [Mesajınızı yazın...      ] [→]│
└─────────────────────────────────┘
```

---

## 🔧 Teknik Detaylar

### Veri Modeli

```typescript
// Finansal Sağlık Skoru
interface FinancialHealthScore {
  totalScore: number; // 0-100
  debtManagement: number; // 0-30
  emergencyFund: number; // 0-20
  savingsRate: number; // 0-30
  fireProgress: number; // 0-20
  category: 'critical' | 'moderate' | 'good';
  recommendations: string[];
}

// Chatbot Mesaj
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// Chatbot Sohbet
interface ChatSession {
  id: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}
```

### Backend API

```typescript
// POST /api/chat
{
  "message": "Borcum var, yatırım yapmalı mıyım?",
  "context": {
    "income": 10000,
    "expenses": 7000,
    "debt": 5000,
    "savings": 2000,
    "healthScore": 65
  }
}

// Response
{
  "reply": "Önce borcunuzu kapatmanızı öneririm çünkü...",
  "suggestions": [
    "Borç ödeme planı oluşturun",
    "Harcamalarınızı azaltın"
  ]
}
```

---

## 📱 Kullanıcı Akışı

### Finansal Sağlık Skoru
1. Kullanıcı ana sayfayı açar
2. Sağlık skoru kartını görür
3. Karta tıklar
4. Detay ekranı açılır
5. Kategorileri ve önerileri görür

### Chatbot
1. Kullanıcı Hedefler sekmesini açar
2. "Finansal Asistan" butonuna tıklar
3. Chatbot ekranı açılır
4. Örnek sorulardan birini seçer veya yazar
5. AI cevap verir
6. Sohbet devam eder

---

## 🎯 Başarı Kriterleri

- ✅ Sağlık skoru doğru hesaplanıyor
- ✅ Renkli gösterge çalışıyor (kırmızı/sarı/yeşil)
- ✅ Öneriler kullanıcıya özel
- ✅ Chatbot 5 saniyede cevap veriyor
- ✅ Sohbet geçmişi kaydediliyor
- ✅ Türkçe ve İngilizce dil desteği
