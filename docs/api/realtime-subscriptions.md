# BölBölÖde - Realtime Subscriptions Dokümantasyonu

## İçindekiler
1. [Genel Bakış](#1-genel-bakış)
2. [Firestore Realtime Listeners](#2-firestore-realtime-listeners)
3. [Subscription Yönetimi](#3-subscription-yönetimi)
4. [Event-Driven Architecture](#4-event-driven-architecture)
5. [Best Practices](#5-best-practices)
6. [Örnek Implementasyonlar](#6-örnek-implementasyonlar)

---

## 1. Genel Bakış

BölBölÖde uygulaması, Firebase Firestore'un real-time listener özelliğini kullanarak kullanıcılara anlık güncellemeler sağlar. Bu sayede kullanıcılar, başka bir kullanıcı harcama eklediğinde veya ödeme yaptığında anında bildirim alır.

### 1.1 Realtime Subscription Kullanım Senaryoları

```yaml
Grup Listesi:
  - Kullanıcının gruplarındaki değişiklikler
  - Yeni grup eklenmesi
  - Grup bilgilerinin güncellenmesi

Grup Detayı:
  - Yeni harcama eklenmesi
  - Harcama güncellemeleri
  - Üye eklenmesi/çıkarılması
  - Bakiye değişiklikleri

Harcama Listesi:
  - Yeni harcamalar
  - Harcama düzenlemeleri
  - Harcama silinmeleri

Bakiye Ekranı:
  - Bakiye hesaplama güncellemeleri
  - Ödeme kayıtları
  - Borç sadeleştirme önerileri
```

### 1.2 Teknik Detaylar

```yaml
Library: @react-firebase/firestore veya firebase/firestore
Connection: WebSocket (Firestore SDK)
Reconnection: Otomatik
Offline Support: Firestore offline persistence
Cache: Firestore cache + React Query cache
```

---

## 2. Firestore Realtime Listeners

### 2.1 Kullanıcı Grupları Subscription

**Amaç:** Kullanıcının üye olduğu grupları real-time dinler.

**Collection Path:**
```
/groups
```

**Query:**
```typescript
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from './config';

const groupsQuery = query(
  collection(db, 'groups'),
  where('ownerId', '==', userId)
);

const unsubscribe = onSnapshot(
  groupsQuery,
  (snapshot) => {
    const groups = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    // Update UI
  },
  (error) => {
    console.error('Groups subscription error:', error);
  }
);
```

**Event Types:**
- `added`: Yeni grup eklendi
- `modified`: Grup güncellendi
- `removed`: Grup silindi (soft delete)

**Kullanım Yeri:**
- `GroupListScreen` - Grup listesi ekranı
- `MainNavigator` - Ana navigasyon (badge sayısı için)

---

### 2.2 Grup Üyeleri Subscription

**Amaç:** Bir grup içindeki üyeleri real-time dinler.

**Collection Path:**
```
/groups/{groupId}/members
```

**Query:**
```typescript
const membersRef = collection(db, 'groups', groupId, 'members');

const unsubscribe = onSnapshot(
  membersRef,
  (snapshot) => {
    const members = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    // Update UI
  },
  (error) => {
    console.error('Members subscription error:', error);
  }
);
```

**Event Types:**
- `added`: Yeni üye eklendi
- `modified`: Üye bilgileri güncellendi (bakiye, rol, vb.)
- `removed`: Üye gruptan çıkarıldı

**Kullanım Yeri:**
- `GroupDetailScreen` - Grup detay ekranı
- `BalanceScreen` - Bakiye ekranı
- `MemberList` component

---

### 2.3 Grup Harcamaları Subscription

**Amaç:** Bir grup içindeki harcamaları real-time dinler.

**Collection Path:**
```
/groups/{groupId}/expenses
```

**Query:**
```typescript
const expensesQuery = query(
  collection(db, 'groups', groupId, 'expenses'),
  where('status', '==', 'Active'),
  orderBy('date', 'desc'),
  limit(50)
);

const unsubscribe = onSnapshot(
  expensesQuery,
  (snapshot) => {
    const expenses = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    // Update UI
  },
  (error) => {
    console.error('Expenses subscription error:', error);
  }
);
```

**Event Types:**
- `added`: Yeni harcama eklendi
- `modified`: Harcama güncellendi
- `removed`: Harcama silindi (soft delete)

**Kullanım Yeri:**
- `ExpenseListScreen` - Harcama listesi ekranı
- `GroupDetailScreen` - Grup detay ekranı (son harcamalar)

**Filtreleme:**
```typescript
// Tarih aralığı ile filtreleme
const expensesQuery = query(
  collection(db, 'groups', groupId, 'expenses'),
  where('status', '==', 'Active'),
  where('date', '>=', startDate),
  where('date', '<=', endDate),
  orderBy('date', 'desc')
);

// Kategori ile filtreleme
const expensesQuery = query(
  collection(db, 'groups', groupId, 'expenses'),
  where('status', '==', 'Active'),
  where('category', '==', 'Food'),
  orderBy('date', 'desc')
);
```

---

### 2.4 Ödeme Kayıtları Subscription

**Amaç:** Bir grup içindeki ödeme kayıtlarını real-time dinler.

**Collection Path:**
```
/groups/{groupId}/settlements
```

**Query:**
```typescript
const settlementsQuery = query(
  collection(db, 'groups', groupId, 'settlements'),
  where('status', '==', 'Confirmed'),
  orderBy('date', 'desc')
);

const unsubscribe = onSnapshot(
  settlementsQuery,
  (snapshot) => {
    const settlements = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    // Update UI
  },
  (error) => {
    console.error('Settlements subscription error:', error);
  }
);
```

**Event Types:**
- `added`: Yeni ödeme kaydedildi
- `modified`: Ödeme durumu güncellendi (Pending → Confirmed)
- `removed`: Ödeme silindi

**Kullanım Yeri:**
- `BalanceScreen` - Bakiye ekranı
- `GroupDetailScreen` - Grup detay ekranı (ödeme geçmişi)

---

### 2.5 Grup Davetiyeleri Subscription

**Amaç:** Bir grup için aktif davetiyeleri real-time dinler.

**Collection Path:**
```
/groups/{groupId}/invites
```

**Query:**
```typescript
const invitesQuery = query(
  collection(db, 'groups', groupId, 'invites'),
  where('status', '==', 'Active'),
  where('expiresAt', '>', Timestamp.now())
);

const unsubscribe = onSnapshot(
  invitesQuery,
  (snapshot) => {
    const invites = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    // Update UI
  },
  (error) => {
    console.error('Invites subscription error:', error);
  }
);
```

**Kullanım Yeri:**
- `GroupDetailScreen` - Grup detay ekranı (davetiye yönetimi)

---

## 3. Subscription Yönetimi

### 3.1 React Hook Pattern

**Custom Hook Örneği:**
```typescript
import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { Expense } from '../types/models';

export function useGroupExpenses(groupId: string) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!groupId) {
      setIsLoading(false);
      return;
    }

    const expensesQuery = query(
      collection(db, 'groups', groupId, 'expenses'),
      where('status', '==', 'Active'),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(
      expensesQuery,
      (snapshot) => {
        const expensesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Expense[];
        
        setExpenses(expensesData);
        setIsLoading(false);
        setError(null);
      },
      (err) => {
        setError(err);
        setIsLoading(false);
      }
    );

    // Cleanup function
    return () => {
      unsubscribe();
    };
  }, [groupId]);

  return { expenses, isLoading, error };
}
```

### 3.2 React Query ile Entegrasyon

**React Query + Firestore:**
```typescript
import { useQuery } from '@tanstack/react-query';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase/config';

export function useGroupExpensesQuery(groupId: string) {
  return useQuery({
    queryKey: ['expenses', groupId],
    queryFn: () => {
      return new Promise((resolve, reject) => {
        const expensesQuery = query(
          collection(db, 'groups', groupId, 'expenses'),
          where('status', '==', 'Active')
        );

        const unsubscribe = onSnapshot(
          expensesQuery,
          (snapshot) => {
            const expenses = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            resolve(expenses);
          },
          reject
        );

        // Cleanup on unmount
        return () => unsubscribe();
      });
    },
    enabled: !!groupId,
    staleTime: Infinity, // Real-time updates, no stale time
  });
}
```

### 3.3 Subscription Cleanup

**Önemli:** Her subscription için cleanup fonksiyonu mutlaka kullanılmalıdır.

```typescript
useEffect(() => {
  const unsubscribe = onSnapshot(query, callback, errorCallback);
  
  // Cleanup: Component unmount olduğunda subscription'ı kapat
  return () => {
    unsubscribe();
  };
}, [dependencies]);
```

**Çoklu Subscription Yönetimi:**
```typescript
useEffect(() => {
  const unsubscribes: (() => void)[] = [];

  // Subscription 1: Groups
  const groupsUnsub = onSnapshot(groupsQuery, groupsCallback);
  unsubscribes.push(groupsUnsub);

  // Subscription 2: Expenses
  const expensesUnsub = onSnapshot(expensesQuery, expensesCallback);
  unsubscribes.push(expensesUnsub);

  // Cleanup: Tüm subscription'ları kapat
  return () => {
    unsubscribes.forEach(unsub => unsub());
  };
}, [groupId]);
```

---

## 4. Event-Driven Architecture

### 4.1 Event Flow

```
User Action (Add Expense)
    ↓
Firestore Write
    ↓
Firestore Trigger (Cloud Function)
    ↓
Update Related Documents
    ↓
Firestore Realtime Listener
    ↓
Client UI Update
```

### 4.2 Event Types

**Document Events:**
- `added`: Yeni doküman eklendi
- `modified`: Doküman güncellendi
- `removed`: Doküman silindi

**Metadata Events:**
```typescript
onSnapshot(query, (snapshot) => {
  snapshot.metadata.hasPendingWrites; // Local write var mı?
  snapshot.metadata.fromCache; // Cache'den mi geldi?
  
  // İlk yükleme kontrolü
  if (snapshot.metadata.fromCache) {
    // Offline data göster
  } else {
    // Online data göster
  }
});
```

---

## 5. Best Practices

### 5.1 Performans Optimizasyonu

**1. Query Limit Kullanımı:**
```typescript
// ❌ Kötü: Tüm harcamaları çek
const expensesQuery = query(
  collection(db, 'groups', groupId, 'expenses')
);

// ✅ İyi: Limit ile sınırla
const expensesQuery = query(
  collection(db, 'groups', groupId, 'expenses'),
  where('status', '==', 'Active'),
  orderBy('date', 'desc'),
  limit(50) // İlk 50 harcama
);
```

**2. Composite Index Kullanımı:**
```typescript
// Firestore'da composite index oluştur
// firestore.indexes.json
{
  "indexes": [
    {
      "collectionGroup": "expenses",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "date", "order": "DESCENDING" }
      ]
    }
  ]
}
```

**3. Pagination:**
```typescript
// İlk sayfa
const firstPageQuery = query(
  collection(db, 'groups', groupId, 'expenses'),
  orderBy('date', 'desc'),
  limit(20)
);

// Sonraki sayfa
const nextPageQuery = query(
  collection(db, 'groups', groupId, 'expenses'),
  orderBy('date', 'desc'),
  startAfter(lastDocument),
  limit(20)
);
```

### 5.2 Error Handling

```typescript
const unsubscribe = onSnapshot(
  query,
  (snapshot) => {
    // Success handler
  },
  (error) => {
    // Error handler
    if (error.code === 'permission-denied') {
      // Kullanıcıya izin hatası göster
    } else if (error.code === 'unavailable') {
      // Offline durumu göster
    } else {
      // Genel hata mesajı
    }
  }
);
```

### 5.3 Offline Support

**Firestore Offline Persistence:**
```typescript
import { enableIndexedDbPersistence } from 'firebase/firestore';

// Uygulama başlangıcında
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code == 'failed-precondition') {
      // Multiple tabs open
    } else if (err.code == 'unimplemented') {
      // Browser doesn't support
    }
  });
```

**Offline Detection:**
```typescript
import { onDisconnect, onConnect } from 'firebase/database';

// Network durumu kontrolü
const unsubscribe = onSnapshot(query, (snapshot) => {
  if (snapshot.metadata.fromCache) {
    // Offline data
    showOfflineIndicator();
  } else {
    // Online data
    hideOfflineIndicator();
  }
});
```

---

## 6. Örnek Implementasyonlar

### 6.1 Grup Listesi Hook

```typescript
// src/hooks/useGroups.ts
import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { Group } from '../types/models';

export function useUserGroups(userId: string | undefined) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const groupsQuery = query(
      collection(db, 'groups'),
      where('ownerId', '==', userId)
    );

    const unsubscribe = onSnapshot(
      groupsQuery,
      (snapshot) => {
        const groupsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Group[];
        
        setGroups(groupsData);
        setIsLoading(false);
        setError(null);
      },
      (err) => {
        setError(err);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return { data: groups, isLoading, error };
}
```

### 6.2 Harcama Listesi Hook

```typescript
// src/hooks/useExpenses.ts
import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { Expense } from '../types/models';

export function useGroupExpenses(
  groupId: string | undefined,
  options?: {
    limitCount?: number;
    category?: string;
    startDate?: Date;
    endDate?: Date;
  }
) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!groupId) {
      setIsLoading(false);
      return;
    }

    let expensesQuery = query(
      collection(db, 'groups', groupId, 'expenses'),
      where('status', '==', 'Active')
    );

    if (options?.category) {
      expensesQuery = query(
        expensesQuery,
        where('category', '==', options.category)
      );
    }

    if (options?.startDate) {
      expensesQuery = query(
        expensesQuery,
        where('date', '>=', options.startDate)
      );
    }

    if (options?.endDate) {
      expensesQuery = query(
        expensesQuery,
        where('date', '<=', options.endDate)
      );
    }

    expensesQuery = query(
      expensesQuery,
      orderBy('date', 'desc'),
      limit(options?.limitCount || 50)
    );

    const unsubscribe = onSnapshot(
      expensesQuery,
      (snapshot) => {
        const expensesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Expense[];
        
        setExpenses(expensesData);
        setIsLoading(false);
        setError(null);
      },
      (err) => {
        setError(err);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [groupId, options?.category, options?.startDate, options?.endDate]);

  return { data: expenses, isLoading, error };
}
```

### 6.3 Bakiye Subscription Hook

```typescript
// src/hooks/useBalance.ts
import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { GroupMember } from '../types/models';

export function useGroupBalances(groupId: string | undefined) {
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!groupId) {
      setIsLoading(false);
      return;
    }

    const membersRef = collection(db, 'groups', groupId, 'members');

    const unsubscribe = onSnapshot(
      membersRef,
      (snapshot) => {
        const membersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as GroupMember[];
        
        // Bakiye değişikliklerini tespit et
        setMembers(membersData);
        setIsLoading(false);
        setError(null);
      },
      (err) => {
        setError(err);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [groupId]);

  return { data: members, isLoading, error };
}
```

---

## Özet

- **Realtime listeners** kullanarak anlık güncellemeler sağlanır
- **Subscription cleanup** mutlaka yapılmalıdır
- **Query limit** ve **pagination** kullanılmalıdır
- **Error handling** ve **offline support** önemlidir
- **Custom hooks** ile subscription yönetimi kolaylaştırılır

