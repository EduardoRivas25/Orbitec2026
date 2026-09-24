import React, { useState, useEffect } from 'react';
import ReactMapGL, { type MapProps, Marker as MapMarker, NavigationControl, Source, Layer, useMap } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

export type MapViewport = {
  latitude: number;
  longitude: number;
  zoom: number;
  pitch?: number;
  bearing?: number;
};

// Esri World Street Map Raster Tiles - 100% confiable, mapa claro con calles, ciudades y nombres completos
const ESRI_STREETS_STYLE = {
  version: 8,
  sources: {
    'esri-streets': {
      type: 'raster',
      tiles: [
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'
      ],
      tileSize: 256,
      attribution: 'Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, METI, NRCAN, GeoBase'
    }
  },
  layers: [
    {
      id: 'esri-streets-layer',
      type: 'raster',
      source: 'esri-streets',
      minzoom: 0,
      maxzoom: 19
    }
  ]
};

const ESRI_SATELLITE_STYLE = {
  version: 8,
  sources: {
    'esri-satellite': {
      type: 'raster',
      tiles: [
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      ],
      tileSize: 256,
      attribution: 'Esri, Maxar, Earthstar Geographics'
    }
  },
  layers: [
    {
      id: 'esri-satellite-layer',
      type: 'raster',
      source: 'esri-satellite',
      minzoom: 0,
      maxzoom: 19
    }
  ]
};

const CARTO_VOYAGER_RASTER = {
  version: 8,
  sources: {
    'carto-voyager': {
      type: 'raster',
      tiles: [
        'https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png'
      ],
      tileSize: 256,
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
    }
  },
  layers: [
    {
      id: 'carto-voyager-layer',
      type: 'raster',
      source: 'carto-voyager',
      minzoom: 0,
      maxzoom: 19
    }
  ]
};

// Mosaicos raster públicos de CARTO: compatibles con MapLibre, sin token/API key
// y con el mismo formato que usa el modo de precarga offline.
const CARTO_DARK_RASTER = {
  version: 8,
  sources: {
    'carto-dark': {
      type: 'raster',
      tiles: ['https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
    }
  },
  layers: [{ id: 'carto-dark-layer', type: 'raster', source: 'carto-dark', minzoom: 0, maxzoom: 19 }]
};

export const MAP_STYLES = {
  streets: ESRI_STREETS_STYLE,
  voyager: CARTO_VOYAGER_RASTER,
  satellite: ESRI_SATELLITE_STYLE,
  dark: CARTO_DARK_RASTER
} as const;

export interface ComponentMapProps extends Omit<MapProps, 'longitude' | 'latitude'> {
  center?: [number, number];
  longitude?: number;
  latitude?: number;
  zoom?: number;
  children?: React.ReactNode;
}

export const Map = React.forwardRef<any, ComponentMapProps>(
  ({ children, center, longitude, latitude, zoom = 14, mapStyle = CARTO_DARK_RASTER, style, ...props }, ref) => {
    let defaultLng = -102.0628;
    let defaultLat = 19.4208;

    if (longitude !== undefined && latitude !== undefined) {
      defaultLng = longitude;
      defaultLat = latitude;
    } else if (center && Array.isArray(center) && center.length === 2) {
      // MapLibre usa siempre el orden [longitud, latitud].
      defaultLng = center[0];
      defaultLat = center[1];
    }

    const [viewState, setViewState] = useState({
      longitude: defaultLng,
      latitude: defaultLat,
      zoom: zoom
    });

    useEffect(() => {
      setViewState({
        longitude: defaultLng,
        latitude: defaultLat,
        zoom: zoom
      });
    }, [defaultLng, defaultLat, zoom]);

    return (
      <div className="w-full h-full relative overflow-hidden">
        <ReactMapGL
          ref={ref as any}
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          mapStyle={mapStyle}
          style={{ width: '100%', height: '100%', ...style }}
          {...props}
        >
          {children}
        </ReactMapGL>
      </div>
    );
  }
);

Map.displayName = 'Map';

export const MapControls = (props: any) => (
  <NavigationControl position="bottom-right" {...props} />
);

export { MapMarker, NavigationControl, Source, Layer, useMap };
