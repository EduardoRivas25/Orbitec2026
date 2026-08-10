import React from 'react';
import type { TelemetryData } from '../data/mockTelemetry';
import {
  Thermometer, Wind, Droplets, Gauge, ArrowUpDown,
  Satellite, BatteryMedium
} from 'lucide-react';

interface SensorCard {
  id: string;
  label: string;
  icon: React.ElementType;
  getValue: (data: TelemetryData, connected: boolean) => string;
  getUnit: () => string;
  color: string;
}

const sensorCards: SensorCard[] = [
  {
    id: 'temp',
    label: 'TEMPERATURA',
    icon: Thermometer,
    getValue: (d, c) => c ? d.environment.temp.toFixed(1) : '--.--',
    getUnit: () => '°C',
    color: '#eab308',
  },
  {
    id: 'pressure',
    label: 'PRESIÓN',
    icon: Wind,
    getValue: (d, c) => c ? d.environment.pressure.toFixed(0) : '----',
    getUnit: () => 'hPa',
    color: '#38bdf8',
  },
  {
    id: 'humidity',
    label: 'HUMEDAD',
    icon: Droplets,
    getValue: (d, c) => c ? d.environment.humidity.toFixed(0) : '--.-',
    getUnit: () => '%',
    color: '#06b6d4',
  },
  {
    id: 'gforce',
    label: 'G-FORCE',
    icon: Gauge,
    getValue: (d, c) => c ? (d.acceleration.total / 9.81).toFixed(2) : '0.00',
    getUnit: () => 'G',
    color: '#f97316',
  },
  {
    id: 'vspeed',
    label: 'VEL. VERTICAL',
    icon: ArrowUpDown,
    getValue: (d, c) => c ? d.verticalSpeed.toFixed(1) : '0.0',
    getUnit: () => 'm/s',
    color: '#22c55e',
  },
  {
    id: 'sats',
    label: 'SATÉLITES GPS',
    icon: Satellite,
    getValue: (d, c) => c ? d.gps.sats.toString() : '--',
    getUnit: () => '',
    color: '#22c55e',
  },
  {
    id: 'battery',
    label: 'BATERÍA',
    icon: BatteryMedium,
    getValue: () => '--.-',
    getUnit: () => 'V',
    color: '#a855f7',
  },
];

export const SensorCardsRow = ({ data, connected = false }: { data: TelemetryData; connected?: boolean }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
      {sensorCards.map((card) => {
        const Icon = card.icon;
        const value = card.getValue(data, connected);
        const unit = card.getUnit();
        const isPlaceholder = value.includes('--');

        return (
          <div
            key={card.id}
            className="bg-[#0d0d0d] border border-white/10 rounded-lg px-3 py-2.5 flex flex-col items-center justify-center gap-1 hover:border-white/20 transition-colors group"
          >
            {/* Icon + Label */}
            <div className="flex items-center gap-1.5">
              <Icon
                size={13}
                style={{ color: card.color }}
                className="opacity-60 group-hover:opacity-100 transition-opacity"
              />
              <span className="text-[8px] font-mono text-white/35 uppercase tracking-wider font-semibold">
                {card.label}
              </span>
            </div>

            {/* Value */}
            <div className="flex items-baseline gap-0.5 font-mono">
              <span
                className={`text-base font-bold leading-none ${isPlaceholder ? 'text-white/20' : ''}`}
                style={!isPlaceholder ? { color: card.color } : undefined}
              >
                {value}
              </span>
              {unit && (
                <span className="text-[9px] text-white/30 font-semibold ml-0.5">
                  {unit}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
