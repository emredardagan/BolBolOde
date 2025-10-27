# BölBölÖde

**Ortak Harcama Yönetimi ve Paylaşımı Uygulaması**

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-lightgrey.svg)
![Status](https://img.shields.io/badge/status-Planning-yellow.svg)

</div>

---

## 📖 Proje Özeti

BölBölÖde, arkadaş grupları ve etkinlik katılımcıları için harcama paylaşımını şeffaf, adil ve kolay hale getiren mobil bir uygulamadır.

### Temel Özellikler

- 🎯 **Grup Yönetimi:** Kolayca grup oluştur, üye davet et
- 💰 **Harcama Takibi:** Tüm ortak harcamaları kaydet
- 🔄 **Esnek Paylaşım:** Eşit, ağırlıklı, kesin tutarlı veya yüzdesel paylaşım
- 💱 **Çoklu Para Birimi:** Farklı para birimlerinde harcama desteği
- 📊 **Otomatik Hesaplama:** Net bakiye ve borç sadeleştirme
- 📴 **Offline Kullanım:** İnternet olmadan da çalış
- 📱 **Real-time Sync:** Anında senkronizasyon
- 📈 **Raporlama:** PDF/CSV export

---

## 🎯 Kullanım Senaryoları

### 🏕️ Tatil/Gezi
Arkadaşlarınızla yaptığınız gezide tüm harcamaları kaydedin. Otel, yemek, ulaşım - her şeyi tek yerde takip edin. Tatil sonunda kimin kime ne kadar borcu olduğunu anında görün.

### 🏠 Ev Arkadaşları
Ortak kira, faturalar, market alışverişi gibi aylık giderleri düzenli olarak kaydedin ve paylaşın.

### 🎉 Etkinlik Organizasyonu
Doğum günü, düğün veya özel etkinlik organizasyonunda yapılan harcamaları organize edin.

---

## 🚀 Teknoloji Stack

### Frontend (Mobile)
- **Framework:** React Native 0.74+ (Expo SDK 51+)
- **Language:** TypeScript 5.0+
- **State Management:** TanStack Query (React Query) + Zustand
- **Storage:** MMKV + AsyncStorage
- **Navigation:** React Navigation 6.x
- **Styling:** NativeWind (Tailwind for React Native)
- **Forms:** React Hook Form + Zod
- **Testing:** Jest + React Native Testing Library + Detox

### Backend
- **Platform:** Firebase
  - Authentication (Email/Password, Google OAuth)
  - Cloud Firestore (Database)
  - Cloud Storage (File uploads)
  - Cloud Functions (Serverless)
  - Cloud Messaging (Push notifications)
- **Runtime:** Node.js 20
- **Language:** TypeScript

### DevOps & Tools
- **CI/CD:** GitHub Actions + Fastlane
- **Deployment:** EAS Build (Expo Application Services)
- **Monitoring:** Sentry + Firebase Analytics
- **Version Control:** Git + GitHub

---

## 📂 Proje Yapısı

```
BolBolOde/
├── docs/                      # Kapsamlı dokümantasyon
│   ├── prd/                   # Ürün gereksinimleri
│   ├── technical/             # Teknik mimari
│   ├── api/                   # API spesifikasyonları
│   ├── wireframes/            # Ekran akışları
│   ├── algorithms/            # Algoritma dokümantasyonu
│   ├── deployment/            # CI/CD ve deployment
│   ├── roadmap/               # Milestone planı
│   └── data/                  # Örnek veri setleri
├── src/                       # Uygulama kaynak kodu (gelecek)
├── functions/                 # Firebase Cloud Functions (gelecek)
├── .github/                   # GitHub workflows (gelecek)
└── README.md                  # Bu dosya
```

---

## 📚 Dokümantasyon

Tüm dokümantasyon `/docs` klasöründe bulunmaktadır:

### Ürün Dokümanları
- **[Product Requirements (PRD)](docs/prd/product-requirements.md)** - Ürün gereksinimleri ve özellikler
- **[User Stories](docs/prd/user-stories.md)** - Kullanıcı hikayeleri ve kabul kriterleri
- **[Edge Cases](docs/prd/edge-cases.md)** - Kenar durumlar ve çözüm önerileri

### Teknik Dokümanlar
- **[Architecture Overview](docs/technical/architecture-overview.md)** - Sistem mimarisi ve teknoloji stack
- **[Data Model](docs/technical/data-model.md)** - Veritabanı şeması ve veri yapıları
- **[ER Diagram](docs/technical/er-diagram.mmd)** - Entity-Relationship diyagramı (Mermaid)
- **[Security & Privacy](docs/technical/security-privacy.md)** - Güvenlik ve KVKK/GDPR
- **[Offline Sync](docs/technical/offline-sync.md)** - Offline-first stratejisi

### API Dokümanları
- **[Firebase Functions](docs/api/firebase-functions.md)** - Cloud Functions dokümantasyonu
- **[OpenAPI Spec](docs/api/openapi-spec.yaml)** - REST API spesifikasyonu
- **[Realtime Subscriptions](docs/api/realtime-subscriptions.md)** - Firestore listeners

### Algoritmalar
- **[Debt Settlement](docs/algorithms/debt-settlement.md)** - Borç sadeleştirme algoritması
- **[Currency Conversion](docs/algorithms/currency-conversion.md)** - Para birimi dönüşümleri
- **[Test Cases](docs/algorithms/test-cases.md)** - Algoritma test senaryoları

### Diğer
- **[Milestones](docs/roadmap/milestones.md)** - M1-M5 roadmap ve timeline
- **[Sprint Breakdown](docs/roadmap/sprint-breakdown.md)** - Sprint bazlı görev dağılımı
- **[Sample Data](docs/data/)** - Örnek veri setleri

---

## 🏗️ Roadmap

### M1 - MVP (3 hafta) 🟡 Planlanıyor
- ✅ Temel auth ve kullanıcı yönetimi
- ✅ Grup oluşturma ve üye daveti
- ✅ Eşit paylaşımlı harcama ekleme
- ✅ Bakiye hesaplama ve sadeleştirme
- ✅ Temel raporlama

### M2 - Gelişmiş Paylaşım (2 hafta) 🔴 Bekliyor
- Ağırlıklı, kesin tutarlı, yüzdesel paylaşım
- Çoklu para birimi desteği
- PDF/CSV export
- Google OAuth

### M3 - Offline & Realtime (3 hafta) 🔴 Bekliyor
- Offline-first mimarisi
- Sync queue sistemi
- Push notifications
- Settlement (ödeme kaydı)

### M4 - Optimize & Güvenlik (2 hafta) 🔴 Bekliyor
- Performans optimizasyonu
- Erişilebilirlik
- Security hardening
- E2E tests

### M5 - Polish & Store Yayını (2 hafta) 🔴 Bekliyor
- UI/UX polish
- Dark mode
- Store submission
- Marketing materials

**Hedef Launch:** Şubat 2026

Detaylı roadmap için: [docs/roadmap/milestones.md](docs/roadmap/milestones.md)

---

## 🛠️ Geliştirme (Gelecek)

### Gereksinimler
- Node.js 20+
- npm veya yarn
- Expo CLI
- iOS Simulator (Mac) veya Android Emulator
- Firebase hesabı

### Kurulum (Gelecek)

```bash
# Repository'yi klonla
git clone https://github.com/yourusername/BolBolOde.git
cd BolBolOde

# Bağımlılıkları yükle
npm install

# Environment variables
cp .env.example .env.local
# .env.local dosyasını düzenle

# Expo development server başlat
npm start

# iOS simulator
npm run ios

# Android emulator
npm run android
```

---

## 🧪 Test (Gelecek)

```bash
# Unit tests
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage

# E2E tests
npm run test:e2e
```

---

## 📊 Örnek Ekranlar (Gelecek)

Wireframe ve UI tasarımları için: [docs/wireframes/](docs/wireframes/)

---

## 🤝 Katkıda Bulunma (Gelecek)

Katkılarınızı bekliyoruz! Lütfen önce [CONTRIBUTING.md](CONTRIBUTING.md) dosyasını okuyun.

### Geliştirme Süreci
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

## 👥 Ekip

- **Product Owner:** -
- **Lead Developer:** -
- **UI/UX Designer:** -

---

## 📧 İletişim

- **Website:** https://bolbolode.com (gelecek)
- **Email:** hello@bolbolode.com
- **Twitter:** @bolbolode (gelecek)
- **Support:** support@bolbolode.com

---

## 🙏 Teşekkürler

Bu proje aşağıdaki açık kaynak projelerden ilham almıştır:
- [Splitwise](https://www.splitwise.com/)
- [BillSplit](https://github.com/varad615/BillSplit)

---

## 📈 Status

- **Version:** 1.0.0 (Planning)
- **Status:** 🟡 Dokümantasyon tamamlandı, geliştirme başlayacak
- **Last Update:** 27 Ekim 2025

---

<div align="center">

**Made with ❤️ for better expense sharing**

[⬆ Başa Dön](#bölbölöde)

</div>
