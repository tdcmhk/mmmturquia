export type Language = 'es' | 'tr' | 'en' | 'it';

export type UserRole = 'seguidor' | 'intercesor' | 'patrocinador' | 'admin';

export type NavTab = 'portal' | 'radio' | 'streaming' | 'home' | 'boletin' | 'diario' | 'expediciones' | 'ramadan' | 'perfil' | 'admin'| 'settings';

export interface StreamingVideo {
  id: string;
  title: string;
  subtitle?: string;
  category: 'expedicion' | 'documental' | 'mensaje' | 'avance';
  duration: string;
  year: string;
  videoSrc: string;
  thumbnail: string;
  badge?: string;
  synopsis: string;
  scriptureRef?: string;
  tags: string[];
  featured?: boolean;
}

export interface DocumentarySeries {
  id: string;
  title: string;
  episodesCount: string;
  coverImage: string;
  badge: string;
  category: string;
  synopsis: string;
  releaseYear: string;
  rating: string;
}

export interface UserProfile {
  uid: string;
  nombre: string;
  apellido?: string;
  email: string;
  whatsapp: string;
  pais: string;
  iglesia: string;
  rol: UserRole;
  aprobado: boolean;
  solicitud?: UserRole;
  fechaRegistro?: string;
}

export interface PrayerItem {
  title: string;
  description: string;
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  date: string;
}

export interface PrayerBlock {
  id: string;
  number: number;
  title: string;
  scriptureRef: string;
  scriptureText: string;
  context: string;
  challenge: string;
  items: PrayerItem[];
  imageUrl: string;
  prayedCount: number;
  hasPrayed?: boolean;
  isSaved?: boolean;
  comments: Comment[];
  isExtra?: boolean;
}

export interface CalendarEvent {
  id: string;
  day: number;
  month: string;
  year: number;
  title: string;
  time: string;
  location: string;
  category: 'vigilia' | 'discipulado' | 'mision' | 'reunion';
  description: string;
  linkText?: string;
  zoomUrl?: string;
}

export interface PollOption {
  id: number;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  userVotedOptionId?: number | null;
}

export interface MissionaryProject {
  id: string;
  title: string;
  description: string;
  progressPercent: number;
  goal: string;
  current: string;
  status: 'active' | 'completed' | 'preparation';
  image: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
  avatar?: string;
  role?: string;
}

export interface MissionaryBirthday {
  id: string;
  name: string;
  role: string;
  age: number;
  date: string;
  avatar: string;
}

export interface OnlineIntercessor {
  id: string;
  name: string;
  country: string;
  city: string;
  flag: string;
  activeMinutes: number;
}

export interface PrayerResponseComment {
  id: string;
  author: string;
  text: string;
  date: string;
}

export interface DailyPrayerMotive {
  id: string;
  title: string;
  description?: string;
  isAnswered?: boolean;
  answeredDate?: string;
  responseComments?: PrayerResponseComment[];
}

export interface DailyPrayerEntry {
  id: string;
  title: string;
  scripture?: string;
  category: 'orado' | 'guardado' | 'contestado' | 'propio';
  date: string;
  notes?: string;
  blockId?: string;
  blockNumber?: number;
  items?: DailyPrayerMotive[];
  isAnswered?: boolean;
  answeredDate?: string;
  responseComments?: PrayerResponseComment[];
}
