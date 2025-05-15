
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { BrandType } from "@/types/onboarding";

const brandSelectionSchema = z.object({
  brandType: z.enum(["business", "personal"], {
    required_error: "Please select a brand type",
  }),
});

type BrandSelectionForm = z.infer<typeof brandSelectionSchema>;

const Index = () => {
  const [selectedBrand, setSelectedBrand] = useState<BrandType>(null);
  const navigate = useNavigate();

  const form = useForm<BrandSelectionForm>({
    resolver: zodResolver(brandSelectionSchema),
  });

  const onBrandChange = (value: BrandType) => {
    setSelectedBrand(value);
  };

  const handleStartOnboarding = () => {
    if (selectedBrand) {
      // Use navigate instead of history.push
      navigate(`/onboarding?brandType=${selectedBrand}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md px-4">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">Welcome to Rozy Onboarding</h1>
        <p className="text-lg text-gray-600 mb-8">
          Experience our innovative chat-based onboarding process with Rozy, your AI assistant
        </p>
        
        <Form {...form}>
          <div className="mb-8">
            <FormField
              control={form.control}
              name="brandType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-md text-gray-700">What type of brand do you want to grow with us?</FormLabel>
                  <FormDescription>Choose the option that best reflects your focus.</FormDescription>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        field.onChange(value);
                        onBrandChange(value as BrandType);
                      }}
                      className="grid grid-cols-1 gap-4"
                    >
                      <FormItem className="flex items-start space-x-3 space-y-0 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                        <FormControl>
                          <RadioGroupItem value="business" />
                        </FormControl>
                        <div className="space-y-1 text-left">
                          <FormLabel className="text-md font-semibold">Business Brand</FormLabel>
                          <FormDescription>
                            Strengthening your company's presence, awareness, and customer connection.
                          </FormDescription>
                        </div>
                      </FormItem>
                      <FormItem className="flex items-start space-x-3 space-y-0 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                        <FormControl>
                          <RadioGroupItem value="personal" />
                        </FormControl>
                        <div className="space-y-1 text-left">
                          <FormLabel className="text-md font-semibold">Personal Brand</FormLabel>
                          <FormDescription>
                            Building your influence, credibility, and thought leadership.
                          </FormDescription>
                        </div>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </Form>

        <Button 
          className={`bg-rozy hover:bg-rozy-dark text-white px-6 py-3 rounded-lg text-lg ${!selectedBrand ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!selectedBrand}
          onClick={handleStartOnboarding}
        >
          Start Onboarding
        </Button>
        {!selectedBrand && (
          <p className="text-sm text-gray-500 mt-2">Please select a brand type to continue</p>
        )}
      </div>
    </div>
  );
};

export default Index;
