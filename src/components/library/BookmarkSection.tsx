
import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CardContainer } from "@/components/ui/card-container";
import { Button } from "@/components/ui/button";
import { 
  Trash2, 
  ExternalLink, 
  ImageIcon, 
  FileText, 
  Edit, 
  Check, 
  BookmarkIcon
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Bookmark } from "@/types/bookmark";
import { toast } from "sonner";

interface BookmarkSectionProps {
  bookmarks: Bookmark[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: Partial<Bookmark>) => void;
}

const BookmarkSection: React.FC<BookmarkSectionProps> = ({
  bookmarks,
  onDelete,
  onUpdate
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<string>("");

  const handleStartEdit = (id: string, currentNote: string = "") => {
    setEditingId(id);
    setEditingNote(currentNote);
  };

  const handleSaveNote = (id: string) => {
    onUpdate(id, { notes: editingNote });
    setEditingId(null);
    toast.success("Note updated successfully!");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const getBookmarkIcon = (type: string) => {
    switch (type) {
      case "link":
        return <ExternalLink className="h-4 w-4 text-blue-400" />;
      case "screenshot":
        return <ImageIcon className="h-4 w-4 text-green-400" />;
      case "text":
        return <FileText className="h-4 w-4 text-amber-400" />;
      default:
        return <BookmarkIcon className="h-4 w-4 text-primary-400" />;
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Your Bookmarks</h2>
        <Button 
          variant="outline" 
          className="bg-transparent border-white/20 text-xs"
          size="sm"
        >
          See all ({bookmarks.length})
        </Button>
      </div>

      <ScrollArea className="w-full" orientation="horizontal">
        <div className="flex gap-4 pb-2 px-1 min-w-max">
          {bookmarks.map((bookmark) => (
            <CardContainer 
              key={bookmark.id} 
              className="w-[320px] flex-shrink-0 bg-[#1A202C] border-white/10 overflow-hidden"
            >
              <div className="p-4 border-b border-white/10">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    {getBookmarkIcon(bookmark.type)}
                    <h3 className="font-medium text-white truncate">
                      {bookmark.title || "Untitled Bookmark"}
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white/70 hover:text-red-400 hover:bg-red-400/10 h-8 w-8 p-0"
                    onClick={() => onDelete(bookmark.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {bookmark.type === 'screenshot' && bookmark.image_url && (
                  <div className="relative h-36 mb-3">
                    <img 
                      src={bookmark.image_url} 
                      alt={bookmark.title} 
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                )}
                
                {bookmark.type === 'text' && (
                  <div className="mb-3 h-36 overflow-y-auto bg-black/20 p-3 rounded">
                    <p className="text-sm text-white/80 whitespace-pre-wrap">
                      {bookmark.content}
                    </p>
                  </div>
                )}

                {bookmark.type === 'link' && bookmark.source_url && (
                  <a 
                    href={bookmark.source_url}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="mb-3 flex items-center gap-1.5 text-blue-400 hover:underline text-sm"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    {new URL(bookmark.source_url).hostname}
                  </a>
                )}
              </div>

              <div className="p-4">
                {editingId === bookmark.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editingNote}
                      onChange={(e) => setEditingNote(e.target.value)}
                      placeholder="Add your notes here..."
                      className="bg-black/20 border-white/10 h-24 text-sm"
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        className="h-8 bg-[#3260ea] hover:bg-[#2853c6]"
                        onClick={() => handleSaveNote(bookmark.id)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Save Note
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-start">
                      <p className="text-xs text-white/50 mb-1">Notes:</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white/70 hover:text-white hover:bg-white/10 h-6 w-6 p-0"
                        onClick={() => handleStartEdit(bookmark.id, bookmark.notes)}
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    {bookmark.notes ? (
                      <p className="text-sm text-white/80">{bookmark.notes}</p>
                    ) : (
                      <p className="text-sm italic text-white/40">No notes added.</p>
                    )}
                  </div>
                )}

                <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-center">
                  <p className="text-xs text-white/50">
                    {new Date(bookmark.created_at).toLocaleDateString()}
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 bg-transparent border-white/20 text-xs"
                  >
                    Convert to Style
                  </Button>
                </div>
              </div>
            </CardContainer>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default BookmarkSection;
