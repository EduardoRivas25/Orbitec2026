import React from 'react';
import type { TelemetryData } from '../data/mockTelemetry';
import { ArrowDown, CheckCircle2, Clock3, Radio } from 'lucide-react';

const REGULATION_STATES = [
  { id: 'WAIT', icon: Clock3, description: 'En espera' },
  { id: 'DESC', icon: ArrowDown, description: 'Descenso' },
  { id: 'LAND', icon: CheckCircle2, description: 'Aterrizaje' },
] as const;

export const FlightStatusWidget = ({ data }: { data: TelemetryData }) => {
  const activeIndex = Math.max(0, REGULATION_STATES.findIndex(item => item.id === data.state));
  const activeState = REGULATION_STATES[activeIndex];
  const verticalColor = data.verticalSpeed < 0 ? 'text-[#38bdf8]' : data.verticalSpeed > 0 ? 'text-[#22c55e]' : 'text-white';

  return (
    <div className="bg-[#0d0d0d] border border-white/10 rounded-xl p-5 h-full flex flex-col justify-between font-mono">
      <div className="flex justify-between items-start gap-3 mb-6">
        <div>
          <h3 className="text-white/50 text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Radio size={13} className="text-[#eab308]" /> Estado de misión · TR-02
          </h3>
          <div className="text-xl font-bold text-[#eab308] flex items-center gap-2">
            {activeState.id}
            <span className="relative flex h-2.5 w-2.5" aria-label="Estado recibido">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#eab308] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#eab308]" />
            </span>
          </div>
          <p className="text-[10px] text-white/35 mt-1 uppercase">{activeState.description}</p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-white/50 text-[10px] font-bold uppercase tracking-wider mb-1">Velocidad vertical</div>
          <div className={`text-lg font-bold flex items-center gap-1.5 justify-end ${verticalColor}`}>
            {data.verticalSpeed < 0 && <ArrowDown size={16} />}
            {Math.abs(data.verticalSpeed).toFixed(1)} m/s
          </div>
        </div>
      </div>

      <div className="relative pt-2">
        <div className="absolute top-[25px] left-[16.66%] right-[16.66%] h-0.5 bg-white/10 rounded-full" />
        <div
          className="absolute top-[25px] left-[16.66%] h-0.5 bg-[#eab308] rounded-full transition-all duration-500"
          style={{ width: `${activeIndex * 33.34}%` }}
        />
        <div className="grid grid-cols-3 relative z-10">
          {REGULATION_STATES.map((item, index) => {
            const Icon = item.icon;
            const isCurrent = index === activeIndex;
            const isComplete = index < activeIndex;
            return (
              <div key={item.id} className="flex flex-col items-center gap-1.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors border-2 ${
                  isCurrent
                    ? 'bg-[#eab308] border-[#eab308] text-black shadow-[0_0_12px_rgba(234,179,8,0.6)]'
                    : isComplete
                      ? 'bg-[#eab308]/15 border-[#eab308] text-[#eab308]'
                      : 'bg-black/80 border-white/20 text-white/30'
                }`}>
                  <Icon size={14} />
                </div>
                <span className={`text-[10px] tracking-wider font-bold ${isCurrent || isComplete ? 'text-white' : 'text-white/30'}`}>
                  {item.id}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
