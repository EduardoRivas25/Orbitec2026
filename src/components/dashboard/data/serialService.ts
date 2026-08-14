import type { TelemetryData } from './telemetryTypes';
import { INITIAL_TELEMETRY_DATA } from './telemetryTypes';

export interface SerialLogItem {
  id: string;
  timestamp: string;
  text: string;
  type: 'rx' | 'tx' | 'system' | 'telemetry' | 'error';
}

export interface SerialStatus {
  isSupported: boolean;
  isConnected: boolean;
  isConnecting: boolean;
  portName: string;
  baudRate: number;
  packetsReceived: number;
  bytesReceived: number;
  bytesSent: number;
  startTime: number | null;
  error: string | null;
  isSimulating: boolean;
}

export interface KnownPortInfo {
  index: number;
  port: any;
  name: string;
  vendorId?: number;
  productId?: number;
  isArduino: boolean;
}

export function getUsbVendorName(vendorId?: number, productId?: number): string {
  if (!vendorId) return 'Puerto Serie USB (COM)';
  const vid = vendorId.toString(16).toUpperCase();
  const pid = productId ? productId.toString(16).toUpperCase() : '';
  
  switch (vid) {
    case '2341': return `Arduino SA Oficial (VID: 0x${vid})`;
    case '1A86': return `CH340 / CH341 USB-Serial (Arduino Uno/Nano)`;
    case '10C4': return `Silicon Labs CP210x (ESP32 / LoRa Ground Station)`;
    case '0403': return `FTDI FT232R USB UART`;
    case '303A': return `Espressif Systems ESP32-S3/C3`;
    case '2E8A': return `Raspberry Pi Pico RP2040`;
    default: return `Dispositivo USB (VID: 0x${vid}${pid ? ' PID: 0x' + pid : ''})`;
  }
}

type StatusListener = (status: SerialStatus) => void;
type LogListener = (logs: SerialLogItem[]) => void;
type TelemetryListener = (data: TelemetryData) => void;

class SerialService {
  private port: any = null;
  private reader: any = null;
  private readableStreamClosed: Promise<void> | null = null;
  private writer: any = null;
  private writableStreamClosed: Promise<void> | null = null;
  private keepReading = false;
  
  private simulationInterval: number | null = null;

  private status: SerialStatus = {
    isSupported: typeof navigator !== 'undefined' && 'serial' in navigator,
    isConnected: false,
    isConnecting: false,
    portName: '',
    baudRate: 115200,
    packetsReceived: 0,
    bytesReceived: 0,
    bytesSent: 0,
    startTime: null,
    error: null,
    isSimulating: false,
  };

  private logs: SerialLogItem[] = [];
  private currentTelemetry: TelemetryData = { ...INITIAL_TELEMETRY_DATA };
  private telemetryHistory: TelemetryData[] = [{ ...INITIAL_TELEMETRY_DATA }];

  private statusListeners: Set<StatusListener> = new Set();
  private logListeners: Set<LogListener> = new Set();
  private telemetryListeners: Set<TelemetryListener> = new Set();

  constructor() {
    if (typeof window !== 'undefined' && 'serial' in navigator) {
      (navigator as any).serial.addEventListener('connect', () => {
        this.addLog('[SISTEMA] Dispositivo serie USB detectado en el equipo.', 'system');
      });

      (navigator as any).serial.addEventListener('disconnect', (event: any) => {
        if (this.port && event.target === this.port) {
          this.addLog('[SISTEMA] Dispositivo serie USB desconectado físicamente.', 'error');
          this.disconnect();
        }
      });
    }
  }

  public isSupported(): boolean {
    return typeof navigator !== 'undefined' && 'serial' in navigator;
  }

  public getStatus(): SerialStatus {
    return { ...this.status };
  }

  public getLogs(): SerialLogItem[] {
    return [...this.logs];
  }

  public getTelemetry(): TelemetryData {
    return { ...this.currentTelemetry };
  }

  public getTelemetryHistory(): TelemetryData[] {
    return [...this.telemetryHistory];
  }

