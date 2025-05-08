
// Type definitions for styles and folders
import { type Tables as SupabaseTables } from "@/integrations/supabase/types";

// Define the StyleFolder type based on the database schema
export type StyleFolder = SupabaseTables['style_folders']['Row'];

// Define the Style type based on the database schema
export type Style = SupabaseTables['styles']['Row'];

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
export type StyleFolderInsert = SupabaseTables['style_folders']['Insert'];
export type StyleFolderUpdate = SupabaseTables['style_folders']['Update'];
export type StyleInsert = SupabaseTables['styles']['Insert'];
export type StyleUpdate = SupabaseTables['styles']['Update'];
