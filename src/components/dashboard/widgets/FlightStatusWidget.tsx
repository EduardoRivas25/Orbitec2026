import React from 'react';
import type { TelemetryData } from '../data/mockTelemetry';
import { Rocket, ArrowUp, ArrowDown, MapPin, CheckCircle2 } from 'lucide-react';

export const FlightStatusWidget = ({ data }: { data: TelemetryData }) => {
  const getPhase = () => {
    if (data.time < 10) return { label: 'PRE-VUELO', step: 0 };
    if (data.time < 300) return { label: 'ASCENSO', step: 1 };
    if (data.time >= 300 && data.time < 310) return { label: 'APOGEO', step: 2 };
    if (data.time >= 310 && data.time < 700) return { label: 'DESCENSO', step: 3 };
    return { label: 'ATERRIZAJE', step: 4 };
  };

  const phase = getPhase();
  const phases = [
    { icon: MapPin, label: 'Lanzamiento' },
    { icon: ArrowUp, label: 'Ascenso' },
    { icon: Rocket, label: 'Apogeo' },
    { icon: ArrowDown, label: 'Descenso' },
    { icon: CheckCircle2, label: 'Aterrizaje' },
  ];

  return (
    <div className="bg-[#0d0d0d] border border-white/10 rounded-xl p-5 h-full flex flex-col justify-between font-mono">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-white/50 text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Rocket size={13} className="text-[#eab308]" /> Estado de Misión
          </h3>
          <div className="text-xl font-bold text-[#eab308] flex items-center gap-2">
            {phase.label}
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#eab308] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#eab308]"></span>
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-white/50 text-[10px] font-bold uppercase tracking-wider mb-1">Velocidad Vertical</div>
          <div className={`text-lg font-bold flex items-center gap-1.5 justify-end ${data.verticalSpeed > 0 ? 'text-[#22c55e]' : data.verticalSpeed < 0 ? 'text-[#eab308]' : 'text-white'}`}>
            {data.verticalSpeed > 0 ? <ArrowUp size={16} /> : data.verticalSpeed < 0 ? <ArrowDown size={16} /> : null}
            {Math.abs(data.verticalSpeed).toFixed(1)} m/s
          </div>
        </div>
      </div>

      <div className="relative mt-auto pt-2">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -translate-y-1/2 rounded-full"></div>
        <div
          className="absolute top-1/2 left-0 h-0.5 bg-[#c80a19] -translate-y-1/2 rounded-full transition-all duration-500"
          style={{ width: `${(phase.step / 4) * 100}%` }}
        ></div>

        <div className="flex justify-between relative z-10">
          {phases.map((p, i) => {
            const Icon = p.icon;
            const isActive = phase.step >= i;
            const isCurrent = phase.step === i;
            return (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors border-2 ${
                  isCurrent 
                    ? 'bg-[#c80a19] border-[#c80a19] text-white shadow-[0_0_10px_rgba(200,10,25,0.8)]' 
                    : isActive 
                      ? 'bg-[#c80a19]/20 border-[#c80a19] text-[#c80a19]' 
                      : 'bg-black/80 border-white/20 text-white/30'
                }`}>
                  <Icon size={12} />
                </div>
                <span className={`text-[9px] uppercase tracking-wider font-semibold ${isActive ? 'text-white/80' : 'text-white/30'}`}>
                  {p.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
