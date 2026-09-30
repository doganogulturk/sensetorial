import Link from 'next/link'
import { ChevronRight, Eye } from 'lucide-react'
import { getCategoryStyle } from '@/lib/categories'
import { features } from '@/lib/site'
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
        {features.showViewCounts && article.views > 0 && (
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

/** Kart görünümü: başlık üstte, kategori simgesi sağ altta silik arka plan olarak */
export function ArticleTile({ article, isNew }: Props) {
  const style = getCategoryStyle(article.categories?.name)
  const Icon = style.icon
  return (
    <li>
      <Link
        href={`/article/${article.id}`}
        className="group relative flex h-full min-h-32 flex-col overflow-hidden rounded-xl border border-line bg-surface p-3.5 shadow-xs sm:min-h-36 sm:p-4 transition-all hover:border-line-strong hover:shadow-md"
      >
        <Icon
          className={`pointer-events-none absolute -bottom-4 -right-4 h-20 w-20 sm:-bottom-5 sm:-right-5 sm:h-28 sm:w-28 opacity-[0.08] transition-all duration-300 group-hover:-rotate-6 group-hover:scale-105 group-hover:opacity-[0.14] dark:opacity-[0.12] dark:group-hover:opacity-[0.2] ${style.text}`}
          strokeWidth={1.5}
          aria-hidden
        />
        <div className="relative flex items-start justify-between gap-2">
          <h3 className="line-clamp-3 text-sm font-medium leading-snug sm:text-base">{article.title}</h3>
          {isNew && <NewBadge />}
        </div>
        <div className="relative mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-5 text-xs text-fg-subtle">
          {article.categories && (
            <span className="flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} aria-hidden />
              {article.categories.name}
            </span>
          )}
          {features.showViewCounts && article.views > 0 && (
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
