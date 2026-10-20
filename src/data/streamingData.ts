import { StreamingVideo, DocumentarySeries } from '../types';

export const STREAMING_FEATURED_VIDEO: StreamingVideo = {
  id: 'expedicion-2026-iv',
  title: 'Expedición 2026: En la Ruta de los Apóstoles',
  subtitle: 'Documental Oficial de la MMM Turquía',
  category: 'expedicion',
  duration: '14 min',
  year: '2026',
  videoSrc: '/assets/videos/expedicion2026iv.webm',
  thumbnail: '/assets/covers/portada1.webp',
  badge: 'ESTRENO EXCLUSIVO',
  synopsis: 'Un recorrido visual y espiritual profundo por el puente entre Europa y Asia. Conoce los frentes pioneros del Movimiento Mundial en Estambul, la meseta de Anatolia y las históricas ciudades bíblicas de Asia Menor, donde el clamor de la intercesión abre caminos.',
  scriptureRef: 'Hechos 16:9 — «Pasa a Macedonia y ayúdanos»',
  tags: ['4K Ultra HD', 'Año 2026', 'Subtítulos ES/TR', 'Exclusivo'],
  featured: true
};

export const STREAMING_VIDEOS_CAROUSEL: StreamingVideo[] = [
  {
    id: 'vid-expedicion',
    title: 'Expedición 2026: Avance',
    subtitle: 'Ruta apostólica por las 7 regiones',
    category: 'expedicion',
    duration: '14 min',
    year: '2026',
    videoSrc: '/assets/videos/expedicion2026iv.webm',
    thumbnail: '/assets/covers/portada1.webp',
    badge: '4K HD',
    synopsis: 'La travesía que documenta la visión apostólica en Turquía para el año 2026, conectando creyentes locales y la red global de oración.',
    scriptureRef: 'Hechos 1:8',
    tags: ['Expedición', 'Visión 2026', 'Intercesión'],
    featured: true
  },
  {
    id: 'vid-head2',
    title: 'Estambul: El Bósforo Clama por Salvación',
    subtitle: 'La metrópolis entre dos continentes',
    category: 'avance',
    duration: '3 min',
    year: '2026',
    videoSrc: '/assets/videos/videohead2.webm',
    thumbnail: '/assets/covers/portada2.webp',
    badge: 'CABECERA 1',
    synopsis: 'Impresionantes tomas aéreas y reflexiones espirituales sobre los 16 millones de almas que habitan a orillas del Bósforo.',
    scriptureRef: 'Salmos 2:8',
    tags: ['Estambul', 'Bósforo', 'Clamor Urbano']
  },
  {
    id: 'vid-head3',
    title: 'Anatolia Profunda: Tras las Huellas del Evangelio',
    subtitle: 'Cuna de los primeros discípulos',
    category: 'documental',
    duration: '5 min',
    year: '2026',
    videoSrc: '/assets/videos/videohead3.webm',
    thumbnail: '/assets/covers/portada3.webp',
    badge: 'HISTÓRICO',
    synopsis: 'Explorando los valles de Capadocia y las antiguas tierras de Galacia, donde la iglesia primitiva plantó la semilla incorruptible del Evangelio.',
    scriptureRef: 'Gálatas 1:2',
    tags: ['Anatolia', 'Historia Bíblica', 'Asia Menor']
  },
  {
    id: 'vid-head5',
    title: 'Vigilia de Medianoche: Luz en Medio de las Tinieblas',
    subtitle: 'Horas santas de clamor ferviente',
    category: 'mensaje',
    duration: '4 min',
    year: '2026',
    videoSrc: '/assets/videos/videohead5.webm',
    thumbnail: '/assets/covers/portada4.webp',
    badge: 'VIGILIA 24/7',
    synopsis: 'Registro audiovisual de las cadenas de oración continuas donde intercesores claman por fortaleza para las familias en dispersión.',
    scriptureRef: 'Isaías 62:6-7',
    tags: ['Vigilia', 'Oración Continua', 'Fe']
  },
  {
    id: 'vid-head6',
    title: 'Llamado a las Naciones: Visión 2026',
    subtitle: 'Movilización global',
    category: 'avance',
    duration: '6 min',
    year: '2026',
    videoSrc: '/assets/videos/videohead6.webm',
    thumbnail: '/assets/covers/coverlink2.webp',
    badge: 'VISIÓN',
    synopsis: 'Un mensaje directo sobre la necesidad de obreros y recursos espirituales para el avivamiento en el Medio Oriente.',
    scriptureRef: 'Mateo 9:37-38',
    tags: ['Movilización', 'Llamado']
  }
];

