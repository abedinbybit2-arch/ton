import { useState } from 'react'
import { isValidAddress } from '../api/ton'

export default function SearchBar({ onSearch, loading }) {
  const [value, setValue] = useState('')
  const [error, setError]  = useState('')

  const submit = () => {
    const trimmed = value.trim()
    if (!trimmed) { setError('Please enter a TON address'); return }
    // Light validation — accept anything that starts with EQ/UQ or is 48 chars
    if (trimmed.length < 10) { setError('Address is too short'); return }
    setError('')
    onSearch(trimmed)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') submit()
  }

  const examples = [
    'EQCkR1cGmnsE45N4K0otPl5EnxnRakmGqeJUNua5fkWhales',
    'EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c',
  ]

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Input row */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-base select-none">
            🔍
          </span>
          <input
            value={value}
            onChange={e => { setValue(e.target.value); setError('') }}
            onKeyDown={handleKey}
            placeholder="Enter TON address  (EQ... or UQ...)"
            spellCheck={false}
            className="
              w-full bg-slate-800 border border-slate-600 
              text-slate-100 placeholder-slate-500
              rounded-xl pl-9 pr-4 py-3 text-sm hash
              outline-none transition-all duration-200
              focus:border-ton-500 focus:bg-slate-700/60
            "
          />
        </div>
        <button
          onClick={submit}
          disabled={loading}
          className="
            bg-ton-600 hover:bg-ton-500 disabled:opacity-50
            text-white font-semibold px-6 py-3 rounded-xl
            transition-all duration-200 flex items-center gap-2
            flex-shrink-0 text-sm shadow-lg shadow-ton-900/30
          "
        >
          {loading
            ? <><span className="animate-spin">⏳</span> Searching...</>
            : <><span>🔎</span> Search</>
          }
        </button>
      </div>

      {/* Error */}
      {error && (
        <p className="mt-2 text-xs text-red-400 flex items-center gap-1">
          <span>⚠️</span>{error}
        </p>
      )}

      {/* Example addresses */}
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="text-xs text-slate-500">Try:</span>
        {examples.map((ex, i) => (
          <button
            key={i}
            onClick={() => { setValue(ex); setError('') }}
            className="
              text-xs hash text-ton-400 hover:text-ton-300
              bg-slate-800 hover:bg-slate-700
              border border-slate-700 hover:border-ton-600
              px-2 py-1 rounded-lg transition-all truncate max-w-xs
            "
          >
            {ex.slice(0, 20)}...
          </button>
        ))}
      </div>
    </div>
  )
}
