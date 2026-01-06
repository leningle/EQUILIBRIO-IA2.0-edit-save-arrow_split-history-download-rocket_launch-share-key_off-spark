
export enum RoutineType {
  MORNING_PRODUCTIVE = 'Mañana Productiva',
  AFTERNOON_FOCUS = 'Tarde de Foco',
  SPLIT_SHIFT = 'Jornada Partida',
  CUSTOM = 'Personalizada',
  PDF_IMPORTED = 'Agenda Personal (Importada PDF)',
  EL_CAMBIO = 'El Cambio',
  DAILY_HABITS = 'Tareas del Día a Día'
}

export interface TimeBlock {
  id: string;
  time: string;
  activity: string;
  type: 'work' | 'sacred' | 'personal' | 'break' | 'chore';
  status?: 'pending' | 'completed' | 'canceled';
  alarmEnabled?: boolean;
  enforceLock?: boolean;
  audioNote?: string; 
  isExtra?: boolean;
}

export interface Routine {
  id: string;
  name: string;
  description: string;
  blocks: TimeBlock[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  isThinking?: boolean;
  analysis?: {
    intent: string;
    state: string;
    checkpoint: string;
  };
}

export enum ModelType {
  FLASH_LITE = 'fast',
  PRO = 'smart',
  THINKING = 'thinking',
}

export interface UserProfileExtended {
  // Identity
  username: string;
  avatarName: string;
  status: string;
  avatar: string; // base64
  profilePic: string; // base64
  
  // Demographics
  email: string;
  phone: string;
  location: string;
  birthDate: string;
  gender: string;
  sexualOrientation: string;
  race: string;
  religion: string;
  politics: string;
  education: string;
  occupation: string;
  salary: string;
  maritalStatus: string;
  children: number;
  pets: number;

  // Material Assets
  cars: number;
  houses: number;
  apartments: number;
  bikes: number;
  motorcycles: number;
  boats: number;
  airplanes: number;
  yachts: number;
  mansions: number;
  estates: number;
  islands: number;
  countries: number;
  cities: number;
  towns: number;
  villages: number;
  continents: number;

  // Cosmic Assets
  planets: number;
  galaxies: number;
  universes: number;
  dimensions: number;
  realms: number;

  // Metaphysical Planes (Dynamic Dictionary for flexibility)
  planes: Record<string, number>;
}

export interface RoomData {
  name: string;
  backgroundUrl?: string; // base64 or url
  rules: string[];
  bulletinBoard: { id: string; text: string; date: string; author: string }[];
  dailyOptions: { id: string; text: string; completed: boolean }[]; // Fixed 15
  photos: { id: string; url: string; date: string }[]; // base64
  albums: { id: string; name: string; photos: string[] }[];
  videos: { id: string; url: string; name: string }[];
  members: string[];
}

export interface AppSettings {
  vitaminDTime: string;
  vitaminDEnabled: boolean;
  theme: 'light' | 'dark' | 'system';
  accentColor: string; // Hex code
  primaryColor: string; // Hex code
  backgroundColor: string; // Hex code or URL
  textColor: string;
  textSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fontFamily: string;
  
  appVolume: number;
  customAlarmUrl?: string;
  userAvatar?: string;
  mentorAvatar?: string;
  unbreakableChain: string[]; 
  lastInteractionTimestamp?: number;
  waterReminderEnabled: boolean;
  waterReminderInterval: number;
  lastWaterTimestamp?: number;
  personalPurpose?: string;
  personalForm?: string;
  ironNotes?: string;
  ironActivityLog?: string[];
  isMovementActive?: boolean;
  movementLog?: { timestamp: number; active: boolean }[];
  activeLawId?: string;
  
  // Extended Profile
  profile: UserProfileExtended;
  
  // Room Data
  room: RoomData;
  
  // UI Preferences
  language: 'es' | 'en' | 'fr' | 'de' | 'it' | 'pt' | 'ru' | 'zh' | 'ja';
  privacyMode: boolean;
  notificationsEnabled: boolean;
  
  // Stats
  growthPercentage: number;
}

export type GoalPeriod = 'diario' | 'semanal' | 'mensual' | 'anual';

export interface Goal {
  id: string;
  text: string;
  period: GoalPeriod;
  completed: boolean;
}

export interface DailyEvaluation {
  date: string;
  rating: number;
  planCompletion: 'yes' | 'partial' | 'no';
  moodEmoji: string;
  energyLevel: number;
  audioNote?: string;
  interactionScore: number;
}

export interface DailyStats {
  date: string;
  score: number;
}

export interface RetroEntry {
  date: string;
  wentWell: string;
  toImprove: string;
  actionItem: string;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  targetMuscle: string;
  exercises: {
    name: string;
    sets: string;
    reps: string;
    notes?: string;
  }[];
}