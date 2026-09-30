'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Clock, CornerDownLeft, FileText, Search, X } from 'lucide-react'
import { getCategoryStyle } from '@/lib/categories'
import { useReadingHistory } from '@/lib/history'
import { matchesSearch } from '@/lib/search'

export type SearchItem = { id: string; title: string; category: string | null }

const MAX_RESULTS = 20

export default function SearchDialog({ items }: { items: SearchItem[] }) {
  const router = useRouter()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const listId = useId()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const history = useReadingHistory()

  const showingHistory = !query.trim() && history.length > 0
  const results = useMemo<SearchItem[]>(() => {
    if (!query.trim()) {
      return history.length > 0
        ? history.slice(0, 6).map(({ id, title, category }) => ({ id, title, category }))
        : items.slice(0, 8)
    }
    return items.filter(item => matchesSearch(`${item.title} ${item.category ?? ''}`, query)).slice(0, MAX_RESULTS)
  }, [items, history, query])

  const open = () => {
    const dialog = dialogRef.current
    if (!dialog || dialog.open) return
    setQuery('')
    setActive(0)
    dialog.showModal()
    inputRef.current?.focus()
  }

  const close = () => dialogRef.current?.close()

  const go = (item: SearchItem | undefined) => {
    if (!item) return
    close()
    router.push(`/article/${item.id}`)
  }

  // ⌘K / Ctrl+K her sayfadan aramayı açar
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        if (dialogRef.current?.open) dialogRef.current.close()
        else open()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  // Seçili sonuç görünür alanda kalsın
  useEffect(() => {
    listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [active])

  const onInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive(i => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      go(results[active])
    }
  }

  return (
    <>
      {/* Masaüstü: arama kutusu görünümlü düğme */}
      <button
        type="button"
        onClick={open}
        className="hidden h-9 w-64 items-center gap-2 rounded-lg border border-line bg-surface px-3 text-sm text-fg-subtle shadow-xs transition-colors hover:border-line-strong hover:text-fg-muted sm:flex"
      >
        <Search className="h-4 w-4" aria-hidden />
        <span>Doküman ara…</span>
        <kbd className="ml-auto rounded border border-line bg-subtle px-1.5 font-sans text-[11px] font-medium">⌘K</kbd>
      </button>
      {/* Mobil: ikon düğme */}
      <button
        type="button"
        onClick={open}
        aria-label="Doküman ara"
        className="grid h-10 w-10 place-items-center rounded-lg text-fg-muted transition-colors hover:bg-subtle hover:text-fg sm:hidden"
      >
        <Search className="h-[18px] w-[18px]" aria-hidden />
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Doküman ara"
        onClick={e => e.target === dialogRef.current && close()}
        className="m-0 mx-auto mt-[max(env(safe-area-inset-top),0.75rem)] w-[calc(100%-1.5rem)] max-w-xl overflow-hidden rounded-2xl border border-line bg-surface p-0 text-fg shadow-2xl backdrop:bg-black/40 backdrop:backdrop-blur-sm open:animate-enter sm:mt-[12vh]"
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search className="h-5 w-5 shrink-0 text-fg-subtle" aria-hidden />
          <input
            ref={inputRef}
            value={query}
            onChange={e => {
              setQuery(e.target.value)
              setActive(0)
            }}
            onKeyDown={onInputKeyDown}
            placeholder="Doküman veya kategori ara…"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={results[active] ? `${listId}-${active}` : undefined}
            className="h-14 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-fg-subtle"
          />
          <button
            type="button"
            onClick={close}
            aria-label="Kapat"
            className="grid h-8 w-8 place-items-center rounded-md text-fg-subtle hover:bg-subtle hover:text-fg"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <div className="max-h-[min(60vh,28rem)] overflow-y-auto overscroll-contain p-2">
          {results.length > 0 ? (
            <>
              <div className="px-2 pb-1 pt-2 text-xs font-medium text-fg-subtle">
                {query.trim() ? `${results.length} sonuç` : showingHistory ? 'Son okunanlar' : 'Dokümanlar'}
              </div>
              <ul ref={listRef} id={listId} role="listbox" aria-label="Sonuçlar">
                {results.map((item, index) => {
                  const style = getCategoryStyle(item.category)
                  const Icon = showingHistory ? Clock : FileText
                  return (
                    <li
                      key={item.id}
                      id={`${listId}-${index}`}
                      role="option"
                      aria-selected={index === active}
                      onMouseMove={() => setActive(index)}
                      onClick={() => go(item)}
                      className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm aria-selected:bg-subtle"
                    >
                      <Icon className="h-4 w-4 shrink-0 text-fg-subtle" aria-hidden />
                      <span className="min-w-0 flex-1 truncate">{item.title}</span>
                      {item.category && (
                        <span className={`hidden shrink-0 rounded-md px-1.5 py-0.5 text-xs font-medium sm:inline ${style.soft}`}>
                          {item.category}
                        </span>
                      )}
                      {index === active && <CornerDownLeft className="hidden h-3.5 w-3.5 shrink-0 text-fg-subtle sm:block" aria-hidden />}
                    </li>
                  )
                })}
              </ul>
            </>
          ) : (
            <p className="px-4 py-10 text-center text-sm text-fg-muted">
              {query.trim() ? `“${query.trim()}” için sonuç bulunamadı.` : 'Henüz doküman yok.'}
            </p>
          )}
        </div>

        <div className="hidden items-center gap-4 border-t border-line px-4 py-2.5 text-xs text-fg-subtle sm:flex">
          <span><Kbd>↑</Kbd> <Kbd>↓</Kbd> gezin</span>
          <span><Kbd>↵</Kbd> aç</span>
          <span><Kbd>esc</Kbd> kapat</span>
        </div>
      </dialog>
    </>
  )
}

function Kbd({ children }: { children: React.ReactNode }) {
  return <kbd className="rounded border border-line bg-subtle px-1.5 py-0.5 font-sans text-[11px]">{children}</kbd>
}
