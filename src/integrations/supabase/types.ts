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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      banners: {
        Row: {
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          link_url: string | null
          media_type: string
          media_url: string
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          link_url?: string | null
          media_type?: string
          media_url: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          link_url?: string | null
          media_type?: string
          media_url?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      coupons: {
        Row: {
          code: string
          created_at: string
          discount_type: string
          discount_value: number
          id: string
          institute: string | null
          is_active: boolean
          max_discount: number | null
          min_order_amount: number | null
          updated_at: string
          usage_limit: number | null
          used_count: number
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          code: string
          created_at?: string
          discount_type?: string
          discount_value?: number
          id?: string
          institute?: string | null
          is_active?: boolean
          max_discount?: number | null
          min_order_amount?: number | null
          updated_at?: string
          usage_limit?: number | null
          used_count?: number
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          discount_type?: string
          discount_value?: number
          id?: string
          institute?: string | null
          is_active?: boolean
          max_discount?: number | null
          min_order_amount?: number | null
          updated_at?: string
          usage_limit?: number | null
          used_count?: number
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      course_chapters: {
        Row: {
          display_order: number
          id: string
          name: string
          topics: string[] | null
          unit_id: string
        }
        Insert: {
          display_order?: number
          id?: string
          name: string
          topics?: string[] | null
          unit_id: string
        }
        Update: {
          display_order?: number
          id?: string
          name?: string
          topics?: string[] | null
          unit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_chapters_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "course_units"
            referencedColumns: ["id"]
          },
        ]
      }
      course_faqs: {
        Row: {
          answer: string
          course_id: string
          display_order: number
          id: string
          question: string
        }
        Insert: {
          answer: string
          course_id: string
          display_order?: number
          id?: string
          question: string
        }
        Update: {
          answer?: string
          course_id?: string
          display_order?: number
          id?: string
          question?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_faqs_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_features: {
        Row: {
          course_id: string
          display_order: number
          feature: string
          id: string
        }
        Insert: {
          course_id: string
          display_order?: number
          feature: string
          id?: string
        }
        Update: {
          course_id?: string
          display_order?: number
          feature?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_features_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_units: {
        Row: {
          course_id: string
          display_order: number
          id: string
          name: string
        }
        Insert: {
          course_id: string
          display_order?: number
          id?: string
          name: string
        }
        Update: {
          course_id?: string
          display_order?: number
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_units_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          batch_size: number | null
          created_at: string
          description: string | null
          display_order: number
          duration: string | null
          id: string
          institute: string
          is_active: boolean
          is_featured: boolean
          mentor_image: string | null
          mentor_name: string | null
          mentor_title: string | null
          original_price: number | null
          price: number
          slug: string
          subtitle: string | null
          success_rate: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          batch_size?: number | null
          created_at?: string
          description?: string | null
          display_order?: number
          duration?: string | null
          id?: string
          institute: string
          is_active?: boolean
          is_featured?: boolean
          mentor_image?: string | null
          mentor_name?: string | null
          mentor_title?: string | null
          original_price?: number | null
          price?: number
          slug: string
          subtitle?: string | null
          success_rate?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          batch_size?: number | null
          created_at?: string
          description?: string | null
          display_order?: number
          duration?: string | null
          id?: string
          institute?: string
          is_active?: boolean
          is_featured?: boolean
          mentor_image?: string | null
          mentor_name?: string | null
          mentor_title?: string | null
          original_price?: number | null
          price?: number
          slug?: string
          subtitle?: string | null
          success_rate?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      gallery_items: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          gallery_type: string
          id: string
          image_url: string
          institute: string
          is_active: boolean
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          gallery_type: string
          id?: string
          image_url: string
          institute: string
          is_active?: boolean
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          gallery_type?: string
          id?: string
          image_url?: string
          institute?: string
          is_active?: boolean
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          amount: number
          coupon_code: string | null
          coupon_id: string | null
          course_id: string
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string
          discount_amount: number | null
          final_amount: number
          id: string
          institute: string
          order_number: string
          payment_status: string
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          razorpay_signature: string | null
          updated_at: string
          user_id: string | null
          user_type: string
        }
        Insert: {
          amount: number
          coupon_code?: string | null
          coupon_id?: string | null
          course_id: string
          created_at?: string
          customer_email: string
          customer_name: string
          customer_phone: string
          discount_amount?: number | null
          final_amount: number
          id?: string
          institute: string
          order_number: string
          payment_status?: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          updated_at?: string
          user_id?: string | null
          user_type?: string
        }
        Update: {
          amount?: number
          coupon_code?: string | null
          coupon_id?: string | null
          course_id?: string
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string
          discount_amount?: number | null
          final_amount?: number
          id?: string
          institute?: string
          order_number?: string
          payment_status?: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          updated_at?: string
          user_id?: string | null
          user_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      padma_boards: {
        Row: {
          code: string
          created_at: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      padma_grades: {
        Row: {
          board_id: string
          created_at: string | null
          display_order: number | null
          grade_number: number
          id: string
          is_active: boolean | null
          updated_at: string | null
        }
        Insert: {
          board_id: string
          created_at?: string | null
          display_order?: number | null
          grade_number: number
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
        }
        Update: {
          board_id?: string
          created_at?: string | null
          display_order?: number | null
          grade_number?: number
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "padma_grades_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "padma_boards"
            referencedColumns: ["id"]
          },
        ]
      }
      padma_mock_tests: {
        Row: {
          created_at: string | null
          display_order: number | null
          fee_amount: number
          id: string
          is_active: boolean | null
          num_tests: number
          solution_days: string | null
          test_days: string | null
          test_duration: string | null
          test_timing: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          fee_amount?: number
          id?: string
          is_active?: boolean | null
          num_tests?: number
          solution_days?: string | null
          test_days?: string | null
          test_duration?: string | null
          test_timing?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          fee_amount?: number
          id?: string
          is_active?: boolean | null
          num_tests?: number
          solution_days?: string | null
          test_days?: string | null
          test_duration?: string | null
          test_timing?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      padma_offline_locations: {
        Row: {
          address: string
          created_at: string | null
          display_order: number | null
          google_maps_url: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          address: string
          created_at?: string | null
          display_order?: number | null
          google_maps_url?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          address?: string
          created_at?: string | null
          display_order?: number | null
          google_maps_url?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      padma_pricing_plans: {
        Row: {
          created_at: string | null
          days: string | null
          display_order: number | null
          duration_period: string | null
          fee_amount: number
          grade_id: string
          id: string
          is_active: boolean | null
          mode: string
          payment_frequency: string | null
          plan_label: string
          plan_type: string
          savings_percent: string | null
          timing: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          days?: string | null
          display_order?: number | null
          duration_period?: string | null
          fee_amount?: number
          grade_id: string
          id?: string
          is_active?: boolean | null
          mode?: string
          payment_frequency?: string | null
          plan_label?: string
          plan_type?: string
          savings_percent?: string | null
          timing?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          days?: string | null
          display_order?: number | null
          duration_period?: string | null
          fee_amount?: number
          grade_id?: string
          id?: string
          is_active?: boolean | null
          mode?: string
          payment_frequency?: string | null
          plan_label?: string
          plan_type?: string
          savings_percent?: string | null
          timing?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "padma_pricing_plans_grade_id_fkey"
            columns: ["grade_id"]
            isOneToOne: false
            referencedRelation: "padma_grades"
            referencedColumns: ["id"]
          },
        ]
      }
      padma_subjects: {
        Row: {
          created_at: string | null
          display_order: number | null
          grade_id: string
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          grade_id: string
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          grade_id?: string
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "padma_subjects_grade_id_fkey"
            columns: ["grade_id"]
            isOneToOne: false
            referencedRelation: "padma_grades"
            referencedColumns: ["id"]
          },
        ]
      }
      padma_students: {
        Row: {
          id: string
          name: string
          access_code: string
          grade: string | null
          board: string | null
          access_start_date: string
          access_end_date: string
          is_active: boolean
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          access_code: string
          grade?: string | null
          board?: string | null
          access_start_date: string
          access_end_date: string
          is_active?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          access_code?: string
          grade?: string | null
          board?: string | null
          access_start_date?: string
          access_end_date?: string
          is_active?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      padma_zoom_recordings: {
        Row: {
          created_at: string
          description: string | null
          duration: string
          id: string
          storage_path: string
          subject: string
          thumbnail: string | null
          title: string
          upload_date: string
          updated_at: string
          uploaded_by: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration: string
          id?: string
          storage_path: string
          subject: string
          thumbnail?: string | null
          title: string
          upload_date?: string
          updated_at?: string
          uploaded_by: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration?: string
          id?: string
          storage_path?: string
          subject?: string
          thumbnail?: string | null
          title?: string
          upload_date?: string
          updated_at?: string
          uploaded_by?: string
        }
        Relationships: []
      }
      racademy_modules: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          display_order: number | null
          duration: string | null
          fee_summary: string | null
          highlights: string[] | null
          id: string
          is_active: boolean | null
          mode: string
          name: string
          target_audience: string | null
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          duration?: string | null
          fee_summary?: string | null
          highlights?: string[] | null
          id?: string
          is_active?: boolean | null
          mode?: string
          name: string
          target_audience?: string | null
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          duration?: string | null
          fee_summary?: string | null
          highlights?: string[] | null
          id?: string
          is_active?: boolean | null
          mode?: string
          name?: string
          target_audience?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      racademy_subjects: {
        Row: {
          created_at: string | null
          days: string | null
          display_order: number | null
          duration: string | null
          fee_amount: number
          fee_label: string | null
          id: string
          is_active: boolean | null
          module_id: string
          name: string
          timing: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          days?: string | null
          display_order?: number | null
          duration?: string | null
          fee_amount?: number
          fee_label?: string | null
          id?: string
          is_active?: boolean | null
          module_id: string
          name: string
          timing?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          days?: string | null
          display_order?: number | null
          duration?: string | null
          fee_amount?: number
          fee_label?: string | null
          id?: string
          is_active?: boolean | null
          module_id?: string
          name?: string
          timing?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "racademy_subjects_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "racademy_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      generate_order_number: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
