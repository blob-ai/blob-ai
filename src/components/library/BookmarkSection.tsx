
import React, { useState } from "react";
import { Bookmark } from "@/types/bookmark";
import { Button } from "@/components/ui/button";
import { CardContainer } from "@/components/ui/card-container";
import { Input } from "@/components/ui/input";
import { X, Edit2, Save, Trash2, Twitter, Linkedin, Facebook, Globe } from "lucide-react";
import { toast } from "sonner";

interface BookmarkSectionProps {
  bookmarks: Bookmark[];
  onDelete: (id: string) => void;
  onUpdate: (bookmark: Bookmark) => void;
}

const BookmarkSection: React.FC<BookmarkSectionProps> = ({ bookmarks, onDelete, onUpdate }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>("");
  
  const getIcon = (source?: string) => {
    switch (source?.toLowerCase()) {
      case "twitter":
        return <Twitter className="text-blue-400 h-4 w-4" />;
      case "linkedin":
        return <Linkedin className="text-blue-600 h-4 w-4" />;
      case "facebook":
        return <Facebook className="text-blue-500 h-4 w-4" />;
      default:
        return <Globe className="text-gray-400 h-4 w-4" />;
    }
  };

  const handleStartEditing = (bookmark: Bookmark) => {
    setEditingId(bookmark.id);
    setEditingName(bookmark.name || bookmark.title);
  };

  const handleSaveEditing = (bookmark: Bookmark) => {
    onUpdate({
      ...bookmark,
      name: editingName,
      title: editingName // Ensure both name and title are updated
    });
    setEditingId(null);
    toast.success("Bookmark renamed");
  };
  
  const handleCancelEditing = () => {
    setEditingId(null);
  };
  
  const truncateContent = (content: string, maxLength: number = 50) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {bookmarks.map((bookmark) => (
        <CardContainer 
          key={bookmark.id} 
          className="border-white/10 bg-[#1A202C] overflow-hidden"
        >
          <div className="flex flex-col h-full">
            {/* Header with source and delete */}
            <div className="flex items-center justify-between p-3 border-b border-white/5 bg-[#151A24]">
              <div className="flex items-center gap-1.5">
                {getIcon(bookmark.source)}
                <span className="text-xs text-white/70 capitalize">
                  {bookmark.source || "Source"}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(bookmark.id)}
                className="h-7 w-7 p-1 rounded-full hover:bg-red-500/20 hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Content */}
            <div className="flex-grow p-3 pt-2.5">
              {/* Name */}
              <div className="mb-2">
                {editingId === bookmark.id ? (
                  <div className="flex gap-1 mb-1.5">
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="h-7 text-sm bg-[#121720] border-white/10"
                      autoFocus
                    />
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSaveEditing(bookmark)}
                        className="h-7 w-7 p-1 bg-green-600/20 hover:bg-green-600/30 text-green-400"
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCancelEditing}
                        className="h-7 w-7 p-1 bg-red-600/20 hover:bg-red-600/30 text-red-400"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h4 className="font-medium text-sm">{bookmark.name || bookmark.title || "Unnamed Bookmark"}</h4>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleStartEditing(bookmark)} 
                        className="h-6 px-2 text-xs text-blue-400 hover:bg-blue-500/10"
                      >
                        <Edit2 className="h-3 w-3 mr-1" />
                        Rename
                      </Button>
                    </div>
                  </>
                )}
              </div>
              
              {/* Content preview */}
              <div className="text-white/80 text-sm bg-[#121720] p-3 rounded-md mb-2 border border-white/5 max-h-24 overflow-hidden">
                {truncateContent(bookmark.content)}
              </div>
            </div>
            
            {/* Footer with date */}
            <div className="text-xs px-3 pb-3 text-white/50">
              Saved {new Date(bookmark.created_at).toLocaleDateString()}
            </div>
          </div>
        </CardContainer>
      ))}
    </div>
  );
};

export default BookmarkSection;