  public subscribeStatus(listener: StatusListener): () => void {
    this.statusListeners.add(listener);
    listener(this.getStatus());
    return () => this.statusListeners.delete(listener);
  }

  public subscribeLogs(listener: LogListener): () => void {
    this.logListeners.add(listener);
    listener(this.getLogs());
    return () => this.logListeners.delete(listener);
  }

  public subscribeTelemetry(listener: TelemetryListener): () => void {
    this.telemetryListeners.add(listener);
    listener(this.getTelemetry());
    return () => this.telemetryListeners.delete(listener);
  }

  private notifyStatus() {
    const s = this.getStatus();
    this.statusListeners.forEach(listener => listener(s));
  }

  private notifyLogs() {
    const l = this.getLogs();
    this.logListeners.forEach(listener => listener(l));
  }

  private notifyTelemetry() {
    const t = this.getTelemetry();
    this.telemetryListeners.forEach(listener => listener(t));
  }

  public addLog(text: string, type: SerialLogItem['type'] = 'rx') {
    const now = new Date();
    const timestamp = now.toLocaleTimeString('es-ES', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    }) + '.' + String(now.getMilliseconds()).padStart(3, '0');

    const item: SerialLogItem = {
      id: Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      timestamp,
      text,
      type
    };

    this.logs.push(item);
    // Limitar buffer a las últimas 1000 líneas para optimizar memoria
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(this.logs.length - 1000);
    }

    this.notifyLogs();
  }

  public clearLogs() {
    this.logs = [];
    this.notifyLogs();
  }

  public async getAuthorizedPorts(): Promise<KnownPortInfo[]> {
    if (!this.isSupported()) return [];
    try {
      const rawPorts: any[] = await (navigator as any).serial.getPorts();
      return rawPorts.map((p, idx) => {
        const info = p.getInfo ? p.getInfo() : {};
        const isArduino = Boolean(info.usbVendorId && [0x2341, 0x1a86, 0x10c4, 0x0403, 0x303a, 0x2e8a].includes(info.usbVendorId));
        const friendlyName = getUsbVendorName(info.usbVendorId, info.usbProductId);
        return {
          index: idx,
          port: p,
          name: friendlyName,
          vendorId: info.usbVendorId,
          productId: info.usbProductId,
          isArduino
        };
      });
    } catch {
      return [];
    }
  }

  public async requestAndConnect(baudRate: number = 115200): Promise<boolean> {
    if (!this.isSupported()) {
      this.addLog('[ERROR] Web Serial API no soportada en este navegador. Utiliza Google Chrome o Microsoft Edge.', 'error');
      return false;
    }

    try {
      this.status.isConnecting = true;
      this.status.error = null;
      this.notifyStatus();

      this.addLog('[SISTEMA] Solicitando selección de puerto COM USB...', 'system');
      
      // Abre el diálogo nativo de selección de dispositivo serie del navegador
      const selectedPort = await (navigator as any).serial.requestPort();
      return await this.connectWithPort(selectedPort, baudRate);
    } catch (err: any) {
      this.status.isConnecting = false;
      if (err.name === 'NotFoundError') {
        this.addLog('[SISTEMA] Selección de puerto cancelada por el usuario.', 'system');
      } else {
        this.status.error = err.message || 'Error al solicitar puerto serie';
        this.addLog(`[ERROR] ${this.status.error}`, 'error');
      }
      this.notifyStatus();
      return false;
    }
  }

  public async connectWithPort(selectedPort: any, baudRate: number = 115200): Promise<boolean> {
    if (this.status.isSimulating) {
      this.stopSimulation();
    }

    try {
      this.status.isConnecting = true;
      this.notifyStatus();

      this.port = selectedPort;
      this.status.baudRate = baudRate;

      // Obtener información del dispositivo si está disponible
      const info = selectedPort.getInfo ? selectedPort.getInfo() : {};
      const portDesc = getUsbVendorName(info.usbVendorId, info.usbProductId);
      this.status.portName = portDesc;

      this.addLog(`[SISTEMA] Abriendo ${portDesc} a ${baudRate} bps...`, 'system');

      await this.port.open({
        baudRate: baudRate,
        dataBits: 8,
        stopBits: 1,
        parity: 'none',
        bufferSize: 8192,
        flowControl: 'none'
      });

      this.status.isConnected = true;
      this.status.isConnecting = false;
      this.status.startTime = Date.now();
      this.status.error = null;
      this.notifyStatus();

      this.addLog(`[SISTEMA] Conectado exitosamente con ${portDesc} a ${baudRate} baud.`, 'system');
      this.addLog(`[SISTEMA] Escuchando telemetría de Estación Terrena / Arduino...`, 'system');

      this.startReading();
      return true;
    } catch (err: any) {
      this.status.isConnected = false;
      this.status.isConnecting = false;
      this.status.error = err.message || 'No se pudo abrir el puerto serie';
      this.addLog(`[ERROR] Error al abrir el puerto: ${this.status.error}`, 'error');
      this.notifyStatus();
      return false;
    }
  }

  private async startReading() {
    if (!this.port || !this.port.readable) return;

    this.keepReading = true;
    let lineBuffer = '';

    while (this.port && this.port.readable && this.keepReading) {
      try {
        const textDecoder = new TextDecoderStream();
        this.readableStreamClosed = this.port.readable.pipeTo(textDecoder.writable);
        this.reader = textDecoder.readable.getReader();

        while (true) {
          const { value, done } = await this.reader.read();
          if (done) {
            break;
          }
          if (value) {
            this.status.bytesReceived += value.length;
            lineBuffer += value;

            const lines = lineBuffer.split(/\r?\n/);
            // El último elemento puede ser una línea incompleta, la dejamos en el buffer
            lineBuffer = lines.pop() || '';

            for (const line of lines) {
              const cleanLine = line.trim();
              if (cleanLine.length > 0) {
                this.handleIncomingLine(cleanLine);
              }
            }
            this.notifyStatus();
          }
        }
      } catch (err: any) {
        if (this.keepReading) {
          this.addLog(`[ERROR] Error de lectura serie: ${err.message || err}`, 'error');
        }
        break;
      } finally {
        if (this.reader) {
          try {
            this.reader.releaseLock();
          } catch {}
          this.reader = null;
        }
      }
    }
  }

  private handleIncomingLine(rawLine: string) {
    this.status.packetsReceived++;

    // Verificar si es una trama de telemetría de CanSat (CSV, JSON, etc.)
    const parsedTelemetry = this.parseTelemetryLine(rawLine);
    if (parsedTelemetry) {
      this.currentTelemetry = parsedTelemetry;
      this.telemetryHistory.push(parsedTelemetry);
      if (this.telemetryHistory.length > 100) {
        this.telemetryHistory = this.telemetryHistory.slice(this.telemetryHistory.length - 100);
      }
      this.addLog(rawLine, 'telemetry');
      this.notifyTelemetry();
    } else {
      // Mensaje de texto estándar del Arduino / receptor LoRa
      this.addLog(rawLine, 'rx');
    }
  }

  // Analizador inteligente de formatos de telemetría CanSat
  private parseTelemetryLine(line: string): TelemetryData | null {
    try {
      // 1. Formato JSON: {"alt": 1650, "temp": 22.4, "press": 834, "pitch": 2.1 ...}
      if (line.startsWith('{') && line.endsWith('}')) {
        const json = JSON.parse(line);
        return {
          time: json.time || Date.now(),
          altitude: {
            bme: Number(json.alt || json.altBme || json.altitude || this.currentTelemetry.altitude.bme),
            gps: Number(json.altGps || json.alt || this.currentTelemetry.altitude.gps),
            diff: Number(json.altDiff || 0)
          },
          verticalSpeed: Number(json.vSpeed || json.verticalSpeed || this.currentTelemetry.verticalSpeed),
          acceleration: {
            x: Number(json.ax || json.accX || 0),
            y: Number(json.ay || json.accY || 0),
            z: Number(json.az || json.accZ || 9.81),
            total: Number(json.accTotal || 9.81)
          },
          orientation: {
            pitch: Number(json.pitch || 0),
            roll: Number(json.roll || 0),
            yaw: Number(json.yaw || 0)
          },
          gps: {
            lat: Number(json.lat || this.currentTelemetry.gps.lat),
            lng: Number(json.lng || this.currentTelemetry.gps.lng),
            sats: Number(json.sats || this.currentTelemetry.gps.sats)
          },
          environment: {
            temp: Number(json.temp || json.temperature || this.currentTelemetry.environment.temp),
            pressure: Number(json.press || json.pressure || this.currentTelemetry.environment.pressure),
            humidity: Number(json.hum || json.humidity || this.currentTelemetry.environment.humidity),
            voc: Number(json.voc || this.currentTelemetry.environment.voc)
          },
          lora: {
            rssi: Number(json.rssi || this.currentTelemetry.lora.rssi),
            snr: Number(json.snr || this.currentTelemetry.lora.snr),
            packets: this.status.packetsReceived,
            dropped: Number(json.dropped || 0)
          }
        };
      }

      // 2. Formato CSV con prefijo $CANSAT o $ORBITEC o estándar separado por comas
      // Ejemplo: $CANSAT,timestamp,altitude,temp,pressure,pitch,roll,yaw,lat,lng,sats,rssi
      if (line.includes(',')) {
        const parts = line.replace(/^\$(CANSAT|ORBITEC),?/, '').split(',').map(p => p.trim());
        if (parts.length >= 3) {
          const numbers = parts.map(p => parseFloat(p));
          // Verificar que al menos los primeros valores sean numéricos
          if (!isNaN(numbers[0]) || !isNaN(numbers[1])) {
            const timeVal = !isNaN(numbers[0]) ? numbers[0] : Date.now();
            const altVal = !isNaN(numbers[1]) ? numbers[1] : (!isNaN(numbers[2]) ? numbers[2] : this.currentTelemetry.altitude.bme);
            const tempVal = !isNaN(numbers[2]) ? numbers[2] : (!isNaN(numbers[3]) ? numbers[3] : this.currentTelemetry.environment.temp);
            const pressVal = !isNaN(numbers[3]) ? numbers[3] : (!isNaN(numbers[4]) ? numbers[4] : this.currentTelemetry.environment.pressure);
            const pitchVal = numbers.length > 4 && !isNaN(numbers[4]) ? numbers[4] : this.currentTelemetry.orientation.pitch;
            const rollVal = numbers.length > 5 && !isNaN(numbers[5]) ? numbers[5] : this.currentTelemetry.orientation.roll;
            const yawVal = numbers.length > 6 && !isNaN(numbers[6]) ? numbers[6] : this.currentTelemetry.orientation.yaw;
            const latVal = numbers.length > 7 && !isNaN(numbers[7]) ? numbers[7] : this.currentTelemetry.gps.lat;
            const lngVal = numbers.length > 8 && !isNaN(numbers[8]) ? numbers[8] : this.currentTelemetry.gps.lng;
            const satsVal = numbers.length > 9 && !isNaN(numbers[9]) ? Math.round(numbers[9]) : this.currentTelemetry.gps.sats;
            const rssiVal = numbers.length > 10 && !isNaN(numbers[10]) ? numbers[10] : this.currentTelemetry.lora.rssi;

            return {
              time: timeVal,
              altitude: { bme: altVal, gps: altVal + 2, diff: 2 },
              verticalSpeed: this.currentTelemetry.verticalSpeed,
              acceleration: this.currentTelemetry.acceleration,
              orientation: { pitch: pitchVal, roll: rollVal, yaw: yawVal },
              gps: { lat: latVal, lng: lngVal, sats: satsVal },
              environment: { 
                temp: tempVal, 
                pressure: pressVal, 
                humidity: this.currentTelemetry.environment.humidity, 
                voc: this.currentTelemetry.environment.voc 
              },
              lora: { 
                rssi: rssiVal, 
                snr: this.currentTelemetry.lora.snr, 
                packets: this.status.packetsReceived, 
                dropped: 0 
              }
            };
          }
        }
      }
    } catch {
      return null;
    }
    return null;
  }

  public async send(command: string): Promise<boolean> {
    if (!this.status.isConnected || !this.port || !this.port.writable) {
      if (this.status.isSimulating) {
        this.addLog(`[TX] ${command}`, 'tx');
        this.addLog(`[RX-SIM] Respuesta simulada a: "${command}" -> OK`, 'rx');
        return true;
      }
      this.addLog('[ERROR] No hay ningún puerto serie conectado para transmitir.', 'error');
      return false;
    }

    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(command + '\r\n');
      
      const writer = this.port.writable.getWriter();
      await writer.write(data);
      writer.releaseLock();

      this.status.bytesSent += data.length;
      this.addLog(`[TX] ${command}`, 'tx');
      this.notifyStatus();
      return true;
    } catch (err: any) {
      this.addLog(`[ERROR] Error al transmitir comando: ${err.message || err}`, 'error');
      return false;
    }
  }

  public async disconnect(): Promise<void> {
    this.keepReading = false;

    if (this.status.isSimulating) {
      this.stopSimulation();
      return;
    }

    try {
      if (this.reader) {
        await this.reader.cancel();
        if (this.readableStreamClosed) {
          await this.readableStreamClosed.catch(() => {});
        }
        this.reader = null;
      }

      if (this.port) {
        await this.port.close();
        this.port = null;
      }

      this.status.isConnected = false;
      this.status.isConnecting = false;
      this.status.startTime = null;
      this.addLog('[SISTEMA] Desconectado del puerto serie.', 'system');
      this.notifyStatus();
    } catch (err: any) {
      this.status.isConnected = false;
      this.status.isConnecting = false;
      this.addLog(`[ERROR] Error al desconectar: ${err.message || err}`, 'error');
      this.notifyStatus();
    }
  }

  // Modo Simulación de Prueba (para cuando no hay Arduino físico conectado)
  public startSimulation(baudRate: number = 115200) {
    if (this.status.isConnected) {
      this.disconnect();
    }

    this.status.isSimulating = true;
    this.status.isConnected = true;
    this.status.portName = 'Simulador LoRa SX1278 (Virtual)';
    this.status.baudRate = baudRate;
    this.status.startTime = Date.now();
    this.status.error = null;
    this.notifyStatus();

    this.addLog(`[SISTEMA] Iniciando simulación de enlace LoRa a ${baudRate} bps...`, 'system');
    this.addLog(`[SISTEMA] Transmitiendo tramas CanSat sintéticas periódicas...`, 'system');

    let simIndex = 0;
    this.simulationInterval = window.setInterval(() => {
      simIndex++;
      const alt = (1600 + Math.sin(simIndex / 10) * 150 + (Math.random() * 5)).toFixed(2);
      const temp = (21.5 + Math.sin(simIndex / 15) * 2 + (Math.random() * 0.4)).toFixed(2);
      const press = (835.0 - (parseFloat(alt) - 1600) * 0.1).toFixed(1);
      const pitch = (Math.sin(simIndex / 8) * 8).toFixed(1);
      const roll = (Math.cos(simIndex / 6) * 5).toFixed(1);
      const yaw = ((180 + simIndex * 2) % 360).toFixed(1);
      const rssi = (-75 - Math.floor(Math.random() * 10)).toString();

      const packet = `$CANSAT,${Date.now()},${alt},${temp},${press},${pitch},${roll},${yaw},19.4208,-102.0628,12,${rssi}`;
      this.handleIncomingLine(packet);
    }, 1000);
  }

  public stopSimulation() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
    this.status.isSimulating = false;
    this.status.isConnected = false;
    this.status.startTime = null;
    this.addLog('[SISTEMA] Simulación detenida.', 'system');
    this.notifyStatus();
  }
}

// Instancia singleton compartida en toda la aplicación
export const serialService = new SerialService();
