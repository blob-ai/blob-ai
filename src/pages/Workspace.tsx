
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Search,
  Users, 
  ArrowUpDown, 
  MoreHorizontal,
  Plus,
  FileText,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Interface for workspace type
interface Workspace {
  id: string;
  name: string;
  description?: string;
  members?: number;
  tasksCount?: number;
  templates?: number;
  lastActivity?: string;
}

// Sample workspaces data with generic content
const workspaces: Workspace[] = [
  {
    id: "1",
    name: "Social Media Planning",
    description: "Strategic planning for all social media accounts",
    members: 1,
    tasksCount: 5,
    templates: 3,
    lastActivity: "2 hours ago"
  },
  {
    id: "2",
    name: "Content Series",
    description: "Educational content creation for multiple platforms",
    members: 3,
    tasksCount: 7,
    templates: 5,
    lastActivity: "Yesterday"
  },
  {
    id: "3",
    name: "Brand Marketing",
    description: "Brand voice and marketing strategy",
    members: 2,
    tasksCount: 4,
    templates: 2,
    lastActivity: "3 days ago"
  },
  {
    id: "4",
    name: "Product Launch",
    description: "Content planning for upcoming product release",
    members: 1,
    tasksCount: 12,
    templates: 7,
    lastActivity: "Just now"
  },
  {
    id: "5",
    name: "Weekly Newsletter",
    description: "Planning and creation for weekly newsletters",
    members: 2,
    tasksCount: 9,
    templates: 4,
    lastActivity: "1 week ago"
  }
];

// Workspace card component with improved text wrapping
const WorkspaceCard = ({ workspace }: { workspace: Workspace }) => (
  <Card className="bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer h-full">
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 mb-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-md flex items-center justify-center bg-primary-600/20 flex-shrink-0">
            <Users className="h-5 w-5 text-primary-400" />
          </div>
          <div className="min-w-0">
            <h3 className="font-medium truncate">{workspace.name}</h3>
            {workspace.description && (
              <p className="text-xs text-white/70 truncate">{workspace.description}</p>
            )}
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
          <MoreHorizontal className="h-4 w-4 text-white/70" />
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-3 mt-4">
        <div className="flex items-center gap-2 text-xs text-white/70">
          <FileText className="h-4 w-4 flex-shrink-0" />
          <span>{workspace.templates} templates</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/70">
          <Clock className="h-4 w-4 flex-shrink-0" />
          <span>{workspace.lastActivity}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mt-4">
        <Button variant="outline" className="h-9 text-xs sm:text-sm border-white/10">
          <span className="truncate">View Tasks ({workspace.tasksCount})</span>
        </Button>
        <Button className="h-9 text-xs sm:text-sm bg-primary-600 hover:bg-primary-500">
          <span className="truncate">Open Workspace</span>
        </Button>
      </div>
    </CardContent>
  </Card>
);

// New workspace card component
const NewWorkspaceCard = () => (
  <Card className="bg-white/5 border border-dashed border-white/30 hover:bg-white/10 transition-all cursor-pointer h-full">
    <CardContent className="p-4 flex flex-col items-center justify-center text-center py-8 gap-3">
      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary-600/20">
        <Plus className="h-5 w-5 text-primary-400" />
      </div>
      <div>
        <h3 className="font-medium">Create Workspace</h3>
        <p className="text-xs text-white/70 mt-1">Organize your content by project</p>
      </div>
    </CardContent>
  </Card>
);

const Workspace = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const isMobile = useIsMobile();
  const [sortBy, setSortBy] = useState<string>("name");
  
  const filteredWorkspaces = searchTerm 
    ? workspaces.filter(w => w.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (w.description && w.description.toLowerCase().includes(searchTerm.toLowerCase())))
    : workspaces;

  return (
    <div className="flex flex-col w-full">
      {/* Workspace Header */}
      <div className="px-4 md:px-6 py-6 border-b border-white/10 bg-background">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-[1200px] mx-auto">
          <div>
            <h1 className="text-3xl font-bold text-white">Workspaces</h1>
            <p className="text-white/70">Manage your content projects and teams</p>
          </div>
          
          <div className="flex flex-wrap md:flex-nowrap gap-2">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
              <Input 
                placeholder="Search workspaces..." 
                className="pl-9 bg-white/5 border-white/10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {!isMobile && (
              <Select 
                value={sortBy}
                onValueChange={setSortBy}
              >
                <SelectTrigger className="w-[180px] bg-black/30 border-white/10">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Sort by Name</SelectItem>
                  <SelectItem value="activity">Sort by Activity</SelectItem>
                  <SelectItem value="tasks">Sort by Tasks</SelectItem>
                </SelectContent>
              </Select>
            )}
            
            <Button className="bg-primary-600 hover:bg-primary-700 whitespace-nowrap">
              <Plus className="h-4 w-4 mr-2" />
              New Workspace
            </Button>
          </div>
        </div>
      </div>
      
      {/* Workspace Content */}
      <div className="px-4 md:px-6 py-6 animate-fade-in max-w-[1200px] mx-auto">
        {/* Workspaces Grid - properly responsive */}
        <ScrollArea className="w-full pb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <NewWorkspaceCard />
            {filteredWorkspaces.map(workspace => (
              <WorkspaceCard key={workspace.id} workspace={workspace} />
            ))}
          </div>
        </ScrollArea>
        
        {filteredWorkspaces.length === 0 && searchTerm && (
          <div className="flex flex-col items-center justify-center text-center py-12">
            <p className="text-white/70">No workspaces match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Workspace;
