import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { PromptForm } from "@/components/PromptForm";
import { EmailPreview } from "@/components/EmailPreview";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { EmailRecipient } from "@/lib/EmailRecipient.ts";
import promptFormData from "@/lib/promptFormData.json";

type Step = "upload" | "prompt" | "preview";

const Index = () => {
  const [step, setStep] = useState<Step>("upload");
  const [emailRecipientsData, setEmailRecipientsData] = useState<EmailRecipient[] | null>(null);
  const [emailContent, setEmailContent] = useState(""); // Stores generated or edited email content
  const [currentIndex, setCurrentIndex] = useState(0); // Tracks the current prompt index
  const { toast } = useToast();

  /**
   * Handles file upload and transitions to the "prompt" step.
   */
  const handleFileAccepted = (acceptedEmailRecipientsData: EmailRecipient[]) => {
    setEmailRecipientsData(acceptedEmailRecipientsData);
    setStep("prompt");
  };

  /**
   * Handles generated email content from the PromptForm.
   */
  const handleGeneratedEmail = (generatedEmail: string) => {
    setEmailContent(generatedEmail);
    setStep("preview");
  };

  /**
   * Handles transitioning to the next or previous prompt in the "prompt" step.
   */
  const handlePromptNavigation = (direction: "next" | "prev") => {
    if (direction === "next" && currentIndex < promptFormData.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else if (direction === "prev" && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  /**
   * Handles sending the email content to the backend Lambda function responsible for sending emails.
   */
  const handleSend = async (finalContent: string) => {
    if (!emailRecipientsData || emailRecipientsData.length === 0) {
      toast({
        title: "Error",
        description: "No email recipients found. Please upload a file first.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(
          "https://uv56jskeibw75ccaovmcck5mam0jbbiu.lambda-url.us-east-2.on.aws/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              emailRecipients: emailRecipientsData,
              emailContent: finalContent,
            }),
          }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to send emails.");
      }

      toast({
        title: "Success!",
        description: "Your email campaign has been scheduled for sending.",
      });
    } catch (error: unknown) {
      console.error("Error sending emails:", error);
      toast({
        title: "Error",
        description: "Failed to send emails.",
        variant: "destructive",
      });
    }
  };

  /**
   * Renders the appropriate step (upload, prompt, or preview) based on the current step.
   */
  const renderStep = () => {
    switch (step) {
      case "upload":
        return <FileUpload onFileAccepted={handleFileAccepted} />;
      case "prompt":
        return (
            <PromptForm
                onGenerated={handleGeneratedEmail}
                onNavigate={handlePromptNavigation}
                currentIndex={currentIndex}
            />
        );
      case "preview":
        return <EmailPreview content={emailContent} onSend={handleSend} />;
      default:
        return null;
    }
  };

  return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">AI Email Marketing Assistant</h1>
            <p className="mt-2 text-gray-600">Create and send personalized email campaigns in seconds.</p>
          </div>
          <div className="mb-8">
            <div className="flex justify-between items-center w-full">
              {["upload", "prompt", "preview"].map((s, index) => {
                const isActive = index <= ["upload", "prompt", "preview"].indexOf(step);
                return (
                    <div
                        key={s}
                        className={`flex items-center ${index !== 2 ? "flex-1" : ""} ${
                            isActive ? "text-primary" : "text-gray-400"
                        }`}
                    >
                      <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              isActive ? "bg-primary text-white" : "bg-gray-200"
                          }`}
                      >
                        {index + 1}
                      </div>
                      {index !== 2 && (
                          <div
                              className={`h-1 flex-1 mx-2 ${
                                  isActive ? "bg-primary" : "bg-gray-200"
                              }`}
                          />
                      )}
                    </div>
                );
              })}
            </div>
          </div>
          <Card className="p-6">{renderStep()}</Card>
        </div>
      </div>
  );
};

export default Index;
