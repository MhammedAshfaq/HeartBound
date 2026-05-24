import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SuggestionState, Suggestion } from '../../types';

const initialState: SuggestionState = {
  current: null,
  history: [],
  accepted: [],
  completed: [],
  loading: false,
};

const suggestionSlice = createSlice({
  name: 'suggestion',
  initialState,
  reducers: {
    setCurrentSuggestion: (state, action: PayloadAction<Suggestion>) => {
      state.current = action.payload;
    },
    setSuggestions: (state, action: PayloadAction<Suggestion[]>) => {
      state.history = action.payload;
    },
    acceptSuggestion: (state, action: PayloadAction<string>) => {
      if (!state.accepted.includes(action.payload)) {
        state.accepted.push(action.payload);
      }
    },
    completeSuggestion: (state, action: PayloadAction<string>) => {
      if (!state.completed.includes(action.payload)) {
        state.completed.push(action.payload);
      }
      if (state.current?.id === action.payload) {
        state.current = null;
      }
    },
    skipSuggestion: (state) => {
      state.current = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearSuggestions: (state) => {
      state.current = null;
      state.history = [];
      state.accepted = [];
      state.completed = [];
    },
  },
});

export const {
  setCurrentSuggestion,
  setSuggestions,
  acceptSuggestion,
  completeSuggestion,
  skipSuggestion,
  setLoading,
  clearSuggestions,
} = suggestionSlice.actions;

export default suggestionSlice.reducer;
