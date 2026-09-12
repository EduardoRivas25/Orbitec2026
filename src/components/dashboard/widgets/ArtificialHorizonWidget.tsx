import React from 'react';
import type { TelemetryData } from '../data/mockTelemetry';
import { Navigation, Rotate3D } from 'lucide-react';

const readout = (label: string, value: string, accent = 'text-white') => (
  <div className="border-b border-white/5 py-2 last:border-0">
    <p className="text-[8px] font-mono uppercase tracking-wider text-white/35">{label}</p>
    <p className={`mt-0.5 font-mono text-base font-bold ${accent}`}>{value}</p>
  </div>
);

export const ArtificialHorizonWidget = ({ data }: { data: TelemetryData }) => {
  const { pitch, roll, yaw } = data.orientation;
  const displayPitch = Math.max(-35, Math.min(35, pitch));

  return (
    <section className="h-full overflow-hidden rounded-xl border border-white/10 bg-[#0d0d0d] p-4 shadow-[0_10px_35px_rgba(0,0,0,0.18)]">
      <header className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="rounded-md border border-sky-400/20 bg-sky-400/10 p-1.5"><Navigation className="text-sky-300" size={14} /></span>
          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-wider text-white/65">Horizonte artificial</h3>
            <p className="text-[8px] font-mono uppercase text-white/30">Actitud calculada desde IMU</p>
          </div>
        </div>
        <span className="font-mono text-[10px] text-sky-300">IMU</span>
      </header>

      <div className="flex h-[190px] items-center gap-4 sm:gap-6">
        <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-full border-2 border-white/20 bg-black shadow-[inset_0_0_22px_rgba(0,0,0,.85),0_0_0_5px_rgba(255,255,255,.025)] sm:h-44 sm:w-44">
          <div className="absolute inset-[-55%] transition-transform duration-300 ease-out" style={{ transform: `translateY(${displayPitch * 2.5}px) rotate(${-roll}deg)` }}>
            <div className="relative h-1/2 border-b-2 border-white/80 bg-gradient-to-b from-sky-400/90 via-[#075aa9] to-[#03366f]">
              {[30, 20, 10].map((mark, index) => <span key={mark} className="absolute left-1/2 -translate-x-1/2 border-b border-white/70 pb-0.5 text-[8px] font-mono text-white" style={{ bottom: `${13 + index * 18}%`, width: `${26 + index * 10}px` }}>+{mark}</span>)}
            </div>
            <div className="relative h-1/2 bg-gradient-to-b from-[#875017] via-[#5f300d] to-[#241205]">
              {[10, 20, 30].map((mark, index) => <span key={mark} className="absolute left-1/2 -translate-x-1/2 border-t border-white/70 pt-0.5 text-[8px] font-mono text-white" style={{ top: `${13 + index * 18}%`, width: `${46 - index * 10}px` }}>−{mark}</span>)}
            </div>
          </div>
          <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100">
            <path d="M 28 15 Q 50 2 72 15" fill="none" stroke="rgba(255,255,255,.38)" strokeWidth="1" />
            <path d="M 50 7 L 46 14 L 54 14 Z" fill="#eab308" />
            <path d="M 18 50 H 42 M 58 50 H 82" stroke="#facc15" strokeWidth="2" />
            <circle cx="50" cy="50" r="3.3" fill="#facc15" stroke="#111" strokeWidth="1.5" />
          </svg>
          <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded bg-black/55 px-2 py-0.5 font-mono text-[9px] text-white/85">ROLL {roll.toFixed(1)}°</span>
        </div>
        <div className="min-w-0 flex-1">
          {readout('Cabeceo · pitch', `${pitch.toFixed(1)}°`, 'text-sky-200')}
          {readout('Alabeo · roll', `${roll.toFixed(1)}°`, 'text-white')}
          {readout('Guiñada · yaw', `${yaw.toFixed(1)}°`, 'text-amber-300')}
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-white/5 bg-black/30 px-2.5 py-2">
            <Rotate3D size={13} className="text-emerald-300" />
            <span className="text-[9px] font-mono text-white/45">ACC Z</span>
            <span className="ml-auto font-mono text-xs font-bold text-emerald-200">{data.acceleration.z.toFixed(2)} m/s²</span>
          </div>
        </div>
      </div>
    </section>
  );
};
