import React, { useState, useRef } from 'react';
import { useTelemetryData } from '../data/mockTelemetry';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, GizmoHelper, GizmoViewport, Html, ContactShadows } from '@react-three/drei';
import { Box as BoxIcon, Eye, RotateCcw, Sliders, Compass, Play, Pause, Zap } from 'lucide-react';
import * as THREE from 'three';

interface CanSatModelProps {
  orientation: { pitch: number; roll: number; yaw: number };
  wireframe: boolean;
  showInternalPcb: boolean;
  showAxes: boolean;
}

// Modelo 3D Limpio y Profesional de CanSat (Cilindro con Tapas y Ejes)
const CleanCanSatModel = ({ orientation, wireframe, showInternalPcb, showAxes }: CanSatModelProps) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      const pitchRad = THREE.MathUtils.degToRad(orientation.pitch);
      const rollRad = THREE.MathUtils.degToRad(orientation.roll);
      const yawRad = THREE.MathUtils.degToRad(orientation.yaw);
      groupRef.current.rotation.set(pitchRad, yawRad, rollRad, 'YXZ');
    }
  });

  return (
    <group ref={groupRef}>
      
      {/* 1. CILINDRO PRINCIPAL DEL CANSAT (Aluminio Plateado con transparencia si se muestran las PCB) */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.7, 0.7, 2.2, 32]} />
        <meshPhysicalMaterial 
          color="#cbd5e1" 
          roughness={0.15} 
          metalness={0.9} 
          wireframe={wireframe}
          transparent={showInternalPcb}
          opacity={showInternalPcb ? 0.38 : 1.0}
          transmission={showInternalPcb ? 0.4 : 0.0}
        />
      </mesh>

      {/* 2. TAPA SUPERIOR ROJA (Aluminio Anodizado Rojo ORBITEC) */}
      <mesh position={[0, 1.13, 0]}>
        <cylinderGeometry args={[0.73, 0.73, 0.08, 32]} />
        <meshStandardMaterial 
          color="#c80a19" 
          metalness={0.8} 
          roughness={0.2} 
          wireframe={wireframe} 
        />
      </mesh>

      {/* 3. TAPA INFERIOR ROJA (Aluminio Anodizado Rojo ORBITEC) */}
      <mesh position={[0, -1.13, 0]}>
        <cylinderGeometry args={[0.73, 0.73, 0.08, 32]} />
        <meshStandardMaterial 
          color="#c80a19" 
          metalness={0.8} 
          roughness={0.2} 
          wireframe={wireframe} 
        />
      </mesh>

      {/* Rieles de Unión Metálicos (Líneas divisorias estéticas en los costados) */}
      {[0, 90, 180, 270].map((angle, index) => {
        const rad = THREE.MathUtils.degToRad(angle);
        const x = 0.71 * Math.cos(rad);
        const z = 0.71 * Math.sin(rad);
        return (
          <mesh key={index} position={[x, 0, z]}>
            <cylinderGeometry args={[0.015, 0.015, 2.2, 16]} />
            <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.1} />
          </mesh>
        );
      })}

      {/* 4. ANTENA SUPERIOR & ANILLO DE PARACAÍDAS */}
      <mesh position={[0, 1.22, 0]}>
        <torusGeometry args={[0.15, 0.02, 16, 32]} />
        <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, 1.65, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.8, 16]} />
        <meshStandardMaterial color="#0f172a" metalness={0.5} />
      </mesh>

      {/* 5. INDICADOR DE FRENTE / PROA (Bloque de Dirección Cyan) */}
      <mesh position={[0, 0, 0.73]}>
        <boxGeometry args={[0.12, 0.4, 0.04]} />
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.6} />
      </mesh>

      {/* 6. ELECTRÓNICA INTERNA APILADA EN 4 PISOS (PCB Stack de 4 capas) */}
      {showInternalPcb && (
        <group>
          {/* Pilares Separadores de Latón Dorado (Brass Standoffs) que unen las 4 placas */}
          {[
            [0.35, 0.35],
            [-0.35, 0.35],
            [0.35, -0.35],
            [-0.35, -0.35],
          ].map(([sx, sz], i) => (
            <mesh key={`standoff-${i}`} position={[sx, 0, sz]}>
              <cylinderGeometry args={[0.02, 0.02, 1.45, 16]} />
              <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.1} />
            </mesh>
          ))}

          {/* PISO 1 (Superior Y = 0.65): Módulo Radio LoRa & Antena */}
          <group position={[0, 0.65, 0]}>
            {/* Placa PCB Verde */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.58, 0.58, 0.03, 32]} />
              <meshStandardMaterial color="#15803d" roughness={0.3} metalness={0.2} />
            </mesh>
            {/* Caja de Blindaje LoRa RF metálica */}
            <mesh position={[0, 0.04, 0]}>
              <boxGeometry args={[0.35, 0.05, 0.35]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.1} />
            </mesh>
            {/* LED Azul LoRa */}
            <mesh position={[0.2, 0.05, 0]}>
              <sphereGeometry args={[0.025, 16, 16]} />
              <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.5} />
            </mesh>
          </group>

          {/* PISO 2 (Procesador Y = 0.22): Microcontrolador ESP32 */}
          <group position={[0, 0.22, 0]}>
            {/* Placa PCB Verde */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.58, 0.58, 0.03, 32]} />
              <meshStandardMaterial color="#15803d" roughness={0.3} metalness={0.2} />
            </mesh>
            {/* Chip ESP32 */}
            <mesh position={[0, 0.04, 0]}>
              <boxGeometry args={[0.3, 0.05, 0.45]} />
              <meshStandardMaterial color="#1e293b" roughness={0.4} />
            </mesh>
            {/* Chip Memoria Flash SD */}
            <mesh position={[-0.2, 0.04, 0]}>
              <boxGeometry args={[0.15, 0.03, 0.2]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} />
            </mesh>
          </group>

          {/* PISO 3 (Sensores Y = -0.22): Sensor IMU BNO055 & Presión */}
          <group position={[0, -0.22, 0]}>
            {/* Placa PCB Verde */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.58, 0.58, 0.03, 32]} />
              <meshStandardMaterial color="#15803d" roughness={0.3} metalness={0.2} />
            </mesh>
            {/* Módulo BNO055 */}
            <mesh position={[0.15, 0.04, 0.15]}>
              <boxGeometry args={[0.18, 0.04, 0.18]} />
              <meshStandardMaterial color="#0284c7" emissive="#0284c7" emissiveIntensity={0.4} />
            </mesh>
            {/* LED Verde IMU */}
            <mesh position={[0.22, 0.06, 0.22]}>
              <sphereGeometry args={[0.025, 16, 16]} />
              <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={1.5} />
            </mesh>
            {/* Sensor BME280 */}
            <mesh position={[-0.15, 0.04, -0.15]}>
              <boxGeometry args={[0.12, 0.03, 0.12]} />
              <meshStandardMaterial color="#a855f7" metalness={0.7} />
            </mesh>
          </group>

          {/* PISO 4 (Energía Y = -0.65): Regulador PDB & Batería LiPo */}
          <group position={[0, -0.65, 0]}>
            {/* Placa PCB Verde PDB */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.58, 0.58, 0.03, 32]} />
              <meshStandardMaterial color="#15803d" roughness={0.3} metalness={0.2} />
            </mesh>
            {/* Batería Li-Ion Cilíndrica Amarilla */}
            <mesh position={[0, -0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.22, 0.22, 0.7, 24]} />
              <meshStandardMaterial color="#eab308" metalness={0.6} roughness={0.3} />
            </mesh>
          </group>
        </group>
      )}

      {/* 7. VECTORES DE EJES X, Y, Z CON ETIQUETAS FLOTANTES EN 3D */}
      {showAxes && (
        <group>
          {/* EJE X (Rojo - Pitch) */}
          <group position={[1.4, 0, 0]}>
            <arrowHelper args={[new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 0.6, 0xef4444, 0.2, 0.1]} />
            <Html position={[0.4, 0.1, 0]} center>
              <div className="bg-[#ef4444]/20 border border-[#ef4444] text-[#ef4444] text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur-md">
                EJE X (PITCH)
              </div>
            </Html>
          </group>

          {/* EJE Y (Amarillo - Yaw) */}
          <group position={[0, 1.8, 0]}>
            <arrowHelper args={[new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 0.6, 0xeab308, 0.2, 0.1]} />
            <Html position={[0, 0.4, 0]} center>
              <div className="bg-[#eab308]/20 border border-[#eab308] text-[#eab308] text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur-md">
                EJE Y (YAW)
              </div>
            </Html>
          </group>

          {/* EJE Z (Azul - Roll) */}
          <group position={[0, 0, 1.4]}>
            <arrowHelper args={[new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 0.6, 0x38bdf8, 0.2, 0.1]} />
            <Html position={[0, 0.1, 0.4]} center>
              <div className="bg-[#38bdf8]/20 border border-[#38bdf8] text-[#38bdf8] text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur-md">
                EJE Z (ROLL)
              </div>
            </Html>
          </group>
        </group>
      )}

    </group>
  );
};

