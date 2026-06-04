export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum RelationshipType {
  Dating = 'dating',
  Married = 'married',
  Engaged = 'engaged',
  LongTerm = 'long_term',
}

export enum MoodType {
  Happy = 'happy',
  Sad = 'sad',
  Angry = 'angry',
  Neutral = 'neutral',
  Excited = 'excited',
  Stressed = 'stressed',
}

export enum SuggestionType {
  Activity = 'activity',
  Message = 'message',
  Gift = 'gift',
  DateNight = 'date_night',
  Compliment = 'compliment',
}

export enum DayType {
  Weekday = 'weekday',
  Weekend = 'weekend',
  Anniversary = 'anniversary',
  Special = 'special',
}

export enum NotificationTrigger {
  TimeBased = 'time_based',
  Inactivity = 'inactivity',
  SpecialEvent = 'special_event',
}

export interface User {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  email?: string;
  phone?: string;
  avatar?: string;
}

export interface RelationshipDetails {
  type: RelationshipType;
  anniversary: Date;
  partnerId?: string;
}

export interface PersonalDetails {
  name: string;
  age: number;
  gender: Gender;
}

export interface Suggestion {
  id: string;
  title: string;
  description: string;
  type: SuggestionType;
  priority: number;
  completed?: boolean;
}

export interface MoodEntry {
  id: string;
  mood: MoodType;
  note?: string;
  timestamp: Date;
}

export interface MoodTrend {
  date: string;
  mood: MoodType;
  count: number;
}

export interface AnalyticsMetrics {
  interactionScore: number;
  completionRate: number;
  moodTrends: MoodTrend[];
  streakDays: number;
  totalSuggestions: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: NotificationTrigger;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  onboardingComplete: boolean;
}

export interface OnboardingState {
  currentStep: number;
  personalDetails: PersonalDetails | null;
  relationshipDetails: RelationshipDetails | null;
  isComplete: boolean;
}

export interface SuggestionState {
  current: Suggestion | null;
  history: Suggestion[];
  accepted: string[];
  completed: string[];
  loading: boolean;
}

export interface MoodState {
  current: MoodType | null;
  history: MoodEntry[];
  trends: MoodTrend[];
}

export interface PartnerState {
  partner: User | null;
  inviteCode: string | null;
  syncEnabled: boolean;
  sharedInsights: boolean;
}

export enum ErrorType {
  NETWORK = 'NETWORK',
  AUTH = 'AUTH',
  API = 'API',
  VALIDATION = 'VALIDATION',
  UNKNOWN = 'UNKNOWN',
}

export interface AppError {
  type: ErrorType;
  message: string;
  code?: number;
}

export interface QuizAnswers {
  loveExpression: string;
  partnerPreference: string;
  interactionFrequency: string;
  goal: string;
  dailyTime: string;
}

export interface QuizState {
  answers: QuizAnswers | null;
  isComplete: boolean;
}

export enum TodoPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum TodoCategory {
  Connection = 'connection',
  Date = 'date',
  Gift = 'gift',
  Communication = 'communication',
  Other = 'other',
}

export interface TodoItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: TodoPriority;
  category: TodoCategory;
  createdAt: string;
  completedAt?: string;
}

export type TodoFilter = 'all' | 'active' | 'completed';

export interface TodoState {
  items: TodoItem[];
  filter: TodoFilter;
}
