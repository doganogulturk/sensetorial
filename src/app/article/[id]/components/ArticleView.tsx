import Link from 'next/link'
import { CalendarDays, ChevronLeft, ChevronRight, Download, ExternalLink, Eye } from 'lucide-react'
import { getCategoryStyle } from '@/lib/categories'
import { features } from '@/lib/site'
import { formatDate, formatNumber } from '@/lib/format'
import type { ArticleSummary, ArticleWithCategory, Category } from '@/types'
import DocsNav from './DocsNav'
import MobileArticleBar from './MobileArticleBar'
import PdfReaderLazy from './PdfReaderLazy'
import ReadingTracker from './ReadingTracker'
import ShareButton from './ShareButton'

type Props = {
  article: ArticleWithCategory
  categories: Category[]
  allArticles: ArticleSummary[]
  previous: ArticleSummary | null
  next: ArticleSummary | null
  position: { current: number; total: number } | null
}

// Veritabanındaki adres gösterilmeden önce doğrulanır (javascript: vb. engellenir)
function safePdfUrl(url: string) {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' || parsed.protocol === 'http:' ? parsed.toString() : null
  } catch {
    return null
  }
}

const actionClass =
  'inline-flex h-9 items-center gap-2 rounded-lg border border-line bg-surface px-3 text-sm font-medium text-fg-muted shadow-xs transition-colors hover:border-line-strong hover:text-fg'

export default function ArticleView({ article, categories, allArticles, previous, next, position }: Props) {
  const style = getCategoryStyle(article.categories?.name)
  const CategoryIcon = style.icon
  const pdfUrl = safePdfUrl(article.pdf_url)
  const nav = <DocsNav categories={categories} articles={allArticles} currentId={article.id} />

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <ReadingTracker id={article.id} title={article.title} category={article.categories?.name ?? null} />

      <div className="lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10">
        {/* Masaüstü: doküman ağacı */}
        <aside className="hidden lg:block">
          <div className="sticky top-14 -ml-2 max-h-[calc(100dvh-3.5rem)] overflow-y-auto overscroll-contain py-8 pr-2">
            {nav}
          </div>
        </aside>

        <article className="min-w-0 py-6 sm:py-8">
          {/* Breadcrumb */}
          <nav aria-label="Konum" className="mb-4 text-sm">
            <ol className="flex min-w-0 items-center gap-1.5 text-fg-subtle">
              <li>
                <Link href="/" className="transition-colors hover:text-fg">Ana sayfa</Link>
              </li>
              {article.categories && (
                <>
                  <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  <li className="truncate">
                    <Link href={`/?category=${article.category_id}#dokumanlar`} className="transition-colors hover:text-fg">
                      {article.categories.name}
                    </Link>
                  </li>
                </>
              )}
            </ol>
          </nav>

          <header className="mb-6">
            <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">{article.title}</h1>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-fg-muted">
              {article.categories && (
                <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium ${style.soft}`}>
                  <CategoryIcon className="h-3.5 w-3.5" aria-hidden />
                  {article.categories.name}
                  {position && <span className="opacity-70">· {position.current}/{position.total}</span>}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" aria-hidden />
                {formatDate(article.created_at)}
              </span>
              {features.showViewCounts && article.views > 0 && (
                <span className="inline-flex items-center gap-1.5">
                  <Eye className="h-4 w-4" aria-hidden />
                  {formatNumber(article.views)} görüntülenme
                </span>
              )}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <ShareButton title={article.title} className={actionClass} />
              {pdfUrl && (
                <>
                  <a href={pdfUrl} download className={actionClass}>
                    <Download className="h-4 w-4" aria-hidden />
                    İndir
                  </a>
                  {/* Mobilde bu işlev PDF araç çubuğunda zaten var */}
                  <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className={`${actionClass} max-sm:hidden`}>
                    <ExternalLink className="h-4 w-4" aria-hidden />
                    <span>Yeni sekmede aç</span>
                  </a>
                </>
              )}
            </div>
          </header>

          {pdfUrl ? (
            <PdfReaderLazy url={pdfUrl} title={article.title} />
          ) : (
            <p className="rounded-xl border border-dashed border-line-strong p-10 text-center text-fg-muted">
              Bu dokümanın dosyasına şu anda ulaşılamıyor.
            </p>
          )}

          {/* Masaüstü: önceki / sonraki */}
          {(previous || next) && (
            <nav aria-label="Kategori içinde gezinme" className="mt-8 hidden gap-3 sm:grid sm:grid-cols-2">
              {previous ? <PagerLink article={previous} direction="previous" /> : <span />}
              {next && <PagerLink article={next} direction="next" />}
            </nav>
          )}

          {/* Mobil alt çubuğun içeriği örtmemesi için boşluk */}
          <div className="h-20 lg:hidden" aria-hidden />
        </article>
      </div>

      <MobileArticleBar
        previous={previous && { id: previous.id, title: previous.title }}
        next={next && { id: next.id, title: next.title }}
        label={article.categories ? `${article.categories.name}${position ? ` · ${position.current}/${position.total}` : ''}` : 'Dokümanlar'}
      >
        {nav}
      </MobileArticleBar>
    </div>
  )
}

function PagerLink({ article, direction }: { article: ArticleSummary; direction: 'previous' | 'next' }) {
  const isNext = direction === 'next'
  return (
    <Link
      href={`/article/${article.id}`}
      className={`group flex items-center gap-3 rounded-xl border border-line bg-surface p-4 shadow-xs transition-colors hover:border-line-strong ${isNext ? 'flex-row-reverse text-right sm:col-start-2' : ''}`}
    >
      {isNext ? (
        <ChevronRight className="h-5 w-5 shrink-0 text-fg-subtle transition-transform group-hover:translate-x-0.5" aria-hidden />
      ) : (
        <ChevronLeft className="h-5 w-5 shrink-0 text-fg-subtle transition-transform group-hover:-translate-x-0.5" aria-hidden />
      )}
      <span className="min-w-0">
        <span className="block text-xs text-fg-subtle">{isNext ? 'Sonraki' : 'Önceki'}</span>
        <span className="line-clamp-2 font-medium">{article.title}</span>
      </span>
    </Link>
  )
}
