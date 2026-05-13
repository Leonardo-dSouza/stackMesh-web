import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useUserProfile } from '../hooks/useUserProfile';
import { Cloud, Folder, Clock, UploadCloud, Settings, LogOut } from 'lucide-react';

interface SideNavBarProps {
  onUploadClick?: () => void;
}

export function SideNavBar({ onUploadClick }: SideNavBarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { user } = useUserProfile();

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { label: 'Todos os Arquivos', icon: Folder, path: '/dashboard' },
    { label: 'Recentes', icon: Clock, path: '/recent' },
  ];

  // Calculate storage percentage (1GB = 1,073,741,824 bytes)
  const TOTAL_STORAGE_BYTES = BigInt(1_000_000_000 * 100); // 100 GB
  const usedBytes = user?.totalBytes || BigInt(0);
  const usedGb = Number(usedBytes) / (1024 * 1024 * 1024);
  const totalGb = Number(TOTAL_STORAGE_BYTES) / (1024 * 1024 * 1024);
  const storagePercent = Math.round((Number(usedBytes) / Number(TOTAL_STORAGE_BYTES)) * 100) || 0;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="hidden md:flex flex-col w-[260px] p-6 gap-6 bg-surface dark:bg-background border-r border-[#E2E8F0] dark:border-on-surface-variant fixed left-0 top-0 h-full z-30">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-2">
        <Cloud className="text-primary" size={32} />
        <div>
          <h1 className="text-headline-sm font-semibold text-[#0B3B7C] tracking-tight m-0 leading-tight">
            StackMesh
          </h1>
          <p className="text-[0.7rem] font-medium text-on-surface-variant uppercase tracking-wider m-0 leading-tight">
            Armazenamento Nuvem
          </p>
        </div>
      </div>

      {/* Upload Button */}
      <button
        onClick={onUploadClick}
        className="bg-[#0B5CBE] text-white hover:bg-[#094A9B] transition-colors rounded-lg py-3 px-4 flex items-center justify-center gap-2 w-full font-semibold mb-2 shadow-sm font-body-sm"
      >
        <UploadCloud size={20} />
        Fazer Upload
      </button>

      {/* Menu */}
      <div className="flex-1 flex flex-col gap-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-4 px-4 py-2.5 rounded-lg transition-colors font-body-sm ${
              isActive(item.path)
                ? 'bg-[#E3F2FD] text-[#0B3B7C] font-semibold'
                : 'text-[#475569] hover:bg-surface-container-high'
            }`}
          >
            <item.icon size={20} className={isActive(item.path) ? 'text-[#0B5CBE]' : 'text-[#64748B]'} />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Storage Status */}
      <div className="mt-auto border-t border-[#E2E8F0] pt-4 flex flex-col gap-1">
        <div className="px-2 mb-4">
          <div className="flex items-center gap-2 mb-2 text-[#475569]">
            <Cloud size={20} />
            <span className="text-sm font-medium text-[#1E293B]">Armazenamento</span>
          </div>
          <div className="w-full bg-[#E2E8F0] rounded-full h-1.5 mb-2 mt-3">
            <div
              className={`h-1.5 rounded-full transition-all ${
                storagePercent > 80 ? 'bg-red-500' : 'bg-[#0B5CBE]'
              }`}
              style={{ width: `${Math.min(storagePercent, 100)}%` }}
            ></div>
          </div>
          <span className="text-xs text-[#64748B] font-medium">
            {usedGb.toFixed(2)} GB de {totalGb.toFixed(0)} GB usados
          </span>
        </div>

        <Link
          to="/settings"
          className="text-[#475569] hover:bg-surface-container-high rounded-lg flex items-center gap-4 px-4 py-2.5 transition-colors font-body-sm"
        >
          <Settings size={20} className="text-[#64748B]" />
          <span>Configurações</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full text-[#475569] hover:bg-surface-container-high rounded-lg flex items-center gap-4 px-4 py-2.5 transition-colors text-left font-body-sm"
        >
          <LogOut size={20} className="text-[#64748B]" />
          <span>Sair</span>
        </button>
      </div>
    </nav>
  );
}