export const ThreeDView = () => {
  const telemetryData = useTelemetryData();
  
  const [useManualSim, setUseManualSim] = useState(false);
  const [manualPitch, setManualPitch] = useState(0);
  const [manualRoll, setManualRoll] = useState(0);
  const [manualYaw, setManualYaw] = useState(0);
  const [wireframe, setWireframe] = useState(false);
  const [showInternalPcb, setShowInternalPcb] = useState(true);
  const [showAxes, setShowAxes] = useState(true);
  const [autoRotate, setAutoRotate] = useState(false);

  const orientation = useManualSim
    ? { pitch: manualPitch, roll: manualRoll, yaw: manualYaw }
    : telemetryData.orientation;

  const getQuaternions = () => {
    const p = THREE.MathUtils.degToRad(orientation.pitch);
    const r = THREE.MathUtils.degToRad(orientation.roll);
    const y = THREE.MathUtils.degToRad(orientation.yaw);
    const euler = new THREE.Euler(p, y, r, 'YXZ');
    const q = new THREE.Quaternion().setFromEuler(euler);
    return {
      w: q.w.toFixed(3),
      x: q.x.toFixed(3),
      y: q.y.toFixed(3),
      z: q.z.toFixed(3),
    };
  };

  const quat = getQuaternions();

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
            <p className="text-white/40 text-xs mt-0.5">Cilindro de orientación tridimensional e inclinación IMU</p>
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

          {/* Cuaterniones Flotantes */}
          <div className="absolute top-4 right-4 z-10 bg-[#0d0d0d]/90 backdrop-blur-md border border-white/10 rounded-xl p-3 text-[10px] font-mono text-white/70 shadow-2xl hidden md:flex flex-col gap-1">
            <span className="text-[9px] font-bold text-white/40 uppercase tracking-wider border-b border-white/10 pb-1">Cuaternión IMU</span>
            <div className="grid grid-cols-4 gap-2 font-bold text-white">
              <span>w: <span className="text-[#eab308]">{quat.w}</span></span>
              <span>x: <span className="text-[#ef4444]">{quat.x}</span></span>
              <span>y: <span className="text-[#22c55e]">{quat.y}</span></span>
              <span>z: <span className="text-[#38bdf8]">{quat.z}</span></span>
            </div>
          </div>

          {/* Indicación en el pie */}
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 text-white/40 text-[9px] sm:text-[10px] font-mono pointer-events-none bg-[#0d0d0d]/80 backdrop-blur-md border border-white/10 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg flex items-center gap-1.5 sm:gap-2">
            <Zap size={12} className="text-[#eab308]" />
            <span className="hidden sm:inline">Click izq: Orbitar • Click der: Desplazar • Scroll: Zoom</span>
            <span className="inline sm:hidden">1 dedo: Orbitar • 2 dedos: Zoom</span>
          </div>

          {/* Escena Canvas 3D Iluminada */}
          <Canvas camera={{ position: [3.5, 2.5, 4.5], fov: 45 }}>
            <ambientLight intensity={1.8} />
            <directionalLight position={[10, 15, 10]} intensity={2.5} />
            <directionalLight position={[-10, 10, -10]} intensity={1.8} />
            <directionalLight position={[0, -10, 5]} intensity={1.2} />
            <pointLight position={[5, 5, 5]} intensity={1.5} />
            <spotLight position={[0, 10, 0]} intensity={1.5} color="#ffffff" />
            
            {/* Modelo CanSat Limpio */}
            <CleanCanSatModel 
              orientation={orientation} 
              wireframe={wireframe} 
              showInternalPcb={showInternalPcb}
              showAxes={showAxes}
            />
            
            <ContactShadows position={[0, -2, 0]} opacity={0.7} scale={10} blur={1.5} far={4} color="#000000" />
            
            <Grid 
              infiniteGrid 
              fadeDistance={25} 
              sectionColor="#c80a19" 
              cellColor="#ffffff" 
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
              <span className="text-white/70">Placa Electrónica PCB Interna</span>
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

          {/* Estado de Entrada */}
          <div className="bg-black/60 border border-white/10 p-3 rounded-lg text-[10px] space-y-1">
            <span className="text-white/40 uppercase block font-bold">Fuente de Datos 3D</span>
            <span className={`font-bold block ${useManualSim ? 'text-[#eab308]' : 'text-[#22c55e]'}`}>
              {useManualSim ? '● SIMULADOR MANUAL ACTIVO' : '● SENSOR IMU BNO055 EN TIEMPO REAL'}
            </span>
          </div>

        </div>

      </div>

    </div>
  );
};
