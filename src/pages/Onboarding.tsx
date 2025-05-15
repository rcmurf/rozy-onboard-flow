
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import OnboardingLayout from "@/components/onboarding/OnboardingLayout";
import { useOnboarding } from "@/context/OnboardingContext";
import { BrandType } from "@/types/onboarding";

const Onboarding = () => {
  const [searchParams] = useSearchParams();
  const { setBrandType } = useOnboarding();
  
  useEffect(() => {
    document.title = "Onboarding | A.Rose Media";
    
    // Get the brand type from URL params
    const brandTypeParam = searchParams.get("brandType") as BrandType;
    if (brandTypeParam && (brandTypeParam === "business" || brandTypeParam === "personal")) {
      setBrandType(brandTypeParam);
    }
  }, [searchParams, setBrandType]);

  return <OnboardingLayout />;
};

export default Onboarding;
