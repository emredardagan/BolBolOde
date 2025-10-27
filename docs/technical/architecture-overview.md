# BölBölÖde - Teknik Mimari Dokümanı

## İçindekiler
1. [Sistem Mimarisi](#1-sistem-mimarisi)
2. [Teknoloji Stack](#2-teknoloji-stack)
3. [Katmanlı Mimari](#3-katmanlı-mimari)
4. [Veri Akışı](#4-veri-akışı)
5. [Offline-First Stratejisi](#5-offline-first-stratejisi)
6. [Güvenlik Mimarisi](#6-güvenlik-mimarisi)
7. [Ölçeklendirme Stratejisi](#7-ölçeklendirme-stratejisi)
8. [Monitoring ve Observability](#8-monitoring-ve-observability)

---

## 1. Sistem Mimarisi

### 1.1 Genel Bakış

```
┌─────────────────────────────────────────────────────────────┐
│                       CLIENT LAYER                           │
│  ┌──────────────┐              ┌──────────────┐            │
│  │   iOS App    │              │ Android App  │            │
│  │ React Native │              │ React Native │            │
│  └──────┬───────┘              └──────┬───────┘            │
│         │                              │                     │
│         └──────────────┬───────────────┘                    │
│                        │                                     │
└────────────────────────┼─────────────────────────────────────┘
                         │
                         │ HTTPS / WebSocket
                         │
┌────────────────────────┼─────────────────────────────────────┐
│                        ▼     BACKEND LAYER                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                Firebase Services                       │  │
│  │  ┌────────────┐  ┌────────────┐  ┌─────────────┐    │  │
│  │  │    Auth    │  │  Firestore │  │   Storage   │    │  │
│  │  └────────────┘  └────────────┘  └─────────────┘    │  │
│  │  ┌────────────┐  ┌────────────┐  ┌─────────────┐    │  │
│  │  │  Functions │  │  Analytics │  │  Messaging  │    │  │
│  │  └────────────┘  └────────────┘  └─────────────┘    │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                         │
                         │ External APIs
                         │
┌────────────────────────┼─────────────────────────────────────┐
│                        ▼   EXTERNAL SERVICES                  │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐  │
│  │ Exchange Rate  │  │  Expo Push     │  │    Sentry    │  │
│  │      API       │  │ Notifications  │  │ (Monitoring) │  │
│  └────────────────┘  └────────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Mimari Prensipler

#### 1.2.1 Mobile-First
- Mobil cihazlar için optimize edilmiş
- Offline-first yaklaşım
- Düşük bant genişliği desteği
- Battery-efficient

#### 1.2.2 Cloud-Native
- Serverless (Firebase Cloud Functions)
- Auto-scaling
- Managed services (Firestore, Auth, Storage)
- Pay-as-you-go maliyet

#### 1.2.3 Real-Time
- Firestore real-time listeners
- Anında senkronizasyon
- Optimistic updates
- Eventual consistency

#### 1.2.4 Security by Design
- Defense in depth
- Zero-trust architecture
- Encryption at rest ve in transit
- Principle of least privilege

---

## 2. Teknoloji Stack

### 2.1 Frontend (Mobile)

#### Core Framework
```yaml
Framework: React Native 0.74+
Language: TypeScript 5.0+
Build Tool: Expo SDK 51+
Package Manager: npm / yarn
```

#### UI ve Styling
```yaml
Styling: NativeWind (Tailwind for RN)
Navigation: React Navigation 6.x
  - Stack Navigator: Sayfa geçişleri
  - Bottom Tab Navigator: Ana navigasyon
  - Modal Navigator: Popup'lar
Icons: react-native-vector-icons / Expo Icons
Animations: Reanimated 3.x + Moti
```

#### State Management
```yaml
Server State: TanStack Query (React Query) v5
  - Caching
  - Background refetching
  - Optimistic updates
  - Mutations

Local State: Zustand
  - UI state
  - User preferences
  - App settings

Persistent Storage:
  - MMKV: Hızlı key-value store
  - AsyncStorage: Fallback
  - SecureStore: Hassas veriler (token, keys)
```

#### Forms ve Validation
```yaml
Form Management: React Hook Form
Validation: Zod
  - Type-safe schemas
  - Runtime validation
  - Error messages (i18n)
```

#### Diğer Önemli Kütüphaneler
```yaml
Dates: date-fns
Decimal: decimal.js (para hesaplamaları)
Charts: Victory Native
Images: Expo Image Picker + Manipulator
QR Code: react-native-qrcode-svg
i18n: i18next + react-i18next
Testing:
  - Jest
  - React Native Testing Library
  - Detox (E2E)
```

### 2.2 Backend

#### Firebase Services

**Firebase Authentication**
```yaml
Desteklenen Yöntemler:
  - Email/Password
  - Google OAuth
  - (Gelecek: Apple Sign In, Phone Auth)

Token Management:
  - JWT (Firebase ID Token)
  - Refresh token rotation
  - Custom claims (roles)
```

**Cloud Firestore**
```yaml
Database Type: NoSQL, Document-based
Consistency: Strong (single-region), Eventual (multi-region)
Indexing: Automatic + Composite indexes
Real-time: WebSocket-based listeners
Security: Firestore Security Rules
```

**Firebase Storage**
```yaml
Purpose: Fiş fotoğrafları, avatarlar
Security: Signed URLs
CDN: Firebase CDN (auto)
Max File Size: 5 MB
Formats: JPEG, PNG
```

**Cloud Functions**
```yaml
Runtime: Node.js 20
Language: TypeScript
Triggers:
  - HTTP (REST API)
  - Firestore triggers (onCreate, onUpdate, onDelete)
  - Scheduled (cron jobs)
  - Auth triggers (user created/deleted)

Deployment: Firebase CLI
Environment: Dev, Staging, Production
```

**Firebase Cloud Messaging (FCM)**
```yaml
Purpose: Push notifications
Integration: Expo Push Notifications (wrapper)
Topics: Group-based notifications
```

#### External Services

**Exchange Rate API**
```yaml
Provider: exchangerate-api.com (free tier) veya fixer.io
Cache: 24 saat Firestore'da
Fallback: Manuel kur girişi
Rate Limit: 1500 request/month (free tier)
```

**Error Monitoring**
```yaml
Service: Sentry
Features:
  - Error tracking
  - Performance monitoring
  - Release tracking
  - Source maps (production)
```

**Analytics**
```yaml
Primary: Firebase Analytics
Secondary: PostHog (opsiyonel)
Events: Custom event tracking
Privacy: GDPR/KVKK compliant
```

### 2.3 DevOps ve CI/CD

**Version Control**
```yaml
Git: GitHub
Branching Strategy: Git Flow
  - main: Production
  - develop: Development
  - feature/*: Özellik dalları
  - release/*: Release adayları
  - hotfix/*: Acil düzeltmeler
```

**CI/CD Pipeline**
```yaml
Platform: GitHub Actions
Jobs:
  - Lint (ESLint + Prettier)
  - Type Check (TypeScript)
  - Unit Tests (Jest)
  - Build (iOS + Android)
  - E2E Tests (Detox)
  - Deploy (EAS Build)

Deployment:
  - EAS Build: App binaries
  - EAS Submit: Store submission
  - Firebase Hosting: Web preview (opsiyonel)
```

**App Distribution**
```yaml
Internal Testing:
  - EAS Update: OTA updates
  - TestFlight (iOS)
  - Google Play Internal Track (Android)

Production:
  - App Store (iOS)
  - Google Play Store (Android)

Release Channels:
  - preview: Test builds
  - production: Store releases
```

---

## 3. Katmanlı Mimari

### 3.1 Client Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Screens    │  │  Components  │  │    Hooks     │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────┼────────────────────────────────┐
│                        ▼      BUSINESS LOGIC LAYER       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │    Queries   │  │   Mutations  │  │   Services   │ │
│  │ (React Query)│  │ (React Query)│  │  (Business)  │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────┼────────────────────────────────┐
│                        ▼          DATA LAYER             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │     API      │  │    Cache     │  │    Local     │ │
│  │  (Firebase)  │  │  (React Qry) │  │    (MMKV)    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### 3.2 Folder Structure

```
/src
  /screens            # Ekran bileşenleri
    /auth
      LoginScreen.tsx
      RegisterScreen.tsx
    /groups
      GroupListScreen.tsx
      GroupDetailScreen.tsx
      CreateGroupScreen.tsx
    /expenses
      ExpenseListScreen.tsx
      AddExpenseScreen.tsx
      ExpenseDetailScreen.tsx
    /settlements
      SettlementScreen.tsx
      SettlementHistoryScreen.tsx
    /reports
      ReportScreen.tsx
      ExportScreen.tsx
    /profile
      ProfileScreen.tsx
      SettingsScreen.tsx
  
  /components         # Yeniden kullanılabilir bileşenler
    /ui               # Base UI components
      Button.tsx
      Input.tsx
      Card.tsx
      Avatar.tsx
    /features         # Feature-specific components
      ExpenseCard.tsx
      MemberList.tsx
      BalanceCard.tsx
  
  /hooks              # Custom hooks
    useAuth.ts
    useGroup.ts
    useExpenses.ts
    useBalance.ts
    useOfflineSync.ts
  
  /services           # Business logic services
    /api
      auth.ts
      groups.ts
      expenses.ts
      settlements.ts
    /algorithms
      debtSimplification.ts
      currencyConversion.ts
      balanceCalculation.ts
    /offline
      syncQueue.ts
      conflictResolution.ts
  
  /lib                # Utilities ve helpers
    /firebase
      config.ts
      auth.ts
      firestore.ts
      storage.ts
    /utils
      currency.ts
      date.ts
      validation.ts
  
  /types              # TypeScript type definitions
    models.ts
    api.ts
    enums.ts
  
  /store              # Zustand stores
    authStore.ts
    uiStore.ts
    offlineStore.ts
  
  /navigation         # React Navigation setup
    AppNavigator.tsx
    AuthNavigator.tsx
    MainNavigator.tsx
    linking.ts
  
  /locales            # i18n translations
    /tr
      common.json
      auth.json
      expenses.json
    /en
      common.json
      auth.json
      expenses.json
  
  /constants          # App constants
    config.ts
    currencies.ts
    categories.ts
  
  /theme              # Styling theme
    colors.ts
    typography.ts
    spacing.ts

/functions            # Cloud Functions (backend)
  /src
    /triggers
      onExpenseCreated.ts
      onUserDeleted.ts
    /api
      calculateBalances.ts
      simplifyDebts.ts
      generateReport.ts
    /scheduled
      updateExchangeRates.ts
      cleanupOldData.ts
  tsconfig.json
  package.json

/e2e                  # Detox E2E tests
  /tests
    auth.test.ts
    expenses.test.ts
    settlement.test.ts
  jest.config.js
```

### 3.3 Component Patterns

#### Container/Presentational Pattern

```typescript
// Container (Business Logic)
// screens/expenses/AddExpenseScreen.tsx
export const AddExpenseScreen = () => {
  const { mutate, isLoading } = useAddExpense()
  const { data: members } = useGroupMembers(groupId)
  
  const handleSubmit = (data: ExpenseInput) => {
    mutate(data, {
      onSuccess: () => navigation.goBack()
    })
  }
  
  return (
    <AddExpenseForm
      members={members}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    />
  )
}

// Presentational (UI Only)
// components/features/AddExpenseForm.tsx
export const AddExpenseForm = ({ members, onSubmit, isLoading }) => {
  const { control, handleSubmit } = useForm()
  
  return (
    <View>
      <Input name="title" control={control} />
      <Input name="amount" control={control} />
      <MemberSelector members={members} />
      <Button onPress={handleSubmit(onSubmit)} loading={isLoading}>
        Kaydet
      </Button>
    </View>
  )
}
```

#### Custom Hook Pattern

```typescript
// hooks/useExpenses.ts
export const useExpenses = (groupId: string) => {
  return useQuery({
    queryKey: ['expenses', groupId],
    queryFn: () => expenseApi.getExpenses(groupId),
    staleTime: 5 * 60 * 1000, // 5 dakika
  })
}

export const useAddExpense = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: expenseApi.addExpense,
    onMutate: async (newExpense) => {
      // Optimistic update
      await queryClient.cancelQueries(['expenses'])
      const previous = queryClient.getQueryData(['expenses'])
      
      queryClient.setQueryData(['expenses'], (old) => [...old, newExpense])
      
      return { previous }
    },
    onError: (err, variables, context) => {
      // Rollback
      queryClient.setQueryData(['expenses'], context.previous)
    },
    onSuccess: () => {
      // Invalidate ve refetch
      queryClient.invalidateQueries(['expenses'])
    }
  })
}
```

---

## 4. Veri Akışı

### 4.1 Read Flow (Veri Okuma)

```
User Action (Open Group)
    ↓
Screen Component
    ↓
useQuery Hook (React Query)
    ↓
Check Cache → HIT → Return Cached Data → Render
    ↓ MISS
Fetch from Firestore
    ↓
Real-time Listener Attached
    ↓
Data Received
    ↓
Update Cache
    ↓
Render Component
    ↓
Background Refetch (staleTime geçtiyse)
```

### 4.2 Write Flow (Veri Yazma)

```
User Action (Add Expense)
    ↓
Form Submit
    ↓
useMutation Hook
    ↓
onMutate: Optimistic Update (Cache güncelle)
    ↓
UI Immediately Updates (loading state)
    ↓
API Call → Firestore
    ↓
┌────────────┬─────────────┐
│  SUCCESS   │    ERROR    │
└────────────┴─────────────┘
     ↓              ↓
onSuccess      onError
     ↓              ↓
Invalidate    Rollback Cache
Cache         Show Error
     ↓              ↓
Refetch       Restore UI
     ↓
Firestore Trigger → Cloud Function
     ↓
Recalculate Balances
     ↓
Update Balance Documents
     ↓
Real-time Listener → Clients Notified
     ↓
UI Auto-updates
```

### 4.3 Offline Flow

```
User Action (Offline)
    ↓
Add to Local Queue (MMKV)
    ↓
Optimistic Update (Local State)
    ↓
UI Updates with "pending" indicator
    ↓
Monitor Network State
    ↓
Network Online Detected
    ↓
Process Queue (FIFO)
    ↓
┌────────────┬─────────────┐
│  SUCCESS   │    ERROR    │
└────────────┴─────────────┘
     ↓              ↓
Remove from   Retry (3x)
Queue         with backoff
     ↓              ↓
Update UI     Failed →
              User notification
```

---

## 5. Offline-First Stratejisi

### 5.1 Offline Capabilities

**Okuma (Read):**
- Tüm grup verileri cache'lenir
- Son görüntülenen harcamalar offline erişilebilir
- Raporlar son bilinen durumda gösterilir

**Yazma (Write):**
- Harcama ekleme/düzenleme queue'ya alınır
- Settlement kaydetme queue'ya alınır
- Profil güncelleme queue'ya alınır

**Sınırlamalar:**
- Yeni grup oluşturma: Online gerekli
- Davet linki oluşturma: Online gerekli
- Döviz kuru çekme: Online gerekli (cache'den eskisi kullanılabilir)

### 5.2 Sync Queue Architecture

```typescript
// types/sync.ts
interface SyncQueueItem {
  id: string
  type: 'CREATE_EXPENSE' | 'UPDATE_EXPENSE' | 'DELETE_EXPENSE' | 'SETTLEMENT'
  payload: any
  timestamp: number
  retryCount: number
  status: 'pending' | 'syncing' | 'failed'
}

// services/offline/syncQueue.ts
class SyncQueue {
  private queue: SyncQueueItem[] = []
  
  async add(item: Omit<SyncQueueItem, 'id' | 'timestamp' | 'retryCount' | 'status'>) {
    const queueItem: SyncQueueItem = {
      ...item,
      id: uuid(),
      timestamp: Date.now(),
      retryCount: 0,
      status: 'pending'
    }
    
    this.queue.push(queueItem)
    await this.persist()
    
    if (await this.isOnline()) {
      this.processQueue()
    }
  }
  
  async processQueue() {
    const pending = this.queue.filter(item => item.status === 'pending')
    
    for (const item of pending) {
      try {
        item.status = 'syncing'
        await this.syncItem(item)
        this.queue = this.queue.filter(q => q.id !== item.id)
      } catch (error) {
        item.retryCount++
        item.status = 'failed'
        
        if (item.retryCount >= 3) {
          // Permanent failure
          this.notifyUser(item)
        } else {
          // Retry with exponential backoff
          const delay = Math.pow(2, item.retryCount) * 1000
          setTimeout(() => this.processQueue(), delay)
        }
      }
      
      await this.persist()
    }
  }
  
  private async syncItem(item: SyncQueueItem) {
    switch (item.type) {
      case 'CREATE_EXPENSE':
        await expenseApi.create(item.payload)
        break
      case 'UPDATE_EXPENSE':
        await expenseApi.update(item.payload.id, item.payload.data)
        break
      // ... diğer tipler
    }
  }
  
  private async persist() {
    await MMKV.setItem('sync_queue', JSON.stringify(this.queue))
  }
}

export const syncQueue = new SyncQueue()
```

### 5.3 Conflict Resolution

**Strateji: Last Write Wins (LWW) + Version Control**

```typescript
interface Document {
  id: string
  data: any
  version: number
  updatedAt: number
  updatedBy: string
}

const resolveConflict = (
  local: Document,
  remote: Document
): Document => {
  // Version-based
  if (remote.version > local.version) {
    return remote // Remote daha güncel
  }
  
  if (remote.version === local.version) {
    // Aynı versiyon, timestamp'e bak
    if (remote.updatedAt > local.updatedAt) {
      return remote
    }
  }
  
  return local // Local kazandı
}

// Kullanıcıya bildir
if (resolvedDoc !== localDoc) {
  showNotification({
    type: 'warning',
    message: 'Değişikliğiniz başka bir güncelleme ile üzerine yazıldı'
  })
}
```

---

## 6. Güvenlik Mimarisi

### 6.1 Authentication Flow

```
User → Login Form
   ↓
Firebase Auth → Email/Password veya OAuth
   ↓
ID Token Generated (JWT)
   ↓
Store Token Securely (SecureStore)
   ↓
Attach to All API Requests (Authorization header)
   ↓
Backend: Verify Token
   ↓
Check User Role/Permissions
   ↓
Allow/Deny Request
```

### 6.2 Authorization Model

**Firestore Security Rules:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    // Groups collection
    match /groups/{groupId} {
      allow read: if isGroupMember(groupId);
      allow create: if request.auth != null;
      allow update: if isOwner(groupId);
      allow delete: if isOwner(groupId);
      
      // Group members subcollection
      match /members/{memberId} {
        allow read: if isGroupMember(groupId);
        allow create: if isOwner(groupId);
        allow update: if isOwner(groupId);
        allow delete: if isOwner(groupId);
      }
      
      // Expenses subcollection
      match /expenses/{expenseId} {
        allow read: if isActiveMember(groupId);
        allow create: if canEditGroup(groupId);
        allow update: if canEditGroup(groupId) || isCreator(expenseId);
        allow delete: if canEditGroup(groupId) || isCreator(expenseId);
      }
    }
    
    // Helper functions
    function isGroupMember(groupId) {
      return exists(/databases/$(database)/documents/groups/$(groupId)/members/$(request.auth.uid));
    }
    
    function isActiveMember(groupId) {
      let member = get(/databases/$(database)/documents/groups/$(groupId)/members/$(request.auth.uid));
      return member.data.status == 'Active';
    }
    
    function isOwner(groupId) {
      let member = get(/databases/$(database)/documents/groups/$(groupId)/members/$(request.auth.uid));
      return member.data.role == 'Owner';
    }
    
    function canEditGroup(groupId) {
      let member = get(/databases/$(database)/documents/groups/$(groupId)/members/$(request.auth.uid));
      return member.data.role in ['Owner', 'Editor'] && member.data.status == 'Active';
    }
    
    function isCreator(expenseId) {
      let expense = get(/databases/$(database)/documents/groups/$(groupId)/expenses/$(expenseId));
      return expense.data.createdBy == request.auth.uid;
    }
  }
}
```

### 6.3 Data Encryption

**At Rest:**
- Firestore: Otomatik şifreleme (Google managed keys)
- Storage: Otomatik şifreleme
- SecureStore: iOS Keychain / Android Keystore

**In Transit:**
- HTTPS/TLS 1.3
- Certificate pinning (opsiyonel, production)

**Sensitive Data:**
```typescript
// Şifreler ASLA client-side saklanmaz
// Token'lar SecureStore'da
await SecureStore.setItemAsync('authToken', token, {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY
})
```

---

## 7. Ölçeklendirme Stratejisi

### 7.1 Database Sharding (Gelecek)

**Grup ID Bazlı:**
```
Group 1-1000   → Firestore Instance 1
Group 1001-2000 → Firestore Instance 2
...
```

### 7.2 Caching Strategy

**Multi-Level Cache:**
```
Request → Memory Cache (React Query)
            ↓ MISS
          Local Cache (MMKV)
            ↓ MISS
          Firestore (Remote)
```

**Cache Invalidation:**
- Time-based (staleTime)
- Event-based (mutations)
- Manual (user refresh)

### 7.3 CDN ve Asset Optimization

**Images:**
- Firebase Storage + CDN
- Responsive images (multiple sizes)
- WebP format (fallback JPEG)
- Lazy loading

**Code Splitting:**
- Route-based (React Navigation)
- Component-based (dynamic import)

### 7.4 Performance Budgets

```yaml
Metrics:
  - Time to Interactive: < 2.5s
  - First Contentful Paint: < 1.5s
  - Bundle Size: < 15 MB (iOS/Android)
  - API Response (p95): < 500ms
  - Firestore Reads: < 100K/day (initial target)
```

---

## 8. Monitoring ve Observability

### 8.1 Error Tracking

**Sentry Integration:**
```typescript
import * as Sentry from '@sentry/react-native'

Sentry.init({
  dsn: Config.SENTRY_DSN,
  environment: Config.ENV,
  tracesSampleRate: 0.2,
  beforeSend(event, hint) {
    // PII filtering
    if (event.user) {
      delete event.user.email
    }
    return event
  }
})
```

### 8.2 Analytics Events

**Core Events:**
```typescript
// Auth
analytics.logEvent('sign_up', { method: 'email' })
analytics.logEvent('login', { method: 'google' })

// Groups
analytics.logEvent('group_created', { memberCount: 5 })
analytics.logEvent('invite_sent', { method: 'link' })

// Expenses
analytics.logEvent('expense_added', { 
  category: 'food',
  splitType: 'equal',
  currency: 'TRY'
})

// Settlements
analytics.logEvent('settlement_completed', { amount: 100 })

// Exports
analytics.logEvent('report_exported', { format: 'pdf' })
```

### 8.3 Performance Monitoring

```typescript
// Custom traces
const trace = await firebase.perf().startTrace('calculate_balances')
trace.putAttribute('groupId', groupId)
trace.putMetric('expenseCount', expenses.length)

await calculateBalances(expenses)

await trace.stop()
```

### 8.4 Logging Strategy

**Log Levels:**
- ERROR: Production errors (Sentry)
- WARN: Suspicious activities
- INFO: Important events (analytics)
- DEBUG: Development only

**Structured Logging:**
```typescript
logger.info('Expense created', {
  groupId,
  expenseId,
  amount,
  currency,
  userId,
  timestamp: Date.now()
})
```

---

## 9. Deployment Architecture

### 9.1 Environments

```yaml
Development:
  Firebase Project: bolbolode-dev
  API Base: https://dev.bolbolode.com
  Expo Channel: preview

Staging:
  Firebase Project: bolbolode-staging
  API Base: https://staging.bolbolode.com
  Expo Channel: staging

Production:
  Firebase Project: bolbolode-prod
  API Base: https://api.bolbolode.com
  Expo Channel: production
```

### 9.2 Release Process

```
1. Feature Development (feature/*)
   ↓
2. Merge to develop
   ↓
3. Create release branch (release/v1.2.0)
   ↓
4. Deploy to Staging
   ↓
5. QA Testing
   ↓
6. Merge to main
   ↓
7. Tag (v1.2.0)
   ↓
8. Build Production
   ↓
9. Submit to Stores
   ↓
10. Monitor Rollout
```

---

## 10. Disaster Recovery

### 10.1 Backup Strategy

**Firestore:**
- Automatic backups (Firebase)
- Export snapshots: Daily
- Retention: 30 days

**Storage:**
- Redundancy: Multi-region (opsiyonel)
- Backup: Monthly full backup

### 10.2 Rollback Plan

**OTA Updates (Expo):**
```bash
# Publish new update
eas update --branch production

# Rollback
eas update:rollback --branch production
```

**Store Releases:**
- Phased rollout (10% → 50% → 100%)
- Emergency rollback: Previous version re-submit

---

**Versiyon:** 1.0  
**Hazırlayan:** BölBölÖde Ekibi  
**Son Güncelleme:** 27 Ekim 2025

