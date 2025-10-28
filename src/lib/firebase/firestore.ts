import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from './config';
import { Group, Expense, GroupMember, Settlement } from '../../types/models';

// Collections
export const COLLECTIONS = {
  USERS: 'users',
  GROUPS: 'groups',
  EXPENSES: 'expenses',
  MEMBERS: 'members',
  SETTLEMENTS: 'settlements',
  INVITES: 'invites',
} as const;

// Helper to convert Firestore Timestamp to Date
export function timestampToDate(timestamp: any): Date {
  if (timestamp?.toDate) {
    return timestamp.toDate();
  }
  return new Date();
}

// Groups
export async function createGroup(group: Group): Promise<void> {
  await setDoc(doc(db, COLLECTIONS.GROUPS, group.id), group);
}

export async function getGroup(groupId: string): Promise<Group | null> {
  const docSnap = await getDoc(doc(db, COLLECTIONS.GROUPS, groupId));
  if (docSnap.exists()) {
    return docSnap.data() as Group;
  }
  return null;
}

export async function updateGroup(
  groupId: string,
  updates: Partial<Group>
): Promise<void> {
  await updateDoc(doc(db, COLLECTIONS.GROUPS, groupId), {
    ...updates,
    updatedAt: Timestamp.now(),
  });
}

export async function getUserGroups(userId: string): Promise<Group[]> {
  const membersQuery = query(
    collection(db, COLLECTIONS.GROUPS),
    where('ownerId', '==', userId)
  );
  const snapshot = await getDocs(membersQuery);
  return snapshot.docs.map((doc) => doc.data() as Group);
}

// Group Members
export async function getGroupMembers(
  groupId: string
): Promise<GroupMember[]> {
  const membersRef = collection(
    db,
    COLLECTIONS.GROUPS,
    groupId,
    COLLECTIONS.MEMBERS
  );
  const snapshot = await getDocs(membersRef);
  return snapshot.docs.map((doc) => doc.data() as GroupMember);
}

export async function addGroupMember(member: GroupMember): Promise<void> {
  await setDoc(
    doc(
      db,
      COLLECTIONS.GROUPS,
      member.groupId,
      COLLECTIONS.MEMBERS,
      member.id
    ),
    member
  );
}

// Expenses
export async function createExpense(expense: Expense): Promise<void> {
  await setDoc(
    doc(
      db,
      COLLECTIONS.GROUPS,
      expense.groupId,
      COLLECTIONS.EXPENSES,
      expense.id
    ),
    expense
  );
}

export async function getGroupExpenses(
  groupId: string,
  constraints: QueryConstraint[] = []
): Promise<Expense[]> {
  const baseQuery = query(
    collection(db, COLLECTIONS.GROUPS, groupId, COLLECTIONS.EXPENSES),
    ...constraints
  );
  const snapshot = await getDocs(baseQuery);
  return snapshot.docs.map((doc) => doc.data() as Expense);
}

export async function getExpense(
  groupId: string,
  expenseId: string
): Promise<Expense | null> {
  const docSnap = await getDoc(
    doc(db, COLLECTIONS.GROUPS, groupId, COLLECTIONS.EXPENSES, expenseId)
  );
  if (docSnap.exists()) {
    return docSnap.data() as Expense;
  }
  return null;
}

export async function updateExpense(
  groupId: string,
  expenseId: string,
  updates: Partial<Expense>
): Promise<void> {
  await updateDoc(
    doc(db, COLLECTIONS.GROUPS, groupId, COLLECTIONS.EXPENSES, expenseId),
    {
      ...updates,
      updatedAt: Timestamp.now(),
    }
  );
}

export async function deleteExpense(
  groupId: string,
  expenseId: string
): Promise<void> {
  await updateDoc(
    doc(db, COLLECTIONS.GROUPS, groupId, COLLECTIONS.EXPENSES, expenseId),
    {
      status: 'Deleted',
      deletedAt: Timestamp.now(),
    }
  );
}

// Settlements
export async function createSettlement(settlement: Settlement): Promise<void> {
  await setDoc(
    doc(
      db,
      COLLECTIONS.GROUPS,
      settlement.groupId,
      COLLECTIONS.SETTLEMENTS,
      settlement.id
    ),
    settlement
  );
}

export async function getGroupSettlements(
  groupId: string
): Promise<Settlement[]> {
  const settlementsRef = collection(
    db,
    COLLECTIONS.GROUPS,
    groupId,
    COLLECTIONS.SETTLEMENTS
  );
  const snapshot = await getDocs(settlementsRef);
  return snapshot.docs.map((doc) => doc.data() as Settlement);
}

