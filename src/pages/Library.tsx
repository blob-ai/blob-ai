
import React, { useState } from "react";
import { PageContainer } from "@/components/ui/page-container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LibraryDiscover from "@/components/library/LibraryDiscover";
import LibraryMyVault from "@/components/library/LibraryMyVault";
import LibraryStyleLab from "@/components/library/LibraryStyleLab";
import { useNavigate, useSearchParams } from "react-router-dom";

const Library = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "discover";
  const navigate = useNavigate();

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  return (
    <div className="flex flex-col w-full h-full">
      {/* Library Header */}
      <div className="border-b border-white/10 bg-background sticky top-0 z-10">
        <div className="px-4 py-6 max-w-[1200px] mx-auto">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Library</h1>
            <p className="text-white/70 text-sm sm:text-base">
              Discover, save, and apply content styles from influential creators
            </p>
          </div>
        </div>
      </div>

      <PageContainer className="flex flex-col flex-grow overflow-hidden">
        <Tabs
          defaultValue="discover"
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full h-full flex flex-col"
        >
          <div className="flex justify-center mb-6">
            <TabsList className="bg-black/20 border border-white/10 p-1">
              <TabsTrigger value="discover" className="px-8">
                Discover
              </TabsTrigger>
              <TabsTrigger value="vault" className="px-8">
                My Vault
              </TabsTrigger>
              <TabsTrigger value="lab" className="px-8">
                Style Lab
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="discover" className="flex-grow overflow-hidden m-0">
            <LibraryDiscover />
          </TabsContent>

          <TabsContent value="vault" className="flex-grow overflow-hidden m-0">
            <LibraryMyVault />
          </TabsContent>

          <TabsContent value="lab" className="flex-grow overflow-hidden m-0">
            <LibraryStyleLab />
          </TabsContent>
        </Tabs>
      </PageContainer>
    </div>
  );
};

export default Library;
