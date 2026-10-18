import React, { useState, useEffect } from 'react';
import { UserProfile, UserRole, NavTab } from '../types';

interface PerfilViewProps {
  currentUser: UserProfile | null;
  prayedBlocksCount: number;
  savedEntriesCount: number;
  onNavigateTab: (tab: NavTab) => void;
  onLoginWithGoogle: () => Promise<void>;
  onRegisterUser: (datos: {
    nombre: string;
    apellido: string;
    whatsapp: string;
    pais: string;
    iglesia: string;
    rol: UserRole;
  }) => Promise<void>;
  onUpdateUser: (updated: UserProfile) => Promise<void> | void;
  onLogout: () => void;
}

export const PerfilView: React.FC<PerfilViewProps> = ({
  currentUser,
  prayedBlocksCount,
  savedEntriesCount,
  onNavigateTab,
  onLoginWithGoogle,
  onRegisterUser,
  onUpdateUser,
  onLogout
}) => {
  // Estado de carga y errores
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Formulario de registro inicial (Vista 2)
  const [regNombre, setRegNombre] = useState('');
  const [regApellido, setRegApellido] = useState('');
  const [regTelefono, setRegTelefono] = useState('');
  const [regPais, setRegPais] = useState('');
  const [regIglesia, setRegIglesia] = useState('');
  const [regRol, setRegRol] = useState<UserRole>('intercesor');
  const [isSubmittingReg, setIsSubmittingReg] = useState(false);

  // Formulario de edición de perfil (Vista 4)
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editNombre, setEditNombre] = useState('');
  const [editApellido, setEditApellido] = useState('');
  const [editTelefono, setEditTelefono] = useState('');
  const [editPais, setEditPais] = useState('');
  const [editIglesia, setEditIglesia] = useState('');
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // Precargar datos si el usuario ya existe
  useEffect(() => {
    if (currentUser) {
      setEditNombre(currentUser.nombre || '');
      setEditApellido(currentUser.apellido || '');
      setEditTelefono(currentUser.whatsapp || '');
      setEditPais(currentUser.pais || '');
      setEditIglesia(currentUser.iglesia || '');

      // Si aún no ha completado el registro obligatorio
      if (!currentUser.whatsapp && !currentUser.iglesia) {
        const parts = (currentUser.nombre || '').split(' ');
        setRegNombre(parts[0] || '');
        setRegApellido(parts.slice(1).join(' ') || currentUser.apellido || '');
      }
    }
  }, [currentUser]);

  // Manejador del botón de Google
  const handleGoogleClick = async () => {
    setErrorMsg(null);
    setIsLoadingGoogle(true);
    try {
      await onLoginWithGoogle();
    } catch (err: any) {
      console.warn('Error al iniciar sesión con Google:', err);
      if (err?.code !== 'auth/popup-closed-by-user') {
        setErrorMsg(err?.message || 'No se pudo iniciar sesión con Google. Inténtalo nuevamente.');
      }
    } finally {
      setIsLoadingGoogle(false);
    }
  };

  // Manejador para enviar registro inicial
  const handleSubmitRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regNombre.trim() || !regTelefono.trim() || !regPais.trim() || !regIglesia.trim()) {
      setErrorMsg('Por favor completa todos los campos requeridos.');
      return;
    }

    setIsSubmittingReg(true);
    setErrorMsg(null);
    try {
      await onRegisterUser({
        nombre: regNombre.trim(),
        apellido: regApellido.trim(),
        whatsapp: regTelefono.trim(),
        pais: regPais.trim(),
        iglesia: regIglesia.trim(),
        rol: regRol
      });
    } catch (err: any) {
      setErrorMsg('Hubo un error al guardar tu registro: ' + (err?.message || 'Intente nuevamente'));
    } finally {
      setIsSubmittingReg(false);
    }
  };

  // Manejador para guardar edición del perfil
  const handleSaveEditProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const updated: UserProfile = {
      ...currentUser,
      nombre: editNombre.trim(),
      apellido: editApellido.trim(),
      whatsapp: editTelefono.trim(),
      pais: editPais.trim(),
      iglesia: editIglesia.trim()
    };

    await onUpdateUser(updated);
    setIsEditingProfile(false);
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 4000);
  };

  // =========================================================================
  // VISTA 1: ACCESO ÚNICO CON GOOGLE (Sin usuario autenticado)
  // =========================================================================
  if (!currentUser) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-[420px] bg-white dark:bg-[#0f172a] rounded-2xl p-7 sm:p-9 shadow-2xl border border-slate-200 dark:border-slate-800 text-center space-y-6">
          {/* Logo Oficial */}
          <div className="flex justify-center">
            <img
              src="/assets/images/Logowebmt1.png"
              alt="MMM Turquía"
              onError={(e) => {
                // Fallback elegante
                (e.target as HTMLImageElement).style.display = 'none';
              }}
              className="h-10 object-contain mb-1"
            />
          </div>

          <div className="space-y-2">
            <h2 className="font-serif-title text-2xl font-bold text-[#1a365d] dark:text-white">
              Intranet de Intercesión
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Acceso exclusivo para intercesores de la obra en Turquía. Ingresa o regístrate con tu cuenta de Google:
            </p>
          </div>

          {/* BOTÓN OFICIAL DE GOOGLE */}
          <button
            type="button"
            onClick={handleGoogleClick}
            disabled={isLoadingGoogle}
            className="w-full py-3.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-100 font-bold text-sm flex items-center justify-center gap-3 shadow-xs hover:shadow-md transition-all active:scale-98 disabled:opacity-60 cursor-pointer"
          >
            {isLoadingGoogle ? (
              <span className="w-5 h-5 border-2 border-[#0e9594] border-t-transparent rounded-full animate-spin" />
            ) : (
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                width="20"
                height="20"
                alt="Google"
              />
            )}
            <span>{isLoadingGoogle ? 'Conectando con Google...' : 'Continuar con Google'}</span>
          </button>

          {errorMsg && (
            <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 p-3 rounded-xl border border-red-200 dark:border-red-900 text-left">
              ⚠️ {errorMsg}
            </p>
          )}

          <p className="text-[11px] text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            Sin contraseñas. Tu sesión queda protegida directamente por Google y Firebase Authentication.
          </p>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VISTA 2: FORMULARIO DE DATOS PERSONALES (SOLO PRIMERA VEZ / REGISTRO)
  // =========================================================================
  const isFirstTimeRegistration = !currentUser.whatsapp && !currentUser.iglesia;
  if (isFirstTimeRegistration) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-[440px] bg-white dark:bg-[#0f172a] rounded-2xl p-7 sm:p-9 shadow-2xl border border-slate-200 dark:border-slate-800 text-left space-y-5">
          <div className="text-center space-y-1">
            <h2 className="font-serif-title text-2xl font-bold text-[#1a365d] dark:text-white">
              Registro de Intercesor
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Completa tus datos personales por única vez para enviar tu solicitud de acceso al equipo pastoral:
            </p>
          </div>

          <form onSubmit={handleSubmitRegistro} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Nombre</label>
                <input
                  type="text"
                  value={regNombre}
                  onChange={(e) => setRegNombre(e.target.value)}
                  placeholder="Nombre"
                  required
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-[#0e9594]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Apellido</label>
                <input
                  type="text"
                  value={regApellido}
                  onChange={(e) => setRegApellido(e.target.value)}
                  placeholder="Apellido"
                  required
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-[#0e9594]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Teléfono / WhatsApp</label>
                <input
                  type="tel"
                  value={regTelefono}
                  onChange={(e) => setRegTelefono(e.target.value)}
                  placeholder="+51 999 999 999"
                  required
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-[#0e9594]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">País y Ciudad</label>
                <input
                  type="text"
                  value={regPais}
                  onChange={(e) => setRegPais(e.target.value)}
                  placeholder="Ej: Perú - Lima"
                  required
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-[#0e9594]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Iglesia a la que perteneces</label>
              <input
                type="text"
                value={regIglesia}
                onChange={(e) => setRegIglesia(e.target.value)}
                placeholder="Nombre de tu congregación"
                required
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-[#0e9594]"
              />
            </div>

            {/* Selección de Rol según Especificación Técnica */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Tipo de Membresía / Compromiso</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRegRol('intercesor')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    regRol === 'intercesor'
                      ? 'border-[#0e9594] bg-[#0e9594]/10 dark:bg-[#0e9594]/20 text-[#0e9594] dark:text-[#38bdf8] font-bold'
                      : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">volunteer_activism</span>
                    Intercesor
                  </div>
                  <div className="text-[10px] opacity-80 mt-0.5 leading-tight">Clamor y Boletín Confidencial</div>
                </button>

                <button
                  type="button"
                  onClick={() => setRegRol('seguidor')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    regRol === 'seguidor'
                      ? 'border-[#0e9594] bg-[#0e9594]/10 dark:bg-[#0e9594]/20 text-[#0e9594] dark:text-[#38bdf8] font-bold'
                      : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="text-xs font-bold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">person</span>
                    Seguidor
                  </div>
                  <div className="text-[10px] opacity-80 mt-0.5 leading-tight">Acceso Rápido y Radio 24/7</div>
                </button>
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 p-2.5 rounded-lg border border-red-200 dark:border-red-900">
                ⚠️ {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmittingReg}
              className="w-full py-3 bg-[#0e9594] hover:bg-[#0c7a79] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isSubmittingReg ? (
                <span>Enviando solicitud...</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">send</span>
                  <span>Enviar Solicitud de Acceso</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="w-full text-center text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 underline pt-1 cursor-pointer"
            >
              Cancelar o cambiar de cuenta Google
            </button>
          </form>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VISTA 3: SALA DE ESPERA PASTORAL (Intercesor en espera de aprobación)
  // =========================================================================
  const isIntercesorPending = currentUser.rol === 'intercesor' && !currentUser.aprobado;
  if (isIntercesorPending) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-[420px] bg-white dark:bg-[#0f172a] rounded-2xl p-8 sm:p-9 shadow-2xl border border-slate-200 dark:border-slate-800 text-center space-y-5">
          {/* Icono de Espera */}
          <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[#0e9594] flex items-center justify-center mx-auto shadow-sm">
            <span className="material-symbols-outlined text-[34px]">schedule_send</span>
          </div>

          <div className="space-y-2">
            <h2 className="font-serif-title text-2xl font-bold text-[#1a365d] dark:text-white">
              Solicitud en Espera de Aprobación
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Tus datos han sido enviados exitosamente al equipo pastoral de la misión.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-left space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#0e9594]">
              <span className="material-symbols-outlined text-[16px]">info</span>
              <span>Proceso de acreditación pastoral</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              En cuanto el equipo pastoral apruebe tu cuenta en Firestore, ingresarás automáticamente al Boletín de Oración y la Intranet. Si deseas agilizar tu ingreso, puedes comunicarte directamente con el equipo pastoral.
            </p>
          </div>

          {/* Estado de escucha en tiempo real */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-[#0e9594] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#0e9594] animate-ping" />
            <span>Escucha en tiempo real activa (se actualizará solo)</span>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 underline cursor-pointer"
          >
            Cerrar sesión o cambiar de cuenta
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VISTA 4: PERFIL Y DASHBOARD DEL USUARIO (APROBADO / SEGUIDOR / ADMIN)
  // =========================================================================
  const isAdmin = currentUser.rol === 'admin';
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.nombre + ' ' + (currentUser.apellido || ''))}&background=1a365d&color=fff&size=128`;

  return (
    <div className="max-w-2xl mx-auto py-6 sm:py-8 space-y-6">
      {/* TARJETA DEL USUARIO */}
      <section className="bg-white dark:bg-[#0f172a] rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-200 dark:border-slate-800 space-y-6">
        {/* Cabecera del Usuario */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 text-center sm:text-left">
          <img
            src={avatarUrl}
            alt="Foto"
            className="w-18 h-18 rounded-full border-2 border-[#0e9594] shadow-md object-cover"
          />
          <div className="space-y-1">
            <h3 className="font-serif-title text-xl sm:text-2xl font-bold text-[#1a365d] dark:text-white">
              ¡Hola, {currentUser.nombre} {currentUser.apellido || ''}!
            </h3>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                isAdmin
                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 border border-purple-300'
                  : currentUser.rol === 'intercesor'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-300'
              }`}>
                {isAdmin ? 'Pastor / Administrador' : currentUser.rol === 'intercesor' ? 'Intercesor Acreditado' : 'Seguidor de la Misión'}
              </span>
              <span className="text-xs text-slate-400">({currentUser.email})</span>
            </div>
          </div>
        </div>

        {/* Resumen limpio de sus datos */}
        {!isEditingProfile ? (
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#0e9594] text-[20px]">call</span>
                <div className="text-xs">
                  <div className="text-slate-400 text-[10px]">Teléfono / WhatsApp</div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">{currentUser.whatsapp || 'Sin teléfono'}</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#0e9594] text-[20px]">public</span>
                <div className="text-xs">
                  <div className="text-slate-400 text-[10px]">País y Ciudad</div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">{currentUser.pais || 'Sin país'}</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#0e9594] text-[20px]">church</span>
                <div className="text-xs">
                  <div className="text-slate-400 text-[10px]">Iglesia / Ministerio</div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">{currentUser.iglesia || 'Sin iglesia'}</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsEditingProfile(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#0e9594] border border-[#0e9594]/40 hover:bg-[#0e9594]/10 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">edit</span>
                <span>Editar Perfil</span>
              </button>
            </div>
          </div>
        ) : (
          /* Formulario de edición */
          <form onSubmit={handleSaveEditProfile} className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Modificar mis datos
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Nombre</label>
                <input
                  type="text"
                  value={editNombre}
                  onChange={(e) => setEditNombre(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Apellido</label>
                <input
                  type="text"
                  value={editApellido}
                  onChange={(e) => setEditApellido(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">WhatsApp / Teléfono</label>
                <input
                  type="tel"
                  value={editTelefono}
                  onChange={(e) => setEditTelefono(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">País y Ciudad</label>
                <input
                  type="text"
                  value={editPais}
                  onChange={(e) => setEditPais(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Iglesia o Ministerio</label>
              <input
                type="text"
                value={editIglesia}
                onChange={(e) => setEditIglesia(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#0e9594] hover:bg-[#0c7a79] text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        )}

        {showSaveSuccess && (
          <p className="text-xs text-emerald-600 dark:text-emerald-400 text-center font-bold">
            ✅ ¡Tus datos han sido actualizados exitosamente!
          </p>
        )}
      </section>

      {/* BANNER 1: ABRIR MI DIARIO DE ORACIÓN (Diseño de la especificación técnica) */}
      <button
        onClick={() => onNavigateTab('diario')}
        className="w-full p-5 rounded-2xl bg-gradient-to-r from-[#1a365d] to-[#0e9594] text-white flex items-center gap-4 text-left shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer group"
      >
        <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[32px] text-white">book_4</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base sm:text-lg">Abrir Mi Diario de Oración</h3>
            <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </div>
          <p className="text-xs text-white/80 leading-relaxed mt-0.5">
            Revisa tus oraciones, motivos guardados, testimonios de fe y peticiones personales.
          </p>
        </div>
      </button>

      {/* BANNER 2: IR AL BOLETÍN DE ORACIÓN (Si es Intercesor Aprobado o Admin) */}
      {(currentUser.aprobado || isAdmin) && (
        <button
          onClick={() => onNavigateTab('boletin')}
          className="w-full p-4 rounded-2xl bg-slate-900 border border-[#38bdf8]/40 hover:border-[#38bdf8] text-white flex items-center justify-between shadow-lg transition-all cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#38bdf8] text-[24px]">menu_book</span>
            <div className="text-left">
              <div className="text-xs font-bold text-white">Ir al Boletín de Oración</div>
              <div className="text-[11px] text-slate-400">9 Bloques de intercesión por las regiones de Turquía</div>
            </div>
          </div>
          <span className="material-symbols-outlined text-slate-400 text-[18px]">chevron_right</span>
        </button>
      )}

      {/* BOTÓN ADMIN PASTORAL (Si es el pastor rvicentetapia@gmail.com) */}
      {isAdmin && (
        <button
          onClick={() => onNavigateTab('admin')}
          className="w-full p-4 rounded-2xl bg-purple-950/60 border border-purple-500/50 hover:bg-purple-900/60 text-white flex items-center justify-between shadow-lg transition-all cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-purple-400 text-[24px]">shield_person</span>
            <div className="text-left">
              <div className="text-xs font-bold text-white">Panel Pastoral de Administración</div>
              <div className="text-[11px] text-purple-300">Aprobar intercesores, editar boletín y ver estadísticas</div>
            </div>
          </div>
          <span className="material-symbols-outlined text-purple-400 text-[18px]">arrow_forward</span>
        </button>
      )}

      {/* BOTÓN CERRAR SESIÓN */}
      <div className="text-center pt-2">
        <button
          type="button"
          onClick={onLogout}
          className="text-xs font-bold text-red-500 hover:text-red-700 dark:hover:text-red-400 cursor-pointer"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};
