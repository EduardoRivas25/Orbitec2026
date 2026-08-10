import React from 'react';
import type { TelemetryData } from '../data/mockTelemetry';
import { Compass as CompassIcon } from 'lucide-react';

export const CompassWidget = ({ data }: { data: TelemetryData }) => {
  const yaw = (data.orientation.yaw + 360) % 360;

  const getCardinalShort = (angle: number) => {
    if (angle >= 337.5 || angle < 22.5) return 'NORTE';
    if (angle >= 22.5 && angle < 67.5) return 'NORESTE';
    if (angle >= 67.5 && angle < 112.5) return 'ESTE';
    if (angle >= 112.5 && angle < 157.5) return 'SURESTE';
    if (angle >= 157.5 && angle < 202.5) return 'SUR';
    if (angle >= 202.5 && angle < 247.5) return 'SUROESTE';
    if (angle >= 247.5 && angle < 292.5) return 'OESTE';
    return 'NOROESTE';
  };

  // Cardinal and intercardinal labels with positions
  const cardinalLabels = [
    { label: 'N', angle: 0, color: '#c80a19', size: 11, bold: true },
    { label: 'NE', angle: 45, color: '#ffffff80', size: 7, bold: false },
    { label: 'E', angle: 90, color: '#ffffff', size: 9, bold: true },
    { label: 'SE', angle: 135, color: '#ffffff80', size: 7, bold: false },
    { label: 'S', angle: 180, color: '#ffffff', size: 9, bold: true },
    { label: 'SW', angle: 225, color: '#ffffff80', size: 7, bold: false },
    { label: 'W', angle: 270, color: '#ffffff', size: 9, bold: true },
    { label: 'NW', angle: 315, color: '#ffffff80', size: 7, bold: false },
  ];

  return (
    <div className="bg-[#0d0d0d] border border-white/10 rounded-lg p-4 h-full flex flex-col items-center">
      {/* Header */}
      <div className="w-full flex items-center gap-2 mb-3">
        <CompassIcon className="text-[#eab308]" size={14} />
        <h3 className="text-white/50 text-[10px] font-semibold uppercase tracking-wider">
          Brújula / Rumbo
        </h3>
      </div>

      {/* Compass Dial */}
      <div className="relative w-48 h-48 rounded-full border-[3px] border-[#333] bg-[#0a0a0a] shadow-[inset_0_0_20px_rgba(0,0,0,0.9)] flex items-center justify-center flex-shrink-0">
        {/* Rotating compass rose */}
        <div
          className="absolute inset-0 transition-transform duration-300 ease-out"
          style={{ transform: `rotate(${-yaw}deg)` }}
        >
          <svg className="w-full h-full" viewBox="0 0 200 200">
            {/* Degree ticks every 10 degrees */}
            {Array.from({ length: 36 }).map((_, i) => {
              const angle = i * 10;
              const rad = (angle - 90) * (Math.PI / 180);
              const isMajor = angle % 30 === 0;
              const innerR = isMajor ? 75 : 80;
              const outerR = 88;
              const x1 = 100 + innerR * Math.cos(rad);
              const y1 = 100 + innerR * Math.sin(rad);
              const x2 = 100 + outerR * Math.cos(rad);
              const y2 = 100 + outerR * Math.sin(rad);
              return (
                <line
                  key={i}
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="#ffffff"
                  strokeWidth={isMajor ? 2 : 0.8}
                  opacity={isMajor ? 0.7 : 0.3}
                />
              );
            })}

            {/* Cardinal & Intercardinal labels */}
            {cardinalLabels.map((c) => {
              const rad = (c.angle - 90) * (Math.PI / 180);
              const r = 65;
              const x = 100 + r * Math.cos(rad);
              const y = 100 + r * Math.sin(rad) + (c.size / 3);
              return (
                <text
                  key={c.label}
                  x={x}
                  y={y}
                  fill={c.color}
                  fontSize={c.size}
                  fontWeight={c.bold ? 'bold' : 'normal'}
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  {c.label}
                </text>
              );
            })}
          </svg>
        </div>

        {/* Fixed heading indicator (top red triangle) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
          <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[8px] border-t-[#c80a19]" />
        </div>

        {/* Center digital readout */}
        <div className="absolute flex flex-col items-center z-10">
          <div className="text-3xl font-bold text-white font-mono leading-none tracking-tight">
            {yaw.toFixed(0).padStart(3, '0')}°
          </div>
          <div className="text-[8px] text-white/40 font-mono mt-0.5">m</div>
          <div className="text-[10px] text-[#c80a19] font-bold font-mono uppercase tracking-wider mt-0.5">
            {getCardinalShort(yaw)}
          </div>
        </div>
      </div>
    </div>
  );
};
