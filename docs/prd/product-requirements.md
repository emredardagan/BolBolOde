# BölBölÖde - Ürün Gereksinimleri Dokümanı (PRD)

## 1. Proje Özeti

### 1.1 Ürün Adı
**BölBölÖde** - Ortak Harcama Yönetimi ve Paylaşımı Uygulaması

### 1.2 Vizyon
Arkadaş grupları ve etkinlik katılımcıları için harcama paylaşımını şeffaf, adil ve kolay hale getiren mobil bir çözüm.

### 1.3 Amaç
- Grup içi harcamaların merkezi bir yerde kaydedilmesi
- Her harcamaya dahil olan kişilerin seçilmesi ve özelleştirilmiş paylaşım
- Otomatik borç sadeleştirme ile minimum transferle hesap kapama
- Çoklu para birimi desteği ve offline kullanım

### 1.4 Hedef Platform
- iOS (iOS 13+)
- Android (Android 8.0+)
- Mobile-first tasarım

### 1.5 İlham Kaynakları
- Splitwise
- BillSplit (varad615/BillSplit)
- Settle Up

---

## 2. Kullanıcı Personaları

### 2.1 Persona A: "Grup Organizatörü" - Ayşe
**Demografi:**
- 28 yaş, sosyal aktivite organizatörü
- Sık sık arkadaş gezileri düzenler
- Detaylara dikkat eder, düzenli ve planlı

**İhtiyaçlar:**
- Grup oluşturma ve üye davetini hızlıca yapabilme
- Tüm harcamaları takip edebilme ve raporlama
- Kimin ne kadar borcu olduğunu net görebilme
- Güvenilir ve şeffaf bir sistem

**Kullanım Senaryoları:**
- Yılbaşı tatili için 10 kişilik grup oluşturur
- QR kod ile tüm üyeleri davet eder
- Her gün yapılan harcamaları kaydeder
- Tatil sonunda PDF rapor oluşturur ve paylaşır

**Zorluklar:**
- Farklı para birimlerinde harcamalar (EUR, USD, TL)
- Bazı harcamalara herkesin dahil olmaması
- Ödeme takibi ve hatırlatma

### 2.2 Persona B: "Katılımcı" - Mehmet
**Demografi:**
- 32 yaş, yazılım geliştirici
- Grup aktivitelerine katılır ama organize etmez
- Teknolojiye aşina, pratiklik arar

**İhtiyaçlar:**
- Basit ve hızlı harcama ekleme
- Kendi bakiyesini kolayca görebilme
- Hangi harcamalara dahil olduğunu bilme
- Offline çalışabilme (tatilde internet olmayabilir)

**Kullanım Senaryoları:**
- Restaurantta fatura geldiğinde hemen harcama ekler
- Fiş fotoğrafı çeker ve ekler
- Kim ne kadar borçlu bildirim alır
- Havale yaptıktan sonra ödemeyi işaretler

**Zorluklar:**
- İnternet olmadan kullanım
- Karmaşık arayüzler
- Kafa karıştırıcı borç hesaplamaları

### 2.3 Persona C: "Pasif Kullanıcı" - Zeynep
**Demografi:**
- 25 yaş, öğrenci
- Teknolojiye orta düzey aşina
- Sadece kendi bakiyesini takip etmek ister

**İhtiyaçlar:**
- Minimal etkileşim
- Sadece bakiye görüntüleme
- Bildirimlerle güncel kalma
- Basit ödeme işaretleme

**Kullanım Senaryoları:**
- Gruba sadece görüntüleyici olarak katılır
- Bildirimlerden yeni harcamaları öğrenir
- Borçlandığında ödeme yapar ve işaretler

---

## 3. Fonksiyonel Gereksinimler

### 3.1 Kimlik Doğrulama ve Kullanıcı Yönetimi

#### FR-AUTH-001: Kullanıcı Kaydı
- E-posta ve şifre ile kayıt
- Google OAuth entegrasyonu
- Telefon numarası (opsiyonel)
- Profil bilgileri: Ad, soyad, avatar/emoji, tercih edilen para birimi

