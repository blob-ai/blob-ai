
import React, { useState } from "react";
import { CardContainer } from "@/components/ui/card-container";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Heart, Edit, Trash2, Check, X } from "lucide-react";
import { toast } from "sonner";
import { Bookmark } from "@/types/bookmark";

interface BookmarkSectionProps {
  bookmarks: Bookmark[];
  onDelete: (id: string) => void;
  onUpdate: (bookmark: Bookmark) => void;
}

const BookmarkSection: React.FC<BookmarkSectionProps> = ({ bookmarks, onDelete, onUpdate }) => {
  const [expanded, setExpanded] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleStartEditing = (bookmark: Bookmark) => {
    setEditingId(bookmark.id);
    setEditingName(bookmark.name);
  };

  const handleSaveEditing = (bookmark: Bookmark) => {
    onUpdate({
      ...bookmark,
      name: editingName
    });
    setEditingId(null);
    toast.success("Bookmark renamed");
  };

  const handleCancelEditing = () => {
    setEditingId(null);
  };

  return (
    <CardContainer className="mb-6 p-0 overflow-hidden">
      <div 
        className="flex justify-between items-center p-4 cursor-pointer" 
        onClick={handleToggleExpand}
      >
        <div className="flex items-center gap-3">
          <Heart className="h-5 w-5 text-rose-400" />
          <h3 className="font-medium text-white">Saved Inspirations</h3>
          <span className="bg-white/10 px-2 py-0.5 rounded-full text-xs text-white/70">{bookmarks.length}</span>
        </div>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      {expanded && (
        <div className="px-4 pb-4">
          <ScrollArea className="max-h-[300px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {bookmarks.map((bookmark) => (
                <CardContainer 
                  key={bookmark.id} 
                  className="p-3 bg-[#101217] hover:bg-[#14171F] transition-colors border-white/5"
                >
                  <div className="flex flex-col h-full">
                    <div className="flex justify-between items-start mb-2">
                      {editingId === bookmark.id ? (
                        <div className="flex items-center gap-2 flex-1">
                          <Input
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="h-7 text-sm py-1 bg-[#1A202C] border-white/10"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveEditing(bookmark);
                              if (e.key === 'Escape') handleCancelEditing();
                            }}
                          />
                          <Button 
                            size="sm" 
                            className="h-7 w-7 p-0" 
                            onClick={() => handleSaveEditing(bookmark)}
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 w-7 p-0" 
                            onClick={handleCancelEditing}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <h4 className="font-medium text-sm">{bookmark.name || "Unnamed Bookmark"}</h4>
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0 text-white/40 hover:text-white hover:bg-white/10"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartEditing(bookmark);
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0 text-white/40 hover:text-red-500 hover:bg-red-500/10"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(bookmark.id);
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Content preview */}
                    <div className="text-xs text-white/70 mb-2 line-clamp-2 flex-grow">
                      {bookmark.content && bookmark.content.length > 50 
                        ? `${bookmark.content.substring(0, 50)}...` 
                        : bookmark.content || "No content preview available"}
                    </div>

                    {/* Source metadata */}
                    <div className="flex justify-between items-center text-[10px] text-white/50 pt-1 border-t border-white/5">
                      <span>{new Date(bookmark.created_at).toLocaleDateString()}</span>
                      {bookmark.source && <span>{bookmark.source}</span>}
                    </div>
                  </div>
                </CardContainer>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </CardContainer>
  );
};

export default BookmarkSection;
