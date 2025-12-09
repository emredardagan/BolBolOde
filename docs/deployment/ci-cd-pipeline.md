# BölBölÖde - CI/CD Pipeline

## İçindekiler
1. [Genel Bakış](#1-genel-bakış)
2. [Pipeline Aşamaları](#2-pipeline-aşamaları)
3. [GitHub Actions](#3-github-actions)
4. [Fastlane](#4-fastlane)
5. [Deployment Stratejisi](#5-deployment-stratejisi)

---

## 1. Genel Bakış

BölBölÖde uygulaması için CI/CD pipeline yapılandırması.

### 1.1 Pipeline Akışı

```
Code Push
    ↓
GitHub Actions
    ↓
Lint & Test
    ↓
Build (iOS/Android)
    ↓
Fastlane
    ↓
TestFlight / Internal Testing
    ↓
Production Release
```

---

## 2. Pipeline Aşamaları

### 2.1 Lint & Test

```yaml
- ESLint check
- TypeScript type check
- Unit tests
- Integration tests
- Coverage check
```

### 2.2 Build

```yaml
iOS:
  - Install dependencies
  - Build iOS app
  - Generate IPA

Android:
  - Install dependencies
  - Build Android app
  - Generate APK/AAB
```

### 2.3 Deploy

```yaml
Development:
  - Firebase App Distribution

Staging:
  - TestFlight (iOS)
  - Internal Testing (Android)

Production:
  - App Store (iOS)
  - Google Play (Android)
```

---

## 3. GitHub Actions

Detaylı workflow için: [github-actions-example.yaml](./github-actions-example.yaml)

### 3.1 Workflow Triggers

```yaml
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
  workflow_dispatch:
```

### 3.2 Jobs

**lint-test:**
- ESLint
- TypeScript check
- Unit tests
- Coverage

**build-ios:**
- Install dependencies
- Build iOS
- Generate IPA

**build-android:**
- Install dependencies
- Build Android
- Generate AAB

**deploy-staging:**
- Fastlane beta
- TestFlight / Internal Testing

**deploy-production:**
- Fastlane release
- App Store / Google Play

---

## 4. Fastlane

Detaylı yapılandırma için: [fastlane-example.rb](./fastlane-example.rb)

### 4.1 Lanes

**ios:**
- `beta`: TestFlight'a yükle
- `release`: App Store'a yükle

**android:**
- `beta`: Internal Testing'e yükle
- `release`: Google Play'e yükle

---

## 5. Deployment Stratejisi

### 5.1 Environments

**Development:**
- Firebase App Distribution
- Manual testing

**Staging:**
- TestFlight (iOS)
- Internal Testing (Android)
- Beta testers

**Production:**
- App Store (iOS)
- Google Play (Android)
- All users

### 5.2 Release Process

1. **Feature Branch:** Development
2. **Merge to Develop:** Staging build
3. **Merge to Main:** Production release
4. **Tag Release:** Version tag

---

## Environment Variables

```bash
# Firebase
FIREBASE_PROJECT_ID
FIREBASE_API_KEY

# iOS
APPLE_ID
APP_STORE_CONNECT_API_KEY

# Android
GOOGLE_PLAY_SERVICE_ACCOUNT
```

---

## Secrets Management

GitHub Secrets kullanılır:
- `FIREBASE_PROJECT_ID`
- `APPLE_ID`
- `APP_STORE_CONNECT_API_KEY`
- `GOOGLE_PLAY_SERVICE_ACCOUNT`

