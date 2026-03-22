// ─── TON API layer ────────────────────────────────────────
// Uses toncenter.com (free, no key needed) + tonapi.io

const TONCENTER = 'https://toncenter.com/api/v2'
const TONAPI    = 'https://tonapi.io/v2'

// ── helpers ──────────────────────────────────────────────
async function tc(path) {
  const r = await fetch(`${TONCENTER}${path}`)
  const d = await r.json()
  if (!d.ok) throw new Error(d.error || 'TonCenter API error')
  return d.result
}

async function ta(path) {
  const r = await fetch(`${TONAPI}${path}`)
  if (!r.ok) throw new Error(`TON API error ${r.status}`)
  return r.json()
}

// ── exports ───────────────────────────────────────────────

/** Full address info — balance, state, code, data */
export async function getAddressInfo(address) {
  return tc(`/getAddressInformation?address=${encodeURIComponent(address)}`)
}

/** Extended address info — includes parsed account state */
export async function getExtendedAddressInfo(address) {
  return tc(`/getExtendedAddressInformation?address=${encodeURIComponent(address)}`)
}

/** Last N transactions for an address */
export async function getTransactions(address, limit = 20) {
  return tc(`/getTransactions?address=${encodeURIComponent(address)}&limit=${limit}`)
}

/** Detect if address is a jetton wallet and return master info */
export async function getJettonWallet(address) {
  try {
    const d = await ta(`/accounts/${encodeURIComponent(address)}/jettons`)
    return d?.balances ?? []
  } catch {
    return []
  }
}

/** NFTs owned by address */
export async function getNFTs(address) {
  try {
    const d = await ta(`/accounts/${encodeURIComponent(address)}/nfts?limit=20`)
    return d?.nft_items ?? []
  } catch {
    return []
  }
}

/** TON price in USD */
export async function getTONPrice() {
  try {
    const d = await ta('/rates?tokens=ton&currencies=usd')
    return d?.rates?.TON?.prices?.USD ?? null
  } catch {
    return null
  }
}

/** Validate address format (basic check) */
export function isValidAddress(addr) {
  return /^[EeUu][Qq][A-Za-z0-9_-]{46}$/.test(addr.trim())
}

/** Convert nanoton → TON string */
export function nanoToTon(nano, decimals = 4) {
  if (!nano && nano !== 0) return '0'
  return (parseInt(nano) / 1e9).toFixed(decimals)
}

/** Shorten address for display */
export function shortAddr(addr, start = 8, end = 6) {
  if (!addr) return '—'
  return `${addr.slice(0, start)}...${addr.slice(-end)}`
}

/** Unix timestamp → relative time */
export function timeAgo(ts) {
  if (!ts) return ''
  const d = Math.floor(Date.now() / 1000) - ts
  if (d < 60)    return `${d}s ago`
  if (d < 3600)  return `${Math.floor(d / 60)}m ago`
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`
  return `${Math.floor(d / 86400)}d ago`
}

/** Format large numbers */
export function fmt(n) {
  if (n === undefined || n === null) return '—'
  return Number(n).toLocaleString()
}
