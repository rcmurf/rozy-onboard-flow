
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import OnboardingLayout from "@/components/onboarding/OnboardingLayout";
import { BrandType } from "@/types/onboarding";

const Onboarding = () => {
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    document.title = "Onboarding | A.Rose Media";
  }, []);

  // Get the brand type from URL params and ensure it's properly typed
  const brandTypeParam = searchParams.get("brandType") as BrandType;
  const validBrandType = brandTypeParam === 'business' || brandTypeParam === 'personal' ? brandTypeParam : null;
  
  return <OnboardingLayout initialBrandType={validBrandType} />;
};

export default Onboarding;
