
export interface ContentGoal {
  id: string;
  goal_id: string;
  title: string;
  description: string;
  icon: string;
  created_at: string;
}

export interface ContentCategory {
  id: string;
  name: string;
  goal_id: string | null;
  created_at: string;
}

export interface ContentIdea {
  id: string;
  title: string;
  category: string;
  goal_id: string | null;
  created_at: string;
  hooks?: ContentHook[];
}

export interface ContentHook {
  id: string;
  idea_id: string;
  text: string;
  author_name: string;
  author_credential: string | null;
  author_avatar: string | null;
  created_at: string;
  author: {
    name: string;
    avatar: string;
    credential: string;
  };
}

export interface UserContent {
  id: string;
  user_id: string;
  title: string;
  content: string;
  theme?: string;
  goal_id?: string;
  idea_id?: string;
  hook_id?: string;
  status: 'draft' | 'published' | 'scheduled';
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface UserUsage {
  id: string;
  user_id: string;
  content_generations_used: number;
  content_generations_limit: number;
  last_reset_date: string;
}
