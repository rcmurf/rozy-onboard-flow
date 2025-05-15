
import { OnboardingProvider } from '@/context/OnboardingContext';
import OnboardingProgress from './OnboardingProgress';
import ChatContainer from './ChatContainer';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronUp } from 'lucide-react';

const OnboardingLayout = () => {
  const isMobile = useIsMobile();
  const [showSidebar, setShowSidebar] = useState(!isMobile);

  return (
    <OnboardingProvider>
      <div className="h-screen flex flex-col bg-gray-100">
        {/* Header with toggle on mobile */}
        {isMobile && (
          <div className="bg-white p-4 border-b border-gray-200">
            <Button 
              variant="outline"
              className="w-full flex items-center justify-center"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              {showSidebar ? 'Hide Progress' : 'Show Progress'}
              <ChevronUp className={`ml-2 h-4 w-4 transition-transform ${showSidebar ? 'rotate-180' : ''}`} />
            </Button>
          </div>
        )}

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          {(showSidebar || !isMobile) && (
            <div className={`${isMobile ? 'absolute z-10 w-full h-[calc(100%-4rem)] bg-white' : 'flex-shrink-0'}`}>
              <OnboardingProgress />
            </div>
          )}

          {/* Main content */}
          <div className="flex-1 flex overflow-hidden">
            <ChatContainer />
          </div>
        </div>
      </div>
    </OnboardingProvider>
  );
};

export default OnboardingLayout;
