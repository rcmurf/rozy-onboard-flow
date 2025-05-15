
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import OnboardingLayout from "@/components/onboarding/OnboardingLayout";
import { BrandType } from "@/types/onboarding";

// Create a wrapper component that receives brandType from URL params
const Onboarding = () => {
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    document.title = "Onboarding | A.Rose Media";
  }, []);

  // Get the brand type from URL params to pass to OnboardingLayout
  const brandTypeParam = searchParams.get("brandType") as BrandType;
  
  return <OnboardingLayout initialBrandType={brandTypeParam} />;
};

export default Onboarding;
