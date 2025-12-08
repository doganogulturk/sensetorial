'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { getArticles, getCategories, getCategoryStats } from '@/lib/supabase'

// Kategori renkleri tanımlaması
const categoryColors: Record<string, string> = {
  'Fonksiyonlar': 'bg-blue-500',
  'Konular': 'bg-emerald-500',
  'Nasıl Yapılır': 'bg-amber-500',
  'Görseller': 'bg-purple-500'
}

const categoryGradients: Record<string, string> = {
  'Fonksiyonlar': 'from-blue-50 to-blue-100',
  'Konular': 'from-emerald-50 to-emerald-100',
  'Nasıl Yapılır': 'from-amber-50 to-amber-100',
  'Görseller': 'from-purple-50 to-purple-100'
}

const categoryIcons: Record<string, string> = {
  'Fonksiyonlar': '⚡',
  'Konular': '📚',
  'Nasıl Yapılır': '🎯',
  'Görseller': '📊'
}

const descriptions: Record<string, string> = {
  'Fonksiyonlar': 'Qlik Sense fonksiyonları hakkında detaylı bilgiler ve kullanım örnekleri',
  'Konular': 'Temel kavramlar ve önemli konular hakkında açıklamalar',
  'Nasıl Yapılır': 'Adım adım rehberler ve çözüm yöntemleri',
  'Görseller': 'Görselleştirme türleri ve kullanım örnekleri'
}

type Category = {
  id: string;
  name: string;
}

type Article = {
  id: string;
  title: string;
  categories: {
    id: string;
    name: string;
  }
}

export default function HomeContent() {
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('search')
  const categoryParam = searchParams.get('category')

  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam)
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryStats, setCategoryStats] = useState<Record<string, { name: string, count: number }>>({})
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  // Verileri yükleme
  useEffect(() => {
    async function loadData() {
      try {
        // Kategorileri yükle
        const categoriesData = await getCategories()
        setCategories(categoriesData)

        // Kategori istatistiklerini yükle
        const stats = await getCategoryStats()
        setCategoryStats(stats)

        // Makaleleri yükle
        const articlesData = await getArticles(selectedCategory)
        
        // Arama filtresi uygula
        const filteredArticles = searchQuery
          ? articlesData.filter(article =>
              article.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
          : articlesData

        setArticles(filteredArticles)
      } catch (error) {
        console.error('Error loading data:', error)
        // Hata detaylarını göster
        if (error instanceof Error) {
          console.error('Error message:', error.message)
          console.error('Error stack:', error.stack)
        }
        console.error('Full error object:', JSON.stringify(error, null, 2))
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [selectedCategory, searchQuery])

  // Makaleleri sırala
  const sortedArticles = [...articles].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.title.localeCompare(b.title, 'tr')
    } else {
      return b.title.localeCompare(a.title, 'tr')
    }
  })

  return (
    <div className="container mx-auto px-4 py-8 dark:bg-gray-900 transition-colors">
      {/* Hero Section */}
      <div className="mb-16 text-center">
        <div className="relative">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Sensetorial
          </h1>
          <p className="text-2xl text-gray-600 dark:text-gray-300 mb-8">
            Qlik Sense Eğitim Dokümanları
          </p>
          {!isLoading && (
            <div className="flex justify-center gap-8 text-lg">
              <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-full border border-blue-200 dark:border-blue-700">
                <span className="text-3xl">📚</span>
                <div className="text-left">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {Object.values(categoryStats).reduce((acc, curr) => acc + curr.count, 0)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Doküman</div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-full border border-purple-200 dark:border-purple-700">
                <span className="text-3xl">🗂️</span>
                <div className="text-left">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {categories.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Kategori</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-8">

        {/* Kategori Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? (
            // Skeleton Loading
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-6 border rounded-xl shadow-sm bg-gradient-to-br from-gray-50 to-gray-100 animate-pulse">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 bg-gray-300 rounded"></div>
                  <div className="flex-1">
                    <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-3 bg-gray-300 rounded"></div>
                  <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                </div>
                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
              </div>
            ))
          ) : (
            categories.map((category) => (
            <div
              key={category.id}
              className={`group p-6 border rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden cursor-pointer bg-gradient-to-br ${categoryGradients[category.name]}
                ${selectedCategory === category.id ? 'ring-2 ring-blue-500 scale-105' : 'hover:scale-105'}`}
              onClick={() => setSelectedCategory(
                selectedCategory === category.id ? null : category.id
              )}
            >
              <div
                className={`absolute left-0 top-0 w-1.5 h-full ${categoryColors[category.name]} group-hover:w-2 transition-all`}
              />
              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl">{categoryIcons[category.name]}</span>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-1 group-hover:text-blue-600 transition-colors">{category.name}</h2>
                </div>
              </div>
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">{descriptions[category.name]}</p>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-700">
                  {categoryStats[category.id]?.count || 0} doküman
                </div>
                <div className="text-xs text-gray-400 group-hover:text-blue-500 transition-colors">
                  Görüntüle →
                </div>
              </div>
            </div>
          ))
          )}
        </div>

        {/* Makale Listesi */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">
              Makaleler
              {selectedCategory && categories.find(c => c.id === selectedCategory) &&
                ` - ${categories.find(c => c.id === selectedCategory)?.name}`
              }
            </h2>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border border-blue-200 dark:border-blue-700 hover:shadow-md transition-all"
              aria-label="Sıralamayı değiştir"
            >
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {sortOrder === 'asc' ? 'A → Z' : 'Z → A'}
              </span>
              <span className="text-lg">
                {sortOrder === 'asc' ? '↓' : '↑'}
              </span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {isLoading ? (
              // Skeleton Loading for Articles
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="p-4 border rounded-xl shadow-sm bg-white animate-pulse">
                  <div className="flex items-start gap-2 mb-2">
                    <div className="w-6 h-6 bg-gray-300 rounded"></div>
                    <div className="flex-1">
                      <div className="h-3 bg-gray-300 rounded mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                    </div>
                  </div>
                  <div className="flex items-center mt-2 pt-2 border-t border-gray-100">
                    <div className="h-5 bg-gray-300 rounded w-20"></div>
                  </div>
                </div>
              ))
            ) : (
              sortedArticles.map((article) => (
              <Link
                key={article.id}
                href={`/article/${article.id}`}
                className="group p-4 border dark:border-gray-700 rounded-xl hover:shadow-xl transition-all duration-300 relative cursor-pointer bg-white dark:bg-gray-800 hover:scale-105 hover:border-blue-300 dark:hover:border-blue-600"
              >
                <div
                  className={`absolute left-0 top-0 w-1.5 h-full rounded-l-xl ${categoryColors[article.categories.name]} group-hover:w-2 transition-all`}
                />
                <div className="pl-3">
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-xl">📄</span>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400 transition-colors leading-snug line-clamp-2">
                        {article.title}
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                    <span className={`text-xs px-2 py-1 rounded-full ${categoryColors[article.categories.name]} bg-opacity-10 text-gray-700 dark:text-gray-300 font-medium`}>
                      {article.categories.name}
                    </span>
                  </div>
                </div>
              </Link>
            ))
            )}
            {!isLoading && sortedArticles.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                {searchQuery 
                  ? 'Arama kriterlerine uygun makale bulunamadı.' 
                  : 'Bu kategoride henüz makale bulunmuyor.'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}