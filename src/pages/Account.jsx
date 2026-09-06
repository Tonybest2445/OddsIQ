import './Account.css'
import { useState } from 'react'
import { useAuth } from '../lib/AuthContext'

function Account() {
  const { user, loading, signUp, signIn, signOut } = useAuth()
  const [mode, setMode] = useState('signIn') // 'signIn' | 'signUp'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [checkEmail, setCheckEmail] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const action = mode === 'signIn' ? signIn : signUp
    const { data, error: authError } = await action(email, password)

    if (authError) {
      setError(authError.message)
    } else if (mode === 'signUp' && !data.session) {
      setCheckEmail(true)
    }

    setSubmitting(false)
  }

  if (loading) {
    return (
      <main className="account">
        <p>Loading…</p>
      </main>
    )
  }

  if (user) {
    return (
      <main className="account">
        <h1>Your account</h1>
        <p className="account__email">{user.email}</p>
        <button onClick={signOut}>Sign out</button>
      </main>
    )
  }

  if (checkEmail) {
    return (
      <main className="account">
        <h1>Check your email</h1>
        <p>We sent a confirmation link to {email}. Click it, then come back and log in.</p>
      </main>
    )
  }

  return (
    <main className="account">
      <h1>{mode === 'signIn' ? 'Log in' : 'Sign up'}</h1>

      <form onSubmit={handleSubmit} className="account__form">
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
        </label>

        {error && <p className="account__error">{error}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? 'Please wait…' : mode === 'signIn' ? 'Log in' : 'Sign up'}
        </button>
      </form>

      <button
        type="button"
        className="account__toggle"
        onClick={() => {
          setMode(mode === 'signIn' ? 'signUp' : 'signIn')
          setError(null)
        }}
      >
        {mode === 'signIn' ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
      </button>
    </main>
  )
}

export default Account
