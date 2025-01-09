import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { PromptForm } from "@/components/PromptForm";
import { EmailPreview } from "@/components/EmailPreview";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {EmailRecipient} from "@/lib/EmailRecipient.ts";

type Step = "upload" | "prompt" | "preview";

const Index = () => {
  const [step, setStep] = useState<Step>("upload");
  const [emailRecipientsData, setEmailRecipientsData] = useState<EmailRecipient[] | null>(null);
  const [emailContent, setEmailContent] = useState("");
  const { toast } = useToast();

  const handleFileAccepted = (acceptedEmailRecipientsData: EmailRecipient[]) => {
    setEmailRecipientsData(acceptedEmailRecipientsData);
    console.log(acceptedEmailRecipientsData);
    setStep("prompt");
  };

  // TODO: plug ChatGPT API here
  const handlePromptSubmit = async (data: { jersey: string; promotion: string }) => {
    // In a real implementation, this would call your API to generate content
    const sampleContent = `Dear [First Name],

We're excited to share something special with you! ${data.jersey}

${data.promotion}

Don't miss out on this amazing offer! Click below to secure your jersey today.

Best regards,
Your Soccer Jersey Team`;

    setEmailContent(sampleContent);
    setStep("preview");
  };

  const handleSend = async (finalContent: string) => {
    if (!emailRecipientsData || emailRecipientsData.length === 0) {
      toast({
        title: "Error",
        description: "No email recipients found. Please upload a file first.",
        variant: "destructive",
      });
      return;
    }

    console.log(emailRecipientsData);

    try {
      const response = await fetch(
          "https://uv56jskeibw75ccaovmcck5mam0jbbiu.lambda-url.us-east-2.on.aws/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              emailRecipients: emailRecipientsData,
              emailContent: finalContent,
            }),
          });

      if (!response.ok) {
        const error = await response.json();
        console.log(error.message);
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

  const renderStep = () => {
    switch (step) {
      case "upload":
        return <FileUpload onFileAccepted={handleFileAccepted} />;
      case "prompt":
        return <PromptForm onSubmit={handlePromptSubmit} />;
      case "preview":
        return <EmailPreview content={emailContent} onSend={handleSend} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            AI Email Marketing Assistant
          </h1>
          <p className="mt-2 text-gray-600">
            Create and send personalized email campaigns in seconds
          </p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center w-full">
            {["upload", "prompt", "preview"].map((s, index) => {
              const isActive = index < ["upload", "prompt", "preview"].indexOf(step) + 1;
              return (
                  <div
                      key={s}
                      className={`flex items-center ${
                          index !== 2 ? "flex-1" : ""
                      } ${isActive ? "text-primary" : "text-gray-400"}`}
                  >
                    {/* Circle */}
                    <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isActive ? "bg-primary text-white" : "bg-gray-200"
                        }`}
                    >
                      {index + 1}
                    </div>

                    {/* Horizontal bar */}
                    {!(index == 2) && (
                        <div
                            className={`h-1 flex-1 mx-2 ${
                                index < ["upload", "prompt", "preview"].indexOf(step)
                                    ? "bg-primary"
                                    : "bg-gray-200"
                            }`}
                        />
                    )}
                  </div>
              );
            })}
          </div>
        </div>


        <Card className="p-6">
          {renderStep()}
        </Card>
      </div>
    </div>
  );
};

export default Index;