import React, { useRef } from 'react';
import type { TelemetryData } from '../data/mockTelemetry';
import { Map as MapIcon, Crosshair, Navigation, MapPin } from 'lucide-react';
import { Map, MapMarker, MapControls } from '../../ui/map';

export const MiniMapWidget = ({ data }: { data: TelemetryData }) => {
  const mapRef = useRef<any>(null);

  const recenter = () => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [data.gps.lng, data.gps.lat],
        zoom: 15,
        duration: 800
      });
    }
  };

  return (
    <div className="bg-[#0d0d0d] border border-white/10 rounded-xl p-0 backdrop-blur-md h-full flex flex-col overflow-hidden relative min-h-[340px]">
      {/* Overlay Superior con Info GPS y Botón Centrar */}
      <div className="absolute top-0 left-0 w-full p-3 z-10 bg-gradient-to-b from-black/90 via-black/60 to-transparent pointer-events-none flex justify-between items-start">
        <div className="flex items-center gap-2 pointer-events-auto">
          <MapIcon className="text-[#38bdf8]" size={16} />
          <h3 className="text-white text-[11px] font-bold uppercase tracking-wider">Mapa & Trayectoria</h3>
        </div>
        
        <div className="text-right flex items-center gap-3 pointer-events-auto">
          <div className="text-right">
            <div className="flex items-center gap-1.5 text-[#22c55e] justify-end">
              <Navigation size={10} />
              <span className="text-[10px] font-bold font-mono uppercase">POSICIÓN ACTUAL</span>
            </div>
          </div>

          <button
            onClick={recenter}
            title="Centrar en CanSat"
            className="p-1.5 bg-black/80 hover:bg-black border border-white/20 rounded-lg text-white/80 hover:text-white transition-colors cursor-pointer shadow-lg"
          >
            <Crosshair size={12} />
          </button>
        </div>
      </div>

      {/* Mapa Interactivo */}
      <div className="absolute inset-0 w-full h-full" style={{ bottom: '48px' }}>
        <Map
          ref={mapRef}
          center={[data.gps.lng, data.gps.lat]}
          zoom={15}
          style={{ width: '100%', height: 'calc(100% - 48px)' }}
        >
          <MapControls />
          <MapMarker longitude={data.gps.lng} latitude={data.gps.lat} color="#c80a19" />
        </Map>
      </div>

      {/* Barra inferior de datos GPS */}
      <div className="absolute bottom-0 left-0 w-full bg-[#0a0a0a]/95 border-t border-white/5 px-3 py-2 z-10">
        <div className="grid grid-cols-5 gap-2 text-center font-mono">
          <div>
            <div className="text-[8px] text-white/30 uppercase">Latitud</div>
            <div className="text-[10px] font-bold text-white/60">{data.gps.lat.toFixed(6)}</div>
          </div>
          <div>
            <div className="text-[8px] text-white/30 uppercase">Longitud</div>
            <div className="text-[10px] font-bold text-white/60">{data.gps.lng.toFixed(6)}</div>
          </div>
          <div>
            <div className="text-[8px] text-white/30 uppercase">Altitud</div>
            <div className="text-[10px] font-bold text-white/60">{data.altitude.gps.toFixed(0)} m</div>
          </div>
          <div>
            <div className="text-[8px] text-white/30 uppercase">Velocidad</div>
            <div className="text-[10px] font-bold text-white/60">{Math.abs(data.verticalSpeed).toFixed(1)} m/s</div>
          </div>
          <div>
            <div className="text-[8px] text-white/30 uppercase">Rumbo</div>
            <div className="text-[10px] font-bold text-white/60">{data.orientation.yaw.toFixed(0)}°</div>
          </div>
        </div>
      </div>
    </div>
  );
};
