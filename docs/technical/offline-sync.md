# BölBölÖde - Offline-First ve Senkronizasyon Stratejisi

## İçindekiler
1. [Offline-First Yaklaşımı](#1-offline-first-yaklaşımı)
2. [Local Storage Mimarisi](#2-local-storage-mimarisi)
3. [Sync Queue Sistemi](#3-sync-queue-sistemi)
4. [Conflict Resolution](#4-conflict-resolution)
5. [Network State Management](#5-network-state-management)
6. [Implementation Detayları](#6-implementation-detayları)
7. [Test Senaryoları](#7-test-senaryoları)

---

## 1. Offline-First Yaklaşımı

### 1.1 Neden Offline-First?

**Kullanıcı Senaryoları:**
- Uçakta, dağda, kırsalda internet yokken harcama kaydetme
- Zayıf internet bağlantısında anlık güncellemeler
- Veri tasarrufu (mobile data)
- Hızlı UX (network latency'si yok)

**Prensipler:**
```
1. Local-First: Tüm işlemler önce local'de gerçekleşir
2. Optimistic Updates: UI anında güncellenir
3. Background Sync: Network geldiğinde otomatik senkronizasyon
4. Graceful Degradation: Senkronizasyon başarısız olsa bile app çalışır
```

### 1.2 Offline Capabilities Matrix

| Özellik | Offline Destegi | Notlar |
|---------|-----------------|--------|
| Grup görüntüleme | ✅ Full | Cache'den |
| Harcama görüntüleme | ✅ Full | Cache'den |
| Harcama ekleme | ✅ Full | Queue'ya alınır |
| Harcama düzenleme | ✅ Full | Queue'ya alınır |
| Harcama silme | ✅ Full | Queue'ya alınır |
| Settlement ekleme | ✅ Full | Queue'ya alınır |
| Bakiye hesaplama | ✅ Full | Local calculation |
| Yeni grup oluşturma | ❌ Partial | Basit gruplar oluşturulabilir |
| Davet linki oluşturma | ❌ Online Only | Server-side token generation |
| Davet linki ile katılma | ❌ Online Only | Server validation gerekli |
| Döviz kuru çekme | ⚠️ Cached | Son 7 günün kurları kullanılır |
| Fiş fotoğrafı yükleme | ✅ Full | Queue'ya alınır, sonra upload |
| Push notification | ❌ Online Only | FCM gerekli |
| Raporlama (PDF/CSV) | ✅ Partial | Local veriyle rapor, sonra update |

---

## 2. Local Storage Mimarisi

### 2.1 Storage Layers

```
┌─────────────────────────────────────────────────────────┐
│              APPLICATION LAYER                           │
│  React Components, Business Logic                       │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────┼────────────────────────────────────┐
│              CACHING LAYER                               │
│  React Query (In-Memory Cache)                          │
│  - 5-15 min staleTime                                   │
│  - Automatic garbage collection                         │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────┼────────────────────────────────────┐
│          PERSISTENCE LAYER                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │     MMKV     │  │ AsyncStorage │  │ SecureStore  │ │
│  │  (Primary)   │  │  (Fallback)  │  │  (Secrets)   │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                     │
┌────────────────────┼────────────────────────────────────┐
│              REMOTE LAYER                                │
│  Firestore (Source of Truth)                            │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Storage Strategies

**MMKV (Primary Storage):**
```typescript
import { MMKV } from 'react-native-mmkv'

// Instance oluşturma
export const storage = new MMKV({
  id: 'bolbolode-storage',
  encryptionKey: getEncryptionKey() // Keychain'den
})

// Kullanım
storage.set('user_id', userId)
storage.set('last_sync', Date.now())
storage.set('groups', JSON.stringify(groups))

// Okuma
const userId = storage.getString('user_id')
const lastSync = storage.getNumber('last_sync')
const groups = JSON.parse(storage.getString('groups') || '[]')
```

**React Query Persistence:**
```typescript
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { persistQueryClient } from '@tanstack/react-query-persist-client'

const persister = createSyncStoragePersister({
  storage: {
    getItem: (key) => storage.getString(key),
    setItem: (key, value) => storage.set(key, value),
    removeItem: (key) => storage.delete(key)
  }
})

persistQueryClient({
  queryClient,
  persister,
  maxAge: 1000 * 60 * 60 * 24 * 7 // 7 gün
})
```

### 2.3 Data Partitioning

**Storage Keys:**
```typescript
// User data
user:{userId}
user:{userId}:groups
user:{userId}:preferences

// Group data
group:{groupId}:details
group:{groupId}:members
group:{groupId}:expenses
group:{groupId}:settlements

// Sync queue
sync:queue
sync:failed
sync:last_timestamp

// Cache metadata
cache:groups:timestamp
cache:expenses:{groupId}:timestamp
```

---

## 3. Sync Queue Sistemi

### 3.1 Queue Architecture

```typescript
interface SyncQueueItem {
  id: string                    // Unique item ID
  type: SyncActionType          // İşlem tipi
  payload: any                  // İşlem verisi
  localId: string | null        // Local temp ID (create için)
  remoteId: string | null       // Firestore ID (update/delete için)
  timestamp: number             // Eklenme zamanı
  retryCount: number            // Retry sayısı
  status: SyncStatus            // İşlem durumu
  priority: number              // Öncelik (0-10, 10 en yüksek)
  dependencies: string[]        // Bağımlı işlemler
}

enum SyncActionType {
  CREATE_EXPENSE = 'CREATE_EXPENSE',
  UPDATE_EXPENSE = 'UPDATE_EXPENSE',
  DELETE_EXPENSE = 'DELETE_EXPENSE',
  CREATE_SETTLEMENT = 'CREATE_SETTLEMENT',
  UPDATE_SETTLEMENT = 'UPDATE_SETTLEMENT',
  UPLOAD_ATTACHMENT = 'UPLOAD_ATTACHMENT',
  UPDATE_PROFILE = 'UPDATE_PROFILE'
}

enum SyncStatus {
  PENDING = 'PENDING',       // Bekliyor
  SYNCING = 'SYNCING',       // Şu an senkronize ediliyor
  SUCCESS = 'SUCCESS',       // Başarılı
  FAILED = 'FAILED',         // Başarısız
  CANCELLED = 'CANCELLED'    // İptal edildi
}
```

### 3.2 Queue Manager Implementation

```typescript
class SyncQueueManager {
  private queue: SyncQueueItem[] = []
  private isProcessing = false
  private maxRetries = 3
  private batchSize = 10

  constructor() {
    this.loadQueue()
    this.setupNetworkListener()
  }

  // Queue'ya ekleme
  async add(item: Omit<SyncQueueItem, 'id' | 'timestamp' | 'retryCount' | 'status'>): Promise<string> {
    const queueItem: SyncQueueItem = {
      ...item,
      id: uuid(),
      timestamp: Date.now(),
      retryCount: 0,
      status: SyncStatus.PENDING
    }

    this.queue.push(queueItem)
    await this.persistQueue()

    // İnternet varsa hemen işle
    if (await this.isOnline()) {
      this.processQueue()
    }

    return queueItem.id
  }

  // Queue'yu işle
  async processQueue(): Promise<void> {
    if (this.isProcessing) return
    if (!(await this.isOnline())) return

    this.isProcessing = true

    try {
      // Önceliğe göre sırala
      const sortedQueue = [...this.queue]
        .filter(item => item.status === SyncStatus.PENDING)
        .sort((a, b) => {
          // Önce prioriteye, sonra timestamp'e göre
          if (a.priority !== b.priority) {
            return b.priority - a.priority
          }
          return a.timestamp - b.timestamp
        })

      // Batch processing
      for (let i = 0; i < sortedQueue.length; i += this.batchSize) {
        const batch = sortedQueue.slice(i, i + this.batchSize)

        await Promise.allSettled(
          batch.map(item => this.processItem(item))
        )

        // Progress event
        this.emitProgress({
          completed: Math.min(i + this.batchSize, sortedQueue.length),
          total: sortedQueue.length
        })
      }

      // Başarılı olanları temizle
      this.queue = this.queue.filter(
        item => item.status !== SyncStatus.SUCCESS
      )

      await this.persistQueue()
    } finally {
      this.isProcessing = false
    }
  }

  // Tek item işle
  private async processItem(item: SyncQueueItem): Promise<void> {
    try {
      // Status güncelle
      item.status = SyncStatus.SYNCING
      await this.persistQueue()

      // Dependency check
      if (!this.areDependenciesCompleted(item)) {
        item.status = SyncStatus.PENDING
        return
      }

      // İşlemi gerçekleştir
      const result = await this.executeSync(item)

      // Başarılı
      item.status = SyncStatus.SUCCESS
      item.remoteId = result.id

      // Local ID → Remote ID mapping güncelle
      if (item.localId && result.id) {
        await this.updateLocalToRemoteMapping(item.localId, result.id)
      }

      // İlgili cache'i invalidate et
      this.invalidateRelatedCache(item)

    } catch (error) {
      // Retry logic
      item.retryCount++

      if (item.retryCount >= this.maxRetries) {
        item.status = SyncStatus.FAILED
        this.notifyUser({
          type: 'error',
          title: 'Senkronizasyon Başarısız',
          message: `İşlem başarısız oldu: ${this.getItemDescription(item)}`
        })
      } else {
        item.status = SyncStatus.PENDING
        // Exponential backoff
        const delay = Math.pow(2, item.retryCount) * 1000
        setTimeout(() => this.processQueue(), delay)
      }

      logger.error('Sync failed', { item, error })
    }

    await this.persistQueue()
  }

  // İşlemi gerçekleştir
  private async executeSync(item: SyncQueueItem): Promise<any> {
    switch (item.type) {
      case SyncActionType.CREATE_EXPENSE:
        return await expenseApi.create(item.payload)

      case SyncActionType.UPDATE_EXPENSE:
        return await expenseApi.update(item.remoteId!, item.payload)

      case SyncActionType.DELETE_EXPENSE:
        return await expenseApi.delete(item.remoteId!)

      case SyncActionType.CREATE_SETTLEMENT:
        return await settlementApi.create(item.payload)

      case SyncActionType.UPLOAD_ATTACHMENT:
        return await uploadFile(item.payload.file, item.payload.path)

      default:
        throw new Error(`Unknown sync type: ${item.type}`)
    }
  }

  // Bağımlılıkları kontrol et
  private areDependenciesCompleted(item: SyncQueueItem): boolean {
    if (!item.dependencies || item.dependencies.length === 0) {
      return true
    }

    return item.dependencies.every(depId => {
      const dep = this.queue.find(i => i.id === depId)
      return dep?.status === SyncStatus.SUCCESS
    })
  }

  // Network durumunu dinle
  private setupNetworkListener(): void {
    NetInfo.addEventListener(state => {
      if (state.isConnected && state.isInternetReachable) {
        logger.info('Network online, processing queue')
        this.processQueue()
      }
    })
  }

  // Cache invalidation
  private invalidateRelatedCache(item: SyncQueueItem): void {
    const { type, payload } = item

    if (type.includes('EXPENSE')) {
      queryClient.invalidateQueries(['expenses', payload.groupId])
      queryClient.invalidateQueries(['balance', payload.groupId])
    }

    if (type.includes('SETTLEMENT')) {
      queryClient.invalidateQueries(['settlements', payload.groupId])
      queryClient.invalidateQueries(['balance', payload.groupId])
    }
  }

  // Queue persistence
  private async persistQueue(): Promise<void> {
    storage.set('sync:queue', JSON.stringify(this.queue))
  }

  private loadQueue(): void {
    const saved = storage.getString('sync:queue')
    if (saved) {
      this.queue = JSON.parse(saved)
    }
  }

  // Utility
  private async isOnline(): Promise<boolean> {
    const state = await NetInfo.fetch()
    return state.isConnected && state.isInternetReachable
  }

  // Public API
  getQueueStatus(): QueueStatus {
    return {
      pending: this.queue.filter(i => i.status === SyncStatus.PENDING).length,
      syncing: this.queue.filter(i => i.status === SyncStatus.SYNCING).length,
      failed: this.queue.filter(i => i.status === SyncStatus.FAILED).length,
      total: this.queue.length
    }
  }

  async clearSuccessful(): Promise<void> {
    this.queue = this.queue.filter(i => i.status !== SyncStatus.SUCCESS)
    await this.persistQueue()
  }

  async retryFailed(): Promise<void> {
    this.queue
      .filter(i => i.status === SyncStatus.FAILED)
      .forEach(i => {
        i.status = SyncStatus.PENDING
        i.retryCount = 0
      })

    await this.persistQueue()
    await this.processQueue()
  }

  removeItem(id: string): void {
    this.queue = this.queue.filter(i => i.id !== id)
    this.persistQueue()
  }
}

// Singleton instance
export const syncQueue = new SyncQueueManager()
```

### 3.3 Kullanım Örnekleri

**Harcama Ekleme (Offline):**
```typescript
const addExpenseOffline = async (expenseData: ExpenseInput) => {
  // 1. Local ID oluştur
  const localId = `temp_${uuid()}`

  // 2. Optimistic update (UI anında güncellenir)
  queryClient.setQueryData(['expenses', groupId], (old: Expense[]) => [
    ...old,
    {
      ...expenseData,
      id: localId,
      _isPending: true, // UI'da göster
      createdAt: new Date()
    }
  ])

  // 3. Queue'ya ekle
  await syncQueue.add({
    type: SyncActionType.CREATE_EXPENSE,
    payload: expenseData,
    localId,
    remoteId: null,
    priority: 5,
    dependencies: []
  })

  return localId
}
```

**Harcama Düzenleme (Offline):**
```typescript
const updateExpenseOffline = async (expenseId: string, updates: Partial<Expense>) => {
  // 1. Optimistic update
  queryClient.setQueryData(['expenses', groupId], (old: Expense[]) =>
    old.map(expense =>
      expense.id === expenseId
        ? { ...expense, ...updates, _isPending: true }
        : expense
    )
  )

  // 2. Queue'ya ekle
  await syncQueue.add({
    type: SyncActionType.UPDATE_EXPENSE,
    payload: updates,
    localId: null,
    remoteId: expenseId,
    priority: 5,
    dependencies: []
  })
}
```

**Fiş Fotoğrafı Yükleme (Dependency):**
```typescript
const addExpenseWithAttachment = async (expenseData: ExpenseInput, photo: File) => {
  const localId = `temp_${uuid()}`
  const attachmentLocalId = `temp_att_${uuid()}`

  // 1. Önce fotoğrafı queue'ya ekle
  const uploadQueueId = await syncQueue.add({
    type: SyncActionType.UPLOAD_ATTACHMENT,
    payload: { file: photo, path: `expenses/${localId}` },
    localId: attachmentLocalId,
    remoteId: null,
    priority: 6, // Daha yüksek öncelik
    dependencies: []
  })

  // 2. Sonra harcamayı ekle (attachment'a bağımlı)
  await syncQueue.add({
    type: SyncActionType.CREATE_EXPENSE,
    payload: {
      ...expenseData,
      attachments: [{ localId: attachmentLocalId }]
    },
    localId,
    remoteId: null,
    priority: 5,
    dependencies: [uploadQueueId] // Upload bitince expense oluştur
  })
}
```

---

## 4. Conflict Resolution

### 4.1 Conflict Senaryoları

**Senaryo 1: Aynı Harcamayı İki Kişi Düzenliyor**
```
T0: A ve B aynı harcamayı açıyor (amount: 100)
T1: A offline, amount'u 150 yapıyor
T2: B online, amount'u 200 yapıyor ve kaydediyor (Firestore'da 200)
T3: A online oluyor, queue işleniyor
    → Conflict! A'nın değişikliği (150) vs B'nin değişikliği (200)
```

**Senaryo 2: Offline Eklenen Harcama, Yetki Kaldırıldıktan Sonra Sync**
```
T0: Kullanıcı Editor rolünde
T1: Offline harcama ekliyor
T2: Owner, kullanıcıyı Viewer yapıyor
T3: Kullanıcı online oluyor
    → Yetki hatası!
```

### 4.2 Resolution Strategies

**Strategy 1: Last Write Wins (LWW) + Version Control**

```typescript
interface Versioned {
  version: number
  updatedAt: Timestamp
  updatedBy: string
}

const resolveConflict = async (
  local: Versioned & any,
  remote: Versioned & any
): Promise<any> => {
  // Remote version daha yeni
  if (remote.version > local.version) {
    logger.warn('Conflict: Remote version newer, discarding local changes', {
      local,
      remote
    })

    // Kullanıcıya bildir
    showNotification({
      type: 'warning',
      title: 'Değişiklik Üzerine Yazıldı',
      message: 'Yaptığınız değişiklik başkası tarafından güncellenmiş. En son versiyon gösteriliyor.'
    })

    // Remote'u kullan
    return remote
  }

  // Versiyonlar aynı, timestamp'e bak
  if (remote.version === local.version) {
    if (remote.updatedAt > local.updatedAt) {
      return remote
    }
  }

  // Local kazandı
  return local
}
```

**Strategy 2: User Prompt (Manuel Çözüm)**

```typescript
const promptUserForResolution = async (
  local: Expense,
  remote: Expense
): Promise<Expense> => {
  return new Promise((resolve) => {
    Alert.alert(
      'Çakışma Tespit Edildi',
      'Bu harcama başkası tarafından değiştirilmiş. Hangi versiyonu kullanmak istersiniz?',
      [
        {
          text: 'Kendi Değişikliğim',
          onPress: () => resolve(local)
        },
        {
          text: 'Güncel Versiyon',
          onPress: () => resolve(remote)
        },
        {
          text: 'Karşılaştır',
          onPress: () => {
            navigation.navigate('ConflictResolver', { local, remote })
          }
        }
      ]
    )
  })
}
```

**Strategy 3: Automatic Merge (Akıllı Birleştirme)**

```typescript
const autoMerge = (local: Expense, remote: Expense): Expense => {
  // Değişmeyen alanlar remote'dan
  const merged = { ...remote }

  // Eğer sadece attachment eklenmişse, ikisini birleştir
  if (
    local.title === remote.title &&
    local.amount === remote.amount &&
    local.attachments.length > remote.attachments.length
  ) {
    merged.attachments = [
      ...remote.attachments,
      ...local.attachments.filter(a => !remote.attachments.some(r => r.id === a.id))
    ]
  }

  return merged
}
```

### 4.3 Conflict Prevention

**Optimistic Locking:**
```typescript
const updateExpense = async (id: string, updates: Partial<Expense>) => {
  const current = await db.collection('expenses').doc(id).get()
  const expectedVersion = current.data().version

  await db.runTransaction(async (txn) => {
    const doc = await txn.get(db.collection('expenses').doc(id))

    if (!doc.exists) {
      throw new Error('Harcama bulunamadı')
    }

    const currentVersion = doc.data().version

    if (currentVersion !== expectedVersion) {
      throw new ConflictError('Version mismatch')
    }

    txn.update(doc.ref, {
      ...updates,
      version: currentVersion + 1,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedBy: auth.currentUser.uid
    })
  })
}
```

**Real-time Listeners (Lock Indication):**
```typescript
// Kullanıcı düzenlemeye başladığında
const startEditing = async (expenseId: string) => {
  await db.collection('expenses').doc(expenseId).update({
    editingBy: auth.currentUser.uid,
    editingAt: admin.firestore.FieldValue.serverTimestamp()
  })
}

// Listener diğer kullanıcılara uyarı verir
useEffect(() => {
  const unsubscribe = db
    .collection('expenses')
    .doc(expenseId)
    .onSnapshot(doc => {
      const data = doc.data()
      if (data.editingBy && data.editingBy !== auth.currentUser.uid) {
        showWarning('Bu harcama şu an başkası tarafından düzenleniyor')
      }
    })

  return unsubscribe
}, [expenseId])
```

---

## 5. Network State Management

### 5.1 Network Detection

```typescript
import NetInfo from '@react-native-community/netinfo'

// Hook
export const useNetworkState = () => {
  const [isOnline, setIsOnline] = useState(true)
  const [isInternetReachable, setIsInternetReachable] = useState(true)
  const [connectionType, setConnectionType] = useState<string>('wifi')

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? false)
      setIsInternetReachable(state.isInternetReachable ?? false)
      setConnectionType(state.type)

      // Senkronizasyon tetikle
      if (state.isConnected && state.isInternetReachable) {
        syncQueue.processQueue()
      }
    })

    return unsubscribe
  }, [])

  return { isOnline, isInternetReachable, connectionType }
}

// Usage
const { isOnline } = useNetworkState()

return (
  <View>
    {!isOnline && (
      <Banner type="warning">
        İnternet bağlantınız yok. Offline modundasınız.
      </Banner>
    )}
  </View>
)
```

### 5.2 Sync Indicator

```typescript
const SyncIndicator = () => {
  const { pending, syncing, failed } = syncQueue.getQueueStatus()
  const { isOnline } = useNetworkState()

  if (!isOnline) {
    return (
      <View style={styles.indicator}>
        <Icon name="cloud-offline" />
        <Text>Offline</Text>
      </View>
    )
  }

  if (syncing > 0) {
    return (
      <View style={styles.indicator}>
        <ActivityIndicator size="small" />
        <Text>Senkronize ediliyor... ({syncing}/{pending + syncing})</Text>
      </View>
    )
  }

  if (failed > 0) {
    return (
      <TouchableOpacity
        style={[styles.indicator, styles.error]}
        onPress={() => syncQueue.retryFailed()}
      >
        <Icon name="alert-circle" />
        <Text>{failed} işlem başarısız. Tekrar dene</Text>
      </TouchableOpacity>
    )
  }

  if (pending > 0) {
    return (
      <View style={styles.indicator}>
        <Icon name="cloud-queue" />
        <Text>{pending} değişiklik bekliyor</Text>
      </View>
    )
  }

  return null
}
```

---

## 6. Implementation Detayları

### 6.1 React Query Integration

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// Offline-aware query
export const useExpenses = (groupId: string) => {
  const { isOnline } = useNetworkState()

  return useQuery({
    queryKey: ['expenses', groupId],
    queryFn: async () => {
      if (isOnline) {
        return await expenseApi.getExpenses(groupId)
      } else {
        // Offline: Cache'den oku
        const cached = storage.getString(`expenses:${groupId}`)
        return cached ? JSON.parse(cached) : []
      }
    },
    staleTime: isOnline ? 5 * 60 * 1000 : Infinity, // Offline'da stale olmaz
    cacheTime: 7 * 24 * 60 * 60 * 1000, // 7 gün
  })
}

// Offline-aware mutation
export const useAddExpense = () => {
  const queryClient = useQueryClient()
  const { isOnline } = useNetworkState()

  return useMutation({
    mutationFn: async (expense: ExpenseInput) => {
      if (isOnline) {
        return await expenseApi.create(expense)
      } else {
        return await addExpenseOffline(expense)
      }
    },
    onMutate: async (newExpense) => {
      // Optimistic update
      await queryClient.cancelQueries(['expenses', newExpense.groupId])

      const previous = queryClient.getQueryData(['expenses', newExpense.groupId])

      queryClient.setQueryData(['expenses', newExpense.groupId], (old: Expense[]) => [
        ...old,
        {
          ...newExpense,
          id: newExpense.id || `temp_${uuid()}`,
          _isPending: !isOnline,
          createdAt: new Date()
        }
      ])

      return { previous }
    },
    onError: (err, variables, context) => {
      // Rollback
      if (context?.previous) {
        queryClient.setQueryData(['expenses', variables.groupId], context.previous)
      }
    },
    onSuccess: () => {
      // Başarılı, cache'i invalidate et
      queryClient.invalidateQueries(['expenses'])
      queryClient.invalidateQueries(['balance'])
    }
  })
}
```

### 6.2 Background Sync

```typescript
import BackgroundFetch from 'react-native-background-fetch'

// Background sync configuration
const configureBackgroundSync = () => {
  BackgroundFetch.configure(
    {
      minimumFetchInterval: 15, // 15 dakika
      stopOnTerminate: false,
      startOnBoot: true,
      enableHeadless: true
    },
    async (taskId) => {
      logger.info('[BackgroundFetch] Task started', { taskId })

      try {
        await syncQueue.processQueue()
        logger.info('[BackgroundFetch] Sync completed')
      } catch (error) {
        logger.error('[BackgroundFetch] Sync failed', { error })
      }

      BackgroundFetch.finish(taskId)
    },
    (error) => {
      logger.error('[BackgroundFetch] Failed to start', { error })
    }
  )
}

// App başlatıldığında
useEffect(() => {
  configureBackgroundSync()
}, [])
```

---

## 7. Test Senaryoları

### 7.1 Unit Tests

```typescript
describe('SyncQueueManager', () => {
  let syncQueue: SyncQueueManager

  beforeEach(() => {
    syncQueue = new SyncQueueManager()
  })

  it('should add item to queue', async () => {
    const id = await syncQueue.add({
      type: SyncActionType.CREATE_EXPENSE,
      payload: { title: 'Test', amount: 100 },
      localId: 'temp_1',
      remoteId: null,
      priority: 5,
      dependencies: []
    })

    expect(id).toBeDefined()
    expect(syncQueue.getQueueStatus().pending).toBe(1)
  })

  it('should process queue in priority order', async () => {
    const processed: string[] = []

    // Mock executeSync
    syncQueue['executeSync'] = jest.fn(async (item) => {
      processed.push(item.id)
      return { id: uuid() }
    })

    // Add items with different priorities
    await syncQueue.add({ ...item1, priority: 5 })
    await syncQueue.add({ ...item2, priority: 10 })
    await syncQueue.add({ ...item3, priority: 3 })

    await syncQueue.processQueue()

    // Priority order: 10, 5, 3
    expect(processed[0]).toBe(item2.id)
    expect(processed[1]).toBe(item1.id)
    expect(processed[2]).toBe(item3.id)
  })

  it('should retry failed items', async () => {
    let attempt = 0

    syncQueue['executeSync'] = jest.fn(async () => {
      attempt++
      if (attempt < 2) {
        throw new Error('Network error')
      }
      return { id: uuid() }
    })

    const id = await syncQueue.add({ ...item })

    await syncQueue.processQueue()

    const queueItem = syncQueue['queue'].find(i => i.id === id)
    expect(queueItem?.retryCount).toBe(1)
    expect(queueItem?.status).toBe(SyncStatus.PENDING)

    await syncQueue.processQueue()

    expect(queueItem?.status).toBe(SyncStatus.SUCCESS)
  })
})
```

### 7.2 Integration Tests

```typescript
describe('Offline Expense Creation', () => {
  it('should create expense offline and sync when online', async () => {
    // 1. Go offline
    mockNetInfo.setConnected(false)

    // 2. Create expense
    const { result } = renderHook(() => useAddExpense())

    await act(async () => {
      await result.current.mutate({
        title: 'Test Expense',
        amount: 100,
        groupId: 'group_1'
      })
    })

    // 3. Check queue
    expect(syncQueue.getQueueStatus().pending).toBe(1)

    // 4. Go online
    mockNetInfo.setConnected(true)

    // 5. Wait for sync
    await waitFor(() => {
      expect(syncQueue.getQueueStatus().pending).toBe(0)
    })

    // 6. Verify expense created
    const expenses = await expenseApi.getExpenses('group_1')
    expect(expenses).toContainEqual(
      expect.objectContaining({ title: 'Test Expense' })
    )
  })
})
```

### 7.3 Manual Test Scenarios

```yaml
Senaryo 1: Temel Offline Kullanım
  1. Uygulamayı aç
  2. Airplane mode aç
  3. Yeni harcama ekle
  4. Harcamayı düzenle
  5. Airplane mode kapat
  6. Senkronizasyon tamamlandığını gör
  ✓ Harcama Firestore'da görünmeli

Senaryo 2: Çakışma Testi
  1. İki cihazda aynı hesapla giriş yap
  2. Cihaz A'yı offline yap
  3. Her iki cihazda aynı harcamayı düzenle
  4. Cihaz B değişiklikleri kaydet
  5. Cihaz A'yı online yap
  6. Çakışma çözümü mesajını gör
  ✓ Doğru versiyon korunmalı

Senaryo 3: Uzun Süreli Offline
  1. 1 hafta offline kal
  2. 50 harcama ekle
  3. Online ol
  4. Batch sync progress göster
  ✓ Tüm harcamalar senkronize olmalı

Senaryo 4: Yetki Değişikliği
  1. Kullanıcı Editor olarak offline harcama ekle
  2. Owner, kullanıcıyı Viewer yap
  3. Kullanıcı online olsun
  4. Yetki hatası göster
  ✓ Harcama eklenmemeli, kullanıcıya bilgi verilmeli
```

---

**Versiyon:** 1.0  
**Hazırlayan:** BölBölÖde Ekibi  
**Son Güncelleme:** 27 Ekim 2025

