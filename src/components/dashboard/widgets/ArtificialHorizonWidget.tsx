import React from 'react';
import type { TelemetryData } from '../data/mockTelemetry';
import { Navigation } from 'lucide-react';

export const ArtificialHorizonWidget = ({ data }: { data: TelemetryData }) => {
  const { pitch, roll, yaw } = data.orientation;
  const vSpeed = data.verticalSpeed;

  const displayPitch = Math.max(-45, Math.min(45, pitch));

  return (
    <div className="bg-[#0d0d0d] border border-white/10 rounded-lg p-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Navigation className="text-[#38bdf8]" size={14} />
        <h3 className="text-white/50 text-[10px] font-semibold uppercase tracking-wider">
          Horizonte Artificial & Actitud (IMU)
        </h3>
      </div>

      {/* Content: Sphere + Data */}
      <div className="flex items-center justify-center gap-5 flex-1">
        {/* Attitude Indicator Sphere */}
        <div className="relative w-44 h-44 rounded-full border-[3px] border-[#333] bg-[#0a0a0a] shadow-[inset_0_0_20px_rgba(0,0,0,0.9)] overflow-hidden flex-shrink-0">
          {/* Sky / Earth background that rotates and translates */}
          <div
            className="absolute inset-[-60%] transition-transform duration-150 ease-out"
            style={{
              transform: `translateY(${displayPitch * 2.2}px) rotate(${-roll}deg)`,
              transformOrigin: 'center center'
            }}
          >
            {/* Sky */}
            <div className="w-full h-1/2 bg-gradient-to-b from-[#1a5fb4] via-[#1a4f8f] to-[#1a4070] border-b-2 border-white/80 relative flex items-end justify-center">
              <div className="w-full text-center pb-3 text-[8px] font-mono font-bold text-white/80">
                <div className="border-b border-white/40 w-8 mx-auto mb-3">+30°</div>
                <div className="border-b border-white/60 w-12 mx-auto mb-3">+20°</div>
                <div className="border-b-2 border-white/80 w-16 mx-auto mb-3">+10°</div>
              </div>
            </div>
            {/* Earth */}
            <div className="w-full h-1/2 bg-gradient-to-b from-[#7c3f15] via-[#5c2e0f] to-[#3a1a08] relative pt-3 flex items-start justify-center">
              <div className="w-full text-center text-[8px] font-mono font-bold text-white/80">
                <div className="border-t-2 border-white/80 w-16 mx-auto mt-3">-10°</div>
                <div className="border-t border-white/60 w-12 mx-auto mt-3">-20°</div>
                <div className="border-t border-white/40 w-8 mx-auto mt-3">-30°</div>
              </div>
            </div>
          </div>

          {/* Roll scale arc */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
            {/* Roll reference triangle (top) */}
            <polygon points="50,5 47,12 53,12" fill="#eab308" />
            {/* Roll tick marks */}
            <line x1="50" y1="12" x2="50" y2="17" stroke="#fff" strokeWidth="1.5" />
            <line x1="24" y1="19" x2="28" y2="23" stroke="#fff" strokeWidth="1" opacity="0.6" />
            <line x1="76" y1="19" x2="72" y2="23" stroke="#fff" strokeWidth="1" opacity="0.6" />
          </svg>

          {/* Fixed aircraft reference (wings + center dot) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-12 h-[3px] bg-[#eab308] absolute left-3 rounded-l shadow-[0_0_6px_rgba(234,179,8,0.5)]" />
            <div className="w-12 h-[3px] bg-[#eab308] absolute right-3 rounded-r shadow-[0_0_6px_rgba(234,179,8,0.5)]" />
            <div className="w-3 h-3 bg-[#eab308] border-2 border-black rounded-full shadow-[0_0_8px_rgba(234,179,8,0.6)]" />
          </div>
        </div>

        {/* Data readouts on the right */}
        <div className="flex flex-col gap-2 font-mono min-w-[130px]">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[9px] text-white/40 uppercase">Pitch (Cabeceo)</span>
            <span className="text-sm font-bold text-white">
              {pitch.toFixed(1)}°
            </span>
          </div>

          <div className="w-full h-px bg-white/5" />

          <div className="flex items-center justify-between gap-3">
            <span className="text-[9px] text-white/40 uppercase">Roll (Alabeo)</span>
            <span className="text-sm font-bold text-white">
              {roll.toFixed(1)}°
            </span>
          </div>

          <div className="w-full h-px bg-white/5" />

          <div className="flex items-center justify-between gap-3">
            <span className="text-[9px] text-white/40 uppercase">Yaw (Guiñada)</span>
            <span className="text-sm font-bold text-[#eab308]">
              {yaw.toFixed(1)}°
            </span>
          </div>

          <div className="w-full h-px bg-white/5" />

          <div className="flex items-center justify-between gap-3">
            <span className="text-[9px] text-white/40 uppercase">Vel. Vertical</span>
            <span className="text-sm font-bold text-white">
              {vSpeed.toFixed(1)} m/s
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
