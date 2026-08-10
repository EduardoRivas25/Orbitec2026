import React, { useState, useEffect } from 'react';
import { Wifi, SignalHigh, Bell, User, LogOut } from 'lucide-react';

export const TopBar = () => {
  const [missionTime, setMissionTime] = useState(0); // T+ in seconds

  useEffect(() => {
    // Simular el tiempo de misión
    const interval = setInterval(() => {
      setMissionTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `T+ ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <header className="h-20 border-b border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-between px-6 z-10">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-full border border-white/10">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#22c55e]"></span>
          </span>
          <span className="font-title uppercase text-sm tracking-wider text-white">EN VUELO</span>
        </div>
        
        <div className="font-mono text-xl font-bold tracking-widest text-[#015fb3] drop-shadow-[0_0_8px_rgba(1,95,179,0.8)]">
          {formatTime(missionTime)}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 text-white/70 text-sm">
          <div className="flex items-center gap-2" title="Calidad LoRa (RSSI)">
            <SignalHigh size={18} className="text-[#22c55e]" />
            <span>-85 dBm</span>
          </div>
          <div className="flex items-center gap-2" title="Satélites GPS">
            <Wifi size={18} className="text-[#22c55e]" />
            <span>9 SAT</span>
          </div>
        </div>
        
        <div className="w-px h-8 bg-white/10"></div>
        
        <button className="relative p-2 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#c80a19] rounded-full"></span>
        </button>
        
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium">Comandante</span>
            <span className="text-xs text-white/50">Estación Base Alpha</span>
          </div>
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#015fb3] to-[#c80a19] flex items-center justify-center p-0.5">
            <div className="w-full h-full bg-[#000004] rounded-full flex items-center justify-center">
              <User size={18} className="text-white/80" />
            </div>
          </div>
          <a 
            href="/"
            className="ml-2 p-2 text-white/50 hover:text-[#c80a19] transition-colors rounded-full hover:bg-white/10"
            title="Cerrar Sesión"
          >
            <LogOut size={20} />
          </a>
        </div>
      </div>
    </header>
  );
};
