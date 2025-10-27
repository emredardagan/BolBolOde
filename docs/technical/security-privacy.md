# BölBölÖde - Güvenlik ve Gizlilik Dokümanı

## İçindekiler
1. [Güvenlik Mimarisi](#1-güvenlik-mimarisi)
2. [Kimlik Doğrulama (Authentication)](#2-kimlik-doğrulama)
3. [Yetkilendirme (Authorization)](#3-yetkilendirme)
4. [Veri Güvenliği](#4-veri-güvenliği)
5. [API Güvenliği](#5-api-güvenliği)
6. [Gizlilik ve KVKK/GDPR](#6-gizlilik-ve-kvkkgdpr)
7. [Güvenlik Best Practices](#7-güvenlik-best-practices)
8. [Incident Response](#8-incident-response)

---

## 1. Güvenlik Mimarisi

### 1.1 Defense in Depth

```
┌─────────────────────────────────────────────────────────┐
│  Layer 1: Network Security                              │
│  • HTTPS/TLS 1.3                                        │
│  • Certificate Pinning (production)                     │
│  • Rate Limiting                                        │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────┼────────────────────────────────────┐
│  Layer 2: Authentication                                │
│  • Firebase Auth (JWT)                                  │
│  • Token Rotation                                       │
│  • Session Management                                   │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────┼────────────────────────────────────┐
│  Layer 3: Authorization                                 │
│  • Role-Based Access Control (RBAC)                     │
│  • Firestore Security Rules                            │
│  • Permission Checks                                    │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────┼────────────────────────────────────┐
│  Layer 4: Data Security                                 │
│  • Encryption at Rest                                   │
│  • Encryption in Transit                                │
│  • Secure Storage (Keychain/Keystore)                   │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────┼────────────────────────────────────┐
│  Layer 5: Application Security                          │
│  • Input Validation                                     │
│  • Output Encoding                                      │
│  • Error Handling                                       │
└─────────────────────────────────────────────────────────┘
```

### 1.2 Security Principles

**Principle of Least Privilege:**
- Kullanıcılar sadece ihtiyaç duydukları verilere erişir
- Default: Deny, explicit allow

**Zero Trust:**
- Her istek doğrulanır
- Frontend validasyonu güvenilmez
- Backend her zaman kontrol eder

**Defense in Depth:**
- Çoklu güvenlik katmanı
- Bir katman başarısız olsa diğeri korur

---

## 2. Kimlik Doğrulama (Authentication)

### 2.1 Firebase Authentication

#### Desteklenen Yöntemler

**Email/Password:**
```typescript
// Kayıt
const { user } = await createUserWithEmailAndPassword(auth, email, password)

// Giriş
const { user } = await signInWithEmailAndPassword(auth, email, password)

// Şifre sıfırlama
await sendPasswordResetEmail(auth, email)
```

**Google OAuth:**
```typescript
import { GoogleAuthProvider } from 'firebase/auth'

const provider = new GoogleAuthProvider()
const { user } = await signInWithPopup(auth, provider)
```

#### Şifre Politikası

```yaml
Minimum Gereksinimler:
  - Uzunluk: 8 karakter
  - En az 1 büyük harf
  - En az 1 küçük harf
  - En az 1 rakam
  - Özel karakter (opsiyonel)

Yasaklı Şifreler:
  - Sık kullanılan şifreler (password123, 12345678, vb.)
  - Kullanıcı adı/email ile aynı
```

**Implementation:**
```typescript
const validatePassword = (password: string): ValidationResult => {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('Şifre en az 8 karakter olmalıdır')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('En az bir büyük harf içermelidir')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('En az bir küçük harf içermelidir')
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('En az bir rakam içermelidir')
  }
  
  const commonPasswords = ['password', '12345678', 'qwerty']
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push('Bu şifre çok yaygın, daha güçlü bir şifre seçin')
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}
```

### 2.2 Token Management

#### JWT Token Structure

```json
{
  "header": {
    "alg": "RS256",
    "typ": "JWT"
  },
  "payload": {
    "iss": "https://securetoken.google.com/bolbolode-prod",
    "aud": "bolbolode-prod",
    "auth_time": 1698412800,
    "user_id": "user_abc123",
    "sub": "user_abc123",
    "iat": 1698412800,
    "exp": 1698416400,
    "email": "user@example.com",
    "email_verified": true,
    "firebase": {
      "identities": {
        "email": ["user@example.com"]
      },
      "sign_in_provider": "password"
    }
  }
}
```

#### Token Lifecycle

```typescript
// Token alma
const token = await user.getIdToken()

// Token yenileme (otomatik - Firebase SDK)
auth.onIdTokenChanged(async (user) => {
  if (user) {
    const token = await user.getIdToken(true) // Force refresh
    await SecureStore.setItemAsync('authToken', token)
  }
})

// Token storage
await SecureStore.setItemAsync('authToken', token, {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY
})

// Token kullanımı
const token = await SecureStore.getItemAsync('authToken')
api.defaults.headers.common['Authorization'] = `Bearer ${token}`
```

#### Token Güvenliği

```yaml
Expiration: 1 saat
Refresh: Otomatik (Firebase SDK)
Storage: SecureStore (Keychain/Keystore)
Transmission: HTTPS only
Revocation: Firebase Admin SDK ile
```

### 2.3 Session Management

```typescript
// Oturum durumu takibi
auth.onAuthStateChanged((user) => {
  if (user) {
    // Kullanıcı giriş yapmış
    authStore.setUser(user)
    navigation.navigate('Main')
  } else {
    // Kullanıcı çıkış yapmış
    authStore.clearUser()
    navigation.navigate('Auth')
  }
})

// Çıkış
const logout = async () => {
  await auth.signOut()
  await SecureStore.deleteItemAsync('authToken')
  await MMKV.clearAll() // Local cache temizle
}

// Oturum timeout (30 gün)
const SESSION_TIMEOUT = 30 * 24 * 60 * 60 * 1000

const checkSessionTimeout = async () => {
  const lastActive = await MMKV.getNumber('lastActiveTimestamp')
  const now = Date.now()
  
  if (now - lastActive > SESSION_TIMEOUT) {
    await logout()
    Alert.alert('Oturum Sonlandı', 'Güvenlik için tekrar giriş yapın')
  } else {
    await MMKV.setNumber('lastActiveTimestamp', now)
  }
}
```

---

## 3. Yetkilendirme (Authorization)

### 3.1 Role-Based Access Control (RBAC)

#### Roller ve Yetkiler

| Yetki | Owner | Editor | Viewer |
|-------|-------|--------|--------|
| Grup görüntüle | ✅ | ✅ | ✅ |
| Harcama görüntüle | ✅ | ✅ | ✅ |
| Bakiye görüntüle | ✅ | ✅ | ✅ |
| Harcama ekle | ✅ | ✅ | ❌ |
| Harcama düzenle (kendi) | ✅ | ✅ | ❌ |
| Harcama düzenle (tümü) | ✅ | ❌ | ❌ |
| Harcama sil (kendi) | ✅ | ✅ | ❌ |
| Harcama sil (tümü) | ✅ | ❌ | ❌ |
| Settlement ekle | ✅ | ✅ | ❌ |
| Üye davet et | ✅ | ❌ | ❌ |
| Üye çıkar | ✅ | ❌ | ❌ |
| Rol değiştir | ✅ | ❌ | ❌ |
| Grup düzenle | ✅ | ❌ | ❌ |
| Grup sil | ✅ | ❌ | ❌ |

#### Permission Check (Client)

```typescript
// hooks/usePermissions.ts
export const usePermissions = (groupId: string) => {
  const { user } = useAuth()
  const { data: member } = useGroupMember(groupId, user.id)
  
  const can = (action: Permission): boolean => {
    if (!member || member.status !== 'Active') {
      return false
    }
    
    switch (action) {
      case 'expense.create':
        return ['Owner', 'Editor'].includes(member.role)
      
      case 'expense.update.own':
        return ['Owner', 'Editor'].includes(member.role)
      
      case 'expense.update.all':
        return member.role === 'Owner'
      
      case 'expense.delete.own':
        return ['Owner', 'Editor'].includes(member.role)
      
      case 'expense.delete.all':
        return member.role === 'Owner'
      
      case 'member.invite':
        return member.role === 'Owner'
      
      case 'member.remove':
        return member.role === 'Owner'
      
      case 'group.update':
        return member.role === 'Owner'
      
      case 'group.delete':
        return member.role === 'Owner'
      
      default:
        return false
    }
  }
  
  return { can, role: member?.role }
}

// Usage
const { can } = usePermissions(groupId)

return (
  <View>
    {can('expense.create') && (
      <Button onPress={handleAddExpense}>Harcama Ekle</Button>
    )}
  </View>
)
```

### 3.2 Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ===== HELPER FUNCTIONS =====
    
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    function getGroupMember(groupId) {
      return get(/databases/$(database)/documents/groups/$(groupId)/members/$(request.auth.uid));
    }
    
    function isGroupMember(groupId) {
      return exists(/databases/$(database)/documents/groups/$(groupId)/members/$(request.auth.uid));
    }
    
    function isActiveMember(groupId) {
      let member = getGroupMember(groupId);
      return member.data.status == 'Active';
    }
    
    function isGroupOwner(groupId) {
      let member = getGroupMember(groupId);
      return member.data.role == 'Owner' && member.data.status == 'Active';
    }
    
    function canEditGroup(groupId) {
      let member = getGroupMember(groupId);
      return member.data.role in ['Owner', 'Editor'] && member.data.status == 'Active';
    }
    
    function isExpenseCreator(expenseData) {
      return request.auth.uid == expenseData.createdBy;
    }
    
    // ===== USERS COLLECTION =====
    
    match /users/{userId} {
      // Herkes kendi bilgilerini okuyabilir
      allow read: if isAuthenticated() && isOwner(userId);
      
      // Sadece kendi bilgilerini yazabilir
      allow write: if isAuthenticated() && isOwner(userId);
    }
    
    // ===== GROUPS COLLECTION =====
    
    match /groups/{groupId} {
      // Grup üyeleri okuyabilir
      allow read: if isAuthenticated() && isGroupMember(groupId);
      
      // Kimlik doğrulanmış herkes grup oluşturabilir
      allow create: if isAuthenticated() &&
                       request.resource.data.ownerId == request.auth.uid;
      
      // Sadece owner güncelleyebilir
      allow update: if isAuthenticated() && isGroupOwner(groupId);
      
      // Sadece owner silebilir
      allow delete: if isAuthenticated() && isGroupOwner(groupId);
      
      // ===== MEMBERS SUBCOLLECTION =====
      
      match /members/{memberId} {
        // Grup üyeleri okuyabilir
        allow read: if isAuthenticated() && isGroupMember(groupId);
        
        // Owner ekleyebilir/çıkarabilir
        allow create: if isAuthenticated() && isGroupOwner(groupId);
        allow update: if isAuthenticated() && isGroupOwner(groupId);
        allow delete: if isAuthenticated() && isGroupOwner(groupId);
      }
      
      // ===== EXPENSES SUBCOLLECTION =====
      
      match /expenses/{expenseId} {
        // Aktif üyeler okuyabilir
        allow read: if isAuthenticated() && isActiveMember(groupId);
        
        // Owner ve Editor ekleyebilir
        allow create: if isAuthenticated() && 
                         canEditGroup(groupId) &&
                         request.resource.data.createdBy == request.auth.uid &&
                         validateExpense(request.resource.data);
        
        // Owner tümünü, Editor kendisininkini düzenleyebilir
        allow update: if isAuthenticated() &&
                         (isGroupOwner(groupId) || 
                          (canEditGroup(groupId) && isExpenseCreator(resource.data))) &&
                         validateExpense(request.resource.data);
        
        // Owner tümünü, Editor kendisininkini silebilir
        allow delete: if isAuthenticated() &&
                         (isGroupOwner(groupId) || 
                          (canEditGroup(groupId) && isExpenseCreator(resource.data)));
        
        // ===== SHARES SUBCOLLECTION =====
        
        match /shares/{shareId} {
          allow read: if isAuthenticated() && isActiveMember(groupId);
          allow write: if isAuthenticated() && canEditGroup(groupId);
        }
      }
      
      // ===== SETTLEMENTS SUBCOLLECTION =====
      
      match /settlements/{settlementId} {
        // Aktif üyeler okuyabilir
        allow read: if isAuthenticated() && isActiveMember(groupId);
        
        // Owner ve Editor ekleyebilir
        allow create: if isAuthenticated() && 
                         canEditGroup(groupId) &&
                         request.resource.data.createdBy == request.auth.uid;
        
        // Owner veya oluşturan güncelleyebilir
        allow update: if isAuthenticated() &&
                         (isGroupOwner(groupId) || isExpenseCreator(resource.data));
        
        // Sadece owner silebilir
        allow delete: if isAuthenticated() && isGroupOwner(groupId);
      }
      
      // ===== INVITES SUBCOLLECTION =====
      
      match /invites/{inviteId} {
        // Herkes okuyabilir (token validation için)
        allow read: if isAuthenticated();
        
        // Sadece owner oluşturabilir
        allow create: if isAuthenticated() && isGroupOwner(groupId);
        allow update: if isAuthenticated() && isGroupOwner(groupId);
        allow delete: if isAuthenticated() && isGroupOwner(groupId);
      }
    }
    
    // ===== ACTIVITY LOGS =====
    
    match /activityLogs/{logId} {
      // Sadece ilgili grup üyeleri okuyabilir
      allow read: if isAuthenticated() && isGroupMember(resource.data.groupId);
      
      // Sistem tarafından yazılır (Cloud Functions)
      allow write: if false;
    }
    
    // ===== EXCHANGE RATES =====
    
    match /exchangeRates/{rateId} {
      // Herkes okuyabilir
      allow read: if isAuthenticated();
      
      // Sadece sistem yazabilir (Cloud Functions)
      allow write: if false;
    }
    
    // ===== VALIDATION FUNCTIONS =====
    
    function validateExpense(expense) {
      return expense.title is string &&
             expense.title.size() >= 2 &&
             expense.title.size() <= 100 &&
             expense.amount is number &&
             expense.amount > 0 &&
             expense.amount <= 100000000 && // 1M TL
             expense.currency is string &&
             expense.currency.size() == 3 &&
             expense.category in ['Food', 'Transport', 'Accommodation', 'Entertainment', 'Shopping', 'Other'] &&
             expense.splitType in ['equal', 'weighted', 'exact', 'percentage'] &&
             expense.participantIds is list &&
             expense.participantIds.size() >= 2 &&
             expense.participantIds.size() <= 100 &&
             expense.status in ['Active', 'Draft', 'Deleted'];
    }
  }
}
```

---

## 4. Veri Güvenliği

### 4.1 Encryption at Rest

**Firestore:**
- Google-managed encryption keys
- AES-256 encryption
- Otomatik, configuration gerekmez

**Firebase Storage:**
- Google-managed encryption
- AES-256 encryption

**Local Storage:**
```typescript
// iOS: Keychain
// Android: EncryptedSharedPreferences / Keystore

import * as SecureStore from 'expo-secure-store'

// Hassas veri saklama
await SecureStore.setItemAsync('authToken', token, {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY
})

// MMKV (encrypted mode)
import { MMKV } from 'react-native-mmkv'

const storage = new MMKV({
  id: 'user-storage',
  encryptionKey: 'some-encryption-key' // Keychain'den al
})
```

### 4.2 Encryption in Transit

**HTTPS/TLS 1.3:**
```yaml
Protocol: TLS 1.3
Cipher Suites:
  - TLS_AES_128_GCM_SHA256
  - TLS_AES_256_GCM_SHA384
  - TLS_CHACHA20_POLY1305_SHA256

Certificate: Let's Encrypt (Firebase Hosting)
HSTS: Enabled
Certificate Pinning: Production only
```

**Certificate Pinning (iOS):**
```xml
<!-- Info.plist -->
<key>NSAppTransportSecurity</key>
<dict>
  <key>NSPinnedDomains</key>
  <dict>
    <key>bolbolode.com</key>
    <dict>
      <key>NSIncludesSubdomains</key>
      <true/>
      <key>NSPinnedCAIdentities</key>
      <array>
        <dict>
          <key>SPKI-SHA256-BASE64</key>
          <string>your-pin-here</string>
        </dict>
      </array>
    </dict>
  </dict>
</dict>
```

### 4.3 Sensitive Data Handling

**PII (Personally Identifiable Information):**
```typescript
// ❌ LOG YAPMA
console.log('User email:', user.email)
console.log('User data:', user)

// ✅ DOĞRU
logger.info('User logged in', { userId: user.id }) // Email yok

// Sentry'ye gönderme
Sentry.configureScope((scope) => {
  scope.setUser({
    id: user.id,
    // email: user.email // ❌ GÖNDERİLMEMELİ
  })
})
```

**Veri Maskeleme:**
```typescript
const maskEmail = (email: string): string => {
  const [name, domain] = email.split('@')
  const maskedName = name[0] + '***' + name[name.length - 1]
  return `${maskedName}@${domain}`
}

// "ahmet@example.com" → "a***t@example.com"
```

---

## 5. API Güvenliği

### 5.1 Rate Limiting

```typescript
// Firebase Functions
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100, // Maksimum 100 request
  message: 'Çok fazla istek. Lütfen daha sonra tekrar deneyin.',
  standardHeaders: true,
  legacyHeaders: false,
})

app.use('/api/', limiter)
```

### 5.2 Input Validation

```typescript
// Tüm input'ları validate et
const validateExpenseInput = (input: any): ValidationResult => {
  const schema = z.object({
    title: z.string().min(2).max(100),
    amount: z.number().positive().max(1_000_000),
    currency: z.string().length(3),
    category: z.enum(['Food', 'Transport', 'Accommodation', 'Entertainment', 'Shopping', 'Other']),
    // ... diğer alanlar
  })
  
  try {
    schema.parse(input)
    return { valid: true }
  } catch (error) {
    return { valid: false, errors: error.errors }
  }
}

// Cloud Function
export const createExpense = functions.https.onCall(async (data, context) => {
  // Auth check
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Giriş gerekli')
  }
  
  // Input validation
  const validation = validateExpenseInput(data)
  if (!validation.valid) {
    throw new functions.https.HttpsError('invalid-argument', 'Geçersiz veri')
  }
  
  // Permission check
  const member = await getMember(data.groupId, context.auth.uid)
  if (!canEditGroup(member)) {
    throw new functions.https.HttpsError('permission-denied', 'Yetkiniz yok')
  }
  
  // Process...
})
```

### 5.3 CORS

```typescript
// Cloud Functions
import cors from 'cors'

const corsOptions = {
  origin: [
    'https://bolbolode.com',
    'https://www.bolbolode.com',
    'https://app.bolbolode.com'
  ],
  credentials: true
}

app.use(cors(corsOptions))
```

---

## 6. Gizlilik ve KVKK/GDPR

### 6.1 Veri İşleme İlkeleri

**Hukuki Dayanak:**
- Açık rıza (kullanıcı onayı)
- Sözleşmenin ifası (hizmet sunumu)
- Meşru menfaat (güvenlik, fraud prevention)

**İşlenen Veriler:**

| Veri Türü | Amaç | Hukuki Dayanak |
|-----------|------|----------------|
| E-posta, Ad Soyad | Kimlik doğrulama | Açık rıza |
| Harcama kayıtları | Hizmet sunumu | Sözleşme |
| IP adresi, cihaz bilgisi | Güvenlik | Meşru menfaat |
| Kullanım istatistikleri | İyileştirme | Açık rıza |

**Veri Saklama Süresi:**
```yaml
Aktif Hesap:
  - Tüm veriler: Hesap silinene kadar

Silinen Hesap:
  - PII: Anında anonymize
  - Harcama kayıtları: 30 gün (grup bütünlüğü için)
  - Log kayıtları: 90 gün (güvenlik/audit)

Yasal Zorunluluk:
  - Vergi kayıtları: 10 yıl (uygulanmaz - B2C)
```

### 6.2 Kullanıcı Hakları

**Erişim Hakkı:**
```typescript
// API: GET /api/user/data
export const getUserData = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new Error('Unauthorized')
  
  const userId = context.auth.uid
  
  // Tüm kullanıcı verilerini topla
  const userData = await db.collection('users').doc(userId).get()
  const groups = await db.collection('groups')
    .where('members', 'array-contains', userId)
    .get()
  
  return {
    user: userData.data(),
    groups: groups.docs.map(doc => doc.data()),
    downloadUrl: await generateDataPackage(userId)
  }
})
```

**Silme Hakkı (Right to Erasure):**
```typescript
// API: DELETE /api/user/account
export const deleteAccount = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new Error('Unauthorized')
  
  const userId = context.auth.uid
  
  // 1. User bilgilerini anonymize et
  await db.collection('users').doc(userId).update({
    email: `deleted_${userId}@anonymous.local`,
    name: 'Deleted User',
    avatar: null,
    deletedAt: admin.firestore.FieldValue.serverTimestamp()
  })
  
  // 2. Grup üyeliklerini güncelle (anonymize)
  const memberDocs = await db.collectionGroup('members')
    .where('userId', '==', userId)
    .get()
  
  const batch = db.batch()
  memberDocs.forEach(doc => {
    batch.update(doc.ref, {
      status: 'Left',
      leftAt: admin.firestore.FieldValue.serverTimestamp()
    })
  })
  await batch.commit()
  
  // 3. Harcama kayıtlarında ismi anonymize
  // (veriler silinmez, grup bütünlüğü için)
  
  // 4. Auth hesabını sil (30 gün sonra)
  await scheduleAuthDeletion(userId, 30)
  
  return { success: true, message: 'Hesabınız 30 gün içinde silinecektir' }
})
```

**Veri Taşınabilirliği:**
```typescript
// JSON export
const exportUserData = async (userId: string): Promise<ExportData> => {
  const user = await getUserData(userId)
  const groups = await getUserGroups(userId)
  const expenses = await getUserExpenses(userId)
  
  return {
    user,
    groups,
    expenses,
    exportDate: new Date().toISOString(),
    format: 'JSON-LD'
  }
}

