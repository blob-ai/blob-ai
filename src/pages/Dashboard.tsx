
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/ui/action-button";
import { PageContainer } from "@/components/ui/page-container";
import { CardContainer } from "@/components/ui/card-container";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageSquare, 
  Search, 
  Plus,
  FileText,
  ChevronLeft,
  ChevronRight,
  Pencil
} from "lucide-react";
import { DraggableKanbanBoard } from "@/components/dashboard/DraggableKanbanBoard";
import { useRef, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useContentCreation } from "@/hooks/use-content-creation";

const Dashboard = () => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [sortBy, setSortBy] = useState<string>("dueDate");
  const boardRef = useRef<any>(null);
  const { handleCreateClick } = useContentCreation();

  // Function to scroll the taskboard
  const scrollTaskboard = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const newScrollX = direction === 'left' 
        ? Math.max(0, currentScroll - scrollAmount)
        : currentScroll + scrollAmount;
        
      scrollContainerRef.current.scrollTo({
        left: newScrollX,
        behavior: 'smooth'
      });
    }
  };

  // Function to add a new task to "not-started" column
  const handleAddNewTask = () => {
    if (boardRef.current) {
      boardRef.current.addTaskToColumn("not-started");
    }
  };
  
  // Function to handle "Create posts" button click
  const handleCreatePostsClick = () => {
    navigate('/dashboard/content');
  };

  return (
    <div className="flex flex-col w-full h-full">
      {/* Dashboard Header */}
      <div className="border-b border-white/10 bg-background sticky top-0 z-10">
        <div className="px-4 py-6 max-w-[1200px] mx-auto">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-white/70 text-sm sm:text-base">Manage your content planning and tasks</p>
          </div>
        </div>
      </div>
      
      <PageContainer className="flex flex-col flex-grow overflow-hidden">
        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
          <Button
            variant="outline"
            className="bg-white/5 border-white/10 hover:bg-white/10 hover:text-primary-400 transition-all justify-start h-12 text-sm w-full"
            onClick={() => {}}
          >
            <Search className="w-4 h-4 text-primary-400 mr-2 flex-shrink-0" />
            <span className="truncate">Analyze Account</span>
          </Button>
          
          <Button
            variant="outline"
            className="bg-white/5 border-white/10 hover:bg-white/10 hover:text-primary-400 transition-all justify-start h-12 text-sm w-full"
            onClick={handleCreatePostsClick}
          >
            <Pencil className="w-4 h-4 text-primary-400 mr-2 flex-shrink-0" />
            <span className="truncate">Create Posts</span>
          </Button>
          
          <Button
            variant="outline"
            className="bg-white/5 border-white/10 hover:bg-white/10 hover:text-primary-400 transition-all justify-start h-12 text-sm w-full"
            onClick={() => navigate('/dashboard/templates')}
          >
            <FileText className="w-4 h-4 text-primary-400 mr-2 flex-shrink-0" />
            <span className="truncate">Find Templates</span>
          </Button>
        </div>
        
        {/* Kanban Board Section */}
        <div className="flex-grow overflow-hidden flex flex-col mt-6">
          {/* Taskboard header */}
          <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="text-xl font-bold">Task Board</h2>
              
              <div className="flex flex-wrap items-center gap-2 justify-between sm:justify-end">
                {/* Scroll controls */}
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="w-8 h-8 p-0 rounded-full bg-black/30 border-white/10 flex-shrink-0"
                    onClick={() => scrollTaskboard('left')}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="w-8 h-8 p-0 rounded-full bg-black/30 border-white/10 flex-shrink-0"
                    onClick={() => scrollTaskboard('right')}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                  
                {/* Sort selector */}
                <div className="flex-shrink-0">
                  <Select 
                    value={sortBy}
                    onValueChange={setSortBy}
                  >
                    <SelectTrigger className="bg-black/30 border-white/10 h-8 text-sm w-[110px] sm:w-[130px] rounded-full">
                      <SelectValue placeholder="Due Date" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1F2C] border-white/10 text-white rounded-xl">
                      <SelectItem value="dueDate">Due Date</SelectItem>
                      <SelectItem value="workspace">Workspace</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Add task button */}
                <ActionButton
                  icon={<Plus className="h-4 w-4" />}
                  label="Add Task"
                  mobileIconOnly={false}
                  className="bg-primary-600 hover:bg-primary-700 h-8 sm:px-3 flex-shrink-0 rounded-full"
                  onClick={handleAddNewTask}
                />
              </div>
            </div>
          </div>

          {/* Taskboard content */}
          <CardContainer className="p-0 overflow-hidden flex-grow">
            <div className="h-full">
              <ScrollArea className="w-full h-full overflow-x-auto">
                <div 
                  ref={scrollContainerRef}
                  className="overflow-x-auto pb-6 pt-2 px-2 h-full min-h-[400px] touch-pan-x"
                  style={{ 
                    WebkitOverflowScrolling: 'touch',
                    maxWidth: '100%'
                  }}
                >
                  <DraggableKanbanBoard ref={boardRef} />
                </div>
              </ScrollArea>
            </div>
          </CardContainer>
        </div>
      </PageContainer>

      {/* Chat Button - Fixed positioning */}
      <Button 
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-primary-600 shadow-lg flex items-center justify-center p-0 z-20 hover:bg-primary-700"
        onClick={() => navigate('/dashboard/chat')}
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
      
      {/* Create Posts Button - Mobile only - Fixed positioning */}
      <Button 
        className="fixed bottom-6 left-6 w-12 h-12 rounded-full bg-blue-600 shadow-lg flex items-center justify-center p-0 z-20 hover:bg-blue-500 md:hidden"
        onClick={handleCreatePostsClick}
      >
        <Pencil className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default Dashboard;
