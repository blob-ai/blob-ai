
import { useState, forwardRef, useImperativeHandle } from "react";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { TaskColumn } from "./TaskColumn";
import { Task, Column } from "@/types/dashboard";
import { CircleDot, AlertCircle, CheckCircle } from "lucide-react";
import { v4 as uuid } from "uuid";

// Column definitions for Kanban
const initialColumns: Column[] = [
  { id: "not-started", name: "Not Started", color: "bg-gray-500", icon: <CircleDot className="h-4 w-4 text-gray-400" /> },
  { id: "in-progress", name: "In Progress", color: "bg-amber-500", icon: <AlertCircle className="h-4 w-4 text-amber-400" /> },
  { id: "done", name: "Done", color: "bg-green-500", icon: <CheckCircle className="h-4 w-4 text-green-400" /> }
];

// Sample tasks data with generic content
const initialTasks: Task[] = [
  {
    id: "1",
    title: "Research industry trends",
    status: "not-started",
    workspace: "Marketing Strategy",
    notes: "Focus on emerging technologies and audience behavior patterns",
    dueDate: "2025-04-10",
    platforms: ["twitter"],
    completed: false
  },
  {
    id: "2",
    title: "Draft content calendar",
    status: "in-progress",
    dueDate: "2025-04-06",
    workspace: "Content Planning",
    notes: "Include key themes and posting schedule for Q2",
    platforms: ["twitter", "linkedin"],
    completed: false
  },
  {
    id: "4",
    title: "Create product tutorial series",
    status: "in-progress",
    dueDate: "2025-04-12",
    workspace: "Educational Content",
    notes: "Plan 5-part tutorial showing key product features",
    platforms: ["youtube", "linkedin"],
    completed: false
  },
  {
    id: "5",
    title: "Brand positioning statement",
    status: "not-started",
    workspace: "Brand Strategy",
    notes: "",
    completed: false
  }
];

const initialColumnOrder = ["not-started", "in-progress", "done"];

interface DraggableKanbanBoardProps {
  className?: string;
}

export interface KanbanBoardHandles {
  addTaskToColumn: (columnId: string) => void;
}

export const DraggableKanbanBoard = forwardRef<KanbanBoardHandles, DraggableKanbanBoardProps>(
  ({ className }, ref) => {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [columns] = useState<Column[]>(initialColumns);
    const [columnOrder, setColumnOrder] = useState<string[]>(initialColumnOrder);

    useImperativeHandle(ref, () => ({
      addTaskToColumn: (columnId: string) => {
        handleAddTask(columnId);
      }
    }));

    const handleDragEnd = (result: DropResult) => {
      const { destination, source, type } = result;

      // If there's no destination or if the item is dropped in its original position, do nothing
      if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
        return;
      }

      // Handle column reordering
      if (type === "column") {
        const newColumnOrder = Array.from(columnOrder);
        const [removed] = newColumnOrder.splice(source.index, 1);
        newColumnOrder.splice(destination.index, 0, removed);

        setColumnOrder(newColumnOrder);
        return;
      }

      // Handle task movement
      if (type === "task") {
        const sourceColumnId = source.droppableId;
        const destinationColumnId = destination.droppableId;

        // Moving within the same column
        if (sourceColumnId === destinationColumnId) {
          const columnTasks = tasks.filter(task => task.status === sourceColumnId);
          const [movedTask] = columnTasks.splice(source.index, 1);
          columnTasks.splice(destination.index, 0, movedTask);

          const updatedTasks = tasks.filter(task => task.status !== sourceColumnId)
            .concat(columnTasks);

          setTasks(updatedTasks);
          return;
        } 
        
        // Moving to a different column
        const sourceTasks = tasks.filter(task => task.status === sourceColumnId);
        const destinationTasks = tasks.filter(task => task.status === destinationColumnId);
        
        // Get the task being moved
        const [movedTask] = sourceTasks.splice(source.index, 1);
        
        // Update its status
        const updatedTask = {...movedTask, status: destinationColumnId};
        
        // Insert it at the new position
        destinationTasks.splice(destination.index, 0, updatedTask);
        
        // Combine everything back
        const updatedTasks = tasks
          .filter(task => task.status !== sourceColumnId && task.status !== destinationColumnId)
          .concat(sourceTasks)
          .concat(destinationTasks);
        
        setTasks(updatedTasks);
      }
    };
    
    const handleAddTask = (columnId: string) => {
      const newTask: Task = {
        id: uuid(),
        title: "New Task",
        status: columnId,
        workspace: "Untitled Workspace",
        notes: "",
        completed: false
      };
      
      setTasks([...tasks, newTask]);
    };
    
    const handleNotesChange = (taskId: string, notes: string) => {
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? { ...task, notes } : task
        )
      );
    };
    
    const handleDateChange = (taskId: string, date: Date | null) => {
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? { 
            ...task, 
            dueDate: date ? date.toISOString().split('T')[0] : undefined 
          } : task
        )
      );
    };

    const handleTitleChange = (taskId: string, title: string) => {
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? { ...task, title } : task
        )
      );
    };

    const handleCompletedChange = (taskId: string, completed: boolean) => {
      setTasks(prevTasks => 
        prevTasks.map(task => {
          if (task.id === taskId) {
            // If marked as completed, move to done column
            const newStatus = completed ? "done" : task.status;
            return { ...task, completed, status: newStatus };
          }
          return task;
        })
      );
    };

    return (
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="columns" direction="horizontal" type="column">
          {(provided) => (
            <div 
              ref={provided.innerRef} 
              {...provided.droppableProps}
              className={`flex gap-4 min-w-max pb-4 p-2 ${className}`}
            >
              {columnOrder.map((columnId, index) => {
                const column = columns.find(col => col.id === columnId);
                const columnTasks = tasks.filter(task => task.status === columnId);
                
                if (!column) return null;
                
                return (
                  <TaskColumn
                    key={column.id}
                    column={column}
                    tasks={columnTasks}
                    index={index}
                    onAddTask={handleAddTask}
                    onNotesChange={handleNotesChange}
                    onDateChange={handleDateChange}
                    onTitleChange={handleTitleChange}
                    onCompletedChange={handleCompletedChange}
                  />
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
);

DraggableKanbanBoard.displayName = "DraggableKanbanBoard";