// CSV export
const exportToCsv = (data: any[]): string => {
  // Implement CSV conversion
}
```

### 6.3 Aydınlatma Metni

**Kullanıcıya Gösterilecek:**
```
BölBölÖde Kişisel Verilerin İşlenmesi Hakkında Aydınlatma

1. Veri Sorumlusu: BölBölÖde
2. İşlenen Veriler:
   - Kimlik: Ad, soyad, e-posta
   - İletişim: Telefon (opsiyonel)
   - İşlem: Harcama kayıtları, ödeme bilgileri
   - Teknik: IP adresi, cihaz bilgisi, log kayıtları

3. İşleme Amaçları:
   - Hizmet sunumu
   - Güvenlik ve fraud prevention
   - İletişim
   - Hizmet iyileştirme

4. Haklarınız:
   - Verilerinize erişim
   - Düzeltme
   - Silme (unutulma hakkı)
   - Veri taşınabilirliği
   - İşlemeye itiraz

5. İletişim: privacy@bolbolode.com
```

---

## 7. Güvenlik Best Practices

### 7.1 Secure Coding

```typescript
// ✅ DOĞRU: Parameterized query (SQL injection önleme - Firestore için geçerli değil ama kavram)
const getUserExpenses = (userId: string) => {
  return db.collection('expenses')
    .where('userId', '==', userId) // Safe
    .get()
}

