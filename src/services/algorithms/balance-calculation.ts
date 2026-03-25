import { Timestamp } from 'firebase/firestore';
import {
  Balance,
  Expense,
  ExpenseShare,
  ExpenseStatus,
  GroupMember,
  SplitType,
} from '../../types/models';

/**
 * Calculate net balance for a member
 */
export function calculateMemberBalance(
  memberId: string,
  expenses: Expense[],
  shares: ExpenseShare[]
): {
  netBalance: number;
  totalPaid: number;
  totalOwed: number;
} {
  // Find expenses paid by this member
  const paidExpenses = expenses.filter((e) => e.payerId === memberId);
  const totalPaid = paidExpenses.reduce((sum, e) => sum + e.baseCurrencyAmount, 0);

  // Find shares for this member
  const memberShares = shares.filter((s) => s.memberId === memberId);
  const totalOwed = memberShares.reduce((sum, s) => sum + s.calculatedAmount, 0);

  // Net balance = paid - owed
  const netBalance = totalPaid - totalOwed;

  return {
    netBalance,
    totalPaid,
    totalOwed,
  };
}

/**
 * Calculate balances for all members in a group
 */
export function calculateGroupBalances(
  members: GroupMember[],
  expenses: Expense[],
  shares: ExpenseShare[]
): GroupMember[] {
  return members.map((member) => {
    const balance = calculateMemberBalance(member.id, expenses, shares);
    return {
      ...member,
      netBalance: balance.netBalance,
      totalPaid: balance.totalPaid,
      totalOwed: balance.totalOwed,
    };
  });
}

/**
 * Validate that balances sum to zero
 */
export function validateBalancesSum(members: GroupMember[]): boolean {
  const total = members.reduce((sum, m) => sum + m.netBalance, 0);
  return Math.abs(total) <= 1; // 1 kuruş tolerance
}

/**
 * Active expenses only (for balance math).
 */
export function filterActiveExpenses(expenses: Expense[]): Expense[] {
  return expenses.filter(
    (e) => e.status === ExpenseStatus.Active && e.deletedAt == null
  );
}

/**
 * Derives equal-split shares in minor units (kuruş) from expenses.
 * Remainder kuruş are assigned to the first participants (sorted by memberId for stability).
 */
export function buildEqualSplitSharesFromExpenses(expenses: Expense[]): ExpenseShare[] {
  const shares: ExpenseShare[] = [];
  const createdAt = Timestamp.now();

  for (const expense of expenses) {
    if (expense.splitType !== SplitType.Equal) {
      continue;
    }

    const participantIds = [...expense.participantIds].sort((a, b) =>
      a.localeCompare(b)
    );
    const n = participantIds.length;
    if (n === 0) continue;

    const total = expense.baseCurrencyAmount;
    const base = Math.floor(total / n);
    const remainder = total % n;

    participantIds.forEach((memberId, idx) => {
      const calculatedAmount = base + (idx < remainder ? 1 : 0);
      shares.push({
        id: `${expense.id}-${memberId}`,
        expenseId: expense.id,
        memberId,
        shareType: SplitType.Equal,
        weight: null,
        percentage: null,
        exactAmount: null,
        calculatedAmount,
        createdAt,
      });
    });
  }

  return shares;
}

/**
 * Net balances per member for UI and debt simplification (equal split only in MVP).
 */
export function computeMemberBalancesForGroup(
  members: GroupMember[],
  expenses: Expense[]
): Balance[] {
  const active = filterActiveExpenses(expenses);
  const shares = buildEqualSplitSharesFromExpenses(active);

  return members.map((member) => {
    const { netBalance } = calculateMemberBalance(member.id, active, shares);
    return {
      memberId: member.id,
      name: member.userId,
      balance: netBalance,
    };
  });
}