#### FR-AUTH-002: Giriş
- E-posta/şifre ile giriş
- Google ile giriş
- "Beni hatırla" seçeneği
- Şifre sıfırlama (e-posta ile)

#### FR-AUTH-003: Profil Yönetimi
- Profil bilgilerini düzenleme
- Avatar/emoji değiştirme
- Dil tercihi (TR/EN)
- Para birimi tercihi
- Bildirim ayarları

### 3.2 Grup Yönetimi

#### FR-GROUP-001: Grup Oluşturma
**Gerekli Alanlar:**
- Grup adı
- Açıklama (opsiyonel)
- Başlangıç tarihi
- Bitiş tarihi (opsiyonel)
- Varsayılan para birimi
- Grup avatarı/emoji

**İş Kuralları:**
- Grup adı minimum 2, maksimum 50 karakter
- Oluşturan kişi otomatik "Owner" rolü alır
- Grup ID benzersiz olmalı

#### FR-GROUP-002: Üye Davetiyesi
**Davet Yöntemleri:**
- Davet linki (benzersiz token)
- QR kod
- E-posta ile davet
- Uygulama içi kullanıcı arama

**İş Kuralları:**
- Davet linki 7 gün geçerli (yapılandırılabilir)
- Bir link ile maksimum 50 katılım (spam önleme)
- Owner istediği zaman linki iptal edebilir

#### FR-GROUP-003: Üye Yönetimi
- Üye listesini görüntüleme
- Üye rolü değiştirme (Owner yetkisi)
- Üyeyi çıkarma (Owner yetkisi)
- Gruptan ayrılma (Owner hariç)
- Üye durumu: Active, Invited, Left

#### FR-GROUP-004: Grup Düzenleme
- Grup bilgilerini güncelleme
- Grup avatarını değiştirme
- Varsayılan para birimini değiştirme (Owner)

#### FR-GROUP-005: Grup Silme
- Sadece Owner silebilir
- Tüm harcamalar sıfır bakiyeye gelmeli
- Silme onay modalı
- Soft delete (30 gün içinde geri yüklenebilir)

### 3.3 Harcama Yönetimi

#### FR-EXPENSE-001: Harcama Ekleme
**Gerekli Alanlar:**
- Başlık/açıklama
- Tutar
- Para birimi
- Ödeyen kişi
- Harcama tarihi
- Dahil olan kişiler

**Opsiyonel Alanlar:**
- Kategori (Yemek, Ulaşım, Konaklama, Eğlence, Diğer)
- Not
- Fiş fotoğrafı (maks 5 MB)
- Etiketler

**İş Kuralları:**
- Tutar > 0 olmalı
- Minimum 2 karakter başlık
- Ödeyen kişi dahil olan listede olmalı
- Fiş fotoğrafı JPEG/PNG formatında

#### FR-EXPENSE-002: Paylaşım Tipleri

**Eşit Paylaşım (Equal Split):**
- Tutar eşit olarak bölünür
- Varsayılan mod
- Örnek: 300 TL → 3 kişi → 100 TL/kişi

**Ağırlıklı Paylaşım (Weighted):**
- Her kişi için ağırlık (weight) belirlenir
- Toplam ağırlığa göre orantısal bölünür
- Örnek: A(2x), B(1x), C(1x) → 400 TL → A: 200, B: 100, C: 100

**Kesin Tutar (Exact Amount):**
- Her kişi için manuel tutar girilir
- Toplam girilen tutarlar, harcama tutarına eşit olmalı
- Örnek: 300 TL → A: 150, B: 100, C: 50

**Yüzdesel Paylaşım (Percentage):**
- Her kişi için yüzde belirlenir
- Toplam %100 olmalı
- Örnek: 400 TL → A: %50, B: %30, C: %20

