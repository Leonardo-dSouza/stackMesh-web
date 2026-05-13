import { useState, useEffect } from 'react';
import type { User } from '../types';
import apiClient from '../services/apiClient';

interface UseUserProfileState {
  user: User | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useUserProfile = (): UseUserProfileState => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Verify backend endpoint exists — GET /users/profile
      // Might need to be GET /users/me or similar
      const response = await apiClient.get<User>('/users/profile');
      setUser(response.data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch user profile';
      setError(message);
      console.error('useUserProfile error:', err);
      
      // Fallback: try to get user from auth store if profile endpoint doesn't exist
      // This will be set up in the component
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    user,
    loading,
    error,
    refetch: fetchProfile,
  };
};
