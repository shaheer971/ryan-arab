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
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          parent_id: string | null
          position: number | null
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          parent_id?: string | null
          position?: number | null
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          parent_id?: string | null
          position?: number | null
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      phone_verification: {
        Row: {
          attempts: number | null
          created_at: string
          expires_at: string
          id: string
          phone_number: string
          status: string | null
          user_id: string | null
          verification_code: string | null
          verified_at: string | null
        }
        Insert: {
          attempts?: number | null
          created_at?: string
          expires_at?: string
          id?: string
          phone_number: string
          status?: string | null
          user_id?: string | null
          verification_code?: string | null
          verified_at?: string | null
        }
        Update: {
          attempts?: number | null
          created_at?: string
          expires_at?: string
          id?: string
          phone_number?: string
          status?: string | null
          user_id?: string | null
          verification_code?: string | null
          verified_at?: string | null
        }
        Relationships: []
      }
      product_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          meta_description: string | null
          meta_title: string | null
          name: string
          parent_id: string | null
          position: number | null
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          name: string
          parent_id?: string | null
          position?: number | null
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          parent_id?: string | null
          position?: number | null
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      product_collections: {
        Row: {
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          meta_description: string | null
          meta_title: string | null
          name: string
          slug: string
          start_date: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          name: string
          slug: string
          start_date?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          slug?: string
          start_date?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      product_custom_fields: {
        Row: {
          created_at: string | null
          id: string
          name: string
          product_id: string | null
          value: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          product_id?: string | null
          value?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          product_id?: string | null
          value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_custom_fields_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          alt_text: string | null
          caption: string | null
          created_at: string
          custom_fields: Json | null
          filename: string | null
          height: number | null
          id: string
          is_hover: boolean | null
          is_thumbnail: boolean | null
          mime_type: string | null
          original_filename: string | null
          position: number | null
          product_id: string | null
          size_bytes: number | null
          title: string | null
          updated_at: string
          url: string
          variant_id: string | null
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          custom_fields?: Json | null
          filename?: string | null
          height?: number | null
          id?: string
          is_hover?: boolean | null
          is_thumbnail?: boolean | null
          mime_type?: string | null
          original_filename?: string | null
          position?: number | null
          product_id?: string | null
          size_bytes?: number | null
          title?: string | null
          updated_at?: string
          url: string
          variant_id?: string | null
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          custom_fields?: Json | null
          filename?: string | null
          height?: number | null
          id?: string
          is_hover?: boolean | null
          is_thumbnail?: boolean | null
          mime_type?: string | null
          original_filename?: string | null
          position?: number | null
          product_id?: string | null
          size_bytes?: number | null
          title?: string | null
          updated_at?: string
          url?: string
          variant_id?: string | null
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_images_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      product_tag_relations: {
        Row: {
          product_id: string
          tag_id: string
        }
        Insert: {
          product_id: string
          tag_id: string
        }
        Update: {
          product_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_tag_relations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_tag_relations_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "product_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      product_tags: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      product_variants: {
        Row: {
          barcode: string | null
          compare_at_price: number | null
          cost_per_item: number | null
          created_at: string
          custom_fields: Json | null
          dimensions_unit: string | null
          height: number | null
          id: string
          is_active: boolean | null
          length: number | null
          low_stock_threshold: number | null
          name: string
          option_values: Json
          price: number
          product_id: string | null
          quantity: number | null
          sku: string | null
          updated_at: string
          weight: number | null
          weight_unit: string | null
          width: number | null
        }
        Insert: {
          barcode?: string | null
          compare_at_price?: number | null
          cost_per_item?: number | null
          created_at?: string
          custom_fields?: Json | null
          dimensions_unit?: string | null
          height?: number | null
          id?: string
          is_active?: boolean | null
          length?: number | null
          low_stock_threshold?: number | null
          name: string
          option_values: Json
          price: number
          product_id?: string | null
          quantity?: number | null
          sku?: string | null
          updated_at?: string
          weight?: number | null
          weight_unit?: string | null
          width?: number | null
        }
        Update: {
          barcode?: string | null
          compare_at_price?: number | null
          cost_per_item?: number | null
          created_at?: string
          custom_fields?: Json | null
          dimensions_unit?: string | null
          height?: number | null
          id?: string
          is_active?: boolean | null
          length?: number | null
          low_stock_threshold?: number | null
          name?: string
          option_values?: Json
          price?: number
          product_id?: string | null
          quantity?: number | null
          sku?: string | null
          updated_at?: string
          weight?: number | null
          weight_unit?: string | null
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          allow_backorder: boolean | null
          barcode: string | null
          brand: string | null
          category_id: string | null
          collection: string
          collection_id: string | null
          compare_at_price: number | null
          continue_selling_when_out_of_stock: boolean | null
          cost_per_item: number | null
          created_at: string
          cross_sell_products: string[] | null
          custom_fields: Json | null
          description: string | null
          digital_download_url: string | null
          dimensions_unit: string | null
          discount_end_date: string | null
          discount_start_date: string | null
          discount_type: string | null
          discount_value: number | null
          has_variants: boolean | null
          height: number | null
          id: string
          images: Json | null
          inventory_count: number | null
          is_digital: boolean | null
          is_featured: boolean | null
          is_on_sale: boolean | null
          is_returnable: boolean | null
          length: number | null
          low_stock_threshold: number | null
          materials: string | null
          name: string
          price: number
          product_description: string | null
          product_type: string
          profit_margin: number | null
          published_at: string | null
          quantity: number | null
          related_products: string[] | null
          requires_shipping: boolean | null
          return_period: number | null
          sale_price: number | null
          search_terms: string[] | null
          seo_description: string | null
          seo_title: string | null
          shipping_class: string | null
          short_description: string | null
          sku: string | null
          slug: string
          status: string | null
          tags: string[] | null
          tax_class: string | null
          title: string
          track_quantity: boolean | null
          updated_at: string
          variant_options: Json | null
          vendor: string | null
          visibility: string | null
          weight: number | null
          weight_unit: string | null
          width: number | null
        }
        Insert: {
          allow_backorder?: boolean | null
          barcode?: string | null
          brand?: string | null
          category_id?: string | null
          collection: string
          collection_id?: string | null
          compare_at_price?: number | null
          continue_selling_when_out_of_stock?: boolean | null
          cost_per_item?: number | null
          created_at?: string
          cross_sell_products?: string[] | null
          custom_fields?: Json | null
          description?: string | null
          digital_download_url?: string | null
          dimensions_unit?: string | null
          discount_end_date?: string | null
          discount_start_date?: string | null
          discount_type?: string | null
          discount_value?: number | null
          has_variants?: boolean | null
          height?: number | null
          id?: string
          images?: Json | null
          inventory_count?: number | null
          is_digital?: boolean | null
          is_featured?: boolean | null
          is_on_sale?: boolean | null
          is_returnable?: boolean | null
          length?: number | null
          low_stock_threshold?: number | null
          materials?: string | null
          name: string
          price: number
          product_description?: string | null
          product_type?: string
          profit_margin?: number | null
          published_at?: string | null
          quantity?: number | null
          related_products?: string[] | null
          requires_shipping?: boolean | null
          return_period?: number | null
          sale_price?: number | null
          search_terms?: string[] | null
          seo_description?: string | null
          seo_title?: string | null
          shipping_class?: string | null
          short_description?: string | null
          sku?: string | null
          slug: string
          status?: string | null
          tags?: string[] | null
          tax_class?: string | null
          title?: string
          track_quantity?: boolean | null
          updated_at?: string
          variant_options?: Json | null
          vendor?: string | null
          visibility?: string | null
          weight?: number | null
          weight_unit?: string | null
          width?: number | null
        }
        Update: {
          allow_backorder?: boolean | null
          barcode?: string | null
          brand?: string | null
          category_id?: string | null
          collection?: string
          collection_id?: string | null
          compare_at_price?: number | null
          continue_selling_when_out_of_stock?: boolean | null
          cost_per_item?: number | null
          created_at?: string
          cross_sell_products?: string[] | null
          custom_fields?: Json | null
          description?: string | null
          digital_download_url?: string | null
          dimensions_unit?: string | null
          discount_end_date?: string | null
          discount_start_date?: string | null
          discount_type?: string | null
          discount_value?: number | null
          has_variants?: boolean | null
          height?: number | null
          id?: string
          images?: Json | null
          inventory_count?: number | null
          is_digital?: boolean | null
          is_featured?: boolean | null
          is_on_sale?: boolean | null
          is_returnable?: boolean | null
          length?: number | null
          low_stock_threshold?: number | null
          materials?: string | null
          name?: string
          price?: number
          product_description?: string | null
          product_type?: string
          profit_margin?: number | null
          published_at?: string | null
          quantity?: number | null
          related_products?: string[] | null
          requires_shipping?: boolean | null
          return_period?: number | null
          sale_price?: number | null
          search_terms?: string[] | null
          seo_description?: string | null
          seo_title?: string | null
          shipping_class?: string | null
          short_description?: string | null
          sku?: string | null
          slug?: string
          status?: string | null
          tags?: string[] | null
          tax_class?: string | null
          title?: string
          track_quantity?: boolean | null
          updated_at?: string
          variant_options?: Json | null
          vendor?: string | null
          visibility?: string | null
          weight?: number | null
          weight_unit?: string | null
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "product_collections"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          phone: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id: string
          last_name: string
          phone: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          phone?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_phone_verification: {
        Args: {
          phone_number: string
          verification_code: string
          user_id?: string
        }
        Returns: string
      }
      create_product_with_tags: {
        Args: {
          product_data: Json
          tag_names: string[]
        }
        Returns: string
      }
      delete_product_with_cleanup: {
        Args: {
          p_product_id: string
        }
        Returns: undefined
      }
      handle_phone_verification: {
        Args: {
          p_phone_number: string
          p_user_id?: string
        }
        Returns: Json
      }
      is_phone_verified: {
        Args: {
          p_phone_number: string
        }
        Returns: boolean
      }
      update_product_with_details: {
        Args: {
          p_product_id: string
          p_name: string
          p_price: number
          p_product_type: string
          p_quantity: number
          p_sku: string
          p_collection: string
          p_product_description: string
          p_status: string
          p_title: string
        }
        Returns: undefined
      }
      verify_phone_number: {
        Args: {
          p_phone_number: string
          p_verification_code: string
        }
        Returns: Json
      }
    }
    Enums: {
      product_status: "draft" | "published"
      verification_status: "pending" | "verified" | "failed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