// ❌ YANLIŞ: Kullanıcı input'u direkt kullanma
const search = (query: string) => {
  // eval(query) // ❌❌❌ ASLA
}

// ✅ DOĞRU: Input sanitization
const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // XSS prevention
    .trim()
    .slice(0, 1000) // Length limit
}

// ✅ DOĞRU: Error handling (bilgi sızıntısı önleme)
try {
  await riskyOperation()
} catch (error) {
  // ❌ Kullanıcıya detaylı hata gösterme
  // throw new Error(`Database error: ${error.message}`)
  
  // ✅ Generic hata + loglama
  logger.error('Operation failed', { error, userId })
  throw new Error('İşlem başarısız oldu')
}
```

### 7.2 Dependency Security

```bash
# Package vulnerability check
npm audit

# Fix vulnerabilities
npm audit fix

# Update dependencies
npm update

# Check outdated packages
npm outdated
```

**Dependabot Configuration (.github/dependabot.yml):**
```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
```

### 7.3 Secret Management

```typescript
// ❌ YANLIŞ: Kod içinde hardcoded
const API_KEY = "sk_live_1234567890"

// ✅ DOĞRU: Environment variables
import Constants from 'expo-constants'

const API_KEY = Constants.expoConfig?.extra?.apiKey

// .env file (gitignore'da!)
// EXPO_PUBLIC_API_KEY=sk_live_1234567890