#### FR-EXPENSE-003: Çoklu Ödeyen (Multi-Payer)
- Bir harcamaya birden fazla kişi ödeme yapmış olabilir
- Her ödeyen için tutar girilir
- Toplam ödenen = Harcama tutarı

#### FR-EXPENSE-004: Harcama Düzenleme
- Harcama eklendikten sonra düzenlenebilir
- Edit yetkisi: Owner, Editor, harcamayı ekleyen
- Düzenleme geçmişi saklanır (audit log)
- Son düzenleme zamanı ve düzenleyen kişi gösterilir

#### FR-EXPENSE-005: Harcama Silme
- Soft delete (30 gün içinde geri yüklenebilir)
- Silme onay modalı
- Bakiye yeniden hesaplanır

#### FR-EXPENSE-006: Draft (Taslak) Harcamalar
- Yarım kalan harcamalar taslak olarak kaydedilebilir
- Sadece oluşturan kişi görebilir
- İstediği zaman tamamlayıp yayınlayabilir

#### FR-EXPENSE-007: Harcama Filtreleme
- Tarih aralığı
- Kategori
- Ödeyen kişi
- Dahil olan kişi
- Tutar aralığı
- Para birimi

### 3.4 Para Birimi ve Döviz Yönetimi

#### FR-CURRENCY-001: Desteklenen Para Birimleri
- TRY (Türk Lirası) - varsayılan
- USD (Amerikan Doları)
- EUR (Euro)
- GBP (İngiliz Sterlini)
- JPY (Japon Yeni)
- CHF (İsviçre Frangı)
- Ve diğer major para birimleri (ISO 4217)

#### FR-CURRENCY-002: Döviz Kuru Yönetimi
**Kur Kaynağı:**
- API: exchangerate-api.com veya fixer.io
- Günlük otomatik güncelleme (cache)
- Manual kur girişi seçeneği

**İş Kuralları:**
- Harcama oluştururken kullanılan kur immutable (değişmez)
- Kur bilgisi harcama ile birlikte saklanır
- Eski harcamaların kuru değişmez

#### FR-CURRENCY-003: Para Birimi Dönüşümü
- Harcama farklı para biriminde girilebilir
- Grup baz para birimine otomatik dönüşüm
- Manuel kur girme opsiyonu
- Dönüşüm detayları gösterilir (kur, tarih)

#### FR-CURRENCY-004: Yuvarlama Kuralları
- Half-up yuvarlama (0.5 ve üstü yukarı)
- Para birimi bazında minimum adım:
  - TRY: 0.01 (kuruş)
  - USD/EUR/GBP: 0.01 (cent/pence)
  - JPY: 1 (yen)
- Decimal hassasiyet: 2 basamak (JPY hariç)

### 3.5 Borç Hesaplama ve Sadeleştirme

#### FR-BALANCE-001: Kişi Bazında Net Bakiye
- Her kişi için net bakiye hesaplanır
- Net Bakiye = Toplam Alacak - Toplam Borç
- Pozitif = Alacaklı (verilmesi gereken)
- Negatif = Borçlu (vermesi gereken)
- Sıfır = Denk

#### FR-BALANCE-002: Bakiye Görünümü
**Kullanıcı Perspektifi:**
- "Sen X TL alacaksın" (pozitif)
- "Sen Y TL borçlusun" (negatif)
- "Hesabın denk" (sıfır)

**Grup Perspektifi:**
- Tüm üyelerin bakiye listesi
- Toplam borç = Toplam alacak kontrolü
- Renkli gösterim (yeşil: alacak, kırmızı: borç)

#### FR-BALANCE-003: Borç Sadeleştirme (Settlement Simplification)
**Algoritma: Greedy Maximum Match**
- Maksimum alacaklı ve maksimum borçlu eşleştirilir
- Minimum transfer sayısı hedeflenir
- Deterministik sonuç (aynı girdi → aynı çıktı)

**Çıktı Formatı:**
```
Ahmet → Mehmet: 350.00 TL
Ayşe → Mehmet: 150.00 TL
Zeynep → Ali: 200.00 TL
```

