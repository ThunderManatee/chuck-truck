import React, { createContext, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery, useMutation } from "react-query";
import { RootState } from "../store";
import {
  setStep,
  setTemplate,
  setBilling,
  completeOnboarding,
  resetOnboarding,
} from "../store/slices/onboardingSlice";
import api from "../services/api";

interface OnboardingContextType {
  saveTemplate: (templateId: string) => Promise<void>;
  saveBillingInfo: (billingInfo: BillingInfo) => Promise<void>;
  completeOnboardingFlow: () => Promise<void>;
  resetOnboardingFlow: () => void;
  goToStep: (step: number) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
);

export function OnboardingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();

  // Query for available templates
  const { data: templates } = useQuery("templates", async () => {
    const response = await api.get("/templates");
    return response.data;
  });

  // Mutation for saving template selection
  const templateMutation = useMutation(
    async (templateId: string) => {
      await api.post("/onboarding/template", { templateId });
      return templateId;
    },
    {
      onSuccess: (templateId) => {
        dispatch(setTemplate(templateId));
      },
    }
  );

  // Mutation for saving billing info
  const billingMutation = useMutation(
    async (billingInfo: BillingInfo) => {
      await api.post("/onboarding/billing", billingInfo);
      return billingInfo;
    },
    {
      onSuccess: (billingInfo) => {
        dispatch(setBilling(billingInfo));
      },
    }
  );

  // Mutation for completing onboarding
  const completeMutation = useMutation(
    async () => {
      await api.post("/onboarding/complete");
    },
    {
      onSuccess: () => {
        dispatch(completeOnboarding());
      },
    }
  );

  const saveTemplate = async (templateId: string) => {
    await templateMutation.mutateAsync(templateId);
  };

  const saveBillingInfo = async (billingInfo: BillingInfo) => {
    await billingMutation.mutateAsync(billingInfo);
  };

  const completeOnboardingFlow = async () => {
    await completeMutation.mutateAsync();
  };

  const resetOnboardingFlow = () => {
    dispatch(resetOnboarding());
  };

  const goToStep = (step: number) => {
    dispatch(setStep(step));
  };

  const value = {
    saveTemplate,
    saveBillingInfo,
    completeOnboardingFlow,
    resetOnboardingFlow,
    goToStep,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

// Custom hook that combines context and redux state
export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  const onboardingState = useSelector((state: RootState) => state.onboarding);

  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }

  return {
    ...context,
    ...onboardingState,
    isLoading:
      templateMutation?.isLoading ||
      billingMutation?.isLoading ||
      completeMutation?.isLoading,
  };
};
