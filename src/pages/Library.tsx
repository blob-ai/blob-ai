
import React, { useState } from "react";
import { PageContainer } from "@/components/ui/page-container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LibraryExploreStyles from "@/components/library/LibraryExploreStyles";
import LibraryMyStyles from "@/components/library/LibraryMyStyles";
import LibraryCreateStyle from "@/components/library/LibraryCreateStyle";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";

const Library = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "myStyles";
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleTabChange = (value: string) => {
    setSearchParams({
      tab: value
    });
  };
  
  return (
    <div className="flex flex-col w-full h-full">
      {/* Header */}
      <div className="border-b border-white/10 bg-background sticky top-0 z-10">
        <div className="px-4 py-6 max-w-[1200px] mx-auto">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Styles</h1>
            <p className="text-white/70 text-sm sm:text-base">
              Discover, save, and apply content styles to create your unique voice
            </p>
          </div>
        </div>
      </div>

      <PageContainer className="flex flex-col flex-grow overflow-hidden">
        <Tabs defaultValue="myStyles" value={activeTab} onValueChange={handleTabChange} className="w-full h-full flex flex-col">
          <div className="flex justify-center mb-6">
            <TabsList className="bg-black/20 border border-white/10 p-1">
              <TabsTrigger value="myStyles" className="px-8">My Styles</TabsTrigger>
              <TabsTrigger value="explore" className="px-8">
                Explore
              </TabsTrigger>
              <TabsTrigger value="create" className="px-8">
                Create Style
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="myStyles" className="flex-grow overflow-hidden m-0">
            <LibraryMyStyles />
          </TabsContent>

          <TabsContent value="explore" className="flex-grow overflow-hidden m-0">
            <LibraryExploreStyles />
          </TabsContent>

          <TabsContent value="create" className="flex-grow overflow-hidden m-0">
            <LibraryCreateStyle />
          </TabsContent>
        </Tabs>
      </PageContainer>
    </div>
  );
};

export default Library;
