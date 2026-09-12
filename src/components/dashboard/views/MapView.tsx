import React, { useState, useRef } from 'react';
import { useTelemetryData, useTelemetryHistory } from '../data/mockTelemetry';
import { Map as MapIcon, Crosshair, Navigation, Layers, DownloadCloud, CheckCircle2, LoaderCircle } from 'lucide-react';
import { Map, MapMarker, MapControls, MAP_STYLES, Source, Layer } from '../../ui/map';
import { prepareOfflineMap, getOfflineMapMetadata, type OfflineMapProgress } from '../data/offlineMapService';

export const MapView = () => {
  const data = useTelemetryData();
  const history = useTelemetryHistory();
  const [selectedStyle, setSelectedStyle] = useState<keyof typeof MAP_STYLES>('dark');
  const [radiusKm, setRadiusKm] = useState(3);
  const [offlineProgress, setOfflineProgress] = useState<OfflineMapProgress>({ completed: 0, total: 0, status: 'idle', message: '' });
  const [savedZone, setSavedZone] = useState<any>(() => typeof window !== 'undefined' ? getOfflineMapMetadata() : null);
  const mapRef = useRef<any>(null);

  const routeCoordinates = history
    .filter(point => point.raw && Number.isFinite(point.gps.lat) && Number.isFinite(point.gps.lng))
    .map(point => [point.gps.lng, point.gps.lat]);
  const routeGeoJson = {
    type: 'Feature' as const,
    properties: {},
    geometry: { type: 'LineString' as const, coordinates: routeCoordinates }
  };

  const preloadZone = async () => {
    try {
      const metadata = await prepareOfflineMap(data.gps.lat, data.gps.lng, radiusKm, selectedStyle, setOfflineProgress);
      setSavedZone(metadata);
    } catch (error: any) {
      setOfflineProgress({ completed: 0, total: 0, status: 'error', message: error?.message || 'No se pudo guardar la zona.' });
    }
  };

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

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_auto] gap-3">
        <div className="bg-[#0d0d0d] border border-white/10 rounded-xl p-3 flex flex-wrap items-center gap-2">
          <span className="text-[10px] text-white/40 uppercase font-bold mr-1">Estado recibido:</span>
          {(['SIN DATOS', 'WAIT', 'DESC', 'LAND'] as const).map(state => {
            const active = state === 'SIN DATOS' ? !data.raw : data.state === state && Boolean(data.raw);
            return <span key={state} className={`px-3 py-1 rounded-full border text-[10px] font-bold ${active ? 'bg-[#22c55e]/15 border-[#22c55e]/40 text-[#22c55e]' : 'bg-black/40 border-white/10 text-white/30'}`}>{state}</span>;
          })}
          <span className="text-[9px] text-white/30">TR-02 transmite WAIT, DESC y LAND; “4 caracteres” es la longitud del campo.</span>
        </div>

        <div className="bg-[#0d0d0d] border border-white/10 rounded-xl p-3 flex flex-wrap items-center gap-2">
          <select value={radiusKm} onChange={event => setRadiusKm(Number(event.target.value))} disabled={offlineProgress.status === 'downloading'} className="bg-black/60 border border-white/15 rounded-lg px-2 py-1.5 text-[10px] text-white">
            <option value={2}>Radio 2 km</option><option value={3}>Radio 3 km</option><option value={5}>Radio 5 km</option>
          </select>
          <button onClick={preloadZone} disabled={offlineProgress.status === 'downloading'} className="flex items-center gap-1.5 bg-[#38bdf8]/15 hover:bg-[#38bdf8]/25 disabled:opacity-50 border border-[#38bdf8]/30 px-3 py-1.5 rounded-lg text-[#38bdf8] font-bold text-[10px] cursor-pointer">
            {offlineProgress.status === 'downloading' ? <LoaderCircle size={13} className="animate-spin" /> : savedZone ? <CheckCircle2 size={13} /> : <DownloadCloud size={13} />}
            {offlineProgress.status === 'downloading' ? `${offlineProgress.completed}/${offlineProgress.total}` : 'PRECARGAR ZONA OFFLINE'}
          </button>
          <span className={`text-[9px] ${offlineProgress.status === 'error' ? 'text-[#ef4444]' : 'text-white/35'}`}>
            {offlineProgress.message || (savedZone ? `${savedZone.radiusKm} km guardados (${savedZone.tiles} mosaicos)` : 'Usa conexión a internet para prepararla')}
          </span>
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
            {routeCoordinates.length >= 2 && (
              <Source id="cansat-route" type="geojson" data={routeGeoJson}>
                <Layer id="cansat-route-glow" type="line" paint={{ 'line-color': '#38bdf8', 'line-width': 7, 'line-opacity': 0.22 }} />
                <Layer id="cansat-route-line" type="line" paint={{ 'line-color': '#38bdf8', 'line-width': 3, 'line-opacity': 0.95 }} />
              </Source>
            )}
            <MapMarker longitude={data.gps.lng} latitude={data.gps.lat} color="#c80a19" />
          </Map>
        </div>
      </div>
    </div>
  );
};
