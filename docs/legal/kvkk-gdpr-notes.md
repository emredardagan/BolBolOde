# BölBölÖde - KVKK/GDPR Compliance Notları

## İçindekiler
1. [Genel Bakış](#1-genel-bakış)
2. [KVKK Gereksinimleri](#2-kvkk-gereksinimleri)
3. [GDPR Gereksinimleri](#3-gdpr-gereksinimleri)
4. [Uygulama Önlemleri](#4-uygulama-önlemleri)
5. [Veri İşleme Aydınlatma Metni](#5-veri-işleme-aydınlatma-metni)

---

## 1. Genel Bakış

BölBölÖde uygulaması, KVKK (Türkiye) ve GDPR (AB) gereksinimlerine uyum sağlamalıdır.

### 1.1 Yasal Çerçeve

- **KVKK:** 6698 sayılı Kişisel Verilerin Korunması Kanunu
- **GDPR:** General Data Protection Regulation (EU 2016/679)

---

## 2. KVKK Gereksinimleri

### 2.1 Veri Sorumlusu

- **Unvan:** [Şirket Adı]
- **Adres:** [Adres]
- **İletişim:** [Email]

### 2.2 Aydınlatma Yükümlülüğü

Kullanıcılara şu bilgiler verilmelidir:
- Veri sorumlusu kimliği
- Veri toplama amacı
- Veri işleme hukuki sebebi
- Veri paylaşımı
- Kullanıcı hakları

### 2.3 Açık Rıza

- Kayıt sırasında açık rıza alınmalı
- Rıza geri alınabilir olmalı
- Rıza kayıtları saklanmalı

### 2.4 Kullanıcı Hakları

- Bilgi talep etme
- Erişim talep etme
- Düzeltme talep etme
- Silme talep etme
- İtiraz etme
- Şikayet etme

---

## 3. GDPR Gereksinimleri

### 3.1 Yasal Dayanak

Veri işleme için yasal dayanaklar:
- **Rıza:** Kullanıcı rızası
- **Sözleşme:** Hizmet sağlama
- **Yasal Yükümlülük:** Yasal gereklilikler

### 3.2 Veri Minimizasyonu

- Sadece gerekli veriler toplanmalı
- Veri saklama süresi sınırlı olmalı
- Kullanılmayan veriler silinmeli

### 3.3 Şeffaflık

- Gizlilik politikası açık olmalı
- Veri işleme şeffaf olmalı
- Kullanıcı bilgilendirilmeli

### 3.4 Güvenlik

- Teknik önlemler
- Organizasyonel önlemler
- Veri ihlali bildirimi (72 saat)

---

## 4. Uygulama Önlemleri

### 4.1 Teknik Önlemler

```typescript
// Veri şifreleme
- In-transit encryption (HTTPS)
- At-rest encryption (Firebase)
- Password hashing (bcrypt)

// Güvenlik
- Authentication tokens
- Role-based access control
- Input validation
- SQL injection prevention
```

### 4.2 Organizasyonel Önlemler

- Veri koruma sorumlusu atanmalı
- Personel eğitimi
- Erişim kontrolü
- Düzenli denetimler

### 4.3 Veri İşleme Kayıtları

- Veri işleme aktiviteleri loglanmalı
- Erişim logları tutulmalı
- Değişiklik geçmişi saklanmalı

---

## 5. Veri İşleme Aydınlatma Metni

### 5.1 Veri Sorumlusu

[Şirket bilgileri]

### 5.2 Toplanan Veriler

- Kimlik bilgileri
- İletişim bilgileri
- Kullanım verileri
- İçerik verileri

### 5.3 Veri İşleme Amacı

- Hizmet sağlama
- Hesap yönetimi
- İyileştirme
- Yasal yükümlülükler

### 5.4 Veri Paylaşımı

- Firebase (veri depolama)
- Analytics (anonymized)
- Yasal gereklilikler

### 5.5 Kullanıcı Hakları

- Bilgi talep etme
- Erişim talep etme
- Düzeltme talep etme
- Silme talep etme
- İtiraz etme
- Şikayet etme (KVKK/GDPR)

### 5.6 İletişim

Haklarınızı kullanmak için: [email@bolbolode.com]

---

## Uyum Checklist

### KVKK
- [ ] Aydınlatma metni hazır
- [ ] Açık rıza mekanizması
- [ ] Kullanıcı hakları uygulaması
- [ ] Veri güvenliği önlemleri
- [ ] Veri ihlali bildirim prosedürü

### GDPR
- [ ] Privacy policy (GDPR uyumlu)
- [ ] Cookie consent (web için)
- [ ] Data processing agreement
- [ ] Right to be forgotten
- [ ] Data portability
- [ ] Breach notification (72h)

---

## Notlar

- Bu doküman taslak niteliğindedir
- Yasal danışmanlık alınmalıdır
- Yerel yasalara göre güncellenmelidir
- Düzenli olarak gözden geçirilmelidir

---

## Kaynaklar

- [KVKK Kanunu](https://www.kvkk.gov.tr/)
- [GDPR Regulation](https://gdpr.eu/)
- [Firebase Privacy](https://firebase.google.com/support/privacy)

