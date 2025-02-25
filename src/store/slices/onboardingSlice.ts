import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BillingInfo {
  paymentMethod: string;
  details: Record<string, any>;
}

interface OnboardingState {
  currentStep: number;
  templateSelection: string | null;
  billingInfo: BillingInfo | null;
  isComplete: boolean;
}

const initialState: OnboardingState = {
  currentStep: 1,
  templateSelection: null,
  billingInfo: null,
  isComplete: false,
};

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    setTemplate: (state, action: PayloadAction<string>) => {
      state.templateSelection = action.payload;
    },
    setBilling: (state, action: PayloadAction<BillingInfo>) => {
      state.billingInfo = action.payload;
    },
    completeOnboarding: (state) => {
      state.isComplete = true;
    },
    resetOnboarding: (state) => {
      return initialState;
    },
  },
});

export const {
  setStep,
  setTemplate,
  setBilling,
  completeOnboarding,
  resetOnboarding,
} = onboardingSlice.actions;
export default onboardingSlice.reducer;
