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

const getViewTitle = (view: ViewType): string => {
  switch (view) {
    case 'overview': return 'General';
    case 'connection': return 'Conexión LoRa';
    case 'telemetry': return 'Telemetría';
    case 'sensors': return 'Sensores';
    case 'map': return 'Mapa';
    case '3d': return 'Modelo 3D';
    case 'settings': return 'Configuración';
    case 'profile': return 'Ajustes de perfil';
    case 'ai': return 'Asistente IA';
    case 'diagnostics': return 'Diagnósticos';
    default: return 'Dashboard';
  }
};

export const DashboardApp = () => {
  const [activeView, setActiveView] = useState<ViewType>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

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
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header Superior Móvil con Botón Hamburguesa Animado */}
        <header className="flex md:hidden items-center justify-between px-4 py-3 bg-[#0a0a0a]/95 border-b border-[#c80a19]/15 backdrop-blur-xl z-[60] shrink-0 sticky top-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="relative p-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-[#c80a19]/20 hover:border-[#c80a19]/40 transition-all cursor-pointer w-10 h-10 flex items-center justify-center shrink-0 active:scale-95 z-[60]"
              aria-label={mobileOpen ? "Cerrar Menú" : "Abrir Menú"}
            >
              <div className="w-5 h-4 relative flex flex-col justify-between items-center pointer-events-none">
                {/* Bar 1 (Top) */}
                <span 
                  className={`absolute left-0 w-5 h-0.5 rounded-full bg-white transition-all duration-300 ease-in-out transform origin-center ${
                    mobileOpen 
                      ? 'top-[7px] rotate-45 bg-[#c80a19] shadow-[0_0_8px_rgba(200,10,25,0.8)]' 
                      : 'top-0 rotate-0'
                  }`} 
                />
                {/* Bar 2 (Middle) */}
                <span 
                  className={`absolute left-0 top-[7px] w-5 h-0.5 rounded-full bg-white transition-all duration-300 ease-in-out ${
                    mobileOpen 
                      ? 'opacity-0 scale-x-0' 
                      : 'opacity-100 scale-x-100'
                  }`} 
                />
                {/* Bar 3 (Bottom) */}
                <span 
                  className={`absolute left-0 w-5 h-0.5 rounded-full bg-white transition-all duration-300 ease-in-out transform origin-center ${
                    mobileOpen 
                      ? 'top-[7px] -rotate-45 bg-[#c80a19] shadow-[0_0_8px_rgba(200,10,25,0.8)]' 
                      : 'top-[14px] rotate-0'
                  }`} 
                />
              </div>
            </button>
            <div className="flex items-center gap-2">
              <img 
                src="/logo_sinfondoCansat2026.webp" 
                alt="Logo ORBITEC" 
                className="h-6 w-6 object-contain" 
              />
              <span className="font-title font-bold text-xs uppercase tracking-wider text-white">
                {getViewTitle(activeView)}
              </span>
            </div>
          </div>

          <span className="px-2 py-0.5 rounded-full bg-[#22c55e]/15 border border-[#22c55e]/30 text-[#22c55e] text-[9px] font-bold font-mono uppercase">
            EN VUELO
          </span>
        </header>

        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 custom-scrollbar scroll-smooth">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

