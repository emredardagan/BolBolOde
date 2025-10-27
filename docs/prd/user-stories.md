# BölBölÖde - Kullanıcı Hikayeleri

## Hikaye Formatı
```
Başlık: [USER-XXX] Kısa Başlık
Persona: [Grup Organizatörü / Katılımcı / Pasif Kullanıcı]
Öncelik: [Must Have / Should Have / Nice to Have]

Hikaye:
[Persona] olarak, [amaç] için [özellik] istiyorum.

Kabul Kriterleri:
- [ ] Kriter 1
- [ ] Kriter 2

Teknik Notlar:
- Not 1
- Not 2
```

---

## 1. Kimlik Doğrulama ve Profil

### [USER-001] Yeni Kullanıcı Kaydı
**Persona:** Tüm Kullanıcılar  
**Öncelik:** Must Have

**Hikaye:**  
Yeni bir kullanıcı olarak, uygulamayı kullanabilmek için hızlıca kayıt olmak istiyorum.

**Kabul Kriterleri:**
- [ ] E-posta ve şifre ile kayıt olabilmeliyim
- [ ] Şifre minimum 8 karakter, en az 1 büyük harf, 1 rakam içermeli
- [ ] E-posta doğrulama linki gönderilmeli
- [ ] Profil bilgilerimi (ad, soyad, avatar) girebilmeliyim
- [ ] Başarılı kayıt sonrası otomatik giriş yapılmalı
- [ ] Hata durumlarında açıklayıcı mesaj gösterilmeli

**Teknik Notlar:**
- Firebase Authentication kullanılacak
- Avatar için emoji picker veya fotoğraf yükleme
- Şifre güvenlik kontrolü frontend + backend

---

### [USER-002] Google ile Hızlı Kayıt/Giriş
**Persona:** Tüm Kullanıcılar  
**Öncelik:** Should Have

**Hikaye:**  
Kullanıcı olarak, hızlıca kayıt olmak için Google hesabımla giriş yapmak istiyorum.

**Kabul Kriterleri:**
- [ ] "Google ile Devam Et" butonu olmalı
- [ ] Google OAuth akışı sorunsuz çalışmalı
- [ ] İlk girişte profil bilgileri Google'dan otomatik çekilmeli
- [ ] Mevcut hesap varsa giriş, yoksa kayıt yapılmalı
- [ ] iOS ve Android'de native deneyim

**Teknik Notlar:**
- Firebase Google Sign-In
- Expo AuthSession / Google Sign-In paketi
- iOS için Apple Sign In da eklenebilir (App Store requirement)

---

### [USER-003] Profil Düzenleme
**Persona:** Tüm Kullanıcılar  
**Öncelik:** Must Have

**Hikaye:**  
Kullanıcı olarak, profil bilgilerimi ve tercihlerimi güncellemek istiyorum.

**Kabul Kriterleri:**
- [ ] Ad, soyad düzenlenebilmeli
- [ ] Avatar/emoji değiştirilebilmeli
- [ ] Tercih edilen para birimi seçilebilmeli
- [ ] Dil tercihi değiştirilebilmeli (TR/EN)
- [ ] Değişiklikler anında kaydedilmeli
- [ ] Başarı/hata mesajı gösterilmeli

**Teknik Notlar:**
- MMKV ile local cache
- Firestore User collection güncelleme
- Optimistic update

---

## 2. Grup Yönetimi

### [USER-010] Yeni Grup Oluşturma
**Persona:** Grup Organizatörü  
**Öncelik:** Must Have

**Hikaye:**  
Grup organizatörü olarak, arkadaşlarımla yapacağımız gezi için hızlıca grup oluşturmak istiyorum.

**Kabul Kriterleri:**
- [ ] Grup adı, açıklama girebilmeliyim
- [ ] Başlangıç ve bitiş tarihi seçebilmeliyim
- [ ] Varsayılan para birimi belirleyebilmeliyim
- [ ] Grup emoji/avatar seçebilmeliyim
- [ ] Grup oluştuktan sonra üye davet ekranına yönlendirilmeliyim
- [ ] Oluşturan kişi otomatik Owner olmalı

**Teknik Notlar:**
- Firestore Groups collection
- GroupMember subcollection (ownerId ile ilk kayıt)
- Benzersiz grup ID (UUID)

