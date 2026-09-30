import ArticleBrowser from '@/components/home/ArticleBrowser'
import { getNewSince } from '@/lib/format'
import { getArticleSummaries, getCategories } from '@/lib/supabase'

// Sayfa en fazla 5 dakikada bir yeniden oluşturulur (ISR)
export const revalidate = 300

export default async function Home() {
  const [categories, articles] = await Promise.all([getCategories(), getArticleSummaries()])

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        {/* Hafif ızgara deseni */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--line)_1px,transparent_1px),linear-gradient(to_bottom,var(--line)_1px,transparent_1px)] bg-[size:48px_48px] opacity-40 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]"
        />
        <div className="relative mx-auto max-w-3xl px-4 pb-10 pt-12 text-center sm:px-6 sm:pb-14 sm:pt-20">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-fg-muted shadow-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
            {articles.length} doküman · {categories.length} kategori
          </p>
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Qlik Sense’i adım adım öğrenin
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-base text-fg-muted sm:text-lg">
            Fonksiyonlar, temel konular, uygulamalı rehberler ve görselleştirmeler için Türkçe eğitim dokümanları.
          </p>
        </div>
      </section>

      <ArticleBrowser categories={categories} articles={articles} newSince={getNewSince()} />
    </>
  )
}
