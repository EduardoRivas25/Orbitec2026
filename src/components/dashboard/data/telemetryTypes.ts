export interface TelemetryData {
  time: number;
  altitude: { bme: number; gps: number; diff: number };
  verticalSpeed: number;
  acceleration: { x: number; y: number; z: number; total: number };
  orientation: { pitch: number; roll: number; yaw: number };
  gps: { lat: number; lng: number; sats: number };
  environment: { temp: number; pressure: number; humidity: number; voc: number };
  lora: { rssi: number; snr: number; packets: number; dropped: number };
}

// Coordenadas preestablecidas fijas (Uruapan, Michoacán)
export const PRESET_GPS_COORDINATES = {
  lat: 19.4208,
  lng: -102.0628,
  sats: 12
};

// Objeto de telemetría preestablecido (datos estáticos iniciales)
export const INITIAL_TELEMETRY_DATA: TelemetryData = {
  time: 0,
  altitude: { bme: 1600, gps: 1605, diff: 5 },
  verticalSpeed: 0.0,
  acceleration: { x: 0.02, y: -0.01, z: 9.81, total: 9.81 },
  orientation: { pitch: 0, roll: 0, yaw: 180 },
  gps: PRESET_GPS_COORDINATES,
  environment: { temp: 21.5, pressure: 835.0, humidity: 55.0, voc: 110 },
  lora: { rssi: -75, snr: 9.5, packets: 120, dropped: 0 }
};

// Array preestablecido de datos estáticos de respaldo
export const TELEMETRY_DATA_ARRAY: TelemetryData[] = [
  {
    time: 0,
    altitude: { bme: 1600, gps: 1600, diff: 0 },
    verticalSpeed: 0.0,
    acceleration: { x: 0.0, y: 0.0, z: 9.81, total: 9.81 },
    orientation: { pitch: 0, roll: 0, yaw: 180 },
    gps: { lat: 19.4208, lng: -102.0628, sats: 12 },
    environment: { temp: 21.5, pressure: 835.0, humidity: 55.0, voc: 110 },
    lora: { rssi: -75, snr: 9.5, packets: 10, dropped: 0 }
  },
  {
    time: 1,
    altitude: { bme: 1602, gps: 1603, diff: 1 },
    verticalSpeed: 2.0,
    acceleration: { x: 0.1, y: 0.0, z: 10.2, total: 10.2 },
    orientation: { pitch: 2, roll: 1, yaw: 180 },
    gps: { lat: 19.4208, lng: -102.0628, sats: 12 },
    environment: { temp: 21.4, pressure: 834.8, humidity: 55.1, voc: 110 },
    lora: { rssi: -75, snr: 9.5, packets: 20, dropped: 0 }
  },
  {
    time: 2,
    altitude: { bme: 1610, gps: 1612, diff: 2 },
    verticalSpeed: 8.0,
    acceleration: { x: 0.2, y: -0.1, z: 12.5, total: 12.5 },
    orientation: { pitch: 5, roll: 2, yaw: 182 },
    gps: { lat: 19.4208, lng: -102.0628, sats: 12 },
    environment: { temp: 21.3, pressure: 834.0, humidity: 54.8, voc: 112 },
    lora: { rssi: -76, snr: 9.3, packets: 30, dropped: 0 }
  },
  {
    time: 3,
    altitude: { bme: 1625, gps: 1627, diff: 2 },
    verticalSpeed: 15.0,
    acceleration: { x: 0.1, y: 0.1, z: 11.0, total: 11.0 },
    orientation: { pitch: 4, roll: 1, yaw: 185 },
    gps: { lat: 19.4208, lng: -102.0628, sats: 12 },
    environment: { temp: 21.1, pressure: 832.5, humidity: 54.5, voc: 115 },
    lora: { rssi: -77, snr: 9.1, packets: 40, dropped: 0 }
  },
  {
    time: 4,
    altitude: { bme: 1640, gps: 1642, diff: 2 },
    verticalSpeed: 15.0,
    acceleration: { x: 0.0, y: 0.0, z: 9.8, total: 9.8 },
    orientation: { pitch: 1, roll: 0, yaw: 186 },
    gps: { lat: 19.4208, lng: -102.0628, sats: 12 },
    environment: { temp: 21.0, pressure: 831.0, humidity: 54.0, voc: 118 },
    lora: { rssi: -78, snr: 9.0, packets: 50, dropped: 0 }
  }
];
