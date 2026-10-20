import React, { useState, useEffect } from 'react';
import { Language, NavTab } from '../types';
import { translations } from '../data/i18n';

interface RadioViewProps {
  lang: Language;
  isPlayingRadio: boolean;
  onToggleRadio: () => void;
  onNavigateTab?: (tab: NavTab) => void;
}

interface PodcastEpisode {
  id: string;
  title: string;
  speaker: string;
  category: 'estudio' | 'testimonio' | 'adoracion' | 'devocional';
  categoryLabel: string;
  duration: string;
  date: string;
  excerpt: string;
  audioUrl: string;
  cover: string;
}

interface ScheduleProgram {
  id: string;
  startTime: string;
  endTime: string;
  startHour: number;
  endHour: number;
  title: string;
  speaker: string;
  category: 'adoracion' | 'biblia' | 'oracion' | 'movilización';
  categoryLabel: string;
  brief: string;
}

const EPISODES_DATA: PodcastEpisode[] = [
  {
    id: 'ep-1',
    title: 'El Mensaje a la Iglesia de Éfeso: El Primer Amor',
    speaker: 'Pr. Daniel Salazar',
    category: 'estudio',
    categoryLabel: 'Estudios Bíblicos',
    duration: '38 min',
    date: '12 Oct 2026',
    excerpt: 'Un recorrido histórico y espiritual por la carta enviada por Jesucristo en Apocalipsis y su relevancia para la fe viva hoy.',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'ep-2',
    title: 'Caminando por las Calles de Esmirna (İzmir)',
    speaker: 'Pr. David Ortiz',
    category: 'testimonio',
    categoryLabel: 'Testimonios',
    duration: '26 min',
    date: '10 Oct 2026',
    excerpt: 'Testimonio inspirador sobre la perseverancia de los discípulos en una de las ciudades con presencia ininterrumpida de fe.',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'ep-3',
    title: 'Alabanzas e Himnos en Lengua Turca (İlahi)',
    speaker: 'Ministerio de Adoración',
    category: 'adoracion',
    categoryLabel: 'Alabanzas Turcas',
    duration: '45 min',
    date: '07 Oct 2026',
    excerpt: 'Cánticos de adoración tradicionales traducidos e interpretados con instrumentos autóctonos como el saz y el laúd.',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'ep-4',
    title: 'El Clamor de Medianoche por las Familias',
    speaker: 'Pr. Gabriel Méndez',
    category: 'devocional',
    categoryLabel: 'Devocionales',
    duration: '31 min',
    date: '04 Oct 2026',
    excerpt: 'Petición intercesora guiada para guardar a los hogares en fe, bendición y consuelo en tiempos de prueba.',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    cover: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=600&q=80'
  }
];

const SCHEDULE_PROGRAMS: ScheduleProgram[] = [
  {
    id: 'p-1',
    startTime: '06:00',
    endTime: '08:00',
    startHour: 6,
    endHour: 8,
    title: 'Amanecer con la Palabra',
    speaker: 'Pastor Gabriel Méndez',
    category: 'biblia',
    categoryLabel: 'Estudio Bíblico',
    brief: 'Lectura devocional comentada de los Evangelios y oración de inicio de jornada.'
  },
  {
    id: 'p-2',
    startTime: '10:00',
    endTime: '12:00',
    startHour: 10,
    endHour: 12,
    title: 'Alabanzas del Bósforo & Clamor',
    speaker: 'Pr. Daniel Salazar & Equipo',
    category: 'adoracion',
    categoryLabel: 'Alabanza & Oración',
    brief: 'Música continua de adoración en español y turco, con clamor ferviente por las 7 Iglesias históricas.'
  },
  {
    id: 'p-3',
    startTime: '12:00',
    endTime: '14:00',
    startHour: 12,
    endHour: 14,
    title: 'Voz de Esperanza — Cartas de Asia Menor',
    speaker: 'Pr. David Ortiz',
    category: 'movilización',
    categoryLabel: 'Testimonios',
    brief: 'Crónicas, testimonios reales de creyentes en Turquía y avances del Evangelio en el Bósforo.'
  },
  {
    id: 'p-4',
    startTime: '14:00',
    endTime: '17:00',
    startHour: 14,
    endHour: 17,
    title: 'Armonías del Reino',
    speaker: 'Ministerio Musical',
    category: 'adoracion',
    categoryLabel: 'Música Cristiana',
    brief: 'Selección de himnos y cantos de adoración contemporánea de la iglesia en Oriente y Occidente.'
  },
  {
    id: 'p-5',
    startTime: '17:00',
    endTime: '19:00',
    startHour: 17,
    endHour: 19,
    title: 'Hora de Clamor por las 7 Iglesias',
    speaker: 'Pastores del Presbiterio',
    category: 'oracion',
    categoryLabel: 'Intercesión',
    brief: 'Tiempo solemne de intercesión por Éfeso, Esmirna, Pérgamo, Tiatira, Sardis, Filadelfia y Laodicea.'
  },
  {
    id: 'p-6',
    startTime: '21:00',
    endTime: '00:00',
    startHour: 21,
    endHour: 24,
    title: 'Vigilia de Adoración y Paz',
    speaker: 'Equipo de Transmisión',
    category: 'adoracion',
    categoryLabel: 'Vigilia Nocturna',
    brief: 'Cierre del día con cánticos espirituales, lectura solemne de las Escrituras y bendición pastoral.'
  }
];

