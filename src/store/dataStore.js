import { create } from "zustand";

const useDataStore = create((set, get) => ({
  // Maps data
  maps: [
    {
      id: 1,
      name: "Downtown Area",
      type: "Interactive",
      markers: 45,
      polygons: 12,
      status: "Active",
      lastUpdated: "2 hours ago",
    },
    {
      id: 2,
      name: "Shopping District",
      type: "Static",
      markers: 23,
      polygons: 8,
      status: "Active",
      lastUpdated: "1 day ago",
    },
    {
      id: 3,
      name: "Residential Zone",
      type: "Interactive",
      markers: 67,
      polygons: 15,
      status: "Draft",
      lastUpdated: "3 days ago",
    },
    {
      id: 4,
      name: "Industrial Area",
      type: "Satellite",
      markers: 34,
      polygons: 6,
      status: "Active",
      lastUpdated: "1 week ago",
    },
  ],

  // Markers data
  markers: [
    {
      id: 1,
      name: "Coffee Shop",
      lat: "40.7128",
      lng: "-74.0060",
      type: "Business",
      map: "Downtown Area",
    },
    {
      id: 2,
      name: "Park Entrance",
      lat: "40.7589",
      lng: "-73.9851",
      type: "Recreation",
      map: "Downtown Area",
    },
    {
      id: 3,
      name: "Bus Stop",
      lat: "40.7505",
      lng: "-73.9934",
      type: "Transport",
      map: "Shopping District",
    },
    {
      id: 4,
      name: "Hospital",
      lat: "40.7614",
      lng: "-73.9776",
      type: "Healthcare",
      map: "Residential Zone",
    },
  ],

  // Polygons data
  polygons: [
    {
      id: 1,
      name: "Central Park",
      area: "843 acres",
      type: "Park",
      map: "Downtown Area",
      vertices: 24,
    },
    {
      id: 2,
      name: "Shopping Mall",
      area: "2.5 acres",
      type: "Commercial",
      map: "Shopping District",
      vertices: 8,
    },
    {
      id: 3,
      name: "School District",
      area: "156 acres",
      type: "Education",
      map: "Residential Zone",
      vertices: 16,
    },
    {
      id: 4,
      name: "Industrial Complex",
      area: "45 acres",
      type: "Industrial",
      map: "Industrial Area",
      vertices: 12,
    },
  ],

  // Customers data
  customers: [
    {
      id: 1,
      name: "Acme Corporation",
      email: "admin@acme.com",
      plan: "Enterprise",
      status: "Active",
      mapsUsed: 15,
      joinDate: "Jan 15, 2024",
      lastActive: "2 hours ago",
    },
    {
      id: 2,
      name: "Tech Solutions Inc",
      email: "contact@techsolutions.com",
      plan: "Professional",
      status: "Active",
      mapsUsed: 8,
      joinDate: "Feb 3, 2024",
      lastActive: "1 day ago",
    },
    {
      id: 3,
      name: "StartupXYZ",
      email: "hello@startupxyz.com",
      plan: "Basic",
      status: "Trial",
      mapsUsed: 3,
      joinDate: "Mar 10, 2024",
      lastActive: "3 days ago",
    },
    {
      id: 4,
      name: "Global Logistics",
      email: "info@globallogistics.com",
      plan: "Enterprise",
      status: "Expired",
      mapsUsed: 22,
      joinDate: "Dec 1, 2023",
      lastActive: "1 week ago",
    },
  ],

  // Notifications data
  notifications: [
    { id: 1, message: "New map data uploaded", time: "5 min ago", read: false },
    {
      id: 2,
      message: "Customer subscription expired",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      message: "System maintenance scheduled",
      time: "2 hours ago",
      read: true,
    },
    {
      id: 4,
      message: "New customer registration from Acme Corp",
      time: "3 hours ago",
      read: false,
    },
    {
      id: 5,
      message: "Map markers updated in Downtown Area",
      time: "4 hours ago",
      read: true,
    },
    {
      id: 6,
      message: "Payment received from Tech Solutions",
      time: "5 hours ago",
      read: false,
    },
    {
      id: 7,
      message: "Database backup completed successfully",
      time: "6 hours ago",
      read: true,
    },
    {
      id: 8,
      message: "New polygon added to Shopping District",
      time: "8 hours ago",
      read: true,
    },
    {
      id: 9,
      message: "User login from new device detected",
      time: "12 hours ago",
      read: false,
    },
    {
      id: 10,
      message: "Weekly analytics report generated",
      time: "1 day ago",
      read: true,
    },
  ],

  // Notification pagination and loading state
  notificationPage: 1,
  notificationsPerPage: 10,
  loadingNotifications: false,

  // Actions
  addMap: (map) =>
    set((state) => ({
      maps: [...state.maps, { ...map, id: Date.now() }],
    })),

  updateMap: (id, updates) =>
    set((state) => ({
      maps: state.maps.map((map) =>
        map.id === id ? { ...map, ...updates } : map
      ),
    })),

  deleteMap: (id) =>
    set((state) => ({
      maps: state.maps.filter((map) => map.id !== id),
    })),

  addCustomer: (customer) =>
    set((state) => ({
      customers: [...state.customers, { ...customer, id: Date.now() }],
    })),

  updateCustomer: (id, updates) =>
    set((state) => ({
      customers: state.customers.map((customer) =>
        customer.id === id ? { ...customer, ...updates } : customer
      ),
    })),

  markNotificationAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      ),
    })),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        { ...notification, id: Date.now(), read: false },
        ...state.notifications,
      ],
    })),

  markAllNotificationsAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((notification) => ({
        ...notification,
        read: true,
      })),
    })),

  loadMoreNotifications: () =>
    set((state) => ({
      notificationPage: state.notificationPage + 1,
      loadingNotifications: true,
    })),

  resetNotificationPagination: () =>
    set({
      notificationPage: 1,
      loadingNotifications: false,
    }),

  simulateLoadMoreNotifications: () => {
    const newNotifications = [
      {
        id: Date.now() + 1,
        message: "Database backup completed",
        time: "3 hours ago",
        read: true,
      },
      {
        id: Date.now() + 2,
        message: "New user registration",
        time: "4 hours ago",
        read: false,
      },
      {
        id: Date.now() + 3,
        message: "Server maintenance completed",
        time: "5 hours ago",
        read: true,
      },
      {
        id: Date.now() + 4,
        message: "Payment received from customer",
        time: "6 hours ago",
        read: false,
      },
      {
        id: Date.now() + 5,
        message: "Map data sync completed",
        time: "7 hours ago",
        read: true,
      },
    ];

    set((state) => ({
      notifications: [...state.notifications, ...newNotifications],
      loadingNotifications: false,
    }));
  },
}));

export default useDataStore;
