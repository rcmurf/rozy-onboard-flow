
import { useOnboarding } from '@/context/OnboardingContext';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const OnboardingProgress = () => {
  const { sections, goToSection } = useOnboarding();

  return (
    <div className="bg-gray-50 border-r border-gray-200 h-full flex flex-col p-5 min-w-[260px] overflow-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">Onboarding Process</h2>
        <p className="text-sm text-gray-500">Complete all sections to finish</p>
      </div>
      
      <div className="space-y-6 flex-1">
        {sections.map((section) => (
          <div key={section.id} className="space-y-2">
            <div className={cn(
              "flex items-center justify-between",
              section.isCurrent ? "text-rozy font-medium" : "text-gray-700"
            )}>
              <span className="text-sm font-semibold">{section.title}</span>
              {section.isCompleted && (
                <span className="bg-green-100 text-green-800 p-1 rounded-full">
                  <Check className="w-3 h-3" />
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mb-2">{section.description}</p>
            
            <div className="pl-3 border-l-2 border-gray-200 space-y-2">
              {section.subsections.map((subsection) => (
                <button
                  key={subsection.id}
                  onClick={() => goToSection(section.id, subsection.id)}
                  disabled={!section.isCompleted && !section.isCurrent}
                  className={cn(
                    "flex items-center text-xs py-1 w-full text-left",
                    subsection.isCompleted ? "text-green-600 font-medium" : 
                    subsection.isCurrent ? "text-rozy font-medium" : 
                    "text-gray-500",
                    (!section.isCompleted && !section.isCurrent) ? "opacity-50 cursor-not-allowed" : "hover:text-rozy"
                  )}
                >
                  <div className="mr-2 w-4 h-4 flex-shrink-0">
                    {subsection.isCompleted ? (
                      <div className="w-full h-full bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                    ) : (
                      <div className={cn(
                        "w-full h-full rounded-full border",
                        subsection.isCurrent ? "border-rozy" : "border-gray-300"
                      )}>
                        {subsection.isCurrent && (
                          <div className="w-2 h-2 bg-rozy rounded-full m-auto mt-1"></div>
                        )}
                      </div>
                    )}
                  </div>
                  <span>{subsection.title}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-auto">
        <div className="text-xs text-gray-500 pt-4 border-t border-gray-200">
          <p>Need help? <a href="#" className="text-rozy hover:underline">Contact support</a></p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingProgress;
