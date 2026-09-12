import React, { useState } from 'react';
import { useTelemetryData } from '../data/mockTelemetry';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, GizmoHelper, GizmoViewport, Html, ContactShadows } from '@react-three/drei';
import { Box as BoxIcon, Eye, RotateCcw, Sliders, Compass, Play, Pause, Zap } from 'lucide-react';


import { CanSatAssembly } from '../widgets/CanSatAssembly';

export const ThreeDView = () => {
  const telemetryData = useTelemetryData();
  
  const [useManualSim, setUseManualSim] = useState(false);
  const [manualPitch, setManualPitch] = useState(0);
  const [manualRoll, setManualRoll] = useState(0);
  const [manualYaw, setManualYaw] = useState(0);
  const [wireframe, setWireframe] = useState(false);
  const [showInternalPcb, setShowInternalPcb] = useState(true);
  const [showAxes, setShowAxes] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);

  const orientation = useManualSim
    ? { pitch: manualPitch, roll: manualRoll, yaw: manualYaw }
    : telemetryData.orientation;

  const handleResetCamera = () => {
    setManualPitch(0);
    setManualRoll(0);
    setManualYaw(0);
  };

  return (
    <div className="h-full flex flex-col gap-4 pb-12 font-mono animate-in fade-in duration-300">
      
      {/* Banner de Cabecera 3D */}
      <div className="bg-[#0d0d0d] border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#eab308]/15 border border-[#eab308]/30 rounded-xl shadow-[0_0_15px_rgba(234,179,8,0.2)]">
            <BoxIcon className="text-[#eab308]" size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold font-title text-white tracking-wide uppercase">
              VISOR 3D DE ACTITUD (CANSAT)
            </h1>
            <p className="text-white/40 text-xs mt-0.5">Carcasa de panal · PCB superiores · tripulante sobre resortes</p>
          </div>
        </div>

        {/* Botones de Función Extra */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap text-[10px] sm:text-xs">
          <button
            onClick={() => setUseManualSim(!useManualSim)}
            className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border text-[10px] sm:text-xs font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
              useManualSim
                ? 'bg-[#eab308]/20 border-[#eab308] text-[#eab308]'
                : 'bg-white/5 border-white/15 text-white/70 hover:text-white'
            }`}
          >
            <Sliders size={12} />
            <span className="truncate">{useManualSim ? 'Modo Simulación Manual' : 'Seguir Telemetría Real'}</span>
          </button>

          <button
            onClick={() => setWireframe(!wireframe)}
            className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border text-[10px] sm:text-xs font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
              wireframe
                ? 'bg-[#38bdf8]/20 border-[#38bdf8] text-[#38bdf8]'
                : 'bg-white/5 border-white/15 text-white/70 hover:text-white'
            }`}
          >
            <Eye size={12} />
            Malla 3D
          </button>

          <button
            onClick={() => setShowAxes(!showAxes)}
            className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border text-[10px] sm:text-xs font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
              showAxes
                ? 'bg-[#22c55e]/20 border-[#22c55e] text-[#22c55e]'
                : 'bg-white/5 border-white/15 text-white/70 hover:text-white'
            }`}
          >
            <Compass size={12} />
            Ejes XYZ
          </button>

          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border text-[10px] sm:text-xs font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer ${
              autoRotate
                ? 'bg-[#c80a19]/20 border-[#c80a19] text-[#c80a19]'
                : 'bg-white/5 border-white/15 text-white/70 hover:text-white'
            }`}
          >
            {autoRotate ? <Pause size={12} /> : <Play size={12} />}
            Auto-Giro
          </button>
        </div>
      </div>

      {/* Grid Principal: Visor 3D + Controles de Simulación Lateral */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 flex-1">
        
        {/* Contenedor Canvas 3D */}
        <div className="lg:col-span-3 rounded-xl overflow-hidden border border-white/10 relative bg-[#07070a] min-h-[350px] sm:min-h-[440px] lg:min-h-[480px] flex flex-col justify-between shadow-2xl">
          
          {/* Overlay de Telemetría Flotante Superior */}
          <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 z-10 flex gap-1.5 sm:gap-3 pointer-events-none flex-wrap max-w-[calc(100%-1rem)]">
            <div className="bg-[#0d0d0d]/90 backdrop-blur-md border border-[#ef4444]/40 rounded-xl p-2 sm:p-3 text-xs font-mono shadow-2xl flex flex-col gap-0.5 min-w-[75px] sm:min-w-[90px]">
              <span className="text-[#ef4444] text-[8px] sm:text-[9px] uppercase font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" /> Pitch (X)
              </span>
              <span className="font-bold text-white text-xs sm:text-base">{orientation.pitch.toFixed(2)}°</span>
            </div>

            <div className="bg-[#0d0d0d]/90 backdrop-blur-md border border-[#38bdf8]/40 rounded-xl p-2 sm:p-3 text-xs font-mono shadow-2xl flex flex-col gap-0.5 min-w-[75px] sm:min-w-[90px]">
              <span className="text-[#38bdf8] text-[8px] sm:text-[9px] uppercase font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]" /> Roll (Z)
              </span>
              <span className="font-bold text-white text-xs sm:text-base">{orientation.roll.toFixed(2)}°</span>
            </div>

            <div className="bg-[#0d0d0d]/90 backdrop-blur-md border border-[#eab308]/40 rounded-xl p-2 sm:p-3 text-xs font-mono shadow-2xl flex flex-col gap-0.5 min-w-[75px] sm:min-w-[90px]">
              <span className="text-[#eab308] text-[8px] sm:text-[9px] uppercase font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#eab308]" /> Yaw (Y)
              </span>
              <span className="font-bold text-white text-xs sm:text-base">{orientation.yaw.toFixed(2)}°</span>
            </div>
          </div>

          {/* Indicación en el pie */}
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 text-white/40 text-[9px] sm:text-[10px] font-mono pointer-events-none bg-[#0d0d0d]/80 backdrop-blur-md border border-white/10 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg flex items-center gap-1.5 sm:gap-2">
            <Zap size={12} className="text-[#eab308]" />
            <span className="hidden sm:inline">Click izq: Orbitar • Click der: Desplazar • Scroll: Zoom</span>
            <span className="inline sm:hidden">1 dedo: Orbitar • 2 dedos: Zoom</span>
          </div>

          {/* Escena Canvas 3D Iluminada */}
          <Canvas camera={{ position: [3.1, 1.8, 5.5], fov: 45 }}>
            <ambientLight intensity={.85} />
            <directionalLight position={[10, 15, 10]} intensity={2} />
            <directionalLight position={[-10, 10, -10]} intensity={1.1} />
            <directionalLight position={[0, -10, 5]} intensity={1.2} />
            <pointLight position={[5, 5, 5]} intensity={1.5} />
            <spotLight position={[0, 10, 0]} intensity={1.5} color="#ffffff" />
            
            {/* Modelo CanSat Limpio */}
            <CanSatAssembly
              orientation={orientation} 
              wireframe={wireframe} 
              showInternalPcb={showInternalPcb}
              showAxes={showAxes}
            />
            
            <ContactShadows position={[0, -2, 0]} opacity={0.7} scale={10} blur={1.5} far={4} color="#000000" />
            
            <Grid position={[0, -1.65, 0]}
              infiniteGrid 
              fadeDistance={25} 
              sectionColor="#40546a" 
              cellColor="#34404c" 
              cellThickness={0.5} 
              sectionThickness={1.2}
              fadeStrength={1}
            />
            
            <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
              <GizmoViewport axisColors={['#ef4444', '#eab308', '#38bdf8']} labelColor="#ffffff" />
            </GizmoHelper>

            <OrbitControls makeDefault autoRotate={autoRotate} autoRotateSpeed={2.5} />
          </Canvas>
        </div>

        {/* Panel Lateral de Controles de Simulación y Opciones */}
        <div className="lg:col-span-1 bg-[#0d0d0d] border border-white/10 rounded-xl p-5 flex flex-col justify-between gap-5 shadow-2xl">
          
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <Sliders size={15} className="text-[#eab308]" />
              Prueba Manual de Orientación
            </h2>

            {/* Slider Pitch */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#ef4444] font-bold">Pitch (X - Inclinación)</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="-180"
                    max="180"
                    step="0.1"
                    value={manualPitch}
                    disabled={!useManualSim}
                    onChange={(e) => {
                      if (!useManualSim) setUseManualSim(true);
                      setManualPitch(Number(e.target.value));
                    }}
                    className="w-16 bg-black/80 border border-[#ef4444]/40 focus:border-[#ef4444] focus:outline-none text-right px-1.5 py-0.5 rounded text-xs font-mono font-bold text-white disabled:opacity-40 transition-all"
                  />
                  <span className="text-white/60 font-bold">°</span>
                </div>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                value={manualPitch}
                disabled={!useManualSim}
                onChange={(e) => setManualPitch(Number(e.target.value))}
                className="w-full accent-[#ef4444] bg-black/60 rounded-lg cursor-pointer disabled:opacity-30"
              />
            </div>

            {/* Slider Roll */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#38bdf8] font-bold">Roll (Z - Alabeo)</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="-180"
                    max="180"
                    step="0.1"
                    value={manualRoll}
                    disabled={!useManualSim}
                    onChange={(e) => {
                      if (!useManualSim) setUseManualSim(true);
                      setManualRoll(Number(e.target.value));
                    }}
                    className="w-16 bg-black/80 border border-[#38bdf8]/40 focus:border-[#38bdf8] focus:outline-none text-right px-1.5 py-0.5 rounded text-xs font-mono font-bold text-white disabled:opacity-40 transition-all"
                  />
                  <span className="text-white/60 font-bold">°</span>
                </div>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                value={manualRoll}
                disabled={!useManualSim}
                onChange={(e) => setManualRoll(Number(e.target.value))}
                className="w-full accent-[#38bdf8] bg-black/60 rounded-lg cursor-pointer disabled:opacity-30"
              />
            </div>

            {/* Slider Yaw */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#eab308] font-bold">Yaw (Y - Azimut)</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="360"
                    step="0.1"
                    value={manualYaw}
                    disabled={!useManualSim}
                    onChange={(e) => {
                      if (!useManualSim) setUseManualSim(true);
                      setManualYaw(Number(e.target.value));
                    }}
                    className="w-16 bg-black/80 border border-[#eab308]/40 focus:border-[#eab308] focus:outline-none text-right px-1.5 py-0.5 rounded text-xs font-mono font-bold text-white disabled:opacity-40 transition-all"
                  />
                  <span className="text-white/60 font-bold">°</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={manualYaw}
                disabled={!useManualSim}
                onChange={(e) => setManualYaw(Number(e.target.value))}
                className="w-full accent-[#eab308] bg-black/60 rounded-lg cursor-pointer disabled:opacity-30"
              />
            </div>

            <button
              onClick={handleResetCamera}
              disabled={!useManualSim}
              className="w-full py-2 bg-white/5 border border-white/10 rounded-lg text-white/70 hover:text-white hover:bg-white/10 text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-30"
            >
              <RotateCcw size={13} />
              Reset Ángulos a 0°
            </button>
          </div>

          {/* Opciones de Capas Visuales */}
          <div className="border-t border-white/10 pt-4 space-y-3">
            <h3 className="text-[11px] font-bold uppercase text-white/60">Componentes 3D Visibles</h3>
            
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/70">Ver interior (ocultar carcasa)</span>
              <button
                onClick={() => setShowInternalPcb(!showInternalPcb)}
                className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer flex items-center ${
                  showInternalPcb ? 'bg-[#22c55e] justify-end' : 'bg-white/20 justify-start'
                }`}
              >
                <div className="w-3.5 h-3.5 rounded-full bg-black shadow-md" />
              </button>
            </div>
          </div>

          <p className="text-[10px] leading-relaxed text-white/40">Modelo ilustrativo del montaje. El huevo representa al tripulante; los resortes muestran el soporte amortiguado, sin cálculo físico de impactos.</p>

          {/* Estado de Entrada */}
          <div className="bg-black/60 border border-white/10 p-3 rounded-lg text-[10px] space-y-1">
            <span className="text-white/40 uppercase block font-bold">Fuente de Datos 3D</span>
            <span className={`font-bold block ${useManualSim ? 'text-[#eab308]' : 'text-[#22c55e]'}`}>
              {useManualSim ? '● SIMULADOR MANUAL ACTIVO' : '● ORIENTACIÓN DE LA TELEMETRÍA'}
            </span>
          </div>

        </div>

      </div>

    </div>
  );
};