**İş Kuralları:**
- Yuvarlama sonrası Σ net = 0 doğrulaması
- Transfer tutarları her zaman pozitif
- Transfer sayısı ≤ (N-1) (N = kişi sayısı)

### 3.6 Ödeme Kaydı (Settlement)

#### FR-SETTLEMENT-001: Ödeme İşaretleme
**Özellikler:**
- "Kişi A → Kişi B: X TL ödedi" kaydı
- Tam ödeme veya kısmi ödeme
- Ödeme tarihi
- Ödeme metodu (Nakit, Havale, Kredi Kartı, vb.)
- Not eklenebilir

**İş Kuralları:**
- Ödeme tutarı > 0
- Ödeme tutarı ≤ mevcut borç
- Her ödeme için benzersiz ID

#### FR-SETTLEMENT-002: Ödeme Onayı
- Ödeme yapan işaretler
- Ödeme alan onaylar (opsiyonel)
- İki taraf da onayladıktan sonra bakiye güncellenir
- Onaysız da bakiye güncellenebilir (ayar)

#### FR-SETTLEMENT-003: Ödeme Geçmişi
- Tüm ödemeler listelenir
- Tarih, kişiler, tutar, durum
- Filtreleme: tarih, kişi, durum

### 3.7 Raporlama ve Export

#### FR-REPORT-001: Özet Raporlar
**Grup Özeti:**
- Toplam harcama
- Harcama sayısı
- Kategori dağılımı (grafik)
- En çok harcayan kişi
- Tarih aralığı bazlı filtreleme

**Kişi Özeti:**
- Kişinin yaptığı toplam harcama
- Kişinin payına düşen toplam
- Net bakiye
- Kategori dağılımı

#### FR-REPORT-002: PDF Export
- Grup özet raporu PDF formatında
- Tüm harcama listesi
- Bakiye durumu
- Önerilen transferler
- QR kod ile paylaşılabilir link

#### FR-REPORT-003: CSV Export
- Harcama listesi CSV formatında
- Excel/Google Sheets ile açılabilir
- Tüm detaylar (tarih, kategori, kişiler, tutarlar)

#### FR-REPORT-004: Paylaşılabilir Link
- Grup özeti için public link
- Token-based, süreli (7 gün)
- Sadece okuma yetkisi
- İstenirse link iptal edilebilir

### 3.8 Bildirimler

#### FR-NOTIF-001: Push Bildirimleri
**Bildirim Tipleri:**
- Grup davetiyesi
- Yeni harcama eklendi
- Harcama düzenlendi/silindi
- Borç durumu değişti
- Ödeme alındı
- Ödeme talebi

**Ayarlar:**
- Bildirim tiplerini açma/kapama
- Sessize alma (belirli saatler)
- Grup bazında bildirimleri kapatma

#### FR-NOTIF-002: Uygulama İçi Bildirimler
- Bildirim merkezi
- Okunmamış sayısı badge
- Bildirim geçmişi
- Bildirimden ilgili ekrana yönlendirme

#### FR-NOTIF-003: E-posta Bildirimleri
- Haftalık özet (opsiyonel)
- Önemli olaylar (davet, büyük borç değişimi)
- E-posta tercihleri

### 3.9 Offline ve Senkronizasyon

#### FR-OFFLINE-001: Offline Kullanım
- Uygulama internet olmadan çalışır
- Yerel veritabanında veri saklanır (MMKV + AsyncStorage)
- Offline eklenen/düzenlenen veriler queue'ya alınır

#### FR-OFFLINE-002: Otomatik Senkronizasyon
- Online olduğunda otomatik sync
- Queue'daki işlemler sırayla gönderilir
- Başarısız işlemler retry edilir (exponential backoff)
- Sync durumu gösterilir (icon/badge)

#### FR-OFFLINE-003: Çakışma Çözümü
**Strateji: Last Write Wins (LWW)**
- Her kayıt için `updatedAt` timestamp
- En son güncellenen kazanır
- Version alanı ile takip (opsiyonel: optimistic locking)