---

### [USER-011] Davet Linki ile Üye Ekleme
**Persona:** Grup Organizatörü  
**Öncelik:** Must Have

**Hikaye:**  
Grup organizatörü olarak, davet linki paylaşarak arkadaşlarımı gruba eklemek istiyorum.

**Kabul Kriterleri:**
- [ ] Benzersiz davet linki oluşturulabilmeli
- [ ] Link kopyalanabilmeli veya paylaşılabilmeli (native share)
- [ ] QR kod oluşturulup gösterilmeli
- [ ] Linkin geçerlilik süresi görülebilmeli (7 gün)
- [ ] Link iptal edilebilmeli
- [ ] Maksimum kullanım sayısı belirlenebilmeli

**Teknik Notlar:**
- Invite token: JWT veya unique hash
- Firebase Dynamic Links veya custom deep link
- QR kod: react-native-qrcode-svg
- Token expiry kontrolü backend'de

---

### [USER-012] Davet Linki ile Gruba Katılma
**Persona:** Katılımcı  
**Öncelik:** Must Have

**Hikaye:**  
Katılımcı olarak, arkadaşımın gönderdiği davet linkine tıklayarak gruba kolayca katılmak istiyorum.

**Kabul Kriterleri:**
- [ ] Link tıklanınca uygulama açılmalı (deep link)
- [ ] Grup bilgileri önizlenebilmeli
- [ ] "Gruba Katıl" butonu olmalı
- [ ] Katıldıktan sonra grup detay sayfasına yönlendirilmeliyim
- [ ] Geçersiz/süresi dolmuş link için hata mesajı gösterilmeli
- [ ] Zaten üye olanlar için "Zaten üyesin" mesajı

**Teknik Notlar:**
- Deep linking (Expo Linking)
- Token validasyonu backend'de
- GroupMember kaydı (status: Active)

---

### [USER-013] Grup Üyelerini Görüntüleme
**Persona:** Tüm Kullanıcılar  
**Öncelik:** Must Have

**Hikaye:**  
Grup üyesi olarak, grupta kimlerin olduğunu ve rollerini görmek istiyorum.

**Kabul Kriterleri:**
- [ ] Tüm üyeler listelenebilmeli
- [ ] Her üyenin adı, avatarı, rolü görünmeli
- [ ] Üye durumu gösterilmeli (Active, Invited, Left)
- [ ] Owner için özel işaret/badge olmalı
- [ ] Üye sayısı gösterilmeli

**Teknik Notlar:**
- Firestore GroupMember query
- Real-time listener (üye eklenince güncelleme)

---

### [USER-014] Grup Üyesini Çıkarma (Owner)
**Persona:** Grup Organizatörü  
**Öncelik:** Must Have

**Hikaye:**  
Grup sahibi olarak, gruptan ayrılan veya istenmeyen bir üyeyi çıkarabilmek istiyorum.

**Kabul Kriterleri:**
- [ ] Sadece Owner çıkarabilmeli
- [ ] Üye listesinde "Çıkar" seçeneği olmalı
- [ ] Onay modalı gösterilmeli
- [ ] Çıkarılan üye artık grup verilerini görememeli
- [ ] Çıkarılan üyenin geçmiş harcamalara katkısı korunmalı
- [ ] Bildirim gönderilmeli

**Teknik Notlar:**
- GroupMember status: "Removed"
- Soft delete (audit için kayıt tutulur)
- Bakiye hesaplamasında removed üyeler hariç tutulur

---

### [USER-015] Gruptan Ayrılma
**Persona:** Katılımcı  
**Öncelik:** Must Have

**Hikaye:**  
Grup üyesi olarak, artık dahil olmak istemediğim bir gruptan ayrılabilmek istiyorum.

**Kabul Kriterleri:**
- [ ] "Gruptan Ayrıl" seçeneği olmalı
- [ ] Bakiyesi sıfır değilse uyarı gösterilmeli
- [ ] Onay modalı olmalı
- [ ] Owner gruptan ayrılamazsa önce ownership transfer etmeli
- [ ] Ayrıldıktan sonra grup listesinden kalkmalı
- [ ] Geçmiş harcamalara katkı korunmalı

