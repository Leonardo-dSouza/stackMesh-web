import { useState, useRef } from 'react';
import { X, Upload, FileIcon, AlertCircle, CheckCircle } from 'lucide-react';
import apiClient from '../services/apiClient';

interface UploadedFile {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  s3Key?: string;
}

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  folderId?: string | null;
}

export function UploadModal({ isOpen, onClose, onSuccess, folderId = null }: UploadModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newFiles: UploadedFile[] = files.map((file) => ({
      file,
      progress: 0,
      status: 'pending',
    }));
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleUpload = async () => {
    setUploading(true);

    for (const uploadedFile of uploadedFiles.filter((f) => f.status === 'pending' || f.status === 'error')) {
      try {
        const idx = uploadedFiles.indexOf(uploadedFile);

        // Update status to uploading
        setUploadedFiles((prev) => {
          const updated = [...prev];
          updated[idx].status = 'uploading';
          return updated;
        });

        const { file } = uploadedFile;

        // Step 1: Request presigned upload URL
        const uploadUrlResponse = await apiClient.post<{
          uploadUrl: string;
          s3Key: string;
          fileId: string;
        }>('/files/upload-url', {
          name: file.name,
          sizeBytes: file.size,
          mimeType: file.type,
          folderId: folderId || null,
        });

        const { uploadUrl, s3Key } = uploadUrlResponse.data;

        // Step 2: Upload file directly to S3
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            setUploadedFiles((prev) => {
              const updated = [...prev];
              updated[idx].progress = percentComplete;
              return updated;
            });
          }
        });

        await new Promise((resolve, reject) => {
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(null);
            } else {
              reject(new Error(`S3 upload failed: ${xhr.status}`));
            }
          };
          xhr.onerror = () => reject(new Error('S3 upload failed'));
          xhr.open('PUT', uploadUrl);
          xhr.setRequestHeader('Content-Type', file.type);
          xhr.send(file);
        });

        // Step 3: Confirm upload in database
        await apiClient.post('/files/confirm', {
          s3Key,
          sizeBytes: file.size,
          name: file.name,
          mimeType: file.type,
          folderId: folderId || null,
        });

        // Update status to success
        setUploadedFiles((prev) => {
          const updated = [...prev];
          updated[idx].status = 'success';
          updated[idx].progress = 100;
          updated[idx].s3Key = s3Key;
          return updated;
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Upload failed';
        setUploadedFiles((prev) => {
          const updated = [...prev];
          updated[uploadedFiles.indexOf(uploadedFile)].status = 'error';
          updated[uploadedFiles.indexOf(uploadedFile)].error = message;
          return updated;
        });
      }
    }

    setUploading(false);

    // If all successful, close and refresh
    if (uploadedFiles.every((f) => f.status === 'success')) {
      setTimeout(() => {
        onSuccess();
        onClose();
        setUploadedFiles([]);
      }, 1000);
    }
  };

  const allComplete = uploadedFiles.every((f) => f.status === 'success');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#1E293B]">Fazer Upload</h2>
          <button
            onClick={onClose}
            className="text-[#64748B] hover:text-[#1E293B] transition-colors"
            disabled={uploading}
          >
            <X size={24} />
          </button>
        </div>

        {uploadedFiles.length === 0 ? (
          <div>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#CBD5E1] rounded-lg p-8 text-center cursor-pointer hover:border-[#0B5CBE] hover:bg-[#E3F2FD] transition-colors"
            >
              <Upload size={32} className="mx-auto mb-2 text-[#64748B]" />
              <p className="text-sm font-medium text-[#1E293B] mb-1">Clique para selecionar arquivos</p>
              <p className="text-xs text-[#64748B]">ou arraste e solte aqui</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        ) : (
          <div>
            <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
              {uploadedFiles.map((uploadedFile, idx) => (
                <div key={idx} className="border border-[#E2E8F0] rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <FileIcon size={16} className="text-[#64748B] flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-[#1E293B] truncate">
                          {uploadedFile.file.name}
                        </p>
                        <p className="text-xs text-[#64748B]">
                          {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    {uploadedFile.status === 'success' && (
                      <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                    )}
                    {uploadedFile.status === 'error' && (
                      <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                    )}
                  </div>

                  {uploadedFile.status === 'uploading' && (
                    <div>
                      <div className="w-full bg-[#E2E8F0] rounded-full h-2 mb-1">
                        <div
                          className="bg-[#0B5CBE] h-2 rounded-full transition-all"
                          style={{ width: `${uploadedFile.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-[#64748B]">{Math.round(uploadedFile.progress)}%</p>
                    </div>
                  )}

                  {uploadedFile.status === 'error' && (
                    <p className="text-xs text-red-600">{uploadedFile.error}</p>
                  )}

                  {uploadedFile.status === 'success' && (
                    <p className="text-xs text-green-600">Upload concluído</p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg hover:bg-[#F8FAFC] transition-colors disabled:opacity-50"
                disabled={uploading}
              >
                Adicionar mais
              </button>
              {allComplete ? (
                <button
                  onClick={() => {
                    onSuccess();
                    onClose();
                    setUploadedFiles([]);
                  }}
                  className="flex-1 px-3 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Fechar
                </button>
              ) : (
                <button
                  onClick={handleUpload}
                  className="flex-1 px-3 py-2 text-sm bg-[#0B5CBE] text-white rounded-lg hover:bg-[#094A9B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={uploading || uploadedFiles.length === 0}
                >
                  {uploading ? 'Enviando...' : 'Enviar'}
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        )}
      </div>
    </div>
  );
}
