# BölBölÖde - Firebase Cloud Functions Dokümanı

## İçindekiler
1. [Genel Bakış](#1-genel-bakış)
2. [HTTP Functions (Callable)](#2-http-functions-callable)
3. [Firestore Triggers](#3-firestore-triggers)
4. [Scheduled Functions](#4-scheduled-functions)
5. [Auth Triggers](#5-auth-triggers)
6. [Deployment](#6-deployment)

---

## 1. Genel Bakış

### 1.1 Fonksiyon Kategorileri

```yaml
HTTP Functions (Callable):
  - calculateGroupBalances: Grup bakiyelerini hesapla
  - simplifyDebts: Borç sadeleştirme
  - generateReport: PDF/CSV rapor oluştur
  - validateInviteToken: Davet token kontrolü

Firestore Triggers:
  - onExpenseCreated: Yeni harcama eklendiğinde
  - onExpenseUpdated: Harcama güncellendiğinde
  - onExpenseDeleted: Harcama silindiğinde
  - onSettlementCreated: Ödeme kaydedildiğinde
  - onGroupMemberAdded: Üye eklendiğinde
  - onGroupMemberRemoved: Üye çıkarıldığında

Scheduled Functions:
  - updateExchangeRates: Günlük döviz kuru güncelleme
  - cleanupOldData: Soft delete edilmiş verileri temizle
  - sendWeeklySummary: Haftalık özet e-postası

Auth Triggers:
  - onUserCreated: Yeni kullanıcı oluşturulduğunda
  - onUserDeleted: Kullanıcı silindiğinde
```

### 1.2 Teknik Stack

```yaml
Runtime: Node.js 20
Language: TypeScript 5.0+
Framework: Firebase Functions v2
Deployment: Firebase CLI
Environment: Dev, Staging, Production
```

### 1.3 Proje Yapısı

```
/functions
  /src
    /triggers
      expense.ts
      settlement.ts
      member.ts
      auth.ts
    /callable
      balance.ts
      report.ts
      invite.ts
    /scheduled
      exchangeRates.ts
      cleanup.ts
    /utils
      validation.ts
      calculation.ts
      notification.ts
    index.ts
  package.json
  tsconfig.json
  .env.local
  .env.production
```

---

## 2. HTTP Functions (Callable)

### 2.1 calculateGroupBalances

**Amaç:** Grup içindeki tüm üyelerin net bakiyelerini hesaplar.

**Endpoint:**
```typescript
functions.https.onCall
```

**Input:**
```typescript
interface CalculateBalancesRequest {
  groupId: string
}
```

**Output:**
```typescript
interface CalculateBalancesResponse {
  balances: MemberBalance[]
  totalExpenses: number
  totalAmount: number
  lastUpdated: Timestamp
}

interface MemberBalance {
  memberId: string
  userId: string
  name: string
  netBalance: number      // Pozitif: alacaklı, Negatif: borçlu
  totalPaid: number       // Toplam ödediği
  totalOwed: number       // Toplam borcu
}
```

**Implementation:**
```typescript
import * as functions from 'firebase-functions/v2'
import { getFirestore } from 'firebase-admin/firestore'

export const calculateGroupBalances = functions.https.onCall(
  async (request) => {
    const { groupId } = request.data
    const userId = request.auth?.uid

    // Authentication check
    if (!userId) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Kullanıcı girişi gerekli'
      )
    }

    // Authorization check
    const member = await getMember(groupId, userId)
    if (!member || member.status !== 'Active') {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Bu gruba erişim yetkiniz yok'
      )
    }

    const db = getFirestore()

    // 1. Tüm aktif üyeleri al
    const membersSnapshot = await db
      .collection('groups')
      .doc(groupId)
      .collection('members')
      .where('status', '==', 'Active')
      .get()

    const members = membersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    // 2. Tüm harcamaları al
    const expensesSnapshot = await db
      .collection('groups')
      .doc(groupId)
      .collection('expenses')
      .where('status', '==', 'Active')
      .get()

    const expenses = expensesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    // 3. Her üye için bakiye hesapla
    const balances: Record<string, MemberBalance> = {}

    members.forEach(member => {
      balances[member.id] = {
        memberId: member.id,
        userId: member.userId,
        name: member.name || 'Unknown',
        netBalance: 0,
        totalPaid: 0,
        totalOwed: 0
      }
    })

    // 4. Her harcama için payları hesapla
    for (const expense of expenses) {
      // Ödeyen kişiye +amount
      if (balances[expense.payerId]) {
        balances[expense.payerId].totalPaid += expense.baseCurrencyAmount
      }

      // Paylaşanları al
      const sharesSnapshot = await db
        .collection('groups')
        .doc(groupId)
        .collection('expenses')
        .doc(expense.id)
        .collection('shares')
        .get()

      const shares = sharesSnapshot.docs.map(doc => doc.data())

      // Her paylaşan için -calculatedAmount
      shares.forEach(share => {
        if (balances[share.memberId]) {
          balances[share.memberId].totalOwed += share.calculatedAmount
        }
      })
    }

    // 5. Net bakiyeleri hesapla
    Object.values(balances).forEach(balance => {
      balance.netBalance = balance.totalPaid - balance.totalOwed
    })

    // 6. Validation: Toplam net bakiye sıfır olmalı
    const totalNetBalance = Object.values(balances).reduce(
      (sum, b) => sum + b.netBalance,
      0
    )

    if (Math.abs(totalNetBalance) > 1) { // 1 kuruş tolerans
      functions.logger.error('Balance validation failed', {
        groupId,
        totalNetBalance,
        balances
      })
      throw new functions.https.HttpsError(
        'internal',
        'Bakiye hesaplama hatası'
      )
    }

    // 7. Sonuçları Firestore'a kaydet (cache)
    const batch = db.batch()

    Object.values(balances).forEach(balance => {
      const memberRef = db
        .collection('groups')
        .doc(groupId)
        .collection('members')
        .doc(balance.memberId)

      batch.update(memberRef, {
        netBalance: balance.netBalance,
        totalPaid: balance.totalPaid,
        totalOwed: balance.totalOwed,
        balanceUpdatedAt: admin.firestore.FieldValue.serverTimestamp()
      })
    })

    await batch.commit()

    // 8. Response döndür
    return {
      balances: Object.values(balances),
      totalExpenses: expenses.length,
      totalAmount: expenses.reduce(
        (sum, e) => sum + e.baseCurrencyAmount,
        0
      ),
      lastUpdated: new Date()
    }
  }
)
```

**Error Handling:**
```typescript
try {
  const result = await calculateGroupBalances({ groupId: 'group_123' })
} catch (error) {
  if (error.code === 'unauthenticated') {
    // Kullanıcı girişi gerekli
  } else if (error.code === 'permission-denied') {
    // Yetki yok
  } else if (error.code === 'internal') {
    // Sunucu hatası
  }
}
```

---

### 2.2 simplifyDebts

**Amaç:** Minimum transferle borçları sadeleştirir (greedy algoritma).

**Input:**
```typescript
interface SimplifyDebtsRequest {
  groupId: string
  minimumAmount?: number  // Minimum transfer tutarı (default: 1.00)
}
```

**Output:**
```typescript
interface SimplifyDebtsResponse {
  settlements: Settlement[]
  totalTransfers: number
  totalAmount: number
}

interface Settlement {
  fromMemberId: string
  fromMemberName: string
  toMemberId: string
  toMemberName: string
  amount: number
  currency: string
}
```

**Implementation:**
```typescript
export const simplifyDebts = functions.https.onCall(async (request) => {
  const { groupId, minimumAmount = 100 } = request.data // 1.00 TL (kuruş cinsinden)
  const userId = request.auth?.uid

  // Auth check
  if (!userId) {
    throw new functions.https.HttpsError('unauthenticated', 'Giriş gerekli')
  }

  const db = getFirestore()

  // 1. Bakiyeleri al
  const membersSnapshot = await db
    .collection('groups')
    .doc(groupId)
    .collection('members')
    .where('status', '==', 'Active')
    .get()

  const balances = membersSnapshot.docs.map(doc => ({
    memberId: doc.id,
    name: doc.data().name || 'Unknown',
    balance: doc.data().netBalance || 0
  }))

  // 2. Alacaklılar ve borçluları ayır
  const creditors = balances
    .filter(b => b.balance > minimumAmount)
    .sort((a, b) => b.balance - a.balance)

  const debtors = balances
    .filter(b => b.balance < -minimumAmount)
    .map(b => ({ ...b, balance: -b.balance }))
    .sort((a, b) => b.balance - a.balance)

  // 3. Greedy matching
  const settlements: Settlement[] = []

  let i = 0,
    j = 0

  while (i < creditors.length && j < debtors.length) {
    const creditor = creditors[i]
    const debtor = debtors[j]

    const amount = Math.min(creditor.balance, debtor.balance)

    settlements.push({
      fromMemberId: debtor.memberId,
      fromMemberName: debtor.name,
      toMemberId: creditor.memberId,
      toMemberName: creditor.name,
      amount,
      currency: 'TRY' // Grup para birimi
    })

    creditor.balance -= amount
    debtor.balance -= amount

    if (creditor.balance <= minimumAmount) i++
    if (debtor.balance <= minimumAmount) j++
  }

  // 4. Response
  return {
    settlements,
    totalTransfers: settlements.length,
    totalAmount: settlements.reduce((sum, s) => sum + s.amount, 0)
  }
})
```

---

### 2.3 generateReport

**Amaç:** Grup için PDF veya CSV rapor oluşturur.

**Input:**
```typescript
interface GenerateReportRequest {
  groupId: string
  format: 'pdf' | 'csv'
  startDate?: string  // ISO 8601
  endDate?: string
  includeSettlements?: boolean
}
```

**Output:**
```typescript
interface GenerateReportResponse {
  downloadUrl: string
  expiresAt: Timestamp
  format: string
  size: number
}
```

**Implementation:**
```typescript
import { generatePDF, generateCSV } from '../utils/reportGenerator'

export const generateReport = functions.https.onCall(async (request) => {
  const { groupId, format, startDate, endDate, includeSettlements } = request.data

  // ... auth & permission checks ...

  const db = getFirestore()

  // 1. Grup bilgilerini al
  const groupDoc = await db.collection('groups').doc(groupId).get()
  const group = groupDoc.data()

  // 2. Harcamaları al (tarih filtreleme)
  let query = db
    .collection('groups')
    .doc(groupId)
    .collection('expenses')
    .where('status', '==', 'Active')

  if (startDate) {
    query = query.where('date', '>=', new Date(startDate))
  }
  if (endDate) {
    query = query.where('date', '<=', new Date(endDate))
  }

  const expensesSnapshot = await query.get()
  const expenses = expensesSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))

  // 3. Settlement'ları al
  let settlements = []
  if (includeSettlements) {
    const settlementsSnapshot = await db
      .collection('groups')
      .doc(groupId)
      .collection('settlements')
      .get()

    settlements = settlementsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  }

  // 4. Bakiyeleri hesapla
  const balances = await calculateGroupBalances({ data: { groupId } })

  // 5. Rapor oluştur
  let fileBuffer: Buffer
  let fileName: string

  if (format === 'pdf') {
    fileBuffer = await generatePDF({
      group,
      expenses,
      settlements,
      balances: balances.balances
    })
    fileName = `bolbolode-${groupId}-${Date.now()}.pdf`
  } else {
    fileBuffer = await generateCSV({
      expenses,
      settlements
    })
    fileName = `bolbolode-${groupId}-${Date.now()}.csv`
  }

  // 6. Firebase Storage'a yükle
  const bucket = admin.storage().bucket()
  const file = bucket.file(`reports/${fileName}`)

  await file.save(fileBuffer, {
    metadata: {
      contentType: format === 'pdf' ? 'application/pdf' : 'text/csv',
      metadata: {
        groupId,
        generatedBy: request.auth?.uid,
        generatedAt: new Date().toISOString()
      }
    }
  })

  // 7. Signed URL oluştur (7 gün geçerli)
  const [downloadUrl] = await file.getSignedUrl({
    action: 'read',
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000
  })

  return {
    downloadUrl,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    format,
    size: fileBuffer.length
  }
})
```

---

## 3. Firestore Triggers

### 3.1 onExpenseCreated

**Trigger:** Yeni harcama eklendiğinde

**Actions:**
1. Grup istatistiklerini güncelle (totalExpenses, totalAmount)
2. Bakiyeleri yeniden hesapla
3. Activity log ekle
4. İlgili üyelere bildirim gönder

**Implementation:**
```typescript
export const onExpenseCreated = functions.firestore
  .document('groups/{groupId}/expenses/{expenseId}')
  .onCreate(async (snapshot, context) => {
    const { groupId, expenseId } = context.params
    const expense = snapshot.data()

    const db = getFirestore()

    // 1. Grup istatistiklerini güncelle
    const groupRef = db.collection('groups').doc(groupId)
    await groupRef.update({
      totalExpenses: admin.firestore.FieldValue.increment(1),
      totalAmount: admin.firestore.FieldValue.increment(
        expense.baseCurrencyAmount
      ),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    })

    // 2. Bakiyeleri yeniden hesapla
    await calculateGroupBalances({ data: { groupId } })

    // 3. Activity log
    await db.collection('activityLogs').add({
      groupId,
      type: 'ExpenseCreated',
      actorId: expense.createdBy,
      targetType: 'Expense',
      targetId: expenseId,
      payload: {
        title: expense.title,
        amount: expense.amount,
        currency: expense.currency
      },
      metadata: {
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    })

    // 4. Bildirim gönder (paylaşanlara)
    const participantIds = expense.participantIds.filter(
      id => id !== expense.payerId
    )

    await sendNotifications(participantIds, {
      title: 'Yeni Harcama',
      body: `${expense.title}: ${formatCurrency(expense.amount, expense.currency)}`,
      data: {
        type: 'EXPENSE_CREATED',
        groupId,
        expenseId
      }
    })
  })
```

### 3.2 onExpenseUpdated

**Trigger:** Harcama güncellendiğinde

```typescript
export const onExpenseUpdated = functions.firestore
  .document('groups/{groupId}/expenses/{expenseId}')
  .onUpdate(async (change, context) => {
    const { groupId, expenseId } = context.params
    const before = change.before.data()
    const after = change.after.data()

    // Eğer soft delete ise, onExpenseDeleted gibi davran
    if (!before.deletedAt && after.deletedAt) {
      return handleExpenseDeleted(groupId, expenseId, after)
    }

    const db = getFirestore()

    // 1. Tutar değiştiyse grup toplamını güncelle
    if (before.baseCurrencyAmount !== after.baseCurrencyAmount) {
      const diff = after.baseCurrencyAmount - before.baseCurrencyAmount

      await db
        .collection('groups')
        .doc(groupId)
        .update({
          totalAmount: admin.firestore.FieldValue.increment(diff),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        })
    }

    // 2. Bakiyeleri yeniden hesapla
    await calculateGroupBalances({ data: { groupId } })

    // 3. Activity log
    await db.collection('activityLogs').add({
      groupId,
      type: 'ExpenseUpdated',
      actorId: after.updatedBy,
      targetType: 'Expense',
      targetId: expenseId,
      payload: {
        changes: getChanges(before, after)
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    })

    // 4. Bildirim (önemli değişiklikler için)
    if (
      before.amount !== after.amount ||
      before.participantIds.length !== after.participantIds.length
    ) {
      await sendNotifications(after.participantIds, {
        title: 'Harcama Güncellendi',
        body: `${after.title} harcaması düzenlendi`,
        data: {
          type: 'EXPENSE_UPDATED',
          groupId,
          expenseId
        }
      })
    }
  })
```

### 3.3 onSettlementCreated

**Trigger:** Ödeme kaydedildiğinde

```typescript
export const onSettlementCreated = functions.firestore
  .document('groups/{groupId}/settlements/{settlementId}')
  .onCreate(async (snapshot, context) => {
    const { groupId, settlementId } = context.params
    const settlement = snapshot.data()

    const db = getFirestore()

    // 1. Bakiyeleri güncelle (settlement tutarını uygula)
    const batch = db.batch()

    // From member (borçlu) → balance artır (borç azaldı)
    const fromRef = db
      .collection('groups')
      .doc(groupId)
      .collection('members')
      .doc(settlement.fromMemberId)

    batch.update(fromRef, {
      netBalance: admin.firestore.FieldValue.increment(settlement.amount)
    })

    // To member (alacaklı) → balance azalt (alacak azaldı)
    const toRef = db
      .collection('groups')
      .doc(groupId)
      .collection('members')
      .doc(settlement.toMemberId)

    batch.update(toRef, {
      netBalance: admin.firestore.FieldValue.increment(-settlement.amount)
    })

    await batch.commit()

    // 2. Activity log
    await db.collection('activityLogs').add({
      groupId,
      type: 'SettlementCreated',
      actorId: settlement.createdBy,
      targetType: 'Settlement',
      targetId: settlementId,
      payload: {
        amount: settlement.amount,
        currency: settlement.currency,
        from: settlement.fromMemberId,
        to: settlement.toMemberId
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    })

    // 3. Alacaklıya bildirim gönder
    const toMember = await db
      .collection('groups')
      .doc(groupId)
      .collection('members')
      .doc(settlement.toMemberId)
      .get()

    await sendNotification(toMember.data().userId, {
      title: 'Ödeme Alındı',
      body: `${formatCurrency(settlement.amount, settlement.currency)} ödeme aldınız`,
      data: {
        type: 'SETTLEMENT_RECEIVED',
        groupId,
        settlementId
      }
    })
  })
```

---

## 4. Scheduled Functions

### 4.1 updateExchangeRates

**Schedule:** Her gün 06:00 UTC

**Implementation:**
```typescript
import fetch from 'node-fetch'

export const updateExchangeRates = functions.scheduler
  .schedule('0 6 * * *')
  .timeZone('UTC')
  .onRun(async (context) => {
    const API_KEY = functions.config().exchangerate.key
    const BASE_URL = 'https://api.exchangerate-api.com/v4/latest'

    const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CHF']
    const baseCurrency = 'TRY'

    const db = getFirestore()

    for (const currency of currencies) {
      try {
        // API'den kur çek
        const response = await fetch(`${BASE_URL}/${currency}`)
        const data = await response.json()

        const rate = data.rates[baseCurrency]

        if (!rate) {
          functions.logger.warn(`Rate not found for ${currency}-${baseCurrency}`)
          continue
        }

        // Firestore'a kaydet
        const rateId = `${currency}-${baseCurrency}-${new Date().toISOString().split('T')[0]}`

        await db.collection('exchangeRates').doc(rateId).set({
          id: rateId,
          from: currency,
          to: baseCurrency,
          rate,
          date: admin.firestore.FieldValue.serverTimestamp(),
          source: 'exchangerate-api.com',
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        })

        functions.logger.info(`Updated rate: ${currency}-${baseCurrency} = ${rate}`)
      } catch (error) {
        functions.logger.error(`Failed to update rate for ${currency}`, error)
      }
    }
  })
```

### 4.2 cleanupOldData

**Schedule:** Her gün 02:00 UTC

**Implementation:**
```typescript
export const cleanupOldData = functions.scheduler
  .schedule('0 2 * * *')
  .timeZone('UTC')
  .onRun(async (context) => {
    const db = getFirestore()
    const now = admin.firestore.Timestamp.now()
    const thirtyDaysAgo = new Date(now.toMillis() - 30 * 24 * 60 * 60 * 1000)

    // 1. Soft delete edilmiş expense'leri hard delete et (30 gün geçmiş)
    const expensesSnapshot = await db
      .collectionGroup('expenses')
      .where('deletedAt', '<=', thirtyDaysAgo)
      .get()

    const batch = db.batch()
    expensesSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref)
    })

    await batch.commit()
    functions.logger.info(`Deleted ${expensesSnapshot.size} old expenses`)

    // 2. Süresi dolmuş invite token'ları temizle
    const invitesSnapshot = await db
      .collectionGroup('invites')
      .where('expiresAt', '<=', now)
      .where('status', '==', 'Active')
      .get()

    const inviteBatch = db.batch()
    invitesSnapshot.docs.forEach(doc => {
      inviteBatch.update(doc.ref, { status: 'Expired' })
    })

    await inviteBatch.commit()
    functions.logger.info(`Expired ${invitesSnapshot.size} invite tokens`)

    // 3. Eski activity log'ları sil (90 gün)
    const ninetyDaysAgo = new Date(now.toMillis() - 90 * 24 * 60 * 60 * 1000)

    const logsSnapshot = await db
      .collection('activityLogs')
      .where('createdAt', '<=', ninetyDaysAgo)
      .limit(500)
      .get()

    const logBatch = db.batch()
    logsSnapshot.docs.forEach(doc => {
      logBatch.delete(doc.ref)
    })

    await logBatch.commit()
    functions.logger.info(`Deleted ${logsSnapshot.size} old activity logs`)
  })
```

---

## 5. Auth Triggers

### 5.1 onUserCreated

**Trigger:** Yeni kullanıcı oluşturulduğunda

```typescript
export const onUserCreated = functions.auth.user().onCreate(async (user) => {
  const db = getFirestore()

  // User dokümanı oluştur
  await db.collection('users').doc(user.uid).set({
    id: user.uid,
    email: user.email,
    name: user.displayName || '',
    avatar: user.photoURL || null,
    preferredCurrency: 'TRY',
    locale: 'tr',
    notificationPreferences: {
      push: true,
      email: true,
      types: {
        newExpense: true,
        expenseEdited: true,
        settlement: true,
        groupInvite: true,
        balanceChanged: false
      },
      quietHours: {
        enabled: false,
        start: '22:00',
        end: '08:00'
      }
    },
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  })

  functions.logger.info(`User created: ${user.uid}`)

  // Hoş geldin e-postası gönder (opsiyonel)
  if (user.email) {
    await sendWelcomeEmail(user.email, user.displayName)
  }
})
```

### 5.2 onUserDeleted

**Trigger:** Kullanıcı silindiğinde

```typescript
export const onUserDeleted = functions.auth.user().onDelete(async (user) => {
  const db = getFirestore()

  // User dokümanını anonymize et (hard delete yerine)
  await db
    .collection('users')
    .doc(user.uid)
    .update({
      email: `deleted_${user.uid}@anonymous.local`,
      name: 'Deleted User',
      avatar: null,
      deletedAt: admin.firestore.FieldValue.serverTimestamp()
    })

  // Kullanıcının grup üyeliklerini güncelle
  const memberSnapshot = await db
    .collectionGroup('members')
    .where('userId', '==', user.uid)
    .get()

  const batch = db.batch()
  memberSnapshot.docs.forEach(doc => {
    batch.update(doc.ref, {
      status: 'Left',
      leftAt: admin.firestore.FieldValue.serverTimestamp()
    })
  })

  await batch.commit()

  functions.logger.info(`User deleted and anonymized: ${user.uid}`)
})
```

---

## 6. Deployment

### 6.1 Environment Configuration

**functions/.env.local:**
```bash
EXCHANGERATE_API_KEY=your_api_key_here
SENTRY_DSN=https://...
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@bolbolode.com
SMTP_PASS=your_password
```

**Set Firebase Config:**
```bash
firebase functions:config:set exchangerate.key="your_key"
firebase functions:config:set sentry.dsn="your_dsn"
```

### 6.2 Deployment Commands

```bash
# Local emulator
npm run serve

# Deploy all functions
firebase deploy --only functions

# Deploy specific function
firebase deploy --only functions:calculateGroupBalances

# Production deployment
firebase use production
firebase deploy --only functions
```

### 6.3 Monitoring

**View Logs:**
```bash
firebase functions:log

# Tail logs
firebase functions:log --only calculateGroupBalances
```

**Metrics:**
- Firebase Console → Functions → Usage
- Invocations, errors, execution time
- Set up alerts for errors

---

**Versiyon:** 1.0  
**Hazırlayan:** BölBölÖde Ekibi  
**Son Güncelleme:** 27 Ekim 2025

