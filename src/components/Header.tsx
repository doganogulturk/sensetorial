// src/components/Header.tsx
'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'

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
    <header className="sticky top-0 z-50 bg-white shadow">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold text-blue-600">
            Sensetorial
          </Link>

          {isHomePage && (
            <div className="flex-1 max-w-2xl">
              <input
                type="text"
                placeholder="Makale ara..."
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>
      </div>
    </header>
  )
}