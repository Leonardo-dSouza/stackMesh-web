import { useState, useEffect } from 'react';
import type { File } from '../types';
import apiClient from '../services/apiClient';

interface UseTrashedFilesState {
  files: File[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useTrashedFiles = (): UseTrashedFilesState => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrashedFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Check backend — might need GET /files/trash or GET /files?deleted=true
      // For now, fetching all files and filtering by deletedAt
      const response = await apiClient.get<File[]>('/files');
      
      // Filter to only deleted files (deletedAt is not null)
      const trashedFiles = response.data.filter((file) => file.deletedAt);
      setFiles(trashedFiles);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch trashed files';
      setError(message);
      console.error('useTrashedFiles error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrashedFiles();
  }, []);

  return {
    files,
    loading,
    error,
    refetch: fetchTrashedFiles,
  };
};
