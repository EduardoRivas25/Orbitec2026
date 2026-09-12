import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings, Play, Square, Trash2, Radio, Wifi, AlertCircle, 
  Send, Download, Copy, Check, Search, Cpu, Terminal, 
  ArrowDownCircle, ArrowUpCircle, RefreshCw, Zap, ShieldCheck,
  Usb, HelpCircle, CheckCircle2, XCircle, Info, Layers, Save
} from 'lucide-react';
import { serialService } from '../data/serialService';
import type { SerialLogItem, SerialStatus, KnownPortInfo } from '../data/serialService';
import { useTelemetryData } from '../data/mockTelemetry';

export const ConnectionView = () => {
  const telemetryData = useTelemetryData();
  const [status, setStatus] = useState<SerialStatus>(() => serialService.getStatus());
  const [logs, setLogs] = useState<SerialLogItem[]>(() => serialService.getLogs());
  const [authorizedPorts, setAuthorizedPorts] = useState<KnownPortInfo[]>([]);
  const [selectedBaud, setSelectedBaud] = useState<string>('115200');
  const [commandInput, setCommandInput] = useState<string>('');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [showPortGuide, setShowPortGuide] = useState<boolean>(false);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Suscripción al estado y logs del servicio serie
  useEffect(() => {
    const unsubStatus = serialService.subscribeStatus((newStatus) => {
      setStatus(newStatus);
    });
    const unsubLogs = serialService.subscribeLogs((newLogs) => {
      setLogs(newLogs);
    });

    // Cargar puertos autorizados previamente
    const fetchPorts = async () => {
      const ports = await serialService.getAuthorizedPorts();
      setAuthorizedPorts(ports);
    };
    fetchPorts();

    return () => {
      unsubStatus();
      unsubLogs();
    };
  }, []);

  // Autoscroll de la consola estricto
  useEffect(() => {
    if (autoScroll && !isPaused && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll, isPaused]);

  // Manejador de conexión general con Web Serial
  const handleToggleConnect = async () => {
    if (status.isConnected) {
      await serialService.disconnect();
    } else {
      const baud = parseInt(selectedBaud, 10) || 115200;
      const success = await serialService.requestAndConnect(baud);
      if (success) {
        const ports = await serialService.getAuthorizedPorts();
        setAuthorizedPorts(ports);
      }
    }
  };

  // Conectar directamente a un puerto ya autorizado
  const handleConnectDirect = async (portInfo: KnownPortInfo) => {
    if (status.isConnected) {
      await serialService.disconnect();
    }
    const baud = parseInt(selectedBaud, 10) || 115200;
    await serialService.connectWithPort(portInfo.port, baud);
  };

  // Manejador de simulación (para pruebas sin hardware)
  const handleToggleSimulation = () => {
    if (status.isSimulating) {
      serialService.stopSimulation();
    } else {
      const baud = parseInt(selectedBaud, 10) || 115200;
      serialService.startSimulation(baud);
    }
  };

  // Enviar comando serie al Arduino
  const handleSendCommand = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!commandInput.trim()) return;

    await serialService.send(commandInput.trim());
    setCommandInput('');
  };

  // Enviar comando rápido
  const handleQuickCommand = async (cmd: string) => {
    await serialService.send(cmd);
  };

  // Descargar logs en archivo de texto
  const handleExportLogs = () => {
    if (logs.length === 0) return;
    const content = logs.map(l => `[${l.timestamp}] [${l.type.toUpperCase()}] ${l.text}`).join('\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `telemetry_serial_log_${new Date().toISOString().replace(/[:.]/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(a);
  };

  const handleExportTelemetry = () => serialService.downloadTelemetryCSV();
  const handleArmTelemetryFile = () => void serialService.selectTelemetryCSVFile();

  // Copiar logs al portapapeles
  const handleCopyLogs = () => {
    if (logs.length === 0) return;
    const content = logs.map(l => `[${l.timestamp}] [${l.type.toUpperCase()}] ${l.text}`).join('\n');
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Formato del tiempo de conexión activa
  const formatUptime = (startTime: number | null) => {
    if (!startTime) return '00:00:00';
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const hrs = Math.floor(elapsed / 3600).toString().padStart(2, '0');
    const mins = Math.floor((elapsed % 3600) / 60).toString().padStart(2, '0');
    const secs = Math.floor(elapsed % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  // Filtrado de logs según búsqueda
  const filteredLogs = logs.filter(item => 
    item.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.timestamp.includes(searchTerm) ||
    item.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col gap-4 font-mono animate-in fade-in duration-300 pb-6">
      
      {/* ═══════════════════════════════════════════════════════
          HEADER: ESTADO GENERAL DE LA CONEXIÓN SERIE / LORA
          ═══════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0d0d0d] border border-white/10 p-4 rounded-xl shadow-xl shrink-0">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl border transition-all ${
            status.isConnected 
              ? 'bg-[#22c55e]/15 border-[#22c55e]/30 shadow-[0_0_15px_rgba(34,197,94,0.25)] text-[#22c55e]' 
              : 'bg-black/60 border-white/10 text-white/50'
          }`}>
            <Radio size={22} className={status.isConnected ? 'animate-pulse' : ''} />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold font-title text-white uppercase tracking-wider flex items-center gap-2">
              Conexión Serial USB / LoRa
              {status.isSimulating && (
                <span className="text-[10px] font-mono px-2 py-0.5 bg-[#eab308]/20 border border-[#eab308]/40 text-[#eab308] rounded-md uppercase font-bold tracking-wider">
                  Modo Virtual
                </span>
              )}
            </h1>
            <p className="text-white/40 text-xs mt-0.5">
              Recepción directa por hardware USB (Arduino, ESP32, SX1278) • Web Serial API
            </p>
          </div>
        </div>
        
        {/* Badges de Estado */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {status.isConnected && (
            <div className="hidden md:flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-lg border border-white/10 text-[10px]">
              <span className="text-white/40">TIEMPO ACTIVO:</span>
              <span className="text-white font-bold">{formatUptime(status.startTime)}</span>
            </div>
          )}
          <div className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg border text-xs font-bold tracking-wider uppercase transition-all ${
            status.isConnected 
              ? 'bg-[#22c55e]/10 border-[#22c55e]/30 text-[#22c55e]' 
              : 'bg-[#ef4444]/10 border-[#ef4444]/30 text-[#ef4444]'
          }`}>
            <span className="relative flex h-2.5 w-2.5">
              {status.isConnected && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75" />
              )}
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${status.isConnected ? 'bg-[#22c55e]' : 'bg-[#ef4444]'}`} />
            </span>
            <span>{status.isConnected ? 'EN LÍNEA / CONECTADO' : 'DESCONECTADO'}</span>
          </div>
        </div>
      </div>

      {/* Alerta si el navegador no soporta Web Serial API */}
      {!status.isSupported && (
        <div className="bg-[#ef4444]/15 border border-[#ef4444]/30 rounded-xl p-4 flex items-start gap-3 text-white text-xs shrink-0">
          <AlertCircle size={20} className="text-[#ef4444] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-[#ef4444] uppercase tracking-wider">Navegador no compatible con Web Serial API</h4>
            <p className="text-white/70 font-sans leading-relaxed">
              Tu navegador actual no tiene activada la API nativa de puertos serie. Para conectarte físicamente a tu Arduino o receptor LoRa por USB, por favor abre esta página en <strong>Google Chrome</strong>, <strong>Microsoft Edge</strong>, <strong>Opera</strong> o <strong>Brave</strong>.
            </p>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          GRID PRINCIPAL: PANEL DE CONTROL (IZQ) + TERMINAL (DER)
          ═══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* COLUMNA IZQUIERDA: CONFIGURACIÓN Y GESTOR DE PUERTOS */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          
          {/* Card de Configuración del Puerto y Asistente COM */}
          <div className="bg-[#0d0d0d] rounded-xl border border-white/10 p-4 sm:p-5 flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Settings size={15} className="text-[#38bdf8]" />
                Ajustes de Puerto Serie
              </h2>
              <button
                onClick={() => setShowPortGuide(!showPortGuide)}
                className="text-[10px] text-[#38bdf8] hover:text-[#38bdf8]/80 flex items-center gap-1 cursor-pointer transition-colors"
                title="Ayuda para identificar tu puerto COM"
              >
                <HelpCircle size={12} />
                <span>¿Cuál puerto elegir?</span>
              </button>
            </div>

            {/* Banner de Guía Rápida para Selección de Puerto */}
            {showPortGuide && (
              <div className="bg-[#38bdf8]/10 border border-[#38bdf8]/30 rounded-lg p-3 text-[11px] font-sans space-y-2 text-white/80 animate-in fade-in duration-200">
                <div className="flex items-center gap-1.5 text-[#38bdf8] font-bold uppercase text-[10px]">
                  <Info size={14} /> Cómo elegir el puerto en Windows:
                </div>
                <ul className="space-y-1.5 text-[10px] text-white/70">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 size={12} className="text-[#22c55e] shrink-0 mt-0.5" />
                    <span><strong>Selecciona:</strong> <code>USB Serial (COM...)</code>, <code>CH340</code>, <code>CP210x</code> o <code>Arduino Uno</code>.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <XCircle size={12} className="text-[#ef4444] shrink-0 mt-0.5" />
                    <span><strong>Ignora:</strong> Puertos Bluetooth como <em>Redmi Buds</em>, <em>Spp1</em> o <em>Dispositivo Bluetooth</em>.</span>
                  </li>
                </ul>
              </div>
            )}
            
            <div className="space-y-3.5">
              {/* Selector de Baud Rate */}
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-semibold text-white/60 uppercase tracking-wider flex items-center justify-between">
                  <span>Velocidad (Baud Rate)</span>
                  <span className="text-white/30 text-[9px]">9600 o 115200</span>
                </label>
                <div className="relative">
                  <select 
                    value={selectedBaud}
                    onChange={(e) => setSelectedBaud(e.target.value)}
                    disabled={status.isConnected || status.isConnecting}
                    className="w-full rounded-lg border border-white/15 bg-black/80 px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#38bdf8] focus:border-[#38bdf8] disabled:opacity-40 appearance-none transition-all shadow-inner font-mono cursor-pointer"
                  >
                    <option value="9600">9600 bps (Arduino Básico)</option>
                    <option value="19200">19200 bps</option>
                    <option value="38400">38400 bps</option>
                    <option value="57600">57600 bps</option>
                    <option value="115200">115200 bps (LoRa / ESP32 Recomendado)</option>
                    <option value="230400">230400 bps</option>
                    <option value="460800">460800 bps</option>
                    <option value="921600">921600 bps</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-white/40">
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              {/* Botones de Presets de Baud Rate */}
              <div className="flex items-center gap-1.5">
                {['9600', '115200', '230400'].map((b) => (
                  <button
                    key={b}
                    onClick={() => setSelectedBaud(b)}
                    disabled={status.isConnected}
                    className={`flex-1 py-1 rounded text-[9px] font-bold font-mono transition-all cursor-pointer border ${
                      selectedBaud === b
                        ? 'bg-[#38bdf8]/20 border-[#38bdf8] text-[#38bdf8]'
                        : 'bg-white/5 border-white/10 text-white/40 hover:text-white'
                    }`}
                  >
                    {b} bps
                  </button>
                ))}
              </div>

              {/* Estado de Dispositivo Actual */}
              <div className="bg-black/60 border border-white/10 rounded-lg p-3 text-[10px] space-y-1">
                <div className="flex justify-between text-white/40">
                  <span>DISPOSITIVO:</span>
                  <span className="text-white font-bold truncate max-w-[170px]">
                    {status.isConnected ? (status.portName || 'Arduino / USB Serial') : 'Ninguno activo'}
                  </span>
                </div>
                <div className="flex justify-between text-white/40">
                  <span>VELOCIDAD ACTIVA:</span>
                  <span className="text-[#38bdf8] font-bold">{status.baudRate || selectedBaud} bps</span>
                </div>
              </div>

              {/* Lista de Puertos USB Recordados / Autorizados Previamente */}
              {authorizedPorts.length > 0 && !status.isConnected && (
                <div className="space-y-2 pt-1">
                  <div className="text-[10px] text-white/50 uppercase font-bold flex items-center gap-1.5">
                    <Usb size={12} className="text-[#22c55e]" /> Dispositivos USB Recordados:
                  </div>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto custom-scrollbar">
                    {authorizedPorts.map((p) => (
                      <div 
                        key={p.index}
                        className="bg-black/80 border border-white/10 hover:border-[#22c55e]/50 p-2.5 rounded-lg flex items-center justify-between gap-2 transition-all"
                      >
                        <div className="flex flex-col min-w-0">
                          <span className="text-[10px] font-bold text-white truncate flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]"></span>
                            {p.name}
                          </span>
                          <span className="text-[8px] text-white/40 uppercase">Puerto #{p.index + 1} listo</span>
                        </div>
                        <button
                          onClick={() => handleConnectDirect(p)}
                          className="px-2.5 py-1 bg-[#22c55e]/20 border border-[#22c55e]/40 hover:bg-[#22c55e]/30 text-[#22c55e] rounded text-[9px] font-bold uppercase transition-all cursor-pointer shrink-0"
                        >
                          Conectar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Botón Principal de Conectar / Desconectar */}
            <button 
              onClick={handleToggleConnect}
              disabled={status.isConnecting || !status.isSupported}
              className={`w-full py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50 ${
                status.isConnected 
                  ? 'bg-[#ef4444]/15 text-[#ef4444] border border-[#ef4444]/40 hover:bg-[#ef4444]/25 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
                  : 'bg-gradient-to-r from-[#c80a19] to-[#8b0712] text-white border border-[#c80a19]/50 hover:shadow-[0_0_15px_rgba(200,10,25,0.4)]'
              }`}
            >
              {status.isConnecting ? (
                <>
                  <RefreshCw size={14} className="animate-spin" /> Conectando Puerto...
                </>
              ) : status.isConnected ? (
                <>
                  <Square size={14} fill="currentColor" /> Desconectar Arduino
                </>
              ) : (
                <>
                  <Play size={14} fill="currentColor" /> Seleccionar Puerto COM USB
                </>
              )}
            </button>

            {/* Botón de Simulación para Pruebas */}
            <button
              onClick={handleToggleSimulation}
              disabled={status.isConnecting}
              className={`w-full py-2 rounded-lg font-bold text-[10px] uppercase tracking-wider transition-all border flex items-center justify-center gap-1.5 cursor-pointer ${
                status.isSimulating
                  ? 'bg-[#eab308]/20 border-[#eab308]/50 text-[#eab308]'
                  : 'bg-white/5 border-white/10 text-white/50 hover:text-white hover:bg-white/10'
              }`}
            >
              <Zap size={12} className={status.isSimulating ? 'text-[#eab308]' : ''} />
              {status.isSimulating ? 'Detener Modo Virtual' : 'Probar con Datos Sintéticos (Demo)'}
            </button>

            {!status.isConnected && !status.isSimulating && (
              <div className="bg-[#38bdf8]/10 border border-[#38bdf8]/20 rounded-lg p-2.5 flex gap-2 text-[#38bdf8] text-[10px]">
                <Info size={14} className="shrink-0 mt-0.5" />
                <p className="leading-normal font-sans">
                  En el menú de tu navegador, selecciona <strong>USB Serial</strong> o el puerto COM donde esté tu Arduino.
                </p>
              </div>
            )}
          </div>
          
          {/* Card de Estadísticas de Tráfico de Datos */}
          <div className="bg-[#0d0d0d] rounded-xl border border-white/10 p-4 sm:p-5 flex flex-col gap-3 shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2 border-b border-white/10 pb-2.5">
              <Cpu size={15} className="text-[#22c55e]" />
              Estadísticas de Enlace
            </h3>

            <div className="grid grid-cols-2 gap-2 text-left font-mono">
              <div className="bg-black/50 border border-white/5 p-2.5 rounded-lg">
                <div className="flex items-center gap-1 text-white/40 text-[9px] uppercase font-bold mb-1">
                  <ArrowDownCircle size={11} className="text-[#22c55e]" /> RX Paquetes
                </div>
                <div className="text-lg font-bold text-white">{status.packetsReceived}</div>
              </div>

              <div className="bg-black/50 border border-white/5 p-2.5 rounded-lg">
                <div className="flex items-center gap-1 text-white/40 text-[9px] uppercase font-bold mb-1">
                  <ArrowDownCircle size={11} className="text-[#38bdf8]" /> RX Bytes
                </div>
                <div className="text-lg font-bold text-white">
                  {status.bytesReceived > 1024 
                    ? `${(status.bytesReceived / 1024).toFixed(1)} KB` 
                    : `${status.bytesReceived} B`}
                </div>
              </div>

              <div className="bg-black/50 border border-white/5 p-2.5 rounded-lg">
                <div className="flex items-center gap-1 text-white/40 text-[9px] uppercase font-bold mb-1">
                  <ArrowUpCircle size={11} className="text-[#eab308]" /> TX Bytes
                </div>
                <div className="text-lg font-bold text-white">{status.bytesSent} B</div>
              </div>

              <div className="bg-black/50 border border-white/5 p-2.5 rounded-lg">
                <div className="flex items-center gap-1 text-white/40 text-[9px] uppercase font-bold mb-1">
                  <Wifi size={11} className="text-[#c80a19]" /> Potencia RSSI
                </div>
                <div className="text-lg font-bold text-white">
                  {telemetryData.lora.rssi.toFixed(0)} <span className="text-[10px] text-white/40 font-normal">dBm</span>
                </div>
              </div>
            </div>

            {/* Resumen del último valor de altitud/temp parseado */}
            <div className="mt-1 bg-black/40 border border-white/5 rounded-lg p-2.5 text-[10px] flex items-center justify-between text-white/60">
              <span>Última Altitud: <strong className="text-[#38bdf8]">{telemetryData.altitude.bme.toFixed(1)} m</strong></span>
              <span>Temp: <strong className="text-[#f97316]">{telemetryData.environment.temp.toFixed(1)} °C</strong></span>
            </div>
          </div>

        </div>

        {/* COLUMNA DERECHA: MONITOR SERIE / TERMINAL CON ALTURA ESTRICTA Y SCROLL INTERNO */}
        <div className="lg:col-span-2 bg-[#0d0d0d] rounded-xl border border-white/10 flex flex-col overflow-hidden h-[540px] sm:h-[600px] lg:h-[650px] max-h-[700px] shadow-2xl relative">
          
          {/* Header de la Consola Terminal */}
          <div className="bg-black/90 border-b border-white/10 px-3 sm:px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 mr-1">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#eab308]/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e]/80" />
              </div>
              <Terminal size={14} className="text-white/60 ml-1" />
              <h2 className="text-[11px] sm:text-xs font-bold text-white uppercase tracking-wider">
                Monitor Serie — Telemetría en Vivo
              </h2>
              <span className="text-[9px] text-white/30 ml-1 hidden sm:inline">
                ({filteredLogs.length} líneas)
              </span>
            </div>

            {/* Barra de Herramientas de la Consola */}
            <div className="flex items-center gap-1.5 flex-wrap self-end sm:self-auto text-[9px]">
              
              {/* Filtro de Búsqueda */}
              <div className="relative">
                <Search size={11} className="absolute left-2 top-1/2 -translate-y-1/2 text-white/30" />
                <input 
                  type="text"
                  placeholder="Filtrar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-black/60 border border-white/15 rounded-md pl-6 pr-2 py-1 text-[10px] text-white placeholder-white/30 focus:outline-none focus:border-[#38bdf8] w-24 sm:w-32"
                />
              </div>

              {/* Botón Auto-scroll */}
              <button 
                onClick={() => setAutoScroll(!autoScroll)}
                className={`px-2 py-1 rounded transition-colors uppercase font-bold tracking-wider border cursor-pointer ${
                  autoScroll ? 'bg-[#38bdf8]/15 text-[#38bdf8] border-[#38bdf8]/30' : 'bg-white/5 text-white/40 border-white/10'
                }`}
                title="Desplazamiento automático al final"
              >
                Autoscroll
              </button>

              {/* Botón Pausar / Reanudar */}
              <button 
                onClick={() => setIsPaused(!isPaused)}
                className={`px-2 py-1 rounded transition-colors uppercase font-bold tracking-wider flex items-center gap-1 border cursor-pointer ${
                  isPaused ? 'bg-[#eab308]/20 text-[#eab308] border-[#eab308]/40' : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                {isPaused ? <Play size={9} /> : <Square size={9} />}
                {isPaused ? 'REANUDAR' : 'PAUSAR'}
              </button>

              {/* Botón Copiar */}
              <button 
                onClick={handleCopyLogs}
                className="px-2 py-1 bg-white/5 text-white/60 border border-white/10 rounded hover:bg-white/10 hover:text-white transition-colors uppercase font-bold tracking-wider flex items-center gap-1 cursor-pointer"
                title="Copiar todas las líneas al portapapeles"
              >
                {copied ? <Check size={9} className="text-[#22c55e]" /> : <Copy size={9} />}
                {copied ? 'COPIADO' : 'COPIAR'}
              </button>

              {/* Botón Exportar */}
              <button 
                onClick={handleExportLogs}
                className="px-2 py-1 bg-white/5 text-white/60 border border-white/10 rounded hover:bg-white/10 hover:text-white transition-colors uppercase font-bold tracking-wider flex items-center gap-1 cursor-pointer"
                title="Descargar logs en archivo .txt"
              >
                <Download size={9} /> EXPORTAR
              </button>

              <button
                onClick={handleArmTelemetryFile}
                className="px-2 py-1 bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/30 rounded hover:bg-[#38bdf8]/20 transition-colors uppercase font-bold tracking-wider flex items-center gap-1 cursor-pointer"
                title="Elegir una vez el archivo que se actualizará con cada paquete"
              >
                <Save size={9} /> ARMAR CSV AUTO
              </button>

              <button
                onClick={handleExportTelemetry}
                className="px-2 py-1 bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/30 rounded hover:bg-[#22c55e]/20 transition-colors uppercase font-bold tracking-wider flex items-center gap-1 cursor-pointer"
                title="Descargar toda la telemetría registrada en CSV"
              >
                <Download size={9} /> EXPORTAR TODAS CSV
              </button>

              {/* Botón Limpiar */}
              <button 
                onClick={() => serialService.clearLogs()}
                className="px-2 py-1 bg-white/5 text-white/60 border border-white/10 rounded hover:bg-[#ef4444]/20 hover:text-[#ef4444] hover:border-[#ef4444]/30 transition-colors uppercase font-bold tracking-wider flex items-center gap-1 cursor-pointer"
                title="Limpiar pantalla del monitor serie"
              >
                <Trash2 size={9} /> LIMPIAR
              </button>
            </div>
          </div>
          
          {/* Cuerpo de la Consola Terminal - Scrollable y con Altura Delimitada Estricta */}
          <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 font-mono text-xs custom-scrollbar whitespace-pre-wrap break-all bg-black/80 space-y-1 select-text">
            {filteredLogs.length === 0 ? (
              <div className="text-white/30 flex flex-col h-full items-center justify-center italic text-xs gap-2 py-16">
                <Terminal size={32} className="text-white/20 animate-pulse" />
                <span>
                  {status.isConnected 
                    ? 'Puerto serie abierto. Esperando que el Arduino envíe datos...' 
                    : 'Consola lista. Conecta tu Arduino por USB para comenzar la captura.'}
                </span>
                <span className="text-[10px] text-white/20 font-sans">
                  Formato: TEAM_ID,MISSION_TIME,PACKET_COUNT,ALTITUDE,TEMPERATURE,VOLTAGE,ACCEL_X,ACCEL_Y,ACCEL_Z,STATE + carga útil
                </span>
              </div>
            ) : (
              filteredLogs.map((item) => {
                let colorClass = 'text-[#22c55e]'; // rx por defecto verde
                let badge = 'RX';
                let badgeClass = 'bg-[#22c55e]/15 text-[#22c55e] border-[#22c55e]/30';

                if (item.type === 'system') {
                  colorClass = 'text-[#eab308]';
                  badge = 'SYS';
                  badgeClass = 'bg-[#eab308]/15 text-[#eab308] border-[#eab308]/30';
                } else if (item.type === 'tx') {
                  colorClass = 'text-[#38bdf8] font-bold';
                  badge = 'TX';
                  badgeClass = 'bg-[#38bdf8]/15 text-[#38bdf8] border-[#38bdf8]/30';
                } else if (item.type === 'telemetry') {
                  colorClass = 'text-[#a855f7]';
                  badge = 'TELEM';
                  badgeClass = 'bg-[#a855f7]/15 text-[#a855f7] border-[#a855f7]/30';
                } else if (item.type === 'error') {
                  colorClass = 'text-[#ef4444] font-bold';
                  badge = 'ERR';
                  badgeClass = 'bg-[#ef4444]/15 text-[#ef4444] border-[#ef4444]/30';
                }

                return (
                  <div key={item.id} className="leading-relaxed hover:bg-white/5 px-1 py-0.5 rounded transition-colors flex items-start gap-2">
                    <span className="text-white/25 select-none text-[10px] shrink-0 font-mono mt-0.5">
                      [{item.timestamp}]
                    </span>
                    <span className={`text-[9px] px-1 py-0.2 rounded border uppercase font-bold shrink-0 select-none ${badgeClass}`}>
                      {badge}
                    </span>
                    <span className={`flex-1 font-mono ${colorClass}`}>
                      {item.text}
                    </span>
                  </div>
                );
              })
            )}
            <div ref={terminalEndRef} />
          </div>

          {/* Transmisor de Comandos Serie (TX) */}
          <div className="bg-black/90 border-t border-white/10 p-2 sm:p-3 flex flex-col gap-2 shrink-0">
            
            {/* Botones de Comando Rápido */}
            <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 text-[9px]">
              <span className="text-white/30 uppercase font-bold shrink-0 mr-1">Comandos Rápidos:</span>
              {['PING', 'STATUS', 'GET_DATA', 'RESET', 'CAL_IMU'].map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => handleQuickCommand(cmd)}
                  disabled={!status.isConnected && !status.isSimulating}
                  className="px-2 py-0.5 bg-white/5 border border-white/10 rounded hover:bg-[#38bdf8]/20 hover:text-[#38bdf8] hover:border-[#38bdf8]/30 transition-all font-mono font-bold text-white/70 disabled:opacity-30 cursor-pointer shrink-0"
                >
                  {cmd}
                </button>
              ))}
            </div>

            {/* Formulario de Envío de Comandos */}
            <form onSubmit={handleSendCommand} className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#38bdf8] font-bold font-mono text-xs">
                  &gt;
                </span>
                <input 
                  type="text"
                  value={commandInput}
                  onChange={(e) => setCommandInput(e.target.value)}
                  placeholder={status.isConnected ? "Escribe un comando para enviar al Arduino (ej. PING, RESET, START)..." : "Conecta el puerto serie para enviar comandos..."}
                  disabled={!status.isConnected && !status.isSimulating}
                  className="w-full bg-black/60 border border-white/15 rounded-lg pl-7 pr-3 py-2 text-xs font-mono text-white placeholder-white/30 focus:outline-none focus:border-[#38bdf8] focus:ring-1 focus:ring-[#38bdf8] disabled:opacity-40 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={(!status.isConnected && !status.isSimulating) || !commandInput.trim()}
                className="px-4 py-2 bg-[#38bdf8] hover:bg-[#38bdf8]/80 text-black font-bold rounded-lg text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-md shrink-0"
              >
                <Send size={12} />
                <span className="hidden sm:inline">Enviar</span>
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
};
