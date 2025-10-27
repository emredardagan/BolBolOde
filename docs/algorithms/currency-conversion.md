# BölBölÖde - Para Birimi Dönüşüm ve Yuvarlama

## İçindekiler
1. [Para Birimi Yönetimi](#1-para-birimi-yönetimi)
2. [Döviz Kuru İşlemleri](#2-döviz-kuru-işlemleri)
3. [Yuvarlama Kuralları](#3-yuvarlama-kuralları)
4. [Decimal Hassasiyet](#4-decimal-hassasiyet)
5. [Implementation](#5-implementation)

---

## 1. Para Birimi Yönetimi

### 1.1 Desteklenen Para Birimleri

```typescript
enum Currency {
  TRY = 'TRY',  // Türk Lirası (varsayılan)
  USD = 'USD',  // Amerikan Doları
  EUR = 'EUR',  // Euro
  GBP = 'GBP',  // İngiliz Sterlini
  JPY = 'JPY',  // Japon Yeni
  CHF = 'CHF',  // İsviçre Frangı
  AUD = 'AUD',  // Avustralya Doları
  CAD = 'CAD',  // Kanada Doları
}

interface CurrencyInfo {
  code: string
  symbol: string
  name: string
  nameTR: string
  decimals: number
  minorUnit: number  // Kuruş/cent/pence vb.
}

const CURRENCIES: Record<Currency, CurrencyInfo> = {
  TRY: {
    code: 'TRY',
    symbol: '₺',
    name: 'Turkish Lira',
    nameTR: 'Türk Lirası',
    decimals: 2,
    minorUnit: 100  // 1 TL = 100 kuruş
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    nameTR: 'Amerikan Doları',
    decimals: 2,
    minorUnit: 100  // 1 USD = 100 cents
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    nameTR: 'Euro',
    decimals: 2,
    minorUnit: 100  // 1 EUR = 100 cents
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    nameTR: 'İngiliz Sterlini',
    decimals: 2,
    minorUnit: 100  // 1 GBP = 100 pence
  },
  JPY: {
    code: 'JPY',
    symbol: '¥',
    name: 'Japanese Yen',
    nameTR: 'Japon Yeni',
    decimals: 0,  // JPY ondalık kullanmaz
    minorUnit: 1
  },
  // ... diğerleri
}
```

### 1.2 Para Birimi Formatı

```typescript
/**
 * Para birimini formatla
 */
function formatCurrency(
  amount: number,  // Kuruş cinsinden
  currency: Currency,
  locale: string = 'tr-TR'
): string {
  const info = CURRENCIES[currency]
  const majorAmount = amount / info.minorUnit

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: info.decimals,
    maximumFractionDigits: info.decimals
  }).format(majorAmount)
}

// Örnekler:
formatCurrency(150000, 'TRY', 'tr-TR')  // "1.500,00 ₺"
formatCurrency(150000, 'TRY', 'en-US')  // "₺1,500.00"
formatCurrency(10000, 'USD', 'en-US')   // "$100.00"
formatCurrency(5000, 'JPY', 'ja-JP')    // "¥5,000"
```

---

## 2. Döviz Kuru İşlemleri

### 2.1 Kur Kaynağı

**API:** exchangerate-api.com (free tier)

```typescript
interface ExchangeRate {
  from: Currency
  to: Currency
  rate: number
  date: Date
  source: string
}

/**
 * Döviz kuru çek
 */
async function fetchExchangeRate(
  from: Currency,
  to: Currency
): Promise<ExchangeRate> {
  const API_URL = `https://api.exchangerate-api.com/v4/latest/${from}`

  try {
    const response = await fetch(API_URL)
    const data = await response.json()

    return {
      from,
      to,
      rate: data.rates[to],
      date: new Date(data.date),
      source: 'exchangerate-api.com'
    }
  } catch (error) {
    throw new Error('Döviz kuru alınamadı')
  }
}
```

### 2.2 Kur Cache'leme

```typescript
/**
 * Kur cache yönetimi
 */
class ExchangeRateCache {
  private cache: Map<string, ExchangeRate> = new Map()
  private cacheExpiry = 24 * 60 * 60 * 1000  // 24 saat

  /**
   * Cache key oluştur
   */
  private getCacheKey(from: Currency, to: Currency): string {
    return `${from}-${to}`
  }

  /**
   * Cache'den kur al
   */
  async get(from: Currency, to: Currency): Promise<ExchangeRate | null> {
    const key = this.getCacheKey(from, to)
    const cached = this.cache.get(key)

    if (!cached) {
      // Firestore'dan kontrol et
      const fromDB = await this.getFromFirestore(from, to)
      if (fromDB) {
        this.cache.set(key, fromDB)
        return fromDB
      }
      return null
    }

    // Cache expiry kontrolü
    const age = Date.now() - cached.date.getTime()
    if (age > this.cacheExpiry) {
      this.cache.delete(key)
      return null
    }

    return cached
  }

  /**
   * Cache'e kur ekle
   */
  async set(rate: ExchangeRate): Promise<void> {
    const key = this.getCacheKey(rate.from, rate.to)
    this.cache.set(key, rate)

    // Firestore'a da kaydet
    await this.saveToFirestore(rate)
  }

  /**
   * Firestore'dan al
   */
  private async getFromFirestore(
    from: Currency,
    to: Currency
  ): Promise<ExchangeRate | null> {
    const today = new Date().toISOString().split('T')[0]
    const rateId = `${from}-${to}-${today}`

    const doc = await firestore
      .collection('exchangeRates')
      .doc(rateId)
      .get()

    return doc.exists ? (doc.data() as ExchangeRate) : null
  }

  /**
   * Firestore'a kaydet
   */
  private async saveToFirestore(rate: ExchangeRate): Promise<void> {
    const today = new Date().toISOString().split('T')[0]
    const rateId = `${rate.from}-${rate.to}-${today}`

    await firestore.collection('exchangeRates').doc(rateId).set({
      ...rate,
      date: admin.firestore.Timestamp.fromDate(rate.date)
    })
  }
}

const exchangeRateCache = new ExchangeRateCache()
```

### 2.3 Para Birimi Dönüşümü

```typescript
/**
 * Tutarı bir para biriminden diğerine çevir
 */
async function convertCurrency(
  amount: number,  // Kuruş cinsinden
  from: Currency,
  to: Currency,
  manualRate?: number  // Manuel kur (opsiyonel)
): Promise<{ convertedAmount: number; rate: number; rateDate: Date }> {
  // Aynı para birimiyse dönüşüm yok
  if (from === to) {
    return {
      convertedAmount: amount,
      rate: 1.0,
      rateDate: new Date()
    }
  }

  // Manuel kur kullanılacaksa
  if (manualRate) {
    const fromInfo = CURRENCIES[from]
    const toInfo = CURRENCIES[to]

    const majorAmount = amount / fromInfo.minorUnit
    const convertedMajor = majorAmount * manualRate
    const convertedAmount = Math.round(convertedMajor * toInfo.minorUnit)

    return {
      convertedAmount,
      rate: manualRate,
      rateDate: new Date()
    }
  }

  // Cache'den veya API'den kur al
  let rateData = await exchangeRateCache.get(from, to)

  if (!rateData) {
    rateData = await fetchExchangeRate(from, to)
    await exchangeRateCache.set(rateData)
  }

  // Dönüşüm yap
  const fromInfo = CURRENCIES[from]
  const toInfo = CURRENCIES[to]

  const majorAmount = amount / fromInfo.minorUnit
  const convertedMajor = majorAmount * rateData.rate
  const convertedAmount = Math.round(convertedMajor * toInfo.minorUnit)

  return {
    convertedAmount,
    rate: rateData.rate,
    rateDate: rateData.date
  }
}

// Örnek:
const result = await convertCurrency(
  10000,  // 100.00 USD (kuruş cinsinden)
  'USD',
  'TRY'
)
// result = {
//   convertedAmount: 3245000,  // 32,450.00 TL
//   rate: 32.45,
//   rateDate: Date(...)
// }
```

---

## 3. Yuvarlama Kuralları

### 3.1 Yuvarlama Stratejisi

**Kural:** Half-up rounding (0.5 ve üstü yukarı yuvarlanır)

```typescript
/**
 * Banker's rounding yerine half-up
 */
function roundHalfUp(value: number): number {
  return Math.round(value)
}

// Örnekler:
roundHalfUp(2.4)  // 2
roundHalfUp(2.5)  // 3 (half-up)
roundHalfUp(2.6)  // 3
```

### 3.2 Para Birimi Bazında Yuvarlama

```typescript
/**
 * Para birimi kurallarına göre yuvarla
 */
function roundToCurrency(
  amount: number,
  currency: Currency
): number {
  const info = CURRENCIES[currency]

  if (info.decimals === 0) {
    // JPY gibi ondalık olmayan para birimleri
    return Math.round(amount)
  }

  // Kuruş/cent seviyesinde yuvarla
  const minorAmount = amount * info.minorUnit
  const rounded = Math.round(minorAmount)

  return rounded / info.minorUnit
}

// Örnekler:
roundToCurrency(100.567, 'TRY')  // 100.57
roundToCurrency(100.564, 'TRY')  // 100.56
roundToCurrency(1000.7, 'JPY')   // 1001 (ondalık yok)
```

### 3.3 Eşit Bölme Yuvarlama Hatası

**Problem:** 100 TL / 3 kişi = 33.333... TL

**Çözüm: Largest Remainder Method**

```typescript
/**
 * Eşit bölme (yuvarlama hatası düzeltmeli)
 */
function splitEqually(
  totalAmount: number,  // Kuruş cinsinden
  count: number
): number[] {
  const quotient = Math.floor(totalAmount / count)
  const remainder = totalAmount - quotient * count

  const shares = Array(count).fill(quotient)

  // Kalanı ilk N kişiye dağıt
  for (let i = 0; i < remainder; i++) {
    shares[i] += 1
  }

  // Validation
  const sum = shares.reduce((a, b) => a + b, 0)
  if (sum !== totalAmount) {
    throw new Error('Yuvarlama hatası: Toplam eşleşmiyor')
  }

  return shares
}

// Örnek:
splitEqually(10000, 3)  // [3334, 3333, 3333] (kuruş)
// 33.34 TL + 33.33 TL + 33.33 TL = 100.00 TL ✅
```

---

## 4. Decimal Hassasiyet

### 4.1 Float Problemi

**JavaScript Sorunu:**
```javascript
0.1 + 0.2 === 0.3  // false! 😱
0.1 + 0.2  // 0.30000000000000004
```

**Çözüm: Integer Aritmetiği (Kuruş Cinsinden)**

```typescript
// ❌ YANLIŞ: Float kullanımı
const price1 = 10.50
const price2 = 20.30
const total = price1 + price2  // 30.799999999999997 😱

// ✅ DOĞRU: Kuruş cinsinden integer
const price1 = 1050  // 10.50 TL
const price2 = 2030  // 20.30 TL
const total = price1 + price2  // 3080 (30.80 TL) ✅
```

### 4.2 Decimal.js Alternatifi

**Eğer decimal gerekiyorsa:**

```typescript
import Decimal from 'decimal.js'

const price1 = new Decimal(10.50)
const price2 = new Decimal(20.30)
const total = price1.plus(price2)  // 30.80 ✅

total.toNumber()  // 30.8
```

### 4.3 Veri Modeli

```typescript
interface Expense {
  amount: number          // KURUŞ cinsinden (integer)
  amountFormatted: string // "100.50" (display için)
  currency: string        // "TRY"
}

// Veritabanına kaydetme
const expense = {
  amount: 10050,  // 100.50 TL (kuruş)
  amountFormatted: "100.50",
  currency: "TRY"
}

// Okuma
const displayAmount = formatCurrency(expense.amount, expense.currency)
// "100,50 ₺"
```

---

## 5. Implementation

### 5.1 Currency Utility

```typescript
// utils/currency.ts

export class CurrencyUtils {
  /**
   * Major birimden minor birime (TL → kuruş)
   */
  static toMinorUnits(
    amount: number,
    currency: Currency
  ): number {
    const info = CURRENCIES[currency]
    return Math.round(amount * info.minorUnit)
  }

  /**
   * Minor birimden major birime (kuruş → TL)
   */
  static toMajorUnits(
    amount: number,
    currency: Currency
  ): number {
    const info = CURRENCIES[currency]
    return amount / info.minorUnit
  }

  /**
   * Formatla
   */
  static format(
    amount: number,
    currency: Currency,
    locale?: string
  ): string {
    return formatCurrency(amount, currency, locale)
  }

  /**
   * Dönüştür
   */
  static async convert(
    amount: number,
    from: Currency,
    to: Currency,
    manualRate?: number
  ): Promise<ConversionResult> {
    return await convertCurrency(amount, from, to, manualRate)
  }

  /**
   * Parse (string → number)
   */
  static parse(
    value: string,
    currency: Currency
  ): number {
    // "100,50" → 10050 (kuruş)
    const cleaned = value.replace(/[^\d.,]/g, '')
    const normalized = cleaned.replace(',', '.')
    const parsed = parseFloat(normalized)

    if (isNaN(parsed)) {
      throw new Error('Geçersiz tutar')
    }

    return this.toMinorUnits(parsed, currency)
  }
}
```

### 5.2 Kullanım Örnekleri

```typescript
// Harcama ekleme
const userInput = "100,50"  // Kullanıcı "100,50 TL" girdi
const amount = CurrencyUtils.parse(userInput, 'TRY')  // 10050 kuruş

const expense = {
  amount,
  amountFormatted: (amount / 100).toFixed(2),
  currency: 'TRY'
}

// Görüntüleme
const display = CurrencyUtils.format(expense.amount, expense.currency)
// "100,50 ₺"

// Döviz dönüşümü
const converted = await CurrencyUtils.convert(
  10000,  // 100 USD
  'USD',
  'TRY'
)
// { convertedAmount: 3245000, rate: 32.45, rateDate: ... }
```

---

## 6. Test Cases

### 6.1 Yuvarlama Testleri

```typescript
test('should split 100 TL equally among 3 people', () => {
  const shares = splitEqually(10000, 3)

  expect(shares).toEqual([3334, 3333, 3333])
  expect(shares.reduce((a, b) => a + b)).toBe(10000)
})

test('should handle JPY (no decimals)', () => {
  const amount = CurrencyUtils.toMinorUnits(1000.7, 'JPY')
  expect(amount).toBe(1001)
})
```

### 6.2 Dönüşüm Testleri

```typescript
test('should convert USD to TRY correctly', async () => {
  const result = await CurrencyUtils.convert(
    10000,  // 100 USD
    'USD',
    'TRY',
    32.45   // Manuel kur
  )

  expect(result.convertedAmount).toBe(3245000)  // 32,450 TL
  expect(result.rate).toBe(32.45)
})
```

---

**Versiyon:** 1.0  
**Hazırlayan:** BölBölÖde Ekibi  
**Son Güncelleme:** 27 Ekim 2025

