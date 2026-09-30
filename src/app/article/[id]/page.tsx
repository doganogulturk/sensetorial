import { cache } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ArticleView from './components/ArticleView'
import { getArticleById, getArticlesByCategory } from '@/lib/supabase'
import { siteName } from '@/lib/site'

export const revalidate = 300

// Makaleler ilk ziyarette oluşturulup önbelleğe alınır (build sırasında değil)
export async function generateStaticParams() {
  return []
}

type Props = { params: Promise<{ id: string }> }

// generateMetadata ve sayfa aynı makaleyi tek sorguyla paylaşır
const loadArticle = cache(getArticleById)

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const article = await loadArticle(id)
  if (!article) return { title: 'Makale bulunamadı' }

  const description = article.categories
    ? `${article.title} — ${siteName} ${article.categories.name} kategorisindeki Qlik Sense eğitim dokümanı.`
    : `${article.title} — ${siteName} Qlik Sense eğitim dokümanı.`

  return {
    title: article.title,
    description,
    alternates: { canonical: `/article/${article.id}` },
    openGraph: { title: article.title, description, type: 'article' },
  }
}

export default async function Page({ params }: Props) {
  const { id } = await params
  const article = await loadArticle(id)
  if (!article) notFound()

  const siblings = await getArticlesByCategory(article.category_id)
  const index = siblings.findIndex(a => a.id === article.id)

  return (
    <ArticleView
      article={article}
      related={siblings.filter(a => a.id !== article.id)}
      previous={index > 0 ? siblings[index - 1] : null}
      next={index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : null}
    />
  )
}
