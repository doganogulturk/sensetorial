import Link from 'next/link'
import { ChevronRight, Eye } from 'lucide-react'
import { getCategoryStyle } from '@/lib/categories'
import { formatNumber } from '@/lib/format'
import type { ArticleSummary } from '@/types'

type Props = { article: ArticleSummary; isNew: boolean }

export function NewBadge() {
  return (
    <span className="shrink-0 rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-semibold text-accent-soft-fg">
      Yeni
    </span>
  )
}

function CategoryBadge({ name }: { name: string }) {
  const style = getCategoryStyle(name)
  return <span className={`shrink-0 rounded-md px-1.5 py-0.5 text-xs font-medium ${style.soft}`}>{name}</span>
}

/** Liste görünümü: taranması kolay, yoğun satır */
export function ArticleRow({ article, isNew }: Props) {
  const style = getCategoryStyle(article.categories?.name)
  const Icon = style.icon
  return (
    <li>
      <Link
        href={`/article/${article.id}`}
        className="group flex items-center gap-3 px-3 py-3 transition-colors hover:bg-subtle sm:gap-4 sm:px-4"
      >
        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${style.soft}`}>
          <Icon className="h-[18px] w-[18px]" aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="truncate font-medium">{article.title}</span>
            {isNew && <NewBadge />}
          </span>
          {article.categories && (
            <span className="mt-0.5 block text-xs text-fg-subtle sm:hidden">{article.categories.name}</span>
          )}
        </span>
        {article.categories && (
          <span className="hidden sm:block">
            <CategoryBadge name={article.categories.name} />
          </span>
        )}
        {article.views > 0 && (
          <span className="hidden w-16 shrink-0 items-center justify-end gap-1 text-xs tabular-nums text-fg-subtle md:flex">
            <Eye className="h-3.5 w-3.5" aria-hidden />
            {formatNumber(article.views)}
          </span>
        )}
        <ChevronRight className="h-4 w-4 shrink-0 text-fg-subtle transition-transform group-hover:translate-x-0.5" aria-hidden />
      </Link>
    </li>
  )
}

/** Kart görünümü */
export function ArticleTile({ article, isNew }: Props) {
  const style = getCategoryStyle(article.categories?.name)
  const Icon = style.icon
  return (
    <li>
      <Link
        href={`/article/${article.id}`}
        className="group flex h-full flex-col rounded-xl border border-line bg-surface p-4 shadow-xs transition-all hover:border-line-strong hover:shadow-md"
      >
        <div className="mb-4 flex items-start justify-between gap-2">
          <span className={`grid h-9 w-9 place-items-center rounded-lg ${style.soft}`}>
            <Icon className="h-[18px] w-[18px]" aria-hidden />
          </span>
          {isNew && <NewBadge />}
        </div>
        <h3 className="mb-4 line-clamp-2 font-medium leading-snug">{article.title}</h3>
        <div className="mt-auto flex items-center justify-between gap-2 text-xs text-fg-subtle">
          <span>{article.categories?.name}</span>
          {article.views > 0 && (
            <span className="flex items-center gap-1 tabular-nums">
              <Eye className="h-3.5 w-3.5" aria-hidden />
              {formatNumber(article.views)}
            </span>
          )}
        </div>
      </Link>
    </li>
  )
}