export const DOCUMENTARY_SERIES: DocumentarySeries[] = [
  {
    id: 'series-1',
    title: 'Las 7 Iglesias del Apocalipsis: De Éfeso a Laodicea',
    episodesCount: '7 Capítulos',
    coverImage: '/assets/covers/portada1.webp',
    badge: 'SERIE CENTRAL',
    category: 'Profecía & Arqueología',
    synopsis: 'Una serie documental inmersiva que visita ruina por ruina los emplazamientos bíblicos de Éfeso, Esmirna, Pérgamo, Tiatira, Sardis, Filadelfia y Laodicea.',
    releaseYear: '2026',
    rating: 'Para toda la congregación'
  },
  {
    id: 'series-2',
    title: 'La Odisea del Apóstol Pablo en Asia Menor',
    episodesCount: '4 Capítulos',
    coverImage: '/assets/covers/portada2.webp',
    badge: 'BIOGRÁFICO',
    category: 'Historia Apostólica',
    synopsis: 'Siguiendo las tres rutas de Pablo a través de Tarso, Antioquía de Pisidia, Iconio, Listra y Derbe.',
    releaseYear: '2026',
    rating: 'Recomendado'
  },
  {
    id: 'series-3',
    title: 'Intercesión en el Frente: Testimonios del Bósforo',
    episodesCount: '5 Capítulos',
    coverImage: '/assets/covers/portada3.webp',
    badge: 'TESTIMONIOS',
    category: 'Vida Movilizadora',
    synopsis: 'Historias reales de pastores, obreros y familias que han visto la mano protectora del Señor al predicar en Turquía.',
    releaseYear: '2026',
    rating: 'Inspirador'
  },
  {
    id: 'series-4',
    title: 'Vigilias en el Monte Ararat y el Éufrates',
    episodesCount: '3 Capítulos',
    coverImage: '/assets/covers/portada4.webp',
    badge: 'DOCUMENTAL',
    category: 'Geografía Sagrada',
    synopsis: 'Crónica desde las fronteras orientales de Turquía, elevando clamor en las fuentes del Éufrates y los montes de Ararat.',
    releaseYear: '2026',
    rating: 'Especial'
  },
  {
    id: 'series-5',
    title: 'Radio Esperanza: La Voz que Traspasa Fronteras',
    episodesCount: 'Especial',
    coverImage: '/assets/covers/coverlink2.webp',
    badge: 'MEDIOS',
    category: 'Radio 24/7',
    synopsis: 'El detrás de escena de las transmisiones satelitales y digitales que llevan alabanzas y predicaciones cristianas a hogares de habla hispana y turca.',
    releaseYear: '2026',
    rating: 'Exclusivo'
  }
];

export const PHOTO_HIGHLIGHTS = [
  { id: 'img-1', title: 'Estrecho del Bósforo', src: '/assets/images/imageweb1.webp', caption: 'Puente intercontinental al amanecer' },
  { id: 'img-2', title: 'Meseta de Anatolia', src: '/assets/images/imageweb2.webp', caption: 'Comunidades que esperan el mensaje' },
  { id: 'img-3', title: 'Calles de Estambul', src: '/assets/images/imageweb3.webp', caption: 'Evangelismo personal en la ciudad' },
  { id: 'img-4', title: 'Valles Históricos', src: '/assets/images/imageweb4.webp', caption: 'Refugio de los primeros creyentes' },
  { id: 'img-5', title: 'Reunión de Oración', src: '/assets/images/imageweb5.webp', caption: 'Clamor de intercesores congregados' },
  { id: 'img-6', title: 'Bautismos y Cosecha', src: '/assets/images/imageweb6.webp', caption: 'Nuevas vidas rendidas a Cristo' },
  { id: 'img-7', title: 'Capadocia Bíblica', src: '/assets/images/imageweb7.webp', caption: 'Iglesias excavadas en la roca' },
  { id: 'img-8', title: 'El Bósforo al Atardecer', src: '/assets/images/imageweb8.webp', caption: 'Horas de vigilia y clamor por la paz' }
];
