# BölBölÖde - Ekran Spesifikasyonları

## İçindekiler
1. [Auth Ekranları](#1-auth-ekranları)
2. [Grup Ekranları](#2-grup-ekranları)
3. [Harcama Ekranları](#3-harcama-ekranları)
4. [Bakiye Ekranları](#4-bakiye-ekranları)
5. [Profil Ekranları](#5-profil-ekranları)

---

## 1. Auth Ekranları

### 1.1 Login Screen

**Route:** `/auth/login`  
**Navigator:** `AuthNavigator`  
**Component:** `LoginScreen`

#### Başlık
- **Text:** "BölBölÖde"
- **Style:** 3xl, bold, center aligned
- **Position:** Top center

#### Form Alanları

**Email Input:**
- **Placeholder:** "E-posta"
- **Type:** email-address
- **AutoCapitalize:** none
- **Validation:** Required, email format

**Password Input:**
- **Placeholder:** "Şifre"
- **Type:** password (secureTextEntry)
- **Validation:** Required, min 6 characters

#### CTA Buttons

**Primary Button:**
- **Text:** "Giriş Yap"
- **Action:** `handleLogin()`
- **Loading State:** ActivityIndicator göster
- **Disabled State:** Loading sırasında disabled

**Secondary Link:**
- **Text:** "Hesabın yok mu? Kayıt ol"
- **Action:** Navigate to Register screen
- **Style:** Primary color, center aligned

#### Boş Durum
- Yok (her zaman form gösterilir)

#### Error States
- **Alert:** "Hata" - "Lütfen tüm alanları doldurun"
- **Alert:** "Giriş Hatası" - Error message

---

### 1.2 Register Screen

**Route:** `/auth/register`  
**Navigator:** `AuthNavigator`  
**Component:** `RegisterScreen`

#### Başlık
- **Text:** "Kayıt Ol"
- **Style:** 2xl, bold

#### Form Alanları

**Name Input:**
- **Placeholder:** "Ad Soyad"
- **Validation:** Required

**Email Input:**
- **Placeholder:** "E-posta"
- **Type:** email-address
- **AutoCapitalize:** none
- **Validation:** Required, email format

**Password Input:**
- **Placeholder:** "Şifre"
- **Type:** password
- **Validation:** Required, min 6 characters

**Confirm Password Input:**
- **Placeholder:** "Şifre Tekrar"
- **Type:** password
- **Validation:** Required, must match password

#### CTA Buttons

**Primary Button:**
- **Text:** "Kayıt Ol"
- **Action:** `handleRegister()`
- **Loading State:** ActivityIndicator

**Secondary Link:**
- **Text:** "Zaten hesabın var mı? Giriş yap"
- **Action:** Navigate to Login screen

---

## 2. Grup Ekranları

### 2.1 Group List Screen

**Route:** `/groups`  
**Navigator:** `MainNavigator > GroupsStack`  
**Component:** `GroupListScreen`  
**Tab:** Groups (Bottom Tab)

#### Header
- **Text:** "Gruplarım"
- **Style:** 2xl, bold
- **Position:** Top, white background, border bottom

#### Content

**Group Card:**
- **Emoji:** Group emoji (default: 💰)
- **Name:** Group name (lg, semibold)
- **Member Count:** "{count} üye" (gray-500)
- **Action:** Navigate to GroupDetail
- **Style:** White card, rounded, border, padding

#### Floating Action Button
- **Icon:** "+"
- **Position:** Bottom right, fixed
- **Action:** Navigate to CreateGroup
- **Style:** Primary color, rounded-full, shadow

#### Boş Durum
- **Message:** "Henüz grup oluşturmadınız"
- **CTA Button:** "İlk Grubunu Oluştur"
- **Action:** Navigate to CreateGroup
- **Style:** Center aligned, primary button

#### Loading State
- **Text:** "Yükleniyor..."
- **Position:** Center

---

### 2.2 Create Group Screen

**Route:** `/groups/create`  
**Navigator:** `GroupsStack`  
**Component:** `CreateGroupScreen`

#### Başlık
- **Text:** "Yeni Grup Oluştur"
- **Style:** 2xl, bold

#### Form Alanları

**Group Name:**
- **Label:** "Grup Adı *"
- **Placeholder:** "Örn: Kapadokya Gezisi"
- **Validation:** Required, trim check

**Description:**
- **Label:** "Açıklama"
- **Placeholder:** "Grup hakkında kısa bilgi"
- **Type:** Multiline (3 lines)
- **Validation:** Optional

**Base Currency:**
- **Label:** "Para Birimi"
- **Type:** Button group (CURRENCY_LIST)
- **Format:** "{symbol} {code}" (e.g., "₺ TRY")
- **Selected State:** Primary background, white text
- **Default:** TRY

#### CTA Button
- **Text:** "Grup Oluştur"
- **Action:** `handleCreate()`
- **Loading State:** ActivityIndicator
- **Success:** Navigate to GroupDetail

---

### 2.3 Group Detail Screen

**Route:** `/groups/:id`  
**Navigator:** `GroupsStack`  
**Component:** `GroupDetailScreen`

#### Header
- **Back Button:** Left arrow
- **Title:** Group name
- **Actions:** Settings icon (right)

#### Group Info Section
- **Emoji:** Large emoji display
- **Name:** Group name
- **Description:** Group description (if exists)
- **Base Currency:** Currency badge
- **Member Count:** "{count} üye"
- **Total Expenses:** Formatted amount

#### Tabs/Sections
1. **Expenses Tab**
   - List of recent expenses
   - "Add Expense" button
2. **Members Tab**
   - Member list with avatars
   - "Invite Member" button
3. **Balance Tab**
   - Navigate to BalanceScreen

#### Quick Actions
- **Add Expense Button:** Primary, prominent
- **Invite Member Button:** Secondary
- **View Balance Button:** Secondary

#### Boş Durum (Expenses)
- **Message:** "Henüz harcama eklenmedi"
- **CTA:** "İlk Harcamayı Ekle"

---

## 3. Harcama Ekranları

### 3.1 Expense List Screen

**Route:** `/groups/:id/expenses`  
**Navigator:** `GroupsStack`  
**Component:** `ExpenseListScreen`

#### Header
- **Title:** "Harcamalar"
- **Filter Button:** Right (category, date range)

#### Expense Card
- **Title:** Expense title (lg, semibold)
- **Amount:** Formatted currency (bold, primary)
- **Category:** Category emoji + name
- **Date:** Formatted date (gray)
- **Payer:** "Ödeyen: {name}"
- **Participants:** Avatar list or count
- **Action:** Navigate to ExpenseDetail (tap)

#### Floating Action Button
- **Icon:** "+"
- **Action:** Navigate to AddExpense
- **Position:** Bottom right

#### Filters
- **Category Filter:** Chip buttons
- **Date Range:** Date picker
- **Status Filter:** Active/All

#### Boş Durum
- **Message:** "Henüz harcama yok"
- **CTA:** "İlk Harcamayı Ekle"

---

### 3.2 Add Expense Screen

**Route:** `/groups/:id/expenses/add`  
**Navigator:** `GroupsStack`  
**Component:** `AddExpenseScreen`

#### Başlık
- **Text:** "Harcama Ekle"
- **Style:** 2xl, bold

#### Form Alanları

**Title:**
- **Label:** "Başlık *"
- **Placeholder:** "Örn: Restoran Yemeği"
- **Validation:** Required

**Amount:**
- **Label:** "Tutar *"
- **Input:** Decimal pad keyboard
- **Currency Selector:** Dropdown or button
- **Format:** "{amount} {currency}"
- **Validation:** Required, > 0

**Category:**
- **Label:** "Kategori"
- **Type:** Button group (CATEGORY_LIST)
- **Format:** "{emoji} {name}"
- **Default:** Food

**Payer:**
- **Label:** "Ödeyen Kişi *"
- **Type:** Radio button list (members)
- **Selected State:** Primary background
- **Validation:** Required

**Participants:**
- **Label:** "Dahil Olan Kişiler *"
- **Type:** Checkbox list (members)
- **Selected State:** Primary border + background
- **Validation:** Required, min 1

**Split Type:** (Future)
- Equal, Weighted, Exact, Percentage

#### CTA Button
- **Text:** "Harcamayı Kaydet"
- **Action:** `handleSubmit()`
- **Loading State:** ActivityIndicator
- **Success:** Navigate back

---

## 4. Bakiye Ekranları

### 4.1 Balance Screen

**Route:** `/groups/:id/balance`  
**Navigator:** `GroupsStack`  
**Component:** `BalanceScreen`

#### Header
- **Title:** "Bakiyeler"
- **Style:** xl, bold

#### Balance Section
- **Title:** "Kişi Bakiyeleri"
- **Style:** lg, semibold

**Balance Card:**
- **Name:** Member name (lg, semibold)
- **Balance:** Formatted currency
  - **Positive:** Green (success-600), "+" prefix
  - **Negative:** Red (danger-600)
- **Style:** White card, rounded, border

#### Settlement Suggestions Section
- **Title:** "Önerilen Transferler"
- **Style:** lg, semibold
- **Conditional:** Only show if settlements exist

**Settlement Card:**
- **From → To:** "{fromName} → {toName}"
- **Amount:** Formatted currency (primary, bold)
- **Action:** "Ödemeyi Kaydet" button (future)

#### Boş Durum
- **Message:** "Henüz bakiye yok"
- **Condition:** No expenses or all balances = 0

#### Summary Card (Future)
- Total group expenses
- Total settlements
- Net balance (should be 0)

---

## 5. Profil Ekranları

### 5.1 Profile Screen

**Route:** `/profile`  
**Navigator:** `MainNavigator` (Tab)  
**Component:** `ProfileScreen`

#### Header
- **Avatar:** User avatar (large, circular)
- **Name:** User name
- **Email:** User email (gray)

#### Settings Section

**Preferences:**
- **Preferred Currency:** Selector
- **Language:** TR/EN toggle
- **Notifications:** Toggle switches

**Account:**
- **Edit Profile:** Navigate to EditProfile
- **Change Password:** Navigate to ChangePassword
- **Privacy Settings:** Navigate to PrivacySettings

**About:**
- **Version:** App version
- **Terms of Service:** Link
- **Privacy Policy:** Link
- **Support:** Link

**Actions:**
- **Logout Button:** Red, destructive
- **Delete Account:** Red, destructive (with confirmation)

#### Boş Durum
- Yok (her zaman içerik gösterilir)

---

## Genel UI Patterns

### Buttons

**Primary Button:**
- Background: primary-600
- Text: white, semibold
- Rounded: lg
- Padding: py-3, px-6

**Secondary Button:**
- Background: white
- Border: gray-300
- Text: gray-700
- Rounded: lg

**Destructive Button:**
- Background: danger-600 (red)
- Text: white
- Used for: Delete, Logout

### Cards
- Background: white
- Border: gray-200
- Rounded: lg
- Padding: p-4
- Margin: mb-3

### Input Fields
- Border: gray-300
- Rounded: lg
- Padding: px-4, py-3
- Margin: mb-4

### Loading States
- ActivityIndicator (white for primary buttons)
- Center aligned text: "Yükleniyor..."

### Error States
- Alert.alert() for errors
- Inline validation messages (future)

### Empty States
- Center aligned
- Gray text
- CTA button (if applicable)

---

## Navigasyon Akışları

### Auth Flow
```
Login → Register
Login → (Success) → MainNavigator
Register → (Success) → MainNavigator
```

### Main Flow
```
GroupList → GroupDetail → AddExpense
GroupList → CreateGroup → GroupDetail
GroupDetail → BalanceScreen
GroupDetail → ExpenseList → AddExpense
```

### Tab Navigation
- **Groups Tab:** GroupList (default)
- **Profile Tab:** ProfileScreen

---

## Responsive Considerations

### Mobile (Primary)
- Full width cards
- Stack layout
- Bottom tab navigation
- Floating action buttons

### Tablet (Future)
- Two-column layout for lists
- Sidebar navigation option
- Larger cards

---

## Accessibility

### Labels
- All inputs have visible labels
- Icons have accessibility labels (future)

### Touch Targets
- Minimum 44x44 points
- Adequate spacing between buttons

### Color Contrast
- Text meets WCAG AA standards
- Error states use color + text

---

## Animation & Transitions

### Screen Transitions
- Default React Navigation transitions
- Slide from right (push)
- Slide to left (back)

### Loading States
- Smooth ActivityIndicator
- No jarring transitions

### Success States
- Brief success message (future)
- Auto-navigate after delay (future)

---

## Notlar

- Tüm ekranlar ScrollView içinde (uzun içerik için)
- Form validation client-side (server-side da yapılacak)
- Error handling Alert.alert() ile (Toast notification'a geçilebilir)
- Loading states tüm async işlemlerde gösterilmeli
- Boş durumlar kullanıcı deneyimi için önemli

