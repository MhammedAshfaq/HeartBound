import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ColorMode = 'light' | 'dark' | 'system';

interface SettingsState {
  colorMode: ColorMode;
}

const initialState: SettingsState = {
  colorMode: 'system',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setColorMode: (state, action: PayloadAction<ColorMode>) => {
      state.colorMode = action.payload;
    },
  },
});

export const { setColorMode } = settingsSlice.actions;
export default settingsSlice.reducer;
