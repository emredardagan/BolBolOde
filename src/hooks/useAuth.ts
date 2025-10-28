import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase/config';
import { useAuthStore } from '../store/authStore';
import { getUserData } from '../lib/firebase/auth';

/**
 * Hook to manage authentication state
 */
export function useAuth() {
  const { user, userData, setUser, setUserData, setLoading, logout } =
    useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      if (firebaseUser) {
        // Fetch user data from Firestore
        const data = await getUserData(firebaseUser.uid);
        setUserData(data);
      } else {
        setUserData(null);
      }
    });

    return unsubscribe;
  }, [setUser, setUserData, setLoading]);

  return {
    user,
    userData,
    isLoading: useAuthStore((state) => state.isLoading),
    logout,
  };
}

