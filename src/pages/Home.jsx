import './Home.css'
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

function PickTicket({ pick }) {
  return (
    <div className="pick-ticket">
      <div className="pick-ticket__match">
        <span className="pick-ticket__league">{pick.league}</span>
        <h2 className="pick-ticket__teams">
          {pick.homeTeam} <span className="pick-ticket__vs">vs</span> {pick.awayTeam}
        </h2>
        <span className="pick-ticket__kickoff">{formatKickoff(pick.kickoff)}</span>
      </div>
      <div className="pick-ticket__divider" />
      <div className="pick-ticket__pick">
        <p className="pick-ticket__market">{pick.market}</p>
        <div className="pick-ticket__stats">
          <span className="pick-ticket__confidence">{pick.confidence}%</span>
          <span className={`pick-ticket__risk pick-ticket__risk--${pick.risk}`}>
            {pick.risk} risk
          </span>
        </div>
        <p className="pick-ticket__reasoning">{pick.reasoning}</p>
      </div>
    </div>
  )
}

function PickRow({ pick }) {
  return (
    <div className="pick-row">
      <div>
        <p className="pick-row__teams">{pick.homeTeam} vs {pick.awayTeam}</p>
        <p className="pick-row__market">{pick.market}</p>
      </div>
      {pick.status === 'pending' ? (
        <span className="pick-row__confidence">{pick.confidence}%</span>
      ) : (
        <span className={`pick-row__result pick-row__result--${pick.status}`}>
          {pick.status}
        </span>
      )}
    </div>
  )
}

function Home() {
  const pending = picks
    .filter((p) => p.status === 'pending')
    .sort((a, b) => b.confidence - a.confidence)
  const [topPick, ...otherPicks] = pending
  const settled = picks.filter((p) => p.status === 'won' || p.status === 'lost')

  return (
    <main className="home">
      <section className="hero">
        <div className="hero__text">
          <h1>Football and basketball picks, graded before kickoff.</h1>
          <p>
            Every pick shows its confidence, its risk, and the reasoning behind
            it — plus a public record of what actually happened.
          </p>
        </div>
        {topPick && <PickTicket pick={topPick} />}
      </section>

      {otherPicks.length > 0 && (
        <section className="picks-list">
          <h2>Also grading today</h2>
          {otherPicks.map((pick) => (
            <PickRow key={pick.id} pick={pick} />
          ))}
        </section>
      )}

      {settled.length > 0 && (
        <section className="picks-list">
          <h2>Recent results</h2>
          {settled.map((pick) => (
            <PickRow key={pick.id} pick={pick} />
          ))}
        </section>
      )}
    </main>
  )
}

export default Home