**Teknik Notlar:**
- GroupMember status: "Left"
- Balance check
- Ownership transfer flow

---

## 3. Harcama Yönetimi

### [USER-020] Basit Harcama Ekleme (Eşit Paylaşım)
**Persona:** Katılımcı  
**Öncelik:** Must Have

**Hikaye:**  
Katılımcı olarak, yediğimiz yemeğin parasını ödedim ve harcamayı hızlıca eşit olarak bölerek eklemek istiyorum.

**Kabul Kriterleri:**
- [ ] Başlık, tutar, tarih girebilmeliyim
- [ ] Kendimi ödeyen olarak seçebilmeliyim
- [ ] Dahil olan kişileri seçebilmeliyim (varsayılan: herkes)
- [ ] Eşit paylaşım otomatik hesaplanmalı
- [ ] Kategori seçebilmeliyim (Yemek, Ulaşım, vb.)
- [ ] "Harcamayı Kaydet" butonu ile eklenebilmeli
- [ ] Başarı mesajı ve bakiye güncellenmeli

**Teknik Notlar:**
- Firestore Expenses collection
- ExpenseShare subcollection (shareType: equal)
- Real-time balance recalculation
- Optimistic update

---

### [USER-021] Ağırlıklı Paylaşımlı Harcama
**Persona:** Katılımcı  
**Öncelik:** Should Have

**Hikaye:**  
Katılımcı olarak, bazı kişilerin daha fazla tükettiği bir harcamayı adil bir şekilde paylaştırmak istiyorum.

**Kabul Kriterleri:**
- [ ] Paylaşım tipini "Ağırlıklı" olarak seçebilmeliyim
- [ ] Her kişi için ağırlık (weight) girebilmeliyim
- [ ] Toplam tutar ağırlıklara göre otomatik bölünmeli
- [ ] Her kişinin payına düşen tutar görüntülenmeli
- [ ] Ağırlıklar değişince canlı hesaplama yapılmalı

**Teknik Notlar:**
- shareType: "weighted"
- ExpenseShare.weight field
- Formül: kişiPay = (tutar × kişiWeight) / toplamWeight

**Örnek:**
```
Tutar: 600 TL
A (ağırlık: 2), B (ağırlık: 1), C (ağırlık: 1)
Toplam ağırlık: 4
A: 300 TL, B: 150 TL, C: 150 TL
```

---

### [USER-022] Kesin Tutarlı Harcama
**Persona:** Katılımcı  
**Öncelik:** Should Have

**Hikaye:**  
Katılımcı olarak, her kişinin ne kadar ödemesi gerektiğini tam olarak biliyorum ve manuel girmek istiyorum.

**Kabul Kriterleri:**
- [ ] Paylaşım tipini "Kesin Tutar" olarak seçebilmeliyim
- [ ] Her kişi için tutar girebilmeliyim
- [ ] Girilen tutarlar toplamı harcama tutarına eşit olmalı
- [ ] Eşit değilse hata mesajı gösterilmeli
- [ ] Kalan tutar gösterilmeli (dinamik hesaplama)

**Teknik Notlar:**
- shareType: "exact"
- ExpenseShare.exactAmount field
- Validation: Σ exactAmount === expense.amount

---

### [USER-023] Fiş Fotoğrafı Ekleme
**Persona:** Katılımcı  
**Öncelik:** Should Have

**Hikaye:**  
Katılımcı olarak, harcamanın kanıtı olarak fiş fotoğrafı eklemek istiyorum.

**Kabul Kriterleri:**
- [ ] Kamera ile fotoğraf çekebilmeliyim
- [ ] Galeriden fotoğraf seçebilmeliyim
- [ ] Maksimum 5 MB boyut sınırı olmalı
- [ ] JPEG/PNG formatları desteklenmeli
- [ ] Birden fazla fotoğraf eklenebilmeli (maks 5)
- [ ] Önizleme gösterilmeli
- [ ] Fotoğraf silinebilmeli

**Teknik Notlar:**
- Expo ImagePicker
- Firebase Storage upload
- Signed URL ile güvenli erişim
- Thumbnail oluştur (performans)

---

### [USER-024] Farklı Para Biriminde Harcama
**Persona:** Katılımcı  
**Öncelik:** Should Have

