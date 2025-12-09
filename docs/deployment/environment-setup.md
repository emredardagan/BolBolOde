# BölBölÖde - Environment Setup

## İçindekiler
1. [Development Environment](#1-development-environment)
2. [Firebase Setup](#2-firebase-setup)
3. [iOS Setup](#3-ios-setup)
4. [Android Setup](#4-android-setup)
5. [Secrets Management](#5-secrets-management)

---

## 1. Development Environment

### 1.1 Prerequisites

```bash
# Node.js
node --version  # v20.x or higher

# npm
npm --version  # 9.x or higher

# Expo CLI
npm install -g expo-cli

# iOS (macOS only)
xcode-select --version

# Android
java --version  # Java 17 or higher
```

### 1.2 Project Setup

```bash
# Clone repository
git clone https://github.com/yourusername/BolBolOde.git
cd BolBolOde

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

### 1.3 Environment Variables

**.env:**
```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

---

## 2. Firebase Setup

### 2.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project
3. Enable Authentication (Email/Password)
4. Create Firestore database
5. Enable Storage
6. Get configuration values

### 2.2 Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /groups/{groupId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                      request.auth.uid == resource.data.ownerId;
      
      match /expenses/{expenseId} {
        allow read: if request.auth != null;
        allow write: if request.auth != null;
      }
      
      match /members/{memberId} {
        allow read: if request.auth != null;
        allow write: if request.auth != null;
      }
    }
  }
}
```

### 2.3 Cloud Functions

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize Functions
firebase init functions

# Deploy
firebase deploy --only functions
```

---

## 3. iOS Setup

### 3.1 Xcode Setup

```bash
# Install Xcode Command Line Tools
xcode-select --install

# Open Xcode and accept license
sudo xcodebuild -license accept
```

### 3.2 CocoaPods

```bash
# Install CocoaPods
sudo gem install cocoapods

# Install pods
cd ios
pod install
cd ..
```

### 3.3 App Store Connect

1. Create App ID in Apple Developer Portal
2. Create app in App Store Connect
3. Generate API key for CI/CD

---

## 4. Android Setup

### 4.1 Android Studio

1. Install Android Studio
2. Install Android SDK
3. Set ANDROID_HOME environment variable

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### 4.2 Keystore

```bash
# Generate keystore
keytool -genkeypair -v -storetype PKCS12 -keystore android/app/bolbolode-release.keystore -alias bolbolode-key -keyalg RSA -keysize 2048 -validity 10000
```

### 4.3 Google Play Console

1. Create app in Google Play Console
2. Create service account for CI/CD
3. Download service account JSON

---

## 5. Secrets Management

### 5.1 Local Development

**.env.local** (git ignored):
```env
EXPO_PUBLIC_FIREBASE_API_KEY=...
# ... other secrets
```

### 5.2 CI/CD

**GitHub Secrets:**
- `FIREBASE_PROJECT_ID`
- `EXPO_TOKEN`
- `APPLE_ID`
- `APPLE_APP_SPECIFIC_PASSWORD`
- `GOOGLE_SERVICE_ACCOUNT_JSON`

### 5.3 EAS Secrets

```bash
# Set secrets
eas secret:create --scope project --name FIREBASE_API_KEY --value your_key

# List secrets
eas secret:list
```

---

## Development Commands

```bash
# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run tests
npm test

# Lint
npm run lint

# Type check
npm run type-check
```

---

## Troubleshooting

### Firebase Connection Issues

```bash
# Clear cache
npm start -- --reset-cache

# Reinstall dependencies
rm -rf node_modules
npm install
```

### iOS Build Issues

```bash
# Clean build
cd ios
rm -rf build
pod deintegrate
pod install
cd ..
```

### Android Build Issues

```bash
# Clean build
cd android
./gradlew clean
cd ..
```

