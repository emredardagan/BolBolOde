import { Balance, SettlementSuggestion } from '../../types/models';

/**
 * Validates that balances sum to zero
 */
function validateBalances(balances: Balance[]): void {
  const total = balances.reduce((sum, b) => sum + b.balance, 0);

  if (Math.abs(total) > 1) {
    // 1 kuruş tolerance
    throw new Error(
      `Bakiye toplamı sıfır değil: ${total}. Bu bir yuvarlama hatası olabilir.`
    );
  }

  if (balances.length < 2) {
    throw new Error('En az 2 kişi gerekli');
  }

  balances.forEach((b) => {
    if (!b.memberId || !b.name) {
      throw new Error('Geçersiz üye bilgisi');
    }
    if (typeof b.balance !== 'number' || isNaN(b.balance)) {
      throw new Error('Geçersiz bakiye değeri');
    }
  });
}

/**
 * Simplify debts using greedy algorithm
 * @param balances Net balances in kuruş
 * @param minimumAmount Minimum transfer amount (default: 100 kuruş = 1 TL)
 * @returns Settlement suggestions
 */
export function simplifyDebts(
  balances: Balance[],
  minimumAmount: number = 100
): SettlementSuggestion[] {
  // Validation
  validateBalances(balances);

  // Separate creditors (positive) and debtors (negative)
  const creditors = balances
    .filter((b) => b.balance > minimumAmount)
    .map((b) => ({ ...b })) // Copy
    .sort((a, b) => {
      // Sort by balance DESC, then by memberId for determinism
      if (b.balance !== a.balance) {
        return b.balance - a.balance;
      }
      return a.memberId.localeCompare(b.memberId);
    });

  const debtors = balances
    .filter((b) => b.balance < -minimumAmount)
    .map((b) => ({
      ...b,
      balance: -b.balance, // Convert to positive
    }))
    .sort((a, b) => {
      // Sort by balance DESC, then by memberId for determinism
      if (b.balance !== a.balance) {
        return b.balance - a.balance;
      }
      return a.memberId.localeCompare(b.memberId);
    });

  const settlements: SettlementSuggestion[] = [];

  let i = 0;
  let j = 0;

  // Greedy matching
  while (i < creditors.length && j < debtors.length) {
    const creditor = creditors[i];
    const debtor = debtors[j];

    // Transfer amount
    const amount = Math.min(creditor.balance, debtor.balance);

    // Add settlement
    settlements.push({
      fromMemberId: debtor.memberId,
      fromMemberName: debtor.name,
      toMemberId: creditor.memberId,
      toMemberName: creditor.name,
      amount,
    });

    // Update balances
    creditor.balance -= amount;
    debtor.balance -= amount;

    // Skip zeros
    if (creditor.balance <= minimumAmount) i++;
    if (debtor.balance <= minimumAmount) j++;
  }

  return settlements;
}

/**
 * Adjust rounding errors by adding/subtracting difference to largest balance
 */
export function adjustRoundingError(balances: Balance[]): Balance[] {
  const total = balances.reduce((sum, b) => sum + b.balance, 0);

  if (total === 0) return balances;

  if (Math.abs(total) > 1) {
    throw new Error('Yuvarlama hatası çok büyük');
  }

  // Add/subtract difference to max absolute balance
  const maxBalance = balances.reduce((max, b) =>
    Math.abs(b.balance) > Math.abs(max.balance) ? b : max
  );

  maxBalance.balance -= total;

  return balances;
}

