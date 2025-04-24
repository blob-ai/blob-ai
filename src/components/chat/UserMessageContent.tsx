import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UserMessageContentProps {
  content: string;
}

const UserMessageContent: React.FC<UserMessageContentProps> = ({ content }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Check if this is a template prompt by looking for specific markers
  const isTemplatePrompt = 
    content.includes('TEMPLATE:') && 
    content.includes('CONTENT TO TRANSFORM:');
  
  if (!isTemplatePrompt) {
    // For regular messages, just return the content as is
    return <div className="text-[15px] leading-relaxed">{content}</div>;
  }
  
  // For template prompts, extract only the template and content sections
  const extractTemplateAndContent = () => {
    const templateStart = content.indexOf('TEMPLATE:');
    const contentStart = content.indexOf('CONTENT TO TRANSFORM:');
    const formattingRulesStart = content.indexOf('FORMATTING RULES:');
    
    if (templateStart === -1 || contentStart === -1) return content;
    
    // Extract the template section
    const templateSection = content.substring(
      templateStart, 
      contentStart
    ).trim();
    
    // Extract the content section
    const contentSection = content.substring(
      contentStart, 
      formattingRulesStart !== -1 ? formattingRulesStart : undefined
    ).trim();
    
    return `${templateSection}\n\n${contentSection}`;
  };
  
  return (
    <div>
      {isExpanded ? (
        <>
          <div className="whitespace-pre-wrap text-[15px] leading-relaxed">{extractTemplateAndContent()}</div>
          <Button
            variant="ghost"
            size="sm"
            className="px-3 py-1.5 h-auto text-sm mt-3 opacity-80 hover:opacity-100"
            onClick={() => setIsExpanded(false)}
          >
            <ChevronUp className="h-4 w-4 mr-1.5" />
            Show less
          </Button>
        </>
      ) : (
        <>
          <div className="font-medium text-base">Transform content to match template</div>
          <Button
            variant="ghost"
            size="sm"
            className="px-3 py-1.5 h-auto text-sm mt-3 opacity-80 hover:opacity-100"
            onClick={() => setIsExpanded(true)}
          >
            <Eye className="h-4 w-4 mr-1.5" />
            View details
          </Button>
        </>
      )}
    </div>
  );
};

export default UserMessageContent; 