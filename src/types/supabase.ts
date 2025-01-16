// src/types/supabase.ts
export type Database = {
    public: {
      Tables: {
        articles: {
          Row: {
            id: string
            title: string
            pdf_url: string
            created_at: string
            views: number
            category_id: string
            sira: number
          }
          Insert: {
            id?: string
            title: string
            pdf_url: string
            created_at?: string
            views?: number
            category_id: string
            sira?: number
          }
          Update: {
            id?: string
            title?: string
            pdf_url?: string
            created_at?: string
            views?: number
            category_id?: string
            sira?: number
          }
        }
        categories: {
          Row: {
            id: string
            name: string
            created_at: string
          }
          Insert: {
            id?: string
            name: string
            created_at?: string
          }
          Update: {
            id?: string
            name?: string
            created_at?: string
          }
        }
      }
    }
  }