import { create } from "zustand";

const useUIStore = create((set) => ({
  // Sidebar state
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  // Notification dropdown state
  showNotifications: false,
  setShowNotifications: (show) => set({ showNotifications: show }),
  toggleNotifications: () =>
    set((state) => ({ showNotifications: !state.showNotifications })),

  // Profile dropdown state
  showProfile: false,
  setShowProfile: (show) => set({ showProfile: show }),
  toggleProfile: () => set((state) => ({ showProfile: !state.showProfile })),

  // Notifications Sidebar state
  showNotificationsSidebar: false,
  setShowNotificationsSidebar: (show) =>
    set({ showNotificationsSidebar: show }),
  toggleNotificationsSidebar: () =>
    set((state) => ({
      showNotificationsSidebar: !state.showNotificationsSidebar,
    })),

  // Modal states
  selectedCustomer: null,
  setSelectedCustomer: (customer) => set({ selectedCustomer: customer }),

  // Loading states
  pageLoading: false,
  setPageLoading: (loading) => set({ pageLoading: loading }),

  // Close all dropdowns
  closeAllDropdowns: () =>
    set({
      showNotifications: false,
      showProfile: false,
      showNotificationsSidebar: false,
    }),
}));

export default useUIStore;
