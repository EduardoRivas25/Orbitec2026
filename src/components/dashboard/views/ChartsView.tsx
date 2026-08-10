import React from 'react';
import { useTelemetryData } from '../data/mockTelemetry';
import {
  Thermometer, Droplets, Gauge, Atom, Mountain,
  Compass
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ComposedChart
} from 'recharts';

// Simulación de datos detallados de trayectoria de vuelo (0s a 90s)
const generateDetailedFlightData = () => {
  const points = [];
  for (let i = 0; i <= 90; i += 3) {
    let altGps, altBme, pitch, roll, yaw, temp, humidity, pressure, voc;

    if (i <= 45) {
      const progress = i / 45;
      altGps = Math.round(1600 + 300 * Math.sin(progress * (Math.PI / 2)) + Math.random() * 10);
      altBme = altGps - Math.round(Math.random() * 8);
      pitch = parseFloat((2.5 + Math.sin(i / 5) * 3).toFixed(1));
      roll = parseFloat((-1.0 + Math.cos(i / 4) * 2.5).toFixed(1));
      yaw = parseFloat((130 + (i * 0.2) + Math.sin(i / 3) * 2).toFixed(1));
      temp = parseFloat((22.5 - progress * 2.8 + (Math.random() - 0.5) * 0.2).toFixed(1));
      humidity = parseFloat((58.0 - progress * 10.0 + (Math.random() - 0.5) * 0.5).toFixed(1));
      pressure = Math.round(835 - progress * 15);
      voc = Math.round(95 + progress * 40 + Math.random() * 5);
    } else {
      const progress = (i - 45) / 45;
      altGps = Math.round(1900 - 550 * progress + Math.random() * 12);
      altBme = altGps - Math.round(Math.random() * 6);
      pitch = parseFloat((1.8 + Math.sin(i / 6) * 4).toFixed(1));
      roll = parseFloat((-0.8 + Math.cos(i / 5) * 3).toFixed(1));
      yaw = parseFloat((138 + (i * 0.15) + Math.sin(i / 4) * 3).toFixed(1));
      temp = parseFloat((19.7 + progress * 2.1 + (Math.random() - 0.5) * 0.2).toFixed(1));
      humidity = parseFloat((48.0 + progress * 8.5 + (Math.random() - 0.5) * 0.5).toFixed(1));
      pressure = Math.round(820 + progress * 11);
      voc = Math.round(135 - progress * 30 + Math.random() * 6);
    }

    points.push({
      time: i,
      label: `T+${i}s`,
      altGps,
      altBme,
      pitch,
      roll,
      yaw,
      temp,
      humidity,
      pressure,
      voc
    });
  }
  return points;
};

const flightData = generateDetailedFlightData();

