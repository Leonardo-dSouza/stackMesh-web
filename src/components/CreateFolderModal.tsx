import { useState } from 'react';
import { X } from 'lucide-react';
import apiClient from '../services/apiClient';

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  parentId?: string | null;
}

export function CreateFolderModal({ isOpen, onClose, onSuccess, parentId = null }: CreateFolderModalProps) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Nome da pasta não pode estar vazio');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // POST /folders
      await apiClient.post('/folders', {
        name: name.trim(),
        parentId: parentId || null,
      });

      setName('');
      onSuccess();
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar pasta';
      setError(message);
      console.error('CreateFolderModal error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#1E293B]">Nova Pasta</h2>
          <button
            onClick={onClose}
            className="text-[#64748B] hover:text-[#1E293B] transition-colors"
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="folderName" className="block text-sm font-medium text-[#1E293B] mb-2">
              Nome da Pasta
            </label>
            <input
              id="folderName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Minha Pasta"
              className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B5CBE] focus:border-transparent"
              autoFocus
              disabled={loading}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[#475569] border border-[#E2E8F0] rounded-lg hover:bg-[#F8FAFC] transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#0B5CBE] text-white rounded-lg hover:bg-[#094A9B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Criando...' : 'Criar Pasta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
