import React, { useState, useRef, useEffect } from 'react';
import { NavTab, Language, UserRole } from '../types';
import { translations } from '../data/i18n';

interface NavbarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  lang: Language;
  onLangChange: (lang: Language) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  savedCount: number;
  userRole: UserRole;
  isUserApproved: boolean;
  isPlayingRadio: boolean;
  onToggleRadio: () => void;
}

const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'es', label: 'Español' },
  { code: 'tr', label: 'Türkçe' },
  { code: 'en', label: 'English' },
  { code: 'it', label: 'Italiano' }
];

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  lang,
  onLangChange,
  darkMode,
  onToggleDarkMode,
  savedCount,
  userRole,
  isUserApproved,
  isPlayingRadio,
  onToggleRadio
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const t = translations[lang] || translations.es;

  // Cerrar el menú de idiomas si el usuario hace clic afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTabClick = (tab: NavTab) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasIntranetAccess = isUserApproved && (userRole === 'intercesor' || userRole === 'admin' || userRole === 'patrocinador');
  const currentLangObj = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  return (
    <nav className="sticky top-0 z-50 bg-[#070d19]/95 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-md w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* Brand Logo & Title (Con min-w-0 para no desbordar en pantallas pequeñas) */}
          <div className="flex items-center min-w-0">
            <button
              onClick={() => handleTabClick('portal')}
              className="flex items-center gap-2 text-left group focus:outline-hidden min-w-0"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#1e3a8a] to-[#0e9594] flex items-center justify-center text-[#38bdf8] border border-[#38bdf8]/30 shadow-md shadow-[#0e9594]/20 group-hover:scale-105 transition-transform shrink-0">
                <span className="material-symbols-outlined text-[22px] sm:text-[24px]">church</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-serif-title text-sm sm:text-lg font-bold text-white tracking-wide leading-none truncate">
                  {t.nav_logo || 'ESPERANZA VIVA'}
                </span>
                <span className="text-[9px] sm:text-[10px] text-[#d4af37] font-semibold tracking-wider leading-tight truncate">
                  Misión & Radio 24/7
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              onClick={() => handleTabClick('portal')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                currentTab === 'portal'
                  ? 'bg-[#d4af37] text-[#070d19] font-bold shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">home</span>
              <span>{t.nav_portal}</span>
            </button>

            <button
              onClick={() => handleTabClick('radio')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                currentTab === 'radio'
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#b45309] text-slate-950 font-bold shadow-xs'
                  : isPlayingRadio
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">
                {isPlayingRadio ? 'volume_up' : 'radio'}
              </span>
              <span>{t.nav_radio || 'Radio 24/7'}</span>
              {isPlayingRadio && (
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              )}
            </button>

            <button
              onClick={() => handleTabClick('streaming')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                currentTab === 'streaming'
                  ? 'bg-gradient-to-r from-[#0e9594] to-[#1e3a8a] text-white font-bold shadow-xs border border-[#38bdf8]/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
              title="MMM Turquía Play — Videos & Documentales"
            >
              <span className="material-symbols-outlined text-[17px] text-[#38bdf8]">live_tv</span>
              <span>{t.nav_streaming || 'Streaming'}</span>
              <span className="px-1.5 py-0.2 bg-[#e5a93b] text-slate-950 rounded-full text-[9px] font-black">
                PLAY
              </span>
            </button>

            <button
              onClick={() => handleTabClick('perfil')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                currentTab === 'perfil'
                  ? 'bg-[#0e9594] text-white font-bold shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">account_circle</span>
              <span>{t.nav_perfil}</span>
            </button>

            {hasIntranetAccess && (
              <>
                <span className="text-slate-600 px-1">|</span>

                <button
                  onClick={() => handleTabClick('home')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    currentTab === 'home'
                      ? 'bg-[#1a365d] text-white shadow-xs border border-[#38bdf8]/40'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                  title="Dashboard Intranet"
                >
                  <span className="material-symbols-outlined text-[17px]">dashboard</span>
                  <span>Intranet</span>
                </button>

                <button
                  onClick={() => handleTabClick('boletin')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    currentTab === 'boletin'
                      ? 'bg-[#1a365d] text-white shadow-xs border border-[#38bdf8]/40'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <span className="material-symbols-outlined text-[17px]">menu_book</span>
                  <span>{t.nav_boletin}</span>
                  <span className="px-1.5 py-0.2 bg-[#0e9594] text-white rounded-full text-[10px] font-bold">
                    9
                  </span>
                </button>

                <button
                  onClick={() => handleTabClick('diario')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    currentTab === 'diario'
                      ? 'bg-[#1a365d] text-white shadow-xs border border-[#38bdf8]/40'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <span className="material-symbols-outlined text-[17px]">bookmark_heart</span>
                  <span>{t.nav_diario}</span>
                  {savedCount > 0 && (
                    <span className="px-1.5 py-0.2 bg-[#e5a93b] text-slate-900 rounded-full text-[10px] font-bold">
                      {savedCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => handleTabClick('expediciones')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    currentTab === 'expediciones'
                      ? 'bg-[#1a365d] text-white shadow-xs border border-[#38bdf8]/40'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <span className="material-symbols-outlined text-[17px]">explore</span>
                  <span>{t.nav_expediciones}</span>
                </button>
              </>
            )}

            {userRole === 'admin' && (
              <button
                onClick={() => handleTabClick('admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  currentTab === 'admin'
                    ? 'bg-purple-600 text-white font-bold'
                    : 'text-purple-300 hover:bg-purple-950/40'
                }`}
              >
                <span className="material-symbols-outlined text-[17px]">shield_person</span>
                <span>Admin</span>
              </button>
            )}

            {/* En el menú Desktop: */}
            <button
              onClick={() => handleTabClick('settings')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                currentTab === 'settings'
                  ? 'bg-[#0e9594] text-white font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">settings</span>
              <span>Ajustes</span>
            </button>
          </div>

          {/* Right Controls: Compacto con shrink-0 para nunca salirse de pantalla */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">

            {/* Botón CTA Perfil / Intranet en Desktop */}
            {hasIntranetAccess ? (
              <button
                onClick={() => handleTabClick('home')}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#070d19] bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm transition-all shrink-0 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">lock_open</span>
                <span>Intranet</span>
              </button>
            ) : (
              <button
                onClick={() => handleTabClick('perfil')}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#070d19] bg-gradient-to-r from-[#d4af37] to-[#b45309] rounded-lg shadow-sm hover:opacity-95 transition-opacity shrink-0 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">account_circle</span>
                <span>Mi Perfil</span>
              </button>
            )}

            {/* BOTÓN HAMBURGUESA MÓVIL: Siempre visible con shrink-0 */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 rounded-lg text-slate-200 hover:bg-slate-800 border border-slate-700/60 bg-slate-800/40 shrink-0 cursor-pointer focus:outline-hidden"
              aria-label="Abrir menú de navegación"
            >
              <span className="material-symbols-outlined text-[24px] leading-none block">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>

        </div>
      </div>

      {/* Menú desplegable Móvil (Mobile Drawer) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-[#070d19]/98 backdrop-blur-lg px-4 py-3 space-y-1 shadow-2xl">
          <button
            onClick={() => handleTabClick('portal')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm font-semibold rounded-lg ${
              currentTab === 'portal' ? 'bg-[#d4af37] text-slate-900 font-bold' : 'text-slate-200 hover:bg-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">home</span>
            <span>{t.nav_portal}</span>
          </button>

          <button
            onClick={() => handleTabClick('radio')}
            className={`w-full flex items-center justify-between px-3 py-2 text-sm font-semibold rounded-lg ${
              currentTab === 'radio'
                ? 'bg-gradient-to-r from-[#d4af37] to-[#b45309] text-slate-900 font-bold'
                : 'text-slate-200 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[20px]">radio</span>
              <span>Radio Esperanza 24/7</span>
            </div>
            <span className={`text-xs font-bold ${isPlayingRadio ? 'text-red-400' : 'text-slate-400'}`}>
              {isPlayingRadio ? '● EN VIVO' : 'Consola'}
            </span>
          </button>

          <button
            onClick={() => handleTabClick('streaming')}
            className={`w-full flex items-center justify-between px-3 py-2 text-sm font-semibold rounded-lg ${
              currentTab === 'streaming'
                ? 'bg-gradient-to-r from-[#0e9594] to-[#1e3a8a] text-white font-bold'
                : 'text-slate-200 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[20px] text-[#38bdf8]">live_tv</span>
              <span>Streaming MMM Play</span>
            </div>
            <span className="px-1.5 py-0.5 bg-[#e5a93b] text-slate-950 rounded-full text-[10px] font-black">
              VIDEO
            </span>
          </button>

          <button
            onClick={() => handleTabClick('perfil')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm font-semibold rounded-lg ${
              currentTab === 'perfil' ? 'bg-[#0e9594] text-white font-bold' : 'text-slate-200 hover:bg-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">account_circle</span>
            <span>Mi Perfil</span>
          </button>

          <button
            onClick={() => handleTabClick('settings')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm font-semibold rounded-lg ${
              currentTab === 'settings' ? 'bg-[#0e9594] text-white font-bold' : 'text-slate-200 hover:bg-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
            <span>Configuración & Idioma</span>
          </button>

          {hasIntranetAccess && (
            <>
              <div className="pt-2 pb-1 text-[11px] font-bold text-slate-500 uppercase px-3">
                Intranet Protegida
              </div>
              <button
                onClick={() => handleTabClick('home')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm font-semibold rounded-lg ${
                  currentTab === 'home' ? 'bg-[#1a365d] text-white' : 'text-slate-200 hover:bg-slate-800'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">dashboard</span>
                <span>Dashboard Intranet</span>
              </button>

              <button
                onClick={() => handleTabClick('boletin')}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm font-semibold rounded-lg ${
                  currentTab === 'boletin' ? 'bg-[#1a365d] text-white' : 'text-slate-200 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[20px]">menu_book</span>
                  <span>{t.nav_boletin}</span>
                </div>
                <span className="px-2 py-0.5 bg-[#0e9594] text-white rounded-full text-xs font-bold">
                  9 Bloques
                </span>
              </button>

              <button
                onClick={() => handleTabClick('diario')}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm font-semibold rounded-lg ${
                  currentTab === 'diario' ? 'bg-[#1a365d] text-white' : 'text-slate-200 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[20px]">bookmark_heart</span>
                  <span>{t.nav_diario}</span>
                </div>
                {savedCount > 0 && (
                  <span className="px-2 py-0.5 bg-[#e5a93b] text-slate-900 rounded-full text-xs font-bold">
                    {savedCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleTabClick('expediciones')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm font-semibold rounded-lg ${
                  currentTab === 'expediciones' ? 'bg-[#1a365d] text-white' : 'text-slate-200 hover:bg-slate-800'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">explore</span>
                <span>{t.nav_expediciones}</span>
              </button>
            </>
          )}

          {userRole === 'admin' && (
            <button
              onClick={() => handleTabClick('admin')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm font-semibold rounded-lg ${
                currentTab === 'admin' ? 'bg-purple-600 text-white' : 'text-purple-300 hover:bg-slate-800'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">shield_person</span>
              <span>Panel Admin Pastoral</span>
            </button>
          )}
        </div>
      )}
    </nav>
  );
};