**Kullanıcı Bildirimi:**
- Çakışma durumunda kullanıcıya bilgi verilir
- "Değişikliğiniz bir başkası tarafından üzerine yazıldı" mesajı

---

## 4. Non-Fonksiyonel Gereksinimler (NFR)

### 4.1 Performans
- **NFR-PERF-001:** Soğuk başlatma < 2.5 saniye
- **NFR-PERF-002:** Ekran geçişleri 60 FPS
- **NFR-PERF-003:** Liste scroll performansı (FlashList)
- **NFR-PERF-004:** API response time < 500ms (p95)
- **NFR-PERF-005:** Offline-first, anında UI güncellemesi

### 4.2 Güvenlik
- **NFR-SEC-001:** HTTPS zorunlu
- **NFR-SEC-002:** Token-based authentication (JWT)
- **NFR-SEC-003:** Şifre hashleme (bcrypt/scrypt)
- **NFR-SEC-004:** Hassas veriler SecureStore/Keychain'de
- **NFR-SEC-005:** Dosya yükleme güvenliği (signed URL)

### 4.3 Ölçeklenebilirlik
- **NFR-SCALE-001:** Grup başına 100 üye destekle
- **NFR-SCALE-002:** Grup başına 1000 harcama destekle
- **NFR-SCALE-003:** 10K eşzamanlı kullanıcı
- **NFR-SCALE-004:** Firestore otomatik ölçekleme

### 4.4 Kullanılabilirlik
- **NFR-UX-001:** Erişilebilirlik (TalkBack, VoiceOver)
- **NFR-UX-002:** Dinamik font boyutu desteği
- **NFR-UX-003:** Yüksek kontrast modu
- **NFR-UX-004:** Karanlık/Açık tema
- **NFR-UX-005:** i18n desteği (TR/EN)

### 4.5 Güvenilirlik
- **NFR-REL-001:** Uptime %99.9
- **NFR-REL-002:** Otomatik hata yakalama (Sentry)
- **NFR-REL-003:** Graceful degradation (API down → offline mode)
- **NFR-REL-004:** Otomatik yedekleme (Firestore native)

### 4.6 Bakım Edilebilirlik
- **NFR-MAINT-001:** TypeScript ile tip güvenliği
- **NFR-MAINT-002:** %80+ test coverage
- **NFR-MAINT-003:** Kod dokümantasyonu (JSDoc)
- **NFR-MAINT-004:** Linting (ESLint) + Formatting (Prettier)

---

## 5. Güvenlik ve Gizlilik

### 5.1 Roller ve İzinler

| Rol      | Grup Sil | Grup Düzenle | Üye Ekle/Çıkar | Harcama Ekle | Harcama Düzenle | Harcama Sil | Görüntüle |
|----------|----------|--------------|----------------|--------------|-----------------|-------------|-----------|
| Owner    | ✓        | ✓            | ✓              | ✓            | ✓               | ✓           | ✓         |
| Editor   | ✗        | ✗            | ✗              | ✓            | ✓ (Kendisi)     | ✓ (Kendisi) | ✓         |
| Viewer   | ✗        | ✗            | ✗              | ✗            | ✗               | ✗           | ✓         |

### 5.2 Veri Gizliliği
- Grup verileri sadece üyeler görebilir
- Public link ile sınırlı paylaşım
- Kullanıcı verisi şifrelenmez (Firestore native encryption)
- Hassas bilgiler (şifre) hash'lenir

### 5.3 KVKK/GDPR Uyumu
- Kullanıcı onayı (açık rıza)
- Veri işleme aydınlatma metni
- Veri silme hakkı
- Veri taşınabilirliği (export)
- Veri erişim hakkı

---

## 6. Başarı Metrikleri (KPI)

