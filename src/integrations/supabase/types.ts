export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
            foreignKeyName: "content_drafts_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "chat_threads"
            referencedColumns: ["id"]
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
          stripe_customer_id: string | null
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
          stripe_customer_id?: string | null
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
          stripe_customer_id?: string | null
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
