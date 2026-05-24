export const APP_NAME = 'Relationship Care';

export const API_BASE_URL = __DEV__
  ? 'http://localhost:3000/api'
  : 'https://api.relationshipcare.com/api';

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  ONBOARDING_COMPLETE: 'onboarding_complete',
  THEME_MODE: 'theme_mode',
  MOOD_HISTORY: 'mood_history',
  SUGGESTION_HISTORY: 'suggestion_history',
};

export const MOOD_EMOJIS = {
  happy: '😊',
  sad: '😢',
  angry: '😠',
  neutral: '😐',
  excited: '🤩',
  stressed: '😫',
};

export const RELATIONSHIP_TYPES = [
  { label: 'Dating', value: 'dating' },
  { label: 'Engaged', value: 'engaged' },
  { label: 'Married', value: 'married' },
  { label: 'Long-term Relationship', value: 'long_term' },
];

export const GENDER_OPTIONS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
];

export const SUGGESTION_TYPES = [
  { label: 'Activity', value: 'activity' },
  { label: 'Message', value: 'message' },
  { label: 'Gift', value: 'gift' },
  { label: 'Date Night', value: 'date_night' },
  { label: 'Compliment', value: 'compliment' },
];

export const NOTIFICATION_TYPES = {
  DAILY_REMINDER: 'daily_reminder',
  INACTIVITY_PROMPT: 'inactivity_prompt',
  ANNIVERSARY_REMINDER: 'anniversary_reminder',
  MOOD_CHECK: 'mood_check',
  SUGGESTION_AVAILABLE: 'suggestion_available',
};

export const ANALYTICS_PERIODS = [
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: 'Year', value: 'year' },
];

export const MAX_AGE = 120;
export const MIN_AGE = 18;
export const OTP_LENGTH = 6;
export const OTP_RESEND_TIMEOUT = 60;

export interface QuizQuestion {
  id: string;
  question: string;
  options: { label: string; value: string }[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'loveExpression',
    question: 'How do you usually express love?',
    options: [
      { label: '💬 Talking', value: 'talking' },
      { label: '🎁 Gifts', value: 'gifts' },
      { label: '🤝 Actions', value: 'actions' },
      { label: '⏰ Time together', value: 'time_together' },
    ],
  },
  {
    id: 'partnerPreference',
    question: 'What does your partner like most?',
    options: [
      { label: '🎉 Surprises', value: 'surprises' },
      { label: '🤗 Emotional support', value: 'emotional_support' },
      { label: '🎯 Fun activities', value: 'fun_activities' },
      { label: '💭 Deep conversations', value: 'deep_conversations' },
    ],
  },
  {
    id: 'interactionFrequency',
    question: 'How often do you interact daily?',
    options: [
      { label: '🕐 Rarely', value: 'rarely' },
      { label: '🔄 Sometimes', value: 'sometimes' },
      { label: '🔥 Very frequently', value: 'very_frequently' },
    ],
  },
  {
    id: 'goal',
    question: 'What is your main goal?',
    options: [
      { label: '💬 Improve communication', value: 'improve_communication' },
      { label: '⏳ Spend more time', value: 'spend_more_time' },
      { label: '🔧 Fix issues', value: 'fix_issues' },
      { label: '✨ Keep things exciting', value: 'keep_exciting' },
    ],
  },
  {
    id: 'dailyTime',
    question: 'How much time can you spend daily for your partner?',
    options: [
      { label: '⏱ Less than 5 mins', value: 'less_than_5' },
      { label: '☕ 5–15 mins', value: '5_to_15' },
      { label: '🍽 15–30 mins', value: '15_to_30' },
      { label: '🌙 More than 30 mins', value: 'more_than_30' },
    ],
  },
];
