
import React from "react";
import { Card } from "@/components/ui/card";
import LinkedInPreview from "@/components/content/preview/LinkedInPreview";

interface ContentPreviewProps {
  data: {
    content: string;
    setup?: {
      name?: string;
      goal?: string;
      format?: string;
      hook?: string;
      tone?: string;
    };
  };
}

export function ContentPreview({ data }: ContentPreviewProps) {
  // Create mock profile info
  const profileInfo = {
    name: "Your Name",
    title: "Your Title",
    timestamp: "Just now"
  };

  return (
    <Card className="border border-white/10 bg-white/5 rounded-md mt-2 p-0 overflow-hidden">
      {/* Show setup info if available */}
      {data.setup && Object.keys(data.setup).some(key => !!data.setup?.[key as keyof typeof data.setup]) && (
        <div className="text-sm text-white/70 p-4 border-b border-white/10 bg-[#121212]">
          {data.setup.name && <p><strong>Template:</strong> {data.setup.name}</p>}
          {data.setup.goal && <p><strong>Goal:</strong> {data.setup.goal}</p>}
          {data.setup.format && <p><strong>Format:</strong> {data.setup.format}</p>}
          {data.setup.tone && <p><strong>Tone:</strong> {data.setup.tone}</p>}
        </div>
      )}

      {/* Show content in LinkedIn-style preview */}
      <LinkedInPreview 
        content={data.content} 
        profileInfo={profileInfo}
        mode="dark"
      />
    </Card>
  );
}
