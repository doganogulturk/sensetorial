import Link from 'next/link'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-fg-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Link href="/" className="w-fit rounded-lg text-fg">
          <Logo />
        </Link>
        <p>
          İçerikler{' '}
          <a
            href="https://tr.linkedin.com/in/doğan-oğultürk-39b3a662"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-fg underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-accent"
          >
            Doğan Oğultürk
          </a>{' '}
          tarafından hazırlanmıştır.
        </p>
      </div>
    </footer>
  )
}
