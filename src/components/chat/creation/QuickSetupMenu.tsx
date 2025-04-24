
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ContentSetup } from "@/types/setup";

interface QuickSetupMenuProps {
  savedSetups: ContentSetup[];
  onSelectSetup: (setup: ContentSetup) => void;
}

const defaultTemplates: ContentSetup[] = [
  {
    id: "template-engagement",
    name: "Engagement Thread",
    goal: "community",
    format: "thread",
    hook: "question",
    tone: "conversational",
    isTemplate: true,
  },
  {
    id: "template-thought",
    name: "Thought Leadership",
    goal: "thought",
    format: "single",
    hook: "stat",
    tone: "authoritative",
    isTemplate: true,
  },
  {
    id: "template-growth",
    name: "Growth Post",
    goal: "growth",
    format: "poll",
    hook: "controversial",
    tone: "provocative",
    isTemplate: true,
  },
];

export function QuickSetupMenu({ savedSetups, onSelectSetup }: QuickSetupMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="text-[#3B82F6] hover:text-[#60A5FA] hover:bg-transparent font-sans"
        >
          Quick Setup
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-56 bg-[#1E2732] border-[#374151] font-sans"
        align="end"
      >
        {savedSetups.length > 0 && (
          <>
            <DropdownMenuLabel className="font-sans">Your Setups</DropdownMenuLabel>
            <DropdownMenuGroup>
              {savedSetups.map((setup) => (
                <DropdownMenuItem
                  key={setup.id}
                  onClick={() => onSelectSetup(setup)}
                  className="text-[#3B82F6] hover:bg-[#1F2937] cursor-pointer text-xs py-2 px-4 font-medium"
                >
                  {setup.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuLabel className="font-sans">Templates</DropdownMenuLabel>
        <DropdownMenuGroup>
          {defaultTemplates.map((template) => (
            <DropdownMenuItem
              key={template.id}
              onClick={() => onSelectSetup(template)}
              className="text-[#3B82F6] hover:bg-[#1F2937] cursor-pointer text-xs py-2 px-4 font-medium"
            >
              {template.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
