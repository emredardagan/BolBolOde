import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from './config';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './config';
import { User } from '../../types/models';

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  avatar?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

/**
 * Sign up with email and password
 */
export async function signUp(data: SignUpData): Promise<FirebaseUser> {
  const { email, password, name, avatar } = data;

  // Create user in Firebase Auth
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = userCredential.user;

  // Update display name
  await updateProfile(user, {
    displayName: name,
    photoURL: avatar || null,
  });

  // Create user document in Firestore
  const userDoc: User = {
    id: user.uid,
    email: user.email!,
    name,
    avatar: avatar || null,
    preferredCurrency: 'TRY',
    locale: 'tr',
    notificationPreferences: {
      push: true,
      email: true,
      types: {
        newExpense: true,
        expenseEdited: true,
        settlement: true,
        groupInvite: true,
        balanceChanged: false,
      },
      quietHours: {
        enabled: false,
        start: '22:00',
        end: '08:00',
      },
    },
    createdAt: {} as any,
    updatedAt: {} as any,
  };

  await setDoc(doc(db, 'users', user.uid), userDoc);

  return user;
}

/**
 * Sign in with email and password
 */
export async function signIn(data: SignInData): Promise<FirebaseUser> {
  const { email, password } = data;
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

/**
 * Sign out
 */
export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

/**
 * Get user document from Firestore
 */
export async function getUserData(userId: string): Promise<User | null> {
  const userDoc = await getDoc(doc(db, 'users', userId));
  if (userDoc.exists()) {
    return userDoc.data() as User;
  }
  return null;
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<User>
): Promise<void> {
  await setDoc(
    doc(db, 'users', userId),
    { ...updates, updatedAt: new Date() },
    { merge: true }
  );
}

