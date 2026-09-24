import type { TelemetryData } from './telemetryTypes';
import { INITIAL_TELEMETRY_DATA } from './telemetryTypes';
import { evaluateForestFireRisk } from './fireRisk';

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
  private telemetryArchive: TelemetryData[] = [];
  private fireAlertActive = false;

  private statusListeners: Set<StatusListener> = new Set();
  private logListeners: Set<LogListener> = new Set();
  private telemetryListeners: Set<TelemetryListener> = new Set();

  private readonly csvStorageKey = 'orbitec-cansat-telemetry-csv';
  private csvFileHandle: any = null;

  constructor() {
    if (typeof localStorage !== 'undefined') {
      try {
        const savedCsv = localStorage.getItem(this.csvStorageKey);
        const savedRows = savedCsv?.split(/\r?\n/).slice(1) || [];
        for (const row of savedRows) {
          const separator = row.indexOf(',');
          if (separator < 0) continue;
          const receivedAt = row.slice(0, separator);
          const parsed = this.parseTelemetryLine(row.slice(separator + 1));
          if (!parsed) continue;
          parsed.receivedAt = receivedAt;
          this.telemetryArchive.push(parsed);
          this.telemetryHistory.push(parsed);
          this.currentTelemetry = parsed;
        }
        if (this.telemetryHistory.length > 7200) this.telemetryHistory = this.telemetryHistory.slice(-7200);
      } catch {}
    }

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

  public getTelemetryCSV(): string {
    const header = 'RECEIVED_AT,TEAM_ID,MISSION_TIME,PACKET_COUNT,ALTITUDE,TEMPERATURE,VOLTAGE,ACCEL_X,ACCEL_Y,ACCEL_Z,STATE,LATITUDE,LONGITUDE,ALTITUDE_PRESSURE,PRESSURE,VOC,TEMPERATURE_SECONDARY,HUMIDITY,ACCEL_X_SECONDARY,ACCEL_Y_SECONDARY,ACCEL_Z_SECONDARY,GYRO_X,GYRO_Y,GYRO_Z,MAG_X,MAG_Y,MAG_Z';
    const rows = this.telemetryArchive.map(item => `${item.receivedAt},${item.raw}`);
    return [header, ...rows].join('\n');
  }

  public downloadTelemetryCSV() {
    if (typeof document === 'undefined') return;
    const blob = new Blob([this.getTelemetryCSV()], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `cansat_telemetry_${new Date().toISOString().replace(/[:.]/g, '-')}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  public async selectTelemetryCSVFile(): Promise<boolean> {
    if (typeof window === 'undefined' || !('showSaveFilePicker' in window)) {
      this.addLog('[ERROR] El registro automático a archivo requiere Chrome o Edge. La copia local de respaldo sigue activa.', 'error');
      return false;
    }
    try {
      this.csvFileHandle = await (window as any).showSaveFilePicker({
        suggestedName: `cansat_telemetry_${new Date().toISOString().replace(/[:.]/g, '-')}.csv`,
        types: [{ description: 'Telemetría CanSat CSV', accept: { 'text/csv': ['.csv'] } }]
      });
      await this.persistTelemetryFile();
      this.addLog('[SISTEMA] Registro CSV automático armado: el archivo se actualizará con cada trama válida.', 'system');
      return true;
    } catch (error: any) {
      if (error?.name !== 'AbortError') this.addLog(`[ERROR] No se pudo preparar el archivo CSV: ${error?.message || error}`, 'error');
      return false;
    }
  }

  private async persistTelemetryFile() {
    if (!this.csvFileHandle) return;
    try {
      const writable = await this.csvFileHandle.createWritable();
      await writable.write(this.getTelemetryCSV());
      await writable.close();
    } catch (error: any) {
      this.addLog(`[ERROR] Falló la escritura automática del CSV: ${error?.message || error}`, 'error');
      this.csvFileHandle = null;
    }
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

            const lines = lineBuffer.split(/\r\n|\n|\r/);
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

    // Verificar y separar la trama ASCII CSV reglamentaria del CanSat.
    const parsedTelemetry = this.parseTelemetryLine(rawLine);
    if (parsedTelemetry) {
      if (parsedTelemetry.packetCount === 1 && this.currentTelemetry.packetCount > 1) {
        this.telemetryArchive = [];
        this.telemetryHistory = [];
      }
      this.currentTelemetry = parsedTelemetry;
      this.telemetryHistory.push(parsedTelemetry);
      this.telemetryArchive.push(parsedTelemetry);
      if (this.telemetryHistory.length > 7200) {
        this.telemetryHistory = this.telemetryHistory.slice(this.telemetryHistory.length - 7200);
      }
      this.addLog(rawLine, 'telemetry');
      const fireRisk = evaluateForestFireRisk(this.telemetryHistory);
      if (fireRisk.active && !this.fireAlertActive) {
        const detail = fireRisk.reason === 'rapid-rise'
          ? `incremento brusco de +${fireRisk.increase.toFixed(0)} ppm`
          : `concentración de ${fireRisk.voc.toFixed(0)} ppm`;
        this.addLog(`[ALERTA] Posible incendio forestal: ${detail} de gas/VOC. Verificar con los demás sensores.`, 'error');
      }
      this.fireAlertActive = fireRisk.active;
      // Persistencia automática local para no perder la captura al cambiar de pestaña
      // o recargar accidentalmente la interfaz durante la misión.
      if (typeof localStorage !== 'undefined') {
        try { localStorage.setItem(this.csvStorageKey, this.getTelemetryCSV()); } catch {}
      }
      void this.persistTelemetryFile();
      this.notifyTelemetry();
    } else {
      // Mensaje de texto estándar del Arduino / receptor LoRa
      this.addLog(rawLine, 'rx');
    }
    // El lector físico ya informa bytes por bloque, pero la simulación también
    // necesita publicar el contador de paquetes después de cada trama.
    this.notifyStatus();
  }

  // Trama oficial (TR-01/TR-02) + carga útil secundaria anexada al final:
  // TEAM_ID,MISSION_TIME,PACKET_COUNT,ALTITUDE,TEMPERATURE,VOLTAGE,
  // ACCEL_X,ACCEL_Y,ACCEL_Z,STATE,LATITUDE,LONGITUDE,ALTITUDE_PRESSURE,
  // PRESSURE,VOC,TEMPERATURE_SECONDARY,HUMIDITY,ACCEL_X_SECONDARY,
  // ACCEL_Y_SECONDARY,ACCEL_Z_SECONDARY,GYRO_X,GYRO_Y,GYRO_Z,MAG_X,MAG_Y,MAG_Z\n
  private parseTelemetryLine(line: string): TelemetryData | null {
    try {
      if (!line.includes(',')) return null;
      const clean = line.replace(/^\$(CANSAT|ORBITEC),?/i, '').trim();
      const parts = clean.split(',').map(value => value.trim());
      if (parts.length < 26 || !/^\d{4}$/.test(parts[0]) || !/^\d{2}:\d{2}:\d{2}$/.test(parts[1])) return null;

      const n = (index: number, fallback = 0) => {
        if (parts[index] === undefined || parts[index] === '') return fallback;
        const value = Number(parts[index]);
        return Number.isFinite(value) ? value : fallback;
      };
      const state = parts[9] as TelemetryData['state'];
      if (!['WAIT', 'DESC', 'LAND'].includes(state)) return null;

      const missionSeconds = parts[1].split(':').reduce((total, value) => total * 60 + Number(value), 0);
      const requiredAltitude = n(3, this.currentTelemetry.altitude.bme);
      const barometricAltitude = n(12, requiredAltitude);
      const temperature = n(15, n(4, this.currentTelemetry.environment.temp));
      const ax = n(17, n(6));
      const ay = n(18, n(7));
      const az = n(19, n(8));
      const mx = n(23), my = n(24), mz = n(25);
      const accelTotal = Math.sqrt(ax * ax + ay * ay + az * az);
      const roll = Math.atan2(ay, az || Number.EPSILON) * 180 / Math.PI;
      const pitch = Math.atan2(-ax, Math.sqrt(ay * ay + az * az) || Number.EPSILON) * 180 / Math.PI;
      const yaw = (Math.atan2(my, mx || Number.EPSILON) * 180 / Math.PI + 360) % 360;
      const previous = this.currentTelemetry;
      const deltaTime = missionSeconds - previous.time;
      const verticalSpeed = previous.packetCount > 0 && deltaTime > 0
        ? (barometricAltitude - previous.altitude.bme) / deltaTime
        : 0;

      const latitude = n(10, previous.gps.lat);
      const longitude = n(11, previous.gps.lng);
      const validLatitude = latitude >= -90 && latitude <= 90 ? latitude : previous.gps.lat;
      const validLongitude = longitude >= -180 && longitude <= 180 ? longitude : previous.gps.lng;

      return {
        time: missionSeconds,
        missionTime: parts[1],
        teamId: parts[0],
        packetCount: Math.trunc(n(2)),
        state,
        voltage: n(5),
        raw: clean,
        receivedAt: new Date().toISOString(),
        altitude: { bme: barometricAltitude, gps: requiredAltitude, diff: requiredAltitude - barometricAltitude },
        verticalSpeed,
        acceleration: { x: ax, y: ay, z: az, total: accelTotal },
        orientation: { pitch, roll, yaw },
        gps: { lat: validLatitude, lng: validLongitude, sats: previous.gps.sats },
        environment: { temp: temperature, pressure: n(13, previous.environment.pressure), humidity: n(16, previous.environment.humidity), voc: n(14, previous.environment.voc) },
        gyroscope: { x: n(20), y: n(21), z: n(22) },
        magnetometer: { x: mx, y: my, z: mz },
        lora: { ...previous.lora, packets: Math.trunc(n(2)), dropped: Math.max(0, Math.trunc(n(2)) - previous.packetCount - 1) + previous.lora.dropped }
      };
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
    this.addLog(`[SISTEMA] Transmitiendo a 1 Hz la trama oficial TR-02 y sus 16 campos adicionales...`, 'system');

    let simIndex = 0;
    this.simulationInterval = window.setInterval(() => {
      simIndex++;
      const elapsed = simIndex;
      const hh = Math.floor(elapsed / 3600).toString().padStart(2, '0');
      const mm = Math.floor((elapsed % 3600) / 60).toString().padStart(2, '0');
      const ss = (elapsed % 60).toString().padStart(2, '0');
      const altitude = Math.max(0, 50 - Math.max(0, elapsed - 5) * 5.5);
      const state = elapsed <= 5 ? 'WAIT' : altitude > 0 ? 'DESC' : 'LAND';
      const temp = 24 - altitude * 0.006;
      const pressure = 1013.25 * Math.pow(1 - altitude / 44330, 5.255);
      const ax = Math.sin(elapsed / 4) * 0.08;
      const ay = Math.cos(elapsed / 5) * 0.06;
      const az = state === 'LAND' ? 1 : 0.98;
      const lat = 19.4208 + elapsed * 0.000020;
      const lng = -102.0628 + elapsed * 0.000010;
      // Episodio de prueba para validar la alerta forestal desde el dashboard.
      const simulatedVoc = elapsed >= 25 && elapsed < 35
        ? 380 + Math.sin(elapsed) * 20
        : 105 + Math.sin(elapsed / 6) * 8;
      const packet = [
        '2026', `${hh}:${mm}:${ss}`, simIndex, altitude.toFixed(1), temp.toFixed(1), '7.42',
        ax.toFixed(2), ay.toFixed(2), az.toFixed(2), state,
        lat.toFixed(6), lng.toFixed(6), altitude.toFixed(1), pressure.toFixed(2),
        simulatedVoc.toFixed(1), temp.toFixed(1),
        (54 + Math.sin(elapsed / 8) * 3).toFixed(1), ax.toFixed(2), ay.toFixed(2), az.toFixed(2),
        (Math.sin(elapsed / 3) * 2).toFixed(2), (Math.cos(elapsed / 4) * 2).toFixed(2), '0.35',
        '22.10', '5.40', '-41.20'
      ].join(',');
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
