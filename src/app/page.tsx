import ArticleBrowser from '@/components/home/ArticleBrowser'
import { getArticleSummaries, getCategories } from '@/lib/supabase'

// Sayfa en fazla 5 dakikada bir yeniden oluşturulur (ISR)
export const revalidate = 300

export default async function Home() {
  const [categories, articles] = await Promise.all([getCategories(), getArticleSummaries()])

  const counts: Record<string, number> = {}
  for (const article of articles) {
    counts[article.category_id] = (counts[article.category_id] ?? 0) + 1
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <section className="mb-10 text-center sm:mb-14">
        <h1 className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent dark:from-blue-400 dark:to-purple-400 sm:text-6xl">
          Sensetorial
        </h1>
        <p className="mb-8 text-lg text-gray-600 dark:text-gray-300 sm:text-2xl">
          Qlik Sense Eğitim Dokümanları
        </p>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
          <Stat icon="📚" value={articles.length} label="Doküman" tone="blue" />
          <Stat icon="🗂️" value={categories.length} label="Kategori" tone="purple" />
        </div>
      </section>

      <ArticleBrowser categories={categories} articles={articles} counts={counts} />
    </div>
  )
}

function Stat({ icon, value, label, tone }: { icon: string; value: number; label: string; tone: 'blue' | 'purple' }) {
  const tones = {
    blue: 'border-blue-200 from-blue-50 to-blue-100 text-blue-600 dark:border-blue-500/30 dark:from-blue-500/10 dark:to-blue-500/5 dark:text-blue-400',
    purple: 'border-purple-200 from-purple-50 to-purple-100 text-purple-600 dark:border-purple-500/30 dark:from-purple-500/10 dark:to-purple-500/5 dark:text-purple-400',
  }
  return (
    <div className={`flex items-center gap-3 rounded-full border bg-gradient-to-r px-6 py-3 ${tones[tone]}`}>
      <span className="text-3xl" aria-hidden>{icon}</span>
      <div className="text-left">
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
      </div>
    </div>
  )
}
