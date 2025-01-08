import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface PromptFormProps {
  onSubmit: (data: { jersey: string; promotion: string }) => void;
}

export const PromptForm = ({ onSubmit }: PromptFormProps) => {
  const [jersey, setJersey] = useState("");
  const [promotion, setPromotion] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ jersey, promotion });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-slide-up">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="jersey">Featured Jersey</Label>
            <Textarea
              id="jersey"
              placeholder="Describe the main jersey you want to spotlight..."
              value={jersey}
              onChange={(e) => setJersey(e.target.value)}
              className="min-h-[100px]"
              required
            />
            <p className="text-sm text-gray-500">
              Example: "We have a limited-edition Real Madrid jersey in red and silver"
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="promotion">Promotion Details</Label>
            <Input
              id="promotion"
              placeholder="Enter the promotion or discount..."
              value={promotion}
              onChange={(e) => setPromotion(e.target.value)}
              required
            />
            <p className="text-sm text-gray-500">
              Example: "10% off for all pre-season orders"
            </p>
          </div>
        </div>

        <Button type="submit" className="w-full mt-6">
          Generate Email
        </Button>
      </Card>
    </form>
  );
};