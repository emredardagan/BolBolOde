# BölBölÖde - Dokümantasyon İndeksi

Hoş geldiniz! Bu klasör BölBölÖde uygulamasının kapsamlı dokümantasyonunu içermektedir.

---

## 📑 İçindekiler

### 1. Ürün Gereksinimleri (PRD)
Ürün vizyonu, özellikler ve kullanıcı senaryoları

- **[product-requirements.md](prd/product-requirements.md)**
  - Proje özeti ve hedefler
  - Kullanıcı personaları
  - Fonksiyonel ve non-fonksiyonel gereksinimler
  - Başarı metrikleri (KPI)
  - Önceliklendirme

- **[user-stories.md](prd/user-stories.md)**
  - 30+ detaylı kullanıcı hikayesi
  - Kabul kriterleri
  - Öncelik seviyeleri (Must Have, Should Have, Nice to Have)

- **[edge-cases.md](prd/edge-cases.md)**
  - 30+ kenar durum senaryosu
  - Problem tanımları ve çözüm önerileri
  - Test stratejileri

---

### 2. Teknik Mimari
Sistem mimarisi ve teknik tasarım

- **[architecture-overview.md](technical/architecture-overview.md)**
  - Sistem mimarisi diyagramları
  - Teknoloji stack detayları
  - Katmanlı mimari yapısı
  - Veri akışları
  - Ölçeklendirme stratejisi

- **[data-model.md](technical/data-model.md)**
  - Firestore collection yapısı
  - Veri modelleri (TypeScript interfaces)
  - İlişkiler ve referanslar
  - Index gereksinimleri
  - Validasyon kuralları

