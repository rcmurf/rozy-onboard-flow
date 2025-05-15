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
    id: 'business-info',
    title: 'Business Information',
    description: 'Key details about your company',
    isCompleted: false,
    isCurrent: false,
    subsections: [
      {
        id: 'company-basics',
        title: 'Company Basics',
        isCompleted: false,
        isCurrent: false,
      },
      {
        id: 'company-profile',
        title: 'Company Profile',
        isCompleted: false,
        isCurrent: false,
      }
    ]
  },
  {
    id: 'target-audience',
    title: 'Target Audience',
    description: 'Your ideal customers and market positioning',
    isCompleted: false,
    isCurrent: false,
    subsections: [
      {
        id: 'customer-avatars',
        title: 'Customer Avatars',
        isCompleted: false,
        isCurrent: false,
      },
      {
        id: 'competitors',
        title: 'Competitors',
        isCompleted: false,
        isCurrent: false,
      }
    ]
  },
  {
    id: 'contacts',
    title: 'Contact Information',
    description: 'Key contacts for our engagement',
    isCompleted: false,
    isCurrent: false,
    subsections: [
      {
        id: 'primary-contact',
        title: 'Primary Contact',
        isCompleted: false,
        isCurrent: false,
      },
      {
        id: 'additional-contacts',
        title: 'Additional Contacts',
        isCompleted: false,
        isCurrent: false,
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

// Create initial messages based on whether brandType is provided
const createInitialMessages = (brandType: BrandType): ChatMessage[] => {
  if (!brandType) {
    // If no brand type is provided, start with brand selection
    return [{
      id: uuidv4(),
      role: 'assistant',
      content: 'Hi there! I\'m Rozy, your onboarding assistant at A.Rose Media.\n\nWhat type of brand do you want to grow with us? Choose the option that best reflects your focus.',
      timestamp: new Date(),
      formField: {
        type: 'radio',
        id: 'brand-type',
        label: 'Select your brand type',
        required: true,
        options: [
          { value: 'business', label: 'Business Brand\nStrengthening your company\'s presence, awareness, and customer connection.' },
          { value: 'personal', label: 'Personal Brand\nBuilding your influence, credibility, and thought leadership.' }
        ],
        sectionId: 'brand-type',
        subsectionId: 'brand-selection'
      }
    }];
  } else if (brandType === 'business') {
    // If business brand is selected, start with company name
    return [{
      id: uuidv4(),
      role: 'assistant',
      content: 'Welcome to A.Rose Media! I\'m Rozy, your onboarding assistant.\n\nSince your focus is on growing your business\'s audience, increasing brand awareness, and driving meaningful engagement, we\'ll gather key details about your company.\n\nLet\'s begin with some basic information. What is your company name?',
      timestamp: new Date(),
      formField: {
        type: 'text',
        id: 'company-name',
        label: 'Company Name',
        placeholder: 'Enter your company name',
        required: true,
        sectionId: 'business-info',
        subsectionId: 'company-basics'
      }
    }];
  } else {
    // If personal brand is selected, start with personal name
    return [{
      id: uuidv4(),
      role: 'assistant',
      content: 'Welcome to A.Rose Media! I\'m Rozy, your onboarding assistant.\n\nSince you\'re focusing on building your personal brand, I\'ll help you through the process. Let\'s start with your information.\n\nWhat should I call you?',
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
    }];
  }
};

interface OnboardingProviderProps {
  children: ReactNode;
  initialBrandType?: BrandType;
}

export const OnboardingProvider = ({ children, initialBrandType }: OnboardingProviderProps) => {
  const [sections, setSections] = useState<OnboardingSection[]>(initialSections);
  const [brandType, setBrandType] = useState<BrandType>(initialBrandType || null);
  const [messages, setMessages] = useState<ChatMessage[]>(() => createInitialMessages(initialBrandType || null));
  const [formState, setFormState] = useState<FormState>({});
  const [currentSectionId, setCurrentSectionId] = useState(
    initialBrandType === 'business' ? 'business-info' : 
    initialBrandType === 'personal' ? 'personal-info' : 
    'brand-type'
  );
  const [currentSubsectionId, setCurrentSubsectionId] = useState(
    initialBrandType === 'business' ? 'company-basics' : 
    initialBrandType === 'personal' ? 'name-email' : 
    'brand-selection'
  );
  const [isTyping, setIsTyping] = useState(false);

  // If initialBrandType is provided, set it when component mounts and mark brand selection as completed
  useEffect(() => {
    if (initialBrandType) {
      setBrandType(initialBrandType);
      updateFormState('brand-type', initialBrandType);
      
      // Mark brand-type section as completed
      setSections(prevSections => {
        return prevSections.map(section => {
          if (section.id === 'brand-type') {
            return {
              ...section,
              isCompleted: true,
              isCurrent: false,
              subsections: section.subsections.map(subsection => ({
                ...subsection,
                isCompleted: true,
                isCurrent: false
              }))
            };
          }
          
          // Set the correct section as current
          if (
            (initialBrandType === 'business' && section.id === 'business-info') ||
            (initialBrandType === 'personal' && section.id === 'personal-info')
          ) {
            return {
              ...section,
              isCurrent: true,
              subsections: section.subsections.map((subsection, index) => ({
                ...subsection,
                isCurrent: index === 0
              }))
            };
          }
          
          return section;
        });
      });
    }
  }, [initialBrandType]);

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
            responseText = 'Let\'s Start with the Essentials\n\nSince your focus is on growing your business\'s audience, increasing brand awareness, and driving meaningful engagement, this section will gather key details about your company.\n\nLet\'s begin with some basic information about your business. What is your company name?';
            nextField = {
              type: 'text',
              id: 'company-name',
              label: 'Company Name',
              placeholder: 'Enter your company name',
              required: true,
              sectionId: 'business-info',
              subsectionId: 'company-basics'
            };
          } else {
            responseText = 'Perfect! I\'ll be helping you onboard your personal brand with A.Rose Media. Let\'s start with your information. What should I call you?';
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
        } else if (fieldId === 'company-name') {
          responseText = `Great! ${value} it is. Now, what industry are you in?`;
          nextField = {
            type: 'text',
            id: 'industry',
            label: 'Industry',
            placeholder: 'e.g., Technology, Healthcare, etc.',
            required: true,
            sectionId: 'business-info',
            subsectionId: 'company-basics'
          };
        } else if (fieldId === 'industry') {
          responseText = `${value} is a great industry! What is your company's website?`;
          nextField = {
            type: 'text',
            id: 'website',
            label: 'Website',
            placeholder: 'e.g., https://example.com',
            required: false,
            sectionId: 'business-info',
            subsectionId: 'company-basics'
          };
        } else if (fieldId === 'website') {
          responseText = 'Thanks for that information! Now, let\'s talk about your company profile. Please provide an overview of your business.';
          nextField = {
            type: 'textarea',
            id: 'company-overview',
            label: 'Company Overview',
            placeholder: 'Brief description of what your company does',
            required: true,
            sectionId: 'business-info',
            subsectionId: 'company-profile'
          };
          completeCurrentSection();
        } else if (fieldId === 'company-overview') {
          responseText = 'Great overview! Now, could you tell me about your products and services?';
          nextField = {
            type: 'textarea',
            id: 'products-services',
            label: 'Products & Services',
            placeholder: 'Describe your main offerings',
            required: true,
            sectionId: 'business-info',
            subsectionId: 'company-profile'
          };
        } else if (fieldId === 'products-services') {
          responseText = 'Thank you! Now, let\'s understand your mission statement. What drives your company?';
          nextField = {
            type: 'textarea',
            id: 'mission-statement',
            label: 'Mission Statement',
            placeholder: 'Your company\'s purpose and goals',
            required: true,
            sectionId: 'business-info',
            subsectionId: 'company-profile'
          };
        } else if (fieldId === 'mission-statement') {
          responseText = 'Excellent! Let\'s move on to understanding your target audience. Could you describe your ideal customer?';
          nextField = {
            type: 'textarea',
            id: 'target-audience',
            label: 'Target Audience',
            placeholder: 'Demographics, interests, behaviors of your ideal customers',
            required: true,
            sectionId: 'target-audience',
            subsectionId: 'customer-avatars'
          };
          completeCurrentSection();
        } else if (fieldId === 'target-audience') {
          responseText = 'Great insights into your target audience! Now, let\'s talk about your competitors. Who are your main competitors?';
          nextField = {
            type: 'textarea',
            id: 'competitors',
            label: 'Main Competitors',
            placeholder: 'List your main competitors and what makes you different',
            required: true,
            sectionId: 'target-audience',
            subsectionId: 'competitors'
          };
          completeCurrentSection();
        } else if (fieldId === 'competitors') {
          responseText = 'Thanks for sharing about your competitive landscape! Now, let\'s capture information about who will be our main contact at your company. What\'s the name of the primary contact person?';
          nextField = {
            type: 'text',
            id: 'contact-name',
            label: 'Primary Contact Name',
            placeholder: 'Full name',
            required: true,
            sectionId: 'contacts',
            subsectionId: 'primary-contact'
          };
          completeCurrentSection();
        } else if (fieldId === 'contact-name') {
          responseText = `Great! What is ${value}'s title or role at the company?`;
          nextField = {
            type: 'text',
            id: 'contact-title',
            label: 'Title/Role',
            placeholder: 'e.g., Marketing Director',
            required: true,
            sectionId: 'contacts',
            subsectionId: 'primary-contact'
          };
        } else if (fieldId === 'contact-title') {
          responseText = 'And what is their email address?';
          nextField = {
            type: 'text',
            id: 'contact-email',
            label: 'Email',
            placeholder: 'email@example.com',
            required: true,
            sectionId: 'contacts',
            subsectionId: 'primary-contact'
          };
        } else if (fieldId === 'contact-email') {
          responseText = 'Would you like to add any additional contacts from your company?';
          nextField = {
            type: 'radio',
            id: 'add-contacts',
            label: 'Add additional contacts?',
            required: true,
            options: [
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' }
            ],
            sectionId: 'contacts',
            subsectionId: 'additional-contacts'
          };
          completeCurrentSection();
        } else if (fieldId === 'add-contacts') {
          if (value === 'yes') {
            responseText = 'Great! Please provide the name of the additional contact.';
            nextField = {
              type: 'text',
              id: 'additional-contact-name',
              label: 'Contact Name',
              placeholder: 'Full name',
              required: true,
              sectionId: 'contacts',
              subsectionId: 'additional-contacts'
            };
          } else {
            // Create a summary based on business brand
            const summary = `Company Name: ${formState['company-name']}
Industry: ${formState.industry}
Website: ${formState.website || 'Not provided'}
Company Overview: ${formState['company-overview']}
Products & Services: ${formState['products-services']}
Mission Statement: ${formState['mission-statement']}
Target Audience: ${formState['target-audience']}
Competitors: ${formState.competitors}
Primary Contact: ${formState['contact-name']} (${formState['contact-title']})
Email: ${formState['contact-email']}`;
            
            responseText = `Thanks for providing all the information. Let's review everything before we finish. Here's a summary of your business information:
            
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
          }
        } else if (fieldId === 'additional-contact-name') {
          responseText = 'What is their email address?';
          nextField = {
            type: 'text',
            id: 'additional-contact-email',
            label: 'Email',
            placeholder: 'email@example.com',
            required: true,
            sectionId: 'contacts',
            subsectionId: 'additional-contacts'
          };
        } else if (fieldId === 'additional-contact-email') {
          responseText = 'What is their role in the company?';
          nextField = {
            type: 'text',
            id: 'additional-contact-role',
            label: 'Role',
            placeholder: 'e.g., Creative Director',
            required: true,
            sectionId: 'contacts',
            subsectionId: 'additional-contacts'
          };
        } else if (fieldId === 'additional-contact-role') {
          // Create a summary based on business brand with additional contact
          const summary = `Company Name: ${formState['company-name']}
Industry: ${formState.industry}
Website: ${formState.website || 'Not provided'}
Company Overview: ${formState['company-overview']}
Products & Services: ${formState['products-services']}
Mission Statement: ${formState['mission-statement']}
Target Audience: ${formState['target-audience']}
Competitors: ${formState.competitors}
Primary Contact: ${formState['contact-name']} (${formState['contact-title']})
Email: ${formState['contact-email']}
Additional Contact: ${formState['additional-contact-name']} (${formState['additional-contact-role']})
Email: ${formState['additional-contact-email']}`;
          
          responseText = `Thanks for providing all the information. Let's review everything before we finish. Here's a summary of your business information:
          
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
        } else if (fieldId === 'name') {
          // This is for personal brand
          responseText = `Great to meet you, ${value}! What is your email address?`;
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
          // Continue with personal brand flow
          responseText = 'Thanks for providing your email. Tell me a bit about yourself and your personal brand. What field are you in, and what are you known for?';
          nextField = {
            type: 'textarea',
            id: 'background',
            label: 'About Your Brand',
            placeholder: 'Share details about your personal brand...',
            required: true,
            sectionId: 'personal-info',
            subsectionId: 'background'
          };
          completeCurrentSection();
        } else if (fieldId === 'confirm') {
          responseText = `Fantastic! Your onboarding with A.Rose Media is now complete. Thank you for taking the time to provide this information. Our team will reach out to you soon to discuss next steps.`;
          completeCurrentSection();
        } else {
          // Handle any other fields
          responseText = `Thank you for providing that information. Let's continue with the next question.`;
          // You can add more specific handling for other fields
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
