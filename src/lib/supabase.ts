import { cache } from 'react'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'
import type { ArticleSummary, ArticleWithCategory, Category } from '@/types'

let client: SupabaseClient<Database> | null = null

// İstemci ilk kullanımda oluşturulur; böylece env eksikse hata import anında değil,
// veriye erişilmeye çalışıldığında ve anlaşılır bir mesajla alınır.
export function getSupabase() {
  if (client) return client

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url) throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
  if (!anonKey) throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')

  client = createClient<Database>(url, anonKey, {
    auth: { persistSession: false },
  })
  return client
}

const summaryColumns = 'id, title, category_id, views, sira, created_at, categories ( id, name )'

export const getArticleSummaries = cache(async (): Promise<ArticleSummary[]> => {
  const { data, error } = await getSupabase()
    .from('articles')
    .select(summaryColumns)
    .order('sira', { ascending: true })
    .order('title', { ascending: true })

  if (error) throw error
  return data
})

export async function getArticleById(id: string): Promise<ArticleWithCategory | null> {
  const { data, error } = await getSupabase()
    .from('articles')
    .select('*, categories ( id, name )')
    .eq('id', id)
    .maybeSingle()

  // Geçersiz UUID formatı (22P02) "bulunamadı" olarak ele alınır
  if (error?.code === '22P02') return null
  if (error) throw error
  return data
}

export const getCategories = cache(async (): Promise<Category[]> => {
  const { data, error } = await getSupabase()
    .from('categories')
    .select('*')
    .order('name')

  if (error) throw error
  return data
})

export async function incrementArticleViews(articleId: string) {
  const { error } = await getSupabase().rpc('increment_article_views', { article_id: articleId })
  if (error) throw error
}
