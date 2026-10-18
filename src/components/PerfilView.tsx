import React, { useState } from 'react';
import { UserProfile, UserRole, NavTab } from '../types';

interface PerfilViewProps {
  currentUser: UserProfile | null;
  prayedBlocksCount: number;
  savedEntriesCount: number;
  onNavigateTab: (tab: NavTab) => void;
  onLoginWithGoogle: (email: string, displayName: string) => void;
  onLoginWithFirebaseGoogle?: () => Promise<void>;
  onUpdateUser: (updated: UserProfile) => void;
  onLogout: () => void;
}

export const PerfilView: React.FC<PerfilViewProps> = ({
  currentUser,
  prayedBlocksCount,
  savedEntriesCount,
  onNavigateTab,
  onLoginWithGoogle,
  onLoginWithFirebaseGoogle,
  onUpdateUser,
  onLogout
}) => {
  // Registration flow state
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [showGoogleModal, setShowGoogleModal] = useState<boolean>(false);
  const [googleEmailInput, setGoogleEmailInput] = useState<string>('');
  const [googleNameInput, setGoogleNameInput] = useState<string>('');

  // Form inputs for profile registration
  const [nombre, setNombre] = useState(currentUser?.nombre || '');
  const [apellido, setApellido] = useState(currentUser?.apellido || '');
  const [telefono, setTelefono] = useState(currentUser?.whatsapp || '');
  const [pais, setPais] = useState(currentUser?.pais || '');
  const [iglesia, setIglesia] = useState(currentUser?.iglesia || '');
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentUser?.rol || 'seguidor');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [authErrorMessage, setAuthErrorMessage] = useState<string | null>(null);

  // Trigger Google Login via Firebase OAuth Popup
  const handleOpenGoogleAuth = async () => {
    setAuthErrorMessage(null);
    if (onLoginWithFirebaseGoogle) {
      try {
        setIsGoogleLoading(true);
        await onLoginWithFirebaseGoogle();
      } catch (err: any) {
        console.warn('Firebase Google Auth error / popup blocked:', err);
        // Show fallback modal with account options
        setShowGoogleModal(true);
        if (err?.message) {
          setAuthErrorMessage(err.message);
        }
      } finally {
        setIsGoogleLoading(false);
      }
    } else {
      setShowGoogleModal(true);
    }
  };

  const handleConfirmGoogleLogin = (email: string, name: string) => {
    setShowGoogleModal(false);
    onLoginWithGoogle(email, name);

    // If it's the pastor, he is already root admin
    if (email.toLowerCase() === 'rvicentetapia@gmail.com') {
      return;
    }

    // Pre-populate name in registration form
    const parts = name.split(' ');
    setNombre(parts[0] || '');
    setApellido(parts.slice(1).join(' ') || '');
    setIsRegistering(true);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !nombre.trim() || !telefono.trim()) return;

    setIsSubmitting(true);

    const isSeguidor = selectedRole === 'seguidor';
    const isApproved = isSeguidor; // Seguidor: aprobado automático. Intercesor: espera aprobación pastoral.

    const updatedProfile: UserProfile = {
      ...currentUser,
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      whatsapp: telefono.trim(),
      pais: pais.trim(),
      iglesia: iglesia.trim(),
      rol: selectedRole,
      aprobado: isApproved,
      solicitud: isSeguidor ? undefined : 'intercesor',
      fechaRegistro: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    // Enviar notificación silenciosa por FormSubmit al correo del pastor rvicentetapia@gmail.com
    try {
      await fetch("https://formsubmit.co/ajax/rvicentetapia@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          _subject: `🔔 Nuevo Registro en MMM Turquía (${selectedRole.toUpperCase()}): ${updatedProfile.nombre} ${updatedProfile.apellido || ''} (${updatedProfile.pais})`,
          Nombre: updatedProfile.nombre,
          Apellido: updatedProfile.apellido,
          Telefono_WhatsApp: updatedProfile.whatsapp,
          Pais: updatedProfile.pais,
          Iglesia: updatedProfile.iglesia,
          Correo_Google: updatedProfile.email,
          Rol_Seleccionado: selectedRole,
          Estado_Aprobacion: isApproved ? 'Aprobado Automático (Seguidor)' : 'Pendiente de Aprobación Pastoral (Intercesor)',
          Accion_Pastoral: "Entra al Panel Admin para autorizar el acceso a la Intranet confidencial."
        })
      }).catch(() => {});
    } catch (err) {
      // ignore
    }

    onUpdateUser(updatedProfile);
    setIsSubmitting(false);
    setIsRegistering(false);
  };

  const handleOpenWhatsAppPastoral = () => {
    const texto = encodeURIComponent(
      `Paz de Dios pastor Ricardo. Saludos en Cristo. He completado mi registro en la web de MMM Turquía y solicito validación para el rol de INTERCESOR. Mi nombre es ${currentUser?.nombre || ''} ${currentUser?.apellido || ''} desde ${currentUser?.pais || ''}. ¡Dios le bendiga!`
    );
    window.open(`https://wa.me/51938204456?text=${texto}`, '_blank');
  };

  const handleCancelRegistration = () => {
    setIsRegistering(false);
    // Si el usuario no completó los datos obligatorios o cancela el registro,
    // se cierra la sesión actual para devolverlo inmediatamente al Acceso con Google
    if (!currentUser?.whatsapp) {
      onLogout();
    }
  };

  // =========================================================================
  // VISTA 1: ACCESO ÚNICO CON GOOGLE (Sin correo ni contraseña)
  // =========================================================================
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#131d33] border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1a365d] to-[#0e9594] text-white flex items-center justify-center mx-auto shadow-md">
          <span className="material-symbols-outlined text-[34px]">church</span>
        </div>

        <div className="space-y-2">
          <h2 className="font-serif-title text-2xl font-bold text-[#1a365d] dark:text-white">
            Intranet de Intercesión & Perfil
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Acceso exclusivo para creyentes e intercesores de la obra en Turquía. Ingresa o regístrate con tu cuenta de Google:
          </p>
        </div>

        {/* BOTÓN OFICIAL DE GOOGLE */}
        <button
          type="button"
          onClick={handleOpenGoogleAuth}
          disabled={isGoogleLoading}
          className="w-full py-3.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-100 font-bold text-sm flex items-center justify-center gap-3 shadow-xs hover:shadow-md transition-all active:scale-98 disabled:opacity-60"
        >
          {isGoogleLoading ? (
            <span className="w-5 h-5 border-2 border-[#0e9594] border-t-transparent rounded-full animate-spin" />
          ) : (
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              width="20"
              height="20"
              alt="Google"
            />
          )}
          <span>{isGoogleLoading ? 'Iniciando sesión con Google...' : 'Continuar con Google'}</span>
        </button>

        {authErrorMessage && (
          <p className="text-xs text-amber-500 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20 text-left">
            ℹ️ {authErrorMessage}
          </p>
        )}

        <p className="text-[11px] text-slate-400 dark:text-slate-500 pt-2">
          Sin contraseñas. Tu sesión queda protegida directamente por Google y Firebase Authentication.
        </p>

        {/* Modal para seleccionar / confirmar cuenta de Google */}
        {showGoogleModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl text-left">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    width="18"
                    height="18"
                    alt="Google"
                  />
                  <span className="font-bold text-xs text-slate-800 dark:text-white">Acceso con Google</span>
                </div>
                <button onClick={() => setShowGoogleModal(false)} className="text-slate-400 hover:text-slate-600">
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400">
                Selecciona una cuenta rápida o escribe tu cuenta de Google:
              </p>

              {/* Botón rápido del Pastor Administrador */}
              <button
                type="button"
                onClick={() => handleConfirmGoogleLogin('rvicentetapia@gmail.com', 'Pastor Ricardo Vicente Tapia')}
                className="w-full p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-left hover:bg-purple-100 transition-colors flex items-center gap-2.5"
              >
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center">
                  PR
                </div>
                <div>
                  <div className="text-xs font-bold text-purple-900 dark:text-purple-300">Pastor Ricardo Vicente Tapia</div>
                  <div className="text-[10px] text-purple-700 dark:text-purple-400">rvicentetapia@gmail.com (Pastor Admin)</div>
                </div>
              </button>

              {/* Opción personalizada con cualquier Google */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300">O ingresa con otro correo de Google:</label>
                <input
                  type="email"
                  value={googleEmailInput}
                  onChange={(e) => setGoogleEmailInput(e.target.value)}
                  placeholder="tu-correo@gmail.com"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-[#0e9594]"
                />
                <input
                  type="text"
                  value={googleNameInput}
                  onChange={(e) => setGoogleNameInput(e.target.value)}
                  placeholder="Tu nombre completo"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-[#0e9594]"
                />
                <button
                  type="button"
                  onClick={() => {
                    const email = googleEmailInput.trim() || 'hermano@gmail.com';
                    const name = googleNameInput.trim() || 'Hermano Creyente';
                    handleConfirmGoogleLogin(email, name);
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#0e9594] text-white text-xs font-bold hover:bg-[#0b7a79] transition-colors"
                >
                  Continuar como Creyente
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // VISTA 2: FORMULARIO DE DATOS PERSONALES (Si es primera vez o edita)
  // =========================================================================
  if (isRegistering || !currentUser.whatsapp || currentUser.whatsapp === '') {
    return (
      <div className="max-w-xl mx-auto my-6 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#131d33] border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
        {/* Barra superior de navegación / Cancelar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
          <button
            type="button"
            onClick={handleCancelRegistration}
            className="inline-flex items-center gap-1.5 font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 px-2.5 py-1.5 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Cancelar e ingresar con Google</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('portal')}
            className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2 py-1 rounded-lg transition-colors"
          >
            <span>Ir al Inicio</span>
            <span className="material-symbols-outlined text-[16px]">home</span>
          </button>
        </div>

        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#0e9594]/15 text-[#0e9594] text-xs font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
            <span>Ficha de Registro</span>
          </div>
          <h2 className="font-serif-title text-2xl font-bold text-[#1a365d] dark:text-white">
            Registro de Miembro en Turquía
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Cuenta de Google conectada: <strong className="text-slate-700 dark:text-slate-200">{currentUser.email}</strong>
          </p>
        </div>

        <form onSubmit={handleRegisterSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nombre *</label>
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Douglas"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-[#0e9594]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Apellido *</label>
              <input
                type="text"
                required
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                placeholder="Ej. Gómez"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-[#0e9594]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Teléfono / WhatsApp *</label>
              <input
                type="tel"
                required
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="+51 987 654 321"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-[#0e9594]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">País *</label>
              <input
                type="text"
                required
                value={pais}
                onChange={(e) => setPais(e.target.value)}
                placeholder="Ej. Perú / Colombia / España"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-[#0e9594]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Iglesia a la que perteneces *</label>
            <input
              type="text"
              required
              value={iglesia}
              onChange={(e) => setIglesia(e.target.value)}
              placeholder="Ej. MMM Central"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:border-[#0e9594]"
            />
          </div>

          {/* OPCIÓN ROL: SEGUIDOR VS INTERCESOR */}
          <div className="space-y-2 pt-1">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Selecciona tu Rol en el Ministerio *
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Opción Seguidor */}
              <div
                onClick={() => setSelectedRole('seguidor')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedRole === 'seguidor'
                    ? 'border-[#38bdf8] bg-[#38bdf8]/10'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="material-symbols-outlined text-[#38bdf8] text-[20px]">person</span>
                  <strong className="text-xs text-slate-900 dark:text-white">Rol Seguidor</strong>
                  <span className="px-1.5 py-0.2 rounded-sm bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Automático
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Aprobación automática e inmediata. Acceso a la radio 24/7 y enseñanzas públicas.
                </p>
              </div>

              {/* Opción Intercesor */}
              <div
                onClick={() => setSelectedRole('intercesor')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedRole === 'intercesor'
                    ? 'border-[#0e9594] bg-[#0e9594]/10'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="material-symbols-outlined text-[#0e9594] text-[20px]">volunteer_activism</span>
                  <strong className="text-xs text-slate-900 dark:text-white">Rol Intercesor</strong>
                  <span className="px-1.5 py-0.2 rounded-sm bg-amber-100 text-amber-800 text-[10px] font-bold">
                    Pastoral
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Requiere aprobación del pastor. Acceso a los 9 bloques confidenciales del boletín y diario.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleCancelRegistration}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
              <span>Cancelar y volver al Acceso Google</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0e9594] to-[#1a365d] hover:opacity-95 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
              <span>{isSubmitting ? 'Guardando...' : 'Completar Registro'}</span>
            </button>
          </div>
        </form>
      </div>
    );
  }

  // =========================================================================
  // VISTA 3: FICHA DEL PERFIL DEL USUARIO
  // =========================================================================
  const isPastorAdmin = currentUser.rol === 'admin' || currentUser.email?.toLowerCase() === 'rvicentetapia@gmail.com';
  const isIntercesor = currentUser.rol === 'intercesor';
  const isSeguidor = currentUser.rol === 'seguidor';
  const isApproved = currentUser.aprobado === true;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* 1. Tarjeta Principal del Perfil */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#131d33] border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#1a365d] to-[#0e9594] text-white flex items-center justify-center font-bold font-serif-title text-2xl shadow-md shrink-0">
            {currentUser.nombre ? currentUser.nombre.slice(0, 2).toUpperCase() : 'US'}
          </div>

          <div className="space-y-1 flex-1">
            {/* Estado / Badge de Rol */}
            <div className="mb-1">
              {isPastorAdmin && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-300 dark:border-purple-700 text-xs font-bold">
                  <span className="material-symbols-outlined text-[16px]">shield_person</span>
                  <span>Pastor / Administrador General</span>
                </span>
              )}

              {!isPastorAdmin && isSeguidor && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#38bdf8]/15 text-[#0284c7] dark:text-[#38bdf8] border border-[#38bdf8]/30 text-xs font-bold">
                  <span className="material-symbols-outlined text-[16px]">person</span>
                  <span>Rol Seguidor (Activo)</span>
                </span>
              )}

              {!isPastorAdmin && isIntercesor && !isApproved && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-700 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  <span>Solicitud de Intercesor en Espera de Aprobación Pastoral</span>
                </span>
              )}

              {!isPastorAdmin && isIntercesor && isApproved && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 text-xs font-bold">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  <span>Intercesor Acreditado — Aprobado por Pastoral</span>
                </span>
              )}
            </div>

            <h2 className="font-serif-title text-2xl font-bold text-slate-900 dark:text-white">
              {currentUser.nombre} {currentUser.apellido || ''}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {currentUser.email}
            </p>

            {/* Quick user fields */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">País</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{currentUser.pais || 'Perú'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Iglesia</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{currentUser.iglesia || 'MMM Central'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">WhatsApp</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{currentUser.whatsapp || 'Sin registrar'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Registro</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono-code">{currentUser.fechaRegistro || 'Hoy'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ZONA DE ACCIONES Y ESTADO SEGÚN EL ROL */}
      
      {/* CASO A: ES SEGUIDOR (Aprobado automáticamente) */}
      {!isPastorAdmin && isSeguidor && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#131d33] border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-[#0284c7] font-bold text-sm">
            <span className="material-symbols-outlined text-[20px]">radio</span>
            <span>Membresía Activa de Seguidor</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Tu cuenta como Seguidor te permite sintonizar Radio Esperanza 24/7 y acceder a las enseñanzas públicas del ministerio.
          </p>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="font-bold text-xs text-slate-900 dark:text-white">¿Deseas respaldar la obra en oración?</div>
              <p className="text-[11px] text-slate-500">Solicita ascender a Intercesor para acceder a los 9 bloques confidenciales y Diario de oración.</p>
            </div>
            <button
              onClick={() => {
                setSelectedRole('intercesor');
                setIsRegistering(true);
              }}
              className="px-4 py-2 rounded-xl bg-[#0e9594] hover:bg-[#0b7a79] text-white text-xs font-bold shrink-0 transition-colors"
            >
              Solicitar Rol Intercesor
            </button>
          </div>
        </div>
      )}

      {/* CASO B: ES INTERCESOR PERO EN ESPERA DE APROBACIÓN */}
      {!isPastorAdmin && isIntercesor && !isApproved && (
        <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
            <span className="material-symbols-outlined text-[22px]">schedule_send</span>
            <span>Solicitud de Intercesor en Revisión Pastoral</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            Tus datos han sido enviados exitosamente al equipo pastoral (Pr. Vicente Tapia). En cuanto tu cuenta sea aprobada desde el panel pastoral, <strong>aparecerá automáticamente aquí tu botón de acceso a la Intranet protegida</strong>.
          </p>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/40 space-y-2">
            <div className="text-xs font-bold text-slate-900 dark:text-white">¿Deseas agilizar tu ingreso a la Intranet?</div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Comunícate directamente con el pastor por WhatsApp para confirmar tu iglesia y validar tu acreditación:
            </p>
            <button
              onClick={handleOpenWhatsAppPastoral}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25d366] hover:bg-[#20ba59] text-white text-xs font-bold transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">chat</span>
              <span>Avisar al Pastor por WhatsApp (+51 938 204 456)</span>
            </button>
          </div>
        </div>
      )}

      {/* CASO C: INTERCESOR APROBADO (¡SOLO AQUÍ APARECE EL BOTÓN INTRANET!) */}
      {!isPastorAdmin && isIntercesor && isApproved && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#1a365d] to-[#0e9594] text-white shadow-xl space-y-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#d4af37]/20 text-[#fbbf24] text-xs font-bold">
              <span className="material-symbols-outlined text-[16px]">lock_open</span>
              <span>ACCESO AUTORIZADO A LA INTRANET PROTEGIDA</span>
            </div>
            <h3 className="font-serif-title text-2xl font-bold text-white">
              Bóveda de Intercesión Misionera
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              Como intercesor acreditado, tienes acceso completo al Dashboard de la Intranet, los 9 bloques confidenciales del Boletín de Oración y tu Diario espiritual.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {/* BOTÓN INTRANET EXCLUSIVO */}
            <button
              onClick={() => onNavigateTab('home')}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b45309] text-[#070d19] font-extrabold text-sm shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">dashboard</span>
              <span>Entrar al Dashboard de la Intranet</span>
            </button>

            <button
              onClick={() => onNavigateTab('boletin')}
              className="px-5 py-3 rounded-xl bg-white/15 hover:bg-white/20 text-white font-bold text-xs border border-white/30 backdrop-blur-xs transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">menu_book</span>
              <span>Ver Boletín de 9 Bloques</span>
            </button>
          </div>
        </div>
      )}

      {/* CASO D: SI ES PASTOR / ADMIN -> BOTÓN AL PANEL ADMINISTRADOR (Sin enlaces secretos para otros) */}
      {isPastorAdmin && (
        <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-purple-950/40 via-[#1e1b4b] to-purple-950/40 border border-purple-500/40 space-y-4 shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0 border border-purple-400/30">
                <span className="material-symbols-outlined text-[28px]">shield_person</span>
              </div>
              <div>
                <h3 className="font-serif-title text-xl font-bold text-white">
                  Consola Pastoral de Administración
                </h3>
                <p className="text-xs text-purple-200/80">
                  Acceso exclusivo del Pastor Ricardo Vicente Tapia y líderes designados
                </p>
              </div>
            </div>

            {/* BOTÓN AL PANEL ADMIN */}
            <button
              onClick={() => onNavigateTab('admin')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shrink-0"
            >
              <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
              <span>Ingresar al Panel Pastoral Admin ➔</span>
            </button>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-purple-500/20">
            Desde este panel podrás aprobar solicitudes de nuevos intercesores en 1 clic, nombrar líderes de confianza, editar los textos de los 9 bloques bíblicos y publicar nuevas ediciones semanales del Boletín.
          </p>
        </div>
      )}

      {/* 3. Acciones de cuenta (Editar datos / Cerrar sesión) */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-[#131d33] border border-slate-200 dark:border-slate-800 text-xs">
        <button
          onClick={() => setIsRegistering(true)}
          className="text-slate-600 dark:text-slate-300 hover:text-[#0e9594] font-semibold flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[16px]">edit</span>
          <span>Actualizar mis datos</span>
        </button>

        <button
          onClick={onLogout}
          className="text-slate-400 hover:text-red-500 underline flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[16px]">logout</span>
          <span>Cerrar sesión de Google</span>
        </button>
      </div>
    </div>
  );
};
