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
          .order('title', { ascending: true })

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
      {/* Breadcrumb Navigation */}
      <nav className="mb-6 text-sm">
        <ol className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <li>
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Ana Sayfa
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link
              href={`/?category=${article.category_id}`}
              className={`px-2 py-1 rounded text-xs ${categoryColors[article.categories?.name]} bg-opacity-10 hover:bg-opacity-20 transition-colors cursor-pointer`}
            >
              {article.categories?.name}
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-900 dark:text-gray-100 font-medium truncate max-w-md">
            {article.title}
          </li>
        </ol>
      </nav>

      {/* Ana içerik - PDF */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-6">
          <h1 className="text-3xl font-bold dark:text-gray-100">{article.title}</h1>
          <div
            className={`w-2 h-2 rounded-full ${
              categoryColors[article.categories?.name]
            }`}
          />
        </div>

        <iframe
          src={`${article.pdf_url}#view=FitH`}
          className="w-full h-screen rounded-lg border dark:border-gray-700 shadow-lg"
          title={article.title}
        />
      </div>

      {/* Alt kısım - İlgili makaleler */}
      <div>
        <h2 className="text-2xl font-semibold mb-6 dark:text-gray-100">
          {article.categories?.name} Kategorisindeki Diğer Makaleler
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {relatedArticles.map(relatedArticle => (
            <Link
              key={relatedArticle.id}
              href={`/article/${relatedArticle.id}`}
              className="group p-4 border dark:border-gray-700 rounded-xl hover:shadow-xl transition-all duration-300 relative cursor-pointer bg-white dark:bg-gray-800 hover:scale-105 hover:border-blue-300 dark:hover:border-blue-600"
            >
              <div
                className={`absolute left-0 top-0 w-1.5 h-full rounded-l-xl transition-all group-hover:w-2 ${
                  categoryColors[relatedArticle.categories?.name]
                }`}
              />
              <div className="pl-3">
                <div className="flex items-start gap-2">
                  <span className="text-xl">📄</span>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400 transition-colors leading-snug line-clamp-2">
                      {relatedArticle.title}
                    </h3>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {!isLoading && relatedArticles.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            Bu kategoride başka makale bulunmuyor.
          </p>
        )}
      </div>
    </div>
  )
}