// app.config.ts
export default {
  extra: {
    apiKey: process.env.EXPO_PUBLIC_API_KEY
  }
}
```

---

## 8. Incident Response

### 8.1 Security Incident Response Plan

**Incident Seviyeleri:**

| Seviye | Açıklama | Response Time | Örnek |
|--------|----------|---------------|-------|
| P0 - Critical | Aktif saldırı, veri sızıntısı | <15 dakika | Database hack |
| P1 - High | Potansiyel güvenlik açığı | <1 saat | XSS vulnerability |
| P2 - Medium | Güvenlik iyileştirme gerekli | <24 saat | Outdated dependency |
| P3 - Low | Minor güvenlik sorunu | <1 hafta | Weak password policy |

**Response Steps:**

```
1. DETECT (Tespit)
   └─> Monitoring alerts
   └─> User reports
   └─> Security scan

2. ASSESS (Değerlendirme)
   └─> Severity rating
   └─> Impact analysis
   └─> Affected users

3. CONTAIN (Sınırlama)
   └─> Isolate affected systems
   └─> Revoke compromised tokens
   └─> Block malicious IPs

4. ERADICATE (Temizleme)
   └─> Remove vulnerability
   └─> Patch systems
   └─> Update credentials

5. RECOVER (İyileştirme)
   └─> Restore services
   └─> Verify integrity
   └─> Monitor for recurrence

