import React from 'react';
import type { TelemetryData } from '../data/mockTelemetry';
import { Wifi, SignalHigh, CheckCircle, Radio } from 'lucide-react';

export const LoRaWidget = ({ data }: { data: TelemetryData }) => {
  const rssi = data.lora.rssi;
  // Cálculo de calidad de señal en porcentaje (de -120dBm a -50dBm)
  const signalQuality = Math.min(100, Math.max(0, Math.round(((rssi + 120) / 70) * 100)));

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-md h-full flex flex-col justify-between relative overflow-hidden">
      {/* Header del estado de conexión */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Radio className="text-[#015fb3]" size={18} />
          <h3 className="text-white/50 text-xs font-semibold uppercase tracking-wider">Radio Enlace LoRa</h3>
        </div>
        
        {/* Insignia de CONECTADO activa */}
        <div className="flex items-center gap-2 bg-[#22c55e]/15 border border-[#22c55e]/30 px-3 py-1 rounded-full">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22c55e]"></span>
          </span>
          <span className="text-[11px] font-bold text-[#22c55e] tracking-wider uppercase">CONECTADO</span>
        </div>
      </div>

      {/* Métricas Principales de Conexión */}
      <div className="grid grid-cols-2 gap-3 my-2">
        <div className="bg-black/30 border border-white/5 rounded-lg p-3">
          <div className="text-[10px] text-white/40 uppercase mb-1 font-mono">Calidad Enlace</div>
          <div className="text-xl font-bold font-mono text-[#22c55e] flex items-baseline gap-1">
            {signalQuality}<span className="text-xs text-white/50">%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-1.5 mt-2 overflow-hidden">
            <div className="bg-[#22c55e] h-full rounded-full transition-all" style={{ width: `${signalQuality}%` }}></div>
          </div>
        </div>

        <div className="bg-black/30 border border-white/5 rounded-lg p-3">
          <div className="text-[10px] text-white/40 uppercase mb-1 font-mono">Potencia RSSI</div>
          <div className="text-xl font-bold font-mono text-white flex items-baseline gap-1">
            {rssi.toFixed(0)} <span className="text-xs text-white/50">dBm</span>
          </div>
          <div className="text-[10px] text-white/40 font-mono mt-1">SNR: +{data.lora.snr.toFixed(1)} dB</div>
        </div>
      </div>

      {/* Info hardware / frecuencia */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10 text-center font-mono text-xs">
        <div>
          <div className="text-[9px] text-white/40 uppercase">Frecuencia</div>
          <div className="font-semibold text-white/90">915.0 MHz</div>
        </div>
        <div>
          <div className="text-[9px] text-white/40 uppercase">Paquetes</div>
          <div className="font-semibold text-[#015fb3]">{data.lora.packets}</div>
        </div>
        <div>
          <div className="text-[9px] text-white/40 uppercase">Pérdida</div>
          <div className="font-semibold text-white/80">{data.lora.dropped} pkts</div>
        </div>
      </div>
    </div>
  );
};
