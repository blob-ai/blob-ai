
import { useState } from "react";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { MoreHorizontal, Plus, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskCard } from "./TaskCard";
import { Task } from "@/types/dashboard";
import { Badge } from "@/components/ui/badge";

interface TaskColumnProps {
  column: {
    id: string;
    name: string;
    color: string;
    icon: React.ReactNode;
  };
  tasks: Task[];
  index: number;
  onAddTask: (columnId: string) => void;
  onNotesChange: (taskId: string, notes: string) => void;
  onDateChange: (taskId: string, date: Date | null) => void;
  onTitleChange: (taskId: string, title: string) => void;
  onCompletedChange: (taskId: string, completed: boolean) => void;
}

export const TaskColumn = ({ 
  column, 
  tasks, 
  index, 
  onAddTask, 
  onNotesChange, 
  onDateChange,
  onTitleChange,
  onCompletedChange
}: TaskColumnProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="w-[280px] flex-shrink-0"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex items-center gap-2 mb-2 group">
            <div 
              className="cursor-grab opacity-0 group-hover:opacity-50 hover:opacity-100 transition-opacity"
              {...provided.dragHandleProps}
            >
              <GripVertical className="w-4 h-4 text-white/70" />
            </div>
            <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
            <h3 className="font-medium">{column.name}</h3>
            <Badge variant="outline" className="ml-1 text-xs h-5 px-1.5 bg-transparent border-white/10 rounded-full">
              {tasks.length}
            </Badge>
            <Button 
              size="sm" 
              variant="ghost" 
              className={`w-6 h-6 p-0 ${isHovered ? 'opacity-100' : 'opacity-0'} ml-auto transition-opacity rounded-full`}
            >
              <MoreHorizontal className="h-4 w-4 text-white/70" />
            </Button>
          </div>
          
          <Droppable droppableId={column.id} type="task">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`bg-black/20 rounded-xl p-2 min-h-[300px] transition-colors flex flex-col ${
                  snapshot.isDraggingOver ? "bg-black/30" : ""
                }`}
              >
                {/* Task cards */}
                <div className="flex-1">
                  {tasks.map((task, index) => (
                    <TaskCard 
                      key={task.id} 
                      task={task} 
                      index={index}
                      onNotesChange={onNotesChange}
                      onDateChange={onDateChange}
                      onTitleChange={onTitleChange}
                      onCompletedChange={onCompletedChange}
                    />
                  ))}
                  {provided.placeholder}
                </div>
                
                {/* Add task button - always at the bottom */}
                <div 
                  className="h-auto mt-2 flex items-center justify-center text-white/30 border border-dashed border-white/10 rounded-xl cursor-pointer hover:bg-black/20 transition-colors py-2"
                  onClick={() => onAddTask(column.id)}
                >
                  <Plus className="h-4 w-4 mr-1 text-white/50" />
                  <p className="text-sm">Add a task</p>
                </div>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};
