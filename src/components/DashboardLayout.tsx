import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SideNavBar } from './SideNavBar';
import { TopAppBar } from './TopAppBar';
import { UploadModal } from './UploadModal';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [searchParams] = useSearchParams();
  const [uploadOpen, setUploadOpen] = useState(false);
  const currentFolderId = searchParams.get('folderId');

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      <SideNavBar onUploadClick={() => setUploadOpen(true)} />
      <TopAppBar />
      <main className="flex-1 flex flex-col md:ml-[260px] overflow-hidden">
        <div className="flex-1 overflow-y-auto mt-[72px] p-8">
          {children}
        </div>
      </main>

      <UploadModal
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSuccess={() => {
          window.dispatchEvent(new CustomEvent('upload:success'));
          setUploadOpen(false);
        }}
        folderId={currentFolderId}
      />
    </div>
  );
}
