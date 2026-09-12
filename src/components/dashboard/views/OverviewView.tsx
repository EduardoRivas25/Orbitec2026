import React from 'react';
import { useTelemetryData, useSerialStatus } from '../data/mockTelemetry';
import { AltimeterWidget } from '../widgets/AltimeterWidget';
import { MiniMapWidget } from '../widgets/MiniMapWidget';
import { ArtificialHorizonWidget } from '../widgets/ArtificialHorizonWidget';
import { CompassWidget } from '../widgets/CompassWidget';
import { SensorCardsRow } from '../widgets/SensorCardsRow';
import { RealTimeChartsWidget } from '../widgets/RealTimeChartsWidget';
import { MissionDataWidget } from '../widgets/MissionDataWidget';
import { DashboardFooter } from '../widgets/DashboardFooter';
import { Clock, Radio } from 'lucide-react';

export const OverviewView = () => {
  const data = useTelemetryData();
  const { isConnected, isSimulating, portName, baudRate } = useSerialStatus();
  const stateStyle = {
    WAIT: 'bg-amber-400/10 border-amber-400/30 text-amber-300',
    DESC: 'bg-sky-400/10 border-sky-400/30 text-sky-300',
    LAND: 'bg-emerald-400/10 border-emerald-400/30 text-emerald-300',
  } as const;

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
          {/* Estado del enlace serie */}
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
                ENLACE {isSimulating && <span className="text-[#eab308]">(VIRTUAL)</span>}
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

          {/* Estado transmitido por CanSat (TR-02) */}
          <div className={`flex flex-col items-start rounded-lg border px-3 py-2 leading-tight ${stateStyle[data.state]}`}>
            <span className="text-[8px] text-white/50 uppercase">Estado CanSat · TR-02</span>
            <span className="mt-0.5 flex items-center gap-1.5 font-bold tracking-wider">
              <Radio size={12} /> {data.state}
            </span>
          </div>

          {/* Tiempo de Misión */}
          <div className="bg-black/50 border border-white/10 px-3 py-2 rounded-lg flex flex-col items-start leading-tight">
            <span className="text-[8px] text-white/30 uppercase">Tiempo de Misión</span>
            <div className="flex items-center gap-1.5">
              <Clock size={12} className="text-[#c80a19]" />
              <span className="font-bold text-white tracking-widest">
                T+ {data.missionTime}
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
          Sensores recibidos en la trama: ambiental, altitud y potencia
          ═══════════════════════════════════════════════════════ */}
      <SensorCardsRow data={data} connected={isConnected} />

      {/* ═══════════════════════════════════════════════════════
          FILA 4: CONTENIDO PRINCIPAL (3 columnas)
          Mapa & Trayectoria | Telemetría Tiempo Real | Datos importantes de misión
          ═══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-1 min-h-[350px] sm:min-h-[420px]">
          <MiniMapWidget data={data} />
        </div>
        <div className="xl:col-span-1 min-h-[350px] sm:min-h-[420px]">
          <RealTimeChartsWidget data={data} />
        </div>
        <div className="md:col-span-2 xl:col-span-1 min-h-[350px] sm:min-h-[420px]">
          <MissionDataWidget data={data} connected={isConnected} />
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
