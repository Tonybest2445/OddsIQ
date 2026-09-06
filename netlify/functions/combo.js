import { getStore } from '@netlify/blobs'

function generateCode(length = 6) {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789' // skips 0/O/1/I/L to avoid mix-ups
  let code = ''
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

export default async (req) => {
  const store = getStore('combos')
  const jsonHeaders = { 'Content-Type': 'application/json' }

  if (req.method === 'POST') {
    let body
    try {
      body = await req.json()
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
        status: 400,
        headers: jsonHeaders,
      })
    }

    const pickIds = Array.isArray(body?.pickIds) ? body.pickIds : []
    if (pickIds.length === 0) {
      return new Response(
        JSON.stringify({ error: 'pickIds is required and must be a non-empty array' }),
        { status: 400, headers: jsonHeaders },
      )
    }

    let code = generateCode()
    let attempts = 1
    while ((await store.get(code)) !== null && attempts < 5) {
      code = generateCode()
      attempts++
    }

    await store.setJSON(code, { pickIds, createdAt: new Date().toISOString() })

    return new Response(JSON.stringify({ code }), { status: 201, headers: jsonHeaders })
  }

  if (req.method === 'GET') {
    const url = new URL(req.url)
    const code = url.searchParams.get('code')

    if (!code) {
      return new Response(JSON.stringify({ error: 'code query parameter is required' }), {
        status: 400,
        headers: jsonHeaders,
      })
    }

    const data = await store.get(code, { type: 'json' })

    if (!data) {
      return new Response(JSON.stringify({ error: 'Combo not found' }), {
        status: 404,
        headers: jsonHeaders,
      })
    }

    return new Response(JSON.stringify(data), { status: 200, headers: jsonHeaders })
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: jsonHeaders,
  })
}

export const config = {
  path: '/api/combo',
}
