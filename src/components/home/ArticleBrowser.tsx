'use client'

import { Suspense, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ArrowUpDown, Eye, LayoutGrid, List, Search, Sparkles, TrendingUp, X } from 'lucide-react'
import { ArticleRow, ArticleTile, NewBadge } from '@/components/ArticleItem'
import ContinueReading from '@/components/home/ContinueReading'
import { getCategoryStyle } from '@/lib/categories'
import { formatNumber } from '@/lib/format'
import { matchesSearch } from '@/lib/search'
import { useLocalStorage } from '@/lib/useLocalStorage'
import type { ArticleSummary, Category } from '@/types'

const sortOptions = {
  default: 'Önerilen sıra',
  'title-asc': 'Başlık (A → Z)',
  'title-desc': 'Başlık (Z → A)',
  popular: 'En çok okunan',
  newest: 'En yeni',
} as const

type SortKey = keyof typeof sortOptions

type Props = {
  categories: Category[]
  articles: ArticleSummary[]
  newSince: string
}

type UrlState = {
  search: string
  category: string | null
  sort: SortKey
}

const emptyUrlState: UrlState = { search: '', category: null, sort: 'default' }

export default function ArticleBrowser(props: Props) {
  // useSearchParams yalnızca tarayıcıda çalışır. Sunucu HTML'inde (ve arama motorlarında)
  // filtresiz tam liste görünür, tarayıcıda URL'deki filtreler uygulanır.
  return (
    <Suspense fallback={<BrowserView {...props} urlState={emptyUrlState} />}>
      <BrowserWithParams {...props} />
    </Suspense>
  )
}

function BrowserWithParams(props: Props) {
  const params = useSearchParams()
  const sortParam = params.get('sort')
  const urlState: UrlState = {
    search: params.get('search') ?? '',
    category: params.get('category'),
    sort: sortParam && sortParam in sortOptions ? (sortParam as SortKey) : 'default',
  }
  return <BrowserView {...props} urlState={urlState} />
}

