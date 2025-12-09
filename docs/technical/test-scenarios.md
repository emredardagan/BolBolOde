# BölBölÖde - Test Senaryoları

## İçindekiler
1. [Authentication Senaryoları](#1-authentication-senaryoları)
2. [Grup Yönetimi Senaryoları](#2-grup-yönetimi-senaryoları)
3. [Harcama Yönetimi Senaryoları](#3-harcama-yönetimi-senaryoları)
4. [Bakiye Hesaplama Senaryoları](#4-bakiye-hesaplama-senaryoları)
5. [Edge Case Senaryoları](#5-edge-case-senaryoları)

---

## 1. Authentication Senaryoları

### 1.1 Başarılı Giriş

**Önkoşul:** Kullanıcı kayıtlı  
**Adımlar:**
1. Login ekranını aç
2. Geçerli email gir
3. Geçerli şifre gir
4. "Giriş Yap" butonuna tıkla

**Beklenen Sonuç:**
- ✅ Ana ekrana yönlendirilir
- ✅ Kullanıcı bilgileri yüklenir
- ✅ Grup listesi gösterilir

---

### 1.2 Geçersiz Şifre

**Önkoşul:** Kullanıcı kayıtlı  
**Adımlar:**
1. Login ekranını aç
2. Geçerli email gir
3. Yanlış şifre gir
4. "Giriş Yap" butonuna tıkla

**Beklenen Sonuç:**
- ❌ Hata mesajı gösterilir: "Şifre hatalı"
- ❌ Ana ekrana yönlendirilmez

---

### 1.3 Yeni Kullanıcı Kaydı

**Önkoşul:** Kullanıcı kayıtlı değil  
**Adımlar:**
1. Register ekranını aç
2. Ad soyad gir
3. Email gir
4. Şifre gir (min 6 karakter)
5. Şifre tekrar gir
6. "Kayıt Ol" butonuna tıkla

**Beklenen Sonuç:**
- ✅ Kullanıcı oluşturulur
- ✅ Otomatik giriş yapılır
- ✅ Ana ekrana yönlendirilir

---

## 2. Grup Yönetimi Senaryoları

### 2.1 Grup Oluşturma

**Önkoşul:** Kullanıcı giriş yapmış  
**Adımlar:**
1. Grup listesi ekranına git
2. "+" butonuna tıkla
3. Grup adı gir: "Kapadokya Gezisi"
4. Açıklama gir (opsiyonel)
5. Para birimi seç: TRY
6. "Grup Oluştur" butonuna tıkla

**Beklenen Sonuç:**
- ✅ Grup oluşturulur
- ✅ Grup detay ekranına yönlendirilir
- ✅ Kullanıcı otomatik üye olur (Owner rolü)

---

### 2.2 Grup Listesi Görüntüleme

**Önkoşul:** Kullanıcının en az 1 grubu var  
**Adımlar:**
1. Ana ekrana git
2. Gruplar tab'ına tıkla

**Beklenen Sonuç:**
- ✅ Tüm gruplar listelenir
- ✅ Her grup için emoji, isim, üye sayısı gösterilir
- ✅ Grup kartına tıklayınca detay ekranına gider

---

### 2.3 Üye Davet Etme

**Önkoşul:** Grup sahibi, grup detay ekranında  
**Adımlar:**
1. Grup detay ekranına git
2. "Üye Davet Et" butonuna tıkla
3. Davetiye linkini paylaş veya QR kod göster

**Beklenen Sonuç:**
- ✅ Davetiye token oluşturulur
- ✅ Link/QR kod gösterilir
- ✅ Davet edilen kişi linke tıklayınca gruba eklenir

---

## 3. Harcama Yönetimi Senaryoları

### 3.1 Harcama Ekleme (Eşit Paylaşım)

**Önkoşul:** Grup içinde, en az 2 üye var  
**Adımlar:**
1. Grup detay ekranına git
2. "Harcama Ekle" butonuna tıkla
3. Başlık gir: "Restoran Yemeği"
4. Tutar gir: "250.00"
5. Para birimi seç: TRY
6. Kategori seç: Food
7. Ödeyen kişi seç: Ahmet
8. Dahil olan kişileri seç: Ahmet, Mehmet, Ayşe
9. "Harcamayı Kaydet" butonuna tıkla

**Beklenen Sonuç:**
- ✅ Harcama kaydedilir
- ✅ Bakiyeler güncellenir:
  - Ahmet: +166.67 TL (ödedi 250, payı 83.33)
  - Mehmet: -83.33 TL
  - Ayşe: -83.33 TL
- ✅ Harcama listesinde görünür

---

### 3.2 Harcama Düzenleme

**Önkoşul:** Harcama mevcut, düzenleme yetkisi var  
**Adımlar:**
1. Harcama listesinde bir harcamaya tıkla
2. "Düzenle" butonuna tıkla
3. Tutarı değiştir: "300.00"
4. "Kaydet" butonuna tıkla

**Beklenen Sonuç:**
- ✅ Harcama güncellenir
- ✅ Bakiyeler yeniden hesaplanır
- ✅ Değişiklik geçmişi kaydedilir

---

### 3.3 Harcama Silme

**Önkoşul:** Harcama mevcut, silme yetkisi var  
**Adımlar:**
1. Harcama detay ekranına git
2. "Sil" butonuna tıkla
3. Onay mesajında "Evet" seç

**Beklenen Sonuç:**
- ✅ Harcama soft delete edilir
- ✅ Bakiyeler yeniden hesaplanır
- ✅ Harcama listede görünmez

---

## 4. Bakiye Hesaplama Senaryoları

### 4.1 Bakiye Görüntüleme

**Önkoşul:** Grup içinde harcamalar var  
**Adımlar:**
1. Grup detay ekranına git
2. "Bakiyeler" tab'ına tıkla

**Beklenen Sonuç:**
- ✅ Her üye için net bakiye gösterilir
- ✅ Pozitif bakiyeler yeşil, negatif bakiyeler kırmızı
- ✅ Toplam bakiye = 0 (yuvarlama toleransı içinde)

---

### 4.2 Borç Sadeleştirme

**Önkoşul:** Grup içinde bakiyeler var  
**Adımlar:**
1. Bakiye ekranına git
2. "Borçları Sadeleştir" butonuna tıkla

**Beklenen Sonuç:**
- ✅ Minimum sayıda transfer önerisi gösterilir
- ✅ Her transfer için: Kim → Kime, Ne kadar
- ✅ Toplam transfer sayısı ≤ (üye sayısı - 1)

---

### 4.3 Ödeme Kaydetme

**Önkoşul:** Borç sadeleştirme önerisi var  
**Adımlar:**
1. Bakiye ekranında bir transfer önerisine tıkla
2. Ödeme yöntemi seç: BankTransfer
3. Not ekle (opsiyonel)
4. "Ödemeyi Kaydet" butonuna tıkla

**Beklenen Sonuç:**
- ✅ Ödeme kaydı oluşturulur (Pending)
- ✅ Alıcı onayladığında Confirmed olur
- ✅ Bakiyeler güncellenir

---

## 5. Edge Case Senaryoları

### 5.1 Çoklu Para Birimi

**Senaryo:** Grup içinde farklı para birimlerinde harcamalar var  
**Adımlar:**
1. TRY bazlı bir grup oluştur
2. TRY harcama ekle: 100 TL
3. USD harcama ekle: 10 USD (kur: 32.5)
4. Bakiyeleri görüntüle

**Beklenen Sonuç:**
- ✅ Tüm harcamalar base currency'ye çevrilir
- ✅ FX rate kaydedilir
- ✅ Bakiyeler doğru hesaplanır

---

### 5.2 Yuvarlama Hatası

**Senaryo:** 3 kişi eşit paylaşım, tutar 100 TL  
**Adımlar:**
1. 100 TL harcama ekle
2. 3 kişi eşit paylaşım seç
3. Bakiyeleri hesapla

**Beklenen Sonuç:**
- ✅ Paylar: 33.33, 33.33, 33.34 (kuruş cinsinden)
- ✅ Toplam = 100 TL
- ✅ Yuvarlama hatası düzeltilir

---

### 5.3 Offline Mod

**Senaryo:** İnternet bağlantısı yok  
**Adımlar:**
1. Uçak modunu aç
2. Harcama eklemeyi dene
3. İnternet bağlantısını aç

**Beklenen Sonuç:**
- ✅ Harcama local'de kaydedilir
- ✅ İnternet geldiğinde sync edilir
- ✅ Conflict yoksa otomatik merge edilir

---

### 5.4 Çok Büyük Grup

**Senaryo:** 50+ üyeli grup  
**Adımlar:**
1. 50 üyeli grup oluştur
2. Harcama ekle
3. Bakiyeleri hesapla
4. Borç sadeleştir

**Beklenen Sonuç:**
- ✅ Performans sorunu yok (< 1s)
- ✅ Bakiyeler doğru hesaplanır
- ✅ UI responsive kalır

---

### 5.5 Eşzamanlı Düzenleme

**Senaryo:** 2 kullanıcı aynı harcamayı düzenliyor  
**Adımlar:**
1. Kullanıcı A: Harcamayı düzenle, tutarı 200 yap
2. Kullanıcı B: Aynı harcamayı düzenle, tutarı 300 yap
3. Her ikisi de kaydet

**Beklenen Sonuç:**
- ✅ Conflict detection çalışır
- ✅ Son yazma kazanır veya merge edilir
- ✅ Kullanıcıya bilgi verilir

---

## Test Checklist

### Authentication
- [ ] Başarılı giriş
- [ ] Geçersiz şifre
- [ ] Geçersiz email
- [ ] Yeni kullanıcı kaydı
- [ ] Şifre sıfırlama
- [ ] Token refresh
- [ ] Logout

### Grup Yönetimi
- [ ] Grup oluşturma
- [ ] Grup listeleme
- [ ] Grup detay görüntüleme
- [ ] Grup düzenleme
- [ ] Grup silme
- [ ] Üye ekleme
- [ ] Üye çıkarma
- [ ] Rol değiştirme

### Harcama Yönetimi
- [ ] Harcama ekleme (eşit)
- [ ] Harcama ekleme (ağırlıklı)
- [ ] Harcama ekleme (kesin)
- [ ] Harcama düzenleme
- [ ] Harcama silme
- [ ] Harcama filtreleme
- [ ] Harcama arama

### Bakiye
- [ ] Bakiye görüntüleme
- [ ] Borç sadeleştirme
- [ ] Ödeme kaydetme
- [ ] Ödeme onaylama
- [ ] Ödeme reddetme

### Edge Cases
- [ ] Çoklu para birimi
- [ ] Yuvarlama hataları
- [ ] Offline mod
- [ ] Büyük gruplar
- [ ] Eşzamanlı düzenleme
- [ ] Network hataları
- [ ] Timeout durumları

---

## Regression Test Planı

Her release öncesi:
1. Tüm kritik akışlar test edilmeli
2. Edge case'ler kontrol edilmeli
3. Performance testleri yapılmalı
4. Security testleri yapılmalı

---

## Test Verileri

Test verileri için: [sample-datasets.json](../algorithms/sample-datasets.json)

