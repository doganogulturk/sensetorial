import Link from 'next/link'
import { getCategoryStyle } from '@/lib/categories'
import type { ArticleSummary, ArticleWithCategory } from '@/types'
import ViewCounter from './ViewCounter'

type Props = {
  article: ArticleWithCategory
  related: ArticleSummary[]
  previous: ArticleSummary | null
  next: ArticleSummary | null
}

// Veritabanındaki adres iframe'e konmadan önce doğrulanır (javascript: vb. engellenir)
function safePdfUrl(url: string) {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' || parsed.protocol === 'http:' ? parsed.toString() : null
  } catch {
    return null
  }
}

const buttonClass =
  'inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800'

export default function ArticleView({ article, related, previous, next }: Props) {
  const style = getCategoryStyle(article.categories?.name)
  const pdfUrl = safePdfUrl(article.pdf_url)

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <ViewCounter articleId={article.id} />

      {/* Breadcrumb */}
      <nav aria-label="Konum" className="mb-4 text-sm">
        <ol className="flex min-w-0 items-center gap-2 text-gray-600 dark:text-gray-400">
          <li>
            <Link href="/" className="transition-colors hover:text-blue-600 dark:hover:text-blue-400">
              Ana Sayfa
            </Link>
          </li>
          {article.categories && (
            <>
              <li aria-hidden>/</li>
              <li>
                <Link
                  href={`/?category=${article.category_id}#makaleler`}
                  className={`whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium transition-opacity hover:opacity-80 ${style.badge}`}
                >
                  {article.categories.name}
                </Link>
              </li>
            </>
          )}
          <li aria-hidden>/</li>
          <li className="truncate font-medium text-gray-900 dark:text-gray-100" aria-current="page">
            {article.title}
          </li>
        </ol>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <article className="min-w-0">
          <header className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="flex items-center gap-3 text-2xl font-bold sm:text-3xl">
              <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${style.accent}`} aria-hidden />
              {article.title}
            </h1>
            {pdfUrl && (
              <div className="flex shrink-0 gap-2">
                <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className={buttonClass}>
                  ↗ Yeni sekmede aç
                </a>
                <a href={pdfUrl} download className={buttonClass}>
                  ⬇ İndir
                </a>
              </div>
            )}
          </header>

          {pdfUrl ? (
            <iframe
              src={`${pdfUrl}#view=FitH`}
              className="h-[80vh] min-h-[480px] w-full rounded-lg border border-gray-200 bg-gray-50 shadow-lg dark:border-gray-800 dark:bg-gray-900"
              title={article.title}
            />
          ) : (
            <p className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500 dark:border-gray-700 dark:text-gray-400">
              Bu dokümanın dosyasına şu anda ulaşılamıyor.
            </p>
          )}
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 lg:hidden">
            Doküman telefonda düzgün görünmüyorsa “Yeni sekmede aç” düğmesini kullanın.
          </p>

          {(previous || next) && (
            <nav aria-label="Kategori içinde gezinme" className="mt-6 grid gap-3 sm:grid-cols-2">
              {previous ? <PagerLink article={previous} direction="previous" /> : <span />}
              {next && <PagerLink article={next} direction="next" />}
            </nav>
          )}
        </article>

        {/* Aynı kategorideki diğer makaleler */}
        <aside className="lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:self-start lg:overflow-y-auto">
          <h2 className="mb-3 text-lg font-semibold">
            {article.categories ? `${article.categories.name} kategorisinde` : 'Diğer makaleler'}
          </h2>
          {related.length > 0 ? (
            <ul className="space-y-1">
              {related.map(item => (
                <li key={item.id}>
                  <Link
                    href={`/article/${item.id}`}
                    className="flex items-start gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-blue-400"
                  >
                    <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${style.accent}`} aria-hidden />
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">Bu kategoride başka makale bulunmuyor.</p>
          )}
        </aside>
      </div>
    </div>
  )
}

function PagerLink({ article, direction }: { article: ArticleSummary; direction: 'previous' | 'next' }) {
  const isNext = direction === 'next'
  return (
    <Link
      href={`/article/${article.id}`}
      className={`group rounded-xl border border-gray-200 p-4 transition-colors hover:border-blue-300 hover:bg-blue-50/50 dark:border-gray-800 dark:hover:border-blue-500/60 dark:hover:bg-blue-500/5 ${isNext ? 'text-right sm:col-start-2' : ''}`}
    >
      <div className="text-xs text-gray-500 dark:text-gray-400">{isNext ? 'Sonraki →' : '← Önceki'}</div>
      <div className="line-clamp-2 font-medium transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
        {article.title}
      </div>
    </Link>
  )
}
