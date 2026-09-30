import Link from 'next/link'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur transition-colors dark:border-gray-800 dark:bg-gray-950/80">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 whitespace-nowrap text-xl font-bold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-sm text-white" aria-hidden>
            S
          </span>
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
            Sensetorial
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          <Link
            href="/#makaleler"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
          >
            Makaleler
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
