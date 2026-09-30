export function Bone({ className = '' }: { className?: string }) {
  return <div className={`rounded-md bg-subtle ${className}`} />
}

export function HomeSkeleton() {
  return (
    <div className="animate-pulse" aria-busy="true" aria-label="Yükleniyor">
      <div className="flex flex-col items-center gap-4 border-b border-line px-4 pb-14 pt-20">
        <Bone className="h-6 w-40 rounded-full" />
        <Bone className="h-12 w-full max-w-lg" />
        <Bone className="h-5 w-full max-w-md" />
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Bone className="mx-auto -mt-7 h-14 max-w-2xl rounded-2xl border border-line" />
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: 5 }, (_, i) => <Bone key={i} className="h-9 w-28 rounded-full" />)}
        </div>
        <div className="mt-12 divide-y divide-line rounded-xl border border-line bg-surface">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3">
              <Bone className="h-9 w-9 rounded-lg" />
              <Bone className="h-4 flex-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ArticleSkeleton() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-4 sm:px-6" aria-busy="true" aria-label="Yükleniyor">
      <div className="lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10">
        <div className="hidden space-y-3 py-8 lg:block">
          {Array.from({ length: 8 }, (_, i) => <Bone key={i} className="h-5" />)}
        </div>
        <div className="py-8">
          <Bone className="mb-4 h-4 w-40" />
          <Bone className="mb-3 h-9 w-2/3" />
          <Bone className="mb-6 h-5 w-64" />
          <Bone className="aspect-[1/1.2] w-full rounded-xl" />
        </div>
      </div>
    </div>
  )
}
