import { useState, useEffect, useCallback } from 'react'
import SearchBar        from './components/SearchBar'
import AccountInfo      from './components/AccountInfo'
import TransactionList  from './components/TransactionList'
import JettonList       from './components/JettonList'
import NFTList          from './components/NFTList'
import {
  getAddressInfo,
  getExtendedAddressInfo,
  getTransactions,
  getJettonWallet,
  getNFTs,
  getTONPrice,
} from './api/ton'

// ── tabs ──────────────────────────────────────────────────
const TABS = [
  { id: 'info',    icon: '📍', label: 'Account Info' },
  { id: 'txs',     icon: '🔄', label: 'Transactions' },
  { id: 'jettons', icon: '🪙', label: 'Jettons'       },
  { id: 'nfts',    icon: '🖼️', label: 'NFTs'          },
]

export default function App() {
  // ── global state ─────────────────────────────────────────
  const [dark,       setDark]       = useState(true)
  const [tonPrice,   setTonPrice]   = useState(null)
  const [tab,        setTab]        = useState('info')

  // ── search / result state ─────────────────────────────────
  const [query,      setQuery]      = useState('')
  const [searching,  setSearching]  = useState(false)
  const [error,      setError]      = useState('')

  // ── data state ────────────────────────────────────────────
  const [accountData, setAccountData] = useState(null)   // { info, extended }
  const [txs,         setTxs]         = useState([])
  const [jettons,     setJettons]     = useState([])
  const [nfts,        setNfts]        = useState([])

  // individual loading flags
  const [loadingInfo,    setLoadingInfo]    = useState(false)
  const [loadingTxs,     setLoadingTxs]     = useState(false)
  const [loadingJettons, setLoadingJettons] = useState(false)
  const [loadingNfts,    setLoadingNfts]    = useState(false)

  // ── fetch TON price on mount ──────────────────────────────
  useEffect(() => {
    getTONPrice().then(p => p && setTonPrice(p)).catch(() => {})
    const iv = setInterval(() => {
      getTONPrice().then(p => p && setTonPrice(p)).catch(() => {})
    }, 60_000)
    return () => clearInterval(iv)
  }, [])

  // ── dark mode class ───────────────────────────────────────
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  // ── main search handler ───────────────────────────────────
  const handleSearch = useCallback(async (address) => {
    setQuery(address)
    setError('')
    setAccountData(null)
    setTxs([])
    setJettons([])
    setNfts([])
    setTab('info')
    setSearching(true)

    // ── 1. Basic + extended info (shown first) ──────────────
    setLoadingInfo(true)
    try {
      const [info, extended] = await Promise.allSettled([
        getAddressInfo(address),
        getExtendedAddressInfo(address),
      ])
      if (info.status === 'rejected') throw new Error(info.reason?.message || 'Address not found')
      setAccountData({
        info:     info.value,
        extended: extended.status === 'fulfilled' ? extended.value : null,
      })
    } catch (e) {
      setError(e.message || 'Could not fetch address info. Check the address and try again.')
      setSearching(false)
      setLoadingInfo(false)
      return
    }
    setLoadingInfo(false)
    setSearching(false)

    // ── 2. Transactions (parallel, non-blocking) ────────────
    setLoadingTxs(true)
    getTransactions(address, 20)
      .then(data => setTxs(data || []))
      .catch(() => setTxs([]))
      .finally(() => setLoadingTxs(false))

    // ── 3. Jetton balances ──────────────────────────────────
    setLoadingJettons(true)
    getJettonWallet(address)
      .then(data => setJettons(data || []))
      .catch(() => setJettons([]))
      .finally(() => setLoadingJettons(false))

    // ── 4. NFTs ─────────────────────────────────────────────
    setLoadingNfts(true)
    getNFTs(address)
      .then(data => setNfts(data || []))
      .catch(() => setNfts([]))
      .finally(() => setLoadingNfts(false))
  }, [])

  // ── tab counts ────────────────────────────────────────────
  const tabCount = {
    txs:     txs.length      || null,
    jettons: jettons.length  || null,
    nfts:    nfts.length     || null,
  }

  const hasResult = !!accountData

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-200 font-sans transition-colors duration-300`}>

      {/* ── top bar ─────────────────────────────────────────── */}
      <div className="bg-black/40 border-b border-slate-800 text-xs text-slate-500 py-1.5 px-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <span className="text-slate-400 font-medium">💎 TON Address Search</span>
            <span className="text-slate-600">|</span>
            <span>Data: toncenter.com + tonapi.io</span>
          </div>
          <div className="flex items-center gap-4">
            {tonPrice && (
              <div className="flex items-center gap-1.5 text-ton-400">
                <span>💎</span>
                <span className="font-mono font-semibold">${parseFloat(tonPrice).toFixed(4)}</span>
                <div className="flex items-center gap-1 ml-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 glow" />
                  <span className="text-green-400">Live</span>
                </div>
              </div>
            )}
            <button
              onClick={() => setDark(d => !d)}
              className="hover:text-ton-400 transition-colors text-base"
            >
              {dark ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </div>

      {/* ── hero / search area ───────────────────────────────── */}
      <div className={`
        transition-all duration-500
        ${hasResult
          ? 'bg-slate-900 border-b border-slate-800 py-6'
          : 'min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-ton-900/20 to-slate-950'}
      `}>
        <div className={`max-w-5xl mx-auto px-4 w-full ${!hasResult ? 'text-center' : ''}`}>
          {!hasResult && (
            <>
              <div className="text-6xl mb-4">💎</div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
                TON Address Search
              </h1>
              <p className="text-slate-400 text-base mb-8">
                Enter any TON wallet address to see balance, transactions, jettons & NFTs — all live.
              </p>
            </>
          )}

          <div className={hasResult ? '' : 'flex justify-center'}>
            <SearchBar onSearch={handleSearch} loading={searching} />
          </div>

          {/* error */}
          {error && (
            <div className="mt-4 bg-red-900/30 border border-red-700/40 rounded-xl px-4 py-3 text-sm text-red-300 flex items-center gap-2 max-w-2xl mx-auto">
              <span>⚠️</span>{error}
            </div>
          )}
        </div>
      </div>

      {/* ── results area ────────────────────────────────────── */}
      {hasResult && (
        <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">

          {/* current query label */}
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/50 rounded-xl px-4 py-2.5 border border-slate-700/50">
            <span>📍 Showing results for:</span>
            <span className="hash text-ton-400 truncate flex-1">{query}</span>
            <button
              onClick={() => { setAccountData(null); setError(''); setQuery('') }}
              className="text-slate-500 hover:text-slate-300 transition-colors ml-2 flex-shrink-0"
            >
              ✕ Clear
            </button>
          </div>

          {/* tabs */}
          <div className="flex gap-1 border-b border-slate-700/50 overflow-x-auto">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`
                  flex items-center gap-1.5 px-4 py-3 text-sm font-medium
                  border-b-2 transition-all whitespace-nowrap flex-shrink-0 -mb-px
                  ${tab === t.id
                    ? 'border-ton-500 text-ton-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'}
                `}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
                {tabCount[t.id] != null && (
                  <span className="text-xs bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded-full">
                    {tabCount[t.id]}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* tab panels */}
          <div className="fade-in">
            {tab === 'info' && (
              <AccountInfo
                data={accountData}
                tonPrice={tonPrice}
                loading={loadingInfo}
              />
            )}
            {tab === 'txs' && (
              <TransactionList txs={txs} loading={loadingTxs} />
            )}
            {tab === 'jettons' && (
              <div>
                {loadingJettons
                  ? <div className="text-center py-10 text-slate-500">Loading jetton balances...</div>
                  : jettons.length === 0
                    ? <div className="text-center py-10 text-slate-500">
                        <div className="text-4xl mb-2">🪙</div>
                        <p>No jetton balances found</p>
                      </div>
                    : <JettonList jettons={jettons} loading={loadingJettons} />
                }
              </div>
            )}
            {tab === 'nfts' && (
              <div>
                {loadingNfts
                  ? <div className="text-center py-10 text-slate-500">Loading NFTs...</div>
                  : nfts.length === 0
                    ? <div className="text-center py-10 text-slate-500">
                        <div className="text-4xl mb-2">🖼️</div>
                        <p>No NFTs found for this address</p>
                      </div>
                    : <NFTList nfts={nfts} loading={loadingNfts} />
                }
              </div>
            )}
          </div>

          {/* info note */}
          <div className="bg-ton-900/20 border border-ton-700/30 rounded-xl px-4 py-3 text-xs text-ton-300 flex items-start gap-2">
            <span className="flex-shrink-0 mt-0.5">ℹ️</span>
            <p>
              All data is fetched live from <span className="font-mono">toncenter.com/api/v2</span> and{' '}
              <span className="font-mono">tonapi.io/v2</span>.
              Free API tier has rate limits — if a tab fails to load, wait 10 seconds and re-search.
            </p>
          </div>
        </main>
      )}

      {/* ── footer ───────────────────────────────────────────── */}
      <footer className="border-t border-slate-800 py-4 text-center text-xs text-slate-600 mt-10">
        💎 TON Address Search — Live data from toncenter.com + tonapi.io
      </footer>
    </div>
  )
}
