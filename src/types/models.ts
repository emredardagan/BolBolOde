import { Timestamp } from 'firebase/firestore';

// User Model
export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  preferredCurrency: string;
  locale: string;
  notificationPreferences: NotificationPreferences;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface NotificationPreferences {
  push: boolean;
  email: boolean;
  types: {
    newExpense: boolean;
    expenseEdited: boolean;
    settlement: boolean;
    groupInvite: boolean;
    balanceChanged: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

// Group Model
export interface Group {
  id: string;
  name: string;
  description: string | null;
  baseCurrency: string;
  emoji: string | null;
  avatarUrl: string | null;
  ownerId: string;
  startDate: Timestamp;
  endDate: Timestamp | null;
  status: GroupStatus;
  memberCount: number;
  totalExpenses: number;
  totalAmount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  deletedAt: Timestamp | null;
}

export enum GroupStatus {
  Active = 'Active',
  Archived = 'Archived',
  Deleted = 'Deleted',
}

// GroupMember Model
export interface GroupMember {
  id: string;
  userId: string;
  groupId: string;
  role: MemberRole;
  status: MemberStatus;
  netBalance: number;
  totalPaid: number;
  totalOwed: number;
  joinedAt: Timestamp;
  leftAt: Timestamp | null;
  invitedBy: string | null;
}

export enum MemberRole {
  Owner = 'Owner',
  Editor = 'Editor',
  Viewer = 'Viewer',
}

export enum MemberStatus {
  Active = 'Active',
  Invited = 'Invited',
  Left = 'Left',
  Removed = 'Removed',
}

// Expense Model
export interface Expense {
  id: string;
  groupId: string;
  title: string;
  description: string | null;
  amount: number;
  amountFormatted: string;
  currency: string;
  baseCurrencyAmount: number;
  fxRate: number | null;
  fxRateDate: Timestamp | null;
  category: ExpenseCategory;
  date: Timestamp;
  payerId: string;
  splitType: SplitType;
  participantIds: string[];
  attachments: Attachment[];
  tags: string[];
  notes: string | null;
  status: ExpenseStatus;
  version: number;
  createdBy: string;
  createdAt: Timestamp;
  updatedBy: string | null;
  updatedAt: Timestamp;
  deletedAt: Timestamp | null;
}

export enum ExpenseCategory {
  Food = 'Food',
  Transport = 'Transport',
  Accommodation = 'Accommodation',
  Entertainment = 'Entertainment',
  Shopping = 'Shopping',
  Other = 'Other',
}

export enum SplitType {
  Equal = 'equal',
  Weighted = 'weighted',
  Exact = 'exact',
  Percentage = 'percentage',
}

export enum ExpenseStatus {
  Active = 'Active',
  Draft = 'Draft',
  Deleted = 'Deleted',
}

export interface Attachment {
  id: string;
  url: string;
  thumbnailUrl: string;
  fileName: string;
  mimeType: string;
  size: number;
  uploadedAt: Timestamp;
}

// ExpenseShare Model
export interface ExpenseShare {
  id: string;
  expenseId: string;
  memberId: string;
  shareType: SplitType;
  weight: number | null;
  percentage: number | null;
  exactAmount: number | null;
  calculatedAmount: number;
  createdAt: Timestamp;
}

// Settlement Model
export interface Settlement {
  id: string;
  groupId: string;
  fromMemberId: string;
  toMemberId: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  notes: string | null;
  status: SettlementStatus;
  date: Timestamp;
  confirmedBy: string | null;
  confirmedAt: Timestamp | null;
  createdBy: string;
  createdAt: Timestamp;
}

export enum PaymentMethod {
  Cash = 'Cash',
  BankTransfer = 'BankTransfer',
  CreditCard = 'CreditCard',
  MobilePay = 'MobilePay',
  Other = 'Other',
}

export enum SettlementStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  Rejected = 'Rejected',
}

// GroupInvite Model
export interface GroupInvite {
  id: string;
  groupId: string;
  token: string;
  createdBy: string;
  usageCount: number;
  maxUsage: number;
  expiresAt: Timestamp;
  status: InviteStatus;
  createdAt: Timestamp;
}

export enum InviteStatus {
  Active = 'Active',
  Expired = 'Expired',
  Revoked = 'Revoked',
}

// Balance Model
export interface Balance {
  memberId: string;
  name: string;
  balance: number;
}

// Settlement Suggestion
export interface SettlementSuggestion {
  fromMemberId: string;
  fromMemberName: string;
  toMemberId: string;
  toMemberName: string;
  amount: number;
}

