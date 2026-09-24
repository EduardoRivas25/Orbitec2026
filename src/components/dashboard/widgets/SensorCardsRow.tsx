import React from 'react';
import type { TelemetryData } from '../data/mockTelemetry';
import { Thermometer, Wind, Droplets, BatteryCharging, Mountain } from 'lucide-react';

interface SensorCard {
  id: string;
  label: string;
  icon: React.ElementType;
  getValue: (data: TelemetryData, hasFrame: boolean) => string;
  getUnit: () => string;
  color: string;
}

const sensorCards: SensorCard[] = [
  {
    id: 'temp',
    label: 'TEMPERATURA',
    icon: Thermometer,
    getValue: (d, hasFrame) => hasFrame ? d.environment.temp.toFixed(1) : '--.--',
    getUnit: () => '°C',
    color: '#eab308',
  },
  {
    id: 'pressure',
    label: 'PRESIÓN',
    icon: Wind,
    getValue: (d, hasFrame) => hasFrame ? d.environment.pressure.toFixed(1) : '----',
    getUnit: () => 'hPa',
    color: '#38bdf8',
  },
  {
    id: 'humidity',
    label: 'HUMEDAD',
    icon: Droplets,
    getValue: (d, hasFrame) => hasFrame ? d.environment.humidity.toFixed(1) : '--.-',
    getUnit: () => '%',
    color: '#06b6d4',
  },
  {
    id: 'altitude',
    label: 'ALTITUD BARO',
    icon: Mountain,
    getValue: (d, hasFrame) => hasFrame ? d.altitude.bme.toFixed(1) : '----.-',
    getUnit: () => 'm',
    color: '#38bdf8',
  },
  {
    id: 'voc',
    label: 'GAS / VOC',
    icon: Wind,
    getValue: (d, hasFrame) => hasFrame ? d.environment.voc.toFixed(0) : '---',
    getUnit: () => 'VOC',
    color: '#f97316',
  },
  {
    id: 'voltage',
    label: 'VOLTAJE',
    icon: BatteryCharging,
    getValue: (d, hasFrame) => hasFrame ? d.voltage.toFixed(2) : '--.--',
    getUnit: () => 'V',
    color: '#a855f7',
  },
];

export const SensorCardsRow = ({ data, connected = false, gasAlert = false }: { data: TelemetryData; connected?: boolean; gasAlert?: boolean }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
      {sensorCards.map((card) => {
        const Icon = card.icon;
        const hasFrame = Boolean(data.raw);
        const value = card.getValue(data, hasFrame);
        const unit = card.getUnit();
        const isPlaceholder = value.includes('--');

        return (
          <div
            key={card.id}
            className={`bg-[#0d0d0d] border rounded-lg px-3 py-2.5 flex flex-col items-center justify-center gap-1 transition-colors group min-w-0 ${card.id === 'voc' && gasAlert ? 'border-red-400/70 bg-red-950/30 animate-pulse' : 'border-white/10 hover:border-white/20'}`}
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
                className={`text-sm font-bold leading-none whitespace-nowrap ${isPlaceholder ? 'text-white/20' : ''}`}
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
