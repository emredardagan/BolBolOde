# BölBölÖde - Sprint Breakdown

## İçindekiler
1. [Sprint Yapısı](#1-sprint-yapısı)
2. [M1 Sprint Planı](#2-m1-sprint-planı)
3. [Story Point Tahminleri](#3-story-point-tahminleri)
4. [Velocity Tracking](#4-velocity-tracking)

---

## 1. Sprint Yapısı

### 1.1 Sprint Süresi

- **Sprint Length:** 2 hafta
- **Sprint Planning:** Pazartesi (2 saat)
- **Daily Standup:** Her gün 15 dakika
- **Sprint Review:** Cuma (1 saat)
- **Sprint Retrospective:** Cuma (30 dakika)

### 1.2 Story Point Scale

```
1 point:   Trivial task (< 2 hours)
2 points:  Small task (2-4 hours)
3 points:  Medium task (4-8 hours)
5 points:  Large task (1-2 days)
8 points:  Very large task (2-3 days)
13 points: Epic (split into smaller tasks)
```

---

## 2. M1 Sprint Planı

### Sprint 1: Foundation (2 hafta)

**Goal:** Proje kurulumu ve temel altyapı

**Stories:**
- [ ] Project setup (React Native + Expo) - 5 points
- [ ] TypeScript configuration - 2 points
- [ ] Navigation structure - 3 points
- [ ] Firebase setup - 5 points
- [ ] Authentication flow - 8 points
- [ ] Basic UI components - 5 points

**Total:** 28 points

---

### Sprint 2: Groups & Expenses (2 hafta)

**Goal:** Grup ve harcama yönetimi

**Stories:**
- [ ] Group CRUD operations - 8 points
- [ ] Group member management - 5 points
- [ ] Expense CRUD operations - 8 points
- [ ] Expense list screen - 5 points
- [ ] Basic balance calculation - 8 points

**Total:** 34 points

---

### Sprint 3: Balance & Algorithms (2 hafta)

**Goal:** Bakiye hesaplama ve borç sadeleştirme

**Stories:**
- [ ] Balance calculation algorithm - 8 points
- [ ] Debt simplification algorithm - 8 points
- [ ] Balance screen UI - 5 points
- [ ] Settlement suggestions - 5 points
- [ ] Currency conversion - 5 points

**Total:** 31 points

---

### Sprint 4: Polish & Testing (2 hafta)

**Goal:** UI iyileştirmeleri ve test

**Stories:**
- [ ] UI/UX improvements - 8 points
- [ ] Error handling - 5 points
- [ ] Loading states - 3 points
- [ ] Unit tests - 8 points
- [ ] Integration tests - 5 points
- [ ] Bug fixes - 5 points

**Total:** 34 points

---

## 3. Story Point Tahminleri

### 3.1 Authentication (M1)

| Story | Points | Complexity |
|-------|--------|------------|
| Login screen | 3 | Medium |
| Register screen | 3 | Medium |
| Firebase Auth integration | 5 | High |
| Profile screen | 3 | Low |
| Logout | 1 | Low |
| **Total** | **15** | |

### 3.2 Group Management (M1)

| Story | Points | Complexity |
|-------|--------|------------|
| Create group | 5 | Medium |
| Group list | 3 | Low |
| Group detail | 5 | Medium |
| Invite member | 5 | Medium |
| Member list | 3 | Low |
| Leave group | 2 | Low |
| **Total** | **23** | |

### 3.3 Expense Management (M1)

| Story | Points | Complexity |
|-------|--------|------------|
| Add expense | 8 | High |
| Expense list | 5 | Medium |
| Expense detail | 3 | Low |
| Edit expense | 5 | Medium |
| Delete expense | 3 | Low |
| Filter expenses | 5 | Medium |
| **Total** | **29** | |

### 3.4 Balance & Algorithms (M1)

| Story | Points | Complexity |
|-------|--------|------------|
| Balance calculation | 8 | High |
| Debt simplification | 8 | High |
| Balance screen | 5 | Medium |
| Settlement suggestions | 5 | Medium |
| **Total** | **26** | |

---

## 4. Velocity Tracking

### 4.1 Team Velocity

**Target:** 30-35 points per sprint

**Historical:**
- Sprint 1: TBD
- Sprint 2: TBD
- Sprint 3: TBD
- Sprint 4: TBD

### 4.2 Burndown Chart

Track remaining work per sprint:
- Day 1: 30 points
- Day 3: 25 points
- Day 5: 20 points
- Day 7: 15 points
- Day 10: 10 points
- Day 14: 0 points

---

## Sprint Planning Template

### User Story Format

```
As a [user type]
I want [goal]
So that [benefit]

Acceptance Criteria:
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

Story Points: X
Priority: High/Medium/Low
```

### Example Story

```
As a user
I want to create a group
So that I can track expenses with friends

Acceptance Criteria:
- [ ] Can enter group name
- [ ] Can select base currency
- [ ] Can add description (optional)
- [ ] Group is saved to Firestore
- [ ] User becomes owner automatically

Story Points: 5
Priority: High
```

---

## Definition of Done

A story is considered done when:
- [ ] Code is written and reviewed
- [ ] Unit tests are written and passing
- [ ] Integration tests are passing
- [ ] UI is implemented and tested
- [ ] Documentation is updated
- [ ] No critical bugs
- [ ] Product owner approval

---

## Risk Management

### High Risk Stories

- Debt simplification algorithm (8 points)
- Multi-currency support (8 points)
- Offline sync (13 points - future)

### Mitigation

- Break down into smaller tasks
- Early prototyping
- Technical spikes
- Pair programming

---

## Retrospective Template

### What Went Well
- ...

### What Could Be Improved
- ...

### Action Items
- [ ] Action 1
- [ ] Action 2

---

## Notes

- Story points are estimates, not commitments
- Velocity will stabilize after 2-3 sprints
- Adjust estimates based on team feedback
- Prioritize based on user value

