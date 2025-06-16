import { create } from "zustand";

interface AuthStore {
  accessToken: string | null;
  refreshPromise: Promise<unknown> | null;
  setAccessToken: (accessToken: string | null) => void;
  setRefreshPromise: (refreshPromise: Promise<unknown> | null) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  accessToken: null,
  refreshPromise: null,
  setAccessToken: (accessToken) => set({ accessToken }),
  setRefreshPromise: (refreshPromise) => set({ refreshPromise }),
}));
