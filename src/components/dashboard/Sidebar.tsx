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

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isOpen, setIsOpen }) => {
  return (
    <div 
      className={`relative flex flex-col border-r border-[#c80a19]/10 bg-[#0a0a0a]/95 backdrop-blur-xl transition-all duration-300 ease-in-out z-20 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Header del Logo ORBITEC CANSAT */}
      <div className="flex items-center justify-between h-20 px-6 border-b border-[#c80a19]/10">
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

      {/* Botón para colapsar/expandir menú */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-3 top-24 flex h-6 w-6 items-center justify-center rounded-full border border-white/20 bg-[#0a0a0a] text-white hover:bg-[#c80a19] hover:border-[#c80a19] transition-colors shadow-lg cursor-pointer"
      >
        {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>

      {/* Lista de Navegación de Pestañas con Colores de Marca ORBITEC */}
      <div className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1 custom-scrollbar">
        <nav className="flex flex-col gap-1.5">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all text-sm font-mono cursor-pointer ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#c80a19] to-[#8b0712] text-white font-bold shadow-[0_0_15px_rgba(200,10,25,0.3)] border-l-4 border-[#c80a19]' 
                    : 'text-white/70 hover:bg-white/10 hover:text-white hover:border-l-4 hover:border-[#c80a19]/50'
                }`}
                title={!isOpen ? item.label : undefined}
              >
                <Icon size={19} className={isActive ? 'text-white' : 'text-white/60'} />
                {isOpen && <span>{item.label}</span>}
              </button>
            );
          })}

          <div className="my-3 border-t border-white/10" />

          <button 
            onClick={() => setActiveView('settings')}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all text-sm font-mono cursor-pointer ${
              activeView === 'settings' 
                ? 'bg-gradient-to-r from-[#c80a19] to-[#8b0712] text-white font-bold shadow-[0_0_15px_rgba(200,10,25,0.3)] border-l-4 border-[#c80a19]' 
                : 'text-white/70 hover:bg-white/10 hover:text-white hover:border-l-4 hover:border-[#c80a19]/50'
            }`} 
            title={!isOpen ? "Configuración" : undefined}
          >
            <Settings size={19} className={activeView === 'settings' ? 'text-white' : 'text-white/60'} />
            {isOpen && <span>Configuración</span>}
          </button>
          <button 
            onClick={() => setActiveView('profile')}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all text-sm font-mono cursor-pointer ${
              activeView === 'profile' 
                ? 'bg-gradient-to-r from-[#c80a19] to-[#8b0712] text-white font-bold shadow-[0_0_15px_rgba(200,10,25,0.3)] border-l-4 border-[#c80a19]' 
                : 'text-white/70 hover:bg-white/10 hover:text-white hover:border-l-4 hover:border-[#c80a19]/50'
            }`} 
            title={!isOpen ? "Ajustes de perfil" : undefined}
          >
            <User size={19} className={activeView === 'profile' ? 'text-white' : 'text-white/60'} />
            {isOpen && <span>Ajustes de perfil</span>}
          </button>
          <a href="/" className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[#c80a19] hover:bg-[#c80a19]/15 hover:text-white transition-all text-sm font-mono font-semibold cursor-pointer" title={!isOpen ? "Salir" : undefined}>
            <LogOut size={19} />
            {isOpen && <span>Salir</span>}
          </a>
        </nav>
      </div>
    </div>
  );
};
