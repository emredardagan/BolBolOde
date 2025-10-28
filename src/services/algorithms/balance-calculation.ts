import { Expense, GroupMember, ExpenseShare } from '../../types/models';

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

