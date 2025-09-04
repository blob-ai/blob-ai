export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      chat_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          role: string
          thread_id: string
          tokens_used: number | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          role: string
          thread_id: string
          tokens_used?: number | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          role?: string
          thread_id?: string
          tokens_used?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "chat_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_threads: {
        Row: {
          created_at: string | null
          id: string
          last_message_at: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          title?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      content_analyses: {
        Row: {
          analysis_results: Json
          created_at: string | null
          id: string
          input_content: Json
          source_platform: string | null
          thread_id: string | null
          tokens_used: number | null
          user_id: string
        }
        Insert: {
          analysis_results: Json
          created_at?: string | null
          id?: string
          input_content: Json
          source_platform?: string | null
          thread_id?: string | null
          tokens_used?: number | null
          user_id: string
        }
        Update: {
          analysis_results?: Json
          created_at?: string | null
          id?: string
          input_content?: Json
          source_platform?: string | null
          thread_id?: string | null
          tokens_used?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_analyses_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "chat_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      content_categories: {
        Row: {
          created_at: string
          goal_id: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          goal_id?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          goal_id?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_categories_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "content_goals"
            referencedColumns: ["goal_id"]
          },
        ]
      }
      content_drafts: {
        Row: {
          content: string
          created_at: string | null
          id: string
          setup_id: string | null
          status: string | null
          thread_id: string | null
          title: string
          tokens_used: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          setup_id?: string | null
          status?: string | null
          thread_id?: string | null
          title: string
          tokens_used?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          setup_id?: string | null
          status?: string | null
          thread_id?: string | null
          title?: string
          tokens_used?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_drafts_setup_id_fkey"
            columns: ["setup_id"]
            isOneToOne: false
            referencedRelation: "content_setups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_drafts_setup_id_fkey"
            columns: ["setup_id"]
            isOneToOne: false
            referencedRelation: "public_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_drafts_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "chat_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      content_goals: {
        Row: {
          created_at: string
          description: string
          goal_id: string
          icon: string
          id: string
          title: string
        }
        Insert: {
          created_at?: string
          description: string
          goal_id: string
          icon: string
          id?: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          goal_id?: string
          icon?: string
          id?: string
          title?: string
        }
        Relationships: []
      }
      content_hooks: {
        Row: {
          author_avatar: string | null
          author_credential: string | null
          author_name: string
          created_at: string
          id: string
          idea_id: string | null
          text: string
        }
        Insert: {
          author_avatar?: string | null
          author_credential?: string | null
          author_name: string
          created_at?: string
          id?: string
          idea_id?: string | null
          text: string
        }
        Update: {
          author_avatar?: string | null
          author_credential?: string | null
          author_name?: string
          created_at?: string
          id?: string
          idea_id?: string | null
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_hooks_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "content_ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      content_ideas: {
        Row: {
          category: string
          created_at: string
          goal_id: string | null
          id: string
          title: string
        }
        Insert: {
          category: string
          created_at?: string
          goal_id?: string | null
          id?: string
          title: string
        }
        Update: {
          category?: string
          created_at?: string
          goal_id?: string | null
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_ideas_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "content_goals"
            referencedColumns: ["goal_id"]
          },
        ]
      }
      content_setups: {
        Row: {
          configuration: Json
          created_at: string | null
          examples: Json | null
          id: string
          is_template: boolean | null
          name: string
          updated_at: string | null
          usage_count: number | null
          user_id: string
        }
        Insert: {
          configuration: Json
          created_at?: string | null
          examples?: Json | null
          id?: string
          is_template?: boolean | null
          name: string
          updated_at?: string | null
          usage_count?: number | null
          user_id: string
        }
        Update: {
          configuration?: Json
          created_at?: string | null
          examples?: Json | null
          id?: string
          is_template?: boolean | null
          name?: string
          updated_at?: string | null
          usage_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      payment_profiles: {
        Row: {
          created_at: string
          id: string
          stripe_customer_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          stripe_customer_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          stripe_customer_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          daily_analysis_count: number | null
          daily_analysis_limit: number | null
          daily_chat_count: number | null
          daily_chat_limit: number | null
          full_name: string | null
          id: string
          is_onboarded: boolean | null
          last_analysis_reset: string | null
          last_chat_reset: string | null
          name: string | null
          plan_tier: string
          total_tokens_used: number | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          daily_analysis_count?: number | null
          daily_analysis_limit?: number | null
          daily_chat_count?: number | null
          daily_chat_limit?: number | null
          full_name?: string | null
          id: string
          is_onboarded?: boolean | null
          last_analysis_reset?: string | null
          last_chat_reset?: string | null
          name?: string | null
          plan_tier?: string
          total_tokens_used?: number | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          daily_analysis_count?: number | null
          daily_analysis_limit?: number | null
          daily_chat_count?: number | null
          daily_chat_limit?: number | null
          full_name?: string | null
          id?: string
          is_onboarded?: boolean | null
          last_analysis_reset?: string | null
          last_chat_reset?: string | null
          name?: string | null
          plan_tier?: string
          total_tokens_used?: number | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      style_folders: {
        Row: {
          created_at: string
          id: string
          name: string
          position: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          position?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          position?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      styles: {
        Row: {
          created_at: string
          creator_avatar: string | null
          creator_handle: string | null
          creator_name: string | null
          description: string | null
          example: string | null
          folder_id: string | null
          format: string[]
          id: string
          is_favorite: boolean
          is_pinned: boolean
          is_template: boolean
          name: string
          source: string
          tone: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          creator_avatar?: string | null
          creator_handle?: string | null
          creator_name?: string | null
          description?: string | null
          example?: string | null
          folder_id?: string | null
          format?: string[]
          id?: string
          is_favorite?: boolean
          is_pinned?: boolean
          is_template?: boolean
          name: string
          source?: string
          tone?: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          creator_avatar?: string | null
          creator_handle?: string | null
          creator_name?: string | null
          description?: string | null
          example?: string | null
          folder_id?: string | null
          format?: string[]
          id?: string
          is_favorite?: boolean
          is_pinned?: boolean
          is_template?: boolean
          name?: string
          source?: string
          tone?: string[]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "styles_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "style_folders"
            referencedColumns: ["id"]
          },
        ]
      }
      user_content: {
        Row: {
          content: string
          created_at: string
          goal_id: string | null
          hook_id: string | null
          id: string
          idea_id: string | null
          published_at: string | null
          status: string
          theme: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          goal_id?: string | null
          hook_id?: string | null
          id?: string
          idea_id?: string | null
          published_at?: string | null
          status?: string
          theme?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          goal_id?: string | null
          hook_id?: string | null
          id?: string
          idea_id?: string | null
          published_at?: string | null
          status?: string
          theme?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_content_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "content_goals"
            referencedColumns: ["goal_id"]
          },
          {
            foreignKeyName: "user_content_hook_id_fkey"
            columns: ["hook_id"]
            isOneToOne: false
            referencedRelation: "content_hooks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_content_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "content_ideas"
            referencedColumns: ["id"]
          },
        ]
      }
      user_metrics: {
        Row: {
          analysis_count: number | null
          chat_count: number | null
          content_created_count: number | null
          date: string
          id: string
          templates_used: Json | null
          total_tokens_used: number | null
          user_id: string
        }
        Insert: {
          analysis_count?: number | null
          chat_count?: number | null
          content_created_count?: number | null
          date: string
          id?: string
          templates_used?: Json | null
          total_tokens_used?: number | null
          user_id: string
        }
        Update: {
          analysis_count?: number | null
          chat_count?: number | null
          content_created_count?: number | null
          date?: string
          id?: string
          templates_used?: Json | null
          total_tokens_used?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_usage: {
        Row: {
          content_generations_limit: number
          content_generations_used: number
          id: string
          last_reset_date: string
          user_id: string
        }
        Insert: {
          content_generations_limit?: number
          content_generations_used?: number
          id?: string
          last_reset_date?: string
          user_id: string
        }
        Update: {
          content_generations_limit?: number
          content_generations_used?: number
          id?: string
          last_reset_date?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      public_templates: {
        Row: {
          configuration: Json | null
          created_at: string | null
          examples: Json | null
          id: string | null
          is_template: boolean | null
          name: string | null
          updated_at: string | null
          usage_count: number | null
        }
        Insert: {
          configuration?: Json | null
          created_at?: string | null
          examples?: Json | null
          id?: string | null
          is_template?: boolean | null
          name?: string | null
          updated_at?: string | null
          usage_count?: number | null
        }
        Update: {
          configuration?: Json | null
          created_at?: string | null
          examples?: Json | null
          id?: string | null
          is_template?: boolean | null
          name?: string | null
          updated_at?: string | null
          usage_count?: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_stripe_customer_id: {
        Args: { p_user_id: string }
        Returns: string
      }
      upsert_stripe_customer_id: {
        Args: { p_customer_id: string; p_user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
