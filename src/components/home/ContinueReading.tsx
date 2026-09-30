'use client'

import Link from 'next/link'
import { History } from 'lucide-react'
import { getCategoryStyle } from '@/lib/categories'
import { useReadingHistory } from '@/lib/history'

// Tarayıcıda saklanan son okunan dokümanlar; geçmiş yoksa hiçbir şey göstermez.
export default function ContinueReading({ validIds }: { validIds: Set<string> }) {
  const history = useReadingHistory().filter(item => validIds.has(item.id)).slice(0, 4)
  if (history.length === 0) return null

  return (
    <section aria-labelledby="devam-baslik">
      <h2 id="devam-baslik" className="mb-3 flex items-center gap-2 text-sm font-medium text-fg-muted">
        <History className="h-4 w-4" aria-hidden />
        Kaldığınız yerden devam edin
      </h2>
      <ul className="scrollbar-none -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-2 sm:px-0 lg:grid-cols-4">
        {history.map(item => {
          const style = getCategoryStyle(item.category)
          const Icon = style.icon
          return (
            <li key={item.id} className="w-64 shrink-0 snap-start sm:w-auto">
              <Link
                href={`/article/${item.id}`}
                className="flex items-center gap-3 rounded-xl border border-line bg-surface p-3 shadow-xs transition-colors hover:border-line-strong"
              >
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${style.soft}`}>
                  <Icon className="h-[18px] w-[18px]" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">{item.title}</span>
                  {item.category && <span className="block text-xs text-fg-subtle">{item.category}</span>}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
