'use client'

import { useEffect } from 'react'
import { TriangleAlert } from 'lucide-react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <span className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-subtle text-fg-muted">
        <TriangleAlert className="h-7 w-7" aria-hidden />
      </span>
      <h1 className="mb-2 text-2xl font-semibold tracking-tight">Bir şeyler ters gitti</h1>
      <p className="mb-8 text-fg-muted">İçerik yüklenirken bir hata oluştu. Lütfen tekrar deneyin.</p>
      <button
        type="button"
        onClick={reset}
        className="inline-flex h-10 items-center rounded-lg bg-accent px-5 text-sm font-medium text-accent-fg transition-colors hover:bg-accent-hover"
      >
        Tekrar dene
      </button>
    </div>
  )
}
