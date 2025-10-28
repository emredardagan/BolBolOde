# BölBölÖde - Mobile App

Ortak harcama yönetimi ve paylaşımı uygulaması - Expo React Native mobile app

## Teknoloji Stack

- **Framework:** React Native + Expo SDK 51+
- **Language:** TypeScript 5.0+
- **State Management:** TanStack Query + Zustand
- **Storage:** MMKV + AsyncStorage
- **Navigation:** React Navigation 6.x
- **Styling:** NativeWind (Tailwind for React Native)
- **Forms:** React Hook Form + Zod
- **Backend:** Firebase (Auth, Firestore, Storage)

## Kurulum

### Gereksinimler

- Node.js 20+
- npm veya yarn
- Expo CLI
- iOS Simulator (Mac) veya Android Emulator
- Firebase hesabı

### Adımlar

1. **Bağımlılıkları yükleyin:**

```bash
npm install
```

2. **Environment variables oluşturun:**

`.env` dosyası oluşturun ve Firebase konfigürasyonunuzu ekleyin:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

3. **Firebase projesini kurun:**

- Firebase Console'da yeni bir proje oluşturun
- Authentication'ı etkinleştirin (Email/Password)
- Firestore Database'i oluşturun
- Storage'ı etkinleştirin
- Konfigürasyon bilgilerini `.env` dosyasına ekleyin

4. **Uygulamayı başlatın:**

```bash
npm start
```

5. **iOS veya Android'de çalıştırın:**

```bash
npm run ios
# veya
npm run android
```

## Proje Yapısı

```
src/
├── screens/          # Ekran bileşenleri
│   ├── auth/         # Login, Register
│   ├── groups/       # Grup listesi, detay, oluşturma
│   └── profile/      # Profil ekranı
├── components/       # Yeniden kullanılabilir bileşenler
├── hooks/            # Custom hooks
│   ├── useAuth.ts
│   ├── useGroups.ts
│   └── useExpenses.ts
├── services/         # Business logic
│   └── algorithms/   # Debt settlement, currency conversion
├── lib/              # Utilities
│   └── firebase/     # Firebase konfigürasyonu
├── store/            # Zustand stores
├── types/            # TypeScript type definitions
├── constants/        # Sabitler
└── navigation/      # Navigation setup
```

## Özellikler (MVP)

- ✅ Kullanıcı kaydı ve girişi
- ✅ Grup oluşturma
- ✅ Grup detayları görüntüleme
- ⏳ Harcama ekleme (geliştiriliyor)
- ⏳ Bakiye hesaplama (geliştiriliyor)
- ⏳ Borç sadeleştirme (geliştiriliyor)

## Geliştirme

### Test Çalıştırma

```bash
npm test
```

### Linting

```bash
npm run lint
```

### Type Check

```bash
npm run type-check
```

## Dokümantasyon

Detaylı dokümantasyon için [docs/](docs/) klasörüne bakın.

## Lisans

MIT
