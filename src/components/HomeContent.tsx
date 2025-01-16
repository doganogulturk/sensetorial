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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryStats, setCategoryStats] = useState<Record<string, { name: string, count: number }>>({})
  const [articles, setArticles] = useState<Article[]>([])
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('search')

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
      }
    }

    loadData()
  }, [selectedCategory, searchQuery])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        Sensetorial - Qlik Sense Eğitim Dokümanları
      </h1>

      <div className="grid gap-8">
        {/* Kategori Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <div 
              key={category.id} 
              className={`p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow relative overflow-hidden cursor-pointer
                ${selectedCategory === category.id ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => setSelectedCategory(
                selectedCategory === category.id ? null : category.id
              )}
            >
              <div 
                className={`absolute left-0 top-0 w-1 h-full ${categoryColors[category.name]}`}
              />
              <h2 className="text-xl font-semibold mb-2">{category.name}</h2>
              <p className="text-gray-600 mb-4">{descriptions[category.name]}</p>
              <div className="text-sm text-gray-500">
                {categoryStats[category.id]?.count || 0} doküman
              </div>
            </div>
          ))}
        </div>

        {/* Makale Listesi */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            Makaleler
            {selectedCategory && categories.find(c => c.id === selectedCategory) && 
              ` - ${categories.find(c => c.id === selectedCategory)?.name}`
            }
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {articles.map((article) => (
              <Link 
                key={article.id}
                href={`/article/${article.id}`}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow relative cursor-pointer"
              >
                <div 
                  className={`absolute left-0 top-0 w-1 h-full ${categoryColors[article.categories.name]}`}
                />
                <div className="pl-3">
                  <h3 className="text-lg font-medium">{article.title}</h3>
                </div>
              </Link>
            ))}
            {articles.length === 0 && (
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