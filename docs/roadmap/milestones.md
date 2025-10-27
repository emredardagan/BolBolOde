# BölBölÖde - Milestone Roadmap

## İçindekiler
1. [M1 - MVP (Temel Özellikler)](#m1---mvp-temel-özellikler)
2. [M2 - Gelişmiş Paylaşım & Çoklu Para](#m2---gelişmiş-paylaşım--çoklu-para)
3. [M3 - Offline & Realtime & Settlement](#m3---offline--realtime--settlement)
4. [M4 - Optimize & Güvenlik](#m4---optimize--güvenlik)
5. [M5 - Polish & Store Yayını](#m5---polish--store-yayını)
6. [Post-Launch Roadmap](#post-launch-roadmap)

---

## M1 - MVP (Temel Özellikler)

**Süre:** 2-3 hafta  
**Durum:** 🟡 Planlanıyor  
**Hedef:** Minimum viable product - Temel kullanım senaryolarını karşılayan uygulama

### 1.1 Özellikler

#### Auth & User Management
- [x] E-posta/şifre ile kayıt
- [x] E-posta/şifre ile giriş
- [x] Şifre sıfırlama
- [x] Profil görüntüleme
- [x] Profil düzenleme (ad, avatar/emoji)
- [ ] Çıkış

#### Grup Yönetimi
- [x] Yeni grup oluşturma
- [x] Grup detayları (ad, açıklama, başlangıç/bitiş tarihi, para birimi)
- [x] Davet linki oluşturma
- [x] Davet linki ile katılma
- [x] Üye listesi görüntüleme
- [x] Gruptan ayrılma
- [ ] Üye çıkarma (Owner)

#### Harcama Yönetimi
- [x] Harcama ekleme (eşit paylaşım)
  - Başlık, tutar, tarih
  - Ödeyen kişi
  - Dahil olan kişiler
  - Kategori (Yemek, Ulaşım, Konaklama, Eğlence, Alışveriş, Diğer)
- [x] Harcama listesi (tarih sıralı)
- [x] Harcama detayı
- [x] Harcama düzenleme
- [x] Harcama silme
- [ ] Harcama arama/filtreleme (basit)

#### Bakiye & Hesaplama
- [x] Kişi bazında net bakiye görüntüleme
- [x] Grup bakiye özeti
- [x] Borç sadeleştirme (greedy algoritma)
- [x] Önerilen transferler listesi

#### Raporlama
- [x] Grup özet raporu
  - Toplam harcama
  - Harcama sayısı
  - Kategori dağılımı (basit liste)
- [ ] Harcama detay listesi

#### Rol & İzinler
- [x] Owner rolü
- [x] Editor rolü
- [x] Viewer rolü
- [x] Rol bazlı UI kontrolü

### 1.2 Teknik Gereksinimler

#### Frontend
- [x] React Native + Expo proje kurulumu
- [x] TypeScript konfigürasyonu
- [x] Navigation yapısı (Stack + Bottom Tab)
- [x] Temel UI komponentleri
- [x] NativeWind (Tailwind) setup
- [x] Form yönetimi (React Hook Form + Zod)

#### Backend
- [x] Firebase proje kurulumu
- [x] Firebase Authentication entegrasyonu
- [x] Firestore collections/subcollections yapısı
- [x] Firestore Security Rules (temel)
- [x] Cloud Functions (calculateBalances, simplifyDebts)

#### State Management
- [x] React Query setup
- [x] MMKV storage setup
- [x] SecureStore entegrasyonu

#### API Integration
- [x] Firebase SDK entegrasyonu
- [x] API service katmanı
- [x] Error handling
- [ ] Loading states

### 1.3 Test & QA
- [ ] Unit tests (algoritma, hesaplamalar)
- [ ] Component tests (kritik ekranlar)
- [ ] Manuel test senaryoları
- [ ] Bug tracking setup

### 1.4 Teslimatlar

- [ ] Çalışan mobil uygulama (iOS + Android)
- [ ] Firebase backend deploy edilmiş
- [ ] Temel dokümantasyon
- [ ] Test kullanıcıları için TestFlight/Internal Track

### 1.5 Kabul Kriterleri

```
✅ Kullanıcı kayıt olup giriş yapabiliyor
✅ Grup oluşturup üye davet edebiliyor
✅ Eşit paylaşımlı harcama ekleyebiliyor
✅ Net bakiyesini görebiliyor
✅ Önerilen transferleri görebiliyor
✅ Temel raporları görebiliyor
✅ 2 kullanıcı aynı grupta çalışabiliyor
```

---

## M2 - Gelişmiş Paylaşım & Çoklu Para

**Süre:** 2 hafta  
**Durum:** 🔴 Bekliyor  
**Hedef:** Gelişmiş harcama paylaşım tipleri ve çoklu para birimi desteği

### 2.1 Özellikler

#### Gelişmiş Harcama
- [ ] Ağırlıklı paylaşım (weighted)
- [ ] Kesin tutarlı paylaşım (exact amount)
- [ ] Yüzdesel paylaşım (percentage)
- [ ] Çoklu ödeyen (multi-payer) - Opsiyonel
- [ ] Fiş fotoğrafı ekleme
- [ ] Notlar ve etiketler

#### Çoklu Para Birimi
- [ ] Desteklenen para birimleri (TRY, USD, EUR, GBP, JPY, vb.)
- [ ] Döviz kuru API entegrasyonu
- [ ] Günlük kur cache'leme
- [ ] Manuel kur girişi
- [ ] Harcama girişinde farklı para birimi seçimi
- [ ] Otomatik dönüşüm (grup para birimine)
- [ ] Kur bilgisi gösterimi

#### Gelişmiş Raporlama
- [ ] PDF export
- [ ] CSV export
- [ ] Kategori bazlı grafikler (Victory Native)
- [ ] Tarih aralığı filtreleme
- [ ] Kişi bazlı rapor

#### Google OAuth
- [ ] Google ile kayıt
- [ ] Google ile giriş

### 2.2 Teknik Gereksinimler

#### Backend
- [ ] ExchangeRate API entegrasyonu
- [ ] Scheduled function (daily rate update)
- [ ] Storage Rules (fiş fotoğrafları)
- [ ] PDF generation (Cloud Function + Puppeteer)

#### Frontend
- [ ] Gelişmiş form UI (paylaşım tipleri)
- [ ] Image picker entegrasyonu
- [ ] Chart library (Victory Native)
- [ ] File download & share

### 2.3 Teslimatlar

- [ ] Tüm paylaşım tipleri çalışıyor
- [ ] Döviz dönüşümleri doğru hesaplanıyor
- [ ] PDF/CSV export çalışıyor
- [ ] Google OAuth çalışıyor

### 2.4 Kabul Kriterleri

```
✅ Ağırlıklı paylaşımla harcama eklenebiliyor
✅ EUR tutarlı harcama TL'ye çevriliyor
✅ Fiş fotoğrafı yüklenip görüntülenebiliyor
✅ PDF rapor indirilebiliyor
✅ Google hesabıyla giriş yapılabiliyor
```

---

## M3 - Offline & Realtime & Settlement

**Süre:** 2-3 hafta  
**Durum:** 🔴 Bekliyor  
**Hedef:** Offline kullanım, real-time senkronizasyon ve ödeme kaydı

### 3.1 Özellikler

#### Offline-First
- [ ] Local storage (MMKV) entegrasyonu
- [ ] Sync queue sistemi
- [ ] Offline harcama ekleme
- [ ] Offline harcama düzenleme
- [ ] Network state detection
- [ ] Otomatik senkronizasyon
- [ ] Sync progress indicator

#### Conflict Resolution
- [ ] Version control (optimistic locking)
- [ ] Last Write Wins stratejisi
- [ ] Kullanıcı bilgilendirmesi

#### Settlement (Ödeme Kaydı)
- [ ] Ödeme işaretleme
- [ ] Ödeme detayları (tutar, tarih, method, not)
- [ ] Ödeme geçmişi
- [ ] Ödeme onayı (opsiyonel, two-way)

#### Push Notifications
- [ ] Expo Push Notification setup
- [ ] FCM entegrasyonu
- [ ] Notification triggers (Cloud Functions)
- [ ] Bildirim tipleri:
  - Yeni harcama
  - Harcama düzenlendi
  - Borç değişti
  - Ödeme alındı
  - Grup daveti

#### Realtime Updates
- [ ] Firestore real-time listeners
- [ ] Optimistic updates
- [ ] Auto-refresh on changes

### 3.2 Teknik Gereksinimler

#### Backend
- [ ] Cloud Function triggers (onCreate, onUpdate)
- [ ] Notification service
- [ ] Batch processing

#### Frontend
- [ ] Background sync
- [ ] NetInfo integration
- [ ] Push notification permissions
- [ ] Deep linking (notification → screen)

### 3.3 Teslimatlar

- [ ] Offline kullanım çalışıyor
- [ ] Senkronizasyon çalışıyor
- [ ] Bildirimler gönderiliyor
- [ ] Settlement kayıt edilebiliyor

### 3.4 Kabul Kriterleri

```
✅ Offline harcama eklenip online'da senkronize ediliyor
✅ İki kullanıcı aynı anda düzenlediğinde conflict çözülüyor
✅ Yeni harcama eklendiğinde push notification geliyor
✅ Settlement kaydedildiğinde bakiye güncelleniyor
✅ Bildirime tıklayınca ilgili ekrana gidiyor
```

---

## M4 - Optimize & Güvenlik

**Süre:** 2 hafta  
**Durum:** 🔴 Bekliyor  
**Hedef:** Performans optimizasyonu, güvenlik sertleştirme, erişilebilirlik

### 4.1 Özellikler

#### Gelişmiş Algoritma
- [ ] Minimum cash flow algoritması (graph-based) - Opsiyonel
- [ ] A/B test (greedy vs min-cash-flow)

#### Erişilebilirlik
- [ ] Screen reader desteği (TalkBack/VoiceOver)
- [ ] Dinamik font boyutu
- [ ] Yüksek kontrast modu
- [ ] Klavye navigasyonu

#### Performance
- [ ] FlashList entegrasyonu (büyük listeler)
- [ ] Image optimization (thumbnail, lazy load)
- [ ] Bundle size optimization
- [ ] Code splitting
- [ ] Memoization

#### Security Hardening
- [ ] Firestore Rules review & test
- [ ] Rate limiting (Cloud Functions)
- [ ] Input validation (zod schemas)
- [ ] HTTPS certificate pinning
- [ ] Dependency audit & update

#### i18n
- [ ] İngilizce dil desteği (EN)
- [ ] Dil değiştirme
- [ ] Tarih/para birimi formatları

### 4.2 Teknik Gereksinimler

#### Testing
- [ ] E2E tests (Detox)
- [ ] %80+ test coverage
- [ ] Security testing
- [ ] Load testing

#### Monitoring
- [ ] Sentry entegrasyonu
- [ ] Firebase Analytics
- [ ] Performance monitoring
- [ ] Error tracking

### 4.3 Teslimatlar

- [ ] Performans metrikleri iyileştirilmiş
- [ ] Erişilebilirlik testleri geçiyor
- [ ] Güvenlik audit tamamlandı
- [ ] E2E test suite çalışıyor

### 4.4 Kabul Kriterleri

```
✅ Büyük liste (1000 harcama) smooth scroll ediyor
✅ TalkBack ile uygulama kullanılabiliyor
✅ İngilizce dil seçeneği çalışıyor
✅ npm audit clean
✅ E2E testler %100 geçiyor
```

---

## M5 - Polish & Store Yayını

**Süre:** 1-2 hafta  
**Durum:** 🔴 Bekliyor  
**Hedef:** Production-ready, store yayını

### 5.1 Özellikler

#### UI/UX Polish
- [ ] Animasyonlar (Reanimated)
- [ ] Loading states & skeleton screens
- [ ] Empty states
- [ ] Error states
- [ ] Success feedback (toast, haptic)
- [ ] Dark mode
- [ ] Onboarding flow

#### Branding
- [ ] App icon (iOS + Android)
- [ ] Splash screen
- [ ] Brand colors & typography
- [ ] Marketing materials

#### Legal & Compliance
- [ ] Kullanım koşulları
- [ ] Gizlilik politikası
- [ ] KVKK/GDPR aydınlatma metni
- [ ] Cookie policy (web)

#### Store Preparation
- [ ] App Store listing
  - Screenshots (iOS)
  - Description
  - Keywords
  - Preview video
- [ ] Google Play listing
  - Screenshots (Android)
  - Description
  - Keywords
  - Feature graphic
- [ ] Privacy manifest (iOS)
- [ ] Content rating

### 5.2 Teknik Gereksinimler

#### CI/CD
- [ ] GitHub Actions workflow
- [ ] EAS Build setup
- [ ] Automated testing
- [ ] Automated deployment
- [ ] Release notes automation

#### Production
- [ ] Environment separation (dev/staging/prod)
- [ ] Firebase production project
- [ ] Analytics setup
- [ ] Crash reporting
- [ ] App versioning

### 5.3 Teslimatlar

- [ ] Production build (iOS + Android)
- [ ] App Store submission
- [ ] Google Play submission
- [ ] Landing page (opsiyonel)
- [ ] Support email setup

### 5.4 Kabul Kriterleri

```
✅ Tüm UI polish tamamlandı
✅ Dark mode çalışıyor
✅ Tüm yasal dokümanlar hazır
✅ Store listeleri onaylandı
✅ Production build test edildi
✅ App submitted to stores
```

---

## Post-Launch Roadmap

### v1.1 (1 ay sonra)
- [ ] Kullanıcı feedback entegrasyonu
- [ ] Bug fixes
- [ ] Minor improvements
- [ ] Analytics review & optimization

### v1.2 (2 ay sonra)
- [ ] Tekrarlı harcamalar (recurring expenses)
- [ ] Grup şablonları
- [ ] Borç hatırlatıcıları
- [ ] Apple Sign In (iOS requirement)

### v2.0 (6 ay sonra)
- [ ] Ödeme gateway entegrasyonu (Iyzico/Stripe)
- [ ] Web uygulaması (PWA)
- [ ] Fiş OCR (otomatik okuma)
- [ ] Akıllı kategorilendirme (ML)

### v3.0 (1 yıl sonra)
- [ ] Desktop app
- [ ] Bütçe yönetimi
- [ ] Gelir takibi
- [ ] API marketplace

---

## Genel Timeline

```
Milestone     | Süre    | Bitiş Tarihi (Tahmini)
------------- | ------- | ----------------------
M1 - MVP      | 3 hafta | 20 Kasım 2025
M2 - Gelişmiş | 2 hafta | 4 Aralık 2025
M3 - Offline  | 3 hafta | 25 Aralık 2025
M4 - Optimize | 2 hafta | 8 Ocak 2026
M5 - Polish   | 2 hafta | 22 Ocak 2026
------------- | ------- | ----------------------
Toplam        | 12 hafta| ~3 ay
```

**Launch Date (Hedef):** Şubat 2026

---

## Resource Planning

### Ekip
- 1 x Full-stack Developer (React Native + Firebase)
- 1 x UI/UX Designer (Opsiyonel, freelance)
- 1 x QA Tester (Part-time, M4-M5)

### Maliyet Tahmini
```
Firebase:
  - Spark Plan (Free): MVP için yeterli
  - Blaze Plan: $25-50/ay (production)

Expo:
  - Free plan: Development
  - Production: $29/ay (EAS Build)

Domain & Hosting:
  - Domain: $12/yıl
  - Firebase Hosting: Free

Third-party:
  - Exchange Rate API: Free (1500 req/mo)
  - Sentry: Free (5K errors/mo)

Store:
  - Apple Developer: $99/yıl
  - Google Play: $25 (one-time)

Total (İlk yıl): ~$500-700
```

---

## Riskler ve Mitigations

| Risk | Etki | Olasılık | Mitigation |
|------|------|----------|------------|
| Firebase cost spike | Yüksek | Orta | Monitoring & alerts, caching |
| Slow adoption | Orta | Yüksek | Marketing, referral program |
| Store rejection | Yüksek | Düşük | Guidelines follow, pre-review |
| Security breach | Çok Yüksek | Düşük | Security audit, best practices |
| Scope creep | Orta | Yüksek | Strict milestone adherence |

---

**Versiyon:** 1.0  
**Hazırlayan:** BölBölÖde Ekibi  
**Son Güncelleme:** 27 Ekim 2025  
**Status:** 🟡 Planlanıyor → M1 başlayacak

