'use client'

import { useEffect, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { ExternalLink, Minus, Plus } from 'lucide-react'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

// Worker, react-pdf bileşenleriyle aynı modülde tanımlanmalı. Geniş tarayıcı desteği için
// legacy sürüm kullanılır (bkz. next.config.ts).
pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/legacy/build/pdf.worker.min.mjs', import.meta.url).toString()

const ZOOM_STEPS = [0.6, 0.75, 0.9, 1, 1.25, 1.5, 2]
const MAX_WIDTH = 900

type Props = { url: string; title: string }

/**
 * PDF.js ile her cihazda aynı çalışan görüntüleyici: sayfalar ekrana yaklaştıkça çizilir,
 * yakınlaştırma ve sayfa göstergesi vardır. PDF yüklenemezse (ör. sunucu CORS'a izin vermiyorsa)
 * tarayıcının kendi görüntüleyicisine (iframe) geri döner.
 */
export default function PdfReader({ url, title }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [numPages, setNumPages] = useState(0)
  const [ratio, setRatio] = useState(Math.SQRT2)
  const [zoomIndex, setZoomIndex] = useState(ZOOM_STEPS.indexOf(1))
  const [currentPage, setCurrentPage] = useState(1)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => setContainerWidth(entry.contentRect.width))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  if (failed) {
    return (
      <div>
        <iframe
          src={`${url}#view=FitH`}
          title={title}
          className="h-[80dvh] min-h-[480px] w-full rounded-xl border border-line bg-surface"
        />
        <p className="mt-2 text-xs text-fg-subtle">
          Doküman düzgün görünmüyorsa{' '}
          <a href={url} target="_blank" rel="noopener noreferrer" className="font-medium text-accent underline-offset-2 hover:underline">
            yeni sekmede açın
          </a>
          .
        </p>
      </div>
    )
  }

  const zoom = ZOOM_STEPS[zoomIndex]
  const pageWidth = Math.floor(Math.min(containerWidth, MAX_WIDTH) * zoom)

  return (
    // overflow-clip (hidden değil): araç çubuğunun "sticky" davranışı bozulmasın
    <div className="overflow-clip rounded-xl border border-line bg-subtle">
      {/* Araç çubuğu: başlık çubuğunun hemen altında sabit kalır */}
      <div className="sticky top-[calc(3.5rem+env(safe-area-inset-top))] z-20 flex items-center justify-between gap-2 border-b border-line bg-surface/90 px-2 py-1.5 backdrop-blur-xl">
        <span className="px-2 text-sm tabular-nums text-fg-muted" aria-live="polite">
          {numPages > 0 ? `${currentPage} / ${numPages}` : 'Yükleniyor…'}
        </span>
        <div className="flex items-center gap-0.5">
          <ToolButton label="Uzaklaştır" disabled={zoomIndex === 0} onClick={() => setZoomIndex(i => i - 1)}>
            <Minus className="h-4 w-4" aria-hidden />
          </ToolButton>
          <button
            type="button"
            onClick={() => setZoomIndex(ZOOM_STEPS.indexOf(1))}
            title="Sığdır"
            className="h-8 min-w-14 rounded-md px-2 text-xs font-medium tabular-nums text-fg-muted transition-colors hover:bg-subtle hover:text-fg"
          >
            {Math.round(zoom * 100)}%
          </button>
          <ToolButton label="Yakınlaştır" disabled={zoomIndex === ZOOM_STEPS.length - 1} onClick={() => setZoomIndex(i => i + 1)}>
            <Plus className="h-4 w-4" aria-hidden />
          </ToolButton>
          <span className="mx-1 h-5 w-px bg-line" aria-hidden />
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Yeni sekmede aç"
            title="Yeni sekmede aç"
            className="grid h-8 w-8 place-items-center rounded-md text-fg-muted transition-colors hover:bg-subtle hover:text-fg"
          >
            <ExternalLink className="h-4 w-4" aria-hidden />
          </a>
        </div>
      </div>

      <div ref={containerRef} className="overflow-x-auto p-2 sm:p-6">
        {containerWidth > 0 && (
          <Document
            file={url}
            suspense={false}
            onLoadSuccess={async pdf => {
              setNumPages(pdf.numPages)
              const first = await pdf.getPage(1)
              const viewport = first.getViewport({ scale: 1 })
              setRatio(viewport.height / viewport.width)
            }}
            onLoadError={error => {
              console.error('PDF yüklenemedi, tarayıcı görüntüleyicisine geçiliyor:', error)
              setFailed(true)
            }}
            loading={<PageSkeleton width={pageWidth} ratio={ratio} />}
            error={null}
            className="flex flex-col items-center gap-3 sm:gap-5"
          >
            {Array.from({ length: numPages }, (_, i) => (
              <LazyPage key={i + 1} pageNumber={i + 1} width={pageWidth} ratio={ratio} onVisible={setCurrentPage} />
            ))}
          </Document>
        )}
      </div>
    </div>
  )
}

/** Sayfa ekrana yaklaşınca çizilir; ekranın ortasındaki sayfa "geçerli sayfa" olur. */
function LazyPage({ pageNumber, width, ratio, onVisible }: { pageNumber: number; width: number; ratio: number; onVisible: (n: number) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const [shouldRender, setShouldRender] = useState(pageNumber <= 2)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const nearObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true)
          nearObserver.disconnect()
        }
      },
      { rootMargin: '1200px 0px' }
    )
    const centerObserver = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && onVisible(pageNumber),
      { rootMargin: '-50% 0px -50% 0px' }
    )
    nearObserver.observe(el)
    centerObserver.observe(el)
    return () => {
      nearObserver.disconnect()
      centerObserver.disconnect()
    }
  }, [pageNumber, onVisible])

  return (
    <div
      ref={ref}
      data-page={pageNumber}
      className="shrink-0 overflow-hidden rounded-md bg-white shadow-md ring-1 ring-black/5"
      style={{ width, minHeight: Math.round(width * ratio) }}
    >
      {shouldRender && (
        <Page
          pageNumber={pageNumber}
          width={width}
          loading={<PageSkeleton width={width} ratio={ratio} bare />}
        />
      )}
    </div>
  )
}

function PageSkeleton({ width, ratio, bare }: { width: number; ratio: number; bare?: boolean }) {
  return (
    <div
      className={`animate-pulse bg-white ${bare ? '' : 'rounded-md shadow-md ring-1 ring-black/5'}`}
      style={{ width, height: Math.round(width * ratio) }}
    />
  )
}

function ToolButton({ label, disabled, onClick, children }: { label: string; disabled?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="grid h-8 w-8 place-items-center rounded-md text-fg-muted transition-colors hover:bg-subtle hover:text-fg disabled:opacity-30"
    >
      {children}
    </button>
  )
}

