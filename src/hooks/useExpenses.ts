import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getGroupExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
} from '../lib/firebase/firestore';
import { Expense } from '../types/models';
import { CreateExpenseRequest, UpdateExpenseRequest } from '../types/api';
// Simple UUID generator
function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
import { Timestamp, where, orderBy } from 'firebase/firestore';

/**
 * Hook to fetch group expenses
 */
export function useGroupExpenses(groupId: string | undefined) {
  return useQuery({
    queryKey: ['expenses', groupId],
    queryFn: () =>
      groupId
        ? getGroupExpenses(groupId, [
            where('status', '==', 'Active'),
            orderBy('date', 'desc'),
          ])
        : [],
    enabled: !!groupId,
  });
}

/**
 * Hook to fetch a single expense
 */
export function useExpense(groupId: string | undefined, expenseId: string | undefined) {
  return useQuery({
    queryKey: ['expense', groupId, expenseId],
    queryFn: () => (groupId && expenseId ? getExpense(groupId, expenseId) : null),
    enabled: !!groupId && !!expenseId,
  });
}

/**
 * Hook to create a new expense
 */
export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateExpenseRequest): Promise<Expense> => {
      const expenseId = uuidv4();
      const expense: Expense = {
        id: expenseId,
        groupId: data.groupId,
        title: data.title,
        description: data.description || null,
        amount: data.amount,
        amountFormatted: (data.amount / 100).toFixed(2),
        currency: data.currency,
        baseCurrencyAmount: data.amount, // TODO: Currency conversion
        fxRate: null,
        fxRateDate: null,
        category: data.category as any,
        date: Timestamp.fromDate(data.date),
        payerId: data.payerId,
        splitType: data.splitType as any,
        participantIds: data.participantIds,
        attachments: [],
        tags: data.tags || [],
        notes: data.notes || null,
        status: 'Active',
        version: 1,
        createdBy: '', // Will be set from auth
        createdAt: Timestamp.now(),
        updatedBy: null,
        updatedAt: Timestamp.now(),
        deletedAt: null,
      };

      await createExpense(expense);
      return expense;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['expenses', variables.groupId] });
    },
  });
}

/**
 * Hook to update an expense
 */
export function useUpdateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      groupId,
      expenseId,
      updates,
    }: {
      groupId: string;
      expenseId: string;
      updates: UpdateExpenseRequest;
    }) => {
      await updateExpense(groupId, expenseId, updates as any);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['expenses', variables.groupId] });
      queryClient.invalidateQueries({
        queryKey: ['expense', variables.groupId, variables.expenseId],
      });
    },
  });
}

/**
 * Hook to delete an expense
 */
export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ groupId, expenseId }: { groupId: string; expenseId: string }) => {
      await deleteExpense(groupId, expenseId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['expenses', variables.groupId] });
    },
  });
}

