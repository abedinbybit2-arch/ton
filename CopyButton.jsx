import { useState } from 'react'

export default function CopyButton({ text, className = '' }) {
  const [copied, setCopied] = useState(false)

  const handle = (e) => {
    e.stopPropagation()
    try { navigator.clipboard.writeText(text) } catch {}
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      onClick={handle}
      title="Copy"
      className={`ml-1 text-slate-500 hover:text-ton-400 transition-colors text-xs ${className}`}
    >
      {copied ? '✅' : '📋'}
    </button>
  )
}
