/**
 * @typedef {Object} Pick
 * @property {string} id
 * @property {'football'|'basketball'} sport
 * @property {string} league
 * @property {string} homeTeam
 * @property {string} awayTeam
 * @property {string} kickoff - ISO date string
 * @property {string} market
 * @property {number} odds - decimal odds
 * @property {number} confidence - 0-100
 * @property {'low'|'medium'|'high'} risk
 * @property {string} reasoning
 * @property {'pending'|'won'|'lost'|'void'} status
 */

/** @type {Pick[]} */
export const picks = [
  {
    id: 'pk_001',
    sport: 'football',
    league: 'Premier League',
    homeTeam: 'Manchester City',
    awayTeam: 'Arsenal',
    kickoff: '2026-09-13T15:30:00Z',
    market: 'Over 2.5 Goals',
    odds: 1.85,
    confidence: 87,
    risk: 'low',
    reasoning: 'Both sides have gone over 2.5 goals in 8 of their last 10 meetings, and City are missing their starting defensive midfielder.',
    status: 'pending',
  },
  {
    id: 'pk_002',
    sport: 'basketball',
    league: 'NBA',
    homeTeam: 'Boston Celtics',
    awayTeam: 'Miami Heat',
    kickoff: '2026-09-10T23:00:00Z',
    market: 'Celtics -4.5',
    odds: 1.9,
    confidence: 65,
    risk: 'medium',
    reasoning: 'Miami are on the second night of a back-to-back and have lost their starting center to injury.',
    status: 'pending',
  },
  {
    id: 'pk_003',
    sport: 'football',
    league: 'Bundesliga',
    homeTeam: 'Bayern Munich',
    awayTeam: 'Borussia Dortmund',
    kickoff: '2026-09-14T18:30:00Z',
    market: 'Both Teams to Score',
    odds: 1.6,
    confidence: 71,
    risk: 'medium',
    reasoning: 'Both teams have scored in 6 straight meetings, and Dortmund have struggled defensively away from home this season.',
    status: 'pending',
  },
  {
    id: 'pk_004',
    sport: 'football',
    league: 'La Liga',
    homeTeam: 'Real Madrid',
    awayTeam: 'Real Sociedad',
    kickoff: '2026-08-30T19:00:00Z',
    market: 'Real Madrid to Win',
    odds: 1.45,
    confidence: 78,
    risk: 'low',
    reasoning: 'Real Madrid were unbeaten at home last season and Real Sociedad are missing two starting defenders.',
    status: 'won',
  },
  {
    id: 'pk_005',
    sport: 'football',
    league: 'Premier League',
    homeTeam: 'Liverpool',
    awayTeam: 'Chelsea',
    kickoff: '2026-08-31T14:00:00Z',
    market: 'Over 2.5 Goals',
    odds: 1.75,
    confidence: 82,
    risk: 'low',
    reasoning: 'Liverpool have gone over 2.5 goals in six of their last seven home games.',
    status: 'won',
  },
  {
    id: 'pk_006',
    sport: 'basketball',
    league: 'NBA',
    homeTeam: 'Denver Nuggets',
    awayTeam: 'LA Lakers',
    kickoff: '2026-08-28T02:00:00Z',
    market: 'Under 224.5 Total Points',
    odds: 1.95,
    confidence: 58,
    risk: 'high',
    reasoning: 'Both defenses rank top-10 in pace-adjusted efficiency, but this market has been volatile all season.',
    status: 'lost',
  },
]
