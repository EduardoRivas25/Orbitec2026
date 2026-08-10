import React, { useState, useRef } from 'react';
import { useTelemetryData } from '../data/mockTelemetry';
import { Map as MapIcon, Crosshair, Navigation, Layers } from 'lucide-react';
import { Map, MapMarker, MapControls, MAP_STYLES } from '../../ui/map';

export const MapView = () => {
  const data = useTelemetryData();
  const [selectedStyle, setSelectedStyle] = useState<keyof typeof MAP_STYLES>('dark');
  const mapRef = useRef<any>(null);

  const recenter = () => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [data.gps.lng, data.gps.lat],
        zoom: 15,
        duration: 1000
      });
    }
  };

  return (
    <div className="h-full flex flex-col gap-4 pb-12 font-mono">
      {/* Header Principal de Mapa */}
      <div className="bg-[#0d0d0d] border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-black/60 border border-white/10 rounded-xl">
            <MapIcon className="text-[#38bdf8]" size={22} />
          </div>
          <h1 className="text-xl font-bold font-title text-white tracking-wide uppercase">
            Mapa de Trayectoria
          </h1>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap text-xs">
          {/* Selector de Estilo */}
          <div className="flex items-center flex-wrap bg-black/60 border border-white/10 p-1 rounded-lg gap-1">
            <Layers size={13} className="text-white/40 ml-1.5 mr-0.5 hidden sm:block" />
            <button
              onClick={() => setSelectedStyle('streets')}
              className={`px-2 py-1 rounded-md transition-all font-bold cursor-pointer text-[11px] sm:text-xs ${
                selectedStyle === 'streets' ? 'bg-[#38bdf8] text-black shadow' : 'text-white/40 hover:text-white'
              }`}
            >
              Calles
            </button>
            <button
              onClick={() => setSelectedStyle('voyager')}
              className={`px-2 py-1 rounded-md transition-all font-bold cursor-pointer text-[11px] sm:text-xs ${
                selectedStyle === 'voyager' ? 'bg-[#38bdf8] text-black shadow' : 'text-white/40 hover:text-white'
              }`}
            >
              Colorido
            </button>
            <button
              onClick={() => setSelectedStyle('satellite')}
              className={`px-2 py-1 rounded-md transition-all font-bold cursor-pointer text-[11px] sm:text-xs ${
                selectedStyle === 'satellite' ? 'bg-[#38bdf8] text-black shadow' : 'text-white/40 hover:text-white'
              }`}
            >
              Satélite
            </button>
            <button
              onClick={() => setSelectedStyle('dark')}
              className={`px-2 py-1 rounded-md transition-all font-bold cursor-pointer text-[11px] sm:text-xs ${
                selectedStyle === 'dark' ? 'bg-[#38bdf8] text-black shadow' : 'text-white/40 hover:text-white'
              }`}
            >
              Oscuro
            </button>
          </div>

          <button 
            onClick={recenter}
            className="flex items-center gap-1.5 bg-black/60 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg transition-colors text-white font-bold cursor-pointer text-xs"
          >
            <Crosshair size={14} className="text-[#38bdf8]" />
            <span>Centrar CanSat</span>
          </button>
        </div>
      </div>

      <div className="flex-1 rounded-xl overflow-hidden border border-white/10 relative min-h-[360px] sm:min-h-[480px] md:min-h-[580px]">
        {/* Overlay Stats */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-col gap-2 pointer-events-none max-w-[calc(100%-1.5rem)]">
          <div className="bg-[#0d0d0d]/90 backdrop-blur-md border border-white/10 rounded-xl p-2.5 sm:p-3 text-xs font-mono shadow-2xl">
            <div className="flex items-center gap-1.5 text-white/40 mb-0.5 text-[9px] sm:text-[10px] uppercase font-bold">
              <Navigation size={12} className="text-[#38bdf8]" /> Posición Actual GPS
            </div>
            <div className="font-bold text-white text-xs sm:text-sm">{data.gps.lat.toFixed(6)}, {data.gps.lng.toFixed(6)}</div>
          </div>
          
          <div className="bg-[#0d0d0d]/90 backdrop-blur-md border border-white/10 rounded-xl p-2.5 sm:p-3 text-xs font-mono shadow-2xl flex gap-3 sm:gap-5">
            <div>
              <div className="text-white/40 text-[8px] sm:text-[9px] uppercase font-bold">Altitud</div>
              <div className="font-bold text-[#38bdf8] text-xs sm:text-sm">{data.altitude.gps.toFixed(1)} m</div>
            </div>
            <div>
              <div className="text-white/40 text-[8px] sm:text-[9px] uppercase font-bold">Velocidad</div>
              <div className="font-bold text-[#22c55e] text-xs sm:text-sm">{Math.abs(data.verticalSpeed).toFixed(1)} m/s</div>
            </div>
            <div>
              <div className="text-white/40 text-[8px] sm:text-[9px] uppercase font-bold">Satélites</div>
              <div className="font-bold text-[#eab308] text-xs sm:text-sm">{data.gps.sats} SAT</div>
            </div>
          </div>
        </div>
        
        <div className="absolute inset-0 w-full h-full">
          <Map
            ref={mapRef}
            center={[data.gps.lng, data.gps.lat]}
            zoom={15}
            mapStyle={MAP_STYLES[selectedStyle]}
            style={{ width: '100%', height: '100%' }}
          >
            <MapControls />
            <MapMarker longitude={data.gps.lng} latitude={data.gps.lat} color="#c80a19" />
          </Map>
        </div>
      </div>
    </div>
  );
};
