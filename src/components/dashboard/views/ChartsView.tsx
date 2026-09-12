import React from 'react';
import { useTelemetryData, useTelemetryHistory } from '../data/mockTelemetry';
import {
  Thermometer, Droplets, Gauge, Atom, Mountain,
  Compass
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ComposedChart
} from 'recharts';

const VectorTimeChart = ({ title, data, keys, unit }: {
  title: string;
  data: Array<Record<string, string | number>>;
  keys: Array<{ key: string; label: string; color: string }>;
  unit: string;
}) => (
  <div className="bg-[#0d0d0d] border border-white/10 rounded-xl p-4 sm:p-5 h-[320px] flex flex-col">
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
      <h3 className="text-white font-bold text-xs uppercase tracking-wider">{title}</h3>
      <div className="flex flex-wrap gap-3 text-[9px]">
        {keys.map(item => <span key={item.key} style={{ color: item.color }}>{item.label} ({unit})</span>)}
      </div>
    </div>
    <div className="flex-1 min-h-0 mt-3">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 6, right: 10, left: -12, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis dataKey="label" stroke="rgba(255,255,255,0.35)" fontSize={9} tickLine={false} />
          <YAxis stroke="rgba(255,255,255,0.35)" fontSize={9} tickLine={false} domain={['auto', 'auto']} />
          <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', borderColor: 'rgba(255,255,255,0.2)', borderRadius: '8px', fontSize: '10px' }} />
          {keys.map(item => <Line key={item.key} type="monotone" dataKey={item.key} name={item.label} stroke={item.color} strokeWidth={1.8} dot={false} isAnimationActive={false} />)}
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export const ChartsView = () => {
  const data = useTelemetryData();
  const history = useTelemetryHistory();
  const receivedHistory = history.filter(point => point.raw);
  const flightData = (receivedHistory.length ? receivedHistory : [data]).map(point => ({
    time: point.time,
    label: point.missionTime,
    altGps: point.altitude.gps,
    altBme: point.altitude.bme,
    pitch: point.orientation.pitch,
    roll: point.orientation.roll,
    yaw: point.orientation.yaw,
    temp: point.environment.temp,
    humidity: point.environment.humidity,
    pressure: point.environment.pressure,
    voc: point.environment.voc,
    voltage: point.voltage,
    accelX: point.acceleration.x,
    accelY: point.acceleration.y,
    accelZ: point.acceleration.z,
    gyroX: point.gyroscope.x,
    gyroY: point.gyroscope.y,
    gyroZ: point.gyroscope.z,
    magX: point.magnetometer.x,
    magY: point.magnetometer.y,
    magZ: point.magnetometer.z,
  }));

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
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={9} tickLine={false} domain={['auto', 'auto']} />
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <VectorTimeChart title="Acelerómetro por tiempo" data={flightData} unit="g" keys={[
          { key: 'accelX', label: 'X', color: '#38bdf8' }, { key: 'accelY', label: 'Y', color: '#f97316' }, { key: 'accelZ', label: 'Z', color: '#22c55e' }
        ]} />
        <VectorTimeChart title="Giroscopio por tiempo" data={flightData} unit="°/s" keys={[
          { key: 'gyroX', label: 'X', color: '#38bdf8' }, { key: 'gyroY', label: 'Y', color: '#f97316' }, { key: 'gyroZ', label: 'Z', color: '#22c55e' }
        ]} />
        <VectorTimeChart title="Magnetómetro por tiempo" data={flightData} unit="µT" keys={[
          { key: 'magX', label: 'X', color: '#38bdf8' }, { key: 'magY', label: 'Y', color: '#f97316' }, { key: 'magZ', label: 'Z', color: '#a855f7' }
        ]} />
        <VectorTimeChart title="Presión por tiempo" data={flightData} unit="hPa" keys={[
          { key: 'pressure', label: 'Presión', color: '#22c55e' }
        ]} />
        <VectorTimeChart title="Voltaje por tiempo" data={flightData} unit="V" keys={[
          { key: 'voltage', label: 'Batería', color: '#eab308' }
        ]} />
      </div>

    </div>
  );
};
