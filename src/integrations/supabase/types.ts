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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      documents: {
        Row: {
          created_at: string
          file_url: string
          id: string
          property_id: string
          type: string
          uploaded_by: string | null
          verification_status: string
        }
        Insert: {
          created_at?: string
          file_url: string
          id?: string
          property_id: string
          type: string
          uploaded_by?: string | null
          verification_status?: string
        }
        Update: {
          created_at?: string
          file_url?: string
          id?: string
          property_id?: string
          type?: string
          uploaded_by?: string | null
          verification_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      inquiries: {
        Row: {
          assigned_agent: string | null
          buyer_email: string | null
          buyer_id: string | null
          buyer_name: string
          buyer_phone: string
          created_at: string
          id: string
          message: string | null
          property_id: string
          status: string
          updated_at: string
        }
        Insert: {
          assigned_agent?: string | null
          buyer_email?: string | null
          buyer_id?: string | null
          buyer_name: string
          buyer_phone: string
          created_at?: string
          id?: string
          message?: string | null
          property_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          assigned_agent?: string | null
          buyer_email?: string | null
          buyer_id?: string | null
          buyer_name?: string
          buyer_phone?: string
          created_at?: string
          id?: string
          message?: string | null
          property_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inquiries_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          approval_type: string | null
          area: number
          area_unit: string
          created_at: string
          description: string | null
          id: string
          images: string[] | null
          location: string
          possession_verified: boolean | null
          price: number
          property_type: string
          rera_registered: boolean | null
          risk_level: string | null
          seller_id: string | null
          sold_out: boolean
          status: string
          submitter_email: string | null
          submitter_name: string | null
          submitter_phone: string | null
          title: string
          title_verified: boolean | null
          updated_at: string
          verified: boolean | null
          visible: boolean
        }
        Insert: {
          approval_type?: string | null
          area: number
          area_unit?: string
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          location: string
          possession_verified?: boolean | null
          price: number
          property_type: string
          rera_registered?: boolean | null
          risk_level?: string | null
          seller_id?: string | null
          sold_out?: boolean
          status?: string
          submitter_email?: string | null
          submitter_name?: string | null
          submitter_phone?: string | null
          title: string
          title_verified?: boolean | null
          updated_at?: string
          verified?: boolean | null
          visible?: boolean
        }
        Update: {
          approval_type?: string | null
          area?: number
          area_unit?: string
          created_at?: string
          description?: string | null
          id?: string
          images?: string[] | null
          location?: string
          possession_verified?: boolean | null
          price?: number
          property_type?: string
          rera_registered?: boolean | null
          risk_level?: string | null
          seller_id?: string | null
          sold_out?: boolean
          status?: string
          submitter_email?: string | null
          submitter_name?: string | null
          submitter_phone?: string | null
          title?: string
          title_verified?: boolean | null
          updated_at?: string
          verified?: boolean | null
          visible?: boolean
        }
        Relationships: []
      }
      transactions: {
        Row: {
          brokerage_amount: number
          buyer_id: string | null
          created_at: string
          id: string
          property_id: string | null
          sale_amount: number
          seller_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          brokerage_amount: number
          buyer_id?: string | null
          created_at?: string
          id?: string
          property_id?: string | null
          sale_amount: number
          seller_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          brokerage_amount?: number
          buyer_id?: string | null
          created_at?: string
          id?: string
          property_id?: string | null
          sale_amount?: number
          seller_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "buyer" | "seller" | "admin"
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
    Enums: {
      app_role: ["buyer", "seller", "admin"],
    },
  },
} as const
