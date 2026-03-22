export default function NFTList({ nfts, loading }) {
  if (loading || !nfts?.length) return null

  return (
    <div className="bg-slate-800 border border-slate-700/50 rounded-2xl overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-700/50 flex items-center gap-2">
        <span>🖼️</span>
        <span className="font-semibold text-sm">NFTs Owned</span>
        <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">
          {nfts.length}
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4">
        {nfts.map((nft, i) => {
          const preview = nft.previews?.[1]?.url || nft.previews?.[0]?.url
          const name    = nft.metadata?.name || 'Unnamed NFT'
          const coll    = nft.collection?.name || ''
          return (
            <div key={i}
              className="bg-slate-700/40 border border-slate-700/50 rounded-xl overflow-hidden hover:border-ton-600/40 transition-colors cursor-pointer group">
              {preview
                ? <img src={preview} alt={name}
                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300" />
                : <div className="w-full aspect-square bg-slate-600/40 flex items-center justify-center text-3xl">🖼️</div>
              }
              <div className="p-2">
                <div className="text-xs font-medium text-slate-200 truncate">{name}</div>
                {coll && <div className="text-xs text-slate-500 truncate">{coll}</div>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
