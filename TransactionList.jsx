import { SkeletonRow } from './Skeleton'
import CopyButton from './CopyButton'
import { nanoToTon, shortAddr, timeAgo } from '../api/ton'

function TxTypeBadge({ inMsg, outMsgs }) {
  const hasIn  = inMsg?.source
  const hasOut = outMsgs?.length > 0

  if (hasIn && hasOut)  return <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-purple-900/40 text-purple-400 border border-purple-700/40">↕ In + Out</span>
  if (hasIn)            return <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-green-900/40 text-green-400 border border-green-700/40">↓ Incoming</span>
  if (hasOut)           return <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-blue-900/40 text-blue-400 border border-blue-700/40">↑ Outgoing</span>
  return                        <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-400">— Internal</span>
}

export default function TransactionList({ txs, loading }) {
  if (loading) {
    return (
      <div className="bg-slate-800 border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-700/50">
          <span className="font-semibold text-sm">🔄 Transactions</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <tbody>{Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} cols={6} />)}</tbody>
          </table>
        </div>
      </div>
    )
  }

  if (!txs?.length) return (
    <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-10 text-center text-slate-500">
      <div className="text-4xl mb-2">📭</div>
      <p className="text-sm">No transactions found</p>
    </div>
  )

  return (
    <div className="bg-slate-800 border border-slate-700/50 rounded-2xl overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-700/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>🔄</span>
          <span className="font-semibold text-sm">Transactions</span>
          <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">
            {txs.length}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-green-400">Live from blockchain</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-xs text-slate-500 border-b border-slate-700/40">
              <th className="px-4 py-2.5 text-left font-medium">Hash</th>
              <th className="px-4 py-2.5 text-left font-medium">Type</th>
              <th className="px-4 py-2.5 text-left font-medium">From</th>
              <th className="px-4 py-2.5 text-left font-medium">To</th>
              <th className="px-4 py-2.5 text-right font-medium">Amount</th>
              <th className="px-4 py-2.5 text-right font-medium">Fee</th>
              <th className="px-4 py-2.5 text-right font-medium">Time</th>
            </tr>
          </thead>
          <tbody>
            {txs.map((tx, i) => {
              const hash    = tx.transaction_id?.hash || ''
              const inMsg   = tx.in_msg
              const outMsgs = tx.out_msgs || []
              const outMsg  = outMsgs[0]
              const value   = inMsg?.value || outMsg?.value || 0
              const fee     = tx.fee || 0
              const from    = inMsg?.source
              const to      = inMsg?.destination || outMsg?.destination

              return (
                <tr
                  key={hash + i}
                  className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors"
                  style={{ animation: `fadeInUp 0.3s ease ${i * 0.025}s both` }}
                >
                  {/* Hash */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                      <span className="hash text-xs text-ton-400 cursor-pointer hover:underline" title={hash}>
                        {hash ? hash.slice(0, 10) + '...' : '—'}
                      </span>
                      {hash && <CopyButton text={hash} />}
                    </div>
                  </td>

                  {/* Type */}
                  <td className="px-4 py-3">
                    <TxTypeBadge inMsg={inMsg} outMsgs={outMsgs} />
                  </td>

                  {/* From */}
                  <td className="px-4 py-3">
                    <span className="hash text-xs text-slate-400" title={from}>
                      {from ? shortAddr(from, 6, 4) : '—'}
                    </span>
                    {from && <CopyButton text={from} />}
                  </td>

                  {/* To */}
                  <td className="px-4 py-3">
                    <span className="hash text-xs text-slate-400" title={to}>
                      {to ? shortAddr(to, 6, 4) : '—'}
                    </span>
                    {to && <CopyButton text={to} />}
                  </td>

                  {/* Amount */}
                  <td className="px-4 py-3 text-right">
                    <span className="font-semibold text-sm text-slate-200">{nanoToTon(value)}</span>
                    <span className="text-xs text-slate-500 ml-1">TON</span>
                  </td>

                  {/* Fee */}
                  <td className="px-4 py-3 text-right">
                    <span className="hash text-xs text-slate-500">{nanoToTon(fee, 6)}</span>
                  </td>

                  {/* Time */}
                  <td className="px-4 py-3 text-right text-xs text-slate-500">
                    {timeAgo(tx.utime)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
