
// Type definitions for styles and folders
import { type Tables as SupabaseTables } from "@/integrations/supabase/types";

// Use the tables directly from the Supabase types
export type Tables = SupabaseTables;

// Define the StyleFolder type based on the database schema
export type StyleFolder = Tables['style_folders']['Row'];

// Define the Style type based on the database schema
export type Style = Tables['styles']['Row'];

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

// Export types for inserting and updating
export type StyleFolderInsert = Tables['style_folders']['Insert'];
export type StyleFolderUpdate = Tables['style_folders']['Update'];
export type StyleInsert = Tables['styles']['Insert'];
export type StyleUpdate = Tables['styles']['Update'];
