import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Helper fonksiyonlar
export async function getArticles(categoryId?: string | null) {
  let query = supabase
    .from('articles')
    .select(`
      *,
      categories (
        id,
        name
      )
    `)
    .order('sira', { ascending: true })
  
  if (categoryId) {
    query = query.eq('category_id', categoryId)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function getArticleById(id: string) {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      categories (
        id,
        name
      )
    `)
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')
  
  if (error) throw error
  return data
}

export async function getCategoryStats() {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      category_id,
      categories!inner(
        id,
        name
      )
    `)
  
  if (error) throw error

  type StatItem = {
    category_id: string;
    categories: {
      id: string;
      name: string;
    };
  }

  const stats = (data as unknown as StatItem[]).reduce((acc: Record<string, { name: string, count: number }>, curr) => {
    const categoryId = curr.category_id
    if (!acc[categoryId]) {
      acc[categoryId] = {
        name: curr.categories.name,
        count: 0
      }
    }
    acc[categoryId].count++
    return acc
  }, {})

  return stats
}