# BölBölÖde - Test Stratejisi

## İçindekiler
1. [Genel Bakış](#1-genel-bakış)
2. [Test Piramidi](#2-test-piramidi)
3. [Unit Testler](#3-unit-testler)
4. [Integration Testler](#4-integration-testler)
5. [E2E Testler](#5-e2e-testler)
6. [Test Coverage](#6-test-coverage)
7. [CI/CD Entegrasyonu](#7-cicd-entegrasyonu)

---

## 1. Genel Bakış

### 1.1 Test Yaklaşımı

BölBölÖde uygulaması için **test-driven development (TDD)** ve **behavior-driven development (BDD)** prensiplerini benimser.

**Test Kategorileri:**
- **Unit Tests:** Fonksiyon ve component seviyesi
- **Integration Tests:** Servis ve hook seviyesi
- **E2E Tests:** Kullanıcı akışları
- **Snapshot Tests:** UI değişikliklerini tespit

### 1.2 Test Stack

```yaml
Unit Testing:
  - Jest: Test runner ve assertion library
  - React Native Testing Library: Component testing
  - @testing-library/jest-native: RN-specific matchers

Integration Testing:
  - Jest: Test runner
  - MSW (Mock Service Worker): API mocking
  - Firebase Emulator: Backend mocking

E2E Testing:
  - Detox: React Native E2E framework
  - iOS Simulator / Android Emulator

Coverage:
  - Jest Coverage: Code coverage reports
  - Coverage Threshold: %80 minimum
```

---

## 2. Test Piramidi

```
        /\
       /  \
      / E2E \        (10%)
     /--------\
    /          \
   / Integration \   (30%)
  /--------------\
 /                \
/   Unit Tests     \  (60%)
/------------------\
```

### 2.1 Dağılım

- **Unit Tests:** %60 - Hızlı, izole, çok sayıda
- **Integration Tests:** %30 - Orta hız, servisler arası
- **E2E Tests:** %10 - Yavaş, kritik akışlar

---

## 3. Unit Testler

### 3.1 Algoritma Testleri

**Dosya:** `src/services/algorithms/__tests__/`

**Örnek:**
```typescript
// debt-settlement.test.ts
import { simplifyDebts } from '../debt-settlement';
import { Balance } from '../../../types/models';

describe('simplifyDebts', () => {
  it('should simplify simple 3-person debt', () => {
    const balances: Balance[] = [
      { memberId: 'A', name: 'Ahmet', balance: 50000 },
      { memberId: 'B', name: 'Mehmet', balance: -30000 },
      { memberId: 'C', name: 'Ayşe', balance: -20000 }
    ];

    const result = simplifyDebts(balances);

    expect(result).toHaveLength(2);
    expect(result[0].amount).toBe(30000);
    expect(result[1].amount).toBe(20000);
  });

  it('should throw error for invalid balances', () => {
    const balances: Balance[] = [
      { memberId: 'A', name: 'Ahmet', balance: 10000 },
      { memberId: 'B', name: 'Mehmet', balance: -20000 }
    ];

    expect(() => simplifyDebts(balances)).toThrow('Bakiye toplamı sıfır değil');
  });
});
```

### 3.2 Utility Fonksiyon Testleri

**Dosya:** `src/services/algorithms/__tests__/currency-conversion.test.ts`

```typescript
import { formatCurrency, toMinorUnits, convertCurrency } from '../currency-conversion';
import { Currency } from '../../../types/enums';

describe('currency-conversion', () => {
  describe('formatCurrency', () => {
    it('should format TRY correctly', () => {
      expect(formatCurrency(50000, Currency.TRY)).toBe('₺500,00');
    });

    it('should format USD correctly', () => {
      expect(formatCurrency(10000, Currency.USD)).toBe('$100,00');
    });
  });

  describe('toMinorUnits', () => {
    it('should convert TRY to kuruş', () => {
      expect(toMinorUnits(500.50, Currency.TRY)).toBe(50050);
    });
  });
});
```

### 3.3 Component Testleri

**Dosya:** `src/components/__tests__/`

```typescript
// BalanceCard.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { BalanceCard } from '../features/BalanceCard';
import { Balance } from '../../types/models';

describe('BalanceCard', () => {
  it('should render positive balance in green', () => {
    const balance: Balance = {
      memberId: 'A',
      name: 'Ahmet',
      balance: 50000
    };

    render(<BalanceCard balance={balance} />);

    expect(screen.getByText('Ahmet')).toBeTruthy();
    expect(screen.getByText('+₺500,00')).toBeTruthy();
  });

  it('should render negative balance in red', () => {
    const balance: Balance = {
      memberId: 'B',
      name: 'Mehmet',
      balance: -30000
    };

    render(<BalanceCard balance={balance} />);

    expect(screen.getByText('-₺300,00')).toBeTruthy();
  });
});
```

### 3.4 Hook Testleri

**Dosya:** `src/hooks/__tests__/`

```typescript
// useGroups.test.ts
import { renderHook, waitFor } from '@testing-library/react-native';
import { useUserGroups } from '../useGroups';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('useUserGroups', () => {
  it('should fetch user groups', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );

    const { result } = renderHook(() => useUserGroups('user123'), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
  });
});
```

---

## 4. Integration Testler

### 4.1 Firebase Integration Tests

**Dosya:** `src/lib/firebase/__tests__/`

```typescript
// firestore.test.ts
import { createGroup, getGroup } from '../firestore';
import { Group } from '../../../types/models';

describe('Firestore Integration', () => {
  it('should create and retrieve a group', async () => {
    const group: Group = {
      id: 'test-group',
      name: 'Test Group',
      // ... other fields
    };

    await createGroup(group);
    const retrieved = await getGroup('test-group');

    expect(retrieved).toBeDefined();
    expect(retrieved?.name).toBe('Test Group');
  });
});
```

### 4.2 Service Integration Tests

**Dosya:** `src/services/__tests__/`

```typescript
// balance-calculation.test.ts
import { calculateBalances } from '../algorithms/balance-calculation';
import { Expense } from '../../../types/models';

describe('Balance Calculation Integration', () => {
  it('should calculate balances from expenses', async () => {
    const expenses: Expense[] = [
      {
        id: 'exp1',
        amount: 30000,
        payerId: 'A',
        participantIds: ['A', 'B', 'C'],
        // ... other fields
      }
    ];

    const balances = calculateBalances(expenses);

    expect(balances).toHaveLength(3);
    expect(balances[0].balance).toBe(20000); // A ödedi 30000, payı 10000
  });
});
```

---

## 5. E2E Testler

### 5.1 Detox Setup

**Dosya:** `.detoxrc.js`

```javascript
module.exports = {
  testRunner: {
    args: {
      '$0': 'jest',
      config: 'e2e/jest.config.js'
    },
    jest: {
      setupTimeout: 120000
    }
  },
  apps: {
    'ios.debug': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/BolBolOde.app',
      build: 'xcodebuild -workspace ios/BolBolOde.xcworkspace -scheme BolBolOde -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build'
    },
    'android.debug': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      build: 'cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug'
    }
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: {
        type: 'iPhone 14'
      }
    },
    emulator: {
      type: 'android.emulator',
      device: {
        avdName: 'Pixel_4_API_30'
      }
    }
  },
  configurations: {
    'ios.sim.debug': {
      device: 'simulator',
      app: 'ios.debug'
    },
    'android.emu.debug': {
      device: 'emulator',
      app: 'android.debug'
    }
  }
};
```

### 5.2 E2E Test Senaryoları

**Dosya:** `e2e/flows/auth.e2e.ts`

```typescript
describe('Authentication Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('should login successfully', async () => {
    await element(by.id('email-input')).typeText('test@example.com');
    await element(by.id('password-input')).typeText('password123');
    await element(by.id('login-button')).tap();

    await waitFor(element(by.id('group-list')))
      .toBeVisible()
      .withTimeout(5000);
  });

  it('should register new user', async () => {
    await element(by.id('register-link')).tap();
    await element(by.id('name-input')).typeText('Test User');
    await element(by.id('email-input')).typeText('newuser@example.com');
    await element(by.id('password-input')).typeText('password123');
    await element(by.id('confirm-password-input')).typeText('password123');
    await element(by.id('register-button')).tap();

    await waitFor(element(by.id('group-list')))
      .toBeVisible()
      .withTimeout(5000);
  });
});
```

**Dosya:** `e2e/flows/expense.e2e.ts`

```typescript
describe('Expense Flow', () => {
  beforeEach(async () => {
    await device.launchApp();
    // Login and navigate to group
  });

  it('should add new expense', async () => {
    await element(by.id('add-expense-button')).tap();
    await element(by.id('expense-title-input')).typeText('Restoran Yemeği');
    await element(by.id('expense-amount-input')).typeText('250.00');
    await element(by.id('expense-payer-select')).tap();
    await element(by.id('member-A')).tap();
    await element(by.id('expense-submit-button')).tap();

    await waitFor(element(by.text('Restoran Yemeği')))
      .toBeVisible()
      .withTimeout(3000);
  });
});
```

---

## 6. Test Coverage

### 6.1 Coverage Hedefleri

```yaml
Overall Coverage: %80+
Critical Paths: %95+
Algorithms: %100
Utilities: %90+
Components: %75+
Hooks: %85+
Services: %90+
```

### 6.2 Coverage Konfigürasyonu

**Dosya:** `jest.config.js`

```javascript
module.exports = {
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/**/__mocks__/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    './src/services/algorithms/': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};
```

### 6.3 Coverage Raporu

```bash
# Coverage raporu oluştur
npm run test:coverage

# HTML raporu aç
open coverage/lcov-report/index.html
```

---

## 7. CI/CD Entegrasyonu

### 7.1 GitHub Actions Workflow

**Dosya:** `.github/workflows/test.yml`

```yaml
name: Tests

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:coverage

  integration-tests:
    runs-on: ubuntu-latest
    services:
      firebase-emulator:
        image: node:20
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run test:integration

  e2e-tests:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:e2e:ios
```

### 7.2 Pre-commit Hooks

**Dosya:** `.husky/pre-commit`

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run test:unit
npm run lint
```

---

## Test Senaryoları Özeti

### Kritik Test Senaryoları

1. **Authentication:**
   - Login başarılı/başarısız
   - Register başarılı/başarısız
   - Token refresh
   - Logout

2. **Group Management:**
   - Grup oluşturma
   - Grup listeleme
   - Grup detay görüntüleme
   - Üye ekleme/çıkarma

3. **Expense Management:**
   - Harcama ekleme
   - Harcama düzenleme
   - Harcama silme
   - Farklı paylaşım tipleri

4. **Balance Calculation:**
   - Bakiye hesaplama
   - Borç sadeleştirme
   - Yuvarlama hataları

5. **Currency Conversion:**
   - Para birimi dönüşümü
   - Yuvarlama kuralları
   - FX rate güncellemeleri

---

## Best Practices

1. **Test İzolasyonu:** Her test bağımsız çalışmalı
2. **Mock Kullanımı:** External dependencies mock'lanmalı
3. **Test Verileri:** Gerçekçi test verileri kullanılmalı
4. **Assertion Mesajları:** Açıklayıcı hata mesajları
5. **Test Organizasyonu:** Mantıklı klasör yapısı
6. **CI/CD:** Tüm testler CI'da çalışmalı
7. **Coverage Tracking:** Coverage düşmemeli

---

## Test Komutları

```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e:ios
npm run test:e2e:android

# Coverage
npm run test:coverage

# Watch mode
npm run test:watch

# All tests
npm test
```

