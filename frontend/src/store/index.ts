import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole, Theme, Notification, College } from '@/types';

// Auth Store
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  collegeId?: string;
  department?: string;
  year?: number;
  directorRole?: string;
  facultySubRole?: string;
  academicYear?: number;
}

// Mock user data for demo
const mockUsers: Record<string, User> = {
  'student@college.edu': {
    id: '1',
    email: 'student@college.edu',
    firstName: 'Alex',
    lastName: 'Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    role: 'student',
    collegeId: '1',
    collegeName: 'Tech University',
    department: 'Computer Science',
    year: 3,
    points: 1250,
    streak: 21,
    createdAt: new Date('2023-09-01'),
    isEmailVerified: true,
  },
  'faculty@college.edu': {
    id: '2',
    email: 'faculty@college.edu',
    firstName: 'Dr. Sarah',
    lastName: 'Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    role: 'faculty',
    collegeId: '1',
    collegeName: 'Tech University',
    department: 'Computer Science',
    points: 500,
    streak: 5,
    createdAt: new Date('2022-08-15'),
    isEmailVerified: true,
  },
  'admin@college.edu': {
    id: '3',
    email: 'admin@college.edu',
    firstName: 'Michael',
    lastName: 'Roberts',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    role: 'college_admin',
    collegeId: '1',
    collegeName: 'Tech University',
    points: 1000,
    streak: 10,
    createdAt: new Date('2021-06-01'),
    isEmailVerified: true,
  },
  'super@platform.com': {
    id: '4',
    email: 'super@platform.com',
    firstName: 'Emma',
    lastName: 'Wilson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    role: 'ambassador',
    points: 2000,
    streak: 30,
    createdAt: new Date('2020-01-01'),
    isEmailVerified: true,
  },
  'judge@hackathon.com': {
    id: '5',
    email: 'judge@hackathon.com',
    firstName: 'David',
    lastName: 'Park',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    role: 'judge',
    points: 800,
    streak: 15,
    createdAt: new Date('2023-01-15'),
    isEmailVerified: true,
  },
  'hod@college.edu': {
    id: '6',
    email: 'hod@college.edu',
    firstName: 'Prof. Robert',
    lastName: 'Williams',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert',
    role: 'hod',
    collegeId: '1',
    collegeName: 'Tech University',
    department: 'Computer Science',
    points: 1200,
    streak: 12,
    createdAt: new Date('2022-01-10'),
    isEmailVerified: true,
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const { api } = await import('@/lib/api');
          // Backend returns UserDto with 'name', we need to split it if firstName/lastName are missing
          const response = await api.post<{ accessToken: string; user: any }>('/auth/login', { email, password });

          const backendUser = response.user;
          // Helper to split name if needed
          let firstName = backendUser.name || '';
          let lastName = '';
          if (backendUser.name && !backendUser.firstName) {
            const parts = backendUser.name.split(' ');
            firstName = parts[0];
            lastName = parts.slice(1).join(' ');
          }

          const user: User = {
            ...backendUser,
            firstName: backendUser.firstName || firstName,
            lastName: backendUser.lastName || lastName,
            isClubHead: backendUser.subRole === 'CLUB_HEAD',
          };

          set({
            user: user,
            token: response.accessToken, // AuthResponse has accessToken
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error: any) {
          set({ isLoading: false, isAuthenticated: false, user: null, token: null });
          console.error('[Auth Error]:', error);
          throw error;
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true });
        try {
          const { api } = await import('@/lib/api');
          // Backend expects 'name', not firstName/lastName
          const payload = {
            name: `${data.firstName} ${data.lastName}`.trim(),
            email: data.email,
            password: data.password,
            role: data.role,
            collegeId: data.collegeId,
            department: data.department,
            year: data.year,
            academicYear: data.academicYear,
            facultySubRole: data.facultySubRole,
            directorRole: data.directorRole,
          };

          await api.post('/auth/register', payload);
          set({ isLoading: false });
        } catch (error: any) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },

      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user });
      },

      updateUser: (updates: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...updates } });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);

// Theme Store
interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      setTheme: (theme: Theme) => set({ theme }),
      toggleTheme: () => {
        const { theme } = get();
        const newTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
        set({ theme: newTheme });
      },
    }),
    {
      name: 'theme-storage',
    }
  )
);

// Notification Store
interface NotificationState {
  notifications: any[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: (userId: string) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: (userId: string) => Promise<void>;
  addNotification: (notification: any) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>()((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async (userId: string) => {
    set({ isLoading: true });
    try {
      const { notificationApi } = await import('@/lib/api');
      const [notifications, unreadCount] = await Promise.all([
        notificationApi.getByUser(userId),
        notificationApi.getUnreadCount(userId)
      ]);
      set({ notifications, unreadCount, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      set({ isLoading: false });
    }
  },

  markAsRead: async (id: string) => {
    try {
      const { notificationApi } = await import('@/lib/api');
      await notificationApi.markAsRead(id);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  },

  markAllAsRead: async (userId: string) => {
    try {
      const { notificationApi } = await import('@/lib/api');
      await notificationApi.markAllAsRead(userId);
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0,
      }));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  },

  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  clearAll: () => {
    set({ notifications: [], unreadCount: 0 });
  },
}));

// UI Store
interface UIState {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  activeModal: string | null;
  modalData: any;
  openModal: (modal: string, data?: any) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>()((set, get) => ({
  sidebarOpen: true,
  setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  mobileMenuOpen: false,
  setMobileMenuOpen: (open: boolean) => set({ mobileMenuOpen: open }),
  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
  activeModal: null,
  modalData: null,
  openModal: (modal: string, data?: any) => set({ activeModal: modal, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: null }),
}));

// Search Store
interface SearchState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchHistory: string[];
  addToHistory: (query: string) => void;
  clearHistory: () => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      searchQuery: '',
      setSearchQuery: (query: string) => set({ searchQuery: query }),
      searchHistory: [],
      addToHistory: (query: string) => {
        if (!query.trim()) return;
        set((state) => ({
          searchHistory: [query, ...state.searchHistory.filter((q) => q !== query)].slice(0, 10),
        }));
      },
      clearHistory: () => set({ searchHistory: [] }),
    }),
    {
      name: 'search-storage',
    }
  )
);
