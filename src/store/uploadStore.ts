import { create } from 'zustand';

export interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

interface UploadStore {
  files: UploadFile[];
  currentStep: 1 | 2 | 3; // 1: select, 2: preview, 3: settings
  selectedFolderId: string | null;
  isUploading: boolean;
  error: string | null;

  addFiles: (files: File[]) => void;
  removeFile: (fileId: string) => void;
  clearFiles: () => void;
  
  nextStep: () => void;
  prevStep: () => void;
  setCurrentStep: (step: 1 | 2 | 3) => void;
  
  setSelectedFolderId: (folderId: string | null) => void;
  setUploading: (uploading: boolean) => void;
  setError: (error: string | null) => void;
  
  updateFileProgress: (fileId: string, progress: number) => void;
  updateFileStatus: (fileId: string, status: UploadFile['status'], error?: string) => void;
  
  reset: () => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useUploadStore = create<UploadStore>((set) => ({
  files: [],
  currentStep: 1,
  selectedFolderId: null,
  isUploading: false,
  error: null,

  addFiles: (filesToAdd: File[]) => {
    set((state) => ({
      files: [
        ...state.files,
        ...filesToAdd.map((file) => ({
          id: generateId(),
          file,
          progress: 0,
          status: 'pending' as const,
        })),
      ],
    }));
  },

  removeFile: (fileId: string) => {
    set((state) => ({
      files: state.files.filter((f) => f.id !== fileId),
    }));
  },

  clearFiles: () => {
    set({ files: [] });
  },

  nextStep: () => {
    set((state) => ({
      currentStep: (state.currentStep + 1) as 1 | 2 | 3,
    }));
  },

  prevStep: () => {
    set((state) => ({
      currentStep: (state.currentStep - 1) as 1 | 2 | 3,
    }));
  },

  setCurrentStep: (step: 1 | 2 | 3) => {
    set({ currentStep: step });
  },

  setSelectedFolderId: (folderId: string | null) => {
    set({ selectedFolderId: folderId });
  },

  setUploading: (uploading: boolean) => {
    set({ isUploading: uploading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  updateFileProgress: (fileId: string, progress: number) => {
    set((state) => ({
      files: state.files.map((f) =>
        f.id === fileId ? { ...f, progress: Math.min(100, progress) } : f
      ),
    }));
  },

  updateFileStatus: (fileId: string, status: UploadFile['status'], error?: string) => {
    set((state) => ({
      files: state.files.map((f) =>
        f.id === fileId ? { ...f, status, error } : f
      ),
    }));
  },

  reset: () => {
    set({
      files: [],
      currentStep: 1,
      selectedFolderId: null,
      isUploading: false,
      error: null,
    });
  },
}));
