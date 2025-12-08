// src/components/Header.tsx
'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const isHomePage = pathname === '/'

  const handleSearch = (query: string) => {
    if (isHomePage) {
      const searchParams = new URLSearchParams(window.location.search)
      searchParams.set('search', query)
      router.push(`/?${searchParams.toString()}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow dark:shadow-gray-800 transition-colors">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="text-xl font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
            Sensetorial
          </Link>

          {isHomePage && (
            <div className="flex-1 flex justify-center">
              <input
                type="text"
                placeholder="Makale ara..."
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full max-w-2xl px-4 py-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>
          )}

          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}