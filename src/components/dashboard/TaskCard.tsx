
import { useState, useRef, useEffect } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "./DatePicker";
import {
  FileText,
  Calendar,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  MessageSquare,
  GripVertical,
  MoreHorizontal,
  Pencil,
  Calendar as CalendarIcon,
  Trash2
} from "lucide-react";
import { Button } from "../ui/button";
import { Task, Platform } from "@/types/dashboard";
import { 
  ContextMenu, 
  ContextMenuTrigger, 
  ContextMenuContent, 
  ContextMenuItem,
  ContextMenuSeparator
} from "@/components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

// Platform icon component
const PlatformIcon = ({ platform }: { platform: Platform }) => {
  switch(platform) {
    case "twitter":
      return <Twitter className="h-3 w-3 text-blue-400" />;
    case "linkedin":
      return <Linkedin className="h-3 w-3 text-blue-600" />;
    case "instagram":
      return <Instagram className="h-3 w-3 text-pink-500" />;
    case "youtube":
      return <Youtube className="h-3 w-3 text-red-500" />;
    default:
      return null;
  }
};

interface TaskCardProps {
  task: Task;
  index: number;
  onNotesChange: (id: string, notes: string) => void;
  onDateChange: (id: string, date: Date | null) => void;
  onTitleChange?: (id: string, title: string) => void;
  onCompletedChange?: (id: string, completed: boolean) => void;
}

