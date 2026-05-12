import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { useAuthStore } from '../store/authStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token nas requisições
apiClient.interceptors.request.use((config) => {
  const store = useAuthStore.getState();
  if (store.accessToken) {
    config.headers.Authorization = `Bearer ${store.accessToken}`;
  }
  return config;
});

// Interceptor para tratar erros e renovar token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const store = useAuthStore.getState();

    // Se erro 401 e não é a requisição de refresh, tenta renovar token
    if (error.response?.status === 401 && !originalRequest._retry && store.refreshToken) {
      originalRequest._retry = true;
      try {
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
          headers: {
            'Authorization': `Bearer ${store.refreshToken}`,
          },
        });

        const { accessToken, refreshToken } = response.data;
        store.setTokens(accessToken, refreshToken);

        // Repete a requisição original com novo token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Se refresh falhar, faz logout
        store.logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
