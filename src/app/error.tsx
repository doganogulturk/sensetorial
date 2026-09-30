'use client'

import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="container mx-auto flex flex-col items-center px-4 py-24 text-center">
      <div className="mb-4 text-6xl" aria-hidden>⚠️</div>
      <h1 className="mb-2 text-3xl font-bold">Bir şeyler ters gitti</h1>
      <p className="mb-8 text-gray-600 dark:text-gray-400">İçerik yüklenirken bir hata oluştu. Lütfen tekrar deneyin.</p>
      <button
        type="button"
        onClick={reset}
        className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition-colors hover:bg-blue-700"
      >
        Tekrar dene
      </button>
    </div>
  )
}
