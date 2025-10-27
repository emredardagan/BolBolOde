<!-- 3ad98775-68c0-4e7c-9c99-a1bdbd91af86 c62e3314-2f22-4736-aa2d-9d9a1c6ee594 -->
# BölBölÖde - Kapsamlı Dokümantasyon Planı

## Genel Bakış

React Native + Firebase kullanarak mobil bir bill splitting uygulaması için tüm teknik ve ürün dokümantasyonu oluşturulacak. M1-M5 milestone'larını kapsayan production-ready bir plan hazırlanacak.

## Dosya Yapısı

```
/docs
  /prd - Ürün gereksinimleri
  /technical - Teknik dokümantasyon
  /api - API spesifikasyonları
  /architecture - Mimari diyagramlar
  /wireframes - Ekran akış ve wireframe'ler
  /algorithms - Algoritma ve test senaryoları
  /deployment - CI/CD ve deployment
  /data - Örnek veri setleri
```

## Oluşturulacak Dokümanlar

### 1. Ürün Gereksinimleri (PRD)

- **prd/product-requirements.md**: Kullanıcı senaryoları, personalar, özellik listesi
- **prd/user-stories.md**: Detaylı kullanıcı hikayeleri ve acceptance criteria
- **prd/edge-cases.md**: Kenar durumlar ve çözüm önerileri

### 2. Teknik Mimari

- **technical/architecture-overview.md**: Sistem mimarisi, teknoloji stack, katmanlar
- **technical/data-model.md**: Detaylı veri modeli, Firebase Firestore şema yapısı
- **technical/er-diagram.mmd**: Mermaid formatında ER diyagramı
- **technical/security-privacy.md**: Güvenlik, KVKK/GDPR, roller ve izinler
- **technical/offline-sync.md**: Offline-first stratejisi, conflict resolution

### 3. API Dokümantasyonu

- **api/openapi-spec.yaml**: OpenAPI 3.0 spesifikasyonu (tüm endpoint'ler)
- **api/firebase-functions.md**: Firebase Cloud Functions dokümantasyonu
- **api/realtime-subscriptions.md**: Firestore realtime listener'lar

### 4. Ekran Akışları ve Tasarım

- **wireframes/navigation-flow.mmd**: Navigasyon diyagramı (Mermaid)
- **wireframes/screen-specs.md**: Her ekran için detaylı spec (başlık, CTA, boş durum)
- **wireframes/wireframes.md**: ASCII/Markdown low-fi wireframe'ler

### 5. Algoritma ve Hesaplamalar

- **algorithms/debt-settlement.md**: Greedy borç sadeleştirme algoritması açıklaması
- **algorithms/currency-conversion.md**: Döviz dönüşüm ve yuvarlama kuralları
- **algorithms/test-cases.md**: Algoritma test senaryoları
- **algorithms/sample-datasets.json**: Örnek input/output veri setleri

### 6. Test Stratejisi

- **technical/test-strategy.md**: Unit, integration, E2E test planı
- **technical/test-scenarios.md**: Kritik test senarioları ve beklenen sonuçlar

### 7. CI/CD ve Deployment

- **deployment/ci-cd-pipeline.md**: GitHub Actions + Fastlane workflow açıklaması
- **deployment/github-actions-example.yaml**: Örnek GitHub Actions config
- **deployment/fastlane-example.rb**: Örnek Fastlane yapılandırması
- **deployment/environment-setup.md**: Geliştirme ortamı kurulum rehberi

### 8. Yol Haritası ve Milestones

- **roadmap/milestones.md**: M1-M5 detaylı milestone planı, süre tahminleri
- **roadmap/sprint-breakdown.md**: Sprint bazında görev dağılımı

### 9. Analitik ve Metrikler

- **technical/analytics-events.md**: Track edilecek event'ler, KPI'lar
- **technical/performance-metrics.md**: NFR'ler, performans hedefleri

### 10. Yasal ve Compliance

- **legal/terms-of-service.md**: Kullanıcı sözleşmesi taslağı
- **legal/privacy-policy.md**: Gizlilik politikası taslağı
- **legal/kvkk-gdpr-notes.md**: KVKK/GDPR compliance notları

### 11. Örnek Veri

- **data/sample-expenses.json**: Anonim örnek harcama verileri
- **data/sample-groups.json**: Örnek grup verileri
- **data/sample-settlements.json**: Örnek ödeme kayıtları

### 12. README ve Genel Dokümantasyon

- **README.md**: Ana proje README (teknik stack, kurulum, mimari)
- **docs/README.md**: Dokümantasyon index

## Özel Dikkat Edilecek Noktalar

### Para Birimi ve Hassasiyet

- Tüm para hesaplamalarında decimal kullanımı
- Yuvarlama kuralları (half-up, kuruş adımları)
- FX rate immutability

### Borç Sadeleştirme

- Greedy algoritma (max alacaklı ↔ max borçlu)
- Deterministik sonuçlar
- Yuvarlama sonrası Σ net = 0 doğrulaması

### Çoklu Dil Desteği

- TR/EN i18n yapısı
- Para birimi formatları

### Firebase Yapısı

- Firestore collections ve subcollections
- Security rules örnekleri
- Composite index gereksinimleri
- Cloud Functions triggers

### To-dos

- [ ] Ürün gereksinimleri dokümantasyonu (PRD, user stories, edge cases)
- [ ] Teknik mimari dokümantasyonu (architecture, data model, ER diagram, security)
- [ ] API spesifikasyonları (OpenAPI YAML, Firebase Functions, realtime subscriptions)
- [ ] Ekran akışları ve wireframe'ler (navigation flow, screen specs)
- [ ] Algoritma dokümantasyonu ve test senaryoları (debt settlement, currency, test cases)
- [ ] Test stratejisi ve senaryoları
- [ ] CI/CD pipeline ve deployment dokümantasyonu (GitHub Actions, Fastlane örnekleri)
- [ ] Milestone roadmap ve sprint breakdown (M1-M5)
- [ ] Analitik events, yasal dokümantasyon (KVKK/GDPR, terms, privacy)
- [ ] Örnek veri setleri (expenses, groups, settlements)
- [ ] Ana README ve dokümantasyon index oluşturma