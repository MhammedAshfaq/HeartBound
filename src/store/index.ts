import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import suggestionReducer from './slices/suggestionSlice';
import moodReducer from './slices/moodSlice';
import partnerReducer from './slices/partnerSlice';
import quizReducer from './slices/quizSlice';

const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  whitelist: ['auth', 'user', 'mood', 'quiz'],
};

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  suggestion: suggestionReducer,
  mood: moodReducer,
  partner: partnerReducer,
  quiz: quizReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
