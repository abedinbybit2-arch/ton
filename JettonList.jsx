export default function JettonList({ jettons, loading }) {
  if (loading) return null
  if (!jettons?.length) return null

  return (
    <div className="bg-slate-800 border border-slate-700/50 rounded-2xl overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-700/50 flex items-center gap-2">
        <span>🪙</span>
        <span className="font-semibold text-sm">Jetton Balances</span>
        <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">
          {jettons.length}
        </span>
      </div>
      <div className="divide-y divide-slate-700/40">
        {jettons.map((j, i) => {
          const meta    = j.jetton || {}
          const balance = j.balance
            ? (parseInt(j.balance) / Math.pow(10, meta.decimals || 9)).toFixed(4)
            : '0'

          return (
            <div key={i} className="flex items-center justify-between px-5 py-3 hover:bg-slate-700/20 transition-colors">
              <div className="flex items-center gap-3">
                {meta.image
                  ? <img src={meta.image} alt="" className="w-8 h-8 rounded-full flex-shrink-0"
                      onError={e => e.target.style.display = 'none'} />
                  : <div className="w-8 h-8 rounded-full bg-ton-800 flex items-center justify-center text-sm font-bold flex-shrink-0 text-white">
                      {(meta.symbol || '?')[0]}
                    </div>
                }
                <div>
                  <div className="font-medium text-sm text-slate-200">{meta.name || 'Unknown'}</div>
                  <div className="text-xs text-slate-500">{meta.symbol || '—'}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-sm text-slate-200">{balance}</div>
                <div className="text-xs text-slate-500">{meta.symbol || 'tokens'}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
