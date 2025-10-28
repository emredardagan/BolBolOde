# BölBölÖde - Kurulum Talimatları

## Adım 1: Bağımlılıkları Yükleyin

```bash
npm install
```

## Adım 2: Firebase Projesi Oluşturun

1. [Firebase Console](https://console.firebase.google.com/)'a gidin
2. "Add project" ile yeni proje oluşturun
3. Aşağıdaki servisleri etkinleştirin:

### Authentication
- "Authentication" > "Get started"
- "Sign-in method" > "Email/Password" > Enable

### Firestore Database
- "Firestore Database" > "Create database"
- "Start in test mode" seçin
- Location seçin (örn: europe-west1)

### Storage
- "Storage" > "Get started"
- "Start in test mode" seçin

## Adım 3: Firebase Konfigürasyonu

1. Firebase Console'da "Project settings" > "General"
2. "Your apps" > "Add app" > "Web" seçin
3. Firebase SDK snippet'i kopyalayın
4. `.env` dosyası oluşturun ve aşağıdaki bilgileri ekleyin:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Adım 4: Firestore Security Rules

Firebase Console > Firestore Database > Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    match /groups/{groupId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
      allow delete: if request.auth != null;
      
      match /members/{memberId} {
        allow read: if request.auth != null;
        allow write: if request.auth != null;
      }
      
      match /expenses/{expenseId} {
        allow read: if request.auth != null;
        allow write: if request.auth != null;
      }
      
      match /settlements/{settlementId} {
        allow read: if request.auth != null;
        allow write: if request.auth != null;
      }
    }
  }
}
```

## Adım 5: Uygulamayı Başlatın

```bash
npm start
```

Sonra iOS veya Android simulator'da çalıştırın:

```bash
npm run ios
# veya
npm run android
```

## Sorun Giderme

### "Firebase not configured" hatası
- `.env` dosyasının doğru oluşturulduğundan emin olun
- Expo'yu yeniden başlatın (`npm start`)

### Firebase auth hatası
- Firebase Console'da Authentication > Sign-in method'un aktif olduğunu kontrol edin

### Firestore izin hatası
- Security Rules'un güncel olduğunu kontrol edin
- Firebase Console'da Firestore > Rules

## Test Kullanıcısı Oluşturma

1. Uygulamayı açın
2. "Kayıt Ol" ile yeni hesap oluşturun
3. Firebase Console > Authentication'da kullanıcıyı görebilirsiniz

## Geliştirme Notları

- Firestore test mode'da çalışıyor (production için rules güncellenmeli)
- Tüm veriler gerçek zamanlı senkronize oluyor
- Offline desteği için henüz implement edilmedi (M3 milestone)

