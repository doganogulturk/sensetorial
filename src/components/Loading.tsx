export default function Loading() {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 w-1/2 bg-gray-200 rounded mb-6"></div>
          
          {/* Kategori kartları iskeleti */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="border rounded-lg p-6">
                <div className="h-6 bg-gray-200 w-3/4 mb-4 rounded"></div>
                <div className="h-4 bg-gray-200 w-full mb-2 rounded"></div>
                <div className="h-4 bg-gray-200 w-5/6 rounded"></div>
              </div>
            ))}
          </div>
  
          {/* Makale listesi iskeleti */}
          <div className="h-6 w-1/4 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="h-5 bg-gray-200 w-5/6 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }