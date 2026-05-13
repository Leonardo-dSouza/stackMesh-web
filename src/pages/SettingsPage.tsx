import { DashboardLayout } from '../components/DashboardLayout';
import { useAuthStore } from '../store/authStore';
import { useUserProfile } from '../hooks/useUserProfile';
import { Home, AlertCircle, Loader } from 'lucide-react';

export function SettingsPage() {
  const { user: authUser } = useAuthStore();
  const { user, loading, error } = useUserProfile();

  const formatFileSize = (bytes: bigint | number | undefined): string => {
    if (!bytes) return '0 B';
    const num = typeof bytes === 'bigint' ? Number(bytes) : bytes;
    if (num === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(num) / Math.log(k));
    return Math.round((num / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const TOTAL_STORAGE_BYTES = BigInt(100_000_000_000);

  return (
    <DashboardLayout>
      <div className="flex flex-col max-w-4xl mx-auto">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm font-medium text-[#64748B] mb-8 gap-1">
          <Home size={18} className="mr-2" />
          <span>/</span>
          <span className="mx-1 text-[#1E293B] font-bold">Configurações</span>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center h-40">
            <Loader size={32} className="animate-spin text-[#0B5CBE]" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle size={20} />
            <span>Erro ao carregar configurações: {error}</span>
          </div>
        )}

        {/* Settings Sections */}
        {!loading && (
          <div className="space-y-6">
            {/* Profile Section */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#1E293B] mb-4">Perfil</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#475569] mb-1">Email</label>
                  <p className="text-base text-[#1E293B] font-medium">
                    {user?.email || authUser?.email || 'Não carregado'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#475569] mb-1">ID do Usuário</label>
                  <p className="text-sm text-[#64748B] font-mono">
                    {user?.id || authUser?.id || 'Não carregado'}
                  </p>
                </div>
              </div>
            </div>

            {/* Storage Section */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#1E293B] mb-4">Armazenamento</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#475569] mb-2">Uso de Armazenamento</label>
                  <div className="space-y-2">
                    <div className="w-full bg-[#E2E8F0] rounded-full h-2">
                      <div
                        className="bg-[#0B5CBE] h-2 rounded-full transition-all"
                        style={{
                          width: `${Math.min((Number(user?.totalBytes || 0) / Number(TOTAL_STORAGE_BYTES)) * 100, 100)}%`,
                        }}
                      />
                    </div>
                    <p className="text-sm text-[#64748B] font-medium">
                      {formatFileSize(user?.totalBytes)} de 100 GB usados
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#475569] mb-1">Espaço Disponível</label>
                  <p className="text-base text-[#1E293B] font-medium">
                    {formatFileSize(
                      TOTAL_STORAGE_BYTES - (typeof user?.totalBytes === 'bigint' ? user.totalBytes : BigInt(user?.totalBytes || 0))
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Account Section */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#1E293B] mb-4">Conta</h2>

              <div className="space-y-3">
                <button className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg text-[#475569] hover:bg-[#F8FAFC] transition-colors text-sm font-medium disabled:opacity-50 cursor-not-allowed" disabled>
                  Alterar Senha (em breve)
                </button>
                <button className="w-full px-4 py-2 border border-red-200 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-sm font-medium disabled:opacity-50 cursor-not-allowed" disabled>
                  Deletar Conta (em breve)
                </button>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#1E293B] mb-4">Sobre</h2>

              <div className="space-y-2 text-sm text-[#64748B]">
                <p>
                  <strong className="text-[#1E293B]">StackMesh</strong> é um serviço de armazenamento em nuvem seguro e confiável.
                </p>
                <p className="text-xs text-[#94A3B8]">Versão 1.0.0</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
