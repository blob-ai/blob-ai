
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  FileText, 
  Search, 
  Plus, 
  Filter, 
  Star,
  Clock,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Define template interfaces
interface Template {
  id: string;
  title: string;
  category: string;
  format: string;
  source?: string;
  dateCreated: string;
  stats?: {
    engagementRate?: string;
    impressions?: string;
    saved?: string;
  };
  tags: string[];
  color: string;
  starred?: boolean;
}

// Sample templates data
const sampleTemplates: Template[] = [
  {
    id: "1",
    title: "Engagement Question",
    category: "Engagement",
    format: "Question",
    dateCreated: "2 days ago",
    stats: {
      engagementRate: "+23%",
    },
    tags: ["question", "audience", "engagement"],
    color: "bg-purple-600",
    starred: true
  },
  {
    id: "2",
    title: "Product Launch Thread",
    category: "Growth",
    format: "Thread",
    source: "@productHunt",
    dateCreated: "1 week ago",
    stats: {
      impressions: "+48%",
    },
    tags: ["product", "announcement", "thread"],
    color: "bg-blue-600"
  },
  {
    id: "3",
    title: "Weekly Update",
    category: "Engagement",
    format: "Announcement",
    dateCreated: "3 days ago",
    stats: {
      engagementRate: "+34%",
    },
    tags: ["weekly", "update", "news"],
    color: "bg-green-600"
  },
  {
    id: "4",
    title: "Tutorial Breakdown",
    category: "Growth",
    format: "Thread",
    dateCreated: "5 days ago",
    stats: {
      saved: "+56%",
    },
    tags: ["tutorial", "educational", "thread"],
    color: "bg-amber-600"
  },
  {
    id: "5",
    title: "Behind The Scenes",
    category: "Engagement",
    format: "Story",
    source: "@creator",
    dateCreated: "1 day ago",
    tags: ["story", "personal", "process"],
    color: "bg-pink-600"
  },
  {
    id: "6",
    title: "Controversial Opinion",
    category: "Engagement",
    format: "Question",
    dateCreated: "1 week ago",
    stats: {
      engagementRate: "+76%",
    },
    tags: ["opinion", "debate", "engagement"],
    color: "bg-red-600"
  },
  {
    id: "7",
    title: "Industry Insights",
    category: "Growth",
    format: "Thread",
    dateCreated: "4 days ago",
    stats: {
      impressions: "+29%",
    },
    tags: ["insights", "industry", "analysis"],
    color: "bg-teal-600"
  },
  {
    id: "8",
    title: "Community Spotlight",
    category: "Engagement",
    format: "Announcement",
    dateCreated: "6 days ago",
    tags: ["community", "spotlight", "appreciation"],
    color: "bg-orange-600"
  }
];

// Filter categories
const filterCategories = [
  {
    name: "Goal",
    options: ["Engagement", "Growth", "Announcement"]
  },
  {
    name: "Format",
    options: ["Thread", "Question", "Story", "Announcement"]
  },
  {
    name: "Source",
    options: ["AI Generated", "Account Analysis", "Custom"]
  }
];

