import CopyButton from './CopyButton'
import { SkeletonBlock } from './Skeleton'
import { nanoToTon, shortAddr, fmt } from '../api/ton'

// ── small helpers ─────────────────────────────────────────

function StatCard({ icon, label, value, sub, accent }) {
  return (
    <div className={`
      bg-slate-800 border rounded-2xl p-5
      ${accent ? 'border-ton-600/50 shadow-lg shadow-ton-900/20' : 'border-slate-700/50'}
    `}>
      <div className="text-2xl mb-3">{icon}</div>
      <div className={`font-bold text-xl hash ${accent ? 'text-ton-400' : 'text-slate-100'}`}>
        {value}
      </div>
      <div className="text-xs text-slate-400 mt-0.5">{label}</div>
      {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
    </div>
  )
}

function InfoRow({ label, value, mono = false, copy = false }) {
  if (!value && value !== 0) return null
  return (
    <div className="flex items-start justify-between py-2.5 border-b border-slate-700/40 last:border-0 gap-4">
      <span className="text-xs text-slate-400 flex-shrink-0 w-36">{label}</span>
      <div className="flex items-center gap-1 min-w-0">
        <span className={`text-xs text-slate-200 text-right break-all ${mono ? 'hash' : ''}`}>
          {String(value)}
        </span>
        {copy && <CopyButton text={String(value)} />}
      </div>
    </div>
  )
}

function StateBadge({ state }) {
  const map = {
    active:          { color: 'bg-green-900/50 text-green-400 border-green-700/50', label: '✅ Active' },
    uninitialized:   { color: 'bg-yellow-900/50 text-yellow-400 border-yellow-700/50', label: '⚠️ Uninitialized' },
    frozen:          { color: 'bg-red-900/50 text-red-400 border-red-700/50', label: '🧊 Frozen' },
    nonexist:        { color: 'bg-slate-700/50 text-slate-400 border-slate-600/50', label: '❌ Non-existent' },
  }
  const s = map[state] || map['nonexist']
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full border ${s.color}`}>
      {s.label}
    </span>
  )
}

// ── main component ────────────────────────────────────────

export default function AccountInfo({ data, tonPrice, loading }) {
  if (loading) return <SkeletonBlock />

  if (!data) return null

  const { info, extended } = data

  const balanceTON   = nanoToTon(info?.balance, 6)
  const balanceUSD   = tonPrice && info?.balance
    ? `$${(parseFloat(balanceTON) * tonPrice).toFixed(2)}`
    : null

  const isContract   = !!info?.code
  const accountType  = isContract ? '📜 Smart Contract' : '👛 Wallet'

  return (
    <div className="space-y-6 fade-in">

      {/* ── top stat cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          icon="💎"
          label="TON Balance"
          value={`${balanceTON} TON`}
          sub={balanceUSD || undefined}
          accent
        />
        <StatCard
          icon="🔋"
          label="Account State"
          value={<StateBadge state={info?.state} />}
        />
        <StatCard
          icon="📄"
          label="Account Type"
          value={accountType}
          sub={isContract ? 'Has deployed code' : 'No contract code'}
        />
        <StatCard
          icon="🔢"
          label="Last Tx LT"
          value={info?.last_transaction_id?.lt
            ? fmt(info.last_transaction_id.lt)
            : '—'}
          sub="Logical time"
        />
      </div>

      {/* ── address details ── */}
      <div className="bg-slate-800 border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-700/50 bg-slate-700/20 flex items-center gap-2">
          <span>📍</span>
          <span className="font-semibold text-sm">Address Details</span>
        </div>
        <div className="px-5 py-2">
          <InfoRow label="Address"        value={info?.address}                            mono copy />
          <InfoRow label="State"          value={info?.state} />
          <InfoRow label="Balance (nano)" value={info?.balance}                            mono copy />
          <InfoRow label="Balance (TON)"  value={`${balanceTON} TON`} />
          <InfoRow label="Balance (USD)"  value={balanceUSD || 'N/A'} />
          <InfoRow label="Has Code"       value={isContract ? 'Yes — Smart Contract' : 'No — Regular Wallet'} />
          <InfoRow label="Last Tx Hash"   value={info?.last_transaction_id?.hash}          mono copy />
          <InfoRow label="Last Tx LT"     value={info?.last_transaction_id?.lt}            mono />
        </div>
      </div>

      {/* ── extended / parsed info ── */}
      {extended && (
        <div className="bg-slate-800 border border-slate-700/50 rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-700/50 bg-slate-700/20 flex items-center gap-2">
            <span>🔬</span>
            <span className="font-semibold text-sm">Extended Info</span>
          </div>
          <div className="px-5 py-2">
            <InfoRow label="Sync Utime"   value={extended.sync_utime
              ? new Date(extended.sync_utime * 1000).toUTCString()
              : undefined} />
            <InfoRow label="Account Type" value={extended['@type']} mono />
            {extended.account_state?.['@type'] && (
              <InfoRow label="State Type"  value={extended.account_state['@type']} mono />
            )}
            {extended.account_state?.frozen_hash && (
              <InfoRow label="Frozen Hash" value={extended.account_state.frozen_hash} mono copy />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
