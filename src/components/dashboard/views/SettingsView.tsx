import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  Globe, 
  Radio, 
  Bell, 
  Volume2, 
  VolumeX,
  Gauge
} from 'lucide-react';

export interface SimpleSettings {
  stationName: string;
  altitudeUnit: 'm' | 'ft';
  tempUnit: 'C' | 'F';
  port: string;
  baudRate: string;
  enableAudioAlerts: boolean;
  enableToastAlerts: boolean;
}

const DEFAULT_SETTINGS: SimpleSettings = {
  stationName: 'ORBITEC Base Alpha',
  altitudeUnit: 'm',
  tempUnit: 'C',
  port: 'COM3',
  baudRate: '115200',
  enableAudioAlerts: true,
  enableToastAlerts: true,
};

export const SettingsView: React.FC = () => {
  const [settings, setSettings] = useState<SimpleSettings>(DEFAULT_SETTINGS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Cargar desde localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('orbitec_cansat_simple_settings');
      if (saved) {
        setSettings(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error al cargar ajustes', e);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleSave = () => {
    try {
      localStorage.setItem('orbitec_cansat_simple_settings', JSON.stringify(settings));
      showToast('¡Configuración guardada correctamente!');
    } catch (e) {
      showToast('Error al guardar ajustes');
    }
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem('orbitec_cansat_simple_settings');
    showToast('Ajustes restablecidos');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-mono animate-in fade-in duration-300 pb-16">
      
      {/* Toast Flotante */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0d0d0d] border border-[#22c55e]/50 text-[#22c55e] px-4 py-3 rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.25)] flex items-center gap-3 backdrop-blur-xl animate-in slide-in-from-bottom-3 duration-300">
          <CheckCircle2 size={18} className="shrink-0 text-[#22c55e]" />
          <span className="text-xs font-bold font-mono">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0d0d0d] border border-white/10 p-4 sm:p-5 rounded-xl backdrop-blur-xl shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 sm:p-3 bg-[#c80a19]/15 border border-[#c80a19]/30 rounded-xl shadow-[0_0_15px_rgba(200,10,25,0.2)]">
            <Settings className="text-[#c80a19]" size={22} />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold font-title text-white uppercase tracking-wider">
              CONFIGURACIÓN
            </h1>
            <p className="text-white/40 text-[11px] sm:text-xs mt-0.5">Ajustes básicos del Dashboard y Estación Terrena</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleReset}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-white/15 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white text-xs font-bold uppercase transition-all cursor-pointer"
            title="Restablecer valores iniciales"
          >
            <RotateCcw size={14} />
            <span>Restablecer</span>
          </button>

          <button
            onClick={handleSave}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#c80a19] to-[#8b0712] border border-[#c80a19]/50 text-white text-xs font-bold uppercase transition-all hover:shadow-[0_0_15px_rgba(200,10,25,0.4)] cursor-pointer"
          >
            <Save size={15} />
            <span>Guardar</span>
          </button>
        </div>
      </div>

      {/* Tarjetas de Configuración Básica */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* 1. General & Estación */}
        <div className="bg-[#0d0d0d] border border-white/10 rounded-xl p-5 space-y-4 shadow-xl">
          <h2 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <Globe size={16} className="text-[#c80a19]" />
            Estación & Unidades
          </h2>

          <div className="space-y-3">
            {/* Nombre de la estación */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-white/50 uppercase tracking-wider">Nombre de la Estación Base</label>
              <input
                type="text"
                value={settings.stationName}
                onChange={(e) => setSettings({ ...settings, stationName: e.target.value })}
                className="w-full rounded-lg border border-white/15 bg-black/80 px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#c80a19] focus:border-[#c80a19] font-mono"
              />
            </div>

            {/* Unidad de Altitud */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-white/50 uppercase tracking-wider">Unidad de Altitud</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSettings({ ...settings, altitudeUnit: 'm' })}
                  className={`py-2 rounded-lg border text-xs font-bold uppercase transition-all cursor-pointer ${
                    settings.altitudeUnit === 'm'
                      ? 'bg-[#c80a19]/20 border-[#c80a19] text-white'
                      : 'bg-black/40 border-white/15 text-white/50 hover:text-white'
                  }`}
                >
                  Metros (m)
                </button>
                <button
                  onClick={() => setSettings({ ...settings, altitudeUnit: 'ft' })}
                  className={`py-2 rounded-lg border text-xs font-bold uppercase transition-all cursor-pointer ${
                    settings.altitudeUnit === 'ft'
                      ? 'bg-[#c80a19]/20 border-[#c80a19] text-white'
                      : 'bg-black/40 border-white/15 text-white/50 hover:text-white'
                  }`}
                >
                  Pies (ft)
                </button>
              </div>
            </div>

            {/* Unidad de Temperatura */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-white/50 uppercase tracking-wider">Unidad de Temperatura</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSettings({ ...settings, tempUnit: 'C' })}
                  className={`py-2 rounded-lg border text-xs font-bold uppercase transition-all cursor-pointer ${
                    settings.tempUnit === 'C'
                      ? 'bg-[#c80a19]/20 border-[#c80a19] text-white'
                      : 'bg-black/40 border-white/15 text-white/50 hover:text-white'
                  }`}
                >
                  Celsius (°C)
                </button>
                <button
                  onClick={() => setSettings({ ...settings, tempUnit: 'F' })}
                  className={`py-2 rounded-lg border text-xs font-bold uppercase transition-all cursor-pointer ${
                    settings.tempUnit === 'F'
                      ? 'bg-[#c80a19]/20 border-[#c80a19] text-white'
                      : 'bg-black/40 border-white/15 text-white/50 hover:text-white'
                  }`}
                >
                  Fahrenheit (°F)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Conexión Serie / Telemetría */}
        <div className="bg-[#0d0d0d] border border-white/10 rounded-xl p-5 space-y-4 shadow-xl">
          <h2 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <Radio size={16} className="text-[#38bdf8]" />
            Conexión LoRa Serie
          </h2>

          <div className="space-y-3">
            {/* Puerto COM */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-white/50 uppercase tracking-wider">Puerto COM Predeterminado</label>
              <select
                value={settings.port}
                onChange={(e) => setSettings({ ...settings, port: e.target.value })}
                className="w-full rounded-lg border border-white/15 bg-black/80 px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#38bdf8] focus:border-[#38bdf8] font-mono cursor-pointer"
              >
                <option value="COM1">COM1</option>
                <option value="COM2">COM2</option>
                <option value="COM3">COM3 (USB Serial)</option>
                <option value="COM4">COM4</option>
                <option value="/dev/ttyUSB0">/dev/ttyUSB0 (Linux)</option>
              </select>
            </div>

            {/* Baud Rate */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-white/50 uppercase tracking-wider">Velocidad (Baud Rate)</label>
              <select
                value={settings.baudRate}
                onChange={(e) => setSettings({ ...settings, baudRate: e.target.value })}
                className="w-full rounded-lg border border-white/15 bg-black/80 px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#38bdf8] focus:border-[#38bdf8] font-mono cursor-pointer"
              >
                <option value="9600">9600 bps</option>
                <option value="57600">57600 bps</option>
                <option value="115200">115200 bps (Recomendado)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3. Alertas y Sonido */}
        <div className="bg-[#0d0d0d] border border-white/10 rounded-xl p-5 space-y-4 shadow-xl md:col-span-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <Bell size={16} className="text-[#eab308]" />
            Notificaciones y Sonido
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Audio Toggle */}
            <div className="flex items-center justify-between p-3.5 bg-black/40 border border-white/10 rounded-xl">
              <div className="flex items-center gap-3">
                {settings.enableAudioAlerts ? <Volume2 size={18} className="text-[#eab308]" /> : <VolumeX size={18} className="text-white/40" />}
                <div>
                  <span className="text-xs font-bold text-white uppercase block">Alarmas Sonoras</span>
                  <span className="text-[10px] text-white/40">Emitir sonido en desconexión o pérdida de señal</span>
                </div>
              </div>
              <button
                onClick={() => setSettings({ ...settings, enableAudioAlerts: !settings.enableAudioAlerts })}
                className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer flex items-center ${
                  settings.enableAudioAlerts ? 'bg-[#eab308] justify-end' : 'bg-white/20 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-black shadow-md" />
              </button>
            </div>

            {/* Toast Notifications Toggle */}
            <div className="flex items-center justify-between p-3.5 bg-black/40 border border-white/10 rounded-xl">
              <div className="flex items-center gap-3">
                <Bell size={18} className="text-[#22c55e]" />
                <div>
                  <span className="text-xs font-bold text-white uppercase block">Notificaciones Flotantes</span>
                  <span className="text-[10px] text-white/40">Mostrar avisos emergentes en pantalla</span>
                </div>
              </div>
              <button
                onClick={() => setSettings({ ...settings, enableToastAlerts: !settings.enableToastAlerts })}
                className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer flex items-center ${
                  settings.enableToastAlerts ? 'bg-[#22c55e] justify-end' : 'bg-white/20 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-black shadow-md" />
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
