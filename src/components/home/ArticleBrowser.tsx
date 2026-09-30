'use client'

import { Suspense, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import ArticleCard from '@/components/ArticleCard'
import { getCategoryStyle } from '@/lib/categories'
import { matchesSearch } from '@/lib/search'
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
  counts: Record<string, number>
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

function BrowserView({ categories, articles, counts, urlState }: Props & { urlState: UrlState }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchInputRef = useRef<HTMLInputElement>(null)

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
      if (e.key !== '/' || target.closest('input, textarea, select, [contenteditable="true"]')) return
      e.preventDefault()
      searchInputRef.current?.focus()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const visibleArticles = useMemo(() => {
    const filtered = articles.filter(
      article =>
        (!selectedCategory || article.category_id === selectedCategory) &&
        (!deferredQuery.trim() || matchesSearch(article.title, deferredQuery))
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

  const hasFilters = Boolean(query.trim() || selectedCategory)

  return (
    <div className="grid gap-10">
      {/* Kategori kartları */}
      <section aria-label="Kategoriler" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {categories.map(category => {
          const style = getCategoryStyle(category.name)
          const isSelected = selectedCategory === category.id
          return (
            <button
              key={category.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => updateUrl({ category: isSelected ? null : category.id })}
              className={`group relative overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br p-4 pl-5 text-left sm:p-6 sm:pl-7 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-gray-800 ${style.card} ${isSelected ? `ring-2 ${style.ring}` : ''}`}
            >
              <span className={`absolute inset-y-0 left-0 w-1.5 transition-all group-hover:w-2 ${style.accent}`} aria-hidden />
              <div className="mb-2 flex items-center gap-2 sm:mb-3 sm:gap-3">
                <span className="text-2xl sm:text-3xl" aria-hidden>{style.icon}</span>
                <h2 className="text-base font-semibold sm:text-xl">{category.name}</h2>
              </div>
              {style.description && (
                <p className="mb-4 hidden text-sm leading-relaxed text-gray-600 sm:block dark:text-gray-300">{style.description}</p>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700 dark:text-gray-200">{counts[category.id] ?? 0} doküman</span>
                <span className="hidden text-xs text-gray-500 transition-colors group-hover:text-blue-600 sm:inline dark:text-gray-400 dark:group-hover:text-blue-400">
                  {isSelected ? 'Filtreyi kaldır ✕' : 'Görüntüle →'}
                </span>
              </div>
            </button>
          )
        })}
      </section>

      {/* Makale listesi */}
      <section id="makaleler" className="scroll-mt-24" aria-labelledby="makaleler-baslik">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 id="makaleler-baslik" className="text-2xl font-semibold">
            Makaleler
            {activeCategory && <span className="text-gray-500 dark:text-gray-400"> · {activeCategory.name}</span>}
          </h2>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden>🔍</span>
              <input
                ref={searchInputRef}
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Makale ara…  ( / )"
                aria-label="Makale ara"
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 sm:w-72"
              />
            </div>
            <select
              value={sort}
              onChange={e => updateUrl({ sort: e.target.value as SortKey })}
              aria-label="Sıralama"
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900"
            >
              {Object.entries(sortOptions).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4 flex min-h-6 flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400" aria-live="polite">
          <span>{visibleArticles.length} makale</span>
          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                setQuery('')
                updateUrl({ search: '', category: null })
              }}
              className="rounded-full bg-gray-100 px-3 py-0.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Filtreleri temizle ✕
            </button>
          )}
        </div>

        {visibleArticles.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleArticles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 py-12 text-center text-gray-500 dark:border-gray-700 dark:text-gray-400">
            {query.trim()
              ? `“${query.trim()}” için sonuç bulunamadı.`
              : 'Bu kategoride henüz makale bulunmuyor.'}
          </div>
        )}
      </section>
    </div>
  )
}
