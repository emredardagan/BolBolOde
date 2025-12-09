# BölBölÖde - Analytics Events

## İçindekiler
1. [Genel Bakış](#1-genel-bakış)
2. [Event Kategorileri](#2-event-kategorileri)
3. [Event Tanımları](#3-event-tanımları)
4. [KPI Metrikleri](#4-kpi-metrikleri)
5. [Implementation](#5-implementation)

---

## 1. Genel Bakış

BölBölÖde uygulaması, kullanıcı davranışlarını ve uygulama performansını takip etmek için Firebase Analytics kullanır.

### 1.1 Analytics Stack

```yaml
Primary: Firebase Analytics
Secondary: Custom Events (Firebase)
Error Tracking: Firebase Crashlytics
Performance: Firebase Performance Monitoring
```

### 1.2 Privacy

- Tüm event'ler KVKK/GDPR uyumlu
- Kullanıcı verileri anonimleştirilir
- Opt-out mekanizması mevcuttur

---

## 2. Event Kategorileri

### 2.1 Authentication Events

```yaml
login_success
login_failed
register_success
register_failed
logout
password_reset_requested
password_reset_completed
```

### 2.2 Group Events

```yaml
group_created
group_viewed
group_updated
group_deleted
group_member_added
group_member_removed
group_invite_sent
group_invite_accepted
```

### 2.3 Expense Events

```yaml
expense_created
expense_viewed
expense_updated
expense_deleted
expense_filtered
expense_searched
```

### 2.4 Balance Events

```yaml
balance_viewed
debt_simplified
settlement_created
settlement_confirmed
settlement_rejected
```

### 2.5 UI Events

```yaml
screen_viewed
button_clicked
form_started
form_completed
form_abandoned
error_shown
```

---

## 3. Event Tanımları

### 3.1 Authentication Events

#### login_success

```typescript
{
  event: 'login_success',
  parameters: {
    method: 'email' | 'google' | 'apple',
    user_id: string, // Hashed
    timestamp: number
  }
}
```

#### register_success

```typescript
{
  event: 'register_success',
  parameters: {
    method: 'email' | 'google' | 'apple',
    user_id: string, // Hashed
    timestamp: number
  }
}
```

---

### 3.2 Group Events

#### group_created

```typescript
{
  event: 'group_created',
  parameters: {
    group_id: string,
    member_count: number,
    base_currency: string,
    has_description: boolean,
    timestamp: number
  }
}
```

#### group_member_added

```typescript
{
  event: 'group_member_added',
  parameters: {
    group_id: string,
    member_count: number,
    invite_method: 'link' | 'qr' | 'email',
    timestamp: number
  }
}
```

---

### 3.3 Expense Events

#### expense_created

```typescript
{
  event: 'expense_created',
  parameters: {
    expense_id: string,
    group_id: string,
    amount: number,
    currency: string,
    category: string,
    split_type: 'equal' | 'weighted' | 'exact' | 'percentage',
    participant_count: number,
    has_attachment: boolean,
    timestamp: number
  }
}
```

#### expense_updated

```typescript
{
  event: 'expense_updated',
  parameters: {
    expense_id: string,
    group_id: string,
    changed_fields: string[], // ['amount', 'category']
    timestamp: number
  }
}
```

---

### 3.4 Balance Events

#### balance_viewed

```typescript
{
  event: 'balance_viewed',
  parameters: {
    group_id: string,
    member_count: number,
    total_balance: number,
    has_settlements: boolean,
    timestamp: number
  }
}
```

#### debt_simplified

```typescript
{
  event: 'debt_simplified',
  parameters: {
    group_id: string,
    member_count: number,
    settlement_count: number,
    total_amount: number,
    timestamp: number
  }
}
```

#### settlement_created

```typescript
{
  event: 'settlement_created',
  parameters: {
    settlement_id: string,
    group_id: string,
    amount: number,
    currency: string,
    payment_method: string,
    timestamp: number
  }
}
```

---

### 3.5 UI Events

#### screen_viewed

```typescript
{
  event: 'screen_viewed',
  parameters: {
    screen_name: string,
    screen_class: string,
    timestamp: number
  }
}
```

#### button_clicked

```typescript
{
  event: 'button_clicked',
  parameters: {
    button_name: string,
    screen_name: string,
    timestamp: number
  }
}
```

---

## 4. KPI Metrikleri

### 4.1 User Engagement

```yaml
Daily Active Users (DAU)
Weekly Active Users (WAU)
Monthly Active Users (MAU)
Session Duration
Screens per Session
```

### 4.2 Feature Usage

```yaml
Groups Created per User
Expenses Created per Group
Average Group Size
Settlement Completion Rate
```

### 4.3 Business Metrics

```yaml
User Retention (D1, D7, D30)
Churn Rate
Conversion Rate (Register → First Group)
Feature Adoption Rate
```

### 4.4 Performance Metrics

```yaml
App Launch Time
Screen Load Time
API Response Time
Error Rate
Crash Rate
```

---

## 5. Implementation

### 5.1 Firebase Analytics Setup

```typescript
// src/lib/analytics.ts
import analytics from '@react-native-firebase/analytics';

export const logEvent = async (
  eventName: string,
  parameters?: Record<string, any>
) => {
  try {
    await analytics().logEvent(eventName, parameters);
  } catch (error) {
    console.error('Analytics error:', error);
  }
};

export const setUserProperty = async (
  property: string,
  value: string
) => {
  try {
    await analytics().setUserProperty(property, value);
  } catch (error) {
    console.error('Analytics error:', error);
  }
};
```

### 5.2 Event Logging Examples

```typescript
// Login success
await logEvent('login_success', {
  method: 'email',
  user_id: hashUserId(userId),
});

// Group created
await logEvent('group_created', {
  group_id: groupId,
  member_count: 1,
  base_currency: 'TRY',
  has_description: !!description,
});

// Expense created
await logEvent('expense_created', {
  expense_id: expenseId,
  group_id: groupId,
  amount: amount,
  currency: currency,
  category: category,
  split_type: splitType,
  participant_count: participantIds.length,
  has_attachment: attachments.length > 0,
});
```

### 5.3 Screen Tracking

```typescript
// src/navigation/AppNavigator.tsx
import { useNavigation } from '@react-navigation/native';
import { logEvent } from '../lib/analytics';

useEffect(() => {
  const unsubscribe = navigation.addListener('state', (e) => {
    const currentRoute = getCurrentRoute(e.data.state);
    logEvent('screen_viewed', {
      screen_name: currentRoute.name,
      screen_class: currentRoute.name,
    });
  });

  return unsubscribe;
}, [navigation]);
```

### 5.4 User Properties

```typescript
// Set user properties on login
await setUserProperty('preferred_currency', user.preferredCurrency);
await setUserProperty('locale', user.locale);
await setUserProperty('group_count', userGroups.length.toString());
```

---

## Event Naming Convention

- **Format:** `snake_case`
- **Pattern:** `{category}_{action}`
- **Examples:**
  - `login_success`
  - `expense_created`
  - `group_member_added`

---

## Privacy & Compliance

### Opt-out Mechanism

```typescript
// src/lib/analytics.ts
export const setAnalyticsEnabled = async (enabled: boolean) => {
  await analytics().setAnalyticsCollectionEnabled(enabled);
};
```

### Data Anonymization

- User ID'ler hash'lenir
- Kişisel bilgiler gönderilmez
- Sadece aggregate data kullanılır

---

## Dashboard & Reports

### Firebase Console

- Real-time event monitoring
- Custom event reports
- User property analysis
- Funnel analysis
- Cohort analysis

### Custom Reports

- Weekly usage reports
- Feature adoption tracking
- Error rate monitoring
- Performance metrics

---

## Best Practices

1. **Event Naming:** Consistent, descriptive names
2. **Parameter Limits:** Max 25 parameters per event
3. **Value Types:** String, number, boolean only
4. **Privacy:** No PII in events
5. **Performance:** Async logging, no blocking
6. **Testing:** Test events in debug mode

---

## Testing

### Debug Mode

```typescript
// Enable debug mode
await analytics().setAnalyticsCollectionEnabled(true);
```

### Test Events

```typescript
// Test event logging
await logEvent('test_event', {
  test_parameter: 'test_value',
});
```

---

## Event Checklist

### Must Track
- [x] User registration
- [x] User login
- [x] Group creation
- [x] Expense creation
- [x] Balance viewing
- [x] Settlement creation

### Should Track
- [ ] Screen views
- [ ] Button clicks
- [ ] Form completions
- [ ] Error occurrences
- [ ] Feature usage

### Nice to Track
- [ ] Search queries
- [ ] Filter usage
- [ ] Export actions
- [ ] Share actions

