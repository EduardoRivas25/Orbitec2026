import React from 'react';
import type { TelemetryData } from '../data/mockTelemetry';
import { Compass as CompassIcon, Navigation } from 'lucide-react';

const direction = (angle: number) => ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'][Math.round(angle / 45) % 8];

export const CompassWidget = ({ data }: { data: TelemetryData }) => {
  const yaw = (data.orientation.yaw + 360) % 360;
  const ticks = Array.from({ length: 36 }, (_, index) => index * 10);

  return (
    <section className="h-full overflow-hidden rounded-xl border border-white/10 bg-[#0d0d0d] p-4 shadow-[0_10px_35px_rgba(0,0,0,0.18)]">
      <header className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="rounded-md border border-amber-400/20 bg-amber-400/10 p-1.5"><CompassIcon className="text-amber-300" size={14} /></span>
          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-wider text-white/65">Brújula / rumbo</h3>
            <p className="text-[8px] font-mono uppercase text-white/30">Orientación desde magnetómetro</p>
          </div>
        </div>
        <span className="font-mono text-[10px] text-amber-300">MAG</span>
      </header>

      <div className="flex h-[190px] items-center justify-center gap-5">
        <div className="relative h-40 w-40 shrink-0 rounded-full border-2 border-white/15 bg-black shadow-[inset_0_0_24px_rgba(0,0,0,.9),0_0_0_5px_rgba(255,255,255,.025)] sm:h-44 sm:w-44">
          <div className="absolute inset-2 rounded-full border border-white/10" />
          <svg className="absolute inset-0 h-full w-full transition-transform duration-300 ease-out" viewBox="0 0 200 200" style={{ transform: `rotate(${-yaw}deg)` }}>
            {ticks.map(angle => {
              const rad = (angle - 90) * Math.PI / 180;
              const major = angle % 30 === 0;
              const x1 = 100 + (major ? 72 : 78) * Math.cos(rad);
              const y1 = 100 + (major ? 72 : 78) * Math.sin(rad);
              const x2 = 100 + 88 * Math.cos(rad);
              const y2 = 100 + 88 * Math.sin(rad);
              return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth={major ? 2 : 0.8} opacity={major ? .72 : .28} />;
            })}
            {[['N', 0], ['E', 90], ['S', 180], ['O', 270]].map(([label, angle]) => {
              const rad = (Number(angle) - 90) * Math.PI / 180;
              return <text key={label} x={100 + 61 * Math.cos(rad)} y={104 + 61 * Math.sin(rad)} fill={label === 'N' ? '#f43f5e' : 'white'} fontSize="12" fontWeight="700" textAnchor="middle" fontFamily="monospace">{label}</text>;
            })}
          </svg>
          <div className="absolute left-1/2 top-1 -translate-x-1/2 border-x-[7px] border-t-[11px] border-x-transparent border-t-[#f43f5e]" />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <strong className="font-mono text-3xl tracking-tighter text-white">{yaw.toFixed(0).padStart(3, '0')}°</strong>
            <span className="mt-1 font-mono text-xs font-bold tracking-[.22em] text-rose-300">{direction(yaw)}</span>
          </div>
        </div>
        <div className="min-w-[82px] space-y-3 font-mono">
          <div className="rounded-lg border border-white/5 bg-black/30 p-2.5">
            <p className="text-[8px] uppercase text-white/35">Rumbo</p>
            <p className="mt-1 text-base font-bold text-amber-200">{direction(yaw)}</p>
          </div>
          <div className="rounded-lg border border-white/5 bg-black/30 p-2.5">
            <p className="text-[8px] uppercase text-white/35">MAG X / Y</p>
            <p className="mt-1 text-[11px] font-bold text-white">{data.magnetometer.x.toFixed(0)} / {data.magnetometer.y.toFixed(0)}</p>
          </div>
          <div className="flex items-center gap-1.5 text-[9px] text-white/40"><Navigation size={11} className="text-sky-300" /> GPS rumbo</div>
        </div>
      </div>
    </section>
  );
};