**Hikaye:**  
Yurt dışı gezisinde katılımcı olarak, Euro ile ödeme yaptım ve bunu grup para birimine çevirerek kaydetmek istiyorum.

**Kabul Kriterleri:**
- [ ] Harcama para birimi seçebilmeliyim
- [ ] Güncel kur otomatik gösterilmeli
- [ ] Manuel kur girebilmeliyim
- [ ] Grup para birimine çevrilmiş tutar gösterilmeli
- [ ] Kur bilgisi harcama ile birlikte saklanmalı
- [ ] Detayda hem orijinal hem çevrilmiş tutar görünmeli

**Teknik Notlar:**
- Expense.currency, Expense.amount (original)
- Expense.fxRate (immutable)
- Expense.convertedAmount (grup para birimi)
- ExchangeRate API daily cache

**Örnek:**
```
Harcama: 100 EUR
Kur: 1 EUR = 35.50 TL (27 Ekim 2025)
Grup para birimi: TRY
Çevrilmiş tutar: 3,550 TL
```

---

### [USER-025] Harcama Düzenleme
**Persona:** Katılımcı  
**Öncelik:** Must Have

**Hikaye:**  
Katılımcı olarak, yanlış girdiğim bir harcamayı düzeltebilmek istiyorum.

**Kabul Kriterleri:**
- [ ] Harcama detayından "Düzenle" butonu olmalı
- [ ] Tüm alanları değiştirebilmeliyim
- [ ] Paylaşım tipini değiştirebilmeliyim
- [ ] Değişiklikler kaydedilince bakiye yeniden hesaplanmalı
- [ ] Son düzenleyen kişi ve zaman gösterilmeli
- [ ] İzin yoksa düzenleme butonu görünmemeli

**Teknik Notlar:**
- Permission check: owner, editor, veya expense creator
- Firestore update + updatedAt, updatedBy
- Recalculate all balances
- Activity log

---

### [USER-026] Harcama Silme
**Persona:** Katılımcı  
**Öncelik:** Must Have

**Hikaye:**  
Katılımcı olarak, yanlışlıkla eklediğim bir harcamayı silebilmek istiyorum.

**Kabul Kriterleri:**
- [ ] Harcama detayından "Sil" butonu olmalı
- [ ] Onay modalı gösterilmeli
- [ ] Silindikten sonra bakiye yeniden hesaplanmalı
- [ ] Soft delete (30 gün içinde geri yüklenebilir)
- [ ] Activity log'a kaydedilmeli
- [ ] İzin yoksa silme butonu görünmemeli

**Teknik Notlar:**
- Permission check
- Expense.deletedAt field (soft delete)
- Scheduled cleanup (30 gün sonra hard delete)

---

### [USER-027] Harcama Filtreleme ve Arama
**Persona:** Tüm Kullanıcılar  
**Öncelik:** Should Have

**Hikaye:**  
Grup üyesi olarak, belirli bir tarih aralığında veya kategoride yapılan harcamaları görmek istiyorum.

**Kabul Kriterleri:**
- [ ] Tarih aralığı filtresi (başlangıç-bitiş)
- [ ] Kategori filtresi (çoklu seçim)
- [ ] Ödeyen kişi filtresi
- [ ] Dahil olan kişi filtresi
- [ ] Tutar aralığı filtresi
- [ ] Filtreleri temizle butonu
- [ ] Aktif filtre sayısı gösterilmeli

**Teknik Notlar:**
- Firestore composite queries
- Index gereksinimi
- Client-side filtering (cache)

---

## 4. Bakiye ve Settlement

### [USER-030] Net Bakiyeyi Görüntüleme
**Persona:** Tüm Kullanıcılar  
**Öncelik:** Must Have

**Hikaye:**  
Grup üyesi olarak, ne kadar borçlu veya alacaklı olduğumu net bir şekilde görmek istiyorum.

**Kabul Kriterleri:**
- [ ] Kendi net bakiyem büyük ve belirgin görünmeli
- [ ] Pozitifse "Alacaksın", negatifse "Borçlusun" diye gösterilmeli
- [ ] Renkle ayrım yapılmalı (yeşil: alacak, kırmızı: borç)
- [ ] Detaylı hesaplama linki olmalı
- [ ] Real-time güncelleme yapılmalı

