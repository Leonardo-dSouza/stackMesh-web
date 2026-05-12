export interface User {
  id: string;
  email: string;
  totalBytes: number;
}

export interface Folder {
  id: string;
  name: string;
  userId: string;
  parentId: string | null;
  deletedAt: string | null;
  children?: Folder[];
  files?: File[];
}

export interface File {
  id: string;
  name: string;
  s3Key: string;
  mimeType: string;
  sizeBytes: number;
  userId: string;
  folderId: string | null;
  deletedAt: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface UploadSession {
  uploadUrl: string;
  s3Key: string;
  expiresAt: string;
}

export interface UploadConfirmResponse {
  id: string;
  name: string;
  s3Key: string;
  mimeType: string;
  sizeBytes: number;
}
