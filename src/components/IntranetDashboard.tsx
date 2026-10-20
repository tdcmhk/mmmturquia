import React, { useState } from 'react';
import {
  CalendarEvent,
  Poll,
  MissionaryProject,
  ChatMessage,
  MissionaryBirthday,
  OnlineIntercessor,
  Language,
  NavTab
} from '../types';
import { translations } from '../data/i18n';

interface IntranetDashboardProps {
  events: CalendarEvent[];
  poll: Poll;
  projects: MissionaryProject[];
  chatMessages: ChatMessage[];
  birthdays: MissionaryBirthday[];
  onlineIntercessors: OnlineIntercessor[];
  lang: Language;
  onNavigateTab: (tab: NavTab) => void;
  onVotePoll: (optionId: number) => void;
  onSendChatMessage: (text: string) => void;
}

export const IntranetDashboard: React.FC<IntranetDashboardProps> = ({
  events,
  poll,
  projects,
  chatMessages,
  birthdays,
  onlineIntercessors,
  lang,
  onNavigateTab,
  onVotePoll,
  onSendChatMessage
}) => {
  const t = translations[lang] || translations.es;

  // Local states
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number>(18);
  const [expandedEventId, setExpandedEventId] = useState<string | null>('ev-1');
  const [selectedPollOption, setSelectedPollOption] = useState<number | null>(poll.userVotedOptionId || null);
  const [isVoting, setIsVoting] = useState<boolean>(false);
  const [hasVoted, setHasVoted] = useState<boolean>(Boolean(poll.userVotedOptionId));
  const [chatInput, setChatInput] = useState<string>('');
  const [showNotification, setShowNotification] = useState<boolean>(true);
  const [calendarMonthIndex, setCalendarMonthIndex] = useState<number>(0); // 0: Octubre, 1: Noviembre

  const months = ['Octubre 2026', 'Noviembre 2026'];

  const handleVote = () => {
    if (selectedPollOption === null) return;
    setIsVoting(true);
    setTimeout(() => {
      onVotePoll(selectedPollOption);
      setIsVoting(false);
      setHasVoted(true);
    }, 400);
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    onSendChatMessage(chatInput.trim());
    setChatInput('');
  };

  // Calendar days grid generator
  const daysInMonth = calendarMonthIndex === 0 ? 31 : 30;
  const startDayOffset = calendarMonthIndex === 0 ? 3 : 6; // Thursday / Sunday offset

  return (
    <div className="space-y-8">
      {/* =========================================================================
          HERO BANNER (INTRANET STYLE CON ARABESCOS & VISIÓN)
          ========================================================================= */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1a365d] via-[#1a365d]/95 to-[#0e9594] text-white shadow-xl">
        <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay">
          <img
            src="/src/assets/images/intranet_hero_bosphorus_1792130893706.jpg"
            alt="Bósforo Estambul"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Decorative Arabesque SVG Star */}
        <div className="absolute -top-12 -right-12 w-64 h-64 text-white/5 pointer-events-none">
          <svg viewBox="0 0 100 100" fill="currentColor">
            <polygon points="50,0 63,38 100,50 63,62 50,100 37,62 0,50 37,38" />
          </svg>
        </div>

        <div className="relative z-10 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[#e5a93b] text-xs font-bold tracking-wide mb-3 border border-white/20">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>{t.role_badge}</span>
              <span className="text-white/60">·</span>
              <span className="text-white">Red Global de Oración</span>
            </div>

            <h1 className="font-serif-title text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white mb-2">
              {t.welcome_back}
            </h1>

            <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-4 max-w-2xl">
              {t.welcome_sub}
            </p>

            <div className="p-3.5 sm:p-4 rounded-xl bg-black/25 backdrop-blur-sm border-l-4 border-[#e5a93b] text-xs sm:text-sm italic text-slate-100 max-w-2xl mb-6">
              {t.verse_quote}
              <span className="block not-italic font-bold text-[#e5a93b] mt-1">— {t.verse_ref}</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigateTab('boletin')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0e9594] hover:bg-[#0b7a79] text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-[18px]">menu_book</span>
                <span>{t.view_full_boletin}</span>
              </button>

              <button
                onClick={() => onNavigateTab('diario')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/25 backdrop-blur-xs transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">bookmark_heart</span>
                <span>{t.nav_diario}</span>
              </button>

              <a
                href="#agenda-misionera"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm text-slate-200 hover:text-white transition-colors"
              >
                <span>{t.calendar_title}</span>
                <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
              </a>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-white/15">
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
              <div className="text-[11px] text-slate-300 uppercase tracking-wider font-semibold">{t.stats_blocks}</div>
              <div className="text-xl sm:text-2xl font-bold font-mono-code tabular-nums text-white mt-0.5">9 Activos</div>
            </div>
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
              <div className="text-[11px] text-slate-300 uppercase tracking-wider font-semibold">{t.stats_hours}</div>
              <div className="text-xl sm:text-2xl font-bold font-mono-code tabular-nums text-[#e5a93b] mt-0.5">1,420+ h</div>
            </div>
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
              <div className="text-[11px] text-slate-300 uppercase tracking-wider font-semibold">{t.stats_cities}</div>
              <div className="text-xl sm:text-2xl font-bold font-mono-code tabular-nums text-white mt-0.5">Estambul / Bursa / Grecia</div>
            </div>
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
              <div className="text-[11px] text-slate-300 uppercase tracking-wider font-semibold">{t.stats_projects}</div>
              <div className="text-xl sm:text-2xl font-bold font-mono-code tabular-nums text-[#0e9594] mt-0.5">4 Frentes</div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          MAIN INTRANET BODY: 2 COLUMNS (CALENDAR & CHAT / POLL & PROJECTS) + SIDEBAR
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT & CENTER REGION (Cols 1-8) */}
        <div className="lg:col-span-8 space-y-8">

          {/* 1. CALENDARIO & AGENDA MISIONERA (EventON inspired) */}
          <section id="agenda-misionera" className="bg-white dark:bg-[#131d33] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1a365d]/10 dark:bg-[#1a365d]/40 text-[#1a365d] dark:text-[#38bdf8] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">calendar_month</span>
                </div>
                <div>
                  <h2 className="font-serif-title text-lg font-bold text-slate-900 dark:text-white">
                    {t.calendar_title}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Vigilias, salidas y actividades de la obra
                  </p>
                </div>
              </div>

              {/* Month Selector Controls */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={() => setCalendarMonthIndex(calendarMonthIndex === 0 ? 1 : 0)}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                  aria-label="Mes anterior"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                <span className="text-xs font-bold text-[#1a365d] dark:text-[#38bdf8] px-3 py-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg whitespace-nowrap">
                  {months[calendarMonthIndex]}
                </span>
                <button
                  onClick={() => setCalendarMonthIndex(calendarMonthIndex === 0 ? 1 : 0)}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                  aria-label="Mes siguiente"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>

            {/* Interactive Calendar Days Matrix */}
            <div className="mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
              <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                <span>Lun</span>
                <span>Mar</span>
                <span>Mié</span>
                <span>Jue</span>
                <span>Vie</span>
                <span>Sáb</span>
                <span>Dom</span>
              </div>
              <div className="grid grid-cols-7 gap-1.5">
                {/* Empty leading offsets */}
                {Array.from({ length: startDayOffset }).map((_, i) => (
                  <div key={`offset-${i}`} className="h-8 sm:h-9 flex items-center justify-center text-slate-300 dark:text-slate-700 text-xs">
                    ·
                  </div>
                ))}
                {/* Days of month */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const hasEvent = (calendarMonthIndex === 0 && (dayNum === 18 || dayNum === 25)) ||
                                   (calendarMonthIndex === 1 && (dayNum === 2 || dayNum === 14));
                  const isSelected = selectedCalendarDay === dayNum;

                  return (
                    <button
                      key={dayNum}
                      onClick={() => setSelectedCalendarDay(dayNum)}
                      className={`h-8 sm:h-9 rounded-lg text-xs font-semibold flex flex-col items-center justify-center transition-all relative ${
                        isSelected
                          ? 'bg-[#1a365d] text-white shadow-xs'
                          : hasEvent
                          ? 'bg-white dark:bg-slate-800 text-[#0e9594] border border-[#0e9594]/40 font-bold hover:bg-[#0e9594]/10'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{dayNum}</span>
                      {hasEvent && (
                        <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-[#e5a93b]' : 'bg-[#0e9594]'}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Event List (EventON style cards) */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Próximos Encuentros de Clamor & Acción
              </h3>

              {events.map((ev) => {
                const isExpanded = expandedEventId === ev.id;
                return (
                  <div
                    key={ev.id}
                    className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 transition-shadow hover:shadow-xs"
                  >
                    <button
                      onClick={() => setExpandedEventId(isExpanded ? null : ev.id)}
                      className="w-full p-4 flex items-center justify-between gap-4 text-left hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <div className="flex items-center gap-3.5">
                        {/* Event Date Block */}
                        <div className="w-12 h-12 rounded-xl bg-[#1a365d] text-white flex flex-col items-center justify-center font-mono-code shrink-0 shadow-xs">
                          <span className="text-base font-extrabold leading-none">{ev.day}</span>
                          <span className="text-[10px] uppercase font-bold text-[#e5a93b] leading-tight">{ev.month}</span>
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-sm bg-[#0e9594]/10 text-[#0e9594] dark:bg-[#0e9594]/20 uppercase text-[10px]">
                              {ev.category}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">schedule</span>
                              {ev.time}
                            </span>
                          </div>
                          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mt-0.5">
                            {ev.title}
                          </h4>
                        </div>
                      </div>

                      <span className="material-symbols-outlined text-slate-400 text-[20px] transition-transform duration-200">
                        {isExpanded ? 'expand_less' : 'expand_more'}
                      </span>
                    </button>

                    {/* Expandable Event Details */}
                    {isExpanded && (
                      <div className="p-4 pt-1 bg-slate-50/70 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-3">
                        <p className="leading-relaxed">{ev.description}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <span className="material-symbols-outlined text-[16px] text-[#0e9594]">location_on</span>
                          <span>{ev.location}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 pt-2">
                          <a
                            href="https://wa.me/51938204456?text=Deseo%20el%20enlace%20de%20la%20vigilia%20de%20Turqu%C3%ADa"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a365d] hover:bg-[#132a48] text-white text-xs font-semibold shadow-xs transition-colors"
                          >
                            <span className="material-symbols-outlined text-[16px]">videocam</span>
                            <span>{ev.linkText || 'Unirme a la Sesión'}</span>
                          </a>
                          <button
                            onClick={() => alert(`Recordatorio programado para: ${ev.title}`)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 text-xs font-medium transition-colors"
                          >
                            <span className="material-symbols-outlined text-[16px]">notification_add</span>
                            <span>Añadir a mi Calendario</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* 2. MURO DE INTERCESIÓN EN VIVO (Wise-Chat inspired) */}
          <section className="bg-white dark:bg-[#131d33] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
            <div className="flex items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0e9594]/10 text-[#0e9594] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">forum</span>
                </div>
                <div>
                  <h2 className="font-serif-title text-lg font-bold text-slate-900 dark:text-white">
                    {t.chat_title}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Comunidad de intercesores unidos en tiempo real
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                En Línea
              </span>
            </div>

            {/* Chat Messages Feed */}
            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1 mb-4">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 hover:border-slate-200 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#1a365d] to-[#0e9594] text-white flex items-center justify-center text-xs font-bold font-mono-code">
                        {msg.avatar || msg.userName.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {msg.userName}
                      </span>
                      {msg.role && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded-sm bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                          {msg.role}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono-code">{msg.timestamp}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 pl-9 leading-relaxed">
                    {msg.content}
                  </p>
                </div>
              ))}
            </div>

            {/* Chat Input & Submit */}
            <form onSubmit={handleChatSubmit} className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={t.chat_placeholder}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-[#0e9594] focus:ring-2 focus:ring-[#0e9594]/20 transition-all"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-[#0e9594] hover:bg-[#0b7a79] text-white font-bold text-xs sm:text-sm shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <span>{t.chat_send}</span>
                <span className="material-symbols-outlined text-[16px]">send</span>
              </button>
            </form>
          </section>

          {/* 3. PROYECTOS MISIONEROS (Projects showcase) */}
          <section className="bg-white dark:bg-[#131d33] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
            <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#e5a93b]/15 text-[#b45309] dark:text-[#fde68a] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">rocket_launch</span>
                </div>
                <div>
                  <h2 className="font-serif-title text-lg font-bold text-slate-900 dark:text-white">
                    {t.projects_title}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Metas de avance, financiamiento y expansión en Anatolia
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('expediciones')}
                className="text-xs font-bold text-[#0e9594] hover:underline"
              >
                Ver todos
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50/50 dark:bg-slate-900/50 flex flex-col justify-between group hover:border-[#0e9594]/50 transition-all"
                >
                  <div className="h-32 overflow-hidden relative">
                    <img
                      src={proj.image}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1a365d]/85 text-white backdrop-blur-xs">
                      {proj.status === 'completed' ? 'Completado' : `${proj.progressPercent}%`}
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif-title text-sm font-bold text-slate-900 dark:text-white mb-1.5 leading-snug">
                        {proj.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4 line-clamp-2">
                        {proj.description}
                      </p>
                    </div>

                    <div>
                      {/* Progress bar */}
                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden mb-2">
                        <div
                          className="bg-gradient-to-r from-[#0e9594] to-[#1a365d] h-full rounded-full transition-all duration-500"
                          style={{ width: `${proj.progressPercent}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono-code mb-3">
                        <span>Alcance: {proj.current}</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">{proj.goal}</span>
                      </div>

                      <button
                        onClick={() => onNavigateTab('expediciones')}
                        className="w-full py-1.5 rounded-lg border border-[#0e9594] text-[#0e9594] hover:bg-[#0e9594] hover:text-white text-xs font-bold transition-colors text-center"
                      >
                        Respaldar Movilización
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* RIGHT REGION: SIDEBAR WIDGETS (Cols 9-12) */}
        <div className="lg:col-span-4 space-y-6">

          {/* 1. ENCUESTA SEMANAL DE ORACIÓN (Weblator Poll) */}
          <section className="bg-white dark:bg-[#131d33] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
            <div className="flex items-center gap-2.5 mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="material-symbols-outlined text-[#c1272d] text-[22px]">how_to_vote</span>
              <h3 className="font-serif-title text-base font-bold text-slate-900 dark:text-white">
                {t.poll_title}
              </h3>
            </div>

            <p className="text-xs font-medium text-slate-700 dark:text-slate-200 mb-4 leading-relaxed">
              {t.poll_question}
            </p>

            <div className="space-y-2.5 mb-4">
              {poll.options.map((opt) => {
                const percentage = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;
                const isSelected = selectedPollOption === opt.id;

                return (
                  <div
                    key={opt.id}
                    onClick={() => !hasVoted && setSelectedPollOption(opt.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#0e9594] bg-[#0e9594]/5 dark:bg-[#0e9594]/10'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <input
                        type="radio"
                        name="poll_opt"
                        checked={isSelected}
                        onChange={() => !hasVoted && setSelectedPollOption(opt.id)}
                        disabled={hasVoted}
                        className="mt-0.5 text-[#0e9594] focus:ring-[#0e9594]"
                      />
                      <div className="flex-1 text-xs text-slate-800 dark:text-slate-200 font-medium">
                        {opt.text}
                      </div>
                    </div>

                    {/* Progress Bar (Visible once voted or previewed) */}
                    {hasVoted && (
                      <div className="mt-2.5 pl-6">
                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-[#0e9594] h-full rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono-code mt-1">
                          <span>{opt.votes} votos</span>
                          <span className="font-bold text-[#0e9594]">{percentage}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {!hasVoted ? (
              <button
                onClick={handleVote}
                disabled={selectedPollOption === null || isVoting}
                className={`w-full py-2 rounded-xl text-xs font-bold text-white transition-all shadow-xs flex items-center justify-center gap-1.5 ${
                  selectedPollOption === null
                    ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed'
                    : 'bg-[#0e9594] hover:bg-[#0b7a79]'
                }`}
              >
                {isVoting ? (
                  <span>Registrando...</span>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">check</span>
                    <span>{t.poll_vote}</span>
                  </>
                )}
              </button>
            ) : (
              <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs text-center font-medium border border-emerald-200 dark:border-emerald-800">
                ✨ {t.poll_voted}
              </div>
            )}
          </section>

          {/* 2. AVISO PASTORAL DE URGENCIA (Closeable Notification Card) */}
          {showNotification && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#c1272d]/10 via-[#c1272d]/5 to-transparent border border-[#c1272d]/30 text-slate-800 dark:text-slate-200 relative shadow-xs">
              <button
                onClick={() => setShowNotification(false)}
                className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                aria-label="Cerrar aviso"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>

              <div className="flex items-center gap-2 text-[#c1272d] mb-1.5 font-bold text-xs uppercase tracking-wider">
                <span className="material-symbols-outlined text-[18px]">campaign</span>
                <span>{t.sidebar_notification}</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-3 pr-4">
                {t.sidebar_notification_text}
              </p>
              <a
                href="https://wa.me/51938204456?text=Quiero%20unirme%20a%20la%20vigilia%20urgente%20por%20Turqu%C3%ADa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#c1272d] hover:underline inline-flex items-center gap-1"
              >
                <span>Confirmar asistencia</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </a>
            </div>
          )}

          {/* 3. CUMPLEAÑOS MISIONEROS (Upcoming Birthdays as in Micro Office) */}
          <section className="bg-white dark:bg-[#131d33] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="material-symbols-outlined text-[#e5a93b] text-[22px]">cake</span>
              <h3 className="font-serif-title text-base font-bold text-slate-900 dark:text-white">
                {t.sidebar_birthdays}
              </h3>
            </div>

            <div className="space-y-3">
              {birthdays.map((b) => (
                <div key={b.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#1a365d] to-[#e5a93b] text-white flex items-center justify-center font-bold text-xs font-mono-code shrink-0 shadow-xs">
                    {b.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {b.name} <span className="font-normal text-slate-400">({b.age} años)</span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{b.role}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-bold text-[#0e9594] font-mono-code block">{b.date}</span>
                    <a
                      href="https://wa.me/51938204456?text=Feliz%20cumplea%C3%B1os%20en%20el%20Se%C3%B1or"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-slate-400 hover:text-[#1a365d] underline"
                    >
                      Saludar
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 4. INTERCESORES EN LÍNEA (Who's online as in Micro Office) */}
          <section className="bg-white dark:bg-[#131d33] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0e9594] text-[22px]">public</span>
                <h3 className="font-serif-title text-base font-bold text-slate-900 dark:text-white">
                  {t.sidebar_online}
                </h3>
              </div>
              <span className="text-xs font-bold font-mono-code text-[#0e9594]">
                {onlineIntercessors.length} Activos
              </span>
            </div>

            <div className="space-y-2">
              {onlineIntercessors.map((oi) => (
                <div key={oi.id} className="flex items-center justify-between text-xs p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{oi.flag}</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{oi.name}</span>
                    <span className="text-[11px] text-slate-400 font-normal">({oi.city})</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono-code">{oi.activeMinutes}m</span>
                </div>
              ))}
            </div>
          </section>

          {/* 5. CRÓNICAS Y NOTICIAS RECIENTES DEL CAMPO */}
          <section className="bg-white dark:bg-[#131d33] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="material-symbols-outlined text-[#1a365d] dark:text-[#38bdf8] text-[22px]">newspaper</span>
              <h3 className="font-serif-title text-base font-bold text-slate-900 dark:text-white">
                {t.sidebar_recent_posts}
              </h3>
            </div>

            <div className="space-y-3.5">
              <article className="flex gap-3 group cursor-pointer" onClick={() => onNavigateTab('boletin')}>
                <img
                  src="/src/assets/images/bible_study_fellowship_1792130895365.jpg"
                  alt="Crónica 1"
                  className="w-16 h-16 rounded-xl object-cover shrink-0 group-hover:opacity-90"
                />
                <div className="flex flex-col justify-between">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#0e9594] transition-colors line-clamp-2">
                    Nuevos grupos de oración en hogares latinos de Estambul
                  </h4>
                  <div className="text-[10px] text-slate-400 font-mono-code">
                    12 Octubre · Por Movilizadora Andrea
                  </div>
                </div>
              </article>

              <article className="flex gap-3 group cursor-pointer" onClick={() => onNavigateTab('expediciones')}>
                <img
                  src="/src/assets/images/bursa_mission_field_1792130896037.jpg"
                  alt="Crónica 2"
                  className="w-16 h-16 rounded-xl object-cover shrink-0 group-hover:opacity-90"
                />
                <div className="flex flex-col justify-between">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#0e9594] transition-colors line-clamp-2">
                    Ruta pastoral trazada para la provincia de Bursa
                  </h4>
                  <div className="text-[10px] text-slate-400 font-mono-code">
                    08 Octubre · Por Pr. Vicente Tapia
                  </div>
                </div>
              </article>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
};
