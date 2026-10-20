import React, { useState } from 'react';
import { Language, NavTab } from '../types';
import { translations } from '../data/i18n';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { PWAInstallModal } from './PWAInstallModal';

interface RootHomeViewProps {
  lang: Language;
  onNavigateTab: (tab: NavTab) => void;
  isPlayingRadio: boolean;
  onToggleRadio: () => void;
}

export const RootHomeView: React.FC<RootHomeViewProps> = ({
  lang,
  onNavigateTab,
  isPlayingRadio,
  onToggleRadio
}) => {
  const t = translations[lang] || translations.es;
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showInstallModal, setShowInstallModal] = useState<boolean>(false);

  const handleOpenInstall = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (!accepted) {
        setShowInstallModal(true);
      }
    } else {
      setShowInstallModal(true);
    }
  };

  return (
    <div className="space-y-12">
      {/* =========================================================================
          1. HERO SECTION PRINCIPAL CON RADIO ESPERANZA 24/7
          ========================================================================= */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0a1428] via-[#070d19] to-[#040810] border border-slate-800 p-8 sm:p-12 lg:p-16 text-center shadow-2xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-[#0e9594]/20 via-[#1e3a8a]/15 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#fbbf24] text-xs font-bold tracking-wider uppercase">
            <span className="material-symbols-outlined text-[16px]">explore</span>
            <span>
              {t.hero_portal_top}
              </span>
          </div>

          <h1 className="font-serif-title text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            <span className="bg-gradient-to-r from-white via-[#fbbf24] to-[#d4af37] bg-clip-text text-transparent">
              {t.hero_portal_title}
              </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed">
            {t.hero_portal_sub}
          </p>

          {/* Primary Action Buttons (Hero CTA Group) */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigateTab('radio')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b45309] text-[#070d19] font-bold text-sm shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">radio</span>
              <span>Estudio Radio 24/7</span>
            </button>

            {/* Botón Descargar WebApp (reemplaza los botones de intercesor y patrocinador en el Home) */}
            <button
              onClick={handleOpenInstall}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-[#0e9594] to-[#1e3a8a] text-white font-bold text-sm shadow-lg hover:scale-105 active:scale-95 transition-all border border-[#38bdf8]/40 group"
              title="Descargar e instalar la aplicación web en tu celular o PC"
            >
              <span className="material-symbols-outlined text-[20px] group-hover:translate-y-0.5 transition-transform">
                download
              </span>
              <span>{isInstalled ? 'WebApp Instalada' : 'Descargar WebApp'}</span>
            </button>

            <button
              onClick={() => onNavigateTab('streaming')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#0e9594] to-[#1e3a8a] hover:from-[#0c7a79] hover:to-[#172554] text-white font-bold text-sm border border-[#38bdf8]/40 shadow-md transition-all hover:scale-105"
              title="Ver videos, cabeceras y documentales en streaming"
            >
              <span className="material-symbols-outlined text-[19px] text-[#38bdf8]">live_tv</span>
              <span>Streaming Play</span>
            </button>

            <a
              href="#siete-iglesias"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-sm border border-slate-700 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">travel_explore</span>
              <span>7 Iglesias</span>
            </a>
          </div>

          {/* Mini Consola Radio 24/7 en el Home (con Consola Completa) */}
          <div className="max-w-xl mx-auto rounded-2xl bg-slate-900/90 border border-[#d4af37]/40 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-md shadow-2xl text-left">
            <div className="flex items-center gap-3.5 w-full sm:w-auto">
              <div className="w-12 h-12 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-500 shrink-0 relative">
                <span className={`w-3.5 h-3.5 rounded-full bg-red-500 shadow-lg shadow-red-500/50 ${isPlayingRadio ? 'animate-ping' : ''}`} />
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 absolute" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-white text-sm truncate">Radio Esperanza Turquía 24/7</h4>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-red-500/20 text-red-400 font-mono-code font-bold uppercase shrink-0">
                    EN VIVO
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                  {isPlayingRadio
                    ? 'Transmitiendo en directo — Radio Esperanza Turquía 24/7'
                    : 'En directo: Alabanzas y mensajes de fe desde Estambul'}
                </p>
              </div>
            </div>

            {/* Controles de la Consola: Play/Pausa + Botón Consola Completa */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
              <button
                onClick={onToggleRadio}
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b45309] text-slate-950 flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"
                aria-label={isPlayingRadio ? 'Pausar transmisión' : 'Reproducir transmisión'}
                title={isPlayingRadio ? 'Pausar transmisión' : 'Reproducir transmisión'}
              >
                <span className="material-symbols-outlined text-[24px]">
                  {isPlayingRadio ? 'pause' : 'play_arrow'}
                </span>
              </button>

              <button
                onClick={() => onNavigateTab('radio')}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all hover:border-[#d4af37]/60 group"
                title="Abrir la consola completa de Radio Esperanza"
              >
                <span>Consola Completa</span>
                <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. SECCIÓN HISTÓRICA: LAS 7 IGLESIAS DE ASIA MENOR (TURQUÍA)
          ========================================================================= */}
      <section id="siete-iglesias" className="space-y-6 pt-4 border-t border-slate-800">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#d4af37]">
            La Cuna del Cristianismo Primitivo
          </span>
          <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-white">
            El Campo: Turquía & Asia Menor
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
            En esta tierra donde caminaron los apóstoles Pablo, Juan y Pedro, y donde se levantaron las 7 Iglesias del libro de Apocalipsis, hoy volvemos a levantar antorchas de fe, oración y testimonio bíblico.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 hover:border-[#fbbf24]/50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#d4af37]/15 text-[#fbbf24] flex items-center justify-center mb-2">
              <span className="material-symbols-outlined text-[22px]">temple_buddhist</span>
            </div>
            <h4 className="font-serif-title text-base font-bold text-[#fbbf24]">Éfeso (Efes)</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Centro del ministerio apostólico de Pablo y Juan. Clave para la restauración del primer amor espiritual.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 hover:border-[#fbbf24]/50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#d4af37]/15 text-[#fbbf24] flex items-center justify-center mb-2">
              <span className="material-symbols-outlined text-[22px]">anchor</span>
            </div>
            <h4 className="font-serif-title text-base font-bold text-[#fbbf24]">Esmirna (İzmir)</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ciudad portuaria del Egeo, modelo de fidelidad en la prueba, corona de vida y perseverancia.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 hover:border-[#fbbf24]/50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#d4af37]/15 text-[#fbbf24] flex items-center justify-center mb-2">
              <span className="material-symbols-outlined text-[22px]">swords</span>
            </div>
            <h4 className="font-serif-title text-base font-bold text-[#fbbf24]">Pérgamo (Bergama)</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Lugar de profunda batalla espiritual donde la Palabra de Dios permanece como espada de dos filos inquebrantable.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 hover:border-[#fbbf24]/50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#d4af37]/15 text-[#fbbf24] flex items-center justify-center mb-2">
              <span className="material-symbols-outlined text-[22px]">door_open</span>
            </div>
            <h4 className="font-serif-title text-base font-bold text-[#fbbf24]">Filadelfia (Alaşehir)</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              "La puerta abierta que nadie puede cerrar". Nuestra promesa e inspiración para la proclamación continua en Turquía.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. BANNER DE INVITACIÓN AL REGISTRO EN EL PERFIL
          ========================================================================= */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-[#111c33] via-[#172545] to-[#111c33] border border-[#d4af37]/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <span className="px-3 py-1 rounded-full bg-[#d4af37]/15 text-[#fbbf24] text-xs font-bold uppercase tracking-wider inline-block">
            Comunidad & Membresía
          </span>
          <h3 className="font-serif-title text-2xl font-bold text-white">
            Únete a la Red de Turquía desde tu Perfil
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Regístrate como Seguidor para sintonizar libremente o postula como Intercesor para unirte a la cadena confidencial de oración y acceder a la Intranet protegida.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('perfil')}
          className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b45309] text-[#070d19] font-extrabold text-sm shadow-md hover:scale-105 active:scale-95 transition-all shrink-0 flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
          <span>Ir a Mi Perfil / Registrarme</span>
        </button>
      </div>

      {/* Modal de Instalación / Descarga de la WebApp PWA */}
      <PWAInstallModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
        isInstallable={isInstallable}
        isInstalled={isInstalled}
        isIOS={isIOS}
        onInstall={install}
      />
    </div>
  );
};
