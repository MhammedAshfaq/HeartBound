import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PartnerState, User } from '../../types';

const initialState: PartnerState = {
  partner: null,
  inviteCode: null,
  syncEnabled: false,
  sharedInsights: false,
};

const partnerSlice = createSlice({
  name: 'partner',
  initialState,
  reducers: {
    setPartner: (state, action: PayloadAction<User>) => {
      state.partner = action.payload;
    },
    setInviteCode: (state, action: PayloadAction<string>) => {
      state.inviteCode = action.payload;
    },
    enableSync: (state) => {
      state.syncEnabled = true;
      state.sharedInsights = true;
    },
    disableSync: (state) => {
      state.syncEnabled = false;
      state.sharedInsights = false;
    },
    updatePartner: (state, action: PayloadAction<Partial<User>>) => {
      if (state.partner) {
        state.partner = { ...state.partner, ...action.payload };
      }
    },
    removePartner: (state) => {
      state.partner = null;
      state.inviteCode = null;
      state.syncEnabled = false;
      state.sharedInsights = false;
    },
    setSyncStatus: (
      state,
      action: PayloadAction<{ syncEnabled: boolean; sharedInsights: boolean }>
    ) => {
      state.syncEnabled = action.payload.syncEnabled;
      state.sharedInsights = action.payload.sharedInsights;
    },
  },
});

export const {
  setPartner,
  setInviteCode,
  enableSync,
  disableSync,
  updatePartner,
  removePartner,
  setSyncStatus,
} = partnerSlice.actions;

export default partnerSlice.reducer;
