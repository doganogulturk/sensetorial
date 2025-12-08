'use client'

import React from 'react'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { notFound } from 'next/navigation'
import ArticleView from './components/ArticleView'
import { getArticleById } from '@/lib/supabase'
import Loading from '@/components/Loading'

type ArticleWithCategory = {
  id: string
  title: string
  pdf_url: string
  created_at: string
  views: number
  category_id: string
  sira: number
  categories: {
    id: string
    name: 'Fonksiyonlar' | 'Konular' | 'Nasıl Yapılır' | 'Görseller'
  }
}

export default function Page() {
  const params = useParams()
  const id = params.id as string
  const [article, setArticle] = useState<ArticleWithCategory | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function loadArticle() {
      try {
        const data = await getArticleById(id)
        if (!data) {
          setError(true)
        } else {
          setArticle(data as ArticleWithCategory)
        }
      } catch (err) {
        console.error('Error loading article:', err)
        setError(true)
      } finally {
        setIsLoading(false)
      }
    }

    loadArticle()
  }, [id])

  if (isLoading) {
    return <Loading />
  }

  if (error || !article) {
    notFound()
  }

  return <ArticleView article={article} />
}