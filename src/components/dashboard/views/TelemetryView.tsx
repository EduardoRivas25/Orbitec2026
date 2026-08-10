import React, { useState } from 'react';
import { useTelemetryData } from '../data/mockTelemetry';
import { FlightStatusWidget } from '../widgets/FlightStatusWidget';
import { SensorStatusWidget } from '../widgets/SensorStatusWidget';
import { 
  Activity, Database, Cpu, Radio, Search, Clock, Zap
} from 'lucide-react';

export const TelemetryView = () => {
  const data = useTelemetryData();
  const [viewMode, setViewMode] = useState<'decoded' | 'raw'>('decoded');
  const [searchTerm, setSearchTerm] = useState('');

  // Generación de tramas de telemetría más ricas y detalladas
  const rawFrames = [
    { id: 108, time: '12:01:30', alt: data.altitude.bme, vSpeed: data.verticalSpeed, temp: data.environment.temp, press: data.environment.pressure, pitch: data.orientation.pitch, roll: data.orientation.roll, yaw: data.orientation.yaw, lat: data.gps.lat, lng: data.gps.lng, sats: data.gps.sats, rssi: data.lora.rssi, status: 'NOMINAL' },
    { id: 107, time: '12:01:20', alt: data.altitude.bme - 0.2, vSpeed: data.verticalSpeed, temp: data.environment.temp - 0.1, press: data.environment.pressure + 0.2, pitch: data.orientation.pitch - 0.1, roll: data.orientation.roll + 0.2, yaw: data.orientation.yaw - 0.5, lat: data.gps.lat, lng: data.gps.lng, sats: data.gps.sats, rssi: data.lora.rssi - 1, status: 'NOMINAL' },
    { id: 106, time: '12:01:10', alt: data.altitude.bme - 0.6, vSpeed: data.verticalSpeed, temp: data.environment.temp - 0.2, press: data.environment.pressure + 0.6, pitch: data.orientation.pitch - 0.3, roll: data.orientation.roll - 0.1, yaw: data.orientation.yaw - 1.0, lat: data.gps.lat, lng: data.gps.lng, sats: data.gps.sats, rssi: data.lora.rssi, status: 'NOMINAL' },
    { id: 105, time: '12:01:00', alt: data.altitude.bme - 1.1, vSpeed: data.verticalSpeed, temp: data.environment.temp - 0.3, press: data.environment.pressure + 1.1, pitch: data.orientation.pitch + 0.2, roll: data.orientation.roll - 0.4, yaw: data.orientation.yaw - 1.2, lat: data.gps.lat, lng: data.gps.lng, sats: data.gps.sats, rssi: data.lora.rssi + 2, status: 'NOMINAL' },
    { id: 104, time: '12:00:50', alt: data.altitude.bme - 1.8, vSpeed: data.verticalSpeed, temp: data.environment.temp - 0.4, press: data.environment.pressure + 1.8, pitch: data.orientation.pitch, roll: data.orientation.roll, yaw: data.orientation.yaw, lat: data.gps.lat, lng: data.gps.lng, sats: data.gps.sats - 1, rssi: data.lora.rssi, status: 'NOMINAL' },
    { id: 103, time: '12:00:40', alt: data.altitude.bme - 2.5, vSpeed: data.verticalSpeed, temp: data.environment.temp - 0.5, press: data.environment.pressure + 2.5, pitch: data.orientation.pitch - 0.5, roll: data.orientation.roll + 0.5, yaw: data.orientation.yaw - 0.8, lat: data.gps.lat, lng: data.gps.lng, sats: data.gps.sats - 1, rssi: data.lora.rssi - 2, status: 'NOMINAL' },
  ];

  const filteredFrames = rawFrames.filter(frame => 
    frame.id.toString().includes(searchTerm) || 
    frame.time.includes(searchTerm) ||
    frame.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Formato horas:minutos:segundos del tiempo de misión (MET)
  const formatMET = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    const hrs = Math.floor(mins / 60);
    return `${hrs.toString().padStart(2, '0')}:${(mins % 60).toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4 pb-12 font-mono animate-in fade-in duration-300">
      
      {/* Header Principal de Telemetría */}
      <div className="bg-[#0d0d0d] border border-white/10 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-black/60 border border-white/10 rounded-xl">
            <Activity size={22} className="text-[#22c55e]" />
          </div>
          <h1 className="text-xl font-bold font-title text-white tracking-wide uppercase">
            Centro de Telemetría y Datos
          </h1>
        </div>
      </div>

      {/* Fila 1: 3 Columnas Principales (LoRa Link, Flight Status, Sensor Matrix) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Card 1: Enlace LoRa */}
        <div className="bg-[#0d0d0d] border border-white/10 rounded-xl p-5 flex flex-col justify-between hover:border-white/20 transition-all font-mono">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <Radio size={16} className="text-[#22c55e]" />
              <div>
                <h3 className="text-white font-bold text-xs uppercase tracking-wider">Enlace de Radio LoRa</h3>
                <span className="text-[9px] text-white/40">Frecuencia Base: 915.0 MHz</span>
              </div>
            </div>
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#22c55e]/15 border border-[#22c55e]/30 text-[#22c55e] font-bold text-[9px] uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]"></span>
              ENLACE ACTIVO
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 my-1">
            <div className="bg-black/50 border border-white/5 rounded-lg p-3">
              <div className="text-[9px] text-white/40 uppercase font-semibold mb-1">Potencia RSSI</div>
              <div className="text-xl font-bold text-white">{data.lora.rssi.toFixed(0)} <span className="text-xs text-white/40 font-normal">dBm</span></div>
              <div className="text-[9px] text-white/50 mt-1">SNR: +{data.lora.snr.toFixed(1)} dB</div>
            </div>
            <div className="bg-black/50 border border-white/5 rounded-lg p-3">
              <div className="text-[9px] text-white/40 uppercase font-semibold mb-1">Paquetes Exitosos</div>
              <div className="text-xl font-bold text-white">{data.lora.packets}</div>
              <div className="text-[9px] text-white/40 mt-1">Pérdida: <span className="text-[#22c55e]">0.0%</span></div>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-white/50">
            <span>Calidad del Canal:</span>
            <span className="font-bold text-[#22c55e]">98% (ÓPTIMA)</span>
          </div>
        </div>

        {/* Card 2: Fase de Vuelo */}
        <FlightStatusWidget data={data} />

        {/* Card 3: Matriz Diagnóstica de Sensores */}
        <SensorStatusWidget />

      </div>

      {/* Fila 2: Consola Principal - Inspector de Tramas de Telemetría */}
      <div className="bg-[#0d0d0d] border border-white/10 rounded-xl p-5 shadow-2xl font-mono">
        
        {/* Barra de Controles de la Consola */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <Database size={16} className="text-[#38bdf8]" />
            <div>
              <h2 className="text-white/90 font-bold text-xs uppercase tracking-wider">
                Consola y Registro de Telemetría
              </h2>
              <p className="text-white/40 text-[10px]">Visualización de tramas decodificadas y formato CSV</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Campo de búsqueda */}
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input 
                type="text" 
                placeholder="Filtrar paquete o timestamp..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-black/60 border border-white/15 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#38bdf8] transition-all w-52"
              />
            </div>

            {/* Alternar vista Decodificada vs String CSV Raw */}
            <div className="bg-black/80 border border-white/10 p-1 rounded-lg flex gap-1 text-[10px]">
              <button
                onClick={() => setViewMode('decoded')}
                className={`px-3 py-1 rounded-md transition-all font-bold cursor-pointer ${
                  viewMode === 'decoded' ? 'bg-[#38bdf8] text-black shadow' : 'text-white/40 hover:text-white'
                }`}
              >
                Tabla Decodificada
              </button>
              <button
                onClick={() => setViewMode('raw')}
                className={`px-3 py-1 rounded-md transition-all font-bold cursor-pointer ${
                  viewMode === 'raw' ? 'bg-[#38bdf8] text-black shadow' : 'text-white/40 hover:text-white'
                }`}
              >
                Trama CSV Raw
              </button>
            </div>
          </div>
        </div>

        {/* Vista Decodificada en Tabla Sobria */}
        {viewMode === 'decoded' ? (
          <div className="overflow-x-auto rounded-lg border border-white/10 bg-black/60">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-black/80 border-b border-white/10 text-white/40 text-[10px] uppercase tracking-wider font-bold">
                  <th className="p-3">PAQUETE #</th>
                  <th className="p-3">TIMESTAMP</th>
                  <th className="p-3">ALTITUD (BME)</th>
                  <th className="p-3">VELOCIDAD V.</th>
                  <th className="p-3">TEMP</th>
                  <th className="p-3">PRESIÓN</th>
                  <th className="p-3">PITCH / ROLL / YAW</th>
                  <th className="p-3">COORDENADAS GPS</th>
                  <th className="p-3">RSSI</th>
                  <th className="p-3 text-right">CHECKSUM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredFrames.map((frame) => (
                  <tr key={frame.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3 font-bold text-white">#{frame.id}</td>
                    <td className="p-3 text-white/60">{frame.time}</td>
                    <td className="p-3 font-bold text-[#38bdf8]">{frame.alt.toFixed(1)} m</td>
                    <td className="p-3 font-bold text-[#22c55e]">{frame.vSpeed.toFixed(1)} m/s</td>
                    <td className="p-3 text-[#eab308] font-bold">{frame.temp.toFixed(1)} °C</td>
                    <td className="p-3 text-[#38bdf8] font-bold">{frame.press.toFixed(0)} hPa</td>
                    <td className="p-3 text-white/60">{frame.pitch.toFixed(1)}° / {frame.roll.toFixed(1)}° / {frame.yaw.toFixed(1)}°</td>
                    <td className="p-3 text-white/80">{frame.lat.toFixed(4)}, {frame.lng.toFixed(4)} <span className="text-white/30 text-[9px]">({frame.sats} SAT)</span></td>
                    <td className="p-3 text-white/50">{frame.rssi} dBm</td>
                    <td className="p-3 text-right">
                      <span className="bg-[#22c55e]/15 text-[#22c55e] border border-[#22c55e]/30 px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase">
                        {frame.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-black/90 border border-white/10 rounded-lg p-4 font-mono text-xs text-[#22c55e] space-y-2 max-h-[350px] overflow-y-auto custom-scrollbar select-all">
            {filteredFrames.map((frame) => (
              <div key={frame.id} className="hover:bg-white/5 p-2 rounded transition-colors flex items-center justify-between border-b border-white/5">
                <div>
                  <span className="text-white/30 mr-2">#{frame.id} [{frame.time}]</span>
                  <span className="text-[#22c55e] font-medium">$CANSAT,{Date.now()},{frame.alt.toFixed(2)},{frame.vSpeed.toFixed(2)},{frame.temp.toFixed(2)},{frame.press.toFixed(2)},{frame.pitch.toFixed(1)},{frame.roll.toFixed(1)},{frame.yaw.toFixed(1)},{frame.lat.toFixed(5)},{frame.lng.toFixed(5)},{frame.sats},*CRC32_OK</span>
                </div>
                <span className="text-[9px] text-white/30 uppercase tracking-widest border border-white/10 px-2 py-0.5 rounded bg-white/5">CSV RAW</span>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