export const ChartsView = () => {
  const data = useTelemetryData();

  const currentTemp = data.environment.temp || 21.0;
  const currentHumidity = data.environment.humidity || 54.0;
  const currentPressure = data.environment.pressure || 831;
  const currentVoc = data.environment.voc || 118;

  return (
    <div className="space-y-4 pb-12 font-mono">

      {/* ═══════════════════════════════════════════════════════
          FILA SUPERIOR: 4 TARJETAS KPI DE SENSORES
          Colores semánticos distintivos e iconos especializados
          ═══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

        {/* Card 1: Temperatura (Naranja Cálido #f97316) */}
        <div className="bg-[#0d0d0d] border border-white/10 rounded-xl p-3.5 flex flex-col justify-between h-[130px] relative overflow-hidden">
          <div>
            <div className="flex items-center gap-1.5 text-[9px] text-[#f97316] font-bold uppercase tracking-wider">
              <Thermometer size={14} className="text-[#f97316]" /> TEMPERATURA
            </div>
            <div className="text-2xl font-bold text-[#f97316] mt-1">
              {currentTemp.toFixed(1)} <span className="text-xs text-white/50 font-normal">°C</span>
            </div>
            <div className="text-[9px] text-white/40 font-semibold mt-0.5">
              RANGO: 19.5°C - 22.8°C
            </div>
          </div>
          <div className="h-10 w-full mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={flightData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="kpiTempGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#f97316" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="temp" stroke="#f97316" strokeWidth={1.5} fill="url(#kpiTempGrad)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 2: Humedad (Celeste Hídrico #38bdf8) */}
        <div className="bg-[#0d0d0d] border border-white/10 rounded-xl p-3.5 flex flex-col justify-between h-[130px] relative overflow-hidden">
          <div>
            <div className="flex items-center gap-1.5 text-[9px] text-[#38bdf8] font-bold uppercase tracking-wider">
              <Droplets size={14} className="text-[#38bdf8]" /> HUMEDAD
            </div>
            <div className="text-2xl font-bold text-[#38bdf8] mt-1">
              {currentHumidity.toFixed(0)} <span className="text-xs text-white/50 font-normal">%</span>
            </div>
            <div className="text-[9px] text-white/40 font-semibold mt-0.5">
              RELATIVA ATMOSFÉRICA
            </div>
          </div>
          <div className="h-10 w-full mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={flightData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="kpiHumGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="humidity" stroke="#38bdf8" strokeWidth={1.5} fill="url(#kpiHumGrad)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 3: Presión (Verde Esmeralda #22c55e) */}
        <div className="bg-[#0d0d0d] border border-white/10 rounded-xl p-3.5 flex flex-col justify-between h-[130px] relative overflow-hidden">
          <div>
            <div className="flex items-center gap-1.5 text-[9px] text-[#22c55e] font-bold uppercase tracking-wider">
              <Gauge size={14} className="text-[#22c55e]" /> PRESIÓN
            </div>
            <div className="text-2xl font-bold text-[#22c55e] mt-1">
              {currentPressure} <span className="text-xs text-white/50 font-normal">hPa</span>
            </div>
            <div className="text-[9px] text-white/40 font-semibold mt-0.5">
              BAROMÉTRICA BME688
            </div>
          </div>
          <div className="h-10 w-full mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={flightData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="kpiPressGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="pressure" stroke="#22c55e" strokeWidth={1.5} fill="url(#kpiPressGrad)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 4: VOC (Púrpura Químico #a855f7) */}
        <div className="bg-[#0d0d0d] border border-white/10 rounded-xl p-3.5 flex flex-col justify-between h-[130px] relative overflow-hidden">
          <div>
            <div className="flex items-center gap-1.5 text-[9px] text-[#a855f7] font-bold uppercase tracking-wider">
              <Atom size={14} className="text-[#a855f7]" /> PARTÍCULAS VOC
            </div>
            <div className="text-2xl font-bold text-[#a855f7] mt-1">
              {currentVoc} <span className="text-xs text-white/50 font-normal">ppm</span>
            </div>
            <div className="text-[9px] text-white/40 font-semibold mt-0.5">
              CALIDAD DEL AIRE
            </div>
          </div>
          <div className="h-10 w-full mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={flightData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="kpiVocGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="voc" stroke="#a855f7" strokeWidth={1.5} fill="url(#kpiVocGrad)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* ═══════════════════════════════════════════════════════
          GRID PRINCIPAL DE GRÁFICAS DEDICADAS (2x2)
          Iconos semánticos y paletas cromáticas diferenciadas por variable
          1. Perfil de Altimetría (Azul / Indigo)
          2. Temperatura & Humedad (Naranja / Celeste)
          3. Orientación & Actitud IMU (Amarillo / Azul / Rojo)
          4. Partículas VOC (Púrpura / Violeta)
          ═══════════════════════════════════════════════════════ */}
      {/* ═══════════════════════════════════════════════════════
          GRID PRINCIPAL DE GRÁFICAS DEDICADAS (2x2)
          Iconos semánticos y paletas cromáticas diferenciadas por variable
          1. Perfil de Altimetría (Azul / Indigo)
          2. Temperatura & Humedad (Naranja / Celeste)
          3. Orientación & Actitud IMU (Amarillo / Azul / Rojo)
          4. Partículas VOC (Púrpura / Violeta)
          ═══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">

        {/* GRÁFICA 1: PERFIL DE ALTIMETRÍA */}
        <div className="bg-[#0d0d0d] border border-white/10 rounded-xl p-4 sm:p-5 flex flex-col justify-between h-[300px] sm:h-[340px] md:h-[360px]">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Mountain className="text-[#38bdf8]" size={18} />
              <h3 className="text-white font-bold text-xs uppercase tracking-wider">
                Perfil de Altimetría (BME688 / GPS)
              </h3>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 text-[9px] sm:text-[10px] flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-[#38bdf8]" />
                <span className="text-white/60">ALTITUD GPS (m)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 border-b border-dashed border-[#6366f1]" />
                <span className="text-white/60">ALTITUD BME (m)</span>
              </div>
            </div>
          </div>

          {/* Body Chart */}
          <div className="h-[210px] sm:h-[240px] md:h-[260px] w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={flightData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="altGpsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="label" stroke="rgba(255,255,255,0.3)" fontSize={9} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={9} tickLine={false} domain={[1500, 2000]} />
                <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', borderColor: 'rgba(255,255,255,0.2)', borderRadius: '8px', fontSize: '10px' }} />
                <Area type="monotone" dataKey="altGps" stroke="#38bdf8" strokeWidth={2} fill="url(#altGpsGrad)" isAnimationActive={false} />
                <Line type="monotone" dataKey="altBme" stroke="#6366f1" strokeWidth={1.5} strokeDasharray="3 3" dot={false} isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GRÁFICA 2: TEMPERATURA & HUMEDAD (JUNTAS) */}
        <div className="bg-[#0d0d0d] border border-white/10 rounded-xl p-4 sm:p-5 flex flex-col justify-between h-[300px] sm:h-[340px] md:h-[360px]">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Thermometer className="text-[#f97316]" size={18} />
              <h3 className="text-white font-bold text-xs uppercase tracking-wider">
                Temperatura & Humedad
              </h3>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 text-[9px] sm:text-[10px] flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-[#f97316]" />
                <span className="text-white/60">TEMP (°C)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-[#38bdf8]" />
                <span className="text-white/60">HUMEDAD (%)</span>
              </div>
            </div>
          </div>

          {/* Body Chart */}
          <div className="h-[210px] sm:h-[240px] md:h-[260px] w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={flightData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="tempDualGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#f97316" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="label" stroke="rgba(255,255,255,0.3)" fontSize={9} tickLine={false} />
                <YAxis yAxisId="left" stroke="#f97316" fontSize={9} tickLine={false} domain={[15, 30]} />
                <YAxis yAxisId="right" orientation="right" stroke="#38bdf8" fontSize={9} tickLine={false} domain={[30, 80]} />
                <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', borderColor: 'rgba(255,255,255,0.2)', borderRadius: '8px', fontSize: '10px' }} />
                <Area yAxisId="left" type="monotone" dataKey="temp" stroke="#f97316" strokeWidth={2} fill="url(#tempDualGrad)" isAnimationActive={false} />
                <Line yAxisId="right" type="monotone" dataKey="humidity" stroke="#38bdf8" strokeWidth={2} dot={false} isAnimationActive={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GRÁFICA 3: ORIENTACIÓN & ACTITUD (AHRS IMU) */}
        <div className="bg-[#0d0d0d] border border-white/10 rounded-xl p-4 sm:p-5 flex flex-col justify-between h-[300px] sm:h-[340px] md:h-[360px]">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Compass className="text-[#eab308]" size={18} />
              <h3 className="text-white font-bold text-xs uppercase tracking-wider">
                Orientación & Actitud (AHRS IMU)
              </h3>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 text-[9px] sm:text-[10px] flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-[#38bdf8]" />
                <span className="text-white/60">PITCH (°)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-[#c80a19]" />
                <span className="text-white/60">ROLL (°)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-[#eab308]" />
                <span className="text-white/60">YAW (°)</span>
              </div>
            </div>
          </div>

          {/* Body Chart */}
          <div className="h-[210px] sm:h-[240px] md:h-[260px] w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={flightData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="label" stroke="rgba(255,255,255,0.3)" fontSize={9} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={9} tickLine={false} domain={[-20, 180]} />
                <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', borderColor: 'rgba(255,255,255,0.2)', borderRadius: '8px', fontSize: '10px' }} />
                <Line type="monotone" dataKey="pitch" stroke="#38bdf8" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="roll" stroke="#c80a19" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="yaw" stroke="#eab308" strokeWidth={1.5} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GRÁFICA 4: PARTÍCULAS VOC */}
        <div className="bg-[#0d0d0d] border border-white/10 rounded-xl p-4 sm:p-5 flex flex-col justify-between h-[300px] sm:h-[340px] md:h-[360px]">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Atom className="text-[#a855f7]" size={18} />
              <h3 className="text-white font-bold text-xs uppercase tracking-wider">
                Concentración de Partículas VOC
              </h3>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 text-[9px] sm:text-[10px] flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-[#a855f7]" />
                <span className="text-white/60">CONCENTRACIÓN VOC (ppm)</span>
              </div>
            </div>
          </div>

          {/* Body Chart */}
          <div className="h-[210px] sm:h-[240px] md:h-[260px] w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={flightData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="vocMainGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="label" stroke="rgba(255,255,255,0.3)" fontSize={9} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={9} tickLine={false} domain={[80, 160]} />
                <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', borderColor: 'rgba(255,255,255,0.2)', borderRadius: '8px', fontSize: '10px' }} />
                <Area type="monotone" dataKey="voc" stroke="#a855f7" strokeWidth={2} fill="url(#vocMainGrad)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
