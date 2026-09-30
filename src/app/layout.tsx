import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import type { SearchItem } from '@/components/SearchDialog'
import { getArticleSummaries } from '@/lib/supabase'
import { siteDescription, siteName, siteUrl } from '@/lib/site'

// latin-ext: ğ, ş, ı, İ gibi Türkçe karakterler için gerekli
const inter = Inter({ subsets: ['latin', 'latin-ext'], variable: '--font-inter' })

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: {
    default: `${siteName} - Qlik Sense Eğitim Dokümanları`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  openGraph: {
    siteName,
    locale: 'tr_TR',
    type: 'website',
  },
}

export const viewport: Viewport = {
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
}

// Tema, sayfa boyanmadan önce uygulanır; böylece açılışta ekran yanıp sönmez.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d)}catch(e){}})()`

// Arama listesi tüm sayfalarda (404 dahil) en fazla 5 dakikada bir tazelenir
export const revalidate = 300

async function getSearchItems(): Promise<SearchItem[]> {
  try {
    const articles = await getArticleSummaries()
    return articles.map(a => ({ id: a.id, title: a.title, category: a.categories?.name ?? null }))
  } catch (error) {
    // Arama listesi yüklenemezse site yine de açılmalı
    console.error('Arama listesi yüklenemedi:', error)
    return []
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const searchItems = await getSearchItems()

  return (
    <html lang="tr" suppressHydrationWarning className={inter.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${inter.className} flex min-h-dvh flex-col bg-canvas text-fg antialiased`}>
        <a
          href="#icerik"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2 focus:shadow-lg"
        >
          İçeriğe geç
        </a>
        <Header searchItems={searchItems} />
        <main id="icerik" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
