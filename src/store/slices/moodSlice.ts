import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MoodState, MoodType, MoodEntry, MoodTrend } from '../../types';

const initialState: MoodState = {
  current: null,
  history: [],
  trends: [],
};

const moodSlice = createSlice({
  name: 'mood',
  initialState,
  reducers: {
    setCurrentMood: (state, action: PayloadAction<MoodType>) => {
      state.current = action.payload;
    },
    addMoodEntry: (state, action: PayloadAction<MoodEntry>) => {
      state.history.unshift(action.payload);
      state.current = action.payload.mood;
    },
    setMoodHistory: (state, action: PayloadAction<MoodEntry[]>) => {
      state.history = action.payload;
      if (action.payload.length > 0) {
        state.current = action.payload[0].mood;
      }
    },
    setMoodTrends: (state, action: PayloadAction<MoodTrend[]>) => {
      state.trends = action.payload;
    },
    clearMoodData: (state) => {
      state.current = null;
      state.history = [];
      state.trends = [];
    },
  },
});

export const {
  setCurrentMood,
  addMoodEntry,
  setMoodHistory,
  setMoodTrends,
  clearMoodData,
} = moodSlice.actions;

export default moodSlice.reducer;
