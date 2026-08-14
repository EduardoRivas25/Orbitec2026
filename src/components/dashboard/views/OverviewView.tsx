import React, { useState, useEffect } from 'react';
import { useTelemetryData, useSerialStatus } from '../data/mockTelemetry';
import { AltimeterWidget } from '../widgets/AltimeterWidget';
import { MiniMapWidget } from '../widgets/MiniMapWidget';
import { ArtificialHorizonWidget } from '../widgets/ArtificialHorizonWidget';
import { CompassWidget } from '../widgets/CompassWidget';
import { SensorCardsRow } from '../widgets/SensorCardsRow';
import { RealTimeChartsWidget } from '../widgets/RealTimeChartsWidget';
import { SystemStatusWidget } from '../widgets/SystemStatusWidget';
import { DashboardFooter } from '../widgets/DashboardFooter';
import { Radio, Rocket, Wifi, Clock, Usb } from 'lucide-react';

export const OverviewView = () => {
  const data = useTelemetryData();
  const { isConnected, isSimulating, portName, baudRate } = useSerialStatus();
  const [missionTime, setMissionTime] = useState(0);
  const [isCountdown, setIsCountdown] = useState(true);

  useEffect(() => {
    const COUNTDOWN_FROM = "2026-09-25T00:00:00"; // 25 de Septiembre de 2026
    
    const updateTime = () => {
      const end = new Date(COUNTDOWN_FROM).getTime();
      const now = new Date().getTime();
      const distance = end - now;
      
      if (distance > 0) {
        setIsCountdown(true);
        setMissionTime(Math.floor(distance / 1000));
      } else {
        setIsCountdown(false);
        setMissionTime(Math.floor(Math.abs(distance) / 1000));
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatMissionTime = (totalSeconds: number) => {
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (days > 0) {
      return `${days}d ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4 pb-4">
      {/* ═══════════════════════════════════════════════════════
          FILA 1: BANNER SUPERIOR — Centro de Control CanSat
          ═══════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden bg-[#0d0d0d] border border-white/10 rounded-xl p-4 backdrop-blur-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-2xl">


        {/* Sección Izquierda: Título + Subtítulo */}
        <div className="flex items-center gap-3 relative z-10">
          <img src="/logo_sinfondoCansat2026.webp" alt="Logo ORBITEC" className="w-16 h-16 object-contain drop-shadow-lg" />

          <div>
            <h1 className="text-lg md:text-xl font-bold font-title text-white tracking-wide">
              CENTRO DE CONTROL <span className="text-[#015fb3]">CAN</span><span className="text-[#c80a19]">SAT</span>
            </h1>
            <p className="text-white/35 text-[10px] font-mono mt-0.5">
              Estación Terrena de Telemetría • Misión CanSat 2026 • ITSU Aerospace
            </p>
          </div>
        </div>

        {/* Sección Derecha: Indicadores de Status */}
        <div className="flex items-center gap-2 font-mono text-[10px] relative z-10 flex-wrap sm:flex-nowrap">
          {/* Estado CanSat / LoRa en Tiempo Real */}
          <div
            title={isConnected ? `Conectado a ${portName} @ ${baudRate} bps` : 'Sin conexión serie activa'}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-[10px] font-bold tracking-wider uppercase transition-all select-none ${
              isConnected
                ? 'bg-[#22c55e]/10 border-[#22c55e]/30 text-[#22c55e]'
                : 'bg-[#ef4444]/10 border-[#ef4444]/30 text-[#ef4444]'
            }`}
          >
            <div className="flex flex-col items-start leading-tight">
              <span className="text-[8px] text-white/30 flex items-center gap-1">
                ESTADO CANSAT {isSimulating && <span className="text-[#eab308]">(VIRTUAL)</span>}
              </span>
              <span className="flex items-center gap-1.5 mt-0.5">
                <span className="relative flex h-1.5 w-1.5">
                  {isConnected && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75" />
                  )}
                  <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${isConnected ? 'bg-[#22c55e]' : 'bg-[#ef4444]'}`} />
                </span>
                {isConnected ? 'CONECTADO' : 'DESCONECTADO'}
              </span>
            </div>
          </div>


          {/* Tiempo de Misión */}
          <div className="bg-black/50 border border-white/10 px-3 py-2 rounded-lg flex flex-col items-start leading-tight">
            <span className="text-[8px] text-white/30 uppercase">Tiempo de Misión</span>
            <div className="flex items-center gap-1.5">
              <Clock size={12} className="text-[#c80a19]" />
              <span className="font-bold text-white tracking-widest">
                {isCountdown ? 'T-' : 'T+'} {formatMissionTime(missionTime)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          FILA 2: INSTRUMENTOS PRINCIPALES (3 columnas)
          Horizonte Artificial | Brújula | Altímetro
          ═══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <div>
          <ArtificialHorizonWidget data={data} />
        </div>
        <div>
          <CompassWidget data={data} />
        </div>
        <div className="md:col-span-2 xl:col-span-1">
          <AltimeterWidget data={data} />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          FILA 3: MINI-CARDS DE SENSORES (7 columnas)
          Temp | Presión | Humedad | G-Force | Vel.Vertical | GPS Sats | Batería
          ═══════════════════════════════════════════════════════ */}
      <SensorCardsRow data={data} connected={isConnected} />

      {/* ═══════════════════════════════════════════════════════
          FILA 4: CONTENIDO PRINCIPAL (3 columnas)
          Mapa & Trayectoria | Telemetría Tiempo Real | Estado de Sistemas
          ═══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-1 min-h-[350px] sm:min-h-[420px]">
          <MiniMapWidget data={data} />
        </div>
        <div className="xl:col-span-1 min-h-[350px] sm:min-h-[420px]">
          <RealTimeChartsWidget data={data} />
        </div>
        <div className="md:col-span-2 xl:col-span-1 min-h-[350px] sm:min-h-[420px]">
          <SystemStatusWidget />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          FILA 5: FOOTER
          ORBITEC CANSAT TEAM | UTC Clock
          ═══════════════════════════════════════════════════════ */}
      <DashboardFooter />
    </div>
  );
};
