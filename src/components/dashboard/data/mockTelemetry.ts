import { useState, useEffect } from 'react';
import { serialService } from './serialService';
import type { TelemetryData } from './telemetryTypes';
import type { SerialStatus, SerialLogItem } from './serialService';

export * from './telemetryTypes';
export { serialService } from './serialService';
export type { SerialStatus, SerialLogItem } from './serialService';

// Hook reactivo que devuelve el estado de la conexión serie (LoRa / Arduino)
export const useSerialStatus = (): SerialStatus => {
  const [status, setStatus] = useState<SerialStatus>(() => serialService.getStatus());

  useEffect(() => {
    const unsubscribe = serialService.subscribeStatus((newStatus) => {
      setStatus(newStatus);
    });
    return unsubscribe;
  }, []);

  return status;
};

// Hook reactivo que devuelve el dato de telemetría en tiempo real desde el puerto serie
export const useTelemetryData = () => {
  const [data, setData] = useState<TelemetryData>(() => serialService.getTelemetry());

  useEffect(() => {
    const unsubscribe = serialService.subscribeTelemetry((newTelemetry) => {
      setData(newTelemetry);
    });
    return unsubscribe;
  }, []);

  return data;
};

// Hook reactivo que devuelve el histórico de telemetría
export const useTelemetryHistory = () => {
  const [history, setHistory] = useState<TelemetryData[]>(() => serialService.getTelemetryHistory());

  useEffect(() => {
    const unsubscribe = serialService.subscribeTelemetry(() => {
      setHistory(serialService.getTelemetryHistory());
    });
    return unsubscribe;
  }, []);

  return history;
};
