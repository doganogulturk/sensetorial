export function Bone({ className = '' }: { className?: string }) {
  return <div className={`rounded bg-gray-200 dark:bg-gray-800 ${className}`} />
}

export function HomeSkeleton() {
  return (
    <div className="container mx-auto animate-pulse px-4 py-8 sm:py-12" aria-busy="true" aria-label="Yükleniyor">
      <div className="mb-14 flex flex-col items-center gap-4">
        <Bone className="h-12 w-72" />
        <Bone className="h-6 w-80" />
        <div className="mt-4 flex gap-8">
          <Bone className="h-16 w-40 rounded-full" />
          <Bone className="h-16 w-40 rounded-full" />
        </div>
      </div>
      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="rounded-xl border border-gray-200 p-6 dark:border-gray-800">
            <Bone className="mb-4 h-6 w-3/4" />
            <Bone className="mb-2 h-3" />
            <Bone className="h-3 w-5/6" />
          </div>
        ))}
      </div>
      <Bone className="mb-4 h-7 w-40" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
            <Bone className="mb-2 h-3" />
            <Bone className="mb-4 h-3 w-3/4" />
            <Bone className="h-5 w-20 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function ArticleSkeleton() {
  return (
    <div className="container mx-auto animate-pulse px-4 py-6 sm:py-8" aria-busy="true" aria-label="Yükleniyor">
      <Bone className="mb-6 h-4 w-64" />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div>
          <Bone className="mb-4 h-9 w-2/3" />
          <Bone className="h-[80vh] min-h-[480px] w-full rounded-lg" />
        </div>
        <div className="space-y-3">
          <Bone className="h-6 w-40" />
          {Array.from({ length: 6 }, (_, i) => <Bone key={i} className="h-4" />)}
        </div>
      </div>
    </div>
  )
}
