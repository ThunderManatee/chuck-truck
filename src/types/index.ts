export interface User {
  id: string;
  email: string;
  name: string;
  onboardingComplete: boolean;
}

export interface BillingInfo {
  paymentMethod: string;
  details: Record<string, any>;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  previewUrl: string;
}
