
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CardContainer } from "@/components/ui/card-container";
import { Search, FilePlus, Layout, Type } from "lucide-react";
import StyleCard from "./StyleCard";
import { toast } from "sonner";
import LibraryCreateStyle from "./LibraryCreateStyle";

// Sample user styles - in a real app these would come from an API or database
const USER_STYLES = [
  {
    id: "1",
    name: "Professional Tech Writer",
    creatorName: "You",
    creatorHandle: "",
    creatorAvatar: "",
    description: "Clear, educational tone for technical articles and documentation.",
    tone: ["Educational", "Clear", "Formal"],
    example: "Understanding React hooks requires a foundational knowledge of functional components. Hooks enable function components to use state and other React features without writing a class.",
    date: "2023-06-10",
    isFavorite: true,
    folder: "Professional",
    isTemplate: false,
    source: "user" as const
  },
  {
    id: "2",
    name: "Twitter Thread Template",
    creatorName: "You",
    creatorHandle: "",
    creatorAvatar: "",
    description: "Structured format for creating engaging Twitter threads.",
    tone: ["Direct", "Educational"],
    example: "1/ Main hook to grab attention\n\n2/ Establish credibility\n\n3/ First key insight with example\n\n4/ Second key insight with data\n\n5/ Third key insight with story\n\n6/ Call to action\n\n7/ Related resources",
    date: "2023-05-25",
    isFavorite: false,
    folder: "Social Media",
    isTemplate: true,
    source: "user" as const
  }
];

const folders = ["All", "Professional", "Social Media", "Personal", "Marketing"];
const sortOptions = ["Recently Used", "Alphabetical", "Date Created"];
const filterOptions = ["All", "Styles", "Templates"];

const LibraryMyStyles: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("All");
  const [sortBy, setSortBy] = useState("Recently Used");
  const [filterBy, setFilterBy] = useState("All");
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const filteredStyles = USER_STYLES.filter(style => {
    const matchesSearch = style.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFolder = selectedFolder === "All" || style.folder === selectedFolder;
    const matchesFilter = filterBy === "All" || 
      (filterBy === "Templates" && style.isTemplate) ||
      (filterBy === "Styles" && !style.isTemplate);
    
    return matchesSearch && matchesFolder && matchesFilter;
  });

  const handleDeleteStyle = (id: string) => {
    toast.success("Style deleted successfully");
    // In a real app, this would make an API call to delete the style
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {showCreateForm ? (
        <LibraryCreateStyle onBack={() => setShowCreateForm(false)} />
      ) : (
        <>
          {/* Intro section with updated copy */}
          <CardContainer className="mb-4 p-4 bg-[#1A1F2C]">
            <div className="flex items-start gap-4">
              <div className="flex-grow space-y-2">
                <h3 className="font-medium text-white">Create your personal style or template to speed up future content creation.</h3>
                <p className="text-sm text-white/70">
                  Use styles to mimic tone and voice (e.g., Humorous Reply Style).<br />
                  Use templates to structure posts (e.g., LinkedIn Job Format).
                </p>
              </div>
              <Button 
                onClick={() => setShowCreateForm(true)}
                className="whitespace-nowrap bg-[#3260ea] hover:bg-[#2853c6]"
              >
                <FilePlus className="h-4 w-4 mr-2" /> 
                Create Style
              </Button>
            </div>
          </CardContainer>

          {/* Search and filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
              <Input
                placeholder="Search your styles"
                className="pl-10 bg-[#1A202C] border-white/10 h-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap sm:flex-nowrap">
              <Select value={selectedFolder} onValueChange={setSelectedFolder}>
                <SelectTrigger className="w-[130px] bg-[#1A202C] border-white/10 h-10">
                  <SelectValue placeholder="Folder" />
                </SelectTrigger>
                <SelectContent className="bg-[#1A202C] border-white/10 text-white">
                  {folders.map((folder) => (
                    <SelectItem key={folder} value={folder}>{folder}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-[130px] bg-[#1A202C] border-white/10 h-10">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent className="bg-[#1A202C] border-white/10 text-white">
                  {filterOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px] bg-[#1A202C] border-white/10 h-10">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-[#1A202C] border-white/10 text-white">
                  {sortOptions.map((option) => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Styles grid */}
          <ScrollArea className="flex-grow">
            {filteredStyles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">
                {filteredStyles.map((style) => (
                  <StyleCard key={style.id} style={style} onDelete={handleDeleteStyle} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center px-4">
                <div className="flex mb-4 space-x-3">
                  <div className="bg-[#3260ea]/20 p-3 rounded-full">
                    <Type className="h-6 w-6 text-[#3260ea]" />
                  </div>
                  <div className="bg-emerald-500/20 p-3 rounded-full">
                    <Layout className="h-6 w-6 text-emerald-500" />
                  </div>
                </div>
                <h3 className="text-xl font-medium mb-2 text-white">No styles found</h3>
                <p className="text-white/70 mb-6 max-w-md">
                  {searchTerm || selectedFolder !== "All" || filterBy !== "All" 
                    ? "Try adjusting your search filters to find your styles."
                    : "Create your first custom style or template to enhance your content creation."
                  }
                </p>
                
                {(searchTerm || selectedFolder !== "All" || filterBy !== "All") ? (
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedFolder("All");
                      setFilterBy("All");
                    }}
                    className="bg-transparent border-white/20"
                  >
                    Clear Filters
                  </Button>
                ) : (
                  <Button 
                    onClick={() => setShowCreateForm(true)}
                    className="bg-[#3260ea] hover:bg-[#2853c6]"
                  >
                    <FilePlus className="h-4 w-4 mr-2" />
                    Create Your Own Style
                  </Button>
                )}
              </div>
            )}
          </ScrollArea>
        </>
      )}
    </div>
  );
};

export default LibraryMyStyles;
