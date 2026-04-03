function Shimmer({ className }) {
  return (
    <div className={`relative overflow-hidden bg-white/10 rounded-2xl ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite] bg-linear-to-r from-transparent via-white/10 to-transparent" />
    </div>
  )
}

function HistorySkeleton() {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5 pb-12">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-5">
          <Shimmer className="h-4 w-40 mb-4" />
          <Shimmer className="h-[280px] rounded-xl" />
        </div>
      ))}
    </div>
  )
}

export default HistorySkeleton
