import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { use } from 'react'
import ArticleView from './components/ArticleView'
import { getArticleById } from '@/lib/supabase'

interface PageProps {
  params: Promise<{ id: string }>
}

// Server component için async metadata generator
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  
  try {
    const article = await getArticleById(id)
    
    if (!article) {
      return {
        title: 'Makale Bulunamadı'
      }
    }

    return {
      title: `${article.title} | Sensetorial`,
      description: `Qlik Sense eğitim dokümanı: ${article.title}`
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Hata',
      description: 'Makale yüklenirken bir hata oluştu'
    }
  }
}

// Ana sayfa componenti
export default function Page({ params }: PageProps) {
  // params'ı Promise'dan çözümlüyoruz
  const { id } = use(params)
  
  // Article'ı yüklüyoruz
  const article = use(getArticleById(id))

  if (!article) {
    notFound()
  }

  return <ArticleView article={article} />
}