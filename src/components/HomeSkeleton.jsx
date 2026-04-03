function Shimmer({ className }) {
  return (
    <div className={`relative overflow-hidden bg-white/10 rounded-2xl ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite] bg-linear-to-r from-transparent via-white/10 to-transparent" />
    </div>
  )
}

function HomeSkeleton({ bg = 'bg-linear-to-br from-sky-400 to-blue-600' }) {
  return (
    <div className={`min-h-screen w-full ${bg} pt-24 pb-16 px-4 md:px-10 flex flex-col items-center`}>
      <div className="w-full max-w-6xl">

        <div className="bg-black/20 border border-white/10 rounded-2xl px-4 py-3 mb-8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <Shimmer className="h-4 w-32" />
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Shimmer className="h-4 w-10 shrink-0" />
            <Shimmer className="h-8 flex-1 sm:w-36 rounded-lg" />
            <Shimmer className="h-8 w-12 rounded-lg shrink-0" />
          </div>
        </div>

        <div className="flex flex-col items-center mb-10">
          <Shimmer className="h-5 w-28 mb-3 rounded-full" />
          <Shimmer className="h-32 w-52 md:w-72 rounded-3xl mb-4" />
          <Shimmer className="h-8 w-44 rounded-full" />
        </div>

        <Shimmer className="h-3 w-36 mb-3 rounded" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-8">
          {Array.from({ length: 10 }).map((_, i) => (
            <Shimmer key={i} className="h-20" />
          ))}
        </div>

        <Shimmer className="h-3 w-24 mb-3 rounded" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-10">
          {Array.from({ length: 7 }).map((_, i) => (
            <Shimmer key={i} className={`h-20 ${i === 0 ? 'col-span-2 sm:col-span-1' : ''}`} />
          ))}
        </div>

        <Shimmer className="h-3 w-32 mb-4 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <Shimmer key={i} className="h-72" />
          ))}
        </div>

      </div>
    </div>
  )
}

export default HomeSkeleton
