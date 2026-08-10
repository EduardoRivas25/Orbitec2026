import React, { useState, useEffect } from 'react';
import { Terminal } from 'lucide-react';

export const EventConsoleWidget = () => {
  const [events, setEvents] = useState([
    { time: 'T-00:05:00', msg: 'Sistema iniciado. Calibración BNO085 OK', type: 'info' },
    { time: 'T-00:04:30', msg: 'GPS Fix obtenido. 9 satélites.', type: 'success' },
    { time: 'T-00:01:00', msg: 'Verificación LoRa completada.', type: 'info' },
    { time: 'T-00:00:10', msg: 'Armando sistema de recuperación.', type: 'warning' },
    { time: 'T+00:00:00', msg: 'LANZAMIENTO DETECTADO', type: 'alert' }
  ]);

  return (
    <div className="bg-black border border-white/10 rounded-xl p-0 backdrop-blur-md flex-1 flex flex-col overflow-hidden min-h-[150px]">
      <div className="bg-white/5 border-b border-white/10 px-4 py-2 flex items-center gap-2">
        <Terminal className="text-white/50" size={14} />
        <h3 className="text-white/50 text-xs font-semibold uppercase tracking-wider">Consola de Eventos</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-1.5 font-mono text-[10px] custom-scrollbar">
        {events.map((ev, i) => (
          <div key={i} className="flex gap-3 items-start">
            <span className="text-white/40 whitespace-nowrap">[{ev.time}]</span>
            <span className={`${ev.type === 'success' ? 'text-[#22c55e]' :
                ev.type === 'warning' ? 'text-[#eab308]' :
                  ev.type === 'alert' ? 'text-[#c80a19] font-bold' :
                    'text-white/80'
              }`}>
              {ev.msg}
            </span>
          </div>
        ))}
        {/* Blinking cursor */}
        <div className="flex gap-3 items-start">
          <span className="text-white/40 whitespace-nowrap">[-]</span>
          <span className="w-1.5 h-3 bg-white/50 animate-pulse mt-0.5"></span>
        </div>
      </div>
    </div>
  );
};
