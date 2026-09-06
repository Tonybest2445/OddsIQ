import './BuildCombo.css'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { picks } from '../data/picks'

function formatKickoff(iso) {
  return new Date(iso).toLocaleString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function BuildCombo() {
  const available = picks.filter((p) => p.status === 'pending')
  const [selectedIds, setSelectedIds] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [resultCode, setResultCode] = useState(null)

  const selectedPicks = available.filter((p) => selectedIds.includes(p.id))
  const combinedOdds = selectedPicks.reduce((total, p) => total * p.odds, 1)

  function toggle(id) {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((existing) => existing !== id) : [...current, id],
    )
  }

  async function handleGenerate() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/combo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pickIds: selectedIds }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setResultCode(data.code)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (resultCode) {
    const shareUrl = `${window.location.origin}/combo/${resultCode}`
    return (
      <main className="build-combo">
        <h1>Your combo is ready</h1>
        <p>
          Share this link — anyone who opens it sees the same {selectedPicks.length}-pick combo.
        </p>
        <div className="combo-result">
          <code>{shareUrl}</code>
          <button onClick={() => navigator.clipboard.writeText(shareUrl).catch(() => {})}>
            Copy link
          </button>
        </div>
        <Link to="/">Back to picks</Link>
      </main>
    )
  }

  return (
    <main className="build-combo">
      <h1>Build a combo</h1>
      <p>Select a few picks to bundle into one shareable combo.</p>

      <div className="combo-picks">
        {available.map((pick) => {
          const isSelected = selectedIds.includes(pick.id)
          return (
            <button
              key={pick.id}
              type="button"
              className={`combo-pick${isSelected ? ' combo-pick--selected' : ''}`}
              onClick={() => toggle(pick.id)}
            >
              <div>
                <p className="combo-pick__teams">
                  {pick.homeTeam} vs {pick.awayTeam}
                </p>
                <p className="combo-pick__market">{pick.market}</p>
                <p className="combo-pick__kickoff">{formatKickoff(pick.kickoff)}</p>
              </div>
              <span className="combo-pick__odds">{pick.odds.toFixed(2)}</span>
            </button>
          )
        })}
      </div>

      {selectedIds.length > 0 && (
        <div className="combo-summary">
          <p className="combo-summary__count">
            {selectedIds.length} pick{selectedIds.length === 1 ? '' : 's'} selected
          </p>
          <p className="combo-summary__odds">
            Combined odds: <strong>{combinedOdds.toFixed(2)}</strong>
          </p>
          {error && <p className="combo-error">{error}</p>}
          <button onClick={handleGenerate} disabled={loading}>
            {loading ? 'Generating…' : 'Generate shareable link'}
          </button>
        </div>
      )}
    </main>
  )
}

export default BuildCombo
