import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import promptFormData from "@/lib/promptFormData.json";
import prompts from "@/lib/prompts.json";
import Groq from "groq-sdk";

interface PromptFormProps {
  onGenerated: (generatedEmail: string) => void;
  onNavigate: (direction: "next" | "prev") => void;
  currentIndex: number;
}

export const PromptForm = ({ onGenerated, onNavigate, currentIndex }: PromptFormProps) => {
  const [userInput, setUserInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (value: string) => {
    setUserInput(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userInput.trim()) {
      toast({
        title: "Input Required",
        description: "Please fill in the input for the current prompt.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const prependExplanation = `
        You are an AI assistant tasked with generating professional marketing email content based on user-provided inputs. 
        The user will provide details that will replace placeholders in a predefined template. 
        Respond concisely, ensuring the tone is polite, professional, and appropriate for email communication.
        Please start generating the email as you would after any introduction, as the text "Dear Name" will be added to your response later.
        Please ensure then once that your response is added to 'Dear Name' at the top, the email should be ready to send as is there with no placeholders for the user to fill.
        The small business sells retro soccer jerseys, and wants to just start out its marketing newsletter, so ensure that audience would enjoy the read while still doing the marketing job described in your prompt.
        The first sentence should start capitalized. Add a signoff from the company.
      `;

      const currentPrompt = prompts[currentIndex].prompt;
      const finalPrompt = prependExplanation + "\n\n" + currentPrompt.replace("%s", userInput);

      // Initialize Groq client
      // Don't care about exposing api key, grow is free and this is a small personal project
      const groq = new Groq({
        apiKey: "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",
        dangerouslyAllowBrowser: true
      });

      // Generate response using Groq
      const response = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: finalPrompt,
          },
        ],
        model: "llama-3.3-70b-versatile",
      });

      const generatedText = response.choices[0]?.message?.content || "";

      onGenerated(`Dear, [First Name]\n\n${generatedText}`);
      toast({
        title: "Success",
        description: "Email content generated successfully.",
      });
    } catch (error: unknown) {
      console.error("Error generating email:", error);
      toast({
        title: "Error",
        description: "Failed to generate email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFirstPrompt = currentIndex === 0;
  const isLastPrompt = currentIndex === prompts.length - 1;

  return (
      <form onSubmit={handleSubmit} className="space-y-6 animate-slide-up">
        <Card className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="promptInput">{promptFormData[currentIndex].title}</Label>
            <Textarea
                id="promptInput"
                placeholder={promptFormData[currentIndex].textBoxPrompt}
                value={userInput}
                onChange={(e) => handleInputChange(e.target.value)}
                className="min-h-[80px]"
            />
            <p className="text-sm text-gray-500">Example: {promptFormData[currentIndex].example}</p>
          </div>
          <div className="flex justify-between">
            {!isFirstPrompt && (
                <Button variant="outline" type="button" onClick={() => onNavigate("prev")}>
                  &larr; Prev
                </Button>
            )}
            {!isLastPrompt && (
                <Button variant="outline" type="button" onClick={() => onNavigate("next")}>
                  Next &rarr;
                </Button>
            )}
          </div>
          <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
            {isSubmitting ? "Generating..." : "Generate Email"}
          </Button>
        </Card>
      </form>
  );
};
