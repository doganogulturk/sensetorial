import Link from 'next/link'
import Logo from './Logo'
import SearchDialog, { type SearchItem } from './SearchDialog'
import ThemeToggle from './ThemeToggle'

export default function Header({ searchItems }: { searchItems: SearchItem[] }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-canvas/80 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Link href="/" aria-label="Sensetorial ana sayfa" className="shrink-0 rounded-lg">
          <Logo />
        </Link>

        <nav className="ml-4 hidden items-center gap-1 text-sm md:flex">
          <Link href="/#dokumanlar" className="rounded-md px-3 py-1.5 text-fg-muted transition-colors hover:bg-subtle hover:text-fg">
            Dokümanlar
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <SearchDialog items={searchItems} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
