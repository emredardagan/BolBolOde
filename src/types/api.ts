import { Expense, Group, GroupMember, Settlement, User } from './models';

// API Response types
export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  cursor?: string;
  hasMore: boolean;
}

// Request types
export interface CreateGroupRequest {
  name: string;
  description?: string;
  baseCurrency: string;
  emoji?: string;
  startDate: Date;
  endDate?: Date;
}

export interface CreateExpenseRequest {
  groupId: string;
  title: string;
  description?: string;
  amount: number;
  currency: string;
  category: string;
  date: Date;
  payerId: string;
  splitType: string;
  participantIds: string[];
  tags?: string[];
  notes?: string;
}

export interface UpdateExpenseRequest {
  title?: string;
  description?: string;
  amount?: number;
  category?: string;
  date?: Date;
  payerId?: string;
  splitType?: string;
  participantIds?: string[];
  tags?: string[];
  notes?: string;
}

export interface CreateSettlementRequest {
  groupId: string;
  fromMemberId: string;
  toMemberId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  notes?: string;
  date: Date;
}

// Query params
export interface ExpenseFilters {
  startDate?: Date;
  endDate?: Date;
  category?: string;
  payerId?: string;
  participantId?: string;
  minAmount?: number;
  maxAmount?: number;
  currency?: string;
}

