
import { OnboardingProvider } from '@/context/OnboardingContext';
import OnboardingProgress from './OnboardingProgress';
import ChatContainer from './ChatContainer';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronUp } from 'lucide-react';
import { BrandType } from '@/types/onboarding';
import { useNavigate } from 'react-router-dom';

interface OnboardingLayoutProps {
  initialBrandType?: BrandType;
}

const OnboardingLayout = ({ initialBrandType }: OnboardingLayoutProps) => {
  const isMobile = useIsMobile();
  const [showSidebar, setShowSidebar] = useState(!isMobile);
  const navigate = useNavigate();

  // Redirect back to home if no valid brand type, but check localStorage first
  useEffect(() => {
    const storedBrandType = localStorage.getItem('brandType') as BrandType;
    const validBrandType = initialBrandType || storedBrandType;
    
    if (!validBrandType) {
      navigate('/', { replace: true });
    }
  }, [initialBrandType, navigate]);

  // Don't render anything if we're going to redirect
  if (!initialBrandType && !localStorage.getItem('brandType')) {
    return null; // Will redirect, don't render
  }

  return (
    <OnboardingProvider initialBrandType={initialBrandType || localStorage.getItem('brandType') as BrandType}>
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
            <div className={`${isMobile ? 'fixed inset-0 z-10 pt-16 pb-0' : 'flex-shrink-0 w-[280px]'}`}>
              <OnboardingProgress />
            </div>
          )}

          {/* Main content */}
          <div className={`flex-1 flex overflow-hidden ${isMobile && showSidebar ? 'opacity-20' : ''}`}>
            <ChatContainer />
          </div>
        </div>
      </div>
    </OnboardingProvider>
  );
};

export default OnboardingLayout;
