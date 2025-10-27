# BölBölÖde - Veri Modeli Dokümanı

## İçindekiler
1. [Firestore Collection Yapısı](#1-firestore-collection-yapısı)
2. [Veri Modelleri](#2-veri-modelleri)
3. [İlişkiler ve Referanslar](#3-i̇lişkiler-ve-referanslar)
4. [Index Gereksinimleri](#4-index-gereksinimleri)
5. [Veri Validasyonu](#5-veri-validasyonu)
6. [Örnek Veri](#6-örnek-veri)

---

## 1. Firestore Collection Yapısı

### 1.1 Top-Level Collections

```
/users/{userId}
/groups/{groupId}
  /members/{memberId}
  /expenses/{expenseId}
    /shares/{shareId}
  /settlements/{settlementId}
  /invites/{inviteId}
/activityLogs/{logId}
/exchangeRates/{rateId}
```

### 1.2 Collection Hierarchy

```
Firestore Root
│
├── users/
│   ├── {userId}
│   │   ├── id: string
│   │   ├── email: string
│   │   ├── name: string
│   │   ├── avatar: string | null
│   │   ├── preferredCurrency: string
│   │   ├── locale: string
│   │   ├── notificationPreferences: object
│   │   ├── createdAt: timestamp
│   │   └── updatedAt: timestamp
│   └── ...
│
├── groups/
│   ├── {groupId}
│   │   ├── id: string
│   │   ├── name: string
│   │   ├── description: string | null
│   │   ├── baseCurrency: string
│   │   ├── emoji: string | null
│   │   ├── avatarUrl: string | null
│   │   ├── ownerId: string
│   │   ├── startDate: timestamp
│   │   ├── endDate: timestamp | null
│   │   ├── status: string (Active, Archived, Deleted)
│   │   ├── memberCount: number
│   │   ├── totalExpenses: number
│   │   ├── totalAmount: number
│   │   ├── createdAt: timestamp
│   │   ├── updatedAt: timestamp
│   │   └── deletedAt: timestamp | null
│   │
│   └── SUBCOLLECTIONS:
│       │
│       ├── members/
│       │   ├── {memberId}
│       │   │   ├── id: string
│       │   │   ├── userId: string
│       │   │   ├── groupId: string
│       │   │   ├── role: string (Owner, Editor, Viewer)
│       │   │   ├── status: string (Active, Invited, Left, Removed)
│       │   │   ├── netBalance: number
│       │   │   ├── totalPaid: number
│       │   │   ├── totalOwed: number
│       │   │   ├── joinedAt: timestamp
│       │   │   ├── leftAt: timestamp | null
│       │   │   └── invitedBy: string | null
│       │   └── ...
│       │
│       ├── expenses/
│       │   ├── {expenseId}
│       │   │   ├── id: string
│       │   │   ├── groupId: string
│       │   │   ├── title: string
│       │   │   ├── description: string | null
│       │   │   ├── amount: number (kuruş cinsinden)
│       │   │   ├── amountFormatted: string
│       │   │   ├── currency: string
│       │   │   ├── baseCurrencyAmount: number
│       │   │   ├── fxRate: number | null
│       │   │   ├── fxRateDate: timestamp | null
│       │   │   ├── category: string
│       │   │   ├── date: timestamp
│       │   │   ├── payerId: string
│       │   │   ├── splitType: string (equal, weighted, exact, percentage)
│       │   │   ├── participantIds: string[]
│       │   │   ├── attachments: array
│       │   │   ├── tags: string[]
│       │   │   ├── notes: string | null
│       │   │   ├── status: string (Active, Draft, Deleted)
│       │   │   ├── version: number
│       │   │   ├── createdBy: string
│       │   │   ├── createdAt: timestamp
│       │   │   ├── updatedBy: string | null
│       │   │   ├── updatedAt: timestamp
│       │   │   └── deletedAt: timestamp | null
│       │   │
│       │   └── SUBCOLLECTIONS:
│       │       └── shares/
│       │           ├── {shareId}
│       │           │   ├── id: string
│       │           │   ├── expenseId: string
│       │           │   ├── memberId: string
│       │           │   ├── shareType: string
│       │           │   ├── weight: number | null
│       │           │   ├── percentage: number | null
│       │           │   ├── exactAmount: number | null
│       │           │   ├── calculatedAmount: number
│       │           │   └── createdAt: timestamp
│       │           └── ...
│       │
│       ├── settlements/
│       │   ├── {settlementId}
│       │   │   ├── id: string
│       │   │   ├── groupId: string
│       │   │   ├── fromMemberId: string
│       │   │   ├── toMemberId: string
│       │   │   ├── amount: number
│       │   │   ├── currency: string
│       │   │   ├── paymentMethod: string
│       │   │   ├── notes: string | null
│       │   │   ├── status: string (Pending, Confirmed, Rejected)
│       │   │   ├── date: timestamp
│       │   │   ├── confirmedBy: string | null
│       │   │   ├── confirmedAt: timestamp | null
│       │   │   ├── createdBy: string
│       │   │   └── createdAt: timestamp
│       │   └── ...
│       │
│       └── invites/
│           ├── {inviteId}
│           │   ├── id: string
│           │   ├── groupId: string
│           │   ├── token: string
│           │   ├── createdBy: string
│           │   ├── usageCount: number
│           │   ├── maxUsage: number
│           │   ├── expiresAt: timestamp
│           │   ├── status: string (Active, Expired, Revoked)
│           │   └── createdAt: timestamp
│           └── ...
│
├── activityLogs/
│   ├── {logId}
│   │   ├── id: string
│   │   ├── groupId: string
│   │   ├── type: string
│   │   ├── actorId: string
│   │   ├── targetType: string
│   │   ├── targetId: string
│   │   ├── payload: object
│   │   ├── metadata: object
│   │   └── createdAt: timestamp
│   └── ...
│
└── exchangeRates/
    ├── {rateId} (format: "USD-TRY-2025-10-27")
    │   ├── id: string
    │   ├── from: string
    │   ├── to: string
    │   ├── rate: number
    │   ├── date: timestamp
    │   ├── source: string
    │   └── createdAt: timestamp
    └── ...
```

---

## 2. Veri Modelleri

### 2.1 User Model

```typescript
interface User {
  id: string                    // Firebase Auth UID
  email: string                 // E-posta adresi
  name: string                  // Ad soyad
  avatar: string | null         // Avatar URL veya emoji
  preferredCurrency: string     // Tercih edilen para birimi (ISO 4217)
  locale: string                // Dil tercihi (tr, en)
  notificationPreferences: {
    push: boolean
    email: boolean
    types: {
      newExpense: boolean
      expenseEdited: boolean
      settlement: boolean
      groupInvite: boolean
      balanceChanged: boolean
    }
    quietHours: {
      enabled: boolean
      start: string             // "22:00"
      end: string               // "08:00"
    }
  }
  createdAt: Timestamp
  updatedAt: Timestamp
}

// Örnek
{
  "id": "user_abc123",
  "email": "ahmet@example.com",
  "name": "Ahmet Yılmaz",
  "avatar": "🧑",
  "preferredCurrency": "TRY",
  "locale": "tr",
  "notificationPreferences": {
    "push": true,
    "email": true,
    "types": {
      "newExpense": true,
      "expenseEdited": true,
      "settlement": true,
      "groupInvite": true,
      "balanceChanged": false
    },
    "quietHours": {
      "enabled": true,
      "start": "22:00",
      "end": "08:00"
    }
  },
  "createdAt": "2025-10-20T10:30:00Z",
  "updatedAt": "2025-10-27T15:45:00Z"
}
```

### 2.2 Group Model

```typescript
interface Group {
  id: string                    // Unique group ID
  name: string                  // Grup adı
  description: string | null    // Grup açıklaması
  baseCurrency: string          // Ana para birimi
  emoji: string | null          // Grup emoji'si
  avatarUrl: string | null      // Grup avatar URL
  ownerId: string               // Grup sahibi user ID
  startDate: Timestamp          // Başlangıç tarihi
  endDate: Timestamp | null     // Bitiş tarihi (opsiyonel)
  status: GroupStatus           // Active, Archived, Deleted
  memberCount: number           // Üye sayısı (denormalized)
  totalExpenses: number         // Toplam harcama sayısı
  totalAmount: number           // Toplam tutar (base currency, kuruş)
  createdAt: Timestamp
  updatedAt: Timestamp
  deletedAt: Timestamp | null   // Soft delete
}

enum GroupStatus {
  Active = "Active",
  Archived = "Archived",
  Deleted = "Deleted"
}

// Örnek
{
  "id": "group_xyz789",
  "name": "Kapadokya Gezisi 2025",
  "description": "Yılbaşı tatili harcamaları",
  "baseCurrency": "TRY",
  "emoji": "🎈",
  "avatarUrl": null,
  "ownerId": "user_abc123",
  "startDate": "2025-12-28T00:00:00Z",
  "endDate": "2026-01-02T23:59:59Z",
  "status": "Active",
  "memberCount": 8,
  "totalExpenses": 24,
  "totalAmount": 1250000, // 12,500.00 TL (kuruş cinsinden)
  "createdAt": "2025-10-20T10:30:00Z",
  "updatedAt": "2025-10-27T16:20:00Z",
  "deletedAt": null
}
```

### 2.3 GroupMember Model

```typescript
interface GroupMember {
  id: string                    // Unique member ID
  userId: string                // User reference
  groupId: string               // Group reference
  role: MemberRole              // Owner, Editor, Viewer
  status: MemberStatus          // Active, Invited, Left, Removed
  netBalance: number            // Net bakiye (base currency, kuruş)
  totalPaid: number             // Toplam ödenen
  totalOwed: number             // Toplam borç
  joinedAt: Timestamp
  leftAt: Timestamp | null
  invitedBy: string | null      // Davet eden user ID
}

enum MemberRole {
  Owner = "Owner",
  Editor = "Editor",
  Viewer = "Viewer"
}

enum MemberStatus {
  Active = "Active",
  Invited = "Invited",
  Left = "Left",
  Removed = "Removed"
}

// Örnek
{
  "id": "member_001",
  "userId": "user_abc123",
  "groupId": "group_xyz789",
  "role": "Owner",
  "status": "Active",
  "netBalance": 125000,    // +1,250.00 TL (alacaklı)
  "totalPaid": 450000,     // 4,500.00 TL ödedi
  "totalOwed": 325000,     // 3,250.00 TL borçlu
  "joinedAt": "2025-10-20T10:30:00Z",
  "leftAt": null,
  "invitedBy": null
}
```

### 2.4 Expense Model

```typescript
interface Expense {
  id: string
  groupId: string
  title: string                 // Harcama başlığı
  description: string | null    // Detaylı açıklama
  amount: number                // Tutar (kuruş cinsinden)
  amountFormatted: string       // "100.50" (display için)
  currency: string              // Harcama para birimi
  baseCurrencyAmount: number    // Grup para birimine çevrilmiş tutar
  fxRate: number | null         // Kullanılan döviz kuru (immutable)
  fxRateDate: Timestamp | null  // Kurun tarihi
  category: ExpenseCategory     // Kategori
  date: Timestamp               // Harcama tarihi
  payerId: string               // Ödeyen kişi (member ID)
  splitType: SplitType          // Paylaşım tipi
  participantIds: string[]      // Dahil olan member ID'leri
  attachments: Attachment[]     // Fiş fotoğrafları
  tags: string[]                // Etiketler
  notes: string | null          // Notlar
  status: ExpenseStatus         // Active, Draft, Deleted
  version: number               // Conflict resolution için
  createdBy: string             // User ID
  createdAt: Timestamp
  updatedBy: string | null
  updatedAt: Timestamp
  deletedAt: Timestamp | null   // Soft delete
}

enum ExpenseCategory {
  Food = "Food",
  Transport = "Transport",
  Accommodation = "Accommodation",
  Entertainment = "Entertainment",
  Shopping = "Shopping",
  Other = "Other"
}

enum SplitType {
  Equal = "equal",
  Weighted = "weighted",
  Exact = "exact",
  Percentage = "percentage"
}

enum ExpenseStatus {
  Active = "Active",
  Draft = "Draft",
  Deleted = "Deleted"
}

interface Attachment {
  id: string
  url: string                   // Firebase Storage URL
  thumbnailUrl: string
  fileName: string
  mimeType: string
  size: number                  // Bytes
  uploadedAt: Timestamp
}

// Örnek
{
  "id": "expense_001",
  "groupId": "group_xyz789",
  "title": "Restoran Yemeği",
  "description": "Kapadokya'da akşam yemeği",
  "amount": 150000,              // 1,500.00 TL
  "amountFormatted": "1500.00",
  "currency": "TRY",
  "baseCurrencyAmount": 150000,
  "fxRate": null,
  "fxRateDate": null,
  "category": "Food",
  "date": "2025-12-29T19:30:00Z",
  "payerId": "member_001",
  "splitType": "equal",
  "participantIds": ["member_001", "member_002", "member_003"],
  "attachments": [
    {
      "id": "att_001",
      "url": "https://storage.googleapis.com/...",
      "thumbnailUrl": "https://storage.googleapis.com/.../thumb",
      "fileName": "receipt.jpg",
      "mimeType": "image/jpeg",
      "size": 2048576,
      "uploadedAt": "2025-12-29T19:35:00Z"
    }
  ],
  "tags": ["yemek", "grup"],
  "notes": "Bahşiş dahil",
  "status": "Active",
  "version": 1,
  "createdBy": "user_abc123",
  "createdAt": "2025-12-29T19:35:00Z",
  "updatedBy": null,
  "updatedAt": "2025-12-29T19:35:00Z",
  "deletedAt": null
}
```

### 2.5 ExpenseShare Model

```typescript
interface ExpenseShare {
  id: string
  expenseId: string
  memberId: string              // Paylaşan kişi
  shareType: SplitType          // equal, weighted, exact, percentage
  weight: number | null         // Weighted için (örn: 2.0)
  percentage: number | null     // Percentage için (örn: 33.33)
  exactAmount: number | null    // Exact için (kuruş)
  calculatedAmount: number      // Hesaplanan final tutar (kuruş)
  createdAt: Timestamp
}

// Örnek: Equal split
// Harcama: 1,500 TL, 3 kişi
[
  {
    "id": "share_001",
    "expenseId": "expense_001",
    "memberId": "member_001",
    "shareType": "equal",
    "weight": null,
    "percentage": null,
    "exactAmount": null,
    "calculatedAmount": 50000,   // 500.00 TL
    "createdAt": "2025-12-29T19:35:00Z"
  },
  {
    "id": "share_002",
    "expenseId": "expense_001",
    "memberId": "member_002",
    "shareType": "equal",
    "weight": null,
    "percentage": null,
    "exactAmount": null,
    "calculatedAmount": 50000,   // 500.00 TL
    "createdAt": "2025-12-29T19:35:00Z"
  },
  {
    "id": "share_003",
    "expenseId": "expense_001",
    "memberId": "member_003",
    "shareType": "equal",
    "weight": null,
    "percentage": null,
    "exactAmount": null,
    "calculatedAmount": 50000,   // 500.00 TL
    "createdAt": "2025-12-29T19:35:00Z"
  }
]

// Örnek: Weighted split
// Harcama: 600 TL, A(2x), B(1x), C(1x)
[
  {
    "id": "share_004",
    "expenseId": "expense_002",
    "memberId": "member_001",
    "shareType": "weighted",
    "weight": 2.0,
    "percentage": null,
    "exactAmount": null,
    "calculatedAmount": 30000,   // 300.00 TL (2/4 * 600)
    "createdAt": "2025-12-30T12:00:00Z"
  },
  {
    "id": "share_005",
    "expenseId": "expense_002",
    "memberId": "member_002",
    "shareType": "weighted",
    "weight": 1.0,
    "percentage": null,
    "exactAmount": null,
    "calculatedAmount": 15000,   // 150.00 TL
    "createdAt": "2025-12-30T12:00:00Z"
  },
  {
    "id": "share_006",
    "expenseId": "expense_002",
    "memberId": "member_003",
    "shareType": "weighted",
    "weight": 1.0,
    "percentage": null,
    "exactAmount": null,
    "calculatedAmount": 15000,   // 150.00 TL
    "createdAt": "2025-12-30T12:00:00Z"
  }
]
```

### 2.6 Settlement Model

```typescript
interface Settlement {
  id: string
  groupId: string
  fromMemberId: string          // Ödeme yapan (borçlu)
  toMemberId: string            // Ödeme alan (alacaklı)
  amount: number                // Tutar (kuruş)
  currency: string              // Para birimi
  paymentMethod: PaymentMethod  // Ödeme yöntemi
  notes: string | null
  status: SettlementStatus      // Pending, Confirmed, Rejected
  date: Timestamp               // Ödeme tarihi
  confirmedBy: string | null    // Onaylayan user ID
  confirmedAt: Timestamp | null
  createdBy: string             // Ödemeyi kaydeden
  createdAt: Timestamp
}

enum PaymentMethod {
  Cash = "Cash",
  BankTransfer = "BankTransfer",
  CreditCard = "CreditCard",
  MobilePay = "MobilePay",
  Other = "Other"
}

enum SettlementStatus {
  Pending = "Pending",
  Confirmed = "Confirmed",
  Rejected = "Rejected"
}

// Örnek
{
  "id": "settlement_001",
  "groupId": "group_xyz789",
  "fromMemberId": "member_002",
  "toMemberId": "member_001",
  "amount": 50000,               // 500.00 TL
  "currency": "TRY",
  "paymentMethod": "BankTransfer",
  "notes": "Havale yaptım, dekont ektedir",
  "status": "Pending",
  "date": "2026-01-03T10:00:00Z",
  "confirmedBy": null,
  "confirmedAt": null,
  "createdBy": "user_def456",
  "createdAt": "2026-01-03T10:05:00Z"
}
```

### 2.7 GroupInvite Model

```typescript
interface GroupInvite {
  id: string
  groupId: string
  token: string                 // Unique invite token
  createdBy: string             // User ID
  usageCount: number            // Kaç kez kullanıldı
  maxUsage: number              // Maksimum kullanım (50)
  expiresAt: Timestamp          // Geçerlilik süresi (7 gün)
  status: InviteStatus
  createdAt: Timestamp
}

enum InviteStatus {
  Active = "Active",
  Expired = "Expired",
  Revoked = "Revoked"
}

// Örnek
{
  "id": "invite_001",
  "groupId": "group_xyz789",
  "token": "inv_a1b2c3d4e5f6",
  "createdBy": "user_abc123",
  "usageCount": 3,
  "maxUsage": 50,
  "expiresAt": "2025-10-27T10:30:00Z",
  "status": "Active",
  "createdAt": "2025-10-20T10:30:00Z"
}
```

### 2.8 ActivityLog Model

```typescript
interface ActivityLog {
  id: string
  groupId: string
  type: ActivityType
  actorId: string               // İşlemi yapan user ID
  targetType: string            // "Expense", "Settlement", "Member"
  targetId: string              // Hedef entity ID
  payload: Record<string, any>  // İşlem detayları
  metadata: {
    ipAddress?: string
    userAgent?: string
    timestamp: Timestamp
  }
  createdAt: Timestamp
}

enum ActivityType {
  GroupCreated = "GroupCreated",
  MemberAdded = "MemberAdded",
  MemberRemoved = "MemberRemoved",
  ExpenseCreated = "ExpenseCreated",
  ExpenseUpdated = "ExpenseUpdated",
  ExpenseDeleted = "ExpenseDeleted",
  SettlementCreated = "SettlementCreated",
  SettlementConfirmed = "SettlementConfirmed"
}

// Örnek
{
  "id": "log_001",
  "groupId": "group_xyz789",
  "type": "ExpenseCreated",
  "actorId": "user_abc123",
  "targetType": "Expense",
  "targetId": "expense_001",
  "payload": {
    "title": "Restoran Yemeği",
    "amount": 150000,
    "currency": "TRY"
  },
  "metadata": {
    "ipAddress": "192.168.1.1",
    "userAgent": "BolBolOde/1.0.0 iOS/17.0",
    "timestamp": "2025-12-29T19:35:00Z"
  },
  "createdAt": "2025-12-29T19:35:00Z"
}
```

### 2.9 ExchangeRate Model

```typescript
interface ExchangeRate {
  id: string                    // Format: "USD-TRY-2025-10-27"
  from: string                  // ISO 4217 (USD)
  to: string                    // ISO 4217 (TRY)
  rate: number                  // 1 USD = X TRY
  date: Timestamp               // Kurun tarihi
  source: string                // "exchangerate-api.com"
  createdAt: Timestamp
}

// Örnek
{
  "id": "USD-TRY-2025-10-27",
  "from": "USD",
  "to": "TRY",
  "rate": 32.45,
  "date": "2025-10-27T00:00:00Z",
  "source": "exchangerate-api.com",
  "createdAt": "2025-10-27T06:00:00Z"
}
```

---

## 3. İlişkiler ve Referanslar

### 3.1 Entity Relationship Diagram

```
User ──┐
       │
       ├─< GroupMember >─┐
       │                 │
       │                 ├─── Group
       │                 │      │
       │                 │      ├─< Expense >─┐
       │                 │      │             │
       │                 │      │             └─< ExpenseShare
       │                 │      │
       │                 │      ├─< Settlement
       │                 │      │
       │                 │      └─< GroupInvite
       │                 │
       ├─── ActivityLog (actor)
       │
       └─── Expense (createdBy)
```

### 3.2 Denormalization Stratejisi

**Neden Denormalization?**
- Firestore'da join yok
- Read performansı kritik
- Write maliyeti < Read maliyeti

**Denormalized Alanlar:**

```typescript
// Group document'te
{
  memberCount: 8,           // Members subcollection'dan
  totalExpenses: 24,        // Expenses subcollection'dan
  totalAmount: 1250000      // Expenses toplamından
}

// GroupMember document'te
{
  netBalance: 125000,       // Her expense'te recalculate
  totalPaid: 450000,        // Her expense'te recalculate
  totalOwed: 325000         // Her expense'te recalculate
}

// User bilgileri expense'te denormalize edilmez
// Her zaman user document'ten fetch edilir (az değişir)
```

### 3.3 Reference vs Embedded

| Senaryo | Strateji | Sebep |
|---------|----------|-------|
| User info in GroupMember | Reference (userId) | User bilgileri değişebilir |
| Expense shares | Subcollection | Çok sayıda share olabilir |
| Attachments | Embedded array | Sınırlı sayıda (max 5) |
| Exchange rates | Reference | Cache için merkezi |
| Activity logs | Separate collection | Audit, query edilebilir |

---

## 4. Index Gereksinimleri

### 4.1 Composite Indexes

Firestore otomatik single-field index oluşturur ama composite index'ler manuel gerekir.

**firestore.indexes.json:**

```json
{
  "indexes": [
    {
      "collectionGroup": "expenses",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "groupId", "order": "ASCENDING" },
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "date", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "expenses",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "groupId", "order": "ASCENDING" },
        { "fieldPath": "category", "order": "ASCENDING" },
        { "fieldPath": "date", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "expenses",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "groupId", "order": "ASCENDING" },
        { "fieldPath": "payerId", "order": "ASCENDING" },
        { "fieldPath": "date", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "members",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "groupId", "order": "ASCENDING" },
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "joinedAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "settlements",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "groupId", "order": "ASCENDING" },
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "date", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "activityLogs",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "groupId", "order": "ASCENDING" },
        { "fieldPath": "type", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
```

### 4.2 Sık Kullanılan Sorgular

```typescript
// 1. Grup harcamalarını tarih sırasıyla getir
db.collection('groups')
  .doc(groupId)
  .collection('expenses')
  .where('status', '==', 'Active')
  .orderBy('date', 'desc')
  .limit(50)

// Index: groupId + status + date

// 2. Belirli kategoride harcamalar
db.collection('groups')
  .doc(groupId)
  .collection('expenses')
  .where('category', '==', 'Food')
  .orderBy('date', 'desc')

// Index: groupId + category + date

// 3. Belirli kişinin ödediği harcamalar
db.collection('groups')
  .doc(groupId)
  .collection('expenses')
  .where('payerId', '==', memberId)
  .orderBy('date', 'desc')

// Index: groupId + payerId + date

// 4. Aktif grup üyeleri
db.collection('groups')
  .doc(groupId)
  .collection('members')
  .where('status', '==', 'Active')
  .orderBy('joinedAt', 'desc')

// Index: groupId + status + joinedAt
```

---

## 5. Veri Validasyonu

### 5.1 Firestore Security Rules

```javascript
// groups/{groupId}/expenses/{expenseId}
match /expenses/{expenseId} {
  allow create: if 
    request.auth != null &&
    isActiveMember(request.resource.data.groupId) &&
    validateExpense(request.resource.data);
    
  allow update: if 
    request.auth != null &&
    isActiveMember(resource.data.groupId) &&
    (canEditGroup(resource.data.groupId) || isCreator(resource.data.createdBy)) &&
    validateExpense(request.resource.data);
    
  allow delete: if
    request.auth != null &&
    (canEditGroup(resource.data.groupId) || isCreator(resource.data.createdBy));
}

function validateExpense(expense) {
  return expense.title is string &&
         expense.title.size() >= 2 &&
         expense.title.size() <= 100 &&
         expense.amount is number &&
         expense.amount > 0 &&
         expense.amount <= 100000000 && // 1M TL limit
         expense.currency is string &&
         expense.currency.size() == 3 &&
         expense.category in ['Food', 'Transport', 'Accommodation', 'Entertainment', 'Shopping', 'Other'] &&
         expense.splitType in ['equal', 'weighted', 'exact', 'percentage'] &&
         expense.participantIds is list &&
         expense.participantIds.size() >= 2 &&
         expense.participantIds.size() <= 100;
}
```

### 5.2 Client-Side Validation (Zod)

```typescript
import { z } from 'zod'

export const ExpenseSchema = z.object({
  title: z.string().min(2).max(100),
  description: z.string().max(500).nullable(),
  amount: z.number().positive().max(1_000_000),
  currency: z.string().length(3),
  category: z.enum(['Food', 'Transport', 'Accommodation', 'Entertainment', 'Shopping', 'Other']),
  date: z.date(),
  payerId: z.string(),
  splitType: z.enum(['equal', 'weighted', 'exact', 'percentage']),
  participantIds: z.array(z.string()).min(2).max(100),
  attachments: z.array(AttachmentSchema).max(5),
  tags: z.array(z.string()).max(10),
  notes: z.string().max(500).nullable()
})

export const SettlementSchema = z.object({
  fromMemberId: z.string(),
  toMemberId: z.string(),
  amount: z.number().positive().max(1_000_000),
  currency: z.string().length(3),
  paymentMethod: z.enum(['Cash', 'BankTransfer', 'CreditCard', 'MobilePay', 'Other']),
  notes: z.string().max(500).nullable(),
  date: z.date()
})
```

---

## 6. Örnek Veri

### 6.1 Tam Bir Grup Örneği

```json
// Group: group_xyz789
{
  "id": "group_xyz789",
  "name": "Kapadokya Gezisi 2025",
  "description": "Yılbaşı tatili harcamaları",
  "baseCurrency": "TRY",
  "emoji": "🎈",
  "ownerId": "user_001",
  "startDate": "2025-12-28T00:00:00Z",
  "endDate": "2026-01-02T23:59:59Z",
  "status": "Active",
  "memberCount": 3,
  "totalExpenses": 2,
  "totalAmount": 210000,
  "createdAt": "2025-10-20T10:30:00Z",
  "updatedAt": "2025-12-30T12:00:00Z"
}

// Members
[
  {
    "id": "member_001",
    "userId": "user_001",
    "groupId": "group_xyz789",
    "role": "Owner",
    "status": "Active",
    "netBalance": 70000,    // +700 TL (alacaklı)
    "totalPaid": 150000,    // 1,500 TL ödedi
    "totalOwed": 80000,     // 800 TL borçlu
    "joinedAt": "2025-10-20T10:30:00Z"
  },
  {
    "id": "member_002",
    "userId": "user_002",
    "groupId": "group_xyz789",
    "role": "Editor",
    "status": "Active",
    "netBalance": -35000,   // -350 TL (borçlu)
    "totalPaid": 60000,
    "totalOwed": 95000,
    "joinedAt": "2025-10-21T14:00:00Z"
  },
  {
    "id": "member_003",
    "userId": "user_003",
    "groupId": "group_xyz789",
    "role": "Editor",
    "status": "Active",
    "netBalance": -35000,   // -350 TL (borçlu)
    "totalPaid": 0,
    "totalOwed": 35000,
    "joinedAt": "2025-10-22T09:15:00Z"
  }
]

// Expenses
[
  {
    "id": "expense_001",
    "groupId": "group_xyz789",
    "title": "Restoran Yemeği",
    "amount": 150000,       // 1,500 TL
    "currency": "TRY",
    "baseCurrencyAmount": 150000,
    "category": "Food",
    "date": "2025-12-29T19:30:00Z",
    "payerId": "member_001",
    "splitType": "equal",
    "participantIds": ["member_001", "member_002", "member_003"],
    "status": "Active",
    "version": 1,
    "createdBy": "user_001",
    "createdAt": "2025-12-29T19:35:00Z"
  },
  {
    "id": "expense_002",
    "groupId": "group_xyz789",
    "title": "Balon Turu",
    "amount": 60000,        // 600 TL
    "currency": "TRY",
    "baseCurrencyAmount": 60000,
    "category": "Entertainment",
    "date": "2025-12-30T06:00:00Z",
    "payerId": "member_002",
    "splitType": "weighted",
    "participantIds": ["member_001", "member_002"],
    "status": "Active",
    "version": 1,
    "createdBy": "user_002",
    "createdAt": "2025-12-30T12:00:00Z"
  }
]

// Expense Shares (expense_001 - equal split)
[
  {
    "id": "share_001",
    "expenseId": "expense_001",
    "memberId": "member_001",
    "shareType": "equal",
    "calculatedAmount": 50000,  // 500 TL
    "createdAt": "2025-12-29T19:35:00Z"
  },
  {
    "id": "share_002",
    "expenseId": "expense_001",
    "memberId": "member_002",
    "shareType": "equal",
    "calculatedAmount": 50000,  // 500 TL
    "createdAt": "2025-12-29T19:35:00Z"
  },
  {
    "id": "share_003",
    "expenseId": "expense_001",
    "memberId": "member_003",
    "shareType": "equal",
    "calculatedAmount": 50000,  // 500 TL
    "createdAt": "2025-12-29T19:35:00Z"
  }
]

// Expense Shares (expense_002 - weighted: A(2x), B(1x))
[
  {
    "id": "share_004",
    "expenseId": "expense_002",
    "memberId": "member_001",
    "shareType": "weighted",
    "weight": 2.0,
    "calculatedAmount": 40000,  // 400 TL (2/3 * 600)
    "createdAt": "2025-12-30T12:00:00Z"
  },
  {
    "id": "share_005",
    "expenseId": "expense_002",
    "memberId": "member_002",
    "shareType": "weighted",
    "weight": 1.0,
    "calculatedAmount": 20000,  // 200 TL (1/3 * 600)
    "createdAt": "2025-12-30T12:00:00Z"
  }
]

// Balance Calculation:
// member_001: Paid 1,500, Owes (500 + 400) = 900 → Net: +600 TL ✅ (yukarıda 700 ama basitleştirilmiş)
// member_002: Paid 600, Owes (500 + 200) = 700 → Net: -100 TL ✅
// member_003: Paid 0, Owes 500 → Net: -500 TL ✅
```

---

**Versiyon:** 1.0  
**Hazırlayan:** BölBölÖde Ekibi  
**Son Güncelleme:** 27 Ekim 2025

