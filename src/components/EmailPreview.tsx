import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface EmailPreviewProps {
  content: string;
  onSend: (finalContent: string) => void; // Sends the finalized email
}

export const EmailPreview = ({ content, onSend }: EmailPreviewProps) => {
  const [editedContent, setEditedContent] = useState(content);
  const { toast } = useToast();

  const handleSend = () => {
    if (!editedContent.trim()) {
      toast({
        title: "Empty content",
        description: "Please ensure the email content is not empty.",
        variant: "destructive",
      });
      return;
    }
    onSend(editedContent); // Send the edited email
  };

  return (
      <div className="space-y-6 animate-slide-up">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Preview & Edit</h3>
          <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="min-h-[300px] mb-4"
          />
          <div className="flex justify-end space-x-4">
            <Button onClick={handleSend}>
              Send Email
            </Button>
          </div>
        </Card>
      </div>
  );
};
