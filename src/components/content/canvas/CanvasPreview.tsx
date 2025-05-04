
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Linkedin, Facebook } from "lucide-react";

interface CanvasPreviewProps {
  content: string;
}

const CanvasPreview: React.FC<CanvasPreviewProps> = ({ content }) => {
  const [platform, setPlatform] = useState<"twitter" | "linkedin" | "facebook">("twitter");
  
  // Platform-specific character limits
  const characterLimits = {
    twitter: 280,
    linkedin: 3000,
    facebook: 63206
  };
  
  // Get current character count
  const charCount = content.length;
  const isOverLimit = charCount > characterLimits[platform];
  
  // Format content based on platform specific requirements
  const formatForPlatform = (text: string, platform: "twitter" | "linkedin" | "facebook") => {
    let formattedText = text;
    
    // Handle hashtags and mentions for different platforms
    const formatHashtags = (text: string) => {
      return text.replace(/(\s|^)#(\w+)/g, (match, space, tag) => {
        return `${space}<span class="text-blue-400">#${tag}</span>`;
      });
    };
    
    const formatMentions = (text: string) => {
      return text.replace(/(\s|^)@(\w+)/g, (match, space, username) => {
        return `${space}<span class="text-blue-400">@${username}</span>`;
      });
    };
    
    // Apply platform-specific formatting
    switch (platform) {
      case "twitter":
        // Twitter/X treats line breaks as new paragraphs
        formattedText = formatHashtags(formattedText);
        formattedText = formatMentions(formattedText);
        break;
      case "linkedin":
        // LinkedIn treats multiple line breaks as one
        formattedText = formattedText.replace(/\n{3,}/g, "\n\n");
        formattedText = formatHashtags(formattedText);
        formattedText = formatMentions(formattedText);
        break;
      case "facebook":
        // Facebook has its own link preview system
        formattedText = formatHashtags(formattedText);
        formattedText = formatMentions(formattedText);
        break;
    }
    
    return formattedText;
  };
  
  // Format content with markdown-like syntax
  const renderFormattedContent = (text: string) => {
    // Handle markdown formatting
    let formattedText = text;
    
    // Bold text (between ** **)
    formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Italic text (between * *)
    formattedText = formattedText.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Underline (between _ _)
    formattedText = formattedText.replace(/_(.*?)_/g, '<u>$1</u>');
    
    return formattedText;
  };

  return (
    <div className="border border-white/10 rounded-xl p-4 bg-black">
      <Tabs defaultValue="twitter" onValueChange={(value) => setPlatform(value as "twitter" | "linkedin" | "facebook")}>
        <div className="flex items-center justify-between mb-4">
          <TabsList className="bg-white/5">
            <TabsTrigger value="twitter" className="data-[state=active]:bg-white/10">
              <MessageSquare className="h-4 w-4 mr-2" />
              Twitter/X
            </TabsTrigger>
            <TabsTrigger value="linkedin" className="data-[state=active]:bg-white/10">
              <Linkedin className="h-4 w-4 mr-2" />
              LinkedIn
            </TabsTrigger>
            <TabsTrigger value="facebook" className="data-[state=active]:bg-white/10">
              <Facebook className="h-4 w-4 mr-2" />
              Facebook
            </TabsTrigger>
          </TabsList>
          
          <div className={`text-xs ${isOverLimit ? 'text-red-400' : 'text-white/60'}`}>
            {charCount}/{characterLimits[platform]}
          </div>
        </div>

        <TabsContent value="twitter" className="mt-0">
          <div className="flex items-center mb-4">
            <div className="h-10 w-10 rounded-full bg-gray-700 mr-3"></div>
            <div>
              <div className="font-medium">Your Name</div>
              <div className="text-xs text-white/60">@yourhandle</div>
            </div>
          </div>
          
          <div className="prose prose-invert max-w-none">
            {formatForPlatform(content, "twitter").split("\n").map((paragraph, i) => {
              const formattedParagraph = renderFormattedContent(paragraph);
              
              // Bullet points
              if (formattedParagraph.startsWith('• ')) {
                const bulletContent = formattedParagraph.replace('• ', '');
                return <li key={i} dangerouslySetInnerHTML={{ __html: bulletContent }} />;
              }
              
              return formattedParagraph ? (
                <p key={i} dangerouslySetInnerHTML={{ __html: formattedParagraph }} />
              ) : <br key={i} />;
            })}
            
            {content.length > characterLimits.twitter && (
              <div className="text-red-400 font-medium mt-2">Content exceeds Twitter's 280 character limit</div>
            )}
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-4 text-white/70">
              <button className="hover:text-blue-400">
                <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.7 14.7c-.4.4-1 .4-1.4 0l-3-3c-.4-.4-.4-1 0-1.4.4-.4 1-.4 1.4 0l2.3 2.3 6.3-6.3c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4l-7 7z" fill="currentColor"/>
                </svg>
              </button>
              <button className="hover:text-blue-400">
                <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.5 1.9c-.3-.3-.7-.3-1 0l-3 3c-.3.3-.3.7 0 1 .3.3.7.3 1 0l1.8-1.8v6.2c0 .4.3.7.7.7s.7-.3.7-.7V4.1l1.8 1.8c.3.3.7.3 1 0 .3-.3.3-.7 0-1l-3-3zM3 12.5c-.4 0-.7.3-.7.7v2.1c0 .9.7 1.7 1.7 1.7h12c.9 0 1.7-.7 1.7-1.7v-2.1c0-.4-.3-.7-.7-.7s-.7.3-.7.7v2.1c0 .2-.1.3-.3.3h-12c-.2 0-.3-.1-.3-.3v-2.1c0-.4-.3-.7-.7-.7z" fill="currentColor"/>
                </svg>
              </button>
              <button className="hover:text-blue-400">
                <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 17.27L16.18 21l-1.64-7.03L20 9.24l-7.19-.61L10 2 7.19 8.63 0 9.24l5.46 4.73L3.82 21 10 17.27z" fill="currentColor"/>
                </svg>
              </button>
            </div>
            
            <button className="text-blue-400 font-medium text-sm">Tweet</button>
          </div>
        </TabsContent>
        
        <TabsContent value="linkedin" className="mt-0">
          <div className="flex items-center mb-4">
            <div className="h-10 w-10 rounded-full bg-gray-700 mr-3"></div>
            <div>
              <div className="font-medium">Your Name</div>
              <div className="text-xs text-white/60">Professional Title • 2nd</div>
            </div>
          </div>
          
          <div className="prose prose-invert max-w-none">
            {formatForPlatform(content, "linkedin").split("\n").map((paragraph, i) => {
              const formattedParagraph = renderFormattedContent(paragraph);
              
              // Bullet points
              if (formattedParagraph.startsWith('• ')) {
                const bulletContent = formattedParagraph.replace('• ', '');
                return <li key={i} dangerouslySetInnerHTML={{ __html: bulletContent }} />;
              }
              
              return formattedParagraph ? (
                <p key={i} dangerouslySetInnerHTML={{ __html: formattedParagraph }} />
              ) : <br key={i} />;
            })}
            
            {content.length > characterLimits.linkedin && (
              <div className="text-red-400 font-medium mt-2">Content exceeds LinkedIn's character limit</div>
            )}
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-4 text-white/70">
              <button className="hover:text-blue-600">
                <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 9h-7V2c0-.6-.4-1-1-1s-1 .4-1 1v7H2c-.6 0-1 .4-1 1s.4 1 1 1h7v7c0 .6.4 1 1 1s1-.4 1-1v-7h7c.6 0 1-.4 1-1s-.4-1-1-1z" fill="currentColor"/>
                </svg>
              </button>
              <button className="hover:text-blue-600">
                <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4H9v-4H5V9h4V5h2v4h4v2z" fill="currentColor"/>
                </svg>
              </button>
              <button className="hover:text-blue-600">
                <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 2H1c-.6 0-1 .4-1 1v14c0 .6.4 1 1 1h18c.6 0 1-.4 1-1V3c0-.6-.4-1-1-1zm-1 14H2V4h16v12z" fill="currentColor"/>
                  <path d="M5 7h10v2H5V7zm0 4h10v2H5v-2z" fill="currentColor"/>
                </svg>
              </button>
            </div>
            
            <button className="text-blue-600 font-medium text-sm">Post</button>
          </div>
        </TabsContent>
        
        <TabsContent value="facebook" className="mt-0">
          <div className="flex items-center mb-4">
            <div className="h-10 w-10 rounded-full bg-gray-700 mr-3"></div>
            <div>
              <div className="font-medium">Your Name</div>
              <div className="text-xs text-white/60">Just now • <span>🌎</span></div>
            </div>
          </div>
          
          <div className="prose prose-invert max-w-none">
            {formatForPlatform(content, "facebook").split("\n").map((paragraph, i) => {
              const formattedParagraph = renderFormattedContent(paragraph);
              
              // Bullet points
              if (formattedParagraph.startsWith('• ')) {
                const bulletContent = formattedParagraph.replace('• ', '');
                return <li key={i} dangerouslySetInnerHTML={{ __html: bulletContent }} />;
              }
              
              return formattedParagraph ? (
                <p key={i} dangerouslySetInnerHTML={{ __html: formattedParagraph }} />
              ) : <br key={i} />;
            })}
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-4 text-white/70">
              <button className="hover:text-blue-500">
                <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 19l-7-7H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v7c0 1.1-.9 2-2 2h-7l-2 5z" fill="currentColor"/>
                </svg>
              </button>
              <button className="hover:text-blue-500">
                <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 9h-5V4c0-.6-.4-1-1-1h-2c-.6 0-1 .4-1 1v5H5c-.6 0-1 .4-1 1v2c0 .6.4 1 1 1h5v5c0 .6.4 1 1 1h2c.6 0 1-.4 1-1v-5h5c.6 0 1-.4 1-1v-2c0-.6-.4-1-1-1z" fill="currentColor"/>
                </svg>
              </button>
              <button className="hover:text-blue-500">
                <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 17.27L16.18 21l-1.64-7.03L20 9.24l-7.19-.61L10 2 7.19 8.63 0 9.24l5.46 4.73L3.82 21 10 17.27z" fill="currentColor"/>
                </svg>
              </button>
            </div>
            
            <button className="text-blue-500 font-medium text-sm">Share</button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CanvasPreview;
