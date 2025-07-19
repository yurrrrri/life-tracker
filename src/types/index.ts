// Weather enum
export enum Weather {
  SUNNY = 'SUNNY',
  PARTLY_CLOUDY = 'PARTLY_CLOUDY',
  CLOUDY = 'CLOUDY',
  LIGHT_RAIN = 'LIGHT_RAIN',
  HEAVY_RAIN = 'HEAVY_RAIN',
  SLEET = 'SLEET',
  SNOW = 'SNOW',
  HEAT_WAVE = 'HEAT_WAVE',
  COLD_WAVE = 'COLD_WAVE',
  WINDY = 'WINDY',
  FOGGY = 'FOGGY',
  THUNDER = 'THUNDER',
  TYPHOON = 'TYPHOON',
}

// Feeling enum
export enum Feeling {
  NEUTRAL = 'NEUTRAL',
  CALM = 'CALM',
  SAD = 'SAD',
  DEPRESSED = 'DEPRESSED',
  MELANCHOLY = 'MELANCHOLY',
  ANGRY = 'ANGRY',
  PASSIONATE = 'PASSIONATE',
  HAPPY = 'HAPPY',
  JOYFUL = 'JOYFUL',
  TIRED = 'TIRED',
  IRRITATED = 'IRRITATED',
  SURPRISED = 'SURPRISED',
  INTERESTED = 'INTERESTED',
}

// Todo Status enum
export enum TodoStatus {
  NOT_STARTED = 'NOT_STARTED',
  JUST_STARTED = 'JUST_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  PENDING = 'PENDING',
  ONEDAY = 'ONEDAY',
  DONE = 'DONE',
}

// Anniversary Type enum
export enum AnniversaryType {
  HOLIDAY = 'HOLIDAY',
  SPECIAL = 'SPECIAL',
}

// Anniversary Weight enum
export enum AnniversaryWeight {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

// Stats Strategy enum
export enum StatsStrategy {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
  WEATHER_MONTHLY = 'WEATHER_MONTHLY',
}

// Font Type enum
export enum FontType {
  DEFAULT = 'DEFAULT',
  SERIF = 'SERIF',
  MONOSPACE = 'MONOSPACE',
}

// Profile entity
export interface Profile {
  id: string
  name: string
  birthDate: string
  phoneNumber: string
  remark: string
  registeredOn: number
}

// Certification entity
export interface Certification {
  id: string
  name: string
  date: string
  instituteName: string
  imageId: string
  registeredOn: number
  modifiedOn: number
}

// Anniversary entity
export interface Anniversary {
  id: string
  type: AnniversaryType
  date: string
  name: string
  weight?: AnniversaryWeight
  registeredOn: number
  modifiedOn: number
}

// Period interface
export interface Period {
  startDate: string
  endDate: string
}

// History entity
export interface History {
  id: string
  title: string
  contents: string
  period: Period
  registeredOn: number
  modifiedOn: number
}

// Journal entity
export interface Journal {
  id: string
  date: string
  weather?: Weather
  weatherComment?: string
  feeling: Feeling
  feelingComment?: string
  contents?: string
  imageId1?: string
  imageId2?: string
  memo?: string
  saved: boolean
  locked: boolean
  registeredOn: number
  modifiedOn: number
}

// Image entity
export interface Image {
  id: string
  filename: string
  path: string
  forJournal: boolean
  registeredOn: number
}

// FeelingStats entity
export interface FeelingStats {
  id: string
  strategy: StatsStrategy
  period: string
  feeling: Feeling
  count: number
  registeredOn: number
}

// Category entity
export interface Category {
  id: string
  name: string
  color: string
  removed: boolean
}

// Todo entity
export interface Todo {
  id: string
  categoryId: string
  contents: string
  memo?: string
  isPeriod: boolean
  startDateTime: string
  endDateTime: string
  status: TodoStatus
  registeredOn: number
}

// Settings entity
export interface Settings {
  id: string
  password: string
  notificationTime: string
  isDark: boolean
  fontType: FontType
  registeredOn: number
}

// TodoStats entity
export interface TodoStats {
  id: string
  strategy: StatsStrategy
  period: string
  status: TodoStatus
  count: number
  registeredOn: number
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  currentPage: number
  size: number
}

// Form types
export interface JournalFormData {
  date: string
  weather?: Weather
  weatherComment?: string
  feeling: Feeling
  feelingComment?: string
  contents?: string
  images?: File[]
  memo?: string
  locked: boolean
}

export interface TodoFormData {
  categoryId: string
  contents: string
  memo?: string
  isPeriod: boolean
  startDateTime: string
  endDateTime: string
  status: TodoStatus
}

export interface ProfileFormData {
  name: string
  birthDate: string
  phoneNumber: string
  remark: string
}

export interface SettingsFormData {
  password: string
  notificationTime: string
  isDark: boolean
  fontType: FontType
} 