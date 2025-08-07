import { create } from "zustand";
import { persist } from "zustand/middleware";
import apiClient from "../config/api";

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      isAuthenticated: false,
      user: null,
      token: null,
      loading: false,
      error: null,
      initialized: false,

      // Actions
      setLoading: (loading) => set({ loading }),

      setError: (error) => set({ error }),

      clearError: () => set({ error: null }),

      login: async (email, password) => {
        set({ loading: true, error: null });

        try {
          const response = await apiClient.post("/auth/admin/login", {
            email,
            password,
            role: "admin",
          });

          const { token, user } = response.data;

          set({
            isAuthenticated: true,
            user,
            token,
            loading: false,
            error: null,
            initialized: true,
          });

          return { success: true };
        } catch (error) {
          const errorMessage = error.message || "Login failed";
          set({
            loading: false,
            error: errorMessage,
            isAuthenticated: false,
            user: null,
            token: null,
          });
          throw new Error(errorMessage);
        }
      },

      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          token: null,
          loading: false,
          error: null,
          initialized: true,
        });
        // Clear persisted storage
        localStorage.removeItem("auth-storage");
      },

      // Initialize auth state - simplified to prevent infinite loops
      initializeAuth: () => {
        const state = get();

        // Only run once
        if (state.initialized) {
          return;
        }

        // Check if we have a valid token
        if (state.token && state.user) {
          set({
            isAuthenticated: true,
            initialized: true,
            loading: false,
          });
        } else {
          set({
            isAuthenticated: false,
            user: null,
            token: null,
            initialized: true,
            loading: false,
          });
        }
      },

      // Check if auth is ready
      isAuthReady: () => get().initialized,
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
      }),
    }
  )
);

export default useAuthStore;
