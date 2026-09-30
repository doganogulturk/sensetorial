import type { Database } from './supabase'

export type Article = Database['public']['Tables']['articles']['Row']
export type Category = Database['public']['Tables']['categories']['Row']

export type ArticleWithCategory = Article & {
  categories: Pick<Category, 'id' | 'name'> | null
}

/** Liste görünümleri için gereken hafif makale verisi */
export type ArticleSummary = Pick<Article, 'id' | 'title' | 'category_id' | 'views' | 'sira' | 'created_at'> & {
  categories: Pick<Category, 'id' | 'name'> | null
}
