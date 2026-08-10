import React, { useState } from 'react';
import { useTelemetryData } from '../data/mockTelemetry';
import { Brain, Sparkles, AlertTriangle, Send } from 'lucide-react';

export const AIView = () => {
  const data = useTelemetryData();
  const [chat, setChat] = useState([
    { role: 'ai', text: 'Analizando telemetría entrante. Todos los sistemas nominales. Predicción de apogeo en T+300s a 4500m aprox.' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setChat([...chat, { role: 'user', text: input }]);
    const userMsg = input;
    setInput('');
    
    setTimeout(() => {
      let reply = 'He analizado tu solicitud, pero en este modo simulado mis capacidades son limitadas.';
      if (userMsg.toLowerCase().includes('altura') || userMsg.toLowerCase().includes('altitud')) {
        reply = `La altitud actual es ${data.altitude.bme.toFixed(1)}m. El diferencial con GPS es ${data.altitude.diff.toFixed(2)}m.`;
      } else if (userMsg.toLowerCase().includes('anomalia') || userMsg.toLowerCase().includes('error')) {
        reply = 'No se detectan anomalías críticas. La MicroSD está al 75% de capacidad, sugerimos monitoreo.';
      }
      
      setChat(prev => [...prev, { role: 'ai', text: reply }]);
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col gap-6 pb-20">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-purple-500/20 rounded-lg">
          <Brain className="text-purple-500" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-title">Asistente IA de Misión</h1>
          <p className="text-white/50 text-sm mt-1">Análisis automatizado y consultas en lenguaje natural</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Panel Izquierdo: Resumen Automático */}
        <div className="flex flex-col gap-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-md">
            <h3 className="text-white/70 font-semibold mb-4 uppercase tracking-wider text-sm flex items-center gap-2">
              <Sparkles size={16} className="text-purple-400" /> Evaluación Actual
            </h3>
            
            <div className="space-y-4">
              <div className="bg-purple-500/10 border border-purple-500/30 p-4 rounded-lg">
                <div className="text-purple-300 text-xs font-bold uppercase mb-1">Fase Estimada</div>
                <div className="text-xl font-bold text-white">ASCENSO NOMINAL</div>
                <div className="text-white/50 text-xs mt-2">Confianza: 98.5% basado en barómetro y acelerómetro.</div>
              </div>
              
              <div className="bg-[#22c55e]/10 border border-[#22c55e]/30 p-4 rounded-lg">
                <div className="text-[#22c55e] text-xs font-bold uppercase mb-1">Salud del Sistema</div>
                <div className="text-white text-sm">
                  La divergencia altimétrica (BME vs GPS) es de {data.altitude.diff.toFixed(2)}m, dentro de parámetros aceptables. Tasa de paquetes LoRa estable.
                </div>
              </div>
              
              <div className="bg-[#eab308]/10 border border-[#eab308]/30 p-4 rounded-lg">
                <div className="text-[#eab308] text-xs font-bold uppercase mb-1 flex items-center gap-1">
                  <AlertTriangle size={12} /> Observaciones
                </div>
                <ul className="list-disc pl-4 text-white/70 text-xs space-y-1 mt-1">
                  <li>Viento cruzado moderado detectado por drift GPS.</li>
                  <li>Uso de almacenamiento alto en MicroSD.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Panel Derecho: Chat interactivo */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-xl flex flex-col backdrop-blur-md overflow-hidden min-h-[350px] sm:min-h-[450px]">
          <div className="bg-black/40 border-b border-white/10 p-3.5 sm:p-4 flex items-center justify-between">
            <h3 className="text-white font-semibold text-xs sm:text-sm flex items-center gap-2">
              Chatbot de Telemetría
            </h3>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-6 space-y-4">
            {chat.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] sm:max-w-[80%] rounded-2xl p-3 sm:p-4 ${
                  msg.role === 'user' 
                    ? 'bg-[#015fb3] text-white rounded-br-none' 
                    : 'bg-white/10 text-white/90 rounded-bl-none border border-white/10'
                }`}>
                  <p className="text-xs sm:text-sm leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>
          
          <form onSubmit={handleSend} className="p-3 sm:p-4 bg-black/40 border-t border-white/10 flex gap-2 sm:gap-3">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pregunta sobre la misión, sensores, anomalías..."
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500 transition-colors"
            />
            <button 
              type="submit"
              className="bg-purple-600 hover:bg-purple-500 text-white p-2 w-9 sm:w-10 flex justify-center items-center rounded-lg transition-colors cursor-pointer shrink-0"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
