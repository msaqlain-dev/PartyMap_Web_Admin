import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,

      // Actions
      setLoading: (loading) => set({ loading }),

      setError: (error) => set({ error }),

      clearError: () => set({ error: null }),

      login: async (email, password) => {
        set({ loading: true, error: null });

        try {
          // Simulate API call
          await new Promise((resolve, reject) => {
            setTimeout(() => {
              // Demo credentials
              if (email === "admin@mapportal.com" && password === "admin123") {
                const userData = {
                  id: 1,
                  name: "Admin User",
                  email: "admin@mapportal.com",
                  role: "Administrator",
                };
                resolve(userData);
              } else {
                reject(new Error("Invalid credentials"));
              }
            }, 1000);
          }).then((userData) => {
            set({
              isAuthenticated: true,
              user: userData,
              loading: false,
              error: null,
            });
            return { success: true };
          });
        } catch (error) {
          set({
            loading: false,
            error: error.message || "Login failed",
            isAuthenticated: false,
            user: null,
          });
          throw error;
        }
      },

      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: null,
        });
      },

      // Initialize auth state from storage
      initializeAuth: () => {
        const token = localStorage.getItem("adminToken");
        const userData = localStorage.getItem("adminUser");

        if (token && userData) {
          try {
            const user = JSON.parse(userData);
            set({
              isAuthenticated: true,
              user,
              loading: false,
            });
          } catch (error) {
            // Clear invalid data
            localStorage.removeItem("adminToken");
            localStorage.removeItem("adminUser");
            set({
              isAuthenticated: false,
              user: null,
              loading: false,
            });
          }
        } else {
          set({ loading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);

export default useAuthStore;
