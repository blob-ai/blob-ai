
// Type definitions for styles and folders
import { Database } from "@/integrations/supabase/types";

// Define the database schema tables we're working with
export type Tables = Database['public']['Tables'];

// Define the StyleFolder type based on the database schema
export type StyleFolder = {
  id: string;
  name: string;
  position: number | null;
  user_id: string;
  created_at: string;
  updated_at: string;
  count?: number; // For UI purposes, not in DB
};

// Define the Style type based on the database schema
export type Style = {
  id: string;
  name: string;
  description: string | null;
  tone: string[];
  format: string[];
  example: string | null;
  creator_name: string | null;
  creator_handle: string | null;
  creator_avatar: string | null;
  is_favorite: boolean;
  is_pinned: boolean;
  is_template: boolean;
  folder_id: string | null;
  source: string;
  user_id: string;
  created_at: string;
  updated_at: string;
};

// Type for the style object used in the UI components
export type StyleUIObject = {
  id: string;
  name: string;
  creatorName: string;
  creatorHandle: string;
  creatorAvatar: string;
  description: string;
  tone: string[];
  example: string;
  date: string;
  isFavorite: boolean;
  isPinned: boolean;
  folder: string;
  isTemplate: boolean;
  source: "user" | "creator";
  isSavedInspiration?: boolean;
};

// Extend Database types to include our tables
declare module "@/integrations/supabase/types" {
  interface Database {
    public: {
      Tables: {
        style_folders: {
          Row: StyleFolder;
          Insert: Omit<StyleFolder, "id" | "created_at" | "updated_at"> & { 
            id?: string;
            created_at?: string;
            updated_at?: string;
          };
          Update: Partial<Omit<StyleFolder, "id">>;
        };
        styles: {
          Row: Style;
          Insert: Omit<Style, "id" | "created_at" | "updated_at"> & {
            id?: string;
            created_at?: string;
            updated_at?: string;
          };
          Update: Partial<Omit<Style, "id">>;
        };
      };
    };
  }
}
