
import React from "react";
import { CardContainer } from "@/components/ui/card-container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Twitter } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Creator {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  followers: string;
  category: string;
  summary: string;
  tone: string;
}

interface CreatorCardProps {
  creator: Creator;
}

const CreatorCard: React.FC<CreatorCardProps> = ({ creator }) => {
  const navigate = useNavigate();
  
  const handleViewCreator = () => {
    navigate(`/dashboard/library/creator/${creator.id}`);
  };

  return (
    <CardContainer className="bg-[#1e2431] border-white/10 p-0 overflow-hidden shadow-md hover:shadow-lg transition-all">
      {/* Card Header */}
      <div className="p-4 border-b border-white/10 flex items-center gap-3">
        <img
          src={creator.avatar || "/placeholder.svg"}
          alt={creator.name}
          className="w-12 h-12 rounded-full object-cover border border-white/20"
        />
        <div>
          <h3 className="font-medium text-white">{creator.name}</h3>
          <div className="flex items-center gap-2 text-sm text-white/70">
            <Twitter className="h-3.5 w-3.5 text-blue-400" />
            <span>{creator.handle}</span>
            <span className="text-white/50">•</span>
            <span>{creator.followers} followers</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4">
        <p className="text-sm text-white/80 mb-4">
          {creator.summary}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className="bg-blue-500/20 text-blue-400 border-none">
            {creator.category}
          </Badge>
          {creator.tone.split(", ").map((tone) => (
            <Badge key={tone} className="bg-[#3260ea]/20 text-blue-400 border-none">
              {tone}
            </Badge>
          ))}
        </div>

        <Button
          onClick={handleViewCreator}
          className="w-full bg-[#3260ea] hover:bg-[#2853c6]"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          View Styles
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </CardContainer>
  );
};

export default CreatorCard;