**Teknik Notlar:**
- Net Balance = Σ (ödediğim) - Σ (payıma düşen)
- Real-time Firestore listener
- Optimistic update

---

### [USER-031] Grup Bakiye Özeti
**Persona:** Tüm Kullanıcılar  
**Öncelik:** Must Have

**Hikaye:**  
Grup üyesi olarak, tüm üyelerin bakiye durumunu bir arada görmek istiyorum.

**Kabul Kriterleri:**
- [ ] Tüm üyelerin net bakiyesi listelenebilmeli
- [ ] Sıralama: en çok alacaklı → en çok borçlu
- [ ] Her üyenin adı, avatarı, bakiyesi görünmeli
- [ ] Toplam borç = Toplam alacak kontrolü yapılmalı
- [ ] Denk olanlar ayrı gösterilebilmeli

**Teknik Notlar:**
- Cloud Function: calculateGroupBalances
- Cached in Firestore (performance)
- Validate: Σ netBalance = 0

---

### [USER-032] Borç Sadeleştirme Önerisi
**Persona:** Tüm Kullanıcılar  
**Öncelik:** Must Have

**Hikaye:**  
Grup üyesi olarak, minimum transferle borçları nasıl kapatacağımızı görmek istiyorum.

**Kabul Kriterleri:**
- [ ] "Borçları Sadeleştir" butonu olmalı
- [ ] Minimum transfer listesi gösterilmeli
- [ ] Her transfer: "A → B: X TL" formatında
- [ ] Transfer sayısı gösterilmeli
- [ ] Her transfer için "Ödendi olarak işaretle" opsiyonu
- [ ] Sadeleştirme her zaman deterministik olmalı

**Teknik Notlar:**
- Greedy algorithm (max alacaklı ↔ max borçlu)
- Cloud Function: simplifyDebts
- Transfer count ≤ (N-1)

**Algoritma Adımları:**
```
1. Tüm net bakiyeleri listele
2. Max alacaklı (A) ve max borçlu (B) bul
3. Transfer tutarı = min(A.balance, -B.balance)
4. A.balance -= transfer, B.balance += transfer
5. Tekrarla (tüm bakiyeler sıfır olana kadar)
```

---

### [USER-033] Ödeme İşaretleme
**Persona:** Katılımcı  
**Öncelik:** Should Have

**Hikaye:**  
Katılımcı olarak, arkadaşıma havale yaptığım parayı sistemde kaydedip bakiyemi güncellemek istiyorum.

**Kabul Kriterleri:**
- [ ] Sadeleştirme listesinden "Ödendi" işaretleyebilmeliyim
- [ ] Manuel settlement ekleyebilmeliyim (Kimden → Kime → Tutar)
- [ ] Ödeme tarihi seçebilmeliyim
- [ ] Ödeme metodu seçebilmeliyim (Nakit, Havale, vb.)
- [ ] Not ekleyebilmeliyim
- [ ] Ödeme kaydedilince bakiye güncellenmeli
- [ ] Karşı tarafa bildirim gitmeli

**Teknik Notlar:**
- Firestore Settlements collection
- Settlement.fromMemberId, toMemberId, amount
- Recalculate balances
- Push notification

---

### [USER-034] Ödeme Onaylama (İki Taraflı)
**Persona:** Katılımcı  
**Öncelik:** Nice to Have

**Hikaye:**  
Alacaklı olarak, ödeme yapıldığını onaylayarak güvenli bir settlement sistemi kurmak istiyorum.

**Kabul Kriterleri:**
- [ ] Ödeme yapan "Ödeme Yaptım" işaretler (status: Pending)
- [ ] Alacaklıya bildirim gider
- [ ] Alacaklı "Onayla" veya "Reddet" seçenekleri görür
- [ ] Onaylanınca bakiye güncellenir (status: Confirmed)
- [ ] Reddedilirse ödeme kaydı silinir
- [ ] Timeout: 7 gün sonra otomatik onay (opsiyonel)

**Teknik Notlar:**
- Settlement.status: Pending, Confirmed, Rejected
- Push notification
- Scheduled cleanup

---

## 5. Raporlama ve Export

### [USER-040] Grup Özet Raporu
**Persona:** Grup Organizatörü  
**Öncelik:** Should Have