### 6.1 Kullanıcı Metrikleri
- **MAU (Monthly Active Users):** Hedef 10K (6 ay)
- **DAU/MAU Ratio:** >0.3 (sticky olma)
- **Retention Rate:** 7-gün >40%, 30-gün >20%

### 6.2 Engagement Metrikleri
- **Grup başına üye sayısı:** Ortalama 5-8
- **Grup başına harcama sayısı:** Ortalama 15+
- **Ortalama session sayısı:** >3/hafta
- **Ortalama session süresi:** >2 dakika

### 6.3 Özellik Kullanım Metrikleri
- **Settlement completion rate:** >80%
- **Export kullanım oranı:** >20%
- **Offline kullanım oranı:** >15%
- **Multi-currency kullanım:** >30%

---

## 7. Öncelikler ve Scope

### 7.1 Must Have (MVP - M1)
- ✅ Auth (E-posta/Şifre)
- ✅ Grup oluşturma ve üye daveti
- ✅ Eşit paylaşımlı harcama ekleme
- ✅ Net bakiye hesaplama
- ✅ Basit sadeleştirme algoritması
- ✅ Temel raporlama

### 7.2 Should Have (M2-M3)
- ⭐ Google OAuth
- ⭐ Ağırlıklı/Kesin tutarlı paylaşım
- ⭐ Çoklu para birimi
- ⭐ Offline-first + sync
- ⭐ Push bildirimleri
- ⭐ Settlement kayıt

### 7.3 Nice to Have (M4-M5)
- 🌟 Minimum cash flow algoritması
- 🌟 Fiş OCR (otomatik okuma)
- 🌟 Tekrarlı harcamalar
- 🌟 Borç hatırlatıcıları
- 🌟 Sosyal özellikler (yorum, like)

### 7.4 Out of Scope (v1.0)
- ❌ Ödeme gateway entegrasyonu (gerçek para transferi)
- ❌ Sohbet/mesajlaşma
- ❌ Grup içi oylama
- ❌ Gelir takibi
- ❌ Bütçe yönetimi

---

## 8. Teknik Kısıtlamalar

### 8.1 Platform Kısıtları
- iOS minimum 13.0
- Android minimum API 26 (8.0)
- Expo SDK 51+

### 8.2 Limit Değerleri
- Grup üye limiti: 100
- Harcama başına kişi limiti: 100
- Fiş fotoğraf boyutu: 5 MB
- Grup başına harcama limiti: 10,000
- Kullanıcı başına grup limiti: 50

### 8.3 Dış Bağımlılıklar
- Firebase Auth (kimlik doğrulama)
- Firestore (veritabanı)
- Firebase Storage (dosya depolama)
- Exchange Rate API (döviz kurları)
- Expo Push Notification Service

---

## 9. Gelecek Vizyon (Roadmap Beyond v1.0)

### 9.1 v2.0 Potansiyel Özellikler
- Ödeme gateway entegrasyonu (Iyzico, Stripe)
- Akıllı harcama kategorilendirme (ML)
- Fiş OCR ve otomatik harcama oluşturma
- Tekrarlı/periyodik harcamalar
- Grup şablonları (Gezi, Ev arkadaşları, vb.)

### 9.2 v3.0 Potansiyel Özellikler
- Web uygulaması
- Desktop uygulaması
- API marketplace (3rd party entegrasyonlar)
- Bütçe ve planlama özellikleri
- Analitics ve insights

---

## 10. Çıktılar ve Teslimatlar

Bu PRD'den türetilecek dokümanlar:
1. ✅ Detaylı Kullanıcı Hikayeleri (user-stories.md)
2. ✅ Kenar Durumlar ve Çözümler (edge-cases.md)
3. ✅ Teknik Mimari Dokümanı
4. ✅ API Spesifikasyonu
5. ✅ Wireframe ve Ekran Akışları
6. ✅ Test Senaryoları

---

**Versiyon:** 1.0  
**Son Güncelleme:** 27 Ekim 2025  
**Hazırlayan:** BölBölÖde Ekibi  
**Durum:** Onay Bekliyor

