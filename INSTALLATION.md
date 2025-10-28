# Kurulum Talimatları

## Adım 1: Node.js Kontrolü

```bash
node --version
# v20.x.x veya üzeri olmalı

npm --version
# veya
yarn --version
```

## Adım 2: Expo CLI Kurulumu

```bash
npm install -g expo-cli
# veya
npm install -g @expo/cli
```

## Adım 3: Proje Bağımlılıklarını Yükle

```bash
npm install
```

**Sorun olursa:**

```bash
# Cache temizle
npm cache clean --force

# node_modules ve package-lock.json'ı sil
rm -rf node_modules package-lock.json

# Tekrar dene
npm install
```

**Alternatif (yarn):**

```bash
yarn install
```

## Adım 4: Expo Başlat

```bash
npm start
# veya
expo start
```

## Yaygın Hatalar ve Çözümleri

### Hata: "Cannot find module 'expo'"
```bash
npm install expo --save
```

### Hata: "React Native version mismatch"
```bash
npm install react-native@0.74.0
```

### Hata: "NativeWind not found"
```bash
npm install nativewind
npm install tailwindcss
```

### Hata: Metro bundler hatası
```bash
npm start -- --reset-cache
```

## Firebase Kurulumu

1. `.env` dosyası oluştur (proje root'unda)
2. Firebase bilgilerini ekle
3. Detaylar için [SETUP.md](SETUP.md) dosyasına bak

## Test

```bash
# iOS Simulator
npm run ios

# Android Emulator
npm run android

# Web browser
npm run web
```

## Gereksinimler

- Node.js 20+
- npm veya yarn
- iOS Simulator (Mac) veya Android Emulator
- Expo Go app (telefon için)

