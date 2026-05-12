import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Menu, Search, HelpCircle, Bell } from 'lucide-react';

export function TopAppBar() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user } = useAuthStore();

  return (
    <header className="fixed top-0 md:left-[260px] left-0 md:w-[calc(100%-260px)] w-full z-20 flex items-center justify-between px-8 h-[72px] bg-[#F8FAFC] dark:bg-background">
      <div className="flex items-center gap-4 flex-1">
        <button className="md:hidden text-on-surface-variant">
          <Menu size={24} />
        </button>

        <div className="relative w-full max-w-xl hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" size={20} />
          <input
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E2E8F0] shadow-sm rounded-lg text-sm focus:border-[#0B5CBE] focus:ring-1 focus:ring-[#0B5CBE] transition-all outline-none text-[#1E293B] placeholder:text-[#94A3B8]"
            placeholder="Pesquisar arquivos, pastas ou conteúdo..."
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <button className="text-[#64748B] hover:bg-[#E2E8F0] transition-colors p-2 rounded-full hidden sm:flex items-center justify-center">
          <HelpCircle size={22} />
        </button>

        <button className="text-[#64748B] hover:bg-[#E2E8F0] transition-colors p-2 rounded-full relative flex items-center justify-center mr-2">
          <Bell size={22} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#EF4444] rounded-full border border-white"></span>
        </button>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-[34px] h-[34px] rounded-full overflow-hidden border-2 border-white shadow-sm cursor-pointer hover:ring-2 hover:ring-[#E2E8F0] transition-all bg-[#0B5CBE]"
          >
            <div className="w-full h-full flex items-center justify-center text-white font-semibold text-sm">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-[#E2E8F0] rounded-xl shadow-lg p-2 z-10">
              <div className="px-3 py-2 text-sm text-[#475569] border-b border-[#E2E8F0] mb-2 font-medium">
                {user?.email}
              </div>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  // Navigate to settings
                }}
                className="w-full text-left text-sm text-[#1E293B] hover:bg-[#F1F5F9] px-3 py-2 rounded-lg transition-colors"
              >
                Configurações
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
