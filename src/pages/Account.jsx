import './Account.css'
import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../lib/AuthContext'
import { supabase } from '../lib/supabase'

const PRO_PRICE_NAIRA = 3000
const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY

function Account() {
  const { user, loading, signUp, signIn, signOut } = useAuth()
  const [mode, setMode] = useState('signIn')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [checkEmail, setCheckEmail] = useState(false)

  const [profile, setProfile] = useState(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [paying, setPaying] = useState(false)
  const [payError, setPayError] = useState(null)
  const [copied, setCopied] = useState(false)

  const loadProfile = useCallback(async () => {
    if (!user) return
    setProfileLoading(true)
    const { data } = await supabase
      .from('profiles')
      .select('tier, pro_expires_at, referral_code')
      .eq('id', user.id)
      .single()
    setProfile(data)
    setProfileLoading(false)
  }, [user])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

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

  function handleUpgrade() {
    setPayError(null)
    setPaying(true)

    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: user.email,
      amount: PRO_PRICE_NAIRA * 100,
      currency: 'NGN',
      ref: `oddsiq_${user.id.slice(0, 8)}_${Date.now()}`,
      callback: function (response) {
        confirmPayment(response.reference)
      },
      onClose: function () {
        setPaying(false)
      },
    })
    handler.openIframe()
  }

  async function confirmPayment(reference) {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      const res = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ reference }),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Could not confirm payment')

      await loadProfile()
    } catch (err) {
      setPayError(err.message)
    } finally {
      setPaying(false)
    }
  }

  function copyReferralLink() {
    const link = `${window.location.origin}/?ref=${profile.referral_code}`
    navigator.clipboard
      .writeText(link)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
      .catch(() => {})
  }

  if (loading) {
    return (
      <main className="account">
        <p>Loading…</p>
      </main>
    )
  }

  if (user) {
    const isPro =
      profile?.tier === 'pro' &&
      profile?.pro_expires_at &&
      new Date(profile.pro_expires_at) > new Date()

    return (
      <main className="account">
        <h1>Your account</h1>
        <p className="account__email">{user.email}</p>

        {profileLoading ? (
          <p>Checking membership…</p>
        ) : (
          <>
            {isPro ? (
              <div className="account__tier account__tier--pro">
                <p>
                  You're on <strong>Pro</strong>.
                </p>
                <p className="account__expires">
                  Renews/expires {new Date(profile.pro_expires_at).toLocaleDateString('en-GB')}
                </p>
              </div>
            ) : (
              <div className="account__tier">
                <p>
                  You're on the <strong>Free</strong> plan.
                </p>
                <p className="account__upsell">
                  Upgrade to Pro for ₦{PRO_PRICE_NAIRA.toLocaleString()}/month to unlock the full
                  reasoning behind every pick.
                </p>
                {payError && <p className="account__error">{payError}</p>}
                <button onClick={handleUpgrade} disabled={paying}>
                  {paying
                    ? 'Processing…'
                    : `Upgrade to Pro — ₦${PRO_PRICE_NAIRA.toLocaleString()}/month`}
                </button>
              </div>
            )}

            {profile?.referral_code && (
              <div className="account__referral">
                <p>Share your link — you'll get credit for anyone who signs up through it.</p>
                <div className="account__referral-row">
                  <code>{`${window.location.origin}/?ref=${profile.referral_code}`}</code>
                  <button onClick={copyReferralLink}>{copied ? 'Copied!' : 'Copy'}</button>
                </div>
              </div>
            )}
          </>
        )}

        <button className="account__signout" onClick={signOut}>
          Sign out
        </button>
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
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
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
