import React from 'react';
import { Activity, BatteryCharging, Clock3, MapPin, PackageCheck, Radio } from 'lucide-react';
import type { TelemetryData } from '../data/mockTelemetry';

const stateStyle = {
  WAIT: 'text-amber-300 border-amber-400/25 bg-amber-400/10',
  DESC: 'text-sky-300 border-sky-400/25 bg-sky-400/10',
  LAND: 'text-emerald-300 border-emerald-400/25 bg-emerald-400/10',
} as const;

export const MissionDataWidget = ({ data, connected }: { data: TelemetryData; connected: boolean }) => {
  const hasFrame = Boolean(data.raw);
  const signalQuality = Math.min(100, Math.max(0, Math.round(((data.lora.rssi + 120) / 70) * 100)));
  const coordinates = hasFrame
    ? `${data.gps.lat.toFixed(5)}, ${data.gps.lng.toFixed(5)}`
    : 'Sin coordenadas recibidas';

  const metrics = [
    { label: 'Reloj misión', value: data.missionTime, detail: 'MISSION_TIME recibido', icon: Clock3, color: 'text-[#c80a19]' },
    { label: 'Paquete', value: data.packetCount.toString(), detail: `Equipo ${data.teamId}`, icon: PackageCheck, color: 'text-[#015fb3]' },
    { label: 'Batería', value: `${data.voltage.toFixed(2)} V`, detail: 'VOLTAJE recibido', icon: BatteryCharging, color: 'text-amber-300' },
    { label: 'Enlace radio', value: `${data.lora.rssi.toFixed(0)} dBm`, detail: `SNR ${data.lora.snr.toFixed(1)} dB · ${signalQuality}%`, icon: Radio, color: 'text-emerald-300' },
    { label: 'Velocidad vertical', value: `${data.verticalSpeed.toFixed(1)} m/s`, detail: 'Derivada de altitud', icon: Activity, color: 'text-sky-300' },
    { label: 'GPS', value: coordinates, detail: hasFrame ? `${data.gps.sats} satélites` : 'Esperando trama', icon: MapPin, color: 'text-violet-300' },
  ];

  return (
    <section className="h-full overflow-hidden rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-white/50">Datos importantes de misión</p>
          <p className="mt-1 text-[10px] font-mono text-white/35">Valores de la última trama CSV válida</p>
        </div>
        <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-wider ${stateStyle[data.state]}`}>
          {data.state}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-1">
        {metrics.map(({ label, value, detail, icon: Icon, color }) => (
          <div key={label} className="flex items-center gap-3 rounded-lg border border-white/5 bg-black/25 p-3">
            <div className={`rounded-md bg-white/5 p-2 ${color}`}><Icon size={16} /></div>
            <div className="min-w-0">
              <p className="text-[9px] uppercase tracking-wider text-white/40">{label}</p>
              <p className="truncate font-mono text-sm font-bold text-white">{value}</p>
              <p className="truncate font-mono text-[9px] text-white/35">{detail}</p>
            </div>
          </div>
        ))}
      </div>

      <p className={`mt-4 text-center font-mono text-[10px] ${connected ? 'text-emerald-300' : 'text-white/35'}`}>
        {connected ? 'RECIBIENDO TELEMETRÍA' : 'SIN ENLACE SERIE ACTIVO'}
      </p>
    </section>
  );
};
