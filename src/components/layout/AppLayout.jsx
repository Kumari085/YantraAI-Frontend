import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import GlobalSearchModal from './GlobalSearchModal';
import TelemetryDrawer from './TelemetryDrawer';

export const AppLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isTelemetryOpen, setIsTelemetryOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen bg-[#0b0e14] text-slate-100 overflow-hidden font-sans select-text">
      {/* Collapsible Left Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenTelemetry={() => setIsTelemetryOpen(true)}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#0c0f16]">
        {/* Top Header */}
        <Header onOpenTelemetry={() => setIsTelemetryOpen(false)} />

        {/* Dynamic Route View */}
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
          <Outlet />
        </main>
      </div>

      {/* Global Modals & Drawers */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <TelemetryDrawer
        isOpen={isTelemetryOpen}
        onClose={() => setIsTelemetryOpen(false)}
      />
    </div>
  );
};

export default AppLayout;
