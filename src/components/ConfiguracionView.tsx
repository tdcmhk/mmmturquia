import React from 'react';
import { Language, NavTab } from '../types';

interface ConfiguracionViewProps {
  lang: Language;
  onLangChange: (lang: Language) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onNavigateTab: (tab: NavTab) => void;
}

const LANGUAGES: { code: Language; name: string; nativeName: string; desc: string }[] = [
  { code: 'es', name: 'Español', nativeName: 'Español', desc: 'Idioma principal de la misión' },
  { code: 'tr', name: 'Turco', nativeName: 'Türkçe', desc: 'Türkiye için yerel dil' },
  { code: 'en', name: 'Inglés', nativeName: 'English', desc: 'Global missionary reach' },
  { code: 'it', name: 'Italiano', nativeName: 'Italiano', desc: 'Comunità in Europa' }
];

export const ConfiguracionView: React.FC<ConfiguracionViewProps> = ({
  lang,
  onLangChange,
  darkMode,
  onToggleDarkMode,
  onNavigateTab
}) => {
  return (
    <div className="max-w-2xl mx-auto py-6 sm:py-8 space-y-6">
      
      {/* Encabezado */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0e9594]/15 text-[#0e9594] flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[24px]">settings</span>
          </div>
          <div>
            <h2 className="font-serif-title text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Configuración & Preferencias
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Personaliza tu experiencia en la plataforma de MMM Turquía
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('portal')}
          className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1"
        >
          <span>Volver al Inicio</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>

      {/* SECCIÓN 1: IDIOMA DE LA APLICACIÓN */}
      <section className="bg-white dark:bg-[#0f172a] rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
          <span className="material-symbols-outlined text-[#0e9594] text-[20px]">language</span>
          <span>Idioma de la Plataforma (Dil Seçimi)</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Selecciona el idioma para los textos, boletines y secciones públicas:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => onLangChange(l.code)}
              className={`p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer flex items-center justify-between ${
                lang === l.code
                  ? 'border-[#0e9594] bg-[#0e9594]/10 dark:bg-[#0e9594]/20 text-[#0e9594] dark:text-[#38bdf8] font-bold shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div>
                <div className="text-xs font-bold flex items-center gap-1.5">
                  <span className="uppercase text-[10px] px-1.5 py-0.2 rounded-md bg-slate-200 dark:bg-slate-800 font-mono">
                    {l.code}
                  </span>
                  <span>{l.nativeName}</span>
                </div>
                <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                  {l.desc}
                </div>
              </div>
              {lang === l.code && (
                <span className="material-symbols-outlined text-[20px] text-[#0e9594] dark:text-[#38bdf8]">
                  check_circle
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* SECCIÓN 2: TEMA VISUAL (CLARO / OSCURO) */}
      <section className="bg-white dark:bg-[#0f172a] rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
          <span className="material-symbols-outlined text-[#fbbf24] text-[20px]">palette</span>
          <span>Apariencia y Modo Visual</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Elige la combinación de colores que sea más cómoda para tus ojos:
        </p>

        <div className="grid grid-cols-2 gap-3 pt-1">
          {/* Opción Modo Oscuro */}
          <button
            type="button"
            onClick={() => { if (!darkMode) onToggleDarkMode(); }}
            className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
              darkMode
                ? 'border-[#38bdf8] bg-slate-900 text-white font-bold ring-2 ring-[#38bdf8]/20'
                : 'border-slate-200 dark:border-slate-800 text-slate-400'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="material-symbols-outlined text-[24px] text-[#38bdf8]">dark_mode</span>
              {darkMode && <span className="material-symbols-outlined text-[18px] text-[#38bdf8]">check</span>}
            </div>
            <div className="text-xs font-bold text-white">Modo Noche / Oscuro</div>
            <p className="text-[10px] text-slate-400 mt-0.5">Ideal para oración nocturna y bajo brillo.</p>
          </button>

          {/* Opción Modo Claro */}
          <button
            type="button"
            onClick={() => { if (darkMode) onToggleDarkMode(); }}
            className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
              !darkMode
                ? 'border-amber-500 bg-amber-50 text-slate-900 font-bold ring-2 ring-amber-500/20'
                : 'border-slate-200 dark:border-slate-800 text-slate-400'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="material-symbols-outlined text-[24px] text-amber-500">light_mode</span>
              {!darkMode && <span className="material-symbols-outlined text-[18px] text-amber-600">check</span>}
            </div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Modo Día / Claro</div>
            <p className="text-[10px] text-slate-400 mt-0.5">Lectura de alto contraste y luz natural.</p>
          </button>
        </div>
      </section>

      {/* SECCIÓN 3: INFORMACIÓN DE LA MISIÓN */}
      <section className="bg-slate-50 dark:bg-[#070d19]/80 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 text-center space-y-2">
        <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
          MMM Turquía — Plataforma Misionera & Radio Esperanza 24/7
        </div>
        <p className="text-[11px] text-slate-400">
          Versión 2.0 • Proclamando las Buenas Nuevas desde la cuna de los apóstoles
        </p>
      </section>

    </div>
  );
};