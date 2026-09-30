import Link from 'next/link'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <span className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-subtle text-fg-muted">
        <FileQuestion className="h-7 w-7" aria-hidden />
      </span>
      <h1 className="mb-2 text-2xl font-semibold tracking-tight">Sayfa bulunamadı</h1>
      <p className="mb-8 text-fg-muted">Aradığınız doküman kaldırılmış ya da adresi değişmiş olabilir.</p>
      <Link href="/" className="inline-flex h-10 items-center rounded-lg bg-accent px-5 text-sm font-medium text-accent-fg transition-colors hover:bg-accent-hover">
        Ana sayfaya dön
      </Link>
    </div>
  )
}
