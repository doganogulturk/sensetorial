'use client'

import React from 'react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Article, CategoryColorType } from '@/types'

const categoryColors: CategoryColorType = {
  'Fonksiyonlar': 'bg-blue-500',
  'Konular': 'bg-emerald-500',
  'Nasıl Yapılır': 'bg-amber-500',
  'Görseller': 'bg-purple-500'
}

type ArticleWithCategory = Article & {
  categories: {
    name: keyof CategoryColorType
  }
}

interface ArticleViewProps {
  article: ArticleWithCategory
}

export default function ArticleView({ article }: ArticleViewProps) {
  const [relatedArticles, setRelatedArticles] = useState<ArticleWithCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadRelatedArticles() {
      try {
        const { data } = await supabase
          .from('articles')
          .select(`
            id,
            title,
            categories (
              name
            )
          `)
          .eq('category_id', article.category_id)
          .neq('id', article.id)
          .order('sira', { ascending: true })
          .limit(5)

        setRelatedArticles(data as unknown as ArticleWithCategory[] || [])
      } catch (error) {
        console.error('Error loading related articles:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadRelatedArticles()
  }, [article.id, article.category_id])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Ana içerik - PDF */}
        <div className="lg:w-3/4">
          <div className="flex items-center gap-2 mb-6">
            <h1 className="text-3xl font-bold">{article.title}</h1>
            <div 
              className={`w-2 h-2 rounded-full ${
                categoryColors[article.categories?.name]
              }`}
            />
          </div>
          
          <iframe
            src={article.pdf_url}
            className="w-full h-screen rounded-lg border shadow-lg"
            title={article.title}
          />
        </div>

        {/* Sağ sidebar - İlgili makaleler */}
        <div className="lg:w-1/4">
          <h2 className="text-xl font-semibold mb-4">
            Bu Kategorideki Diğer Makaleler
          </h2>
          
          <div className="space-y-3">
            {relatedArticles.map(relatedArticle => (
              <Link
                key={relatedArticle.id}
                href={`/article/${relatedArticle.id}`}
                className="group block p-3 border rounded-lg hover:shadow-md transition-all relative bg-white"
              >
                <div 
                  className={`absolute left-0 top-0 w-1 h-full rounded-l-lg transition-all group-hover:w-1.5 ${
                    categoryColors[relatedArticle.categories?.name]
                  }`}
                />
                <div className="pl-3">
                  <h3 className="font-medium group-hover:text-blue-600 transition-colors">
                    {relatedArticle.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          {!isLoading && relatedArticles.length === 0 && (
            <p className="text-gray-500 text-sm">
              Bu kategoride başka makale bulunmuyor.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}