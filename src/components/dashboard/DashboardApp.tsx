import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
// Import Views
import { OverviewView } from './views/OverviewView';
import { TelemetryView } from './views/TelemetryView';
import { MapView } from './views/MapView';
import { ChartsView } from './views/ChartsView';
import { ConnectionView } from './views/ConnectionView';
import { ThreeDView } from './views/ThreeDView';
import { AIView } from './views/AIView';
import { DiagnosticsView } from './views/DiagnosticsView';
import { SettingsView } from './views/SettingsView';
import { ProfileView } from './views/ProfileView';

export type ViewType = 'overview' | 'telemetry' | 'map' | 'sensors' | '3d' | 'ai' | 'diagnostics' | 'replay' | 'connection' | 'settings' | 'profile';

export const DashboardApp = () => {
  const [activeView, setActiveView] = useState<ViewType>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderView = () => {
    switch (activeView) {
      case 'overview': return <OverviewView />;
      case 'telemetry': return <TelemetryView />;
      case 'map': return <MapView />;
      case 'sensors': return <ChartsView />;
      case '3d': return <ThreeDView />;
      case 'ai': return <AIView />;
      case 'diagnostics': return <DiagnosticsView />;
      case 'connection': return <ConnectionView />;
      case 'settings': return <SettingsView />;
      case 'profile': return <ProfileView />;
      default: return <OverviewView />;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0a0a0a] text-white selection:bg-[#c80a19]/30">
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
      />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <main className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar scroll-smooth">
          {renderView()}
        </main>
      </div>
    </div>
  );
};
