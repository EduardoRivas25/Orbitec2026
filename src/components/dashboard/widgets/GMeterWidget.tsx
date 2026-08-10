import React from 'react';
import type { TelemetryData } from '../data/mockTelemetry';
import { Gauge } from 'lucide-react';

export const GMeterWidget = ({ data }: { data: TelemetryData }) => {
  // Simular valor G basado en el ruido de velocidad/aceleración (simplificado para el mock)
  const gForce = data.verticalSpeed === 0 ? 1 :
    data.verticalSpeed > 0 ? 1 + data.verticalSpeed / 20 :
      1 - Math.abs(data.verticalSpeed) / 10;

  const maxG = 5;
  const progress = Math.max(0, Math.min(100, (Math.abs(gForce) / maxG) * 100));

  const getColor = (g: number) => {
    if (g < 0.2) return 'text-[#015fb3]'; // Caída libre
    if (g > 3) return 'text-[#c80a19]'; // Impacto/Alto G
    return 'text-white';
  };

  const getProgressColor = (g: number) => {
    if (g < 0.2) return 'bg-[#015fb3]';
    if (g > 3) return 'bg-[#c80a19]';
    return 'bg-white/70';
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-md">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <Gauge className="text-white/50" size={18} />
          <h3 className="text-white/50 text-sm font-semibold uppercase tracking-wider">G-Meter</h3>
        </div>
        {gForce < 0.2 && <span className="text-[10px] bg-[#015fb3]/20 text-[#015fb3] px-2 py-0.5 rounded border border-[#015fb3]/30 font-bold uppercase">Caída Libre</span>}
        {gForce > 3 && <span className="text-[10px] bg-[#c80a19]/20 text-[#c80a19] px-2 py-0.5 rounded border border-[#c80a19]/30 font-bold uppercase">Alto G</span>}
      </div>

      <div className="flex items-end gap-3 my-2">
        <div className={`text-3xl font-bold font-mono tracking-tighter ${getColor(gForce)}`}>
          {gForce.toFixed(2)}<span className="text-lg text-white/50">G</span>
        </div>
      </div>

      <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden mt-3">
        <div
          className={`h-full ${getProgressColor(gForce)} transition-all duration-300`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between text-[9px] text-white/40 mt-1 font-mono">
        <span>0G</span>
        <span>2.5G</span>
        <span>5G</span>
      </div>
    </div>
  );
};
