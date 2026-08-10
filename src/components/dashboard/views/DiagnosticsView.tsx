import React from 'react';
import { useTelemetryData } from '../data/mockTelemetry';
import { SquareActivity, Battery, Zap, AlertCircle } from 'lucide-react';

export const DiagnosticsView = () => {
  const data = useTelemetryData();

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-[#eab308]/20 rounded-lg">
          <SquareActivity className="text-[#eab308]" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-title">Diagnóstico del Sistema</h1>
          <p className="text-white/50 text-sm mt-1">Estado de hardware y energía del Arduino Nano ESP32</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Panel de Energía */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-md lg:col-span-2">
          <h3 className="text-white/70 font-semibold mb-6 uppercase tracking-wider text-sm flex items-center gap-2">
            <Battery size={16} /> Sistema de Energía (Batería Li-Ion)
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
            <div className="bg-black/30 border border-white/5 p-3 sm:p-4 rounded-lg flex flex-col items-center justify-center text-center">
              <span className="text-white/40 text-[10px] sm:text-xs uppercase mb-1 sm:mb-2">Voltaje</span>
              <span className="text-xl sm:text-3xl font-bold font-mono text-white">4.12<span className="text-xs sm:text-sm text-white/50">V</span></span>
            </div>
            
            <div className="bg-black/30 border border-white/5 p-3 sm:p-4 rounded-lg flex flex-col items-center justify-center text-center">
              <span className="text-white/40 text-[10px] sm:text-xs uppercase mb-1 sm:mb-2">Corriente</span>
              <span className="text-xl sm:text-3xl font-bold font-mono text-[#eab308]">125<span className="text-xs sm:text-sm text-white/50">mA</span></span>
            </div>
            
            <div className="bg-black/30 border border-white/5 p-3 sm:p-4 rounded-lg flex flex-col items-center justify-center text-center">
              <span className="text-white/40 text-[10px] sm:text-xs uppercase mb-1 sm:mb-2">Consumo</span>
              <span className="text-xl sm:text-3xl font-bold font-mono text-white">0.51<span className="text-xs sm:text-sm text-white/50">W</span></span>
            </div>
            
            <div className="bg-black/30 border border-white/5 p-3 sm:p-4 rounded-lg flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[#22c55e]/10 h-[82%] top-auto"></div>
              <span className="text-white/40 text-[10px] sm:text-xs uppercase mb-1 sm:mb-2 relative z-10">Capacidad</span>
              <span className="text-xl sm:text-3xl font-bold font-mono text-[#22c55e] relative z-10">82<span className="text-xs sm:text-sm text-white/50">%</span></span>
            </div>
          </div>
          
          <div className="mt-6 flex items-center gap-4 bg-black/20 p-4 rounded-lg border border-white/5">
            <Zap className="text-[#eab308]" size={20} />
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Autonomía Restante Estimada</span>
                <span className="text-sm font-bold">~4h 15m</span>
              </div>
              <div className="w-full bg-black/50 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-[#22c55e] to-[#eab308] w-[82%] h-full"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Microcontrolador */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-md">
          <h3 className="text-white/70 font-semibold mb-6 uppercase tracking-wider text-sm">Arduino Nano ESP32</h3>
          
          <div className="space-y-4 font-mono text-sm">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <span className="text-white/50">Uso de CPU</span>
              <span className="font-bold text-[#22c55e]">24%</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <span className="text-white/50">Memoria Heap Libre</span>
              <span className="font-bold">142 KB</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <span className="text-white/50">Temp. Interna CPU</span>
              <span className="font-bold text-[#eab308]">42°C</span>
            </div>
            <div className="flex justify-between items-center pb-3">
              <span className="text-white/50">Frecuencia CPU</span>
              <span className="font-bold">240 MHz</span>
            </div>
          </div>
        </div>
        
        {/* Logs del Sistema */}
        <div className="bg-black border border-white/10 rounded-xl p-0 backdrop-blur-md lg:col-span-3 h-64 flex flex-col">
          <div className="bg-white/5 border-b border-white/10 px-4 py-3 flex items-center justify-between">
            <h3 className="text-white/50 text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
              <AlertCircle size={14} /> System Logs (MicroSD Buffer)
            </h3>
            <span className="text-[#c80a19] text-xs animate-pulse font-bold">● REC</span>
          </div>
          <div className="p-4 font-mono text-xs text-white/60 space-y-1 overflow-y-auto custom-scrollbar flex-1">
            <div className="flex gap-4"><span className="text-white/30">14:02:15.321</span><span className="text-blue-400">[SD]</span><span>Escritura de bloque OK (512 bytes)</span></div>
            <div className="flex gap-4"><span className="text-white/30">14:02:15.354</span><span className="text-green-400">[BNO]</span><span>Lectura de cuaterniones: 0.992, 0.012, -0.005, 0.001</span></div>
            <div className="flex gap-4"><span className="text-white/30">14:02:15.410</span><span className="text-yellow-400">[BME]</span><span>Lectura: 21.5C, 1011.2hPa, 46%</span></div>
            <div className="flex gap-4"><span className="text-white/30">14:02:15.505</span><span className="text-purple-400">[LORA]</span><span>TX Payload (64 bytes). RSSI local: -86dBm</span></div>
            <div className="flex gap-4"><span className="text-white/30">14:02:15.821</span><span className="text-blue-400">[SD]</span><span>Escritura de bloque OK (512 bytes)</span></div>
            <div className="flex gap-4"><span className="text-white/30">14:02:15.854</span><span className="text-green-400">[BNO]</span><span>Lectura de cuaterniones: 0.991, 0.013, -0.004, 0.002</span></div>
            <div className="flex gap-4"><span className="text-white/30">14:02:15.910</span><span className="text-yellow-400">[BME]</span><span>Lectura: 21.5C, 1011.2hPa, 46%</span></div>
            <div className="flex gap-4"><span className="text-white/30">14:02:16.005</span><span className="text-purple-400">[LORA]</span><span>TX Payload (64 bytes). RSSI local: -85dBm</span></div>
            <div className="flex gap-4"><span className="text-white/30">14:02:16.022</span><span className="text-red-400">[SYS]</span><span>Advertencia: Drift detectado en reloj interno (+2ms)</span></div>
            <div className="flex gap-4 mt-2">
              <span className="w-2 h-4 bg-white/40 animate-pulse"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
