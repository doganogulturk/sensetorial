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
        Relationships: [
          {
            foreignKeyName: 'articles_category_id_fkey'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'categories'
            referencedColumns: ['id']
          },
        ]
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
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      increment_article_views: {
        Args: { article_id: string }
        Returns: undefined
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
