
import { useEffect } from "react";
import OnboardingLayout from "@/components/onboarding/OnboardingLayout";

const Onboarding = () => {
  useEffect(() => {
    document.title = "Onboarding | A.Rose Media";
  }, []);

  return <OnboardingLayout />;
};

export default Onboarding;
