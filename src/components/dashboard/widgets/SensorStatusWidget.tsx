import React from 'react';
import { ShieldCheck, Cpu, HardDrive, Wifi, Navigation, Thermometer } from 'lucide-react';

export const SensorStatusWidget = () => {
  const sensors = [
    { name: 'GPS NEO-6M', icon: Navigation, status: 'ok', detail: '3D Fix (9 Sat)' },
    { name: 'BME688', icon: Thermometer, status: 'ok', detail: 'Calibrado' },
    { name: 'BNO085', icon: Cpu, status: 'ok', detail: 'Fusión 100Hz' },
    { name: 'LoRa SX1278', icon: Wifi, status: 'ok', detail: 'Tx/Rx OK' },
    { name: 'MicroSD', icon: HardDrive, status: 'warning', detail: '75% Lleno' },
  ];

  return (
    <div className="bg-[#0d0d0d] border border-white/10 rounded-xl p-5 h-full flex flex-col justify-between font-mono">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/10">
        <ShieldCheck className="text-[#22c55e]" size={15} />
        <h3 className="text-white/50 text-[10px] font-bold uppercase tracking-wider">Estado Diagnóstico de Sensores</h3>
      </div>

      <div className="space-y-2">
        {sensors.map((sensor, i) => {
          const Icon = sensor.icon;
          return (
            <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-black/50 border border-white/5">
              <div className="flex items-center gap-2.5">
                <div className={`p-1 rounded-md ${
                  sensor.status === 'ok' ? 'bg-[#22c55e]/15 text-[#22c55e]' :
                  sensor.status === 'warning' ? 'bg-[#eab308]/15 text-[#eab308]' :
                  'bg-[#c80a19]/15 text-[#c80a19]'
                }`}>
                  <Icon size={13} />
                </div>
                <span className="text-xs font-semibold text-white/90">{sensor.name}</span>
              </div>
              <div className="text-right leading-tight">
                <div className={`text-[10px] font-bold uppercase ${
                  sensor.status === 'ok' ? 'text-[#22c55e]' :
                  sensor.status === 'warning' ? 'text-[#eab308]' :
                  'text-[#c80a19]'
                }`}>
                  {sensor.status === 'ok' ? 'NOMINAL' : sensor.status === 'warning' ? 'ATENCIÓN' : 'ERROR'}
                </div>
                <div className="text-[9px] text-white/40">{sensor.detail}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
