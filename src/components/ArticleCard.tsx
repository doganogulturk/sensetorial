import Link from 'next/link'
import { getCategoryStyle } from '@/lib/categories'
import type { ArticleSummary } from '@/types'

export default function ArticleCard({ article }: { article: ArticleSummary }) {
  const style = getCategoryStyle(article.categories?.name)

  return (
    <Link
      href={`/article/${article.id}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white p-4 pl-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-500/60"
    >
      <span className={`absolute inset-y-0 left-0 w-1.5 transition-all group-hover:w-2 ${style.accent}`} aria-hidden />
      <div className="mb-3 flex items-start gap-2">
        <span className="text-xl" aria-hidden>📄</span>
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
          {article.title}
        </h3>
      </div>
      <div className="mt-auto flex items-center justify-between gap-2 border-t border-gray-100 pt-2 dark:border-gray-800">
        {article.categories && (
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${style.badge}`}>
            {article.categories.name}
          </span>
        )}
        {article.views > 0 && (
          <span className="text-xs text-gray-500 dark:text-gray-400" title="Görüntülenme">
            👁 {article.views.toLocaleString('tr-TR')}
          </span>
        )}
      </div>
    </Link>
  )
}