- **[er-diagram.mmd](technical/er-diagram.mmd)**
  - Entity-Relationship diyagramı (Mermaid formatında)
  - Görselleştirme için: [Mermaid Live Editor](https://mermaid.live/)

- **[security-privacy.md](technical/security-privacy.md)**
  - Güvenlik mimarisi (Defense in Depth)
  - Authentication & Authorization
  - KVKK/GDPR compliance
  - Firestore Security Rules
  - Best practices

- **[offline-sync.md](technical/offline-sync.md)**
  - Offline-first stratejisi
  - Sync queue mimarisi
  - Conflict resolution
  - Implementation detayları

---

### 3. API Dokümantasyonu
Backend API ve Cloud Functions

- **[openapi-spec.yaml](api/openapi-spec.yaml)**
  - OpenAPI 3.0 spesifikasyonu
  - REST API endpoint'leri
  - Request/Response şemaları
  - Swagger UI ile görselleştirilebilir

- **[firebase-functions.md](api/firebase-functions.md)**
  - Cloud Functions dokümantasyonu
  - HTTP Functions (Callable)
  - Firestore Triggers
  - Scheduled Functions
  - Auth Triggers
  - Deployment rehberi

- **[realtime-subscriptions.md](api/realtime-subscriptions.md)**
  - Firestore real-time listeners
  - Event-driven architecture
  - Client-side subscription yönetimi

---

### 4. Ekran Akışları ve Tasarım
UI/UX ve kullanıcı akışları

- **[navigation-flow.mmd](wireframes/navigation-flow.mmd)**
  - Navigasyon diyagramı (Mermaid)
  - Stack ve Tab navigator yapısı

- **[screen-specs.md](wireframes/screen-specs.md)**
  - Her ekran için detaylı spec
  - Başlıklar, CTA'lar, boş durumlar
  - Component breakdown

- **[wireframes.md](wireframes/wireframes.md)**
  - Low-fidelity wireframe'ler (ASCII/Markdown)
  - Ekran layout'ları

---

### 5. Algoritmalar ve Hesaplamalar
Core business logic algoritmaları

- **[debt-settlement.md](algorithms/debt-settlement.md)**
  - Greedy borç sadeleştirme algoritması
  - Pseudo-code ve TypeScript implementation
  - Test senaryoları
  - Performans analizi
  - Gelecek: Minimum Cash Flow algoritması

- **[currency-conversion.md](algorithms/currency-conversion.md)**
  - Para birimi dönüşüm mantığı
  - Yuvarlama kuralları
  - FX rate yönetimi

- **[test-cases.md](algorithms/test-cases.md)**
  - Algoritma test senaryoları
  - Input/Output örnekleri
  - Edge case testleri

- **[sample-datasets.json](algorithms/sample-datasets.json)**
  - Test için örnek veri setleri

---

### 6. Test Stratejisi
Test yaklaşımı ve senaryoları

- **[test-strategy.md](technical/test-strategy.md)**
  - Unit test stratejisi
  - Integration test planı
  - E2E test yaklaşımı
  - Coverage hedefleri

- **[test-scenarios.md](technical/test-scenarios.md)**
  - Kritik test senaryoları
  - Manuel test check-listleri
  - Regression test planı

---

### 7. CI/CD ve Deployment
Continuous integration/deployment

- **[ci-cd-pipeline.md](deployment/ci-cd-pipeline.md)**
  - GitHub Actions workflow açıklaması
  - Build ve test aşamaları
  - Deployment stratejisi

- **[github-actions-example.yaml](deployment/github-actions-example.yaml)**
  - Örnek GitHub Actions config
  - Lint, test, build, deploy jobs

- **[fastlane-example.rb](deployment/fastlane-example.rb)**
  - Fastlane lanes
  - iOS ve Android build/deploy

- **[environment-setup.md](deployment/environment-setup.md)**
  - Development environment kurulum
  - Firebase setup
  - Secrets management

---

### 8. Yol Haritası ve Planlama
Milestone'lar ve timeline

- **[milestones.md](roadmap/milestones.md)**
  - M1-M5 detaylı milestone planı
  - Her milestone için özellikler, süre, kabul kriterleri
  - Post-launch roadmap
  - Resource planning ve maliyet tahmini

- **[sprint-breakdown.md](roadmap/sprint-breakdown.md)**
  - Sprint bazında görev dağılımı
  - Story point tahminleri
  - Velocity tracking

---

### 9. Analitik ve Metrikler
Monitoring ve analytics

- **[analytics-events.md](technical/analytics-events.md)**
  - Track edilecek event'ler
  - Firebase Analytics entegrasyonu
  - Custom event tanımları

- **[performance-metrics.md](technical/performance-metrics.md)**
  - NFR'ler (Non-Functional Requirements)
  - Performans hedefleri
  - Monitoring stratejisi

---

### 10. Yasal ve Compliance
Yasal gereksinimler

- **[terms-of-service.md](legal/terms-of-service.md)**
  - Kullanıcı sözleşmesi taslağı

- **[privacy-policy.md](legal/privacy-policy.md)**
  - Gizlilik politikası taslağı

- **[kvkk-gdpr-notes.md](legal/kvkk-gdpr-notes.md)**
  - KVKK ve GDPR compliance notları
  - Veri işleme aydınlatma metni

---

### 11. Örnek Veri
Test ve demo için örnek veri setleri

- **[sample-groups.json](data/sample-groups.json)**
  - Örnek grup verileri
  - Farklı durum örnekleri (active, archived)

- **[sample-expenses.json](data/sample-expenses.json)**
  - Örnek harcama kayıtları
  - Farklı paylaşım tipleri
  - Çoklu para birimi örnekleri

- **[sample-settlements.json](data/sample-settlements.json)**
  - Örnek ödeme kayıtları
  - Farklı durumlar (pending, confirmed)

---

## 🗂️ Doküman Kategorileri

### 📘 Ürün Odaklı
→ PRD klasörü (Product, User Stories, Edge Cases)

### 🔧 Teknik Odaklı
→ Technical klasörü (Architecture, Data Model, Security, Offline)

### 🔌 API ve Entegrasyonlar
→ API klasörü (OpenAPI, Firebase Functions, Realtime)

### 🎨 Tasarım ve UX
→ Wireframes klasörü (Navigation, Screens, Wireframes)

### 🧮 Algoritmalar
→ Algorithms klasörü (Debt Settlement, Currency, Tests)

### 🗺️ Planlama
→ Roadmap klasörü (Milestones, Sprints)

### ⚖️ Yasal
→ Legal klasörü (Terms, Privacy, KVKK/GDPR)

---

## 📖 Nasıl Kullanılır?

### Yeni Başlayanlar İçin
1. **[product-requirements.md](prd/product-requirements.md)** ile başlayın → Ürünü anlayın
2. **[user-stories.md](prd/user-stories.md)** okuyun → Kullanım senaryolarını görün
3. **[milestones.md](roadmap/milestones.md)** inceleyin → Roadmap'i öğrenin

### Geliştiriciler İçin
1. **[architecture-overview.md](technical/architecture-overview.md)** → Sistem mimarisini anlayın
2. **[data-model.md](technical/data-model.md)** → Veri yapılarını öğrenin
3. **[firebase-functions.md](api/firebase-functions.md)** → Backend API'yi inceleyin
4. **[offline-sync.md](technical/offline-sync.md)** → Sync mantığını anlayın

### Tasarımcılar İçin
1. **[screen-specs.md](wireframes/screen-specs.md)** → Ekran detaylarını görün
2. **[navigation-flow.mmd](wireframes/navigation-flow.mmd)** → Akışları inceleyin
3. **[wireframes.md](wireframes/wireframes.md)** → Layout'ları görün

### Proje Yöneticileri İçin
1. **[milestones.md](roadmap/milestones.md)** → Timeline ve scope
2. **[sprint-breakdown.md](roadmap/sprint-breakdown.md)** → Sprint planı
3. **[test-strategy.md](technical/test-strategy.md)** → QA yaklaşımı

---

## 🔄 Dokümantasyon Güncellemeleri

Bu dokümantasyon **canlı** bir dokümandır ve proje ilerledikçe güncellenecektir.

**Son Güncelleme:** 27 Ekim 2025  
**Versiyon:** 1.0  
**Durum:** ✅ İlk versiyon tamamlandı

---

## 📞 Destek

Dokümantasyonla ilgili sorularınız için:
- **Email:** docs@bolbolode.com
- **GitHub Issues:** [Open an issue](https://github.com/yourusername/BolBolOde/issues)

---

## ✨ Katkıda Bulunma

Dokümantasyonu iyileştirmek için:
1. Hata/eksik bulduğunuzda issue açın
2. Düzeltme öneriniz varsa PR gönderin
3. Yeni doküman eklemek isterseniz tartışma başlatın

---

<div align="center">

**Mutlu Okumalar! 📚**

[⬆ Başa Dön](#bölbölöde---dokümantasyon-i̇ndeksi)

</div>

