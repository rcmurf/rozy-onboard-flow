import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ChatMessage, FormField, FormState, OnboardingSection, OnboardingSubsection, BrandType } from '@/types/onboarding';
import { v4 as uuidv4 } from 'uuid';

interface OnboardingContextType {
  sections: OnboardingSection[];
  messages: ChatMessage[];
  formState: FormState;
  currentSectionId: string;
  currentSubsectionId: string;
  isTyping: boolean;
  brandType: BrandType;
  addUserMessage: (content: string) => void;
  addAssistantMessage: (content: string, formField?: FormField) => void;
  updateFormState: (fieldId: string, value: any) => void;
  advanceToNextSection: () => void;
  goToSection: (sectionId: string, subsectionId: string) => void;
  completeCurrentSection: () => void;
  submitFormField: (fieldId: string, value: any) => Promise<void>;
  setIsTyping: (isTyping: boolean) => void;
  setBrandType: (type: BrandType) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const initialSections: OnboardingSection[] = [
  {
    id: 'brand-type',
    title: 'Brand Type',
    description: 'Select your brand type',
    isCompleted: false,
    isCurrent: true,
    subsections: [
      {
        id: 'brand-selection',
        title: 'Brand Selection',
        isCompleted: false,
        isCurrent: true,
      }
    ]
  },
  {
    id: 'personal-info',
    title: 'Personal Information',
    description: 'Basic details about you',
    isCompleted: false,
    isCurrent: false,
    subsections: [
      {
        id: 'name-email',
        title: 'Name & Contact',
        isCompleted: false,
        isCurrent: false,
      },
      {
        id: 'background',
        title: 'Background',
        isCompleted: false,
        isCurrent: false,
      }
    ]
  },
  {
    id: 'professional',
    title: 'Professional Details',
    description: 'Your work experience and skills',
    isCompleted: false,
    isCurrent: false,
    subsections: [
      {
        id: 'work-experience',
        title: 'Work Experience',
        isCompleted: false,
        isCurrent: false,
      },
      {
        id: 'skills',
        title: 'Skills & Expertise',
        isCompleted: false,
        isCurrent: false,
      }
    ]
  },
  {
    id: 'preferences',
    title: 'Preferences',
    description: 'Your preferences and requirements',
    isCompleted: false,
    isCurrent: false,
    subsections: [
      {
        id: 'communication',
        title: 'Communication',
        isCompleted: false,
        isCurrent: false,
      },
      {
        id: 'other',
        title: 'Other Preferences',
        isCompleted: false,
        isCurrent: false,
      }
    ]
  },
  {
    id: 'completion',
    title: 'Complete',
    description: 'Review and finish',
    isCompleted: false,
    isCurrent: false,
    subsections: [
      {
        id: 'review',
        title: 'Review Information',
        isCompleted: false,
        isCurrent: false,
      },
      {
        id: 'submit',
        title: 'Submit',
        isCompleted: false,
        isCurrent: false,
      }
    ]
  }
];

const initialMessages: ChatMessage[] = [
  {
    id: uuidv4(),
    role: 'assistant',
    content: 'Hi there! I\'m Rozy, your onboarding assistant at A.Rose Media. Before we get started, I need to know which type of brand you\'re onboarding. Are you a business brand or a personal brand?',
    timestamp: new Date(),
    formField: {
      type: 'radio',
      id: 'brand-type',
      label: 'Select your brand type',
      required: true,
      options: [
        { value: 'business', label: 'Business Brand' },
        { value: 'personal', label: 'Personal Brand' }
      ],
      sectionId: 'brand-type',
      subsectionId: 'brand-selection'
    }
  }
];

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [sections, setSections] = useState<OnboardingSection[]>(initialSections);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [formState, setFormState] = useState<FormState>({});
  const [currentSectionId, setCurrentSectionId] = useState('brand-type');
  const [currentSubsectionId, setCurrentSubsectionId] = useState('brand-selection');
  const [isTyping, setIsTyping] = useState(false);
  const [brandType, setBrandType] = useState<BrandType>(null);

  const addUserMessage = (content: string) => {
    setMessages(prev => [
      ...prev,
      {
        id: uuidv4(),
        role: 'user',
        content,
        timestamp: new Date()
      }
    ]);
  };

  const addAssistantMessage = (content: string, formField?: FormField) => {
    setMessages(prev => [
      ...prev,
      {
        id: uuidv4(),
        role: 'assistant',
        content,
        timestamp: new Date(),
        formField
      }
    ]);
  };

