
import React from "react";
import { Card } from "@/components/ui/card";

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
  return (
    <Card className="p-4 border border-white/10 bg-white/5 rounded-md mt-2">
      <div className="space-y-2">
        {data.setup && (
          <div className="text-sm text-white/70 mb-2">
            {data.setup.name && <p><strong>Template:</strong> {data.setup.name}</p>}
            {data.setup.goal && <p><strong>Goal:</strong> {data.setup.goal}</p>}
            {data.setup.format && <p><strong>Format:</strong> {data.setup.format}</p>}
            {data.setup.tone && <p><strong>Tone:</strong> {data.setup.tone}</p>}
          </div>
        )}
        <div className="whitespace-pre-wrap">{data.content}</div>
      </div>
    </Card>
  );
}
