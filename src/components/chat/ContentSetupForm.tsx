
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ContentSetup } from "@/contexts/ChatContext";

interface ContentSetupFormProps {
  onSubmit: (data: { content: string; setup?: any }) => void;
  defaultSetup?: ContentSetup;
}

export function ContentSetupForm({ onSubmit, defaultSetup }: ContentSetupFormProps) {
  const [name, setName] = useState(defaultSetup?.name || "");
  const [goal, setGoal] = useState(defaultSetup?.configuration?.goal || "");
  const [format, setFormat] = useState(defaultSetup?.configuration?.format || "");
  const [hook, setHook] = useState(defaultSetup?.configuration?.hook || "");
  const [tone, setTone] = useState(defaultSetup?.configuration?.tone || "");
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const setupData = {
      name,
      goal,
      format,
      hook,
      tone
    };
    
    onSubmit({
      content: "Generated content based on the provided setup would appear here.",
      setup: setupData
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Template Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="E.g., Twitter Thread Template"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="goal">Content Goal</Label>
        <Input
          id="goal"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="E.g., Educate about Web3"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="format">Content Format</Label>
        <Input
          id="format"
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          placeholder="E.g., Twitter Thread, Blog Post"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="hook">Hook Style</Label>
        <Input
          id="hook"
          value={hook}
          onChange={(e) => setHook(e.target.value)}
          placeholder="E.g., Question, Statistic"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="tone">Content Tone</Label>
        <Input
          id="tone"
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          placeholder="E.g., Professional, Casual"
          required
        />
      </div>
      
      <div className="pt-4">
        <Button type="submit" className="w-full">
          Generate Content
        </Button>
      </div>
    </form>
  );
}
