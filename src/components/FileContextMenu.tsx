import { useRef, useEffect, useState } from 'react';
import { Download, Edit2, Trash2, Share2 } from 'lucide-react';
import apiClient from '../services/apiClient';

interface FileContextMenuProps {
  fileId: string;
  fileName: string;
  onDelete: () => void;
  onRename: (newName: string) => void;
  onClose: () => void;
  x: number;
  y: number;
}

export function FileContextMenu({
  fileId,
  fileName,
  onDelete,
  onRename,
  onClose,
  x,
  y
}: FileContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState(fileName);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleDownload = async () => {
    try {
      // GET /files/:id/download-url
      const response = await apiClient.get<{ downloadUrl: string }>(`/files/${fileId}/download-url`);
      const downloadUrl = response.data.downloadUrl;
      
      // Redirect to presigned URL
      window.location.href = downloadUrl;
    } catch (err) {
      console.error('Download error:', err);
      alert('Erro ao baixar arquivo');
    } finally {
      onClose();
    }
  };

  const handleRename = async () => {
    if (!newName.trim() || newName === fileName) {
      setRenaming(false);
      return;
    }

    try {
      setLoading(true);
      // PATCH /files/:id
      await apiClient.patch(`/files/${fileId}`, {
        name: newName.trim(),
      });
      onRename(newName.trim());
      setRenaming(false);
    } catch (err) {
      console.error('Rename error:', err);
      alert('Erro ao renomear arquivo');
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja deletar este arquivo?')) return;

    try {
      setLoading(true);
      // DELETE /files/:id
      await apiClient.delete(`/files/${fileId}`);
      onDelete();
    } catch (err) {
      console.error('Delete error:', err);
      alert('Erro ao deletar arquivo');
    } finally {
      setLoading(false);
      onClose();
    }
  };

  if (renaming) {
    return (
      <div
        ref={menuRef}
        className="absolute bg-white border border-[#E2E8F0] rounded-lg shadow-lg p-3 z-50"
        style={{ top: y, left: x }}
      >
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleRename();
            if (e.key === 'Escape') setRenaming(false);
          }}
          className="w-full px-2 py-1 border border-[#E2E8F0] rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#0B5CBE]"
          autoFocus
          disabled={loading}
        />
        <div className="flex gap-2 mt-2">
          <button
            onClick={handleRename}
            className="flex-1 px-2 py-1 text-xs bg-[#0B5CBE] text-white rounded hover:bg-[#094A9B] disabled:opacity-50"
            disabled={loading}
          >
            OK
          </button>
          <button
            onClick={() => setRenaming(false)}
            className="flex-1 px-2 py-1 text-xs border border-[#E2E8F0] rounded hover:bg-[#F8FAFC]"
            disabled={loading}
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={menuRef}
      className="absolute bg-white border border-[#E2E8F0] rounded-lg shadow-lg py-2 z-50"
      style={{ top: y, left: x, minWidth: '180px' }}
    >
      <button
        onClick={handleDownload}
        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[#1E293B] hover:bg-[#F8FAFC] transition-colors"
      >
        <Download size={16} />
        Download
      </button>

      <button
        onClick={() => setRenaming(true)}
        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[#1E293B] hover:bg-[#F8FAFC] transition-colors"
      >
        <Edit2 size={16} />
        Renomear
      </button>

      <button
        onClick={handleDelete}
        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
      >
        <Trash2 size={16} />
        Deletar
      </button>

      <div className="border-t border-[#E2E8F0] my-2" />

      <button
        disabled
        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[#94A3B8] cursor-not-allowed"
        title="Compartilhamento não implementado ainda"
      >
        <Share2 size={16} />
        Compartilhar (em breve)
      </button>
    </div>
  );
}
