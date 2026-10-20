import React, { useState, useRef, useEffect } from 'react';
import { StreamingVideo, DocumentarySeries } from '../types';
import {
  STREAMING_FEATURED_VIDEO,
  STREAMING_VIDEOS_CAROUSEL,
  DOCUMENTARY_SERIES,
  PHOTO_HIGHLIGHTS
} from '../data/streamingData';

interface StreamingViewProps {
  onNavigateTab?: (tab: any) => void;
}

export const StreamingView: React.FC<StreamingViewProps> = ({ onNavigateTab }) => {
  const [activeVideo, setActiveVideo] = useState<StreamingVideo | null>(null);
  const [myList, setMyList] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mmmturquia_streaming_list');
      return saved ? JSON.parse(saved) : ['vid-expedicion'];
    } catch {
      return ['vid-expedicion'];
    }
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [selectedSeries, setSelectedSeries] = useState<DocumentarySeries | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<{ title: string; src: string; caption: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [videoError, setVideoError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const toggleMyList = (videoId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setMyList((prev) => {
      const exists = prev.includes(videoId);
      const updated = exists ? prev.filter((id) => id !== videoId) : [...prev, videoId];
      localStorage.setItem('mmmturquia_streaming_list', JSON.stringify(updated));
      return updated;
    });
  };

  const handleOpenVideo = (video: StreamingVideo) => {
    setActiveVideo(video);
    setVideoError(false);
    setIsPlaying(true);
  };

  const handleClosePlayer = () => {
    setActiveVideo(null);
    setVideoError(false);
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const amount = direction === 'left' ? -380 : 380;
      carouselRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  // Filter videos based on category and search
  const filteredVideos = STREAMING_VIDEOS_CAROUSEL.filter((v) => {
    const matchesCat =
      selectedCategory === 'todos'
        ? true
        : selectedCategory === 'milista'
        ? myList.includes(v.id)
        : v.category === selectedCategory;
    const matchesSearch =
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.synopsis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-10 pb-16">
      {/* 1. HERO BILLBOARD BANNER (ESTILO PRIME VIDEO / NETFLIX) */}
      <section className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-[#070d19]">
        {/* Background Image / Ambient Gradient */}
        <div className="relative h-[480px] sm:h-[540px] lg:h-[580px] w-full overflow-hidden">
          {/* Subtle Ambient Video/Image Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#070d19] via-[#070d19]/80 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070d19] via-transparent to-black/40 z-10" />

          {/* Background image preview */}
          <div className="absolute inset-0 bg-slate-900">
            <img
              src="/assets/covers/portada1.webp"
              alt="Expedición 2026"
              onError={(e) => {
                // Fallback high quality missionary background if user hasn't copied portada1.webp yet
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1600&q=80';
              }}
              className="w-full h-full object-cover object-center filter brightness-50 contrast-110 scale-105 transform hover:scale-100 transition-transform duration-1000"
            />
          </div>

          {/* Hero Content Overlay */}
          <div className="relative z-20 h-full flex flex-col justify-end p-6 sm:p-10 lg:p-14 max-w-3xl">
            {/* Badges Bar */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-2.5 py-1 rounded-md bg-[#e5a93b] text-slate-950 text-xs font-black tracking-wider uppercase shadow-md flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">verified</span>
                {STREAMING_FEATURED_VIDEO.badge}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-white/10 backdrop-blur-md text-white text-xs font-bold border border-white/20">
                {STREAMING_FEATURED_VIDEO.duration}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-white/10 backdrop-blur-md text-slate-300 text-xs font-semibold">
                {STREAMING_FEATURED_VIDEO.year}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-red-600/80 text-white text-[11px] font-bold">
                4K ULTRA HD
              </span>
            </div>

            {/* Title */}
            <h1 className="font-serif-title text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight drop-shadow-lg mb-2">
              {STREAMING_FEATURED_VIDEO.title}
            </h1>

            {/* Subtitle / Bible scripture */}
            <p className="text-sm sm:text-base text-[#38bdf8] font-semibold flex items-center gap-1.5 mb-3">
              <span className="material-symbols-outlined text-[18px]">menu_book</span>
              {STREAMING_FEATURED_VIDEO.scriptureRef}
            </p>

            {/* Synopsis */}
            <p className="text-slate-300 text-sm sm:text-base line-clamp-3 mb-6 max-w-2xl leading-relaxed">
              {STREAMING_FEATURED_VIDEO.synopsis}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                onClick={() => handleOpenVideo(STREAMING_FEATURED_VIDEO)}
                className="flex items-center gap-2.5 px-6 py-3 bg-white text-slate-950 font-bold text-sm sm:text-base rounded-xl hover:bg-slate-200 transition-all transform hover:scale-105 shadow-xl shadow-black/40"
              >
                <span className="material-symbols-outlined text-[26px] text-black">play_arrow</span>
                <span>Reproducir Ahora</span>
              </button>

              <button
                onClick={() => toggleMyList(STREAMING_FEATURED_VIDEO.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all border backdrop-blur-md ${
                  myList.includes(STREAMING_FEATURED_VIDEO.id)
                    ? 'bg-[#0e9594] border-[#0e9594] text-white'
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {myList.includes(STREAMING_FEATURED_VIDEO.id) ? 'check' : 'add'}
                </span>
                <span>
                  {myList.includes(STREAMING_FEATURED_VIDEO.id) ? 'En Mi Lista' : 'Añadir a Mi Lista'}
                </span>
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('clips-oficiales');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white text-sm font-semibold border border-slate-700/60 transition-all"
              >
                <span className="material-symbols-outlined text-[19px]">info</span>
                <span>Más Capítulos</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BARRA DE CATEGORÍAS & BÚSQUEDA RÁPIDA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        {/* Pills de categorías estilo Prime */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'todos', label: 'Todos los Videos', icon: 'auto_awesome' },
            { id: 'expedicion', label: 'Expediciones', icon: 'explore' },
            { id: 'avance', label: 'Cabeceras & Avances', icon: 'movie' },
            { id: 'documental', label: 'Documentales', icon: 'history_edu' },
            { id: 'mensaje', label: 'Vigilias & Mensajes', icon: 'church' },
            { id: 'milista', label: `Mi Lista (${myList.length})`, icon: 'bookmark' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#0e9594] text-white shadow-md shadow-[#0e9594]/30'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Input de Búsqueda */}
        <div className="relative min-w-[240px]">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar videos, lugares o temas..."
            className="w-full bg-slate-800/90 border border-slate-700 text-slate-100 placeholder-slate-400 text-xs rounded-xl pl-9 pr-4 py-2 focus:outline-hidden focus:border-[#0e9594] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2 text-slate-400 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 3. CARRUSEL PRINCIPAL: VIDEOS EN REPRODUCCIÓN (.webm - expedicion2026iv, videohead2, videohead3, videohead5, videohead6) */}
      <section id="clips-oficiales" className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-6 rounded-full bg-[#0e9594]" />
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
              Videos Oficiales & Cabeceras
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold border border-slate-700">
              WebM Video Clips
            </span>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => scrollCarousel('left')}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              title="Anterior"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <button
              onClick={() => scrollCarousel('right')}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              title="Siguiente"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Horizontal Carousel */}
        <div
          ref={carouselRef}
          className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent snap-x"
        >
          {filteredVideos.map((video) => {
            const inList = myList.includes(video.id);
            return (
              <div
                key={video.id}
                onClick={() => handleOpenVideo(video)}
                className="group relative flex-none w-[280px] sm:w-[320px] bg-slate-900/90 rounded-2xl overflow-hidden border border-slate-800 hover:border-[#38bdf8]/60 shadow-lg hover:shadow-2xl hover:shadow-[#0e9594]/20 transition-all duration-300 cursor-pointer snap-start flex flex-col justify-between"
              >
                {/* Thumbnail Container */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=600&q=80';
                    }}
                    className="w-full h-full object-cover filter brightness-75 group-hover:brightness-95 group-hover:scale-105 transition-all duration-500"
                  />

                  {/* Play Button Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-white/90 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-[30px]">play_arrow</span>
                    </div>
                  </div>

                  {/* Duration Badge */}
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[11px] font-bold text-white border border-white/20">
                    {video.duration}
                  </span>

                  {/* Badge */}
                  {video.badge && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#0e9594] text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                      {video.badge}
                    </span>
                  )}

                  {/* Add to List Button */}
                  <button
                    onClick={(e) => toggleMyList(video.id, e)}
                    className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
                      inList
                        ? 'bg-[#e5a93b] text-slate-950 shadow-md'
                        : 'bg-black/60 text-white hover:bg-black/90'
                    }`}
                    title={inList ? 'En tu lista' : 'Guardar en mi lista'}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {inList ? 'check' : 'add'}
                    </span>
                  </button>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-1">
                      <span>{video.year}</span>
                      <span>•</span>
                      <span className="capitalize text-[#38bdf8] font-semibold">{video.category}</span>
                    </div>
                    <h3 className="font-bold text-white text-sm group-hover:text-[#38bdf8] transition-colors line-clamp-1 mb-1">
                      {video.title}
                    </h3>
                    <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                      {video.synopsis}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {video.tags.slice(0, 2).map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. FILA DE SERIES & DOCUMENTALES (PORTADAS portada1 a portada4, coverlink2) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-6 rounded-full bg-[#e5a93b]" />
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
              Series & Documentales de Fe
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-[#e5a93b] font-semibold border border-slate-700">
              Portadas WebP
            </span>
          </div>
        </div>

        {/* Grid de Portadas Verticales (Estilo Netflix / Prime Video) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {DOCUMENTARY_SERIES.map((serie) => (
            <div
              key={serie.id}
              onClick={() => setSelectedSeries(serie)}
              className="group relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-[#e5a93b]/70 shadow-lg hover:shadow-2xl hover:scale-102 transition-all duration-300 cursor-pointer flex flex-col"
            >
              {/* Poster 2:3 */}
              <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-950">
                <img
                  src={serie.coverImage}
                  alt={serie.title}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=600&q=80';
                  }}
                  className="w-full h-full object-cover filter brightness-85 group-hover:brightness-100 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90" />

                {/* Badge */}
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-bold text-[#e5a93b] border border-[#e5a93b]/30">
                  {serie.badge}
                </span>

                {/* Play hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                  <div className="w-11 h-11 rounded-full bg-[#e5a93b] text-slate-950 flex items-center justify-center shadow-xl">
                    <span className="material-symbols-outlined text-[26px]">info</span>
                  </div>
                </div>

                {/* Bottom title inside poster */}
                <div className="absolute bottom-2 left-2 right-2">
                  <span className="text-[10px] font-bold text-[#38bdf8] block uppercase">
                    {serie.episodesCount}
                  </span>
                  <h4 className="font-bold text-white text-xs leading-tight line-clamp-2">
                    {serie.title}
                  </h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. GALERÍA VISUAL MISIONERA (imageweb1 a imageweb8) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-6 rounded-full bg-[#38bdf8]" />
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
              Fototecas del Campo
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-[#38bdf8] font-semibold border border-slate-700">
              Galería WebP
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {PHOTO_HIGHLIGHTS.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className="group relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-[#38bdf8] cursor-pointer shadow-md hover:shadow-xl transition-all"
            >
              <img
                src={photo.src}
                alt={photo.title}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=500&q=80';
                }}
                className="w-full h-full object-cover filter brightness-75 group-hover:brightness-100 group-hover:scale-105 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2.5">
                <span className="text-white text-xs font-bold leading-tight line-clamp-1">
                  {photo.title}
                </span>
                <span className="text-slate-300 text-[10px] line-clamp-1">{photo.caption}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. BANNER INFORMATIVO: PRÓXIMAMENTE (PREPARADO PARA COMPRA/SUSCRIPCIÓN EN EL FUTURO) */}
      <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-[#1a365d]/40 to-slate-900 border border-slate-800 text-center space-y-3 relative overflow-hidden">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0e9594]/20 border border-[#0e9594]/40 text-[#38bdf8] text-xs font-bold">
          <span className="material-symbols-outlined text-[16px]">stars</span>
          Plataforma Audiovisual MMM Turquía Play
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-white">
          Acceso Libre para Intercesores & Discípulos
        </h3>
        <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
          Todos los videos, cabeceras y documentales actuales se encuentran en acceso libre para edificación de la obra.
          Más adelante se integrarán estrenos exclusivos, eventos en vivo y producciones especiales.
        </p>
      </section>

      {/* ========================================================================= */}
      {/* MODAL 1: REPRODUCTOR DE VIDEO COMPLETO (CINEMA PLAYER ESTILO NETFLIX/PRIME) */}
      {/* ========================================================================= */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          onClick={handleClosePlayer}
        >
          <div
            className="relative w-full max-w-5xl bg-slate-950 rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-800 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del modal */}
            <div className="flex items-center justify-between p-4 bg-slate-900/90 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 rounded-md bg-[#0e9594] text-white text-xs font-bold uppercase">
                  {activeVideo.category}
                </span>
                <div>
                  <h3 className="font-bold text-white text-base sm:text-lg leading-tight">
                    {activeVideo.title}
                  </h3>
                  <span className="text-xs text-slate-400">{activeVideo.duration} • {activeVideo.year}</span>
                </div>
              </div>

              <button
                onClick={handleClosePlayer}
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                title="Cerrar reproductor (Esc)"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Video Player Frame */}
            <div className="relative aspect-video w-full bg-black flex items-center justify-center">
              <video
                ref={videoRef}
                src={activeVideo.videoSrc}
                poster={activeVideo.thumbnail}
                controls
                autoPlay
                playsInline
                preload="metadata"
                onError={() => setVideoError(true)}
                className="w-full h-full object-contain"
              />

              {/* Friendly notification if the user hasn't copied the local .webm file yet */}
              {videoError && (
                <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#0e9594]/20 border border-[#0e9594]/40 flex items-center justify-center text-[#38bdf8]">
                    <span className="material-symbols-outlined text-[36px]">video_library</span>
                  </div>
                  <div className="max-w-md">
                    <h4 className="text-lg font-bold text-white mb-1">
                      Preparado para reproducir: {activeVideo.videoSrc.split('/').pop()}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed mb-3">
                      La ruta configurada es <code className="px-1.5 py-0.5 bg-slate-800 text-[#e5a93b] rounded text-[11px]">{activeVideo.videoSrc}</code>.
                    </p>
                    <p className="text-[11px] text-slate-400 bg-slate-900 p-3 rounded-xl border border-slate-800 text-left">
                      💡 <strong>Para verlo en vivo:</strong> Copia tu archivo <code className="text-white font-mono">{activeVideo.videoSrc.split('/').pop()}</code> dentro de tu carpeta <code className="text-[#38bdf8] font-mono">public/assets/videos/</code>, o si usas <strong>bunny.net</strong>, pon el enlace de tu CDN.
                    </p>
                  </div>
                  <button
                    onClick={() => setVideoError(false)}
                    className="px-4 py-2 bg-[#0e9594] hover:bg-[#0c7a79] text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    Reintentar Reproducción
                  </button>
                </div>
              )}
            </div>

            {/* Video Details & Jump to other videos */}
            <div className="p-5 sm:p-6 bg-slate-900/90 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-xs text-[#38bdf8] font-semibold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[17px]">auto_stories</span>
                    {activeVideo.scriptureRef || 'MMM Turquía — Obra'}
                  </p>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
                    {activeVideo.synopsis}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleMyList(activeVideo.id)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                      myList.includes(activeVideo.id)
                        ? 'bg-[#e5a93b] text-slate-950 border-[#e5a93b]'
                        : 'bg-slate-800 text-white border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {myList.includes(activeVideo.id) ? 'check' : 'add'}
                    </span>
                    <span>{myList.includes(activeVideo.id) ? 'En Mi Lista' : 'Guardar'}</span>
                  </button>
                </div>
              </div>

              {/* Selector de otros videos relacionados */}
              <div className="pt-3 border-t border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
                  Otros clips disponibles en este canal:
                </span>
                <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
                  {STREAMING_VIDEOS_CAROUSEL.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => handleOpenVideo(v)}
                      className={`flex items-center gap-2.5 p-2 rounded-xl border text-left shrink-0 transition-all ${
                        activeVideo.id === v.id
                          ? 'bg-[#0e9594]/20 border-[#0e9594] text-white'
                          : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px] text-[#e5a93b]">
                        play_circle
                      </span>
                      <div className="text-xs">
                        <span className="font-semibold block line-clamp-1">{v.title}</span>
                        <span className="text-[10px] text-slate-400">{v.duration}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: DETALLES DE SERIE / DOCUMENTAL (Portadas) */}
      {/* ========================================================================= */}
      {selectedSeries && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedSeries(null)}
        >
          <div
            className="relative w-full max-w-lg bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2 py-0.5 rounded-md bg-[#e5a93b] text-slate-950 text-[10px] font-black uppercase">
                  {selectedSeries.badge}
                </span>
                <h3 className="font-serif-title text-xl font-bold text-white mt-1">
                  {selectedSeries.title}
                </h3>
                <span className="text-xs text-[#38bdf8]">{selectedSeries.category} • {selectedSeries.episodesCount}</span>
              </div>
              <button
                onClick={() => setSelectedSeries(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {selectedSeries.synopsis}
            </p>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
              <span className="material-symbols-outlined text-[#38bdf8] text-[24px]">live_tv</span>
              <div className="text-xs">
                <span className="text-white font-bold block">Disponible en MMM Turquía Streaming</span>
                <span className="text-slate-400">Año de estreno: {selectedSeries.releaseYear}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedSeries(null);
                handleOpenVideo(STREAMING_FEATURED_VIDEO);
              }}
              className="w-full py-2.5 bg-[#0e9594] hover:bg-[#0c7a79] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">play_arrow</span>
              <span>Ver Episodio Piloto</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: LIGHTBOX DE FOTOS MISIONERAS */}
      {/* ========================================================================= */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-video w-full bg-black">
              <img
                src={selectedPhoto.src}
                alt={selectedPhoto.title}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-4 flex items-center justify-between bg-slate-900 border-t border-slate-800">
              <div>
                <h4 className="text-white font-bold text-sm">{selectedPhoto.title}</h4>
                <p className="text-slate-400 text-xs">{selectedPhoto.caption}</p>
              </div>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg font-bold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
