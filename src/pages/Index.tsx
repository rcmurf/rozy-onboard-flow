
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md px-4">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">Welcome to Rozy Onboarding</h1>
        <p className="text-lg text-gray-600 mb-8">
          Experience our innovative chat-based onboarding process with Rozy, your AI assistant
        </p>
        <Link to="/onboarding">
          <Button className="bg-rozy hover:bg-rozy-dark text-white px-6 py-3 rounded-lg text-lg">
            Start Onboarding
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
