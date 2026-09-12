import React, { useState } from 'react';
import { useTelemetryData, useTelemetryHistory } from '../data/mockTelemetry';
import { FlightStatusWidget } from '../widgets/FlightStatusWidget';
import { SensorStatusWidget } from '../widgets/SensorStatusWidget';
import { 
  Activity, Database, Cpu, Radio, Search, Clock, Zap
} from 'lucide-react';

export const TelemetryView = () => {
  const data = useTelemetryData();
  const history = useTelemetryHistory();
  const [viewMode, setViewMode] = useState<'decoded' | 'raw'>('decoded');
  const [searchTerm, setSearchTerm] = useState('');

  const rawFrames = history.filter(frame => frame.raw).slice().reverse().map(frame => ({
    id: frame.packetCount, time: frame.missionTime, teamId: frame.teamId,
    alt: frame.altitude.bme, vSpeed: frame.verticalSpeed, temp: frame.environment.temp,
    press: frame.environment.pressure, pitch: frame.orientation.pitch,
    roll: frame.orientation.roll, yaw: frame.orientation.yaw, lat: frame.gps.lat,
    lng: frame.gps.lng, sats: frame.gps.sats, rssi: frame.lora.rssi,
    voltage: frame.voltage, status: frame.state, raw: frame.raw
  }));

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
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
        <div className="md:col-span-2 lg:col-span-1">
          <SensorStatusWidget />
        </div>

      </div>

      {/* Fila 2: Consola Principal - Inspector de Tramas de Telemetría */}
      <div className="bg-[#0d0d0d] border border-white/10 rounded-xl p-4 sm:p-5 shadow-2xl font-mono">
        
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

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            {/* Campo de búsqueda */}
            <div className="relative w-full sm:w-52">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input 
                type="text" 
                placeholder="Filtrar paquete o timestamp..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-black/60 border border-white/15 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#38bdf8] transition-all w-full"
              />
            </div>

            {/* Alternar vista Decodificada vs String CSV Raw */}
            <div className="bg-black/80 border border-white/10 p-1 rounded-lg flex gap-1 text-[10px] self-start sm:self-auto">
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
          <div className="overflow-x-auto rounded-lg border border-white/10 bg-black/60 custom-scrollbar">
            <table className="w-full text-left border-collapse text-xs min-w-[850px]">
              <thead>
                <tr className="bg-black/80 border-b border-white/10 text-white/40 text-[10px] uppercase tracking-wider font-bold">
                  <th className="p-3">PAQUETE #</th>
                  <th className="p-3">MISSION TIME</th>
                  <th className="p-3">TEAM ID</th>
                  <th className="p-3">ALTITUD (BME)</th>
                  <th className="p-3">VELOCIDAD V.</th>
                  <th className="p-3">TEMP</th>
                  <th className="p-3">PRESIÓN</th>
                  <th className="p-3">PITCH / ROLL / YAW</th>
                  <th className="p-3">COORDENADAS GPS</th>
                  <th className="p-3">RSSI</th>
                  <th className="p-3">VOLTAJE</th>
                  <th className="p-3 text-right">ESTADO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredFrames.map((frame) => (
                  <tr key={frame.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3 font-bold text-white">#{frame.id}</td>
                    <td className="p-3 text-white/60">{frame.time}</td>
                    <td className="p-3 text-white/60">{frame.teamId}</td>
                    <td className="p-3 font-bold text-[#38bdf8]">{frame.alt.toFixed(1)} m</td>
                    <td className="p-3 font-bold text-[#22c55e]">{frame.vSpeed.toFixed(1)} m/s</td>
                    <td className="p-3 text-[#eab308] font-bold">{frame.temp.toFixed(1)} °C</td>
                    <td className="p-3 text-[#38bdf8] font-bold">{frame.press.toFixed(0)} hPa</td>
                    <td className="p-3 text-white/60">{frame.pitch.toFixed(1)}° / {frame.roll.toFixed(1)}° / {frame.yaw.toFixed(1)}°</td>
                    <td className="p-3 text-white/80">{frame.lat.toFixed(4)}, {frame.lng.toFixed(4)} <span className="text-white/30 text-[9px]">({frame.sats} SAT)</span></td>
                    <td className="p-3 text-white/50">{frame.rssi} dBm</td>
                    <td className="p-3 text-white/70">{frame.voltage.toFixed(2)} V</td>
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
                  <span className="text-[#22c55e] font-medium">{frame.raw}</span>
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
