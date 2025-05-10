
import React, { useState } from "react";
import { PageContainer } from "@/components/ui/page-container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LibraryExploreStyles from "@/components/library/LibraryExploreStyles";
import LibraryMyStyles from "@/components/library/LibraryMyStyles";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { BookmarkIcon } from "lucide-react";

const Library = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "explore"; // Default to "explore"
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleTabChange = (value: string) => {
    setSearchParams({
      tab: value
    });
  };
  
  return (
    <div className="flex flex-col w-full h-full bg-[#0F1218]">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#141921] sticky top-0 z-10 shadow-md">
        <div className="px-4 py-6 max-w-[1200px] mx-auto">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Library</h1>
            <p className="text-white/80 text-sm sm:text-base">
              Discover, save, and apply content styles to create your unique voice
            </p>
          </div>
        </div>
      </div>

      <PageContainer className="flex flex-col flex-grow overflow-hidden pt-4">
        <Tabs defaultValue="explore" value={activeTab} onValueChange={handleTabChange} className="w-full h-full flex flex-col">
          <div className="flex justify-center mb-6">
            <TabsList className="bg-black/50 border border-white/10 p-1 shadow-md rounded-full overflow-hidden">
              <TabsTrigger 
                value="explore" 
                className="px-8 rounded-full data-[state=active]:bg-[#24293A] data-[state=active]:text-white"
              >
                Explore
              </TabsTrigger>
              <TabsTrigger 
                value="myStyles" 
                className="px-8 rounded-full data-[state=active]:bg-[#24293A] data-[state=active]:text-white"
              >
                My Styles
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="explore" className="flex-grow overflow-hidden m-0">
            <LibraryExploreStyles />
          </TabsContent>

          <TabsContent value="myStyles" className="flex-grow overflow-hidden m-0">
            <LibraryMyStyles />
          </TabsContent>
        </Tabs>
      </PageContainer>
    </div>
  );
};

export default Library;
