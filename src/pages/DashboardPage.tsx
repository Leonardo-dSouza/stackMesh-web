import { DashboardLayout } from '../components/DashboardLayout';
import { Home, LayoutGrid, List, Filter, Folder, MoreVertical, FolderPlus, FileText, Image as ImageIcon, File, MoreHorizontal, Loader, AlertCircle } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { File as FileType, Folder as FolderType } from '../types';
import { useFiles } from '../hooks/useFiles';
import { useFolders } from '../hooks/useFolders';
import { CreateFolderModal } from '../components/CreateFolderModal';
import { FileContextMenu } from '../components/FileContextMenu';
import apiClient from '../services/apiClient';

const getFileTypeFromMime = (mimeType: string): string => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType === 'application/pdf') return 'pdf';
  if (mimeType.includes('word') || mimeType.includes('document')) return 'doc';
  return 'file';
};

const getFileTypeFromName = (fileName: string): string => {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return 'image';
  if (ext === 'pdf') return 'pdf';
  if (['doc', 'docx', 'txt'].includes(ext)) return 'doc';
  return 'file';
};

const formatFileSize = (bytes: bigint | number): string => {
  const num = typeof bytes === 'bigint' ? Number(bytes) : bytes;
  if (num === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(num) / Math.log(k));
  return Math.round((num / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

const getIconForFileType = (type: string) => {
  switch (type) {
    case 'pdf':
      return <FileText size={24} className={getColorForFileType(type)} />;
    case 'image':
      return <ImageIcon size={24} className={getColorForFileType(type)} />;
    case 'doc':
      return <File size={24} className={getColorForFileType(type)} />;
    default:
      return <File size={24} className={getColorForFileType(type)} />;
  }
};

const getColorForFileType = (type: string) => {
  switch (type) {
    case 'pdf':
      return 'text-[#EF4444]';
    case 'image':
      return 'text-[#F97316]';
    case 'doc':
      return 'text-[#0B5CBE]';
    default:
      return 'text-[#64748B]';
  }
};

export function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentFolderId = searchParams.get('folderId');

  const { files, loading: filesLoading, error: filesError, refetch: refetchFiles } = useFiles(null);
  const { folders, loading: foldersLoading, error: foldersError, refetch: refetchFolders } = useFolders(null);

  const [folderContents, setFolderContents] = useState<{ folder: FolderType | null; folders: FolderType[]; files: FileType[] }>({
    folder: null,
    folders: [],
    files: [],
  });
  const [folderLoading, setFolderLoading] = useState(false);
  const [folderError, setFolderError] = useState<string | null>(null);

  const fetchFolderContents = useCallback(async () => {
    if (!currentFolderId) return;
    try {
      setFolderLoading(true);
      setFolderError(null);
      const response = await apiClient.get(`/folders/${currentFolderId}`);
      setFolderContents({
        folder: response.data.folder || null,
        folders: response.data.folders || [],
        files: response.data.files || [],
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch folder contents';
      setFolderError(message);
      console.error('fetchFolderContents error:', err);
    } finally {
      setFolderLoading(false);
    }
  }, [currentFolderId]);

  useEffect(() => {
    if (currentFolderId) {
      fetchFolderContents();
    }
  }, [currentFolderId, fetchFolderContents]);

  useEffect(() => {
    const handleUploadSuccess = () => {
      if (currentFolderId) {
        fetchFolderContents();
      } else {
        refetchFiles();
        refetchFolders();
      }
    };

    window.addEventListener('upload:success', handleUploadSuccess as EventListener);
    return () => window.removeEventListener('upload:success', handleUploadSuccess as EventListener);
  }, [currentFolderId, fetchFolderContents, refetchFiles, refetchFolders]);

  // Modal states
  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    fileId: string;
    fileName: string;
    x: number;
    y: number;
  } | null>(null);

  // Handlers
  const handleCreateFolder = () => {
    setCreateFolderOpen(true);
  };

  const handleOpenFolder = (folderId: string) => {
    setSearchParams({ folderId });
  };

  const handleGoToRoot = () => {
    setSearchParams({});
  };

  const handleFileContextMenu = (
    e: React.MouseEvent,
    fileId: string,
    fileName: string
  ) => {
    e.preventDefault();
    setContextMenu({
      fileId,
      fileName,
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleFileDelete = () => {
    if (currentFolderId) {
      fetchFolderContents();
    } else {
      refetchFiles();
    }
  };

  const handleFileRename = () => {
    if (currentFolderId) {
      fetchFolderContents();
    } else {
      refetchFiles();
    }
  };

  const visibleFolders = currentFolderId ? folderContents.folders : folders;
  const visibleFiles = currentFolderId ? folderContents.files : files;
  const isFoldersLoading = currentFolderId ? folderLoading : foldersLoading;
  const isFilesLoading = currentFolderId ? folderLoading : filesLoading;
  const foldersErrorMessage = currentFolderId ? folderError : foldersError;
  const filesErrorMessage = currentFolderId ? folderError : filesError;
  return (
    <DashboardLayout>
      <div className="flex flex-col max-w-[1400px] mx-auto">
        {/* Breadcrumbs & Actions */}
        <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
          <div className="flex items-center text-sm font-medium text-[#64748B]">
            <Home size={18} className="mr-2" />
            <span className="mx-1">/</span>
            <button
              className="mx-1 hover:text-[#0B5CBE] transition-colors"
              onClick={handleGoToRoot}
              type="button"
            >
              StackMesh
            </button>
            <span className="mx-1">/</span>
            <span className="text-[#1E293B] font-bold">
              {currentFolderId && folderContents.folder ? folderContents.folder.name : 'Todos os Arquivos'}
            </span>
          </div>

          <div className="flex gap-2">
            <button className="w-10 h-10 flex items-center justify-center border border-[#E2E8F0] rounded-lg bg-[#E3F2FD] text-[#0B5CBE] transition-colors shadow-sm" title="Visualização em Grade">
              <LayoutGrid size={20} />
            </button>
            <button className="w-10 h-10 flex items-center justify-center border border-[#E2E8F0] rounded-lg bg-white text-[#64748B] hover:bg-[#F1F5F9] transition-colors shadow-sm" title="Visualização em Lista">
              <List size={20} />
            </button>
            <button className="w-10 h-10 flex items-center justify-center border border-[#E2E8F0] rounded-lg bg-white text-[#64748B] hover:bg-[#F1F5F9] transition-colors shadow-sm ml-2" title="Filtros">
              <Filter size={20} />
            </button>
          </div>
        </div>

        {/* Folders Section */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-[#1E293B] mb-4">Pastas</h2>
          {foldersErrorMessage && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle size={20} />
              <span>Erro ao carregar pastas: {foldersErrorMessage}</span>
            </div>
          )}
          {isFoldersLoading && (
            <div className="flex items-center justify-center h-40">
              <Loader size={32} className="animate-spin text-[#0B5CBE]" />
            </div>
          )}
          {!isFoldersLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
              {visibleFolders.length === 0 ? (
                <div className="col-span-full text-center py-8 text-[#64748B]">
                  <p className="text-sm">Nenhuma pasta encontrada</p>
                </div>
              ) : (
                visibleFolders.map((folder) => (
                  <div
                    key={folder.id}
                    onClick={() => handleOpenFolder(folder.id)}
                    className="bg-white border border-[#E2E8F0] rounded-2xl p-5 hover:shadow-md hover:border-[#CBD5E1] transition-all cursor-pointer group flex flex-col h-[140px]"
                  >
                    <div className="flex justify-between items-start mb-auto">
                      <Folder size={32} className="text-[#0B5CBE] fill-[#0B5CBE]/10" />
                      <button className="text-[#94A3B8] hover:text-[#1E293B] transition-colors">
                        <MoreVertical size={20} />
                      </button>
                    </div>
                    <div>
                      <h3 className="text-[15px] font-bold text-[#1E293B] mb-1 truncate">
                        {folder.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-[#64748B] font-medium">
                          {folder.files?.length || 0} arquivos
                        </p>
                        <div className="flex -space-x-1">
                          <div className="w-6 h-6 rounded-full bg-[#E2E8F0] border border-white flex items-center justify-center text-[10px] text-[#475569] font-bold">
                            {folder.name.substring(0, 2).toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* Add Folder Action */}
              <div
                onClick={handleCreateFolder}
                className="bg-white/50 border-2 border-dashed border-[#CBD5E1] rounded-2xl flex flex-col items-center justify-center hover:bg-[#F8FAFC] hover:border-[#94A3B8] transition-all cursor-pointer text-[#64748B] group h-[140px]"
              >
                <FolderPlus size={32} className="mb-2 text-[#94A3B8] group-hover:text-[#475569]" />
                <span className="text-sm font-semibold group-hover:text-[#475569]">Nova Pasta</span>
              </div>
            </div>
          )}
        </div>

        {/* Recent Files Section */}
        <div>
          <h2 className="text-lg font-bold text-[#1E293B] mb-4">Arquivos Recentes</h2>
          {filesErrorMessage && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle size={20} />
              <span>Erro ao carregar arquivos: {filesErrorMessage}</span>
            </div>
          )}
          {isFilesLoading && (
            <div className="flex items-center justify-center h-40">
              <Loader size={32} className="animate-spin text-[#0B5CBE]" />
            </div>
          )}
          {!isFilesLoading && (
            <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm">
              <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-[#E2E8F0] text-xs font-bold text-[#64748B] uppercase tracking-wider bg-white">
                <div className="col-span-6 md:col-span-6">Nome</div>
                <div className="col-span-3 hidden md:block">Data de Modificação</div>
                <div className="col-span-2 hidden md:block">Tamanho</div>
                <div className="col-span-6 md:col-span-1 text-right">Ações</div>
              </div>

              {/* File Rows */}
              {visibleFiles.length === 0 ? (
                <div className="px-6 py-8 text-center text-[#64748B]">
                  <p className="text-sm">Nenhum arquivo encontrado</p>
                </div>
              ) : (
                visibleFiles
                  .sort((a, b) => {
                    const dateA = new Date(a.createdAt || 0).getTime();
                    const dateB = new Date(b.createdAt || 0).getTime();
                    return dateB - dateA;
                  })
                  .slice(0, 10)
                  .map((file, index) => {
                    const fileType = getFileTypeFromMime(file.mimeType) || getFileTypeFromName(file.name);
                    return (
                      <div
                        key={file.id}
                        className={`grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors group ${visibleFiles.length - 1 === index ? 'border-b-0' : ''}`}
                      >
                        <div className="col-span-6 md:col-span-6 flex items-center gap-4">
                          {getIconForFileType(fileType)}
                          <span className="text-sm font-bold text-[#1E293B] truncate cursor-pointer group-hover:text-[#0B5CBE] transition-colors">
                            {file.name}
                          </span>
                        </div>
                        <div className="col-span-3 hidden md:block text-sm text-[#475569]">
                          {formatDate(file.createdAt)}
                        </div>
                        <div className="col-span-2 hidden md:block text-sm text-[#475569]">
                          {formatFileSize(file.sizeBytes)}
                        </div>
                        <div className="col-span-6 md:col-span-1 flex justify-end">
                          <button
                            onClick={(e) =>
                              handleFileContextMenu(e, file.id, file.name)
                            }
                            onContextMenu={(e) =>
                              handleFileContextMenu(e, file.id, file.name)
                            }
                            className="text-[#94A3B8] hover:text-[#1E293B] p-1"
                            title="Ações"
                          >
                            <MoreHorizontal size={20} />
                          </button>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          )}
        </div>

        {/* Modals */}
        <CreateFolderModal
          isOpen={createFolderOpen}
          onClose={() => setCreateFolderOpen(false)}
          onSuccess={() => {
            if (currentFolderId) {
              fetchFolderContents();
            } else {
              refetchFolders();
            }
          }}
          parentId={currentFolderId}
        />

        {contextMenu && (
          <FileContextMenu
            fileId={contextMenu.fileId}
            fileName={contextMenu.fileName}
            onDelete={handleFileDelete}
            onRename={handleFileRename}
            onClose={() => setContextMenu(null)}
            x={contextMenu.x}
            y={contextMenu.y}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
