import type { MetadataRoute } from 'next'
import { getArticleSummaries } from '@/lib/supabase'
import { siteUrl } from '@/lib/site'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Site adresi tanımlı değilse mutlak URL üretilemez
  if (!siteUrl) return []

  const articles = await getArticleSummaries()
  return [
    { url: siteUrl, changeFrequency: 'weekly', priority: 1 },
    ...articles.map(article => ({
      url: `${siteUrl}/article/${article.id}`,
      lastModified: article.created_at,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}
