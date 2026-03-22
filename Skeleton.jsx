export function SkeletonRow({ cols = 4 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="skeleton h-4 rounded-md" />
        </td>
      ))}
    </tr>
  )
}

export function SkeletonCard() {
  return (
    <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-5 space-y-3">
      <div className="skeleton h-4 w-1/3 rounded-md" />
      <div className="skeleton h-8 w-1/2 rounded-md" />
      <div className="skeleton h-3 w-2/3 rounded-md" />
    </div>
  )
}

export function SkeletonBlock() {
  return (
    <div className="space-y-2 p-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="skeleton h-8 rounded-xl" />
      ))}
    </div>
  )
}
