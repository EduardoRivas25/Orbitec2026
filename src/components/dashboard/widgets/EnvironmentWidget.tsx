import React from 'react';
import { useTelemetryHistory, type TelemetryData } from '../data/mockTelemetry';
import { Thermometer, Wind, Droplets, FlaskConical, Activity, TrendingUp, TrendingDown } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { evaluateForestFireRisk } from '../data/fireRisk';

export const EnvironmentWidget = ({ data }: { data: TelemetryData }) => {
  const history = useTelemetryHistory();
  const received = history.filter(frame => frame.raw).slice(-120);
  const frames = received.length ? received : [data];
  const tempData = frames.map(frame => ({ t: frame.missionTime, value: frame.environment.temp }));
  const pressData = frames.map(frame => ({ t: frame.missionTime, value: frame.environment.pressure }));
  const vocData = frames.map(frame => ({ t: frame.missionTime, value: frame.environment.voc }));
  const fireRisk = evaluateForestFireRisk(history);
  const previousTemperature = frames.at(-2)?.environment.temp ?? data.environment.temp;
  const temperatureRising = data.environment.temp >= previousTemperature;

  const CustomTooltip = ({ active, payload, label, unit, color }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 border border-white/20 p-2 rounded shadow text-xs font-mono">
          <div className="text-white/50 text-[10px]">{label}</div>
          <div className="font-bold mt-0.5" style={{ color }}>
            {payload[0].value} {unit}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-md h-full flex flex-col justify-between">
      {/* Header General del Módulo Ambiental */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-[#015fb3]/20 rounded-lg">
            <Activity className="text-[#015fb3]" size={20} />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm tracking-wide">Telemetría de Sensores Ambientales</h3>
            <p className="text-white/40 text-xs font-mono mt-0.5">Histórico continuo de temperatura, presión atmosférica y calidad de aire</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono bg-black/40 border border-white/10 px-3.5 py-1.5 rounded-lg self-start sm:self-auto">
          <div className="flex items-center gap-1.5 text-sky-400">
            <Droplets size={15} />
            <span className="text-white/60">Humedad:</span>
            <span className="font-bold text-white">{data.environment.humidity.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Grid Espacioso para las 3 Gráficas de Sensores */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfica 1: Temperatura */}
        <div className="bg-black/40 border border-white/10 rounded-xl p-5 flex flex-col justify-between shadow-xl">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-white/50 font-semibold font-mono uppercase">
                <Thermometer size={16} className="text-[#eab308]" /> Temperatura Ambient.
              </div>
              <div className="text-2xl font-bold font-mono text-[#eab308] mt-1">
                {data.environment.temp.toFixed(1)} <span className="text-sm font-normal text-white/50">°C</span>
              </div>
            </div>
            <span className="flex items-center gap-1 text-[10px] font-mono text-[#22c55e] bg-[#22c55e]/10 border border-[#22c55e]/30 px-2 py-0.5 rounded">
              {temperatureRising ? <TrendingUp size={12} /> : <TrendingDown size={12} />} TRAMA ACTUAL
            </span>
          </div>

          <div className="h-44 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={tempData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#eab308" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#eab308" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="t" stroke="#ffffff40" fontSize={9} tickLine={false} dy={5} />
                <YAxis domain={['dataMin - 0.2', 'dataMax + 0.2']} stroke="#ffffff40" fontSize={9} tickLine={false} />
                <Tooltip content={<CustomTooltip unit="°C" color="#eab308" />} />
                <Area type="monotone" dataKey="value" stroke="#eab308" strokeWidth={2.5} fillOpacity={1} fill="url(#gradTemp)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfica 2: Presión Barométrica */}
        <div className="bg-black/40 border border-white/10 rounded-xl p-5 flex flex-col justify-between shadow-xl">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-white/50 font-semibold font-mono uppercase">
                <Wind size={16} className="text-[#015fb3]" /> Presión Barométrica
              </div>
              <div className="text-2xl font-bold font-mono text-[#015fb3] mt-1">
                {data.environment.pressure.toFixed(0)} <span className="text-sm font-normal text-white/50">hPa</span>
              </div>
            </div>
            <span className="flex items-center gap-1 text-[10px] font-mono text-[#015fb3] bg-[#015fb3]/10 border border-[#015fb3]/30 px-2 py-0.5 rounded">
              <TrendingDown size={12} /> BME688
            </span>
          </div>

          <div className="h-44 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={pressData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradPress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#015fb3" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#015fb3" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="t" stroke="#ffffff40" fontSize={9} tickLine={false} dy={5} />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} stroke="#ffffff40" fontSize={9} tickLine={false} />
                <Tooltip content={<CustomTooltip unit="hPa" color="#015fb3" />} />
                <Area type="monotone" dataKey="value" stroke="#015fb3" strokeWidth={2.5} fillOpacity={1} fill="url(#gradPress)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfica 3: VOC / Partículas */}
        <div className="bg-black/40 border border-white/10 rounded-xl p-5 flex flex-col justify-between shadow-xl">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-white/50 font-semibold font-mono uppercase">
                <FlaskConical size={16} className="text-[#22c55e]" /> Sensor de Gas
              </div>
              <div className="text-2xl font-bold font-mono text-[#22c55e] mt-1">
                {data.environment.voc.toFixed(0)} <span className="text-sm font-normal text-white/50">u.</span>
              </div>
            </div>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${fireRisk.active ? 'text-red-300 bg-red-500/15 border-red-400/40' : 'text-[#22c55e] bg-[#22c55e]/10 border-[#22c55e]/30'}`}>
              {fireRisk.active ? 'ALERTA INCENDIO' : 'NIVEL NORMAL'}
            </span>
          </div>

          <div className="h-44 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={vocData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradVoc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="t" stroke="#ffffff40" fontSize={9} tickLine={false} dy={5} />
                <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke="#ffffff40" fontSize={9} tickLine={false} />
                <Tooltip content={<CustomTooltip unit="u." color="#22c55e" />} />
                <Area type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2.5} fillOpacity={1} fill="url(#gradVoc)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
