// store/useAuthStore.ts
import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  user: { id: string; username: string; role: string } | null;
  token: string | null;
  login: (user: AuthState["user"], token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  token: null,
  login: (user, token) =>
    set({
      isAuthenticated: true,
      user,
      token,
    }),
  logout: () =>
    set({
      isAuthenticated: false,
      user: null,
      token: null,
    }),
}));
