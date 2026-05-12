import React from 'react';
import { SideNavBar } from './SideNavBar';
import { TopAppBar } from './TopAppBar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      <SideNavBar />
      <TopAppBar />
      <main className="flex-1 flex flex-col md:ml-[260px] overflow-hidden">
        <div className="flex-1 overflow-y-auto mt-[72px] p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
