import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Key, 
  Save, 
  CheckCircle2, 
  Award,
  Camera,
  Radio,
  Lock,
  BadgeCheck,
  Zap,
  Sparkles
} from 'lucide-react';

export interface UserProfile {
  fullName: string;
  role: string;
  email: string;
  accessLevel: string;
}

const DEFAULT_PROFILE: UserProfile = {
  fullName: 'Comandante de Misión',
  role: 'Director de Vuelo & Telemetría',
  email: 'comandante@orbitec.space',
  accessLevel: 'Administrador de Estación Terrena',
};

export const ProfileView: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('orbitec_cansat_profile');
      if (saved) {
        setProfile(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error al cargar perfil', e);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleSaveProfile = () => {
    try {
      localStorage.setItem('orbitec_cansat_profile', JSON.stringify(profile));
      showToast('¡Perfil de comandante guardado con éxito!');
    } catch (e) {
      showToast('Error al guardar el perfil');
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      showToast('Ingrese su contraseña actual');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Las contraseñas nuevas no coinciden');
      return;
    }
    if (newPassword.length < 6) {
      showToast('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast('¡Contraseña de acceso actualizada correctamente!');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-mono animate-in fade-in duration-300 pb-16">
      
      {/* Toast Flotante */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0d0d0d]/95 border border-[#22c55e]/50 text-[#22c55e] px-4 py-3 rounded-xl shadow-[0_0_25px_rgba(34,197,94,0.3)] flex items-center gap-3 backdrop-blur-xl animate-in slide-in-from-bottom-3 duration-300">
          <CheckCircle2 size={18} className="shrink-0 text-[#22c55e]" />
          <span className="text-xs font-bold font-mono tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-[#0d0d0d] border border-white/10 p-4 sm:p-5 rounded-xl backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 sm:p-3 bg-black/60 border border-white/10 rounded-xl">
            <User className="text-[#015fb3]" size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold font-title text-white uppercase tracking-wider">
                AJUSTES DE PERFIL
              </h1>
              <span className="px-2 py-0.5 bg-[#22c55e]/15 border border-[#22c55e]/30 text-[#22c55e] text-[9px] font-bold rounded-full uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" /> Activo
              </span>
            </div>
            <p className="text-white/40 text-[11px] sm:text-xs mt-0.5">Perfil de Operador y Credenciales de Acceso</p>
          </div>
        </div>

        <button
          onClick={handleSaveProfile}
          className="relative z-10 flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#c80a19] via-[#8b0712] to-[#015fb3] border border-white/20 text-white text-xs font-bold uppercase transition-all shadow-[0_0_15px_rgba(200,10,25,0.3)] hover:shadow-[0_0_25px_rgba(200,10,25,0.5)] cursor-pointer hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
        >
          <Save size={16} />
          <span>Guardar Cambios</span>
        </button>
      </div>

      {/* Grid Principal: Ficha de Perfil + Formularios */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Tarjeta de Identificación del Comandante (Columna Izquierda) */}
        <div className="lg:col-span-1 bg-[#0d0d0d] border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center justify-between gap-5 shadow-2xl relative overflow-hidden group">
          
          {/* Fondo degradado futurista */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#015fb3]/10 via-transparent to-[#c80a19]/10 opacity-50" />

          {/* Avatar con doble aro de luz */}
          <div className="relative cursor-pointer mt-2 z-10">
            <div className="h-28 w-28 rounded-full bg-gradient-to-tr from-[#c80a19] via-[#015fb3] to-[#38bdf8] p-1 shadow-[0_0_30px_rgba(200,10,25,0.35)] transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full bg-[#0a0a0a] rounded-full flex items-center justify-center relative overflow-hidden">
                <User size={52} className="text-white/80" />
                <div className="absolute inset-0 bg-black/70 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 backdrop-blur-xs">
                  <Camera size={22} className="text-[#38bdf8]" />
                  <span className="text-[8px] uppercase font-bold text-white tracking-wider">Cambiar Foto</span>
                </div>
              </div>
            </div>
            <div className="absolute bottom-1 right-1 p-1.5 bg-[#22c55e] rounded-full border-2 border-[#0d0d0d] shadow-lg">
              <BadgeCheck size={14} className="text-black" />
            </div>
          </div>

          <div className="relative z-10 space-y-1">
            <h2 className="text-lg font-bold text-white font-title uppercase tracking-wide flex items-center justify-center gap-1.5">
              {profile.fullName}
            </h2>
            <p className="text-xs text-[#38bdf8] font-bold tracking-wider">{profile.role}</p>
            <p className="text-[10px] text-white/40 font-mono mt-0.5">{profile.email}</p>
          </div>

          {/* Tarjetas Informativas de Estado */}
          <div className="w-full border-t border-white/10 pt-4 space-y-2.5 text-left text-[11px] relative z-10">
            <div className="flex items-center justify-between p-2.5 bg-black/50 border border-white/10 rounded-xl">
              <span className="text-white/50 uppercase text-[10px]">Nivel de Acceso</span>
              <span className="text-[#22c55e] font-bold text-[10px] bg-[#22c55e]/15 px-2 py-0.5 rounded border border-[#22c55e]/30">OPERADOR N1</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-black/50 border border-white/10 rounded-xl">
              <span className="text-white/50 uppercase text-[10px]">Estación Base</span>
              <span className="text-white font-mono text-[10px] font-bold">ALPHA-01</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-black/50 border border-white/10 rounded-xl">
              <span className="text-white/50 uppercase text-[10px]">Enlace Terreno</span>
              <span className="text-[#38bdf8] font-bold text-[10px] flex items-center gap-1">
                <Radio size={12} className="text-[#38bdf8]" /> AUTENTICADO
              </span>
            </div>
          </div>

          <div className="w-full text-[9px] text-white/30 font-mono text-center border-t border-white/10 pt-3 relative z-10">
            ID CREDENCIAL: <span className="text-white/60 font-bold">ORB-2026-CMD-88</span>
          </div>

        </div>

        {/* Formularios de Edición (Columna Derecha) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Formulario 1: Información Personal */}
          <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl p-6 space-y-5 shadow-2xl relative overflow-hidden">
            
            <div className="border-b border-white/10 pb-4 flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2.5">
                <div className="p-2 bg-[#015fb3]/20 border border-[#015fb3]/40 rounded-lg">
                  <ShieldCheck size={16} className="text-[#015fb3]" />
                </div>
                Información Personal de Operador
              </h2>
              <span className="text-[10px] text-white/40 uppercase">Datos Generales</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nombre completo */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-white/50 uppercase tracking-wider">Nombre Completo</label>
                <div className="relative">
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    className="w-full rounded-xl border border-white/15 bg-black/80 pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#015fb3]/50 focus:border-[#015fb3] transition-all font-mono shadow-inner"
                  />
                  <User size={15} className="absolute left-3.5 top-3 text-white/40" />
                </div>
              </div>

              {/* Cargo / Rol */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-white/50 uppercase tracking-wider">Cargo / Rol en la Misión</label>
                <div className="relative">
                  <input
                    type="text"
                    value={profile.role}
                    onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                    className="w-full rounded-xl border border-white/15 bg-black/80 pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#015fb3]/50 focus:border-[#015fb3] transition-all font-mono shadow-inner"
                  />
                  <Award size={15} className="absolute left-3.5 top-3 text-white/40" />
                </div>
              </div>

              {/* Correo Electrónico */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[10px] font-semibold text-white/50 uppercase tracking-wider">Correo Electrónico de Contacto</label>
                <div className="relative">
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full rounded-xl border border-white/15 bg-black/80 pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#015fb3]/50 focus:border-[#015fb3] transition-all font-mono shadow-inner"
                  />
                  <Mail size={15} className="absolute left-3.5 top-3 text-white/40" />
                </div>
              </div>
            </div>
          </div>

          {/* Formulario 2: Cambiar Contraseña */}
          <form onSubmit={handleChangePassword} className="bg-[#0d0d0d] border border-white/10 rounded-2xl p-6 space-y-5 shadow-2xl">
            
            <div className="border-b border-white/10 pb-4 flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2.5">
                <div className="p-2 bg-[#c80a19]/20 border border-[#c80a19]/40 rounded-lg">
                  <Key size={16} className="text-[#c80a19]" />
                </div>
                Seguridad y Clave de Acceso
              </h2>
              <span className="text-[10px] text-white/40 uppercase">Encriptación SSL</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-white/50 uppercase tracking-wider">Contraseña Actual</label>
                <div className="relative">
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-white/15 bg-black/80 pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#c80a19]/50 focus:border-[#c80a19] transition-all font-mono shadow-inner"
                  />
                  <Lock size={14} className="absolute left-3 top-3 text-white/40" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-white/50 uppercase tracking-wider">Nueva Contraseña</label>
                <div className="relative">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-white/15 bg-black/80 pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#c80a19]/50 focus:border-[#c80a19] transition-all font-mono shadow-inner"
                  />
                  <Lock size={14} className="absolute left-3 top-3 text-white/40" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-white/50 uppercase tracking-wider">Confirmar Clave</label>
                <div className="relative">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-white/15 bg-black/80 pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#c80a19]/50 focus:border-[#c80a19] transition-all font-mono shadow-inner"
                  />
                  <Lock size={14} className="absolute left-3 top-3 text-white/40" />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-[#c80a19] to-[#8b0712] border border-[#c80a19]/50 text-white rounded-xl text-xs font-bold uppercase transition-all shadow-[0_0_15px_rgba(200,10,25,0.3)] hover:shadow-[0_0_20px_rgba(200,10,25,0.5)] cursor-pointer"
              >
                Actualizar Contraseña
              </button>
            </div>
          </form>

        </div>

      </div>

    </div>
  );
};