export const TaskCard = ({ 
  task, 
  index, 
  onNotesChange, 
  onDateChange,
  onTitleChange,
  onCompletedChange
}: TaskCardProps) => {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempTitle, setTempTitle] = useState(task.title);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const cardBgColor = "bg-[#1A1F2C]";
  
  // Focus the title input when editing starts
  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (onTitleChange && tempTitle.trim() !== "") {
      onTitleChange(task.id, tempTitle);
    } else {
      setTempTitle(task.title); // Reset if empty
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTitleBlur();
    }
  };

  const handleCompletedChange = (checked: boolean) => {
    if (onCompletedChange) {
      onCompletedChange(task.id, checked);
    }
  };
  
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          style={{
            ...provided.draggableProps.style
          }}
          className={`mb-3 ${snapshot.isDragging ? "opacity-70" : ""}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <ContextMenu>
            <ContextMenuTrigger>
              <Card className={`${cardBgColor} border border-white/10 hover:bg-[#222733] transition-all overflow-hidden group rounded-md`}>
                <div className="p-2">
                  {/* Header with drag handle, checkbox, and more options button */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        {...provided.dragHandleProps}
                        className={`cursor-grab ${isHovered ? 'opacity-40' : 'opacity-0'} group-hover:opacity-40 hover:opacity-100 transition-opacity`}
                      >
                        <GripVertical className="w-4 h-4 text-white/50" />
                      </div>
                      <Checkbox 
                        className="mr-2 ml-1 data-[state=checked]:bg-primary-400" 
                        checked={task.completed}
                        onCheckedChange={handleCompletedChange}
                      />
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-6 w-6 p-0.5 rounded-full ${isHovered ? 'opacity-80' : 'opacity-0'} group-hover:opacity-80 transition-opacity`}
                        >
                          <MoreHorizontal className="h-4 w-4 text-white/70" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-[#1A1F2C] border-white/10 text-white w-52">
                        <DropdownMenuItem 
                          className="flex items-center text-xs cursor-pointer hover:bg-white/10"
                          onClick={() => setIsEditingTitle(true)}
                        >
                          <Pencil className="mr-2 h-3.5 w-3.5 text-white/70" />
                          Edit Title
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="flex items-center text-xs cursor-pointer hover:bg-white/10"
                          onClick={() => setIsEditingNotes(true)}
                        >
                          <FileText className="mr-2 h-3.5 w-3.5 text-white/70" />
                          Edit Notes
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="flex items-center text-xs cursor-pointer hover:bg-white/10"
                          onClick={() => setShowDatePicker(true)}
                        >
                          <CalendarIcon className="mr-2 h-3.5 w-3.5 text-white/70" />
                          Set Due Date
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem 
                          className="flex items-center text-xs text-red-400 cursor-pointer hover:bg-white/10 hover:text-red-400"
                        >
                          <Trash2 className="mr-2 h-3.5 w-3.5" />
                          Delete Task
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  {/* Title and content section with improved spacing */}
                  <div>
                    {/* Title with better alignment to icon */}
                    <div className="flex items-start mt-0.5">
                      <div className="flex-1">
                        {isEditingTitle ? (
                          <Input
                            ref={titleInputRef}
                            value={tempTitle}
                            onChange={(e) => setTempTitle(e.target.value)}
                            onBlur={handleTitleBlur}
                            onKeyDown={handleTitleKeyDown}
                            className="h-7 px-2 py-0 text-sm bg-black/30 border-white/20 focus:border-primary-500 mt-0"
                          />
                        ) : (
                          <div 
                            className={`font-medium text-white cursor-text leading-tight ${task.completed ? 'line-through text-white/50' : ''}`}
                            onClick={() => setIsEditingTitle(true)}
                          >
                            {task.title}
                          </div>
                        )}
                        
                        {/* Workspace info / category */}
                        {task.workspace && (
                          <Badge 
                            variant="outline" 
                            className={`mt-1 text-xs font-normal bg-primary-400/10 hover:bg-primary-400/20 border-none w-fit px-2 py-0 ${task.completed ? 'line-through text-white/30' : ''}`}
                          >
                            {task.workspace}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {/* Notes section */}
                    {(task.notes || isEditingNotes) && (
                      <div 
                        className={`mt-2 cursor-text ml-1 ${task.completed ? 'line-through text-white/30' : ''}`}
                        onClick={() => !isEditingNotes && setIsEditingNotes(true)}
                      >
                        {isEditingNotes ? (
                          <Textarea
                            placeholder="Add notes about this task..."
                            className="min-h-[60px] text-xs bg-black/20 border-white/10 focus:border-primary-500 resize-none p-1.5"
                            value={task.notes}
                            onChange={(e) => onNotesChange(task.id, e.target.value)}
                            onBlur={() => setIsEditingNotes(false)}
                            autoFocus
                          />
                        ) : task.notes ? (
                          <div className="text-xs text-white/80 whitespace-pre-wrap">
                            {task.notes}
                          </div>
                        ) : (
                          <div className="text-xs text-white/40 italic">
                            Click to add notes...
                          </div>
                        )}
                      </div>
                    )}

                    {/* Platform icons */}
                    {task.platforms && task.platforms.length > 0 && (
                      <div className="flex gap-1 mt-2 ml-1">
                        {task.platforms.map((platform, index) => (
                          <div key={index} className="p-1 bg-white/5 rounded-full">
                            <PlatformIcon platform={platform} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Footer with due date */}
                  <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between">
                    <div
                      className={`text-xs text-white/60 flex items-center cursor-pointer hover:text-white/80 transition-colors ${task.completed ? 'line-through text-white/30' : ''}`}
                      onClick={() => setShowDatePicker(true)}
                    >
                      <Calendar className="h-3 w-3 mr-1" />
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "Add due date"}
                    </div>
                    
                    {showDatePicker && (
                      <DatePicker 
                        date={task.dueDate ? new Date(task.dueDate) : null} 
                        setDate={(date) => {
                          onDateChange(task.id, date);
                          setShowDatePicker(false);
                        }}
                        onClose={() => setShowDatePicker(false)}
                      />
                    )}
                    
                    {/* Only show if there are comments */}
                    {task.commentCount && task.commentCount > 0 && (
                      <span className={`text-xs text-white/60 flex items-center ml-auto ${task.completed ? 'line-through text-white/30' : ''}`}>
                        <MessageSquare className="h-3 w-3 mr-1" />
                        {task.commentCount}
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            </ContextMenuTrigger>
            <ContextMenuContent className="bg-[#1A1F2C] border-white/10 text-white">
              <ContextMenuItem 
                className="flex items-center text-xs cursor-pointer hover:bg-white/10"
                onClick={() => setIsEditingTitle(true)}
              >
                <Pencil className="mr-2 h-3.5 w-3.5 text-white/70" />
                Edit Title
              </ContextMenuItem>
              <ContextMenuItem 
                className="flex items-center text-xs cursor-pointer hover:bg-white/10"
                onClick={() => setIsEditingNotes(true)}
              >
                <FileText className="mr-2 h-3.5 w-3.5 text-white/70" />
                Edit Notes
              </ContextMenuItem>
              <ContextMenuItem 
                className="flex items-center text-xs cursor-pointer hover:bg-white/10"
                onClick={() => setShowDatePicker(true)}
              >
                <CalendarIcon className="mr-2 h-3.5 w-3.5 text-white/70" />
                Set Due Date
              </ContextMenuItem>
              <ContextMenuSeparator className="bg-white/10" />
              <ContextMenuItem 
                className="flex items-center text-xs text-red-400 cursor-pointer hover:bg-white/10 hover:text-red-400"
              >
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                Delete Task
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </div>
      )}
    </Draggable>
  );
};
