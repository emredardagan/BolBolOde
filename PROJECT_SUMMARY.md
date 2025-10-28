# BölBölÖde - Proje Özeti

## Oluşturulan Dosyalar

### Konfigürasyon Dosyaları
- `package.json` - Proje bağımlılıkları ve scriptler
- `tsconfig.json` - TypeScript konfigürasyonu
- `app.json` - Expo uygulama ayarları
- `tailwind.config.js` - NativeWind konfigürasyonu
- `babel.config.js` - Babel konfigürasyonu
- `.eslintrc.js` - ESLint ayarları
- `.gitignore` - Git ignore kuralları

### Ana Dosyalar
- `App.tsx` - Ana uygulama bileşeni
- `global.css` - Tailwind CSS global dosyası

### Type Definitions (`src/types/`)
- `models.ts` - Veri modelleri (User, Group, Expense, vb.)
- `enums.ts` - Enum tanımları
- `api.ts` - API request/response tipleri

### Constants (`src/constants/`)
- `config.ts` - Uygulama sabitleri
- `currencies.ts` - Para birimi bilgileri
- `categories.ts` - Harcama kategorileri

### Firebase (`src/lib/firebase/`)
- `config.ts` - Firebase başlatma
- `auth.ts` - Authentication servisleri
- `firestore.ts` - Firestore operasyonları

### Algorithms (`src/services/algorithms/`)
- `debt-settlement.ts` - Borç sadeleştirme algoritması
- `currency-conversion.ts` - Para birimi dönüşümleri
- `balance-calculation.ts` - Bakiye hesaplamaları

### State Management (`src/store/`)
- `authStore.ts` - Authentication state
- `uiStore.ts` - UI preferences

### Hooks (`src/hooks/`)
- `useAuth.ts` - Authentication hook
- `useGroups.ts` - Grup yönetimi hooks
- `useExpenses.ts` - Harcama yönetimi hooks

### Navigation (`src/navigation/`)
- `AppNavigator.tsx` - Ana navigasyon
- `AuthNavigator.tsx` - Auth ekranları navigasyonu
- `MainNavigator.tsx` - Ana ekranlar (Tab Navigator)

### Screens (`src/screens/`)
- `auth/`
  - `LoginScreen.tsx` - Giriş ekranı
  - `RegisterScreen.tsx` - Kayıt ekranı
- `groups/`
  - `GroupListScreen.tsx` - Grup listesi
  - `GroupDetailScreen.tsx` - Grup detayı
  - `CreateGroupScreen.tsx` - Grup oluşturma
- `profile/`
  - `ProfileScreen.tsx` - Profil ekranı

## Özellikler

### Tamamlanan (MVP)
✅ Kullanıcı kaydı ve girişi  
✅ Firebase Authentication entegrasyonu  
✅ Grup oluşturma  
✅ Grup listesi görüntüleme  
✅ Grup detayları  
✅ Firestore veritabanı entegrasyonu  
✅ TypeScript tip güvenliği  
✅ Tailwind CSS styling  
✅ React Query ile state management  
✅ Zustand ile local state  
✅ Navigation yapısı  

### Geliştirilecek
⏳ Harcama ekleme ekranı  
⏳ Harcama listesi  
⏳ Bakiye hesaplama ekranı  
⏳ Borç sadeleştirme UI  
⏳ Üye davetiyesi  
⏳ Fiş fotoğrafı ekleme  
⏳ Çoklu para birimi desteği  
⏳ Offline senkronizasyon  
⏳ Push bildirimleri  

## Mimari

### Katmanlı Mimari
```
Presentation Layer (Screens)
    ↓
Business Logic Layer (Hooks, Services)
    ↓
Data Layer (Firebase, MMKV)
```

### State Management
- **Server State:** React Query (Firebase data)
- **Local State:** Zustand (UI state, preferences)
- **Persistent Storage:** MMKV (caching)

### Algoritmalar
- **Debt Settlement:** Greedy algorithm
- **Currency Conversion:** ISO 4217 compliant
- **Balance Calculation:** Real-time updates

## Sonraki Adımlar

1. Firebase projesini kurun ve `.env` dosyasını oluşturun
2. `npm install` ile bağımlılıkları yükleyin
3. `npm start` ile uygulamayı başlatın
4. Harcama ekleme ekranını implement edin
5. Bakiye hesaplama UI'ını ekleyin
6. Üye davetiyesi flow'unu tamamlayın

## Dokümantasyon

- [Ürün Gereksinimleri](docs/prd/product-requirements.md)
- [Kullanıcı Hikayeleri](docs/prd/user-stories.md)
- [Teknik Mimari](docs/technical/architecture-overview.md)
- [Veri Modeli](docs/technical/data-model.md)
- [Roadmap](docs/roadmap/milestones.md)

