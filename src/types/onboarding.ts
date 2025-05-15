
export interface OnboardingSection {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  isCurrent: boolean;
  subsections: OnboardingSubsection[];
}

export interface OnboardingSubsection {
  id: string;
  title: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  formField?: FormField;
}

export interface FormField {
  type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'submit';
  id: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  value?: string | string[] | boolean;
  sectionId: string;
  subsectionId: string;
}

export interface FormState {
  [key: string]: any;
}

export type BrandType = 'business' | 'personal' | null;