const TemplateListItem = ({ template }: { template: Template }) => (
  <div className="flex items-center border-b border-white/10 py-3 hover:bg-white/5 transition-colors cursor-pointer px-2 group">
    <div className="flex items-center min-w-0 flex-1 gap-3">
      <div className={`w-4 h-4 rounded-sm ${template.color} flex items-center justify-center flex-shrink-0`}>
        <FileText className="h-2.5 w-2.5 text-white" />
      </div>
      
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium truncate">{template.title}</h3>
          {template.starred && (
            <Star className="h-3.5 w-3.5 text-purple-400 fill-purple-400 flex-shrink-0" />
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 mt-1 text-xs text-white/60">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3 flex-shrink-0" />
            {template.dateCreated}
          </span>
          <span className="hidden xs:inline">•</span>
          <span>{template.format}</span>
          <span className="hidden xs:inline">•</span>
          <span>{template.category}</span>
        </div>
      </div>
      
      {template.stats && Object.values(template.stats)[0] && (
        <div className="text-xs text-purple-400 px-2 hidden sm:block">
          {Object.values(template.stats)[0]}
        </div>
      )}
    </div>
    
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <Button variant="ghost" size="icon" className="h-7 w-7">
        <Star className={cn(
          "h-4 w-4",
          template.starred ? "text-purple-400 fill-purple-400" : "text-white/70"
        )} />
      </Button>
      <Button variant="ghost" size="icon" className="h-7 w-7">
        <MoreHorizontal className="h-4 w-4 text-white/70" />
      </Button>
    </div>
  </div>
);

const Templates = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredTemplates, setFilteredTemplates] = useState(sampleTemplates);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Implement actual search filtering here
  };
  
  const templatesPerPage = 8;
  const totalPages = Math.ceil(filteredTemplates.length / templatesPerPage);
  const paginatedTemplates = filteredTemplates.slice(
    (currentPage - 1) * templatesPerPage,
    currentPage * templatesPerPage
  );

  return (
    <div className="animate-fade-in">
      <div className="max-w-[90%] mx-auto px-4 md:px-6 lg:px-8">
        <div className="py-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Templates</h1>
              <p className="text-white/70">Create and manage your content templates</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <div className="relative sm:w-64 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/70" />
                <Input
                  placeholder="Search templates..."
                  className="pl-9 bg-black/30 border-white/10 w-full"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              
              <Button 
                variant="outline" 
                className="bg-black/30 border-white/10 gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
              
              <Button className="bg-primary-600 hover:bg-primary-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Template
              </Button>
            </div>
          </div>
          
          {/* Filter Panel */}
          {showFilters && (
            <Card className="border-white/10 bg-black/20 animate-fade-in">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {filterCategories.map(category => (
                    <div key={category.name}>
                      <h3 className="text-sm font-medium mb-2">{category.name}</h3>
                      <div className="space-y-2">
                        {category.options.map(option => (
                          <div key={option} className="flex items-center gap-2 text-white/80">
                            <CheckSquare className="h-4 w-4 text-white/60" />
                            <span className="text-sm">{option}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Categories - Improved for mobile */}
          <div className="flex items-center overflow-x-auto hide-scrollbar border-b border-white/10 pb-2 gap-4 md:gap-6">
            <button 
              className={cn(
                "text-sm font-medium pb-2 relative whitespace-nowrap",
                selectedCategory === "all" 
                  ? "text-primary-400 after:absolute after:h-0.5 after:w-full after:bg-primary-400 after:bottom-0 after:left-0" 
                  : "text-white/70 hover:text-white/90"
              )}
              onClick={() => setSelectedCategory("all")}
            >
              All Templates
            </button>
            <button 
              className={cn(
                "text-sm font-medium pb-2 relative whitespace-nowrap",
                selectedCategory === "engagement" 
                  ? "text-primary-400 after:absolute after:h-0.5 after:w-full after:bg-primary-400 after:bottom-0 after:left-0" 
                  : "text-white/70 hover:text-white/90"
              )}
              onClick={() => setSelectedCategory("engagement")}
            >
              Engagement
            </button>
            <button 
              className={cn(
                "text-sm font-medium pb-2 relative whitespace-nowrap",
                selectedCategory === "growth" 
                  ? "text-primary-400 after:absolute after:h-0.5 after:w-full after:bg-primary-400 after:bottom-0 after:left-0" 
                  : "text-white/70 hover:text-white/90"
              )}
              onClick={() => setSelectedCategory("growth")}
            >
              Growth
            </button>
            <button 
              className={cn(
                "text-sm font-medium pb-2 relative whitespace-nowrap",
                selectedCategory === "starred" 
                  ? "text-primary-400 after:absolute after:h-0.5 after:w-full after:bg-primary-400 after:bottom-0 after:left-0" 
                  : "text-white/70 hover:text-white/90"
              )}
              onClick={() => setSelectedCategory("starred")}
            >
              Starred
            </button>
          </div>
          
          {/* Templates List */}
          <div className="bg-black/10 border border-white/10 rounded-md">
            <div className="p-3 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-sm bg-white/10 flex items-center justify-center">
                  <FileText className="h-2.5 w-2.5 text-white/70" />
                </div>
                <span className="text-sm font-medium">Templates</span>
              </div>
              <Button variant="ghost" size="sm" className="h-7 text-white/70 hover:text-white">
                <Plus className="h-3.5 w-3.5 mr-1" />
                New
              </Button>
            </div>
            
            <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
              <div 
                className="flex items-center border-b border-white/10 py-3 hover:bg-white/5 transition-colors cursor-pointer px-2 group"
                onClick={() => {}}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-4 h-4 rounded-sm border border-dashed border-white/40 flex items-center justify-center">
                    <Plus className="h-2.5 w-2.5 text-white/70" />
                  </div>
                  <span className="text-sm font-medium text-white/80">Create New Template</span>
                </div>
              </div>
              
              {paginatedTemplates.map(template => (
                <TemplateListItem key={template.id} template={template} />
              ))}
            </div>
            
            {/* Pagination - Improved for mobile */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border-t border-white/10 gap-2">
                <div className="text-xs text-white/60 order-2 sm:order-1 text-center sm:text-left">
                  Showing <span className="font-medium">{(currentPage - 1) * templatesPerPage + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(currentPage * templatesPerPage, filteredTemplates.length)}
                  </span>{" "}
                  of <span className="font-medium">{filteredTemplates.length}</span> templates
                </div>
                
                <div className="flex items-center justify-center gap-2 order-1 sm:order-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-white/70"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {[...Array(totalPages)].map((_, i) => (
                      <Button
                        key={i}
                        variant={currentPage === i + 1 ? "default" : "ghost"}
                        size="sm"
                        className={cn(
                          "h-7 min-w-7",
                          currentPage === i + 1 
                            ? "bg-primary-600" 
                            : "text-white/70"
                        )}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </Button>
                    ))}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-white/70"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {/* Help Card */}
          <Card className="border-purple-600/20 bg-gradient-to-br from-purple-900/20 to-black/20">
            <CardContent className="p-4 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-600/20 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Need help creating templates?</h3>
                  <p className="text-white/70">Chat with our AI assistant to build custom templates</p>
                </div>
              </div>
              
              <Button className="bg-primary-600 hover:bg-primary-700 w-full md:w-auto">
                <span>Open AI Chat</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Templates;
