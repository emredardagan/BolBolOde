# BölBölÖde - Kenar Durumlar ve Çözüm Önerileri

## İçindekiler
1. [Grup Yönetimi](#1-grup-yönetimi)
2. [Harcama Yönetimi](#2-harcama-yönetimi)
3. [Para Birimi ve Hesaplamalar](#3-para-birimi-ve-hesaplamalar)
4. [Borç Sadeleştirme](#4-borç-sadeleştirme)
5. [Senkronizasyon ve Çakışmalar](#5-senkronizasyon-ve-çakışmalar)
6. [Güvenlik ve İzinler](#6-güvenlik-ve-izinler)
7. [Performans ve Ölçekleme](#7-performans-ve-ölçekleme)

---

## 1. Grup Yönetimi

### EDGE-GROUP-001: Boş Grup (Üyesiz)
**Senaryo:** Kullanıcı grup oluşturdu ama henüz kimseyi davet etmedi.

**Sorun:**
- Tek kişilik grupta harcama bölüşümü anlamsız
- Bakiye hesaplaması çalışmaz

**Çözüm:**
```
✅ Grup oluşturulabilir ama uyarı gösterilmeli:
   "Grubun kullanılabilmesi için en az 2 üye gereklidir"
✅ Harcama ekleme butonu disabled olmalı
✅ "Üye Davet Et" prominent CTA
✅ Boş grup 7 gün içinde üye eklenmezse otomatik silinmeli
```

**Test Senaryosu:**
```
1. Yeni grup oluştur
2. Hiç üye ekleme
3. Harcama eklemeye çalış → Engellenmeli
4. Uyarı mesajı gösterilmeli
```

---

### EDGE-GROUP-002: Tek Üyeli Grup
**Senaryo:** Grup sahibi dışında kimse yok.

**Sorun:**
- Harcama bölüşümü tek kişiye yapılamaz
- "Eşit paylaşım" anlamsız

**Çözüm:**
```
✅ Harcama eklenebilir ama sadece kayıt amaçlı
✅ Paylaşım seçeneği gösterilmemeli (tek kişi = tüm tutar)
✅ "Daha fazla üye ekle" uyarısı
✅ Bakiye her zaman 0 (kendiyle borç-alacak olmaz)
```

---

### EDGE-GROUP-003: Owner Gruptan Ayrılmak İster
**Senaryo:** Grup sahibi gruptan çıkmak istiyor ama başka üyeler var.

**Sorun:**
- Owner silinirse grup yetimsiz kalır
- Yetki yönetimi bozulur

**Çözüm:**
```
✅ Owner doğrudan ayrılamaz
✅ Önce başka birine Owner yetkisi transfer etmeli
✅ "Ownership Transfer" akışı:
   1. Üye listesinden yeni owner seç
   2. Onay iste
   3. Transfer tamamlandıktan sonra ayrılabilir
✅ Alternatif: Grubu sil (tüm bakiyeler 0 ise)
```

**UI Flow:**
```
[Gruptan Ayrıl] butonu tıklanınca:
Modal: "Grup sahibisiniz. Ayrılmak için:"
Option 1: [Owner Yetkisini Devret]
Option 2: [Grubu Sil] (bakiyeler 0 ise)
```

---

### EDGE-GROUP-004: Son İki Kişi Kalana Kadar Üyeler Ayrıldı
**Senaryo:** 10 kişilik grup vardı, 8 kişi ayrıldı, 2 kişi kaldı.

**Sorun:**
- Geçmiş harcamalarda ayrılanlar var
- Bakiye hesaplaması bozulabilir

**Çözüm:**
```
✅ Ayrılan üyelerin geçmiş katkıları korunmalı
✅ Sadece aktif üyeler yeni harcamalara dahil edilebilir
✅ Bakiye sadeleştirmede sadece aktif üyeler gösterilir
✅ Raporlarda "Eski Üyeler" sekmesi
```

**Veri Modeli:**
```javascript
GroupMember {
  status: "Active" | "Left" | "Removed"
  leftAt: timestamp | null
}

// Yeni harcama eklenirken:
const activeMembers = members.filter(m => m.status === "Active")
```

---

### EDGE-GROUP-005: Davet Linki Kötüye Kullanımı (Spam)
**Senaryo:** Davet linki 100 kişiyle paylaşıldı, hepsi katılmaya çalışıyor.

**Sorun:**
- Spam/troll üyeler
- Performans sorunu

**Çözüm:**
```
✅ Link başına maksimum kullanım sayısı (50)
✅ Rate limiting (aynı IP'den 5dk'da 3 katılım)
✅ Owner onayı gerektir (opsiyonel ayar)
✅ Link iptal özelliği
✅ Şüpheli aktivite bildirimi
```

**Backend Kontrolü:**
```javascript
if (inviteLink.usageCount >= MAX_USAGE) {
  throw new Error("Davet linki kullanım limitine ulaştı")
}
if (await checkRateLimit(ip, inviteLinkId)) {
  throw new Error("Çok fazla deneme. Lütfen bekleyin.")
}
```

---

## 2. Harcama Yönetimi

### EDGE-EXPENSE-001: Negatif veya Sıfır Tutar
**Senaryo:** Kullanıcı tutar alanına 0 veya -100 giriyor.

**Sorun:**
- Negatif harcama mantıksız
- Sıfır tutar gereksiz kayıt

**Çözüm:**
```
✅ Frontend validation: tutar > 0 zorunlu
✅ Input type="number" + min="0.01"
✅ Backend validation (güvenlik)
✅ Hata mesajı: "Harcama tutarı sıfırdan büyük olmalıdır"
```

**Kod:**
```typescript
const validateExpenseAmount = (amount: number): boolean => {
  if (amount <= 0) {
    throw new Error("Tutar sıfırdan büyük olmalıdır")
  }
  if (amount > 1000000) { // Max limit
    throw new Error("Tutar çok yüksek")
  }
  return true
}
```

---

### EDGE-EXPENSE-002: Yarım Kalan Harcama (Draft)
**Senaryo:** Kullanıcı harcama eklemeye başladı ama kaydedmeden uygulamadan çıktı.

**Sorun:**
- Veri kaybı
- Kullanıcı frustration

**Çözüm:**
```
✅ Auto-save as draft (local storage)
✅ Uygulama açılınca "Yarım kalan harcamanız var" mesajı
✅ "Devam Et" veya "Sil" seçenekleri
✅ Draft 7 gün sonra otomatik silinir
```

**Implementation:**
```typescript
// Screen mount:
useEffect(() => {
  const draft = await MMKV.getString('expense_draft')
  if (draft) {
    Alert.alert(
      "Yarım Kalan Harcama",
      "Devam etmek ister misiniz?",
      [
        { text: "Sil", onPress: () => MMKV.delete('expense_draft') },
        { text: "Devam Et", onPress: () => loadDraft(draft) }
      ]
    )
  }
}, [])

// Input change:
const onInputChange = debounce((data) => {
  MMKV.set('expense_draft', JSON.stringify(data))
}, 500)
```

---

### EDGE-EXPENSE-003: Tüm Üyeler Seçilmedi
**Senaryo:** Grupta 10 kişi var, kullanıcı sadece 1 kişi seçti (kendisi).

**Sorun:**
- Tek kişilik harcama anlamsız (borç-alacak yok)

**Çözüm:**
```
✅ Minimum 2 kişi seçilmeli (ödeyen + en az 1 paylaşan)
✅ Eğer ödeyen ve paylaşan aynı kişiyse uyarı:
   "Bu harcama sadece size ait. Paylaşmak ister misiniz?"
✅ "Herkesi Seç" shortcut butonu
✅ Kaydet butonu disabled (2 kişiden az ise)
```

---

### EDGE-EXPENSE-004: Kesin Tutarlar Toplamı Uyuşmuyor
**Senaryo:** Kullanıcı "Kesin Tutar" seçti. A:100, B:150 girdi ama toplam harcama 300 TL.

**Sorun:**
- 100 + 150 = 250 ≠ 300
- Eksik/fazla 50 TL

**Çözüm:**
```
✅ Real-time validasyon:
   - Σ paylar == toplam → ✅ Yeşil check
   - Σ paylar != toplam → ❌ Kırmızı uyarı + kalan tutar göster
✅ "Otomatik Ayarla" butonu:
   - Kalan tutarı son kişiye ekle
   - Veya farkı eşit böl
✅ Kaydet butonu disabled (tutarlar uyuşana kadar)
```

**UI Component:**
```tsx
<View>
  <Text>Toplam: 300 TL</Text>
  <Text>Girilen: {sum} TL</Text>
  {sum !== total && (
    <Text style={styles.error}>
      Kalan: {total - sum} TL
    </Text>
  )}
  <Button 
    title="Otomatik Ayarla"
    onPress={() => autoAdjust()}
  />
</View>
```

---

### EDGE-EXPENSE-005: Çok Büyük Tutar Girişi
**Senaryo:** Kullanıcı 999,999,999 TL gibi astronomik tutar giriyor.

**Sorun:**
- Yanlış girişten kaynaklı (9 fazla basmış)
- Veritabanı overflow
- UI bozukluğu

**Çözüm:**
```
✅ Maksimum limit: 1,000,000 TL (ayarlanabilir)
✅ Limit aşılınca uyarı:
   "Bu tutar çok yüksek görünüyor. Kontrol edin."
✅ Onay modalı (> 100,000 TL için)
✅ Backend validasyonu
```

**Kod:**
```typescript
const MAX_EXPENSE_AMOUNT = 1_000_000

if (amount > MAX_EXPENSE_AMOUNT) {
  Alert.alert(
    "Yüksek Tutar",
    `Tutar ${MAX_EXPENSE_AMOUNT} TL'den az olmalıdır`,
    [{ text: "Tamam" }]
  )
  return
}

if (amount > 100_000) {
  Alert.alert(
    "Onay",
    `${amount} TL tutarında harcama eklemek istediğinizden emin misiniz?`,
    [
      { text: "İptal" },
      { text: "Evet", onPress: () => saveExpense() }
    ]
  )
}
```

---

### EDGE-EXPENSE-006: Fiş Fotoğrafı Çok Büyük
**Senaryo:** Kullanıcı 20 MB'lık raw fotoğraf yüklüyor.

**Sorun:**
- Upload uzun sürer
- Storage maliyeti
- Performans

**Çözüm:**
```
✅ Maksimum 5 MB limit
✅ Otomatik sıkıştırma (react-native-image-resizer)
✅ Thumbnail oluştur (200x200) - liste görünümü için
✅ Progress bar göster
✅ Cancel opsiyonu
```

**Implementation:**
```typescript
import ImageResizer from 'react-native-image-resizer'

const compressImage = async (uri: string) => {
  const resized = await ImageResizer.createResizedImage(
    uri,
    1200,  // max width
    1200,  // max height
    'JPEG',
    80,    // quality
    0,     // rotation
    null,
    false,
    { mode: 'contain' }
  )
  
  if (resized.size > 5_000_000) { // 5 MB
    throw new Error("Fotoğraf çok büyük")
  }
  
  return resized.uri
}
```

---

### EDGE-EXPENSE-007: Gelecek Tarihli Harcama
**Senaryo:** Kullanıcı yanlışlıkla 2026 yılını seçiyor.

**Sorun:**
- Gelecek tarih mantıksız
- Raporlama bozulabilir

**Çözüm:**
```
✅ Maksimum tarih: Bugün
✅ Uyarı: "Gelecek tarih seçilemez"
✅ Varsayılan: Bugün
✅ Date picker max date constraint
```

---

## 3. Para Birimi ve Hesaplamalar

### EDGE-CURRENCY-001: Döviz Kuru API'si Çalışmıyor
**Senaryo:** Exchange rate API down, kullanıcı EUR harcama eklemek istiyor.

**Sorun:**
- Dönüşüm yapılamıyor
- Kullanıcı takılıyor

**Çözüm:**
```
✅ Son 7 günün kurları cache'lenir (Firestore)
✅ API down ise cache'den kullan + uyarı göster:
   "Kurlar 2 gün öncesine ait. Manuel kur girebilirsiniz."
✅ Manuel kur girme opsiyonu (her zaman açık)
✅ Graceful degradation: Kur girilemezse sadece grup para birimi kullanılabilir
```

**Fallback Logic:**
```typescript
const getExchangeRate = async (from: string, to: string) => {
  try {
    const rate = await fetchLatestRate(from, to)
    await cacheRate(from, to, rate)
    return { rate, cached: false }
  } catch (error) {
    const cached = await getCachedRate(from, to)
    if (cached && cached.age < 7) {
      return { rate: cached.rate, cached: true, age: cached.age }
    }
    throw new Error("Kur bilgisi alınamadı. Manuel girin.")
  }
}
```

---

### EDGE-CURRENCY-002: Para Birimi Yuvarlama Hataları
**Senaryo:** 100 TL, 3 kişiye eşit bölünüyor: 33.333...

**Sorun:**
- 33.33 + 33.33 + 33.33 = 99.99 ≠ 100.00
- 1 kuruş kayıp

**Çözüm:**
```
✅ Largest Remainder Method:
   1. Tam kısmı böl: 33 + 33 + 33 = 99
   2. Kalan 1 TL'yi en büyük payı olana ekle
   3. Sonuç: 34 + 33 + 33 = 100 ✅

✅ Validation: Σ paylar === toplam (her zaman)

✅ Deterministik: Aynı input → aynı output
```

**Algoritma:**
```typescript
const splitEqually = (amount: number, count: number): number[] => {
  const quotient = Math.floor(amount / count)
  const remainder = amount - (quotient * count)
  
  const shares = Array(count).fill(quotient)
  
  // Kalanı ilk N kişiye dağıt
  for (let i = 0; i < remainder; i++) {
    shares[i] += 1
  }
  
  // Validation
  const sum = shares.reduce((a, b) => a + b, 0)
  if (sum !== amount) {
    throw new Error("Yuvarlama hatası")
  }
  
  return shares
}

// Test:
splitEqually(100, 3) // [34, 33, 33] ✅
```

---

### EDGE-CURRENCY-003: Ondalık Hassasiyet (Float Problem)
**Senaryo:** JavaScript'te 0.1 + 0.2 = 0.30000000000000004

**Sorun:**
- Float aritmetiği güvenilmez
- Finansal hesaplamalarda hata

**Çözüm:**
```
✅ ASLA float kullanma
✅ Cent/kuruş cinsinden integer hesaplama
✅ Veya Decimal library (decimal.js)
✅ Tüm tutarlar string olarak saklanır
```

**Implementation:**
```typescript
import Decimal from 'decimal.js'

// ❌ YANLIŞ
const total = 10.1 + 20.2 // 30.299999999999997

// ✅ DOĞRU
const total = new Decimal(10.1).plus(20.2).toNumber() // 30.3

// ✅ DAHA İYİ: Integer aritmetiği (kuruş cinsinden)
const amount1 = 1010 // 10.10 TL (kuruş)
const amount2 = 2020 // 20.20 TL
const total = amount1 + amount2 // 3030 kuruş = 30.30 TL ✅
```

**Veri Modeli:**
```typescript
interface Expense {
  amount: string  // "100.50" - string olarak sakla
  amountInCents: number // 10050 - hesaplamalar için
  currency: string
}
```

---

### EDGE-CURRENCY-004: Farklı Para Birimlerinde Settlement
**Senaryo:** A (TL kullanıyor), B (EUR kullanıyor), ödeme yapacak.

**Sorun:**
- A "100 TL borçlusun" görüyor
- B "3 EUR borçlusun" görmek istiyor

**Çözüm:**
```
✅ Her kullanıcı kendi tercih para biriminde görsün
✅ Backend'de grup para birimi üzerinden hesapla
✅ Display'de user.preferredCurrency'e çevir
✅ Güncel kur göster (bilgilendirme)
```

**UI:**
```
Ahmet'e borçlusun:
100.00 TL (≈ 2.90 EUR)
[Kur: 1 EUR = 34.48 TL]
```

---

## 4. Borç Sadeleştirme

### EDGE-SETTLE-001: Sonsuz Döngü (Circular Debt)
**Senaryo:** A → B: 100, B → C: 100, C → A: 100

**Sorun:**
- Herkes hem borçlu hem alacaklı
- Basit greedy algoritma çözemeyebilir

**Çözüm:**
```
✅ Net bakiye hesabı zaten döngüyü kırar:
   A: +100 -100 = 0
   B: +100 -100 = 0
   C: +100 -100 = 0
✅ Sonuç: Herkes denk, transfer gerekmez ✅
```

---

### EDGE-SETTLE-002: Çok Küçük Borçlar (< 1 TL)
**Senaryo:** A → B: 0.27 TL

**Sorun:**
- Anlamsız transfer
- UX kalabalığı

**Çözüm:**
```
✅ Minimum transfer threshold: 1 TL (ayarlanabilir)
✅ < 1 TL borçlar "ihmal edilebilir" olarak işaretlenir
✅ Kullanıcı tercihi: "Küçük borçları göster/gizle"
✅ Opsiyonel: Küçük borçları yuvarla (0.50 → 0, 0.80 → 1)
```

**Kod:**
```typescript
const MINIMUM_SETTLEMENT = 1.00

const simplifyDebts = (balances) => {
  const settlements = calculateSettlements(balances)
  
  return settlements.filter(s => s.amount >= MINIMUM_SETTLEMENT)
}
```

---

### EDGE-SETTLE-003: Yuvarlama Sonrası Toplam Sıfır Değil
**Senaryo:** Yuvarlama sonrası Σ net ≠ 0 (örn: 0.01 fark)

**Sorun:**
- Matematiksel tutarsızlık
- Sistem güvenilirliği sorgulanır

**Çözüm:**
```
✅ Settlement hesaplamadan önce net toplamı kontrol et
✅ Eğer |toplam| < 0.01 TL ise "yuvarlanabilir hata"
✅ Farkı en büyük bakiyeye ekle/çıkar
✅ Final validation: assert(sum === 0)
```

**Validation:**
```typescript
const validateBalances = (balances: Balance[]) => {
  const sum = balances.reduce((acc, b) => acc + b.amount, 0)
  
  if (Math.abs(sum) > 0.01) {
    throw new Error(`Bakiye toplamı sıfır değil: ${sum}`)
  }
  
  // Micro adjustment
  if (sum !== 0) {
    const maxBalance = balances.reduce((max, b) => 
      Math.abs(b.amount) > Math.abs(max.amount) ? b : max
    )
    maxBalance.amount -= sum
  }
  
  return balances
}
```

---

### EDGE-SETTLE-004: Settlement Sırası Farklılığı
**Senaryo:** Aynı bakiyeler için farklı kullanıcılarda farklı sıralama.

**Sorun:**
- A görüyor: "Mehmet → Ayşe: 100"
- B görüyor: "Ayşe → Mehmet: 100" (ters)

**Çözüm:**
```
✅ Deterministik sıralama:
   - Önce user ID'ye göre sırala
   - Sonra greedy algoritma uygula
✅ Her zaman aynı sonuç
✅ Test ile doğrula
```

**Kod:**
```typescript
const simplifyDebts = (balances: Balance[]) => {
  // Deterministik sıralama
  const sorted = [...balances].sort((a, b) => 
    a.userId.localeCompare(b.userId)
  )
  
  const creditors = sorted.filter(b => b.amount > 0)
  const debtors = sorted.filter(b => b.amount < 0)
  
  const settlements: Settlement[] = []
  
  let i = 0, j = 0
  while (i < creditors.length && j < debtors.length) {
    const creditor = creditors[i]
    const debtor = debtors[j]
    
    const amount = Math.min(creditor.amount, -debtor.amount)
    
    settlements.push({
      from: debtor.userId,
      to: creditor.userId,
      amount: amount
    })
    
    creditor.amount -= amount
    debtor.amount += amount
    
    if (creditor.amount === 0) i++
    if (debtor.amount === 0) j++
  }
  
  return settlements
}
```

---

## 5. Senkronizasyon ve Çakışmalar

### EDGE-SYNC-001: Aynı Anda İki Kişi Aynı Harcamayı Editledi
**Senaryo:**
- T0: A ve B harcama detayına giriyor (tutar: 100)
- T1: A tutarı 150 yapıp kaydediyor
- T2: B tutarı 200 yapıp kaydediyor
- T3: A'nın değişikliği kayboldu

**Sorun:**
- Lost update problem
- Veri kaybı

**Çözüm:**
```
✅ Version field + Optimistic Locking:

1. Her kayıtta version number var
2. A okur: { amount: 100, version: 1 }
3. B okur: { amount: 100, version: 1 }
4. A günceller: { amount: 150, version: 2 } ✅
5. B günceller: { amount: 200, version: 2 } ❌
   → Version conflict! Backend reddeder.

6. B'ye hata mesajı:
   "Bu harcama başkası tarafından güncellendi. 
    Yeniden yükleyin."

✅ Alternative: Last Write Wins (LWW) + Kullanıcı bildirimi
```

**Backend (Firestore):**
```typescript
const updateExpense = async (id, data, expectedVersion) => {
  const ref = firestore.collection('expenses').doc(id)
  
  await firestore.runTransaction(async (txn) => {
    const doc = await txn.get(ref)
    
    if (!doc.exists) {
      throw new Error("Harcama bulunamadı")
    }
    
    const currentVersion = doc.data().version
    
    if (currentVersion !== expectedVersion) {
      throw new Error("Version conflict")
    }
    
    txn.update(ref, {
      ...data,
      version: currentVersion + 1,
      updatedAt: FieldValue.serverTimestamp()
    })
  })
}
```

---

### EDGE-SYNC-002: Offline Eklenen Harcama, Online Olunca Reddedildi
**Senaryo:** Kullanıcı offline harcama ekledi, o sırada gruptan çıkarıldı.

**Sorun:**
- Sync sırasında yetki hatası
- Kullanıcı frustration

**Çözüm:**
```
✅ Sync öncesi permission check
✅ Reddedilen işlemler için açıklayıcı mesaj:
   "Bu harcama eklenemedi: Gruptan çıkarılmışsınız"
✅ Kullanıcıya seçenek:
   - Local'den sil
   - Başka gruba taşı (opsiyonel)
✅ Sync queue'dan kaldır
```

---

### EDGE-SYNC-003: Çok Sayıda Offline İşlem Biriktі
**Senaryo:** 1 hafta offline, 50 harcama eklendi, şimdi online oldu.

**Sorun:**
- Tümü birden sync edilirse overwhelm
- Bazıları başarısız olabilir

**Çözüm:**
```
✅ Batch sync (10'ar 10'ar)
✅ Progress indicator: "45/50 senkronize ediliyor"
✅ Retry logic (başarısızlar için)
✅ Başarılı/başarısız sayısı raporu
✅ Background sync (kullanıcı beklemeden)
```

**Implementation:**
```typescript
const syncQueue = async (items: QueueItem[]) => {
  const BATCH_SIZE = 10
  const results = { success: 0, failed: 0 }
  
  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const batch = items.slice(i, i + BATCH_SIZE)
    
    const promises = batch.map(item => syncItem(item))
    const settled = await Promise.allSettled(promises)
    
    settled.forEach(result => {
      if (result.status === 'fulfilled') {
        results.success++
      } else {
        results.failed++
      }
    })
    
    // Progress update
    onProgress({
      current: Math.min(i + BATCH_SIZE, items.length),
      total: items.length
    })
  }
  
  return results
}
```

---

## 6. Güvenlik ve İzinler

### EDGE-SEC-001: Davet Linki Sızdı
**Senaryo:** Davet linki sosyal medyada paylaşıldı, yüzlerce kişi katılıyor.

**Sorun:**
- İstenmeyen üyeler
- Spam

**Çözüm:**
```
✅ Owner linki anında iptal edebilir
✅ Tüm üyeleri toplu çıkarma seçeneği
✅ Rate limiting (IP bazlı)
✅ Captcha (şüpheli aktivite)
✅ İlk katılımda owner onayı (opsiyonel ayar)
```

---

### EDGE-SEC-002: Eski Üye Hala Verilere Erişiyor (Cache)
**Senaryo:** A gruptan çıkarıldı ama local cache'inde veriler var.

**Sorun:**
- Gizlilik ihlali
- Güncel olmayan veri

**Çözüm:**
```
✅ Gruptan çıkarma → local cache temizle
✅ Firestore Security Rules: sadece aktif üyeler okuyabilir
✅ Realtime listener otomatik kesilir
✅ UI'da grup listesinden kaldır
```

**Firestore Rules:**
```javascript
match /groups/{groupId}/expenses/{expenseId} {
  allow read: if isActiveMember(groupId, request.auth.uid);
}

function isActiveMember(groupId, userId) {
  let member = get(/databases/$(database)/documents/groups/$(groupId)/members/$(userId));
  return member.data.status == 'Active';
}
```

---

### EDGE-SEC-003: Viewer Rolü API ile Harcama Ekliyor
**Senaryo:** Kötü niyetli kullanıcı API'yi direkt çağırıp harcama ekliyor.

**Sorun:**
- Frontend validasyonu bypass edildi
- Yetki ihlali

**Çözüm:**
```
✅ Backend'de mutlaka permission check
✅ Firestore Security Rules (defense in depth)
✅ Frontend sadece UX için disable eder
✅ Her API call'da token + rol kontrolü
```

**Backend:**
```typescript
const addExpense = async (groupId, expenseData, userId) => {
  const member = await getMember(groupId, userId)
  
  if (!member || member.status !== 'Active') {
    throw new ForbiddenError("Grup üyesi değilsiniz")
  }
  
  if (member.role === 'Viewer') {
    throw new ForbiddenError("Harcama ekleme yetkiniz yok")
  }
  
  // Proceed...
}
```

---

## 7. Performans ve Ölçekleme

### EDGE-PERF-001: Grup 1000 Harcamalı, Liste Yavaş
**Senaryo:** Çok aktif kullanılan grup, liste scroll ederken lag.

**Sorun:**
- FlatList performansı
- Rendering overload

**Çözüm:**
```
✅ FlashList kullan (react-native-flash-list)
✅ Pagination (ilk 50, scroll'da daha fazla yükle)
✅ Virtualization + windowing
✅ Memoization (React.memo, useMemo)
✅ Lazy loading (görseller, detaylar)
```

**Implementation:**
```tsx
import { FlashList } from "@shopify/flash-list"

<FlashList
  data={expenses}
  renderItem={renderExpenseItem}
  estimatedItemSize={80}
  onEndReached={loadMore}
  onEndReachedThreshold={0.5}
/>
```

---

### EDGE-PERF-002: Real-time Listener 100 Üyelik Grupta
**Senaryo:** Her üye değişikliği dinliyor, çok fazla güncelleme.

**Sorun:**
- Network trafiği
- Battery drain
- Firestore read maliyeti

**Çözüm:**
```
✅ Selective listening: Sadece aktif grup dinlenir
✅ Debounce updates (500ms)
✅ Background'dayken listener durdur
✅ Pagination ile sınırlı dinleme
```

**Kod:**
```typescript
useEffect(() => {
  if (!isActiveGroup || !isForeground) {
    return
  }
  
  const unsubscribe = firestore
    .collection('groups')
    .doc(groupId)
    .collection('expenses')
    .orderBy('createdAt', 'desc')
    .limit(50) // İlk 50
    .onSnapshot(
      debounce((snapshot) => {
        // Update UI
      }, 500)
    )
  
  return unsubscribe
}, [groupId, isActiveGroup, isForeground])
```

---

### EDGE-PERF-003: Bakiye Hesaplama Çok Uzun Sürüyor
**Senaryo:** 100 üye, 1000 harcama, bakiye hesaplama 5 saniye.

**Sorun:**
- UI donuyor
- Kullanıcı bekliyor

**Çözüm:**
```
✅ Backend'de hesapla (Cloud Function)
✅ Cache sonuçları (Firestore'da balance summary)
✅ Incremental update (her harcama eklendiğinde sadece ilgilileri güncelle)
✅ Web Worker (client-side)
```

**Architecture:**
```
Harcama eklendi
  ↓
Cloud Function Trigger
  ↓
Recalculate affected balances
  ↓
Update cached balances
  ↓
Notify clients (Firestore listener)
```

---

## Test Stratejisi

Her edge case için:

1. **Unit Test:** Fonksiyon davranışı
2. **Integration Test:** API + DB
3. **E2E Test:** Kullanıcı akışı
4. **Manual Test:** Gerçek cihazda doğrulama

**Örnek Test (EDGE-CURRENCY-002):**
```typescript
describe('Equal split with rounding', () => {
  it('should split 100 TL among 3 people correctly', () => {
    const result = splitEqually(100, 3)
    expect(result).toEqual([34, 33, 33])
    expect(result.reduce((a, b) => a + b)).toBe(100)
  })
  
  it('should be deterministic', () => {
    const result1 = splitEqually(100, 3)
    const result2 = splitEqually(100, 3)
    expect(result1).toEqual(result2)
  })
})
```

---

## Özet

**Toplam Edge Case:** 30+  
**Kritik:** 15 (Must fix before launch)  
**Önemli:** 10 (Fix in M2-M3)  
**Nice to Have:** 5 (Backlog)

**En Kritik 5:**
1. EDGE-CURRENCY-002: Yuvarlama hataları
2. EDGE-SYNC-001: Concurrent edit çakışması
3. EDGE-EXPENSE-004: Kesin tutar uyuşmazlığı
4. EDGE-SEC-003: Permission bypass
5. EDGE-SETTLE-003: Bakiye toplam validation

---

**Versiyon:** 1.0  
**Hazırlayan:** BölBölÖde Ekibi  
**Son Güncelleme:** 27 Ekim 2025