  const updateFormState = (fieldId: string, value: any) => {
    setFormState(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const advanceToNextSection = () => {
    let nextSectionId = '';
    let nextSubsectionId = '';
    let foundCurrent = false;

    // First try to move to next subsection in current section
    for (const section of sections) {
      if (section.id === currentSectionId) {
        for (let i = 0; i < section.subsections.length; i++) {
          if (section.subsections[i].id === currentSubsectionId && i < section.subsections.length - 1) {
            nextSectionId = section.id;
            nextSubsectionId = section.subsections[i + 1].id;
            foundCurrent = true;
            break;
          }
        }
      }
      if (foundCurrent) break;
    }

    // If we didn't find a next subsection, try to move to the next section
    if (!foundCurrent) {
      for (let i = 0; i < sections.length; i++) {
        if (sections[i].id === currentSectionId && i < sections.length - 1) {
          nextSectionId = sections[i + 1].id;
          nextSubsectionId = sections[i + 1].subsections[0].id;
          foundCurrent = true;
          break;
        }
      }
    }

    if (foundCurrent) {
      goToSection(nextSectionId, nextSubsectionId);
    }
  };

  const goToSection = (sectionId: string, subsectionId: string) => {
    setSections(prevSections => {
      return prevSections.map(section => {
        const isCurrent = section.id === sectionId;
        
        return {
          ...section,
          isCurrent,
          subsections: section.subsections.map(subsection => {
            const isSubsectionCurrent = isCurrent && subsection.id === subsectionId;
            
            return {
              ...subsection,
              isCurrent: isSubsectionCurrent
            };
          })
        };
      });
    });

    setCurrentSectionId(sectionId);
    setCurrentSubsectionId(subsectionId);
  };

  const completeCurrentSection = () => {
    setSections(prevSections => {
      return prevSections.map(section => {
        if (section.id === currentSectionId) {
          const updatedSubsections = section.subsections.map(subsection => {
            if (subsection.id === currentSubsectionId) {
              return { ...subsection, isCompleted: true, isCurrent: false };
            }
            return subsection;
          });
          
          // Check if all subsections are completed
          const allSubsectionsCompleted = updatedSubsections.every(sub => sub.isCompleted);
          
          return {
            ...section,
            subsections: updatedSubsections,
            isCompleted: allSubsectionsCompleted
          };
        }
        return section;
      });
    });
    
    // Automatically advance to the next section
    advanceToNextSection();
  };

  const submitFormField = async (fieldId: string, value: any): Promise<void> => {
    updateFormState(fieldId, value);
    addUserMessage(value);
    setIsTyping(true);

    // Simulate API call to get response from AI
    try {
      setTimeout(() => {
        // This is where you'd integrate with OpenAI
        // For now we'll use hardcoded responses based on the field
        let responseText = '';
        let nextField: FormField | undefined;

        const currentSectionIndex = sections.findIndex(s => s.id === currentSectionId);
        const currentSection = sections[currentSectionIndex];
        
        if (fieldId === 'brand-type') {
          // Set the brand type
          setBrandType(value as BrandType);
          
          if (value === 'business') {
            responseText = 'Great! I\'ll be helping you onboard your business brand with A.Rose Media. Let\'s start with your business name. What is the name of your company?';
            nextField = {
              type: 'text',
              id: 'business-name',
              label: 'Business Name',
              placeholder: 'Enter your business name',
              required: true,
              sectionId: 'personal-info',
              subsectionId: 'name-email'
            };
          } else {
            responseText = 'Perfect! I\'ll be helping you onboard your personal brand with A.Rose Media. Let\'s start with your name. What should I call you?';
            nextField = {
              type: 'text',
              id: 'name',
              label: 'Your Name',
              placeholder: 'Enter your full name',
              required: true,
              sectionId: 'personal-info',
              subsectionId: 'name-email'
            };
          }
          completeCurrentSection();
        } else if (fieldId === 'business-name') {
          responseText = `Thank you for sharing your business name, ${value}! Now, could you please provide your name as the primary contact?`;
          nextField = {
            type: 'text',
            id: 'contact-name',
            label: 'Contact Name',
            placeholder: 'Enter your full name',
            required: true,
            sectionId: 'personal-info',
            subsectionId: 'name-email'
          };
        } else if (fieldId === 'contact-name' || fieldId === 'name') {
          const nameType = fieldId === 'contact-name' ? 'contact name' : 'name';
          responseText = `Great to meet you! Now, could you please share your business email address?`;
          nextField = {
            type: 'text',
            id: 'email',
            label: 'Email Address',
            placeholder: 'your@email.com',
            required: true,
            sectionId: 'personal-info',
            subsectionId: 'name-email'
          };
        } else if (fieldId === 'email') {
          const brandSpecificText = brandType === 'business' 
            ? 'Tell me a bit about your business. What industry are you in, and what products or services do you offer?'
            : 'Tell me a bit about yourself and your personal brand. What field are you in, and what are you known for?';
          
          responseText = `Thanks for providing your email. Let's move on to your background. ${brandSpecificText}`;
          nextField = {
            type: 'textarea',
            id: 'background',
            label: 'About Your Brand',
            placeholder: 'Share details about your brand...',
            required: true,
            sectionId: 'personal-info',
            subsectionId: 'background'
          };
          completeCurrentSection();
        } else if (fieldId === 'background') {
          const brandSpecificText = brandType === 'business'
            ? 'Now let\'s talk about your business experience. How long has your company been operating?'
            : 'Now let\'s talk about your professional experience. What was your most recent role?';
          
          responseText = `Thanks for sharing! ${brandSpecificText}`;
          const nextFieldId = brandType === 'business' ? 'company-age' : 'recent-role';
          const nextFieldLabel = brandType === 'business' ? 'Company Age' : 'Most Recent Role';
          const nextFieldPlaceholder = brandType === 'business' ? 'e.g. 5 years' : 'e.g. Senior Developer at ABC Corp';
          
          nextField = {
            type: 'text',
            id: nextFieldId,
            label: nextFieldLabel,
            placeholder: nextFieldPlaceholder,
            required: true,
            sectionId: 'professional',
            subsectionId: 'work-experience'
          };
          completeCurrentSection();
        } else if (fieldId === 'company-age' || fieldId === 'recent-role') {
          const brandSpecificText = brandType === 'business'
            ? 'What are your company\'s key strengths or competitive advantages?'
            : 'What are your key skills and areas of expertise?';
          
          responseText = `${value} is impressive! Now tell me, ${brandSpecificText}`;
          const nextFieldId = brandType === 'business' ? 'company-strengths' : 'skills';
          const nextFieldLabel = brandType === 'business' ? 'Company Strengths' : 'Skills & Expertise';
          const nextFieldPlaceholder = brandType === 'business' 
            ? 'List your company\'s key strengths or advantages'
            : 'List your key skills and areas of expertise';
          
          nextField = {
            type: 'textarea',
            id: nextFieldId,
            label: nextFieldLabel,
            placeholder: nextFieldPlaceholder,
            required: true,
            sectionId: 'professional',
            subsectionId: 'skills'
          };
          completeCurrentSection();
        } else if (fieldId === 'company-strengths' || fieldId === 'skills') {
          responseText = `Impressive ${brandType === 'business' ? 'strengths' : 'skill set'}! Let's talk about your communication preferences. What's your preferred method of communication?`;
          nextField = {
            type: 'select',
            id: 'communication-preference',
            label: 'Preferred Communication',
            options: [
              { value: 'email', label: 'Email' },
              { value: 'phone', label: 'Phone' },
              { value: 'video', label: 'Video Call' },
              { value: 'chat', label: 'Chat' }
            ],
            required: true,
            sectionId: 'preferences',
            subsectionId: 'communication'
          };
          completeCurrentSection();
        } else if (fieldId === 'communication-preference') {
          responseText = `I've noted your preference for ${value === 'email' ? 'email communication' : 
                         value === 'phone' ? 'phone calls' : 
                         value === 'video' ? 'video calls' : 'chat'}. 
                         Is there anything else you'd like me to know about your preferences?`;
          nextField = {
            type: 'textarea',
            id: 'other-preferences',
            label: 'Other Preferences',
            placeholder: 'Any other preferences you want to share...',
            required: false,
            sectionId: 'preferences',
            subsectionId: 'other'
          };
          completeCurrentSection();
        } else if (fieldId === 'other-preferences') {
          // Create a summary based on brand type
          const summary = brandType === 'business'
            ? `Business Name: ${formState['business-name']}
Contact: ${formState['contact-name']}
Email: ${formState.email}
Background: ${formState.background}
Company Age: ${formState['company-age']}
Key Strengths: ${formState['company-strengths']}
Preferred Communication: ${formState['communication-preference']}`
            : `Name: ${formState.name}
Email: ${formState.email}
Background: ${formState.background}
Recent Role: ${formState['recent-role']}
Key Skills: ${formState.skills}
Preferred Communication: ${formState['communication-preference']}`;
          
          responseText = `Thanks for sharing your preferences. Let's review everything before we finish. Here's a summary of your information:
          
${summary}
          
Does everything look correct?`;
          nextField = {
            type: 'submit',
            id: 'confirm',
            label: 'Confirm & Submit',
            sectionId: 'completion',
            subsectionId: 'review'
          };
          completeCurrentSection();
        } else if (fieldId === 'confirm') {
          responseText = `Fantastic! Your onboarding with A.Rose Media is now complete. Thank you for taking the time to provide this information. Our team will reach out to you soon via your preferred method of communication.`;
          completeCurrentSection();
        }

        addAssistantMessage(responseText, nextField);
        setIsTyping(false);
      }, 1500);
    } catch (error) {
      console.error('Error submitting form field:', error);
      addAssistantMessage('I apologize, but I encountered an error processing your information. Could you try again?');
      setIsTyping(false);
    }
  };

  const value = {
    sections,
    messages,
    formState,
    currentSectionId,
    currentSubsectionId,
    isTyping,
    brandType,
    addUserMessage,
    addAssistantMessage,
    updateFormState,
    advanceToNextSection,
    goToSection,
    completeCurrentSection,
    submitFormField,
    setIsTyping,
    setBrandType
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