**Hikaye:**  
Grup organizatörü olarak, tatilin sonunda tüm harcamaları ve bakiyeleri özetleyen bir rapor görmek istiyorum.

**Kabul Kriterleri:**
- [ ] Toplam harcama tutarı
- [ ] Harcama sayısı
- [ ] Kategori dağılımı (pasta grafik)
- [ ] En çok harcayan kişi
- [ ] Kişi başı ortalama
- [ ] Tarih aralığı filtrelenebilmeli
- [ ] Detaylı harcama listesi

**Teknik Notlar:**
- Cloud Function: generateGroupReport
- Chart library: Victory Native
- Cache report data

---

### [USER-041] PDF Export
**Persona:** Grup Organizatörü  
**Öncelik:** Should Have

**Hikaye:**  
Grup organizatörü olarak, grup raporunu PDF olarak indirip WhatsApp'ta paylaşmak istiyorum.

**Kabul Kriterleri:**
- [ ] "PDF İndir" butonu olmalı
- [ ] PDF'de grup adı, tarih aralığı, özet bilgiler
- [ ] Tüm harcama listesi tablo formatında
- [ ] Bakiye durumu ve önerilen transferler
- [ ] PDF lokale kaydedilebilmeli
- [ ] Native share ile paylaşılabilmeli

**Teknik Notlar:**
- react-native-html-to-pdf veya Cloud Function (Puppeteer)
- PDF template (HTML/CSS)
- File system access

---

### [USER-042] CSV Export
**Persona:** Katılımcı  
**Öncelik:** Should Have

**Hikaye:**  
Katılımcı olarak, harcama verilerini Excel'de analiz etmek için CSV formatında indirmek istiyorum.

**Kabul Kriterleri:**
- [ ] "CSV İndir" butonu olmalı
- [ ] CSV'de: Tarih, Başlık, Kategori, Tutar, Para birimi, Ödeyen, Dahil olanlar
- [ ] UTF-8 encoding (Türkçe karakter desteği)
- [ ] Excel/Google Sheets ile açılabilir formatta

**Teknik Notlar:**
- Client-side CSV generation (papaparse)
- react-native-fs ile kaydetme
- Share API

---

### [USER-043] Paylaşılabilir Link
**Persona:** Grup Organizatörü  
**Öncelik:** Nice to Have

**Hikaye:**  
Grup organizatörü olarak, grup üyesi olmayanlarla da özet rapor paylaşabilmek için public link oluşturmak istiyorum.

**Kabul Kriterleri:**
- [ ] "Paylaşılabilir Link Oluştur" butonu
- [ ] Link 7 gün geçerli olmalı
- [ ] Link ile sadece özet görünmeli (hassas bilgiler hariç)
- [ ] Link iptal edilebilmeli
- [ ] Link kopyalanabilmeli

**Teknik Notlar:**
- Public share token (JWT)
- Web view sayfası (Firebase Hosting)
- Token expiry check

---

## 6. Bildirimler

### [USER-050] Push Bildirimleri
**Persona:** Tüm Kullanıcılar  
**Öncelik:** Should Have

**Hikaye:**  
Grup üyesi olarak, yeni harcama eklendiğinde veya borç durumum değiştiğinde bildirim almak istiyorum.

**Kabul Kriterleri:**
- [ ] Yeni harcama eklenince bildirim
- [ ] Harcama düzenlenince/silinince bildirim
- [ ] Ödeme alınca bildirim
- [ ] Grup davetiyesi bildirim
- [ ] Bildirime tıklayınca ilgili ekrana gitme
- [ ] Bildirimleri grup bazında kapatabilme

**Teknik Notlar:**
- Expo Push Notifications
- Cloud Function triggers
- Deep linking
- Notification permissions

---

### [USER-051] Bildirim Ayarları
**Persona:** Tüm Kullanıcılar  
**Öncelik:** Should Have

**Hikaye:**  
Kullanıcı olarak, hangi tür bildirimleri almak istediğimi kontrol etmek istiyorum.

**Kabul Kriterleri:**
- [ ] Bildirim tiplerini ayrı ayrı açıp kapayabilmeliyim
- [ ] Sessize alma saatleri belirleyebilmeliyim
- [ ] Grup bazında bildirimleri kapatabilmeliyim
- [ ] E-posta bildirimleri opsiyonu
- [ ] Değişiklikler anında uygulanmalı

