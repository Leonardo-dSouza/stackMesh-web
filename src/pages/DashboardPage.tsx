import { DashboardLayout } from '../components/DashboardLayout';
import { Home, LayoutGrid, List, Filter, Folder, MoreVertical, FolderPlus, FileText, Image as ImageIcon, File, MoreHorizontal } from 'lucide-react';

const MOCK_FOLDERS = [
  { id: '1', name: 'Projeto Marketing Q4...', fileCount: 12, size: '4.2 GB', users: 3 },
  { id: '2', name: 'Faturas 2024', fileCount: 45, size: '1.1 GB', users: 1 },
  { id: '3', name: 'Arquivos de Design - v2', fileCount: 128, size: '15.6 GB', users: 2 },
];

const MOCK_FILES = [
  { id: '1', name: 'Relatorio_Financeiro_Q3_Final.pdf', type: 'pdf', date: '12 de Out, 2023', size: '2.4 MB' },
  { id: '2', name: 'Homepage_Hero_Mockup_v3.png', type: 'image', date: '11 de Out, 2023', size: '8.1 MB' },
  { id: '3', name: 'Notas_Reuniao_Projeto.docx', type: 'doc', date: '09 de Out, 2023', size: '142 KB' },
];

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
  return (
    <DashboardLayout>
      <div className="flex flex-col max-w-[1400px] mx-auto">
        {/* Breadcrumbs & Actions */}
        <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
          <div className="flex items-center text-sm font-medium text-[#64748B]">
            <Home size={18} className="mr-2" />
            <span className="mx-1">/</span>
            <span className="mx-1">StackMesh</span>
            <span className="mx-1">/</span>
            <span className="text-[#1E293B] font-bold">Todos os Arquivos</span>
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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {MOCK_FOLDERS.map((folder) => (
              <div
                key={folder.id}
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
                      {folder.fileCount} arquivos · {folder.size}
                    </p>
                    <div className="flex -space-x-1">
                      <div className="w-6 h-6 rounded-full bg-[#E2E8F0] border border-white flex items-center justify-center text-[10px] text-[#475569] font-bold">
                        JD
                      </div>
                      {folder.users > 1 && (
                        <div className="w-6 h-6 rounded-full bg-[#F1F5F9] border border-white flex items-center justify-center text-[10px] text-[#475569] font-bold">
                          +{folder.users - 1}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Add Folder Action */}
            <div className="bg-white/50 border-2 border-dashed border-[#CBD5E1] rounded-2xl flex flex-col items-center justify-center hover:bg-[#F8FAFC] hover:border-[#94A3B8] transition-all cursor-pointer text-[#64748B] group h-[140px]">
              <FolderPlus size={32} className="mb-2 text-[#94A3B8] group-hover:text-[#475569]" />
              <span className="text-sm font-semibold group-hover:text-[#475569]">Nova Pasta</span>
            </div>
          </div>
        </div>

        {/* Recent Files Section */}
        <div>
          <h2 className="text-lg font-bold text-[#1E293B] mb-4">Arquivos Recentes</h2>
          <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-[#E2E8F0] text-xs font-bold text-[#64748B] uppercase tracking-wider bg-white">
              <div className="col-span-6 md:col-span-6">Nome</div>
              <div className="col-span-3 hidden md:block">Data de Modificação</div>
              <div className="col-span-2 hidden md:block">Tamanho</div>
              <div className="col-span-6 md:col-span-1 text-right">Ações</div>
            </div>

            {/* File Rows */}
            {MOCK_FILES.map((file, index) => (
              <div
                key={file.id}
                className={`grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors group ${index === MOCK_FILES.length - 1 ? 'border-b-0' : ''}`}
              >
                <div className="col-span-6 md:col-span-6 flex items-center gap-4">
                  {getIconForFileType(file.type)}
                  <span className="text-sm font-bold text-[#1E293B] truncate cursor-pointer group-hover:text-[#0B5CBE] transition-colors">
                    {file.name}
                  </span>
                </div>
                <div className="col-span-3 hidden md:block text-sm text-[#475569]">
                  {file.date}
                </div>
                <div className="col-span-2 hidden md:block text-sm text-[#475569]">
                  {file.size}
                </div>
                <div className="col-span-6 md:col-span-1 flex justify-end">
                  <button className="text-[#94A3B8] hover:text-[#1E293B] p-1" title="Ações">
                    <MoreHorizontal size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
