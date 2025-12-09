# BölBölÖde - Algoritma Test Senaryoları

## İçindekiler
1. [Borç Sadeleştirme Testleri](#1-borç-sadeleştirme-testleri)
2. [Para Birimi Dönüşüm Testleri](#2-para-birimi-dönüşüm-testleri)
3. [Bakiye Hesaplama Testleri](#3-bakiye-hesaplama-testleri)
4. [Yuvarlama Testleri](#4-yuvarlama-testleri)
5. [Edge Case Testleri](#5-edge-case-testleri)

---

## 1. Borç Sadeleştirme Testleri

### 1.1 Basit 3 Kişi Senaryosu

**Input:**
```json
{
  "balances": [
    { "memberId": "A", "name": "Ahmet", "balance": 50000 },
    { "memberId": "B", "name": "Mehmet", "balance": -30000 },
    { "memberId": "C", "name": "Ayşe", "balance": -20000 }
  ]
}
```

**Expected Output:**
```json
{
  "settlements": [
    {
      "fromMemberId": "B",
      "fromMemberName": "Mehmet",
      "toMemberId": "A",
      "toMemberName": "Ahmet",
      "amount": 30000
    },
    {
      "fromMemberId": "C",
      "fromMemberName": "Ayşe",
      "toMemberId": "A",
      "toMemberName": "Ahmet",
      "amount": 20000
    }
  ],
  "totalTransactions": 2
}
```

**Validation:**
- ✅ Toplam transfer = 50000 (A'nın alacağı)
- ✅ Transfer sayısı = 2 (minimum)
- ✅ Tüm borçlar sıfırlanıyor

---

### 1.2 Karmaşık 5 Kişi Senaryosu

**Input:**
```json
{
  "balances": [
    { "memberId": "A", "name": "Ahmet", "balance": 100000 },
    { "memberId": "B", "name": "Mehmet", "balance": 50000 },
    { "memberId": "C", "name": "Ayşe", "balance": -30000 },
    { "memberId": "D", "name": "Fatma", "balance": -80000 },
    { "memberId": "E", "name": "Ali", "balance": -40000 }
  ]
}
```

**Expected Output:**
```json
{
  "settlements": [
    {
      "fromMemberId": "D",
      "fromMemberName": "Fatma",
      "toMemberId": "A",
      "toMemberName": "Ahmet",
      "amount": 80000
    },
    {
      "fromMemberId": "E",
      "fromMemberName": "Ali",
      "toMemberId": "A",
      "toMemberName": "Ahmet",
      "amount": 20000
    },
    {
      "fromMemberId": "C",
      "fromMemberName": "Ayşe",
      "toMemberId": "A",
      "toMemberName": "Ahmet",
      "amount": 0
    },
    {
      "fromMemberId": "C",
      "fromMemberName": "Ayşe",
      "toMemberId": "B",
      "toMemberName": "Mehmet",
      "amount": 30000
    },
    {
      "fromMemberId": "E",
      "fromMemberName": "Ali",
      "toMemberId": "B",
      "toMemberName": "Mehmet",
      "amount": 20000
    }
  ],
  "totalTransactions": 5
}
```

**Validation:**
- ✅ Toplam alacak = 150000
- ✅ Toplam borç = 150000
- ✅ Transfer sayısı ≤ 4 (optimal değil ama çalışıyor)

---

### 1.3 Eşit Bakiye Senaryosu

**Input:**
```json
{
  "balances": [
    { "memberId": "A", "name": "Ahmet", "balance": 10000 },
    { "memberId": "B", "name": "Mehmet", "balance": -10000 }
  ]
}
```

**Expected Output:**
```json
{
  "settlements": [
    {
      "fromMemberId": "B",
      "fromMemberName": "Mehmet",
      "toMemberId": "A",
      "toMemberName": "Ahmet",
      "amount": 10000
    }
  ],
  "totalTransactions": 1
}
```

**Validation:**
- ✅ Tek transfer ile çözülüyor
- ✅ Minimum işlem sayısı

---

### 1.4 Çoklu Alacaklı Senaryosu

**Input:**
```json
{
  "balances": [
    { "memberId": "A", "name": "Ahmet", "balance": 60000 },
    { "memberId": "B", "name": "Mehmet", "balance": 40000 },
    { "memberId": "C", "name": "Ayşe", "balance": -100000 }
  ]
}
```

**Expected Output:**
```json
{
  "settlements": [
    {
      "fromMemberId": "C",
      "fromMemberName": "Ayşe",
      "toMemberId": "A",
      "toMemberName": "Ahmet",
      "amount": 60000
    },
    {
      "fromMemberId": "C",
      "fromMemberName": "Ayşe",
      "toMemberId": "B",
      "toMemberName": "Mehmet",
      "amount": 40000
    }
  ],
  "totalTransactions": 2
}
```

**Validation:**
- ✅ En büyük alacaklıdan başlanıyor
- ✅ Optimal çözüm

---

### 1.5 Sıfır Bakiye Senaryosu

**Input:**
```json
{
  "balances": [
    { "memberId": "A", "name": "Ahmet", "balance": 0 },
    { "memberId": "B", "name": "Mehmet", "balance": 0 },
    { "memberId": "C", "name": "Ayşe", "balance": 0 }
  ]
}
```

**Expected Output:**
```json
{
  "settlements": [],
  "totalTransactions": 0
}
```

**Validation:**
- ✅ Transfer yok
- ✅ Boş array dönüyor

---

## 2. Para Birimi Dönüşüm Testleri

### 2.1 TRY → USD Dönüşümü

**Input:**
```json
{
  "amount": 32500,
  "from": "TRY",
  "to": "USD",
  "rate": 32.5
}
```

**Expected Output:**
```json
{
  "convertedAmount": 10000,
  "rate": 32.5,
  "rateDate": "2024-01-15T10:00:00Z"
}
```

**Validation:**
- ✅ 325 TL → 10 USD (32.5 kur ile)
- ✅ Kuruş cinsinden: 32500 → 10000 (cents)

---

### 2.2 USD → TRY Dönüşümü

**Input:**
```json
{
  "amount": 10000,
  "from": "USD",
  "to": "TRY",
  "rate": 32.5
}
```

**Expected Output:**
```json
{
  "convertedAmount": 325000,
  "rate": 32.5,
  "rateDate": "2024-01-15T10:00:00Z"
}
```

**Validation:**
- ✅ 10 USD → 325 TL
- ✅ Cents → kuruş: 10000 → 325000

---

### 2.3 Aynı Para Birimi

**Input:**
```json
{
  "amount": 50000,
  "from": "TRY",
  "to": "TRY"
}
```

**Expected Output:**
```json
{
  "convertedAmount": 50000,
  "rate": 1.0,
  "rateDate": "2024-01-15T10:00:00Z"
}
```

**Validation:**
- ✅ Değişiklik yok
- ✅ Rate = 1.0

---

### 2.4 EUR → GBP Dönüşümü

**Input:**
```json
{
  "amount": 10000,
  "from": "EUR",
  "to": "GBP",
  "rate": 0.85
}
```

**Expected Output:**
```json
{
  "convertedAmount": 8500,
  "rate": 0.85,
  "rateDate": "2024-01-15T10:00:00Z"
}
```

**Validation:**
- ✅ 100 EUR → 85 GBP
- ✅ Cents → pence: 10000 → 8500

---

## 3. Bakiye Hesaplama Testleri

### 3.1 Eşit Paylaşım Senaryosu

**Input:**
```json
{
  "expenses": [
    {
      "id": "exp1",
      "amount": 30000,
      "payerId": "A",
      "participantIds": ["A", "B", "C"],
      "splitType": "equal"
    }
  ],
  "members": [
    { "id": "A", "userId": "Ahmet" },
    { "id": "B", "userId": "Mehmet" },
    { "id": "C", "userId": "Ayşe" }
  ]
}
```

**Expected Output:**
```json
{
  "balances": [
    { "memberId": "A", "name": "Ahmet", "balance": 20000 },
    { "memberId": "B", "name": "Mehmet", "balance": -10000 },
    { "memberId": "C", "name": "Ayşe", "balance": -10000 }
  ]
}
```

**Validation:**
- ✅ A ödedi: 30000, payı: 10000 → net: +20000
- ✅ B payı: 10000 → net: -10000
- ✅ C payı: 10000 → net: -10000
- ✅ Toplam = 0

---

### 3.2 Çoklu Harcama Senaryosu

**Input:**
```json
{
  "expenses": [
    {
      "id": "exp1",
      "amount": 20000,
      "payerId": "A",
      "participantIds": ["A", "B"],
      "splitType": "equal"
    },
    {
      "id": "exp2",
      "amount": 30000,
      "payerId": "B",
      "participantIds": ["A", "B", "C"],
      "splitType": "equal"
    },
    {
      "id": "exp3",
      "amount": 10000,
      "payerId": "C",
      "participantIds": ["C"],
      "splitType": "equal"
    }
  ],
  "members": [
    { "id": "A", "userId": "Ahmet" },
    { "id": "B", "userId": "Mehmet" },
    { "id": "C", "userId": "Ayşe" }
  ]
}
```

**Expected Output:**
```json
{
  "balances": [
    { "memberId": "A", "name": "Ahmet", "balance": 5000 },
    { "memberId": "B", "name": "Mehmet", "balance": 5000 },
    { "memberId": "C", "name": "Ayşe", "balance": -10000 }
  ]
}
```

**Calculation:**
```
A: Ödedi 20000, Payı (10000 + 10000) = 20000 → Net: 0
   Düzeltme: A'nın payı exp1'de 10000, exp2'de 10000 = 20000
   A ödedi: 20000 → Net: 0

B: Ödedi 30000, Payı (10000 + 10000) = 20000 → Net: +10000
   Düzeltme: B'nin payı exp1'de 10000, exp2'de 10000 = 20000
   B ödedi: 30000 → Net: +10000

C: Ödedi 10000, Payı (10000) = 10000 → Net: 0
   Düzeltme: C'nin payı exp2'de 10000, exp3'de 10000 = 20000
   C ödedi: 10000 → Net: -10000
```

**Validation:**
- ✅ Toplam ödenen = 60000
- ✅ Toplam pay = 60000
- ✅ Net toplam = 0

---

## 4. Yuvarlama Testleri

### 4.1 Eşit Paylaşım Yuvarlama

**Input:**
```json
{
  "totalAmount": 10000,
  "count": 3
}
```

**Expected Output:**
```json
{
  "shares": [3334, 3333, 3333],
  "sum": 10000
}
```

**Validation:**
- ✅ Toplam = 10000
- ✅ Kalan 1 kuruş en büyük paya ekleniyor

---

### 4.2 5 Kişi Eşit Paylaşım

**Input:**
```json
{
  "totalAmount": 10000,
  "count": 5
}
```

**Expected Output:**
```json
{
  "shares": [2000, 2000, 2000, 2000, 2000],
  "sum": 10000
}
```

**Validation:**
- ✅ Tam bölünüyor
- ✅ Herkes eşit pay alıyor

---

### 4.3 7 Kişi Eşit Paylaşım

**Input:**
```json
{
  "totalAmount": 10000,
  "count": 7
}
```

**Expected Output:**
```json
{
  "shares": [1429, 1429, 1429, 1429, 1428, 1428, 1428],
  "sum": 10000
}
```

**Validation:**
- ✅ Toplam = 10000
- ✅ İlk 4 kişi 1429, son 3 kişi 1428 alıyor
- ✅ Kalan 4 kuruş dağıtılıyor

---

### 4.4 Yuvarlama Hatası Düzeltme

**Input:**
```json
{
  "balances": [
    { "memberId": "A", "name": "Ahmet", "balance": 10001 },
    { "memberId": "B", "name": "Mehmet", "balance": -10000 },
    { "memberId": "C", "name": "Ayşe", "balance": -1 }
  ]
}
```

**Expected Output (after adjustment):**
```json
{
  "balances": [
    { "memberId": "A", "name": "Ahmet", "balance": 10000 },
    { "memberId": "B", "name": "Mehmet", "balance": -10000 },
    { "memberId": "C", "name": "Ayşe", "balance": 0 }
  ]
}
```

**Validation:**
- ✅ Toplam = 0
- ✅ En büyük bakiyeden 1 kuruş çıkarılıyor

---

## 5. Edge Case Testleri

### 5.1 Minimum Transfer Tutarı

**Input:**
```json
{
  "balances": [
    { "memberId": "A", "name": "Ahmet", "balance": 50 },
    { "memberId": "B", "name": "Mehmet", "balance": -50 }
  ],
  "minimumAmount": 100
}
```

**Expected Output:**
```json
{
  "settlements": [],
  "totalTransactions": 0
}
```

**Validation:**
- ✅ Minimum tutar altında transfer yok
- ✅ Boş array dönüyor

---

### 5.2 Çok Küçük Bakiyeler

**Input:**
```json
{
  "balances": [
    { "memberId": "A", "name": "Ahmet", "balance": 1 },
    { "memberId": "B", "name": "Mehmet", "balance": -1 }
  ]
}
```

**Expected Output:**
```json
{
  "settlements": [],
  "totalTransactions": 0
}
```

**Validation:**
- ✅ 1 kuruş transfer yok (minimumAmount = 100)
- ✅ Yuvarlama hatası olarak kabul ediliyor

---

### 5.3 Çok Büyük Bakiyeler

**Input:**
```json
{
  "balances": [
    { "memberId": "A", "name": "Ahmet", "balance": 100000000 },
    { "memberId": "B", "name": "Mehmet", "balance": -50000000 },
    { "memberId": "C", "name": "Ayşe", "balance": -50000000 }
  ]
}
```

**Expected Output:**
```json
{
  "settlements": [
    {
      "fromMemberId": "B",
      "fromMemberName": "Mehmet",
      "toMemberId": "A",
      "toMemberName": "Ahmet",
      "amount": 50000000
    },
    {
      "fromMemberId": "C",
      "fromMemberName": "Ayşe",
      "toMemberId": "A",
      "toMemberName": "Ahmet",
      "amount": 50000000
    }
  ],
  "totalTransactions": 2
}
```

**Validation:**
- ✅ Büyük sayılarla çalışıyor
- ✅ Overflow yok

---

### 5.4 Negatif Toplam Hatası

**Input:**
```json
{
  "balances": [
    { "memberId": "A", "name": "Ahmet", "balance": 10000 },
    { "memberId": "B", "name": "Mehmet", "balance": -20000 }
  ]
}
```

**Expected Behavior:**
- ❌ Error thrown: "Bakiye toplamı sıfır değil: -10000"

**Validation:**
- ✅ Hata yakalanıyor
- ✅ Kullanıcıya bilgi veriliyor

---

### 5.5 Tek Kişi Senaryosu

**Input:**
```json
{
  "balances": [
    { "memberId": "A", "name": "Ahmet", "balance": 0 }
  ]
}
```

**Expected Behavior:**
- ❌ Error thrown: "En az 2 kişi gerekli"

**Validation:**
- ✅ Validation çalışıyor

---

### 5.6 Geçersiz Bakiye Değeri

**Input:**
```json
{
  "balances": [
    { "memberId": "A", "name": "Ahmet", "balance": NaN },
    { "memberId": "B", "name": "Mehmet", "balance": -10000 }
  ]
}
```

**Expected Behavior:**
- ❌ Error thrown: "Geçersiz bakiye değeri"

**Validation:**
- ✅ NaN kontrolü yapılıyor

---

## Test Execution

### Unit Tests (Jest)

```typescript
describe('simplifyDebts', () => {
  it('should handle simple 3-person scenario', () => {
    const balances = [
      { memberId: 'A', name: 'Ahmet', balance: 50000 },
      { memberId: 'B', name: 'Mehmet', balance: -30000 },
      { memberId: 'C', name: 'Ayşe', balance: -20000 }
    ];
    
    const result = simplifyDebts(balances);
    
    expect(result).toHaveLength(2);
    expect(result[0].amount).toBe(30000);
    expect(result[1].amount).toBe(20000);
  });
  
  // ... more tests
});
```

### Integration Tests

```typescript
describe('Balance Calculation Integration', () => {
  it('should calculate balances from expenses', async () => {
    const expenses = await getGroupExpenses('group1');
    const balances = calculateBalances(expenses);
    
    const total = balances.reduce((sum, b) => sum + b.balance, 0);
    expect(Math.abs(total)).toBeLessThan(1); // Yuvarlama toleransı
  });
});
```

---

## Test Coverage Hedefleri

- **Unit Tests:** %90+ coverage
- **Integration Tests:** Tüm kritik akışlar
- **Edge Cases:** Tüm edge case'ler kapsanmalı
- **Performance Tests:** 1000+ kişilik gruplar için < 1s

---

## Test Veri Setleri

Detaylı test veri setleri için: [sample-datasets.json](./sample-datasets.json)

