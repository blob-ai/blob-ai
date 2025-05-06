
import React from "react";
import { CardContainer } from "@/components/ui/card-container";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  
  const handleCardClick = () => {
    navigate(`/dashboard/library/creator/${creator.id}`);
  };

  // Get first letter of name for avatar fallback
  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  // Get tone badges - limit to first 2
  const tones = creator.tone.split(', ').slice(0, 2);

  return (
    <CardContainer 
      className="hover:border-primary-400/50 transition-all cursor-pointer h-full"
      onClick={handleCardClick}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border border-white/10">
            <AvatarImage src={creator.avatar} alt={creator.name} />
            <AvatarFallback>{getInitials(creator.name)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-white font-medium">{creator.name}</h3>
            <p className="text-white/60 text-sm">{creator.handle}</p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <Badge variant="outline" className="bg-black/30 text-white/80 border-white/10">
            {creator.category}
          </Badge>
          <span className="text-sm text-white/60">{creator.followers} followers</span>
        </div>

        <p className="mt-3 text-sm text-white/80 flex-grow">{creator.summary}</p>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-2">
            {tones.map((tone, index) => (
              <Badge key={index} variant="secondary" className="bg-white/10 text-white/80 border-none">
                {tone}
              </Badge>
            ))}
          </div>
          <Button variant="ghost" size="sm" className="text-primary-400 hover:bg-primary-400/10">
            View
          </Button>
        </div>
      </div>
    </CardContainer>
  );
};

export default CreatorCard;
