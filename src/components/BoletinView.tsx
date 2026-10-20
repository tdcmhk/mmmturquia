import React, { useState } from 'react';
import { PrayerBlock, Language } from '../types';
import { translations } from '../data/i18n';

interface BoletinViewProps {
  blocks: PrayerBlock[];
  lang: Language;
  totalWeeklyPrayers: number;
  hasPrayedWeekly: boolean;
  onIncrementWeeklyPrayers: () => void;
  onTogglePrayBlock: (blockId: string) => void;
  onToggleSaveBlock: (block: PrayerBlock) => void;
  onAddCommentToBlock: (blockId: string, text: string) => void;
}

export const BoletinView: React.FC<BoletinViewProps> = ({
  blocks,
  lang,
  totalWeeklyPrayers,
  hasPrayedWeekly,
  onIncrementWeeklyPrayers,
  onTogglePrayBlock,
  onToggleSaveBlock,
  onAddCommentToBlock
}) => {
  const t = translations[lang] || translations.es;
  const [showAllBlocks, setShowAllBlocks] = useState<boolean>(false);
  const [openCommentBlockId, setOpenCommentBlockId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);

  // Handle comment input
  const handleCommentChange = (blockId: string, value: string) => {
    setCommentInputs((prev) => ({ ...prev, [blockId]: value }));
  };

  const handleCommentSubmit = (e: React.FormEvent, blockId: string) => {
    e.preventDefault();
    const text = commentInputs[blockId]?.trim();
    if (!text) return;
    onAddCommentToBlock(blockId, text);
    setCommentInputs((prev) => ({ ...prev, [blockId]: '' }));
  };

  const visibleBlocks = showAllBlocks ? blocks : blocks.slice(0, 4);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* =========================================================================
          INTRO CARD CON ARABESCO GEOMÉTRICO (Estilo Boletín de Oración)
          ========================================================================= */}
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#131d33] border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
        {/* Arabesque SVG Star */}
        <div className="absolute -top-10 -right-10 w-44 h-44 text-[#0e9594] opacity-10 pointer-events-none">
          <svg viewBox="0 0 100 100" fill="currentColor">
            <polygon points="50,0 63,38 100,50 63,62 50,100 37,62 0,50 37,38" />
          </svg>
        </div>

        <div className="relative z-10">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#0e9594] px-2.5 py-1 rounded-md bg-[#0e9594]/10">
            Boletín Oficial de Intercesión
          </span>

          <h2 className="font-serif-title text-xl sm:text-2xl font-bold text-[#1a365d] dark:text-white mt-3 uppercase tracking-wide">
            Contexto General de la Iglesia en Turquía
          </h2>

          <div className="p-4 rounded-xl bg-[#ebf8ff] dark:bg-slate-900/80 border-l-4 border-[#0e9594] my-4 italic text-sm text-slate-800 dark:text-slate-200">
            «Pídeme, y te daré por herencia las naciones, y como posesión tuya los confines de la tierra.»
            <strong className="block not-italic text-[#1a365d] dark:text-[#38bdf8] mt-1">— Salmos 2:8</strong>
          </div>

          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            Las cartas de Pedro fueron dirigidas a los creyentes dispersos en Asia Menor (región que comprende la actual Turquía), quienes vivían como extranjeros y peregrinos en medio de una cultura hostil e idólatra. En este entorno, el apóstol les recuerda que su identidad no proviene de su ubicación terrenal ni de su aceptación social, sino de haber sido redimidos por la sangre de Cristo. Pedro exhorta a la iglesia a mantenerse firme en la gracia, cultivar un carácter santo, permanecer arraigada en la verdad bíblica frente a las pruebas, mantener la unidad familiar y el servicio mutuo, y dar testimonio radiante de esperanza en medio de la sociedad.
          </p>
        </div>
      </div>

      {/* =========================================================================
          VIDEO PANORÁMICO (Exacto al Boletín original)
          ========================================================================= */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131d33] overflow-hidden shadow-xs">
        <div className="relative aspect-video bg-black flex items-center justify-center">
          {!isVideoPlaying ? (
            <div className="relative w-full h-full cursor-pointer group" onClick={() => setIsVideoPlaying(true)}>
              <img
                src="/src/assets/images/intranet_hero_bosphorus_1792130893706.jpg"
                alt="Expedición Turquía"
                className="w-full h-full object-cover opacity-80 group-hover:opacity-90 transition-opacity"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-3">
                <div className="w-16 h-16 rounded-full bg-[#e5a93b] text-slate-900 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[36px] ml-1">play_arrow</span>
                </div>
                <div className="text-white text-center px-4">
                  <div className="font-serif-title font-bold text-lg">Expedición 2026</div>
                  <div className="text-xs text-slate-200">Haz clic para reproducir el mensaje introductorio</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white bg-slate-900">
              <span className="material-symbols-outlined text-4xl text-[#0e9594] mb-2">videocam</span>
              <p className="text-sm font-semibold mb-3">Reproductor de Video (Bunny Stream / WebM)</p>
              <p className="text-xs text-slate-400 max-w-md mb-4">
                Testimonios de las hermanas en Anatolia, panorámica de Estambul y los desafíos de la movilización.
              </p>
              <button
                onClick={() => setIsVideoPlaying(false)}
                className="px-4 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-xs font-semibold"
              >
                Volver a la Portada
              </button>
            </div>
          )}
        </div>
        <p className="text-center text-xs text-slate-500 dark:text-slate-400 italic p-3 m-0 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
          Te invitamos a ver este breve video antes de iniciar el boletín de oración.
        </p>
      </div>

      {/* Meta editorial */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 dark:text-slate-400 py-1 border-y border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[18px]">edit_note</span>
          <span>Escrito por los Pastores de la Iglesia</span>
        </div>
        <span>·</span>
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[18px]">history</span>
          <span>Última actualización: 16 de Octubre 2026</span>
        </div>
      </div>

      {/* =========================================================================
          BLOQUES DE ORACIÓN (1 al 9 con diseño idéntico al Boletín)
          ========================================================================= */}
      <div className="space-y-8">
        {visibleBlocks.map((b) => {
          const isCommentsOpen = openCommentBlockId === b.id;

          return (
            <article
              key={b.id}
              id={b.id}
              className="bg-white dark:bg-[#131d33] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs scroll-mt-24 transition-shadow hover:shadow-md"
            >
              {/* Header: Bloque N + Título */}
              <div className="bg-[#1a365d] text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-sm tracking-wider uppercase text-[#e5a93b]">
                  BLOQUE {b.number}
                </span>
                <span className="font-serif-title text-xs sm:text-sm font-normal uppercase text-slate-200">
                  {b.title}
                </span>
              </div>

              {/* Foto representativa */}
              <div className="h-56 sm:h-72 w-full overflow-hidden bg-slate-100 dark:bg-slate-900 border-b border-[#c1272d]">
                <img
                  src={b.imageUrl}
                  alt={b.title}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Contenido del Día */}
              <div className="p-5 sm:p-7 space-y-5">
                {/* Versículo */}
                <div className="p-4 rounded-xl bg-[#ebf8ff] dark:bg-slate-900/80 border-l-4 border-[#0e9594] text-xs sm:text-sm italic text-slate-800 dark:text-slate-200 leading-relaxed">
                  {b.scriptureText}
                  <strong className="block not-italic text-[#1a365d] dark:text-[#38bdf8] mt-1.5">
                    — {b.scriptureRef}
                  </strong>
                </div>

                {/* Contexto e Historia */}
                <div>
                  <div className="flex items-center gap-2 text-[#1a365d] dark:text-[#38bdf8] font-bold text-xs uppercase tracking-wider pb-1.5 border-b-2 border-[#c1272d] mb-2.5">
                    <span className="material-symbols-outlined text-[18px]">history_edu</span>
                    <span>Contexto e Historia</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {b.context}
                  </p>
                </div>

                {/* El Desafío Actual */}
                <div>
                  <div className="flex items-center gap-2 text-[#1a365d] dark:text-[#38bdf8] font-bold text-xs uppercase tracking-wider pb-1.5 border-b-2 border-[#c1272d] mb-2.5">
                    <span className="material-symbols-outlined text-[18px]">crisis_alert</span>
                    <span>El Desafío Actual</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {b.challenge}
                  </p>
                </div>

                {/* Motivos de Oración */}
                <div>
                  <div className="flex items-center gap-2 text-[#1a365d] dark:text-[#38bdf8] font-bold text-xs uppercase tracking-wider pb-1.5 border-b-2 border-[#c1272d] mb-3">
                    <span className="material-symbols-outlined text-[18px]">volunteer_activism</span>
                    <span>Motivos de Oración</span>
                  </div>

                  <ul className="space-y-3">
                    {b.items.map((item, idx) => (
                      <li
                        key={idx}
                        className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border-l-4 border-[#0e9594] border-y border-r border-slate-200/60 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed"
                      >
                        <strong className="text-[#1a365d] dark:text-[#38bdf8] block mb-1">
                          {item.title}:
                        </strong>
                        {item.description}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* @BARRA SOCIAL DE ORACIÓN, GUARDADO Y COMENTARIOS */}
                <div className="pt-4 border-t border-dashed border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {/* Botón He Orado */}
                    <button
                      onClick={() => onTogglePrayBlock(b.id)}
                      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                        b.hasPrayed
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {b.hasPrayed ? 'task_alt' : 'volunteer_activism'}
                      </span>
                      <span>{b.hasPrayed ? t.already_prayed : t.i_have_prayed}</span>
                      <span className="px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-[10px] font-mono-code font-bold">
                        {b.prayedCount}
                      </span>
                    </button>

                    {/* Botón Guardar en Diario */}
                    <button
                      onClick={() => onToggleSaveBlock(b)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        b.isSaved
                          ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-700 dark:text-blue-300'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {b.isSaved ? 'bookmark_added' : 'bookmark'}
                      </span>
                      <span>{b.isSaved ? t.saved_in_journal : t.save_to_journal}</span>
                    </button>
                  </div>

                  {/* Botón Comentarios */}
                  <button
                    onClick={() => setOpenCommentBlockId(isCommentsOpen ? null : b.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">chat_bubble</span>
                    <span>{t.comments_toggle}</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-[10px] font-mono-code">
                      {b.comments.length}
                    </span>
                  </button>
                </div>

                {/* Comentarios desplegables */}
                {isCommentsOpen && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    <form onSubmit={(e) => handleCommentSubmit(e, b.id)} className="flex gap-2">
                      <input
                        type="text"
                        value={commentInputs[b.id] || ''}
                        onChange={(e) => handleCommentChange(b.id, e.target.value)}
                        placeholder={t.write_comment}
                        className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-[#0e9594]"
                      />
                      <button
                        type="submit"
                        className="px-3.5 py-2 rounded-xl bg-[#0e9594] text-white text-xs font-bold hover:bg-[#0b7a79]"
                      >
                        Enviar
                      </button>
                    </form>

                    <div className="space-y-2">
                      {b.comments.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-2">
                          Sé el primero en dejar una palabra de aliento para este bloque.
                        </p>
                      ) : (
                        b.comments.map((c) => (
                          <div key={c.id} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 text-xs border border-slate-100 dark:border-slate-800">
                            <div className="flex justify-between font-bold text-[#1a365d] dark:text-[#38bdf8] mb-0.5">
                              <span>{c.author}</span>
                              <span className="font-normal text-[10px] text-slate-400">{c.date}</span>
                            </div>
                            <p className="text-slate-700 dark:text-slate-300 leading-snug">{c.text}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* =========================================================================
          BOTÓN ACORDEÓN: VER MÁS / MENOS (Exacto al código original)
          ========================================================================= */}
      <div className="text-center py-4">
        <button
          onClick={() => setShowAllBlocks(!showAllBlocks)}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border-2 border-[#0e9594] text-[#1a365d] dark:text-white font-bold text-sm hover:bg-[#0e9594] hover:text-white transition-all shadow-xs"
        >
          <span>{showAllBlocks ? t.btn_see_less : t.btn_see_more}</span>
          <span className="material-symbols-outlined text-[20px]">
            {showAllBlocks ? 'expand_less' : 'expand_more'}
          </span>
        </button>
      </div>

      {/* =========================================================================
          TARJETA DEL CONTADOR DE ORACIONES SEMANAL
          ========================================================================= */}
      <div className="rounded-2xl bg-gradient-to-br from-[#1a365d] to-[#0e9594] text-white p-6 sm:p-8 text-center shadow-lg relative overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-white/10 mx-auto flex items-center justify-center text-[#e5a93b] mb-4 border border-white/20">
          <span className="material-symbols-outlined text-[36px]">prayer_times</span>
        </div>

        <h3 className="font-serif-title text-xl sm:text-2xl font-bold mb-2">
          Cadena de Intercesión por Turquía
        </h3>
        <p className="text-xs sm:text-sm text-slate-200 max-w-md mx-auto mb-5 leading-relaxed">
          Cada semana sumamos los corazones de hermanos en todo el mundo clamando al unísono por la obra.
        </p>

        <button
          onClick={onIncrementWeeklyPrayers}
          disabled={hasPrayedWeekly}
          className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-sm shadow-md transition-all ${
            hasPrayedWeekly
              ? 'bg-white/20 text-white cursor-default border border-white/30'
              : 'bg-white text-[#1a365d] hover:bg-slate-100 hover:scale-105 active:scale-95'
          }`}
        >
          <span className="material-symbols-outlined text-[#c1272d] text-[20px]">favorite</span>
          <span>{hasPrayedWeekly ? '¡Ya te has unido esta semana!' : 'He orado por esta causa'}</span>
        </button>

        <div className="mt-6 flex flex-col items-center">
          <span className="text-3xl sm:text-4xl font-extrabold font-mono-code tabular-nums text-white">
            {totalWeeklyPrayers.toLocaleString('es-ES')}
          </span>
          <span className="text-[11px] uppercase tracking-widest text-slate-300 mt-1">
            Oraciones Registradas esta semana
          </span>
        </div>
      </div>

      {/* =========================================================================
          LLAMADO A LA ACCIÓN: GRUPO WHATSAPP
          ========================================================================= */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#131d33] border border-slate-200 dark:border-slate-800 border-l-4 border-l-[#0e9594] text-center sm:text-left sm:flex items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1 mb-4 sm:mb-0">
          <h4 className="font-serif-title text-base sm:text-lg font-bold text-[#1a365d] dark:text-white">
            ¿Deseas respaldar activamente la obra en Turquía?
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Únete a nuestro grupo oficial de WhatsApp para recibir peticiones y motivos actualizados de primera mano.
          </p>
        </div>
        <a
          href="https://wa.me/51938204456?text=Hola,%20deseo%20unirme%20al%20grupo%20de%20intercesi%C3%B3n%20por%20Turqu%C3%ADa"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#2b6cb0] hover:bg-[#1a365d] text-white font-bold text-xs sm:text-sm shadow-xs transition-colors shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">volunteer_activism</span>
          <span>Unirme al Grupo de Intercesión</span>
        </a>
      </div>
    </div>
  );
};
