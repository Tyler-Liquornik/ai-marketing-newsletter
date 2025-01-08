import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { PromptForm } from "@/components/PromptForm";
import { EmailPreview } from "@/components/EmailPreview";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

type Step = "upload" | "prompt" | "preview";

const Index = () => {
  const [step, setStep] = useState<Step>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [emailContent, setEmailContent] = useState("");
  const { toast } = useToast();

  const handleFileAccepted = (acceptedFile: File) => {
    setFile(acceptedFile);
    setStep("prompt");
  };

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
    // In a real implementation, this would send the email through your backend
    toast({
      title: "Success!",
      description: "Your email campaign has been scheduled for sending.",
    });
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
            Email Marketing Assistant
          </h1>
          <p className="mt-2 text-gray-600">
            Create and send personalized email campaigns in minutes
          </p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center">
            {["upload", "prompt", "preview"].map((s, index) => (
              <div
                key={s}
                className={`flex items-center ${
                  index < ["upload", "prompt", "preview"].indexOf(step) + 1
                    ? "text-primary"
                    : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index < ["upload", "prompt", "preview"].indexOf(step) + 1
                      ? "bg-primary text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {index + 1}
                </div>
                {index < 2 && (
                  <div
                    className={`h-1 w-24 mx-2 ${
                      index < ["upload", "prompt", "preview"].indexOf(step)
                        ? "bg-primary"
                        : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
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