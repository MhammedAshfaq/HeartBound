import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { QuizState, QuizAnswers } from '../../types';

const initialState: QuizState = {
  answers: null,
  isComplete: false,
};

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    setQuizAnswers: (state, action: PayloadAction<QuizAnswers>) => {
      state.answers = action.payload;
    },
    completeQuiz: (state) => {
      state.isComplete = true;
    },
    resetQuiz: (state) => {
      state.answers = null;
      state.isComplete = false;
    },
  },
});

export const { setQuizAnswers, completeQuiz, resetQuiz } = quizSlice.actions;
export default quizSlice.reducer;