**Teknik Notlar:**
- User.notificationPreferences
- Client-side filtering
- Server-side filtering (performance)

---

## 7. Offline ve Senkronizasyon

### [USER-060] Offline Harcama Ekleme
**Persona:** Katılımcı  
**Öncelik:** Should Have

**Hikaye:**  
İnternet olmayan bir yerde katılımcı olarak, harcamayı offline ekleyip sonra online olduğumda senkronize etmek istiyorum.

**Kabul Kriterleri:**
- [ ] İnternet yokken harcama ekleyebilmeliyim
- [ ] Offline eklenen harcama işaretlenmeli (sync icon)
- [ ] Online olunca otomatik senkronizasyon
- [ ] Senkronizasyon durumu gösterilmeli
- [ ] Başarısız senkronizasyonlar retry edilmeli

**Teknik Notlar:**
- MMKV local storage
- Sync queue
- Background sync (NetInfo)
- Exponential backoff retry

---

### [USER-061] Çakışma Çözümü
**Persona:** Katılımcı  
**Öncelik:** Should Have

**Hikaye:**  
İki kişi aynı anda aynı harcamayı düzenlerse, verilerin kaybolmamasını istiyorum.

**Kabul Kriterleri:**
- [ ] Son yazma kazanır (Last Write Wins)
- [ ] Çakışma durumunda kullanıcıya bilgi verilmeli
- [ ] Version number ile takip
- [ ] Kayıp veri gösterilmeli (karşılaştırma)

**Teknik Notlar:**
- Expense.version field
- Expense.updatedAt timestamp
- Optimistic locking (opsiyonel)
- Conflict resolution UI

---

## 8. Güvenlik ve Gizlilik

### [USER-070] Rol Tabanlı Yetkilendirme
**Persona:** Grup Organizatörü  
**Öncelik:** Must Have

**Hikaye:**  
Grup sahibi olarak, bazı üyelere sadece görüntüleme yetkisi vermek istiyorum.

**Kabul Kriterleri:**
- [ ] Üye rolü değiştirebilmeliyim (Owner, Editor, Viewer)
- [ ] Viewer'lar sadece görüntüleyebilmeli
- [ ] Editor'lar harcama ekleyebilmeli
- [ ] Owner tüm yetkilere sahip olmalı
- [ ] İzinsiz işlem denendiğinde hata mesajı

**Teknik Notlar:**
- GroupMember.role field
- Firestore Security Rules
- Client-side UI control

---

### [USER-071] Veri Silme Talebi (KVKK/GDPR)
**Persona:** Tüm Kullanıcılar  
**Öncelik:** Must Have

**Hikaye:**  
Kullanıcı olarak, verilerimin silinmesini talep etmek istiyorum.

**Kabul Kriterleri:**
- [ ] "Hesabımı Sil" seçeneği
- [ ] Uyarı ve onay modalı
- [ ] Tüm kişisel veriler silinmeli
- [ ] Grup harcamalarında isim anonimleştirilmeli
- [ ] 30 gün içinde geri yükleme opsiyonu
- [ ] E-posta onayı

**Teknik Notlar:**
- Soft delete (30 gün)
- Anonymize user data in shared contexts
- GDPR compliance

---

## Önceliklendirme Özeti

### MVP (M1) - Must Have
- USER-001, 003: Kayıt/Profil
- USER-010, 011, 012, 013: Grup yönetimi
- USER-020, 025, 026: Basit harcama
- USER-030, 031, 032: Bakiye ve sadeleştirme
- USER-070: Rol yetkilendirme

### M2 - Should Have
- USER-002: Google OAuth
- USER-021, 022, 023, 024: Gelişmiş harcama
- USER-027: Filtreleme
- USER-033: Settlement
- USER-040, 041, 042: Raporlama
- USER-050, 051: Bildirimler
- USER-060, 061: Offline

### M3+ - Nice to Have
- USER-034: İki taraflı onay
- USER-043: Paylaşılabilir link
- USER-071: GDPR veri silme

---

**Toplam Hikaye:** 30+  
**Hazırlayan:** BölBölÖde Ekibi  
**Versiyon:** 1.0  
**Son Güncelleme:** 27 Ekim 2025

