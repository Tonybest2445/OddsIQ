import { createClient } from '@supabase/supabase-js'

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY
const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const PRO_PRICE_KOBO = 300000 // ₦3,000 in kobo

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

export default async (req) => {
  const jsonHeaders = { 'Content-Type': 'application/json' }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: jsonHeaders,
    })
  }

  // Confirm who's actually asking — never trust a user id sent from the browser
  const authHeader = req.headers.get('Authorization') || ''
  const accessToken = authHeader.replace('Bearer ', '')

  if (!accessToken) {
    return new Response(JSON.stringify({ error: 'Not logged in' }), {
      status: 401,
      headers: jsonHeaders,
    })
  }

  const {
    data: { user },
    error: userError,
  } = await supabaseAdmin.auth.getUser(accessToken)

  if (userError || !user) {
    return new Response(JSON.stringify({ error: 'Invalid session' }), {
      status: 401,
      headers: jsonHeaders,
    })
  }

  // Confirm the payment actually happened — never trust the browser's "it worked"
  let body
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: jsonHeaders,
    })
  }

  const reference = body?.reference
  if (!reference) {
    return new Response(JSON.stringify({ error: 'reference is required' }), {
      status: 400,
      headers: jsonHeaders,
    })
  }

  const verifyRes = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    { headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` } },
  )
  const verifyData = await verifyRes.json()
  const transaction = verifyData?.data

  const isValidPayment =
    verifyRes.ok &&
    transaction &&
    transaction.status === 'success' &&
    transaction.amount === PRO_PRICE_KOBO &&
    transaction.currency === 'NGN'

  if (!isValidPayment) {
    return new Response(JSON.stringify({ error: 'Payment could not be verified' }), {
      status: 400,
      headers: jsonHeaders,
    })
  }

  // Both checks passed — upgrade this specific user
  const proExpiresAt = new Date()
  proExpiresAt.setDate(proExpiresAt.getDate() + 30)

  const { error: updateError } = await supabaseAdmin
    .from('profiles')
    .update({ tier: 'pro', pro_expires_at: proExpiresAt.toISOString() })
    .eq('id', user.id)

  if (updateError) {
    return new Response(JSON.stringify({ error: 'Could not update membership' }), {
      status: 500,
      headers: jsonHeaders,
    })
  }

  return new Response(
    JSON.stringify({ success: true, expiresAt: proExpiresAt.toISOString() }),
    { status: 200, headers: jsonHeaders },
  )
}

export const config = {
  path: '/api/verify-payment',
}
