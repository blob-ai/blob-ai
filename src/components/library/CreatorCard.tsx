
import React from "react";
import { CardContainer } from "@/components/ui/card-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
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
    <CardContainer className="bg-[#1A202C] border-white/10 hover:border-primary-400/30 transition-all flex flex-col">
      <div className="flex items-start gap-3">
        <img
          src={creator.avatar}
          alt={creator.name}
          className="w-16 h-16 rounded-full object-cover border-2 border-white/10"
        />
        <div className="flex-grow">
          <h3 className="font-semibold text-white">{creator.name}</h3>
          <p className="text-sm text-white/60">{creator.handle}</p>
          <div className="flex items-center gap-1 mt-1">
            <Users className="h-3.5 w-3.5 text-primary-400" />
            <span className="text-xs text-white/60">{creator.followers} followers</span>
          </div>
        </div>
        <Badge variant="outline" className="bg-black/30 text-white/60 border-white/10">
          {creator.category}
        </Badge>
      </div>

      <p className="text-sm text-white/80 mt-3 flex-grow">{creator.summary}</p>

      <div className="mt-4">
        <div className="flex flex-wrap gap-1 mb-4">
          {creator.tone.split(", ").map((tone) => (
            <Badge
              key={tone}
              className="bg-[#3260ea]/20 text-blue-400 border-none"
            >
              {tone}
            </Badge>
          ))}
        </div>

        <Button 
          className="w-full bg-[#3260ea] hover:bg-[#2853c6] text-white" 
          onClick={handleViewCreator}
        >
          View Style
        </Button>
      </div>
    </CardContainer>
  );
};

export default CreatorCard;
