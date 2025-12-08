// Article tipi
export interface Article {
  id: string
  title: string
  pdf_url: string
  created_at: string
  views: number
  category_id: string
  sira: number
}

// Kategori tipi
export interface Category {
  id: string
  name: string
  created_at: string
}

// Birleştirilmiş article tipi
export type ArticleWithCategory = Article & {
  categories: {
    id: string
    name: keyof CategoryColorType
  }
}

// Kategori renkleri
export const categoryColors = {
  'Fonksiyonlar': 'bg-blue-500',
  'Konular': 'bg-emerald-500',
  'Nasıl Yapılır': 'bg-amber-500',
  'Görseller': 'bg-purple-500'
} as const

export type CategoryColorType = typeof categoryColors