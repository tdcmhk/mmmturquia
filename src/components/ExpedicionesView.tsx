import React from 'react';
import { MissionaryProject } from '../types';

interface ExpedicionesViewProps {
  projects: MissionaryProject[];
}

export const ExpedicionesView: React.FC<ExpedicionesViewProps> = ({ projects }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#1a365d] to-[#0e9594] text-white shadow-md">
        <div className="flex items-center gap-2 text-[#e5a93b] text-xs font-bold uppercase tracking-wider mb-2">
          <span className="material-symbols-outlined text-[18px]">explore</span>
          <span>Movilización Territorial en Turquía & Fronteras</span>
        </div>
        <h2 className="font-serif-title text-2xl sm:text-3xl font-bold mb-3">
          Expediciones 2026
        </h2>
        <p className="text-slate-200 text-xs sm:text-sm max-w-2xl leading-relaxed">
          Seguimiento de las rutas apostólicas, visitas a creyentes dispersos en las provincias del Mármara y preparación del viaje transfronterizo a Grecia en noviembre.
        </p>
      </div>

      {/* Expeditions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bursa & Balikesir */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131d33] overflow-hidden shadow-xs flex flex-col justify-between">
          <div className="h-48 overflow-hidden relative">
            <img
              src="/src/assets/images/bursa_mission_field_1792130896037.jpg"
              alt="Bursa y Balikesir"
              className="w-full h-full object-cover"
            />
            <span className="absolute top-3 right-3 px-3 py-1 bg-[#1a365d]/90 text-[#e5a93b] backdrop-blur-md rounded-full text-xs font-bold font-mono-code">
              76% Financiado
            </span>
          </div>

          <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-bold text-[#0e9594] uppercase tracking-wider mb-1">
                02 al 06 de Noviembre 2026
              </div>
              <h3 className="font-serif-title text-lg font-bold text-slate-900 dark:text-white mb-2">
                Salida: Bursa y Balıkesir
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Visita a 8 hogares de familias latinas y turcas contactadas. Entrega de literatura bíblica y talleres de discipulado de mujeres guiados por las movilizadoras Andrea y Natalia.
              </p>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div className="bg-[#0e9594] h-full rounded-full" style={{ width: '76%' }} />
              </div>
              <div className="flex justify-between text-xs text-slate-500 font-mono-code">
                <span>Recaudado: $2,430 USD</span>
                <span className="font-bold text-slate-900 dark:text-white">Meta: $3,200 USD</span>
              </div>
              <a
                href="https://wa.me/51938204456?text=Deseo%20respaldar%20la%20expedici%C3%B3n%20a%20Bursa"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center py-2.5 rounded-xl bg-[#1a365d] hover:bg-[#132a48] text-white text-xs font-bold shadow-xs transition-colors"
              >
                Ofrendar para esta Salida
              </a>
            </div>
          </div>
        </div>

        {/* Grecia Noviembre */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131d33] overflow-hidden shadow-xs flex flex-col justify-between">
          <div className="h-48 overflow-hidden relative">
            <img
              src="/src/assets/images/missionary_expedition_aegean_1792130896065.jpg"
              alt="Grecia Noviembre"
              className="w-full h-full object-cover"
            />
            <span className="absolute top-3 right-3 px-3 py-1 bg-[#1a365d]/90 text-[#e5a93b] backdrop-blur-md rounded-full text-xs font-bold font-mono-code">
              42% Financiado
            </span>
          </div>

          <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-bold text-[#0e9594] uppercase tracking-wider mb-1">
                14 al 20 de Noviembre 2026
              </div>
              <h3 className="font-serif-title text-lg font-bold text-slate-900 dark:text-white mb-2">
                Exploración 2026: Grecia & Ruta de Macedonia
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Cruzando fronteras hacia la región helénica para conectar con obreros locales, coordinar atención pastoral a migrantes y evaluar aperturas de obra.
              </p>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div className="bg-[#0e9594] h-full rounded-full" style={{ width: '42%' }} />
              </div>
              <div className="flex justify-between text-xs text-slate-500 font-mono-code">
                <span>Recaudado: $1,180 USD</span>
                <span className="font-bold text-slate-900 dark:text-white">Meta: $2,800 USD</span>
              </div>
              <a
                href="https://wa.me/51938204456?text=Deseo%20respaldar%20el%20viaje%20a%20Grecia"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center py-2.5 rounded-xl bg-[#0e9594] hover:bg-[#0b7a79] text-white text-xs font-bold shadow-xs transition-colors"
              >
                Apoyar Visados y Boletos
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