function BrowserView({ categories, articles, newSince, urlState }: Props & { urlState: UrlState }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [viewPref, setViewPref] = useLocalStorage('sensetorial:view')
  const view = viewPref === 'grid' ? 'grid' : 'list'

  const [query, setQuery] = useState(urlState.search)
  const [prevUrlSearch, setPrevUrlSearch] = useState(urlState.search)
  // URL dışarıdan değişirse (geri tuşu vb.) arama kutusunu güncelle
  if (urlState.search !== prevUrlSearch) {
    setPrevUrlSearch(urlState.search)
    if (urlState.search !== query.trim()) setQuery(urlState.search)
  }
  const deferredQuery = useDeferredValue(query)

  const { category: selectedCategory, sort } = urlState
  const activeCategory = categories.find(c => c.id === selectedCategory) ?? null

  const updateUrl = (changes: Partial<UrlState>) => {
    const next = { ...urlState, search: query, ...changes }
    const params = new URLSearchParams()
    if (next.search.trim()) params.set('search', next.search.trim())
    if (next.category) params.set('category', next.category)
    if (next.sort !== 'default') params.set('sort', next.sort)
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  // Arama metni URL'e 300 ms gecikmeyle yazılır; liste ise anında filtrelenir.
  const updateUrlRef = useRef(updateUrl)
  useEffect(() => {
    updateUrlRef.current = updateUrl
  })
  useEffect(() => {
    if (query.trim() === urlState.search) return
    const timer = setTimeout(() => updateUrlRef.current({ search: query }), 300)
    return () => clearTimeout(timer)
  }, [query, urlState.search])

  // "/" tuşu arama kutusuna odaklanır
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (e.key !== '/' || target.closest('input, textarea, select, dialog, [contenteditable="true"]')) return
      e.preventDefault()
      searchInputRef.current?.focus()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const counts = useMemo(() => {
    const result: Record<string, number> = {}
    for (const article of articles) result[article.category_id] = (result[article.category_id] ?? 0) + 1
    return result
  }, [articles])

  const validIds = useMemo(() => new Set(articles.map(a => a.id)), [articles])

  const visibleArticles = useMemo(() => {
    const filtered = articles.filter(
      article =>
        (!selectedCategory || article.category_id === selectedCategory) &&
        (!deferredQuery.trim() || matchesSearch(`${article.title} ${article.categories?.name ?? ''}`, deferredQuery))
    )
    const byTitle = (a: ArticleSummary, b: ArticleSummary) => a.title.localeCompare(b.title, 'tr')
    switch (sort) {
      case 'title-asc':
        return filtered.sort(byTitle)
      case 'title-desc':
        return filtered.sort((a, b) => byTitle(b, a))
      case 'popular':
        return filtered.sort((a, b) => b.views - a.views || byTitle(a, b))
      case 'newest':
        return filtered.sort((a, b) => b.created_at.localeCompare(a.created_at))
      default:
        return filtered // sunucudan "sira, title" sırasıyla gelir
    }
  }, [articles, selectedCategory, deferredQuery, sort])

  const newest = useMemo(
    () => [...articles].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 5),
    [articles]
  )
  const popular = useMemo(
    () => articles.filter(a => a.views > 0).sort((a, b) => b.views - a.views).slice(0, 5),
    [articles]
  )

  const hasFilters = Boolean(query.trim() || selectedCategory)
  const isNew = (a: ArticleSummary) => a.created_at >= newSince

  const clearFilters = () => {
    setQuery('')
    updateUrl({ search: '', category: null })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      {/* Arama */}
      <div className="relative z-10 mx-auto -mt-7 max-w-2xl">
        <label htmlFor="ana-arama" className="sr-only">Doküman ara</label>
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-fg-subtle" aria-hidden />
        <input
          id="ana-arama"
          ref={searchInputRef}
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Ne öğrenmek istiyorsunuz?"
          autoComplete="off"
          className="h-14 w-full rounded-2xl border border-line bg-surface pl-12 pr-12 text-base shadow-lg shadow-black/5 transition-shadow placeholder:text-fg-subtle focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15 dark:shadow-black/40 [&::-webkit-search-cancel-button]:hidden"
        />
        {query ? (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="Aramayı temizle"
            className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-fg-subtle hover:bg-subtle hover:text-fg"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        ) : (
          <kbd className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 rounded border border-line bg-subtle px-1.5 font-sans text-xs text-fg-subtle sm:block">
            /
          </kbd>
        )}
      </div>

      {/* Kategori etiketleri: mobilde yatay kaydırılır */}
      <nav aria-label="Kategoriler" className="mt-6">
        <ul className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0">
          <li>
            <Chip selected={!selectedCategory} onClick={() => updateUrl({ category: null })}>
              Tümü <Count>{articles.length}</Count>
            </Chip>
          </li>
          {categories.map(category => {
            const style = getCategoryStyle(category.name)
            const Icon = style.icon
            const isSelected = selectedCategory === category.id
            return (
              <li key={category.id}>
                <Chip
                  selected={isSelected}
                  title={style.description || undefined}
                  onClick={() => updateUrl({ category: isSelected ? null : category.id })}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {category.name} <Count>{counts[category.id] ?? 0}</Count>
                </Chip>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="mt-12 space-y-12">
        {!hasFilters && <ContinueReading validIds={validIds} />}

        {!hasFilters && newest.length > 0 && (
          <div className={`grid gap-4 ${popular.length > 0 ? 'lg:grid-cols-2' : ''}`}>
            <HighlightPanel title="Son eklenenler" icon={<Sparkles className="h-4 w-4" aria-hidden />}>
              {newest.map(article => (
                <HighlightLink key={article.id} article={article}>
                  {isNew(article) && <NewBadge />}
                </HighlightLink>
              ))}
            </HighlightPanel>
            {popular.length > 0 && (
              <HighlightPanel title="En çok okunanlar" icon={<TrendingUp className="h-4 w-4" aria-hidden />}>
                {popular.map((article, i) => (
                  <HighlightLink key={article.id} article={article} rank={i + 1}>
                    <span className="flex shrink-0 items-center gap-1 text-xs tabular-nums text-fg-subtle">
                      <Eye className="h-3.5 w-3.5" aria-hidden />
                      {formatNumber(article.views)}
                    </span>
                  </HighlightLink>
                ))}
              </HighlightPanel>
            )}
          </div>
        )}

        {/* Tüm dokümanlar */}
        <section id="dokumanlar" className="scroll-mt-20" aria-labelledby="dokumanlar-baslik">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="dokumanlar-baslik" className="text-xl font-semibold tracking-tight">
                {activeCategory ? activeCategory.name : 'Tüm dokümanlar'}
              </h2>
              <p className="mt-1 flex items-center gap-2 text-sm text-fg-muted" aria-live="polite">
                {visibleArticles.length} doküman
                {hasFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="inline-flex items-center gap-1 rounded-full bg-subtle px-2 py-0.5 text-xs font-medium text-fg-muted transition-colors hover:text-fg"
                  >
                    Filtreleri temizle <X className="h-3 w-3" aria-hidden />
                  </button>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <ArrowUpDown className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle" aria-hidden />
                <select
                  value={sort}
                  onChange={e => updateUrl({ sort: e.target.value as SortKey })}
                  aria-label="Sıralama"
                  className="h-9 appearance-none rounded-lg border border-line bg-surface pl-8 pr-3 text-sm shadow-xs transition-colors hover:border-line-strong focus:outline-none"
                >
                  {Object.entries(sortOptions).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <div className="flex h-9 rounded-lg border border-line bg-surface p-0.5 shadow-xs" role="group" aria-label="Görünüm">
                <ViewButton active={view === 'list'} onClick={() => setViewPref('list')} label="Liste görünümü">
                  <List className="h-4 w-4" aria-hidden />
                </ViewButton>
                <ViewButton active={view === 'grid'} onClick={() => setViewPref('grid')} label="Kart görünümü">
                  <LayoutGrid className="h-4 w-4" aria-hidden />
                </ViewButton>
              </div>
            </div>
          </div>

          {visibleArticles.length === 0 ? (
            <div className="rounded-xl border border-dashed border-line-strong px-4 py-16 text-center">
              <Search className="mx-auto mb-3 h-8 w-8 text-fg-subtle" aria-hidden />
              <p className="font-medium">
                {query.trim() ? `“${query.trim()}” için sonuç bulunamadı` : 'Bu kategoride henüz doküman yok'}
              </p>
              <p className="mt-1 text-sm text-fg-muted">Farklı bir kelime deneyin ya da filtreleri temizleyin.</p>
            </div>
          ) : view === 'list' ? (
            <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface shadow-xs">
              {visibleArticles.map(article => (
                <ArticleRow key={article.id} article={article} isNew={isNew(article)} />
              ))}
            </ul>
          ) : (
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleArticles.map(article => (
                <ArticleTile key={article.id} article={article} isNew={isNew(article)} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}

function Chip({ selected, children, ...props }: { selected: boolean; children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={`inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 text-sm font-medium transition-colors ${
        selected
          ? 'border-fg bg-fg text-canvas'
          : 'border-line bg-surface text-fg-muted shadow-xs hover:border-line-strong hover:text-fg'
      }`}
      {...props}
    >
      {children}
    </button>
  )
}

function Count({ children }: { children: React.ReactNode }) {
  return <span className="text-xs tabular-nums opacity-60">{children}</span>
}

function ViewButton({ active, onClick, label, children }: { active: boolean; onClick: () => void; label: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      title={label}
      className={`grid w-8 place-items-center rounded-md transition-colors ${active ? 'bg-subtle text-fg' : 'text-fg-subtle hover:text-fg'}`}
    >
      {children}
    </button>
  )
}

function HighlightPanel({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-line bg-surface p-2 shadow-xs">
      <h2 className="flex items-center gap-2 px-3 pb-1 pt-2 text-sm font-medium text-fg-muted">
        {icon}
        {title}
      </h2>
      <ol>{children}</ol>
    </section>
  )
}

function HighlightLink({ article, rank, children }: { article: ArticleSummary; rank?: number; children?: React.ReactNode }) {
  const style = getCategoryStyle(article.categories?.name)
  return (
    <li>
      <Link href={`/article/${article.id}`} className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-subtle">
        {rank ? (
          <span className="w-4 shrink-0 text-center text-sm font-semibold tabular-nums text-fg-subtle">{rank}</span>
        ) : (
          <span className={`h-2 w-2 shrink-0 rounded-full ${style.dot}`} aria-hidden />
        )}
        <span className="min-w-0 flex-1 truncate text-sm font-medium">{article.title}</span>
        {children}
      </Link>
    </li>
  )
}
