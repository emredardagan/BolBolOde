import { create } from 'zustand';
import { User as FirebaseUser } from 'firebase/auth';
import { User } from '../types/models';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV({ id: 'auth' });

interface AuthState {
  user: FirebaseUser | null;
  userData: User | null;
  isLoading: boolean;
  setUser: (user: FirebaseUser | null) => void;
  setUserData: (userData: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  userData: null,
  isLoading: true,
  setUser: (user) => {
    set({ user });
    if (user) {
      storage.set('userId', user.uid);
    } else {
      storage.delete('userId');
    }
  },
  setUserData: (userData) => set({ userData }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => {
    set({ user: null, userData: null });
    storage.delete('userId');
  },
}));

