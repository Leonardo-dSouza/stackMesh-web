import { useState, useEffect } from 'react';
import type { Folder } from '../types';
import apiClient from '../services/apiClient';

interface UseFoldersState {
  folders: Folder[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useFolders = (parentId: string | null = null): UseFoldersState => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFolders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Verify backend endpoint — might need GET /folders or GET /folders?parentId=uuid
      // For now, assuming GET /folders returns all user folders
      const response = await apiClient.get<Folder[]>('/folders');
      
      if (parentId) {
        // Filter to only direct children of parentId
        const filtered = response.data.filter((folder) => folder.parentId === parentId);
        setFolders(filtered);
      } else {
        // Root folders: parentId=null
        const rootFolders = response.data.filter((folder) => !folder.parentId);
        setFolders(rootFolders);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch folders';
      setError(message);
      console.error('useFolders error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, [parentId]);

  return {
    folders,
    loading,
    error,
    refetch: fetchFolders,
  };
};
