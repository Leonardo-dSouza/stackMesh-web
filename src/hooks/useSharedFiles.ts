import { useState, useEffect } from 'react';
import type { File } from '../types';

interface UseSharedFilesState {
  files: File[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Stub for shared files — backend doesn't have sharing feature yet
 * When implemented, will need:
 * - File model: sharedWith[] relation
 * - GET /files/shared endpoint
 * - POST /files/:id/share and DELETE /files/:id/share endpoints
 */
export const useSharedFiles = (): UseSharedFilesState => {
  const [files] = useState<File[]>([]);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  const refetch = async () => {
    // TODO: Implement when backend adds sharing feature
    console.warn('Shared files feature not yet implemented');
  };

  useEffect(() => {
    // No-op for now
  }, []);

  return {
    files,
    loading,
    error,
    refetch,
  };
};
