export type OfflineMapStyle = 'streets' | 'voyager' | 'satellite' | 'dark';

export interface OfflineMapProgress {
  completed: number;
  total: number;
  status: 'idle' | 'downloading' | 'ready' | 'error';
  message: string;
}

const CACHE_NAME = 'orbitec-map-tiles-v1';
const TILE_URLS: Record<OfflineMapStyle, string> = {
  streets: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
  satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  voyager: 'https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
  dark: 'https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
};

const longitudeToTileX = (longitude: number, zoom: number) =>
  Math.floor(((longitude + 180) / 360) * 2 ** zoom);

const latitudeToTileY = (latitude: number, zoom: number) => {
  const radians = latitude * Math.PI / 180;
  return Math.floor((1 - Math.asinh(Math.tan(radians)) / Math.PI) / 2 * 2 ** zoom);
};

const buildTileUrls = (latitude: number, longitude: number, radiusKm: number, style: OfflineMapStyle) => {
  const latitudeDelta = radiusKm / 111.32;
  const longitudeDelta = radiusKm / (111.32 * Math.max(0.2, Math.cos(latitude * Math.PI / 180)));
  const urls = new Set<string>();

  for (let zoom = 13; zoom <= 17; zoom++) {
    const minX = longitudeToTileX(longitude - longitudeDelta, zoom);
    const maxX = longitudeToTileX(longitude + longitudeDelta, zoom);
    const minY = latitudeToTileY(latitude + latitudeDelta, zoom);
    const maxY = latitudeToTileY(latitude - latitudeDelta, zoom);
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        urls.add(TILE_URLS[style].replace('{z}', String(zoom)).replace('{x}', String(x)).replace('{y}', String(y)));
      }
    }
  }
  return [...urls];
};

export async function prepareOfflineMap(
  latitude: number,
  longitude: number,
  radiusKm: number,
  style: OfflineMapStyle,
  onProgress: (progress: OfflineMapProgress) => void,
) {
  if (!('caches' in window) || !('serviceWorker' in navigator)) {
    throw new Error('El navegador no admite almacenamiento offline de mapas.');
  }

  await navigator.serviceWorker.register('/sw.js');
  await navigator.serviceWorker.ready;
  const urls = buildTileUrls(latitude, longitude, radiusKm, style);
  const cache = await caches.open(CACHE_NAME);
  let completed = 0;
  onProgress({ completed, total: urls.length, status: 'downloading', message: 'Descargando mosaicos…' });

  const workers = Array.from({ length: Math.min(6, urls.length) }, async (_, workerIndex) => {
    for (let index = workerIndex; index < urls.length; index += 6) {
      const url = urls[index];
      if (!(await cache.match(url))) {
        const response = await fetch(url, { mode: 'cors' });
        if (!response.ok) throw new Error(`No se pudo descargar un mosaico (${response.status}).`);
        await cache.put(url, response.clone());
      }
      completed++;
      onProgress({ completed, total: urls.length, status: 'downloading', message: 'Descargando mosaicos…' });
    }
  });

  await Promise.all(workers);
  const metadata = { latitude, longitude, radiusKm, style, tiles: urls.length, savedAt: new Date().toISOString() };
  localStorage.setItem('orbitec-offline-map-zone', JSON.stringify(metadata));
  onProgress({ completed, total: urls.length, status: 'ready', message: 'Zona disponible sin conexión' });
  return metadata;
}

export function getOfflineMapMetadata() {
  try {
    const saved = localStorage.getItem('orbitec-offline-map-zone');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}
