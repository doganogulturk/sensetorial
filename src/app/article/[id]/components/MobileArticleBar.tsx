'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight, Library, X } from 'lucide-react'

type NavTarget = { id: string; title: string } | null

type Props = {
  previous: NavTarget
  next: NavTarget
  label: string
  /** Alt panelde gösterilecek doküman ağacı */
  children: React.ReactNode
}

/** Mobilde ekranın altında sabit gezinme çubuğu ve açılır doküman listesi */
export default function MobileArticleBar({ previous, next, label, children }: Props) {
  const sheetRef = useRef<HTMLDialogElement>(null)
  const pathname = usePathname()

  // Başka bir dokümana geçilince panel kapanır
  useEffect(() => {
    sheetRef.current?.close()
  }, [pathname])

  const navButton = 'grid h-11 w-11 shrink-0 place-items-center rounded-xl text-fg-muted transition-colors hover:bg-subtle hover:text-fg aria-disabled:pointer-events-none aria-disabled:opacity-30'

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-canvas/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-2 px-3 py-2">
          <NavLink target={previous} className={navButton} label="Önceki doküman">
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </NavLink>
          <button
            type="button"
            onClick={() => sheetRef.current?.showModal()}
            className="flex h-11 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl bg-subtle px-3 text-sm font-medium"
          >
            <Library className="h-4 w-4 shrink-0" aria-hidden />
            <span className="truncate">{label}</span>
          </button>
          <NavLink target={next} className={navButton} label="Sonraki doküman">
            <ChevronRight className="h-5 w-5" aria-hidden />
          </NavLink>
        </div>
      </div>

      <dialog
        ref={sheetRef}
        aria-label="Dokümanlar"
        onClick={e => e.target === sheetRef.current && sheetRef.current.close()}
        className="m-0 mt-auto max-h-[85dvh] w-full max-w-none overflow-hidden rounded-t-2xl border-t border-line bg-surface p-0 text-fg shadow-2xl backdrop:bg-black/40 open:flex open:animate-enter open:flex-col lg:hidden"
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <span className="font-semibold">Dokümanlar</span>
          <button
            type="button"
            onClick={() => sheetRef.current?.close()}
            aria-label="Kapat"
            className="grid h-9 w-9 place-items-center rounded-lg text-fg-muted hover:bg-subtle"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <div className="overflow-y-auto overscroll-contain p-3 pb-[max(env(safe-area-inset-bottom),0.75rem)]">{children}</div>
      </dialog>
    </>
  )
}

function NavLink({ target, className, label, children }: { target: NavTarget; className: string; label: string; children: React.ReactNode }) {
  if (!target) {
    return (
      <span className={className} aria-disabled="true" aria-label={label}>
        {children}
      </span>
    )
  }
  return (
    <Link href={`/article/${target.id}`} className={className} aria-label={`${label}: ${target.title}`}>
      {children}
    </Link>
  )
}
