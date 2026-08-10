import React from 'react';
import type { TelemetryData } from '../data/mockTelemetry';
import { Gauge } from 'lucide-react';

export const AltimeterWidget = ({ data }: { data: TelemetryData }) => {
  const altBme = data.altitude.bme;
  const altGps = data.altitude.gps;

  // Scale: 0 to 150 meters mapped across a semicircular arc (180 degrees)
  const MAX_ALT = 150;
  // Clamp value to range
  const clampedAlt = Math.max(0, Math.min(MAX_ALT, altBme));
  // Map altitude to angle: 0m = -90deg (left), 150m = +90deg (right)
  // Needle angle in degrees from top-center
  const needleAngle = -90 + (clampedAlt / MAX_ALT) * 180;

  // Generate tick marks for the semicircular scale
  const majorTicks = [0, 25, 50, 75, 100, 125, 150];
  const minorTickCount = 30; // minor ticks across the arc

  return (
    <div className="bg-[#0d0d0d] border border-white/10 rounded-lg p-4 h-full flex flex-col items-center">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Gauge className="text-[#38bdf8]" size={14} />
          <h3 className="text-white/50 text-[10px] font-semibold uppercase tracking-wider">
            Altímetro Aeronáutico
          </h3>
        </div>
        <span className="text-[9px] font-mono text-white/30">
          QNH <span className="text-white/50">hPa</span>
        </span>
      </div>

      {/* Semicircular Arc Gauge */}
      <div className="relative w-full max-w-[220px] aspect-[2/1.2] flex-shrink-0">
        <svg viewBox="0 0 200 120" className="w-full h-full">
          {/* Arc background track */}
          <path
            d="M 15 105 A 85 85 0 0 1 185 105"
            fill="none"
            stroke="#222"
            strokeWidth="3"
          />

          {/* Major tick marks with labels */}
          {majorTicks.map((val) => {
            const fraction = val / MAX_ALT;
            const angleDeg = -180 + fraction * 180;
            const angleRad = (angleDeg * Math.PI) / 180;
            const cx = 100;
            const cy = 105;
            const r = 85;

            const x1 = cx + (r - 12) * Math.cos(angleRad);
            const y1 = cy + (r - 12) * Math.sin(angleRad);
            const x2 = cx + r * Math.cos(angleRad);
            const y2 = cy + r * Math.sin(angleRad);

            const labelR = r + 10;
            const lx = cx + labelR * Math.cos(angleRad);
            const ly = cy + labelR * Math.sin(angleRad) + 3;

            return (
              <g key={val}>
                <line
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  opacity="0.7"
                />
                <text
                  x={lx}
                  y={ly}
                  fill="#ffffff"
                  fontSize="7"
                  fontWeight="bold"
                  textAnchor="middle"
                  opacity="0.6"
                  fontFamily="monospace"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Minor tick marks */}
          {Array.from({ length: minorTickCount + 1 }).map((_, i) => {
            const fraction = i / minorTickCount;
            const val = fraction * MAX_ALT;
            // Skip if too close to a major tick
            if (majorTicks.some(mt => Math.abs(mt - val) < 2)) return null;

            const angleDeg = -180 + fraction * 180;
            const angleRad = (angleDeg * Math.PI) / 180;
            const cx = 100;
            const cy = 105;
            const r = 85;

            const x1 = cx + (r - 6) * Math.cos(angleRad);
            const y1 = cy + (r - 6) * Math.sin(angleRad);
            const x2 = cx + r * Math.cos(angleRad);
            const y2 = cy + r * Math.sin(angleRad);

            return (
              <line
                key={i}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="#ffffff"
                strokeWidth="0.5"
                opacity="0.3"
              />
            );
          })}

          {/* Needle */}
          {(() => {
            const angleDeg = -180 + (clampedAlt / MAX_ALT) * 180;
            const angleRad = (angleDeg * Math.PI) / 180;
            const cx = 100;
            const cy = 105;
            const needleLen = 70;

            const nx = cx + needleLen * Math.cos(angleRad);
            const ny = cy + needleLen * Math.sin(angleRad);

            return (
              <line
                x1={cx} y1={cy}
                x2={nx} y2={ny}
                stroke="#c80a19"
                strokeWidth="2"
                strokeLinecap="round"
                className="transition-all duration-300"
              />
            );
          })()}

          {/* Center pivot */}
          <circle cx="100" cy="105" r="4" fill="#333" stroke="#555" strokeWidth="1" />
          <circle cx="100" cy="105" r="2" fill="#888" />

          {/* METROS label */}
          <text
            x="100" y="98"
            fill="#ffffff"
            fontSize="6"
            textAnchor="middle"
            opacity="0.4"
            fontFamily="monospace"
            fontWeight="bold"
          >
            METROS
          </text>
        </svg>

        {/* Digital altitude readout overlaid */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ top: '20%' }}>
          <div className="text-center">
            <div className="text-3xl font-bold font-mono text-white leading-none">
              {altBme.toFixed(1)}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom data: GPS ALT and BME688 ALT */}
      <div className="grid grid-cols-2 gap-4 w-full mt-2 pt-2 border-t border-white/8 text-center font-mono">
        <div>
          <div className="text-[9px] text-white/30 uppercase">GPS ALT</div>
          <div className="text-xs font-bold text-white/60">{altGps.toFixed(1)} m</div>
        </div>
        <div>
          <div className="text-[9px] text-white/30 uppercase">BME688 ALT</div>
          <div className="text-xs font-bold text-white/60">{altBme.toFixed(1)} m</div>
        </div>
      </div>
    </div>
  );
};
