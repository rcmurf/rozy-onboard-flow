
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import OnboardingLayout from "@/components/onboarding/OnboardingLayout";
import { BrandType } from "@/types/onboarding";

const Onboarding = () => {
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    document.title = "Onboarding | A.Rose Media";
  }, []);

  // Try to get brand type from URL params first
  const brandTypeParam = searchParams.get("brandType") as BrandType;
  // If not in URL params, try localStorage
  const storedBrandType = localStorage.getItem('brandType') as BrandType;
  
  // Use URL param if available, otherwise use stored brand type
  const validBrandType = 
    (brandTypeParam === 'business' || brandTypeParam === 'personal') ? brandTypeParam : 
    (storedBrandType === 'business' || storedBrandType === 'personal') ? storedBrandType : null;
  
  return <OnboardingLayout initialBrandType={validBrandType} />;
};

export default Onboarding;
