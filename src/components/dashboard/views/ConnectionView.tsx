import React, { useState, useEffect, useRef } from 'react';
import { Settings, Play, Square, Trash2, Radio, Wifi, AlertCircle } from 'lucide-react';

export const ConnectionView = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [port, setPort] = useState('COM3');
  const [baudRate, setBaudRate] = useState('115200');
  const [terminalData, setTerminalData] = useState<string[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Simulación de recepción de datos
  useEffect(() => {
    let interval: number;
    if (isConnected && !isPaused) {
      interval = window.setInterval(() => {
        const timestamp = new Date().toISOString().substring(11, 23);
        const altitude = (Math.random() * 500 + 1600).toFixed(2);
        const temp = (Math.random() * 3 + 20).toFixed(2);
        const packet = `[${timestamp}] $CANSAT,${Date.now()},${altitude},${temp},835.0,0.0,0.0,0.0`;
        
        setTerminalData(prev => {
          const newData = [...prev, packet];
          return newData.length > 200 ? newData.slice(newData.length - 200) : newData;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isConnected, isPaused]);

  // Autoscroll del terminal
  useEffect(() => {
    if (!isPaused && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalData, isPaused]);

  const handleConnect = () => {
    setIsConnected(!isConnected);
    if (!isConnected) {
      setTerminalData(prev => [
        ...prev,
        `[SISTEMA] Intentando conectar a ${port} @ ${baudRate} bps...`,
        `[SISTEMA] Conexión LoRa establecida con éxito.`
      ]);
    } else {
      setTerminalData(prev => [...prev, `[SISTEMA] Desconectado del puerto ${port}.`]);
    }
  };

  return (
    <div className="h-full flex flex-col gap-5 font-mono animate-in fade-in duration-300 pb-12">
      
      {/* Header estilo General */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0d0d0d] border border-white/10 p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-black/60 border border-white/10 rounded-xl">
            <Radio className="text-[#22c55e]" size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold font-title text-white uppercase tracking-wider">
              Conexión LoRa
            </h1>
            <p className="text-white/40 text-xs mt-0.5">Configuración de recepción de telemetría de Estación Terrena</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-black/60 px-4 py-2 rounded-lg border border-white/10 w-fit">
          <span className="relative flex h-2.5 w-2.5">
            {isConnected && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75" />
            )}
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isConnected ? 'bg-[#22c55e]' : 'bg-[#ef4444]'}`} />
          </span>
          <span className={`uppercase text-xs font-bold tracking-wider ${isConnected ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
            {isConnected ? 'ESTADO: CONECTADO' : 'ESTADO: DESCONECTADO'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Panel de Configuración */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="bg-[#0d0d0d] rounded-xl border border-white/10 p-5 flex flex-col gap-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <Settings size={15} className="text-[#38bdf8]" />
              Ajustes de Puerto Serie
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-semibold text-white/50 uppercase tracking-wider">Puerto COM</label>
                <div className="relative">
                  <select 
                    value={port}
                    onChange={(e) => setPort(e.target.value)}
                    disabled={isConnected}
                    className="w-full rounded-lg border border-white/15 bg-black/80 px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#38bdf8] focus:border-[#38bdf8] disabled:opacity-40 appearance-none transition-all shadow-inner font-mono cursor-pointer"
                  >
                    <option value="COM1">COM1</option>
                    <option value="COM2">COM2</option>
                    <option value="COM3">COM3 (USB Serial)</option>
                    <option value="COM4">COM4</option>
                    <option value="/dev/ttyUSB0">/dev/ttyUSB0 (Linux)</option>
                    <option value="/dev/tty.usbmodem">/dev/tty.usbmodem (Mac)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-white/40">
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-semibold text-white/50 uppercase tracking-wider">Baud Rate (Velocidad)</label>
                <div className="relative">
                  <select 
                    value={baudRate}
                    onChange={(e) => setBaudRate(e.target.value)}
                    disabled={isConnected}
                    className="w-full rounded-lg border border-white/15 bg-black/80 px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#38bdf8] focus:border-[#38bdf8] disabled:opacity-40 appearance-none transition-all shadow-inner font-mono cursor-pointer"
                  >
                    <option value="9600">9600 bps</option>
                    <option value="19200">19200 bps</option>
                    <option value="38400">38400 bps</option>
                    <option value="57600">57600 bps</option>
                    <option value="115200">115200 bps</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-white/40">
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={handleConnect}
              className={`w-full py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                isConnected 
                  ? 'bg-[#ef4444]/15 text-[#ef4444] border border-[#ef4444]/40 hover:bg-[#ef4444]/25' 
                  : 'bg-gradient-to-r from-[#c80a19] to-[#8b0712] text-white border border-[#c80a19]/50 hover:shadow-[0_0_15px_rgba(200,10,25,0.4)]'
              }`}
            >
              {isConnected ? (
                <>
                  <Square size={14} /> Detener Conexión
                </>
              ) : (
                <>
                  <Play size={14} fill="currentColor" /> Conectar Antena LoRa
                </>
              )}
            </button>
            
            {!isConnected && (
              <div className="bg-[#eab308]/10 border border-[#eab308]/20 rounded-lg p-3 flex gap-2.5 text-[#eab308] text-[10px]">
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                <p className="leading-normal font-sans">Asegúrate de que el receptor USB LoRa esté conectado antes de iniciar la captura.</p>
              </div>
            )}
          </div>
          
          <div className="bg-[#0d0d0d] rounded-xl border border-white/10 p-5 flex-1 flex flex-col justify-center items-center text-center gap-3 relative overflow-hidden">
            <div className={`h-16 w-16 rounded-full flex items-center justify-center border transition-all duration-500 ${
              isConnected ? 'bg-[#22c55e]/15 border-[#22c55e]/30 shadow-[0_0_20px_rgba(34,197,94,0.2)]' : 'bg-black/40 border-white/10'
            }`}>
              <Wifi size={28} className={`transition-all duration-500 ${isConnected ? "text-[#22c55e] animate-pulse" : "text-white/20"}`} />
            </div>
            <div className="relative z-10">
              <h3 className="font-bold text-xs uppercase tracking-wider text-white">Estado del Receptor</h3>
              <p className={`text-[10px] mt-0.5 ${isConnected ? 'text-[#22c55e] font-bold' : 'text-white/40'}`}>
                {isConnected ? 'Escuchando en 433 MHz (LoRa SX1278)' : 'Receptor en espera'}
              </p>
            </div>
          </div>
        </div>

        {/* Panel del Monitor Serie (Terminal) */}
        <div className="lg:col-span-2 bg-[#0d0d0d] rounded-xl border border-white/10 flex flex-col overflow-hidden h-[420px] lg:h-[460px] shadow-2xl relative">
          
          {/* Header de Monitor Serie */}
          <div className="bg-black/80 border-b border-white/10 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 mr-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#eab308]/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e]/80" />
              </div>
              <h2 className="text-xs font-bold text-white/70 uppercase tracking-wider">
                Monitor Serie — Telemetría Bruta NMEA / CSV
              </h2>
            </div>

            {/* Acciones Terminal */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsPaused(!isPaused)}
                className={`px-2.5 py-1 rounded transition-colors text-[9px] uppercase font-bold tracking-wider flex items-center gap-1 border cursor-pointer ${
                  isPaused ? 'bg-[#eab308]/20 text-[#eab308] border-[#eab308]/40' : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                {isPaused ? <Play size={10} /> : <Square size={10} />}
                {isPaused ? 'REANUDAR' : 'PAUSAR'}
              </button>
              <button 
                onClick={() => setTerminalData([])}
                className="px-2.5 py-1 bg-white/5 text-white/60 border border-white/10 rounded hover:bg-[#ef4444]/20 hover:text-[#ef4444] hover:border-[#ef4444]/30 transition-colors text-[9px] uppercase font-bold tracking-wider flex items-center gap-1 cursor-pointer"
              >
                <Trash2 size={10} /> LIMPIAR
              </button>
            </div>
          </div>
          
          {/* Consola Terminal */}
          <div className="flex-1 overflow-y-auto p-4 font-mono text-xs custom-scrollbar whitespace-pre-wrap break-all bg-black/60">
            {terminalData.length === 0 ? (
              <div className="text-white/30 flex h-full items-center justify-center italic text-xs">
                Esperando datos de transmisión LoRa...
              </div>
            ) : (
              terminalData.map((line, index) => {
                const isSystem = line.startsWith('[SISTEMA]');
                return (
                  <div key={index} className={`mb-1 leading-relaxed ${isSystem ? 'text-[#eab308] font-bold' : 'text-[#22c55e]'}`}>
                    {line}
                  </div>
                );
              })
            )}
            <div ref={terminalEndRef} />
          </div>
        </div>
        
      </div>
    </div>
  );
};
