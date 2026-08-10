import React, { useState, useEffect } from 'react';

export const DashboardFooter = () => {
  const [utcTime, setUtcTime] = useState('00:00:00');

  useEffect(() => {
    const updateUTC = () => {
      const now = new Date();
      const h = now.getUTCHours().toString().padStart(2, '0');
      const m = now.getUTCMinutes().toString().padStart(2, '0');
      const s = now.getUTCSeconds().toString().padStart(2, '0');
      setUtcTime(`${h}:${m}:${s}`);
    };

    updateUTC();
    const interval = setInterval(updateUTC, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#0a0a0a] border-t border-[#c80a19]/15 px-6 py-3 flex items-center justify-between">
      {/* Left spacer */}
      <div className="flex-1" />

      {/* Center branding */}
      <div className="flex items-center gap-2 font-mono text-xs tracking-widest">
        <span className="text-white font-bold">ORBITEC</span>
        <span className="text-[#c80a19] font-bold">CANSAT</span>
        <span className="text-white/60 font-semibold">TEAM</span>
      </div>

      {/* Right UTC clock */}
      <div className="flex-1 flex justify-end">
        <div className="flex items-center gap-2 font-mono text-xs text-white/40">
          <span className="uppercase tracking-wider">UTC</span>
          <span className="text-white/70 font-bold tracking-widest">{utcTime}</span>
        </div>
      </div>
    </div>
  );
};
