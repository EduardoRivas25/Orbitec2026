import React from 'react';
import type { TelemetryData } from '../data/mockTelemetry';
import { useTelemetryHistory } from '../data/mockTelemetry';
import { Activity } from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis,
  ResponsiveContainer, CartesianGrid, Tooltip
} from 'recharts';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/95 border border-[#c80a19]/30 p-2 rounded-md shadow-lg text-[10px] font-mono min-w-[120px]">
        <div className="text-white/50 mb-1">{label}</div>
        {payload.map((p: any, i: number) => (
          <div key={i} className="flex justify-between gap-3">
            <span style={{ color: p.color }}>{p.name}</span>
            <span className="font-bold text-white">
              {typeof p.value === 'number' ? p.value.toFixed(1) : p.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

interface MiniChartProps {
  title: string;
  dataKey: string | string[];
  colors: string[];
  unit: string;
  currentValue: string;
  domain?: [any, any];
  names?: string[];
  chartData: Array<Record<string, string | number>>;
}

const MiniChart = ({ title, dataKey, colors, unit, currentValue, domain, names, chartData }: MiniChartProps) => {
  const keys = Array.isArray(dataKey) ? dataKey : [dataKey];
  const chartColors = Array.isArray(colors) ? colors : [colors];
  const chartNames = names || keys;

  return (
    <div className="flex-1 min-h-0">
      <div className="flex items-center justify-between mb-1 px-1">
        <span className="text-[9px] font-mono text-white/40 uppercase tracking-wider font-semibold">
          {title}
        </span>
        <span className="text-[10px] font-mono font-bold" style={{ color: chartColors[0] }}>
          {currentValue} <span className="text-white/30 font-normal">{unit}</span>
        </span>
      </div>
      <div className="h-[80px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {keys.length === 1 ? (
            <AreaChart data={chartData} margin={{ top: 2, right: 4, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id={`grad-${keys[0]}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColors[0]} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={chartColors[0]} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
              <XAxis dataKey="time" stroke="#ffffff20" fontSize={7} tickLine={false} axisLine={false} />
              <YAxis
                stroke="#ffffff20"
                fontSize={7}
                tickLine={false}
                axisLine={false}
                domain={domain || ['auto', 'auto']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                name={chartNames[0]}
                dataKey={keys[0]}
                stroke={chartColors[0]}
                strokeWidth={1.5}
                fillOpacity={1}
                fill={`url(#grad-${keys[0]})`}
                isAnimationActive={false}
              />
            </AreaChart>
          ) : (
            <LineChart data={chartData} margin={{ top: 2, right: 4, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
              <XAxis dataKey="time" stroke="#ffffff20" fontSize={7} tickLine={false} axisLine={false} />
              <YAxis
                stroke="#ffffff20"
                fontSize={7}
                tickLine={false}
                axisLine={false}
                domain={domain || ['auto', 'auto']}
              />
              <Tooltip content={<CustomTooltip />} />
              {keys.map((key, idx) => (
                <Line
                  key={key}
                  type="monotone"
                  name={chartNames[idx]}
                  dataKey={key}
                  stroke={chartColors[idx]}
                  strokeWidth={1.5}
                  dot={false}
                  isAnimationActive={false}
                />
              ))}
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const RealTimeChartsWidget = ({ data }: { data: TelemetryData }) => {
  const history = useTelemetryHistory();
  const receivedHistory = history.filter(point => point.raw);
  const chartData = (receivedHistory.length ? receivedHistory : [data]).map(point => ({
    time: point.missionTime,
    altitude: point.altitude.bme,
    pressure: point.environment.pressure,
    temperature: point.environment.temp,
    yaw: point.orientation.yaw,
    pitch: point.orientation.pitch,
    roll: point.orientation.roll,
  }));
  return (
    <div className="bg-[#0d0d0d] border border-white/10 rounded-xl p-4 backdrop-blur-md h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/5">
        <Activity className="text-[#22c55e]" size={16} />
        <h3 className="text-white/60 text-[11px] font-bold uppercase tracking-wider">
          Telemetría en Tiempo Real
        </h3>
      </div>

      {/* 4 Mini Charts stacked */}
      <div className="flex-1 flex flex-col gap-2 min-h-0">
        <MiniChart
          title="ALTITUD (m)"
          dataKey="altitude"
          colors={['#38bdf8']}
          unit="m"
          currentValue={data.altitude.bme.toFixed(0)}
          names={['Altitud']}
          chartData={chartData}
        />
        <MiniChart
          title="PRESIÓN (hPa)"
          dataKey="pressure"
          colors={['#f97316']}
          unit="hPa"
          currentValue={data.environment.pressure.toFixed(0)}
          names={['Presión']}
          chartData={chartData}
        />
        <MiniChart
          title="TEMPERATURA (°C)"
          dataKey="temperature"
          colors={['#22c55e']}
          unit="°C"
          currentValue={data.environment.temp.toFixed(1)}
          names={['Temp']}
          chartData={chartData}
        />
        <MiniChart
          title="YAW / PITCH / ROLL (°)"
          dataKey={['yaw', 'pitch', 'roll']}
          colors={['#eab308', '#22c55e', '#c80a19']}
          unit="°"
          currentValue={data.orientation.yaw.toFixed(1)}
          domain={[-180, 360]}
          names={['Yaw', 'Pitch', 'Roll']}
          chartData={chartData}
        />
      </div>
    </div>
  );
};
