import './ViewCombo.css'
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
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

function ViewCombo() {
  const { code } = useParams()
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'error'
  const [comboPicks, setComboPicks] = useState([])

  useEffect(() => {
    let cancelled = false

    async function load() {
      setStatus('loading')
      try {
        const res = await fetch(`/api/combo?code=${encodeURIComponent(code)}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Combo not found')

        const matched = data.pickIds
          .map((id) => picks.find((p) => p.id === id))
          .filter(Boolean)

        if (!cancelled) {
          setComboPicks(matched)
          setStatus('ready')
        }
      } catch {
        if (!cancelled) setStatus('error')
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [code])

  if (status === 'loading') {
    return (
      <main className="view-combo">
        <p>Loading combo…</p>
      </main>
    )
  }

  if (status === 'error' || comboPicks.length === 0) {
    return (
      <main className="view-combo">
        <h1>Combo not found</h1>
        <p>This link may be wrong, or the combo has expired.</p>
        <Link to="/">Back to picks</Link>
      </main>
    )
  }

  const combinedOdds = comboPicks.reduce((total, p) => total * p.odds, 1)

  return (
    <main className="view-combo">
      <h1>Shared combo</h1>
      <p>{comboPicks.length} picks, combined odds of {combinedOdds.toFixed(2)}.</p>

      <div className="view-combo__list">
        {comboPicks.map((pick) => (
          <div key={pick.id} className="view-combo__pick">
            <div>
              <p className="view-combo__teams">{pick.homeTeam} vs {pick.awayTeam}</p>
              <p className="view-combo__market">{pick.market}</p>
              <p className="view-combo__kickoff">{formatKickoff(pick.kickoff)}</p>
            </div>
            <span className="view-combo__odds">{pick.odds.toFixed(2)}</span>
          </div>
        ))}
      </div>

      <Link to="/build-combo" className="view-combo__cta">Build your own combo</Link>
    </main>
  )
}

export default ViewCombo
