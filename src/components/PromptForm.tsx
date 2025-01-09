import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import promptFormData from "@/lib/promptFormData.json";

interface PromptData {
  jersey: string;
  promotion: string;
  newArrivalAlert: string;
  collectorsSpotlight: string;
  limitedTimeOffer: string;
  behindTheDesign: string;
  jerseyOfTheWeek: string;
  customerFavorites: string;
  perfectGiftIdea: string;
  matchMemories: string;
  seasonalPicks: string;
  socialMediaChallenge: string;
}

interface PromptFormProps {
  onSubmit: (data: PromptData) => void;
}

const fieldMap: Record<string, keyof PromptData> = {
  "Featured Jersey": "jersey",
  "Promotion Details": "promotion",
  "New Arrival Alert": "newArrivalAlert",
  "Collector’s Spotlight": "collectorsSpotlight",
  "Limited-Time Offer": "limitedTimeOffer",
  "Behind the Design": "behindTheDesign",
  "Jersey of the Week": "jerseyOfTheWeek",
  "Customer Favorites": "customerFavorites",
  "Perfect Gift Idea": "perfectGiftIdea",
  "Match Memories": "matchMemories",
  "Seasonal Picks": "seasonalPicks",
  "Social Media Challenge": "socialMediaChallenge",
};

export const PromptForm = ({ onSubmit }: PromptFormProps) => {
  const [formData, setFormData] = useState<PromptData>({
    jersey: "",
    promotion: "",
    newArrivalAlert: "",
    collectorsSpotlight: "",
    limitedTimeOffer: "",
    behindTheDesign: "",
    jerseyOfTheWeek: "",
    customerFavorites: "",
    perfectGiftIdea: "",
    matchMemories: "",
    seasonalPicks: "",
    socialMediaChallenge: "",
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleChange = (field: keyof PromptData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < promptFormData.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const currentPrompt = promptFormData[currentIndex];
  const fieldKey = fieldMap[currentPrompt.title];
  const isFirstPrompt = currentIndex === 0;
  const isLastPrompt = currentIndex === promptFormData.length - 1;
  let alignmentClass = "justify-between";
  if (isFirstPrompt && !isLastPrompt) {
    alignmentClass = "justify-end";
  } else if (!isFirstPrompt && isLastPrompt) {
    alignmentClass = "justify-start";
  }

  return (
      <form onSubmit={handleSubmit} className="space-y-6 animate-slide-up">
        <Card className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor={fieldKey}>{currentPrompt.title}</Label>
            <Textarea
                id={fieldKey}
                placeholder={currentPrompt.textBoxPrompt}
                value={formData[fieldKey]}
                onChange={(e) => handleChange(fieldKey, e.target.value)}
                className="min-h-[80px]"
            />
            <p className="text-sm text-gray-500">
              Example: {currentPrompt.example}
            </p>
          </div>

          <div className={`flex items-center ${alignmentClass}`}>
            {!isFirstPrompt && (
                <Button
                    variant="outline"
                    type="button"
                    onClick={handlePrev}
                    className="flex items-center justify-center"
                >
                  <span className="mr-2">&larr;</span>
                  Prev
                </Button>
            )}
            {!isLastPrompt && (
                <Button
                    variant="outline"
                    type="button"
                    onClick={handleNext}
                    className="flex items-center justify-center"
                >
                  Next
                  <span className="ml-2">&rarr;</span>
                </Button>
            )}
          </div>

          <Button type="submit" className="w-full mt-6">
            Generate Email
          </Button>
        </Card>
      </form>
  );
};
