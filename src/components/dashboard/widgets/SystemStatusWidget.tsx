import React from 'react';
import {
  ShieldCheck, Cpu, HardDrive, Wifi, Navigation, Thermometer,
  Radio, Clock, Eye
} from 'lucide-react';

interface SystemDevice {
  name: string;
  icon: React.ElementType;
  status: 'connected' | 'disconnected' | 'warning';
}

// Default device list — status will be updated by real data functions later
const defaultDevices: SystemDevice[] = [
  { name: 'ARDUINO NANO ESP32', icon: Cpu, status: 'disconnected' },
  { name: 'BNO085 (IMU)', icon: Navigation, status: 'disconnected' },
  { name: 'BME688 (AMBIENTAL)', icon: Thermometer, status: 'disconnected' },
  { name: 'GPS NEO-6M', icon: Navigation, status: 'disconnected' },
  { name: 'SX1278 LoRa', icon: Radio, status: 'disconnected' },
  { name: 'MICROSD', icon: HardDrive, status: 'disconnected' },
];

interface EventEntry {
  time: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

const defaultEvents: EventEntry[] = [
  { time: '00:00:00', message: 'Sistema desconectado', type: 'info' },
  { time: '00:00:00', message: 'Sistema desconectado', type: 'info' },
  { time: '00:00:00', message: 'Sistema desconectado', type: 'info' },
  { time: '00:00:00', message: 'Sistema desconectado', type: 'info' },
  { time: '00:00:00', message: 'Sistema desconectado', type: 'info' },
];

const statusColor: Record<string, string> = {
  connected: '#22c55e',
  disconnected: '#ef4444',
  warning: '#eab308',
};

const statusLabel: Record<string, string> = {
  connected: 'CONECTADO',
  disconnected: 'DESCONECTADO',
  warning: 'ATENCIÓN',
};

const eventDotColors: Record<string, string> = {
  info: '#38bdf8',
  success: '#22c55e',
  warning: '#eab308',
  error: '#ef4444',
};

export const SystemStatusWidget = ({
  devices = defaultDevices,
  events = defaultEvents,
}: {
  devices?: SystemDevice[];
  events?: EventEntry[];
}) => {
  return (
    <div className="bg-[#0d0d0d] border border-white/10 rounded-xl p-4 backdrop-blur-md h-full flex flex-col">
      {/* === ESTADO DE SISTEMAS === */}
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/5">
        <ShieldCheck className="text-[#22c55e]" size={16} />
        <h3 className="text-white/60 text-[11px] font-bold uppercase tracking-wider">
          Estado de Sistemas
        </h3>
      </div>

      <div className="space-y-1.5 mb-4">
        {devices.map((device, i) => {
          const Icon = device.icon;
          const color = statusColor[device.status];
          const label = statusLabel[device.status];

          return (
            <div
              key={i}
              className="flex items-center justify-between py-1 px-1"
            >
              <div className="flex items-center gap-2">
                <Icon size={12} className="text-white/30" />
                <span className="text-[10px] font-mono text-white/60 tracking-wide">
                  {device.name}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span
                  className="text-[9px] font-mono font-bold tracking-wider"
                  style={{ color }}
                >
                  {label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* === EVENTOS RECIENTES === */}
      <div className="flex items-center justify-between mb-2 pt-2 border-t border-white/5">
        <div className="flex items-center gap-2">
          <Clock className="text-[#eab308]" size={14} />
          <h3 className="text-white/60 text-[11px] font-bold uppercase tracking-wider">
            Eventos Recientes
          </h3>
        </div>
        <button className="text-[9px] font-mono text-[#c80a19] hover:text-[#c80a19]/80 transition-colors cursor-pointer uppercase tracking-wider font-bold flex items-center gap-1">
          <Eye size={10} />
          VER TODOS
        </button>
      </div>

      <div className="flex-1 space-y-1.5 overflow-y-auto custom-scrollbar">
        {events.map((event, i) => (
          <div key={i} className="flex items-start gap-2 py-0.5">
            <span
              className="w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0"
              style={{ backgroundColor: eventDotColors[event.type] }}
            />
            <span className="text-[9px] font-mono text-white/30 whitespace-nowrap">
              {event.time}
            </span>
            <span className="text-[10px] font-mono text-white/50 leading-tight">
              {event.message}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
