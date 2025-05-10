
export type BookmarkType = "link" | "screenshot" | "text";

export interface Bookmark {
  id: string;
  user_id: string;
  title: string;
  content: string;
  source_url?: string;
  image_url?: string;
  notes?: string;
  type: BookmarkType;
  created_at: string;
  updated_at: string;
}
