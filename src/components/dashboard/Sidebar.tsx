import React from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  Map as MapIcon, 
  LineChart, 
  Box, 
  ChevronLeft,
  ChevronRight,
  User,
  LogOut,
  Radio,
  Settings
} from 'lucide-react';
import type { ViewType } from './DashboardApp';

interface SidebarProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

interface NavItem {
  id: ViewType;
  label: string;
  icon: React.ElementType;
}

const mainNavItems: NavItem[] = [
  { id: 'overview', label: 'General', icon: LayoutDashboard },
  { id: 'connection', label: 'Conexión LoRa', icon: Radio },
  { id: 'telemetry', label: 'Telemetría', icon: Activity },
  { id: 'sensors', label: 'Sensores', icon: LineChart },
  { id: 'map', label: 'Mapa', icon: MapIcon },
  { id: '3d', label: 'Modelo 3D', icon: Box },
];

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeView, 
  setActiveView, 
  isOpen, 
  setIsOpen,
  mobileOpen = false,
  setMobileOpen
}) => {
  const handleNavClick = (view: ViewType) => {
    setActiveView(view);
    if (setMobileOpen) {
      setMobileOpen(false);
    }
  };

  return (
    <>
      {/* Overlay Backdrop de Fondo para Dispositivos Móviles */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen && setMobileOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden transition-opacity animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      {/* Contenedor Principal del Sidebar (Desktop Panel + Mobile Drawer) */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-[#c80a19]/20 bg-[#0a0a0a]/98 backdrop-blur-2xl transition-all duration-300 ease-in-out md:static md:z-20 md:border-[#c80a19]/10 pt-16 md:pt-0 ${
          mobileOpen ? 'translate-x-0 w-72 shadow-[0_0_50px_rgba(200,10,25,0.25)]' : '-translate-x-full md:translate-x-0'
        } ${
          isOpen ? 'md:w-64' : 'md:w-20'
        }`}
      >
        {/* Header del Logo ORBITEC CANSAT en Desktop */}
        <div className="hidden md:flex items-center justify-between h-20 px-5 border-b border-[#c80a19]/10">
          <div className="flex items-center gap-3">
            {isOpen ? (
              <img 
                src="/logo-texto-cansat2026-cropped.webp" 
                alt="CANSAT ORBITEC" 
                className="h-7 w-auto object-contain" 
              />
            ) : (
              <img 
                src="/logo_sinfondoCansat2026.webp" 
                alt="Logo ORBITEC" 
                className="h-8 w-8 object-contain" 
              />
            )}
          </div>
        </div>

        {/* Botón Desktop para colapsar/expandir menú lateral (oculto en móvil) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="hidden md:flex absolute -right-3 top-24 h-6 w-6 items-center justify-center rounded-full border border-white/20 bg-[#0a0a0a] text-white hover:bg-[#c80a19] hover:border-[#c80a19] transition-colors shadow-lg cursor-pointer z-30"
          title={isOpen ? "Colapsar Menú" : "Expandir Menú"}
        >
          {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>

        {/* Lista de Navegación de Pestañas */}
        <div className="flex-1 overflow-y-auto py-5 px-3 flex flex-col gap-1 custom-scrollbar">
          <nav className="flex flex-col gap-1.5">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all text-sm font-mono cursor-pointer ${
                    isActive 
                      ? 'bg-gradient-to-r from-[#c80a19] to-[#8b0712] text-white font-bold shadow-[0_0_15px_rgba(200,10,25,0.3)] border-l-4 border-[#c80a19]' 
                      : 'text-white/70 hover:bg-white/10 hover:text-white hover:border-l-4 hover:border-[#c80a19]/50'
                  }`}
                  title={!isOpen ? item.label : undefined}
                >
                  <Icon size={19} className={`shrink-0 ${isActive ? 'text-white' : 'text-white/60'}`} />
                  <span className={`truncate ${!isOpen ? 'md:hidden' : 'block'}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}

            <div className="my-3 border-t border-white/10" />

            {/* Ajustes de Configuración */}
            <button 
              onClick={() => handleNavClick('settings')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all text-sm font-mono cursor-pointer ${
                activeView === 'settings' 
                  ? 'bg-gradient-to-r from-[#c80a19] to-[#8b0712] text-white font-bold shadow-[0_0_15px_rgba(200,10,25,0.3)] border-l-4 border-[#c80a19]' 
                  : 'text-white/70 hover:bg-white/10 hover:text-white hover:border-l-4 hover:border-[#c80a19]/50'
              }`} 
              title={!isOpen ? "Configuración" : undefined}
            >
              <Settings size={19} className={`shrink-0 ${activeView === 'settings' ? 'text-white' : 'text-white/60'}`} />
              <span className={`truncate ${!isOpen ? 'md:hidden' : 'block'}`}>
                Configuración
              </span>
            </button>

            {/* Ajustes de Perfil */}
            <button 
              onClick={() => handleNavClick('profile')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all text-sm font-mono cursor-pointer ${
                activeView === 'profile' 
                  ? 'bg-gradient-to-r from-[#c80a19] to-[#8b0712] text-white font-bold shadow-[0_0_15px_rgba(200,10,25,0.3)] border-l-4 border-[#c80a19]' 
                  : 'text-white/70 hover:bg-white/10 hover:text-white hover:border-l-4 hover:border-[#c80a19]/50'
              }`} 
              title={!isOpen ? "Ajustes de perfil" : undefined}
            >
              <User size={19} className={`shrink-0 ${activeView === 'profile' ? 'text-white' : 'text-white/60'}`} />
              <span className={`truncate ${!isOpen ? 'md:hidden' : 'block'}`}>
                Ajustes de perfil
              </span>
            </button>

            {/* Botón Salir */}
            <a 
              href="/" 
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[#c80a19] hover:bg-[#c80a19]/15 hover:text-white transition-all text-sm font-mono font-semibold cursor-pointer mt-1" 
              title={!isOpen ? "Salir" : undefined}
            >
              <LogOut size={19} className="shrink-0" />
              <span className={`truncate ${!isOpen ? 'md:hidden' : 'block'}`}>
                Salir
              </span>
            </a>
          </nav>
        </div>
      </aside>
    </>
  );
};

