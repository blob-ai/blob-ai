
export type Platform = "twitter" | "linkedin" | "instagram" | "youtube" | null;

export interface Task {
  id: string;
  title: string;
  status: string;
  workspace: string;
  notes: string;
  dueDate?: string;
  platforms?: Platform[];
  commentCount?: number;
  completed?: boolean;
}

export interface Column {
  id: string;
  name: string;
  color: string;
  icon: React.ReactNode;
}

export interface KanbanState {
  tasks: Task[];
  columns: Column[];
  columnOrder: string[];
}
