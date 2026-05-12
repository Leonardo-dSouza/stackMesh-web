import { create } from 'zustand';
import type { User, AuthResponse } from '../types';
import apiClient from '../services/apiClient';

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: User | null) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  
  initializeFromStorage: () => void;
  refreshAccessToken: () => Promise<void>;
  mockLogin: (email: string) => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  error: null,

  setTokens: (accessToken: string, refreshToken: string) => {
    set({ accessToken, refreshToken });
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  },

  setUser: (user: User | null) => {
    set({ user });
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  },

  setError: (error: string | null) => set({ error }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),

  login: async (email: string, password: string) => {
    const { setLoading, setError, setTokens, setUser } = get();
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', {
        email,
        password,
      });

      const { accessToken, refreshToken, user } = response.data;
      setTokens(accessToken, refreshToken);
      setUser(user);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao fazer login';
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  },

  register: async (email: string, password: string) => {
    const { setLoading, setError, setTokens, setUser } = get();
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', {
        email,
        password,
      });

      const { accessToken, refreshToken, user } = response.data;
      setTokens(accessToken, refreshToken);
      setUser(user);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao registrar';
      setError(message);
      throw error;
    } finally {
      setLoading(false);
    }
  },

  logout: async () => {
    const { setTokens, setUser } = get();
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      setTokens('', '');
      setUser(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  mockLogin: (email: string) => {
    const { setTokens, setUser } = get();
    const mockUser: User = {
      id: '123',
      email,
      totalBytes: 107374182400, // 100GB
    };
    const mockAccessToken = 'mock_access_token_' + Date.now();
    const mockRefreshToken = 'mock_refresh_token_' + Date.now();
    
    setTokens(mockAccessToken, mockRefreshToken);
    setUser(mockUser);
  },

  initializeFromStorage: () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const userJson = localStorage.getItem('user');

    if (accessToken && refreshToken) {
      set({ accessToken, refreshToken });
      if (userJson) {
        set({ user: JSON.parse(userJson) });
      }
    }
  },

  refreshAccessToken: async () => {
    const { refreshToken, setTokens, logout } = get();
    if (!refreshToken) {
      await logout();
      return;
    }

    try {
      const response = await apiClient.post<AuthResponse>('/auth/refresh', {});
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
      setTokens(newAccessToken, newRefreshToken);
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      await logout();
    }
  },
}));
