import { DashboardLayout } from '../components/DashboardLayout';
import { Home, Clock } from 'lucide-react';

export function RecentPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-section-gap">
        <div className="flex items-center text-body-sm text-[#64748B] mb-4">
          <Home size={18} className="mr-2" />
          <span className="mx-1">/</span>
          <span className="text-[#1E293B] font-bold">Recentes</span>
        </div>

        <h2 className="text-title-sm font-bold text-[#1E293B] mb-6">Arquivos Acessados Recentemente</h2>
        
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-16 text-center shadow-sm">
          <Clock size={48} className="text-[#94A3B8] mx-auto mb-4" />
          <p className="text-body-lg font-bold text-[#1E293B]">
            Nenhum arquivo acessado recentemente
          </p>
          <p className="text-body-sm text-[#64748B] mt-2">
            Os arquivos que você acessar aparecerão aqui.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
