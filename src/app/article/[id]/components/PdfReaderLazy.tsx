'use client'

import dynamic from 'next/dynamic'

// PDF.js yalnızca tarayıcıda çalışır; sunucuda yerine iskelet gösterilir.
const PdfReaderLazy = dynamic(() => import('./PdfReader'), {
  ssr: false,
  loading: () => (
    <div className="overflow-hidden rounded-xl border border-line bg-subtle">
      <div className="h-11 border-b border-line bg-surface" />
      <div className="p-3 sm:p-6">
        <div className="mx-auto aspect-[1/1.414] w-full max-w-[900px] animate-pulse rounded-md bg-white shadow-md" />
      </div>
    </div>
  ),
})

export default PdfReaderLazy
