
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  CircleDot,
  AlertCircle,
  Clock,
  CheckCircle,
  MoreHorizontal,
  Plus,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  MessageSquare,
  FileText
} from "lucide-react";

// Column definitions for Kanban
const columns = [
  { id: "not-started", name: "Not Started", color: "bg-gray-500", icon: <CircleDot className="h-4 w-4 text-gray-400" /> },
  { id: "in-progress", name: "In Progress", color: "bg-amber-500", icon: <AlertCircle className="h-4 w-4 text-amber-400" /> },
  { id: "in-review", name: "In Review", color: "bg-blue-500", icon: <Clock className="h-4 w-4 text-blue-400" /> },
  { id: "done", name: "Done", color: "bg-green-500", icon: <CheckCircle className="h-4 w-4 text-green-400" /> }
];

// Task platform type
type Platform = "twitter" | "linkedin" | "instagram" | "youtube" | null;

// Task interface
interface Task {
  id: string;
  title: string;
  status: string;
  workspace: string;
  notes: string;
  dueDate?: string;
  platforms?: Platform[];
  commentCount?: number;
}

// Sample tasks data with generic content
const initialTasks: Task[] = [
  {
    id: "1",
    title: "Research industry trends",
    status: "not-started",
    workspace: "Marketing Strategy",
    notes: "Focus on emerging technologies and audience behavior patterns",
    dueDate: "April 10, 2025",
    platforms: ["twitter"]
  },
  {
    id: "2",
    title: "Draft content calendar",
    status: "in-progress",
    dueDate: "Tomorrow",
    workspace: "Content Planning",
    notes: "Include key themes and posting schedule for Q2",
    platforms: ["twitter", "linkedin"]
  },
  {
    id: "3",
    title: "Review analytics report",
    status: "done",
    workspace: "Performance Analysis",
    notes: "Prepare summary of engagement metrics from last month",
    dueDate: "Yesterday",
    platforms: ["twitter", "instagram"],
    commentCount: 2
  },
  {
    id: "4",
    title: "Create product tutorial series",
    status: "in-progress",
    dueDate: "Next week",
    workspace: "Educational Content",
    notes: "Plan 5-part tutorial showing key product features",
    platforms: ["youtube", "linkedin"]
  },
  {
    id: "5",
    title: "Brand positioning statement",
    status: "not-started",
    workspace: "Brand Strategy",
    notes: "",
  }
];

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

// Task card component with improved visual hierarchy
const TaskCard = ({ task, onNotesChange }: { 
  task: Task, 
  onNotesChange: (id: string, notes: string) => void 
}) => {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  
  return (
    <Card className="bg-[#1A1F2C] border border-white/10 hover:bg-[#222733] transition-all mb-3 overflow-hidden">
      <CardContent className="p-0">
        {/* Main content section */}
        <div className="p-3">
          {/* Title */}
          <div className="flex gap-2 mb-2">
            <FileText className="h-4 w-4 text-white/70 mt-0.5 flex-shrink-0" />
            <span className="font-medium text-white">{task.title}</span>
          </div>
          
          {/* Workspace info */}
          {task.workspace && (
            <div className="flex flex-wrap mt-2 mb-2">
              <span className="text-xs text-white/70 truncate">{task.workspace}</span>
            </div>
          )}
          
          {/* Notes section - Seamless editing */}
          {(task.notes || isEditingNotes) && (
            <div 
              className="mt-3 mb-1 cursor-text"
              onClick={() => !isEditingNotes && setIsEditingNotes(true)}
            >
              {isEditingNotes ? (
                <Textarea
                  placeholder="Add notes about this task..."
                  className="min-h-[60px] text-xs bg-black/20 border-white/10 focus:border-primary-500 resize-none"
                  value={task.notes}
                  onChange={(e) => onNotesChange(task.id, e.target.value)}
                  onBlur={() => setIsEditingNotes(false)}
                  autoFocus
                />
              ) : task.notes ? (
                <div className="text-xs text-white/80 whitespace-pre-wrap bg-black/20 rounded-md p-2">
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
            <div className="flex gap-1 mt-2">
              {task.platforms.map((platform, index) => (
                <div key={index} className="p-1 bg-white/5 rounded-full">
                  <PlatformIcon platform={platform} />
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer with due date - Always at the bottom */}
        {task.dueDate && (
          <div className="mt-auto p-2 pt-0 border-t border-white/5 bg-black/20 flex items-center justify-between">
            <span className="text-xs text-white/60 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {task.dueDate}
            </span>
            
            {/* Only show if there are comments */}
            {task.commentCount && task.commentCount > 0 && (
              <span className="text-xs text-white/60 flex items-center ml-auto">
                <MessageSquare className="h-3 w-3 mr-1" />
                {task.commentCount}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Sort tasks based on selected criteria
const sortTasks = (tasks: Task[], sortBy: string) => {
  const tasksCopy = [...tasks];
  
  switch (sortBy) {
    case "dueDate":
      return tasksCopy.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        
        // Simple sorting for the sample data
        const dueDateOrder: Record<string, number> = {
          "Today": 0, 
          "Tomorrow": 1, 
          "Yesterday": -1, 
          "Next week": 2
        };
        
        const aValue = dueDateOrder[a.dueDate] !== undefined ? dueDateOrder[a.dueDate] : 99;
        const bValue = dueDateOrder[b.dueDate] !== undefined ? dueDateOrder[b.dueDate] : 99;
        
        return aValue - bValue;
      });
    case "workspace":
      return tasksCopy.sort((a, b) => {
        if (!a.workspace) return 1;
        if (!b.workspace) return -1;
        return a.workspace.localeCompare(b.workspace);
      });
    default:
      return tasksCopy;
  }
};

interface KanbanBoardProps {
  sortBy: string;
}

export const KanbanBoard = ({ sortBy = "dueDate" }: KanbanBoardProps) => {
  const [tasks, setTasks] = useState(initialTasks);
  
  const handleNotesChange = (id: string, notes: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id ? { ...task, notes } : task
      )
    );
  };

  return (
    <div className="flex gap-4 min-w-max pb-4 p-2">
      {columns.map(column => {
        const columnTasks = sortTasks(
          tasks.filter(task => task.status === column.id),
          sortBy
        );
        
        return (
          <div 
            key={column.id} 
            className="w-[280px] flex-shrink-0"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
              <h3 className="font-medium">{column.name}</h3>
              <span className="text-sm text-white/50">{columnTasks.length}</span>
              <Plus className="h-4 w-4 text-white/70 ml-auto cursor-pointer hover:text-white transition-colors" />
            </div>
            
            <div className="bg-black/20 rounded-lg p-2 min-h-[calc(100vh-340px)]">
              {columnTasks.map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onNotesChange={handleNotesChange}
                />
              ))}
              
              {columnTasks.length === 0 && (
                <div className="h-20 flex items-center justify-center text-white/30 border border-dashed border-white/10 rounded-md">
                  <p className="text-sm">No tasks</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
