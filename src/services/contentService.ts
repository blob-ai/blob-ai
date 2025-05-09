
import { supabase } from "@/integrations/supabase/client";
import { ContentCategory, ContentGoal, ContentHook, ContentIdea, UserContent, UserUsage } from "@/types/content";

// Content Goals
export const getContentGoals = async (): Promise<ContentGoal[]> => {
  const { data, error } = await supabase
    .from("content_goals")
    .select("*");
  
  if (error) {
    console.error("Error fetching content goals:", error);
    throw new Error(error.message);
  }
  
  return data || [];
};

// Content Categories
export const getContentCategoriesByGoal = async (goalId: string): Promise<ContentCategory[]> => {
  const { data, error } = await supabase
    .from("content_categories")
    .select("*")
    .eq("goal_id", goalId);
  
  if (error) {
    console.error("Error fetching categories:", error);
    throw new Error(error.message);
  }
  
  return data || [];
};

// Content Ideas with Hooks
export const getContentIdeasByThemeAndCategories = async (
  theme: string,
  categories: string[],
  goalId: string
): Promise<ContentIdea[]> => {
  // First fetch ideas matching our criteria
  const { data: ideas, error } = await supabase
    .from("content_ideas")
    .select("*")
    .eq("goal_id", goalId)
    .in("category", categories);
  
  if (error) {
    console.error("Error fetching ideas:", error);
    throw new Error(error.message);
  }
  
  if (!ideas || ideas.length === 0) {
    return [];
  }
  
  // Then fetch hooks for all those ideas
  const ideaIds = ideas.map(idea => idea.id);
  const { data: hooks, error: hooksError } = await supabase
    .from("content_hooks")
    .select("*")
    .in("idea_id", ideaIds);
  
  if (hooksError) {
    console.error("Error fetching hooks:", hooksError);
    throw new Error(hooksError.message);
  }
  
  // Map hooks to their respective ideas
  return ideas.map(idea => ({
    ...idea,
    hooks: (hooks || [])
      .filter(hook => hook.idea_id === idea.id)
      .map(hook => ({
        ...hook,
        author: {
          name: hook.author_name,
          avatar: hook.author_avatar || "/placeholder.svg",
          credential: hook.author_credential || "",
        },
      })),
  }));
};

// User Content
export const saveUserContent = async (content: Required<Pick<UserContent, "user_id" | "title" | "content">> & Partial<Omit<UserContent, "user_id" | "title" | "content">>): Promise<UserContent> => {
  const { data, error } = await supabase
    .from("user_content")
    .insert(content)
    .select()
    .single();
  
  if (error) {
    console.error("Error saving content:", error);
    throw new Error(error.message);
  }
  
  return data as UserContent;
};

export const updateUserContent = async (id: string, updates: Partial<Omit<UserContent, "id">>): Promise<UserContent> => {
  const { data, error } = await supabase
    .from("user_content")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating content:", error);
    throw new Error(error.message);
  }
  
  return data as UserContent;
};

export const getUserContentById = async (id: string): Promise<UserContent | null> => {
  const { data, error } = await supabase
    .from("user_content")
    .select("*")
    .eq("id", id)
    .single();
  
  if (error) {
    if (error.code === "PGRST116") { // record not found error
      return null;
    }
    console.error("Error fetching content:", error);
    throw new Error(error.message);
  }
  
  return data as UserContent;
};

export const getUserContentList = async (status?: 'draft' | 'published' | 'scheduled'): Promise<UserContent[]> => {
  let query = supabase
    .from("user_content")
    .select("*")
    .order("updated_at", { ascending: false });
    
  if (status) {
    query = query.eq("status", status);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error("Error fetching content list:", error);
    throw new Error(error.message);
  }
  
  return data as UserContent[];
};

// User Usage
export const getUserUsage = async (): Promise<UserUsage | null> => {
  const { data, error } = await supabase
    .from("user_usage")
    .select("*")
    .maybeSingle();
  
  if (error) {
    console.error("Error fetching user usage:", error);
    throw new Error(error.message);
  }
  
  return data as UserUsage | null;
};

export const initializeUserUsage = async (userId: string): Promise<UserUsage> => {
  // Check if user already has a usage record
  const { data: existingUsage } = await supabase
    .from("user_usage")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  
  if (existingUsage) {
    return existingUsage as UserUsage;
  }
  
  // Create new usage record
  const { data, error } = await supabase
    .from("user_usage")
    .insert({
      user_id: userId,
      content_generations_used: 0,
      content_generations_limit: 5,
      last_reset_date: new Date().toISOString().split('T')[0]
    })
    .select()
    .single();
  
  if (error) {
    console.error("Error initializing user usage:", error);
    throw new Error(error.message);
  }
  
  return data as UserUsage;
};

export const incrementUsageCounter = async (userId: string): Promise<UserUsage> => {
  // First get the current usage
  const { data: currentUsage, error: fetchError } = await supabase
    .from("user_usage")
    .select("*")
    .eq("user_id", userId)
    .single();
  
  if (fetchError) {
    console.error("Error fetching user usage:", fetchError);
    throw new Error(fetchError.message);
  }
  
  // Check if we need to reset (it's a new day)
  const today = new Date().toISOString().split('T')[0];
  const resetNeeded = currentUsage.last_reset_date !== today;
  
  // Update the usage
  const { data, error } = await supabase
    .from("user_usage")
    .update({
      content_generations_used: resetNeeded ? 1 : currentUsage.content_generations_used + 1,
      last_reset_date: today
    })
    .eq("user_id", userId)
    .select()
    .single();
  
  if (error) {
    console.error("Error updating user usage:", error);
    throw new Error(error.message);
  }
  
  return data as UserUsage;
};
