
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ChatMessage, FormField, FormState, OnboardingSection, OnboardingSubsection } from '@/types/onboarding';
import { v4 as uuidv4 } from 'uuid';

interface OnboardingContextType {
  sections: OnboardingSection[];
  messages: ChatMessage[];
  formState: FormState;
  currentSectionId: string;
  currentSubsectionId: string;
  isTyping: boolean;
  addUserMessage: (content: string) => void;
  addAssistantMessage: (content: string, formField?: FormField) => void;
  updateFormState: (fieldId: string, value: any) => void;
  advanceToNextSection: () => void;
  goToSection: (sectionId: string, subsectionId: string) => void;
  completeCurrentSection: () => void;
  submitFormField: (fieldId: string, value: any) => Promise<void>;
  setIsTyping: (isTyping: boolean) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const initialSections: OnboardingSection[] = [
  {
    id: 'personal-info',
    title: 'Personal Information',
    description: 'Basic details about you',
    isCompleted: false,
    isCurrent: true,
    subsections: [
      {
        id: 'name-email',
        title: 'Name & Contact',
        isCompleted: false,
        isCurrent: true,
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
    content: 'Hi there! I\'m Rozy, your onboarding assistant. I\'ll help you set up your profile. Let\'s start with your name. What should I call you?',
    timestamp: new Date(),
    formField: {
      type: 'text',
      id: 'name',
      label: 'Your Name',
      placeholder: 'Enter your full name',
      required: true,
      sectionId: 'personal-info',
      subsectionId: 'name-email'
    }
  }
];

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [sections, setSections] = useState<OnboardingSection[]>(initialSections);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [formState, setFormState] = useState<FormState>({});
  const [currentSectionId, setCurrentSectionId] = useState('personal-info');
  const [currentSubsectionId, setCurrentSubsectionId] = useState('name-email');
  const [isTyping, setIsTyping] = useState(false);

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
        
        if (fieldId === 'name') {
          responseText = `Great to meet you, ${value}! Now, could you please share your email address?`;
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
          responseText = `Thanks for providing your email. Let's move on to your background. Could you tell me a bit about yourself?`;
          nextField = {
            type: 'textarea',
            id: 'background',
            label: 'About You',
            placeholder: 'Share a bit about your background...',
            required: true,
            sectionId: 'personal-info',
            subsectionId: 'background'
          };
          // Complete the current subsection
          completeCurrentSection();
        } else if (fieldId === 'background') {
          responseText = `Thanks for sharing! Now let's talk about your professional experience. What was your most recent role?`;
          nextField = {
            type: 'text',
            id: 'recent-role',
            label: 'Most Recent Role',
            placeholder: 'e.g. Senior Developer at ABC Corp',
            required: true,
            sectionId: 'professional',
            subsectionId: 'work-experience'
          };
          // Complete the current subsection
          completeCurrentSection();
        } else if (fieldId === 'recent-role') {
          responseText = `${value} sounds interesting! How many years of experience do you have in this field?`;
          nextField = {
            type: 'text',
            id: 'years-experience',
            label: 'Years of Experience',
            placeholder: 'e.g. 5',
            required: true,
            sectionId: 'professional',
            subsectionId: 'work-experience'
          };
        } else if (fieldId === 'years-experience') {
          responseText = `Great! Now, what are your key skills and areas of expertise?`;
          nextField = {
            type: 'textarea',
            id: 'skills',
            label: 'Skills & Expertise',
            placeholder: 'List your key skills and areas of expertise',
            required: true,
            sectionId: 'professional',
            subsectionId: 'skills'
          };
          completeCurrentSection();
        } else if (fieldId === 'skills') {
          responseText = `Impressive skill set! Let's talk about your communication preferences. What's your preferred method of communication?`;
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
          responseText = `Thanks for sharing your preferences. Let's review everything before we finish. Here's a summary of your information:
          
Name: ${formState.name}
Email: ${formState.email}
Background: ${formState.background}
Recent Role: ${formState['recent-role']}
Experience: ${formState['years-experience']} years
Key Skills: ${formState.skills}
Preferred Communication: ${formState['communication-preference']}
          
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
          responseText = `Fantastic! Your onboarding is now complete. Thank you for taking the time to provide this information. Our team will reach out to you soon via your preferred method of communication.`;
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
    addUserMessage,
    addAssistantMessage,
    updateFormState,
    advanceToNextSection,
    goToSection,
    completeCurrentSection,
    submitFormField,
    setIsTyping
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
