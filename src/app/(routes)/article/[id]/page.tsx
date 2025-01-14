'use client'

//import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const categoryColors: Record<string, string> = {
  'Fonksiyonlar': 'bg-blue-500',
  'Konular': 'bg-emerald-500',
  'Nasıl Yapılır': 'bg-amber-500',
  'Görseller': 'bg-purple-500'
}

export default function ArticlePage() {
  const params = useParams()
  const articleId = params.id as string
  
  const [article, setArticle] = useState<any>(null)
  const [relatedArticles, setRelatedArticles] = useState<any[]>([])
  //const supabase = createClientComponentClient()

  useEffect(() => {
    const loadArticle = async () => {
      const { data: articleData } = await supabase
        .from('articles')
        .select(`
          *,
          categories (
            id,
            name
          )
        `)
        .eq('id', articleId)
        .single()

      setArticle(articleData)

      if (articleData) {
        const { data: relatedData } = await supabase
          .from('articles')
          .select(`
            id,
            title,
            categories (
              name
            )
          `)
          .eq('category_id', articleData.categories.id)
          .neq('id', articleId)
          .order('sira', { ascending: true })

        setRelatedArticles(relatedData || [])
      }
    }

    loadArticle()
  }, [articleId])

  if (!article) return <div>Yükleniyor...</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Ana içerik - PDF */}
        <div className="lg:w-3/4">
          <h1 className="text-3xl font-bold mb-6">{article.title}</h1>
          <iframe
            src={article.pdf_url}
            className="w-full h-screen rounded-lg border"
          />
        </div>

        {/* Sağ sidebar - Diğer makaleler */}
        <div className="lg:w-1/4">
          <h2 className="text-xl font-semibold mb-4">Bu Kategorideki Diğer Makaleler</h2>
          <div className="space-y-3">
            {relatedArticles.map(relatedArticle => (
              <Link
                key={relatedArticle.id}
                href={`/article/${relatedArticle.id}`}
                className="block p-3 border rounded-lg hover:shadow-md transition-shadow relative"
              >
                <div 
                  className={`absolute left-0 top-0 w-1 h-full rounded-l-lg ${categoryColors[relatedArticle.categories.name]}`}
                />
                <div className="pl-3">
                  <h3 className="font-medium">{relatedArticle.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}