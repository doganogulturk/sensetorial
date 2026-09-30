import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container mx-auto flex flex-col items-center px-4 py-24 text-center">
      <div className="mb-4 text-6xl" aria-hidden>🔎</div>
      <h1 className="mb-2 text-3xl font-bold">Sayfa bulunamadı</h1>
      <p className="mb-8 text-gray-600 dark:text-gray-400">Aradığınız makale kaldırılmış ya da adresi değişmiş olabilir.</p>
      <Link href="/" className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition-colors hover:bg-blue-700">
        Ana sayfaya dön
      </Link>
    </div>
  )
}
