
import React, { useState } from 'react';
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Edit, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SidebarItem {
  name: string;
  path: string;
  icon?: React.ReactNode;
}

interface ChatThread {
  id: string;
  title: string;
  lastMessageAt: string;
  createdAt: string;
  isActive?: boolean;
}

interface SidebarSectionProps {
  title: string;
  items?: SidebarItem[];
  chatThreads?: ChatThread[];
  onThreadRename?: (threadId: string, newTitle: string) => void;
  onThreadDelete?: (threadId: string) => void;
  isLoading?: boolean;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({ 
  title, 
  items = [], 
  chatThreads = [],
  onThreadRename,
  onThreadDelete,
  isLoading = false
}) => {
  const [editingThread, setEditingThread] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState("");

  const handleStartEdit = (threadId: string, currentTitle: string) => {
    setEditingThread(threadId);
    setEditedTitle(currentTitle);
  };

  const handleSaveEdit = () => {
    if (editingThread && editedTitle.trim() && onThreadRename) {
      onThreadRename(editingThread, editedTitle.trim());
      setEditingThread(null);
      setEditedTitle("");
    }
  };

  const handleCancelEdit = () => {
    setEditingThread(null);
    setEditedTitle("");
  };

  const handleDeleteThread = (threadId: string) => {
    if (onThreadDelete) {
      onThreadDelete(threadId);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="mt-8 px-2">
      <div className="px-4 py-2.5">
        <h3 className="text-xs font-medium text-white/50">
          {title}
        </h3>
      </div>
      
      {isLoading ? (
        <div className="px-4 py-2 text-white/50 text-sm">Loading...</div>
      ) : (
        <ul className="space-y-1.5">
          {/* Regular sidebar items */}
          {items.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3.5 px-4 py-2.5 rounded-xl transition-colors",
                    "hover:bg-white/5",
                    isActive
                      ? "bg-white/5 text-primary-400"
                      : "text-white/70"
                  )
                }
              >
                {item.icon && (
                  <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                    {item.icon}
                  </div>
                )}
                {!item.icon && <div className="w-5 h-5 flex-shrink-0" />}
                <span className="truncate text-[15px]">{item.name}</span>
              </NavLink>
            </li>
          ))}

          {/* Chat threads */}
          {chatThreads.map((thread) => (
            <li key={thread.id} className="group">
              {editingThread === thread.id ? (
                <div className="flex items-center gap-2 px-4 py-2.5">
                  <Input
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="h-8 text-sm bg-white/5 border-white/10"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit();
                      if (e.key === 'Escape') handleCancelEdit();
                    }}
                    autoFocus
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-green-400 hover:text-green-300"
                    onClick={handleSaveEdit}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-400 hover:text-red-300"
                    onClick={handleCancelEdit}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between group hover:bg-white/5 rounded-xl transition-colors">
                  <NavLink
                    to={thread.path || `/dashboard/chat/${thread.id}`}
                    className={({ isActive }) =>
                      cn(
                        "flex-1 flex flex-col gap-1 px-4 py-2.5 text-left transition-colors",
                        isActive || thread.isActive
                          ? "text-primary-400"
                          : "text-white/70 hover:text-white"
                      )
                    }
                  >
                    <span className="truncate text-[15px] font-medium">
                      {thread.title}
                    </span>
                    <span className="text-xs text-white/40">
                      {formatTimeAgo(thread.lastMessageAt)}
                    </span>
                  </NavLink>
                  
                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity pr-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-white/50 hover:text-white"
                      onClick={() => handleStartEdit(thread.id, thread.title)}
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-white/50 hover:text-red-400"
                      onClick={() => handleDeleteThread(thread.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SidebarSection;
