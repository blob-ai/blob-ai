
import React from "react";

interface CanvasPreviewProps {
  content: string;
}

const CanvasPreview: React.FC<CanvasPreviewProps> = ({ content }) => {
  return (
    <div className="border border-white/10 rounded-xl p-4 bg-black">
      <div className="flex items-center mb-4">
        <div className="h-10 w-10 rounded-full bg-gray-700 mr-3"></div>
        <div>
          <div className="font-medium">Your Name</div>
          <div className="text-xs text-white/60">Your Credentials</div>
        </div>
      </div>
      
      <div className="prose prose-invert max-w-none">
        {content.split("\n").map((paragraph, i) => {
          // Handle markdown formatting
          let formattedText = paragraph;
          
          // Bold text (between ** **)
          formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
          
          // Italic text (between * *)
          formattedText = formattedText.replace(/\*(.*?)\*/g, '<em>$1</em>');
          
          // Underline (between _ _)
          formattedText = formattedText.replace(/_(.*?)_/g, '<u>$1</u>');
          
          // Bullet points
          if (formattedText.startsWith('• ')) {
            formattedText = formattedText.replace('• ', '');
            return <li key={i} dangerouslySetInnerHTML={{ __html: formattedText }} />;
          }
          
          return <p key={i} dangerouslySetInnerHTML={{ __html: formattedText }} />;
        })}
        
        {content.length > 280 && (
          <div className="text-blue-400 font-medium mt-2">...see more</div>
        )}
      </div>
      
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center gap-4">
          <button className="text-white/70">
            <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 17.27L16.18 21l-1.64-7.03L20 9.24l-7.19-.61L10 2 7.19 8.63 0 9.24l5.46 4.73L3.82 21 10 17.27z" fill="currentColor"/>
            </svg>
          </button>
          <button className="text-white/70">
            <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3c5.5 0 10 4.5 10 10s-4.5 10-10 10S2 18.5 2 13h2c0 4.4 3.6 8 8 8s8-3.6 8-8-3.6-8-8-8v3L8 4l4-4v3zm-2 5h2v6h-2zm0 8h2v2h-2z" fill="currentColor"/>
            </svg>
          </button>
          <button className="text-white/70">
            <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 0C4.5 0 0 4.5 0 10s4.5 10 10 10 10-4.5 10-10S15.5 0 10 0zm1 15H9v-2h2v2zm0-4H9V4h2v7z" fill="currentColor"/>
            </svg>
          </button>
        </div>
        
        <div className="text-white/60 text-sm">0 Comments</div>
      </div>
    </div>
  );
};

export default CanvasPreview;
