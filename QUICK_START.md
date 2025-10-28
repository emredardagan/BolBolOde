# BölBölÖde - Hızlı Başlangıç

## ✅ Paketler Kuruldu!

Npm paketleri başarıyla kuruldu. Şimdi uygulamayı başlatabilirsiniz.

## 🚀 Uygulamayı Başlatma

### 1. Expo Development Server Başlat

```bash
npm start
```

veya

```bash
expo start
```

### 2. Platform Seçimi

Terminal'de şu seçenekler çıkacak:
- `i` - iOS Simulator
- `a` - Android Emulator  
- `w` - Web Browser
- QR kod gösterilecek (telefon ile Expo Go app kullanarak)

### iOS Simulator için:
```bash
npm run ios
```

### Android Emulator için:
```bash
npm run android
```

## ⚠️ ÖNEMLİ: Firebase Konfigürasyonu

Uygulama çalışmadan önce Firebase projesini kurmanız gerekiyor:

1. `.env` dosyası oluşturun (proje root klasöründe)
2. Firebase bilgilerini ekleyin:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Detaylı talimatlar için: [SETUP.md](SETUP.md)

## 🛠️ Sorun Giderme

### "Firebase not configured" hatası
- `.env` dosyasını oluşturun
- Firebase bilgilerini ekleyin
- Uygulamayı yeniden başlatın

### Metro bundler hatası
```bash
npm start -- --reset-cache
```

### iOS Simulator açılmıyor
```bash
# Xcode'u açın ve Simulator'u manuel başlatın
open -a Simulator
npm run ios
```

## 📱 Test

1. Uygulama açıldığında **Login** ekranı görünecek
2. **Kayıt Ol** ile yeni hesap oluşturun
3. **Grup Oluştur** ile ilk grubunuzu oluşturun
4. **Harcama Ekle** ile ilk harcamanızı ekleyin

## 🎯 Sonraki Adımlar

- Firebase projesini kurun (SETUP.md)
- Test kullanıcısı oluşturun
- Grup ve harcama ekleyerek test edin
- Dokümantasyonu okuyun (docs/ klasörü)

