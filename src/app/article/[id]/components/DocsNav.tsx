import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { getCategoryStyle } from '@/lib/categories'
import type { ArticleSummary, Category } from '@/types'

type Props = { categories: Category[]; articles: ArticleSummary[]; currentId: string }

/** Tüm dokümanların kategorilere göre gruplu ağacı; açık olan kategori mevcut dokümanınki. */
export default function DocsNav({ categories, articles, currentId }: Props) {
  const current = articles.find(a => a.id === currentId)

  return (
    <nav aria-label="Dokümanlar" className="space-y-1 text-sm">
      {categories.map(category => {
        const items = articles.filter(a => a.category_id === category.id)
        if (items.length === 0) return null
        const style = getCategoryStyle(category.name)
        const Icon = style.icon
        return (
          <details key={category.id} open={current?.category_id === category.id} className="group">
            <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg px-2 py-2 font-medium text-fg transition-colors hover:bg-subtle [&::-webkit-details-marker]:hidden">
              <span className={`grid h-6 w-6 place-items-center rounded-md ${style.soft}`}>
                <Icon className="h-3.5 w-3.5" aria-hidden />
              </span>
              <span className="flex-1">{category.name}</span>
              <span className="text-xs tabular-nums text-fg-subtle">{items.length}</span>
              <ChevronRight className="h-4 w-4 text-fg-subtle transition-transform group-open:rotate-90" aria-hidden />
            </summary>
            <ul className="mb-2 ml-5 mt-1 space-y-0.5 border-l border-line pl-3">
              {items.map(item => {
                const isCurrent = item.id === currentId
                return (
                  <li key={item.id}>
                    <Link
                      href={`/article/${item.id}`}
                      aria-current={isCurrent ? 'page' : undefined}
                      className={`-ml-[13px] block border-l-2 py-1.5 pl-3 pr-2 leading-snug transition-colors ${
                        isCurrent
                          ? 'border-accent font-medium text-accent'
                          : 'border-transparent text-fg-muted hover:border-line-strong hover:text-fg'
                      }`}
                    >
                      {item.title}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </details>
        )
      })}
    </nav>
  )
}
