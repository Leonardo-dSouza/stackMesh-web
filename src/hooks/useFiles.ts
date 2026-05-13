import { useState, useEffect } from 'react';
import type { File } from '../types';
import apiClient from '../services/apiClient';

interface UseFilesState {
  files: File[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useFiles = (folderId: string | null = null): UseFilesState => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // GET /files returns files in root folder (folderId=null)
      // TODO: Check backend if it supports ?folderId query param for nested folders
      const response = await apiClient.get<File[]>('/files');
      
      // Filter by folderId if provided
      if (folderId) {
        const filtered = response.data.filter((file) => file.folderId === folderId);
        setFiles(filtered);
      } else {
        // Root folder: files with folderId=null
        const rootFiles = response.data.filter((file) => !file.folderId);
        setFiles(rootFiles);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch files';
      setError(message);
      console.error('useFiles error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [folderId]);

  return {
    files,
    loading,
    error,
    refetch: fetchFiles,
  };
};