6. POST-MORTEM (Analiz)
   └─> Root cause analysis
   └─> Lessons learned
   └─> Update procedures
```

### 8.2 Breach Notification

**Yasal Zorunluluk (KVKK/GDPR):**
- Farkındalık: 72 saat içinde Kurul'a bildirim
- Kullanıcı bildirimi: Yüksek risk varsa

**Bildirim Şablonu:**
```
Konu: Güvenlik Bildirimi

Sayın Kullanıcımız,

[Tarih] tarihinde sistemlerimizde bir güvenlik olayı tespit edilmiştir.

ETKİLENEN VERİLER:
- [Liste]

ALINAN ÖNLEMLER:
- [Liste]

SİZİN YAPMANIZ GEREKENLER:
- Şifrenizi değiştirin
- Şüpheli aktiviteleri raporlayın

İLETİŞİM:
security@bolbolode.com

Özür dileriz,
BölBölÖde Ekibi
```

---

## 9. Security Checklist (Pre-Launch)

```yaml
Authentication:
  ☑ Firebase Auth entegrasyonu
  ☑ Güçlü şifre politikası
  ☑ Token rotation
  ☑ Session timeout

Authorization:
  ☑ RBAC implementation
  ☑ Firestore Security Rules test
  ☑ Permission checks (client + server)

Data Security:
  ☑ HTTPS zorunlu
  ☑ SecureStore kullanımı
  ☑ Sensitive data masking
  ☑ PII handling

API Security:
  ☑ Rate limiting
  ☑ Input validation
  ☑ CORS configuration
  ☑ Error handling

Privacy:
  ☑ Privacy policy
  ☑ Terms of service
  ☑ KVKK/GDPR compliance
  ☑ User consent flow
  ☑ Data deletion mechanism

Code Security:
  ☑ npm audit clean
  ☑ No hardcoded secrets
  ☑ Secure coding practices
  ☑ Code review

Monitoring:
  ☑ Sentry error tracking
  ☑ Security event logging
  ☑ Anomaly detection
  ☑ Incident response plan
```

---

**Versiyon:** 1.0  
**Hazırlayan:** BölBölÖde Ekibi  
**Son Güncelleme:** 27 Ekim 2025  
**Son Gözden Geçirme:** Güvenlik ekibi tarafından onaylanmalı