export const RadioView: React.FC<RadioViewProps> = ({
  lang,
  isPlayingRadio,
  onToggleRadio,
  onNavigateTab
}) => {
  const t = translations[lang] || translations.es;

  // Listeners count simulation
  const [listeners, setListeners] = useState(134);
  const [selectedDayTab, setSelectedDayTab] = useState<'today' | 'tomorrow' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'>('today');
  const [scheduleCategoryFilter, setScheduleCategoryFilter] = useState<string>('all');
  
  // Volume state
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Search & filter for on-demand
  const [podcastSearch, setPodcastSearch] = useState('');
  const [selectedPodcastCategory, setSelectedPodcastCategory] = useState<string>('all');
  
  // Episode player state
  const [playingEpisode, setPlayingEpisode] = useState<PodcastEpisode | null>(null);
  const [isPlayingEpisode, setIsPlayingEpisode] = useState<boolean>(false);

  // Contact form state
  const [contactFormSubmitted, setContactFormSubmitted] = useState(false);

  // Organic listeners fluctuation
  useEffect(() => {
    const timer = setInterval(() => {
      setListeners((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(98, Math.min(220, prev + delta));
      });
    }, 18000);
    return () => clearInterval(timer);
  }, []);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'MMM Turquía — Radio Esperanza 24/7',
        text: 'Escucha en vivo Radio Esperanza 24/7 desde Turquía con alabanzas, estudio bíblico y clamor continuo:',
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('¡Enlace de Radio Esperanza copiado al portapapeles!');
    }
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handlePlayEpisode = (ep: PodcastEpisode) => {
    if (playingEpisode?.id === ep.id && isPlayingEpisode) {
      setIsPlayingEpisode(false);
    } else {
      if (isPlayingRadio) onToggleRadio(); // Pause live if playing on-demand
      setPlayingEpisode(ep);
      setIsPlayingEpisode(true);
    }
  };

  const filteredEpisodes = EPISODES_DATA.filter((ep) => {
    const matchesCat = selectedPodcastCategory === 'all' || ep.category === selectedPodcastCategory;
    const matchesSearch = !podcastSearch.trim() ||
      ep.title.toLowerCase().includes(podcastSearch.toLowerCase()) ||
      ep.speaker.toLowerCase().includes(podcastSearch.toLowerCase()) ||
      ep.excerpt.toLowerCase().includes(podcastSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const filteredSchedule = SCHEDULE_PROGRAMS.filter((p) => {
    if (scheduleCategoryFilter === 'all') return true;
    return p.category === scheduleCategoryFilter;
  });

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-16">
      {/* =========================================================================
          1. HERO RADIO: CONSOLA DE BROADCAST "ON AIR"
          ========================================================================= */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#152745] via-[#0c172a] to-[#070d19] border border-slate-700/80 p-6 sm:p-10 lg:p-12 shadow-2xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#0e9594]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Header Row: Back to Inicio, Live indicator, listener counter */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {onNavigateTab && (
                <button
                  onClick={() => onNavigateTab('portal')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-semibold text-slate-200 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  <span>Volver al Inicio</span>
                </button>
              )}

              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-red-500/15 border border-red-500/40 text-red-300 text-xs font-bold uppercase tracking-wider">
                <span className={`w-2.5 h-2.5 rounded-full bg-red-500 shadow-lg shadow-red-500/50 ${isPlayingRadio ? 'animate-ping' : ''}`} />
                <span>{t.radio_live_status}</span>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300 font-mono-code">
              <span className="material-symbols-outlined text-[16px] text-[#38bdf8]">headphones</span>
              <span>Oyentes conectados: <strong className="text-[#38bdf8] font-bold">{listeners}</strong></span>
            </div>
          </div>

          {/* Console Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-[#11203b]/80 border border-slate-700/60 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl">
            {/* Left Col: Cover Artwork & Equalizer */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-2xl overflow-hidden shadow-2xl border-2 border-[#d4af37]/60 group">
                <img
                  src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=800&q=80"
                  alt="Alabanzas del Bósforo"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Equalizer animation overlay */}
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-center gap-1.5 h-16">
                  <span className={`w-1 bg-[#d4af37] rounded-full transition-all ${isPlayingRadio ? 'h-8 animate-bounce' : 'h-2'}`} />
                  <span className={`w-1 bg-[#38bdf8] rounded-full transition-all ${isPlayingRadio ? 'h-11 animate-pulse' : 'h-3'}`} />
                  <span className={`w-1 bg-[#d4af37] rounded-full transition-all ${isPlayingRadio ? 'h-6 animate-bounce' : 'h-1.5'}`} />
                  <span className={`w-1 bg-[#38bdf8] rounded-full transition-all ${isPlayingRadio ? 'h-10 animate-pulse' : 'h-2'}`} />
                  <span className={`w-1 bg-[#d4af37] rounded-full transition-all ${isPlayingRadio ? 'h-7 animate-bounce' : 'h-3'}`} />
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3 text-xs text-slate-400 font-mono-code">
                <span className="px-2 py-0.5 rounded-sm bg-[#38bdf8]/15 text-[#38bdf8] font-bold text-[10px] border border-[#38bdf8]/30">
                  HD AUDIO
                </span>
                <span>128 Kbps • Estéreo</span>
              </div>
            </div>

            {/* Right Col: Program Info & Controls */}
            <div className="md:col-span-7 space-y-4 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs">
                <span className="font-bold text-[#fbbf24] uppercase tracking-wider">
                  ESTACIÓN PRINCIPAL
                </span>
                <span className="text-slate-400">·</span>
                <span className="px-2.5 py-0.5 rounded-sm bg-white/10 text-slate-300 font-mono-code text-[11px]">
                  10:00 - 12:00 (Hora Estambul)
                </span>
              </div>

              <h2 className="font-serif-title text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                Alabanzas del Bósforo & Clamor
              </h2>

              <p className="text-xs sm:text-sm text-slate-400 flex items-center justify-center md:justify-start gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#fbbf24]">mic</span>
                <span>Conduce: <strong className="text-white">Pr. Daniel Salazar & Equipo de Movilización</strong></span>
              </p>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                Música de adoración y alabanza continua en español y turco, intercesión por las familias en Estambul, Ankara e Esmirna, y lectura meditada de los Salmos.
              </p>

              {/* Progress Tracker */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-[11px] text-slate-400 font-mono-code">
                  <span>10:00</span>
                  <span className="text-[#fbbf24] font-semibold">En emisión continua</span>
                  <span>12:00</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-[#d4af37] to-[#38bdf8] h-full rounded-full w-2/3" />
                </div>
              </div>

              {/* Master Play Controls */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-3">
                <button
                  onClick={onToggleRadio}
                  className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#d4af37] to-[#b45309] text-[#070d19] font-extrabold text-sm sm:text-base shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                >
                  <span className="material-symbols-outlined text-[28px]">
                    {isPlayingRadio ? 'pause' : 'play_arrow'}
                  </span>
                  <span>{isPlayingRadio ? 'Pausar Transmisión' : 'Escuchar en Vivo'}</span>
                </button>

                {/* Volume & Mute */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15">
                  <button onClick={handleToggleMute} className="text-slate-300 hover:text-white" aria-label="Mute">
                    <span className="material-symbols-outlined text-[20px]">
                      {isMuted || volume === 0 ? 'volume_off' : volume < 0.5 ? 'volume_down' : 'volume_up'}
                    </span>
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      setVolume(parseFloat(e.target.value));
                      setIsMuted(false);
                    }}
                    className="w-20 accent-[#d4af37] cursor-pointer"
                  />
                  <span className="text-[11px] font-mono-code text-slate-400 min-w-8 text-right">
                    {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
                  </span>
                </div>

                {/* Share tool */}
                <button
                  onClick={handleShare}
                  className="p-3 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-slate-200 transition-colors"
                  title="Compartir señal"
                >
                  <span className="material-symbols-outlined text-[20px]">share</span>
                </button>
              </div>

              {/* Status Alert */}
              <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs flex items-center gap-2 justify-center md:justify-start">
                <span className="material-symbols-outlined text-[18px]">radio</span>
                <span>{isPlayingRadio ? 'Transmitiendo en directo — Radio Esperanza 24/7' : 'Haz clic en "Escuchar en Vivo" para iniciar la transmisión.'}</span>
              </div>
            </div>
          </div>

          {/* Teaser next show */}
          <div className="p-4 rounded-2xl bg-[#11203b]/40 border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-sm bg-[#d4af37] text-slate-900">
                A CONTINUACIÓN (12:00)
              </span>
              <strong className="text-white text-sm">Voz de Esperanza — Cartas de Asia Menor</strong>
              <span className="text-slate-400">con Pr. David Ortiz</span>
            </div>
            <a href="#programacion" className="text-[#38bdf8] font-bold hover:underline flex items-center gap-1">
              <span>Ver Guía de Programación</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. GUÍA DE PROGRAMACIÓN SEMANAL (QUÉ TRANSMITIMOS HOY)
          ========================================================================= */}
      <section id="programacion" className="space-y-6 pt-4 border-t border-slate-800">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#d4af37]">
            Guía al Aire
          </span>
          <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-white">
            Programación de la Radio
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
            Conoce los horarios de nuestros programas de estudio, adoración, intercesión y mensajes diarios transmitidos desde Turquía para las naciones.
          </p>
        </div>

        {/* Days Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { id: 'today', label: 'Hoy' },
            { id: 'tomorrow', label: 'Mañana' },
            { id: 'mon', label: 'Lunes' },
            { id: 'tue', label: 'Martes' },
            { id: 'wed', label: 'Miércoles' },
            { id: 'thu', label: 'Jueves' },
            { id: 'fri', label: 'Viernes' },
            { id: 'sat', label: 'Sábado' },
            { id: 'sun', label: 'Domingo' }
          ].map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedDayTab(d.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                selectedDayTab === d.id
                  ? 'bg-[#d4af37] text-slate-900 shadow-md'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'adoracion', label: 'Alabanza y Adoración' },
            { id: 'biblia', label: 'Estudio Bíblico' },
            { id: 'oracion', label: 'Oración e Intercesión' },
            { id: 'mision', label: 'Testimonios' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setScheduleCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                scheduleCategoryFilter === cat.id
                  ? 'bg-white text-slate-900'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Timeline Grid */}
        <div className="space-y-3">
          {filteredSchedule.map((prog) => {
            const isLiveNow = prog.id === 'p-2';

            return (
              <div
                key={prog.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  isLiveNow
                    ? 'bg-gradient-to-r from-[#d4af37]/15 to-[#11203b] border-[#d4af37] shadow-lg shadow-[#d4af37]/10'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Time Badge */}
                  <div className="w-28 shrink-0">
                    <span className="text-base font-bold font-mono-code text-white block">
                      {prog.startTime} - {prog.endTime}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isLiveNow ? 'text-red-400 animate-pulse' : 'text-slate-500'}`}>
                      {isLiveNow ? '● AL AIRE AHORA' : 'Programado'}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded-sm bg-[#d4af37]/20 text-[#fbbf24] uppercase">
                        {prog.categoryLabel}
                      </span>
                    </div>
                    <h4 className="font-serif-title text-base sm:text-lg font-bold text-white">
                      {prog.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-1">{prog.brief}</p>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">person</span>
                      <span>{prog.speaker}</span>
                    </div>
                  </div>
                </div>

                <div className="self-end md:self-center shrink-0">
                  {isLiveNow ? (
                    <button
                      onClick={onToggleRadio}
                      className="px-4 py-2 rounded-full bg-[#d4af37] text-slate-900 font-bold text-xs flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 transition-all"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {isPlayingRadio ? 'pause' : 'volume_up'}
                      </span>
                      <span>{isPlayingRadio ? 'Pausar' : 'Sintonizar'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => alert(`Recordatorio fijado para: ${prog.title} a las ${prog.startTime}`)}
                      className="px-3.5 py-1.5 rounded-full border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">notifications</span>
                      <span>Recordarme</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          3. FONOTECA A LA CARTA / PROGRAMAS GRABADOS (PODCASTS)
          ========================================================================= */}
      <section id="fonoteca" className="space-y-6 pt-4 border-t border-slate-800">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#38bdf8]">
            Fonoteca a la Carta
          </span>
          <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-white">
            Biblioteca de Programas Grabados
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
            Escucha en cualquier momento los estudios bíblicos, testimonios del campo y mensajes que ya han sido emitidos en nuestra radio.
          </p>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative max-w-md w-full">
            <span className="material-symbols-outlined text-slate-400 absolute left-3 top-2.5 text-[20px]">
              search
            </span>
            <input
              type="text"
              value={podcastSearch}
              onChange={(e) => setPodcastSearch(e.target.value)}
              placeholder="Buscar por tema, pastor o palabra clave..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white text-xs sm:text-sm focus:outline-hidden focus:border-[#38bdf8]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'estudio', label: 'Estudios' },
              { id: 'testimonio', label: 'Testimonios' },
              { id: 'adoracion', label: 'Alabanzas Turcas' },
              { id: 'devocional', label: 'Devocionales' }
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedPodcastCategory(c.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  selectedPodcastCategory === c.id
                    ? 'bg-[#38bdf8] text-slate-950 font-bold'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Episodes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredEpisodes.map((ep) => {
            const isPlayingThis = playingEpisode?.id === ep.id && isPlayingEpisode;

            return (
              <article
                key={ep.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden flex flex-col justify-between hover:border-[#38bdf8]/40 transition-all group"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={ep.cover}
                    alt={ep.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={() => handlePlayEpisode(ep)}
                    className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-[#d4af37] text-slate-900 flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined text-[28px]">
                      {isPlayingThis ? 'pause' : 'play_arrow'}
                    </span>
                  </button>
                  <span className="absolute bottom-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/70 text-white font-mono-code">
                    {ep.duration}
                  </span>
                </div>

                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-[#d4af37] uppercase tracking-wider">
                      {ep.categoryLabel}
                    </span>
                    <h4 className="font-serif-title text-base font-bold text-white line-clamp-2">
                      {ep.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {ep.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{ep.date}</span>
                    <strong className="text-slate-300">{ep.speaker}</strong>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          4. FORMULARIO PASTORAL DE CONTACTO & PETICIONES (CONÓCENOS)
          ========================================================================= */}
      <section id="contacto" className="space-y-6 pt-4 border-t border-slate-800">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#11203b] to-[#070d19] border border-slate-700 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#d4af37]">
              Contacto Exclusivo
            </span>
            <h3 className="font-serif-title text-2xl sm:text-3xl font-bold text-white">
              Conéctate con Nosotros y Déjanos tu Solicitud
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              El acceso a nuestros grupos de intercesión de WhatsApp y materiales específicos es reservado y coordinado de forma directa.
            </p>
            <div className="space-y-3 pt-2 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[#25d366] text-[20px] shrink-0">chat</span>
                <div>
                  <strong className="text-white block">Grupo de Oración en WhatsApp</strong>
                  <span>Coordinación pastoral y motivos diarios de clamor.</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[#38bdf8] text-[20px] shrink-0">radio</span>
                <div>
                  <strong className="text-white block">Peticiones para la Radio</strong>
                  <span>Oramos en vivo por tu familia, salud y ciudad.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-slate-900/80 p-6 rounded-2xl border border-slate-700">
            {contactFormSubmitted ? (
              <div className="p-6 text-center space-y-2 text-emerald-400">
                <span className="material-symbols-outlined text-[36px]">check_circle</span>
                <h4 className="font-bold text-base">¡Solicitud enviada con éxito!</h4>
                <p className="text-xs text-slate-300">El equipo pastoral revisará tu mensaje y se pondrá en contacto contigo.</p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setContactFormSubmitted(true);
                }}
                className="space-y-3"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Nombre y Apellidos *"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-700 bg-slate-800 text-white focus:outline-hidden focus:border-[#d4af37]"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Correo Electrónico *"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-700 bg-slate-800 text-white focus:outline-hidden focus:border-[#d4af37]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="tel"
                    required
                    placeholder="WhatsApp con código de país *"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-700 bg-slate-800 text-white focus:outline-hidden focus:border-[#d4af37]"
                  />
                  <input
                    type="text"
                    required
                    placeholder="País y Ciudad *"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-700 bg-slate-800 text-white focus:outline-hidden focus:border-[#d4af37]"
                  />
                </div>

                <select
                  required
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-700 bg-slate-800 text-white focus:outline-hidden focus:border-[#d4af37]"
                >
                  <option value="">¿Cómo te gustaría involucrarte? *</option>
                  <option value="wsp">Deseo unirme al grupo de WhatsApp y Red de Intercesión</option>
                  <option value="info">Deseo conocer más sobre la obra en Turquía</option>
                  <option value="oracion">Petición de oración personal para la Radio</option>
                  <option value="mision">Interés en apoyo o expediciones</option>
                </select>

                <textarea
                  rows={3}
                  placeholder="Escribe tu mensaje, testimonio o petición de oración aquí..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-700 bg-slate-800 text-white focus:outline-hidden focus:border-[#d4af37] resize-none"
                />

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b45309] text-[#070d19] font-bold text-xs shadow-md transition-all"
                >
                  Enviar Solicitud al Equipo Pastoral
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
