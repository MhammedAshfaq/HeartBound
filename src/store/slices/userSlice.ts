import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OnboardingState, PersonalDetails, RelationshipDetails } from '../../types';

const initialState: OnboardingState = {
  currentStep: 0,
  personalDetails: null,
  relationshipDetails: null,
  isComplete: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    setPersonalDetails: (state, action: PayloadAction<PersonalDetails>) => {
      state.personalDetails = action.payload;
    },
    setRelationshipDetails: (
      state,
      action: PayloadAction<RelationshipDetails>
    ) => {
      state.relationshipDetails = action.payload;
    },
    completeOnboarding: (state) => {
      state.isComplete = true;
    },
    resetOnboarding: (state) => {
      state.currentStep = 0;
      state.personalDetails = null;
      state.relationshipDetails = null;
      state.isComplete = false;
    },
    nextStep: (state) => {
      state.currentStep += 1;
    },
    previousStep: (state) => {
      state.currentStep -= 1;
    },
  },
});

export const {
  setCurrentStep,
  setPersonalDetails,
  setRelationshipDetails,
  completeOnboarding,
  resetOnboarding,
  nextStep,
  previousStep,
} = userSlice.actions;

export default userSlice.reducer;
