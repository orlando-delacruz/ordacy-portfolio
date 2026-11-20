import assert from 'node:assert/strict'
import test from 'node:test'
import {
  clientIp,
  emailNotification,
  hashIp,
  inquiryRecord,
  processInquiry,
  throttleDecision,
  validateInquiry,
} from '../api/_lib/inquiries.mjs'
import handler from '../api/inquiries.mjs'

const NOW = new Date('2026-11-20T10:00:00.000Z')

const minimal = () => ({
  name: 'Ana Cruz',
  email: 'ana@example.com',
  message: 'We need a booking system.',
})

function fakeRes() {
  return {
    statusCode: 0,
    headers: {},
    body: '',
    setHeader(name, value) {
      this.headers[name] = value
    },
    end(body) {
      this.body = body ?? ''
    },
  }
}

const eventsOf = (events) => events

function makeDeps(events) {
  return {
    findInquiry: async () => {
      events.push('find')
      return false
    },
    consumeThrottle: async () => {
      events.push('throttle')
      return { allowed: true }
    },
    insertInquiry: async () => {
      events.push('insert')
      return true
    },
    sendNotification: async () => {
      events.push('email')
    },
    logEmailFailure: () => {
      events.push('log')
    },
    randomId: () => 'generated1',
  }
}

/* ---------- Payload validation ---------- */

test('inquiry validation accepts and normalizes the documented payload', () => {
  const minimalResult = validateInquiry(minimal())
  assert.equal(minimalResult.ok, true)
  assert.deepEqual(minimalResult.value, {
    id: null,
    name: 'Ana Cruz',
    email: 'ana@example.com',
    business: null,
    service: null,
    plan: null,
    message: 'We need a booking system.',
    launchDate: null,
  })

  const full = validateInquiry({
    id: 'inquiry-abc12345',
    name: '  Ana Cruz  ',
    email: ' ana@example.com ',
    business: ' Acme ',
    service: ' Website ',
    plan: ' Growth ',
    message: '  We need a booking system.  ',
    launchDate: '2028-02-29',
  })
  assert.equal(full.ok, true)
  assert.deepEqual(full.value, {
    id: 'inquiry-abc12345',
    name: 'Ana Cruz',
    email: 'ana@example.com',
    business: 'Acme',
    service: 'Website',
    plan: 'Growth',
    message: 'We need a booking system.',
    launchDate: '2028-02-29',
  })

  assert.equal(validateInquiry({ ...minimal(), business: '   ' }).value.business, null)
  assert.equal(validateInquiry({ ...minimal(), id: '' }).value.id, null)
})

test('inquiry validation rejects the documented invalid cases', () => {
  const cases = [
    ['missing name', { ...minimal(), name: undefined }, 'name'],
    ['short name', { ...minimal(), name: 'A' }, 'name'],
    ['long name', { ...minimal(), name: 'a'.repeat(121) }, 'name'],
    ['missing email', { ...minimal(), email: undefined }, 'email'],
    ['invalid email', { ...minimal(), email: 'ana.example.com' }, 'email'],
    [
      'long email',
      { ...minimal(), email: `${'a'.repeat(190)}@example.com` },
      'email',
    ],
    ['missing message', { ...minimal(), message: undefined }, 'message'],
    ['short message', { ...minimal(), message: 'too short' }, 'message'],
    ['long message', { ...minimal(), message: 'x'.repeat(5001) }, 'message'],
    ['long business', { ...minimal(), business: 'x'.repeat(121) }, 'business'],
    ['long service', { ...minimal(), service: 'x'.repeat(121) }, 'service'],
    ['long plan', { ...minimal(), plan: 'x'.repeat(161) }, 'plan'],
    [
      'impossible date',
      { ...minimal(), launchDate: '2027-02-29' },
      'launchDate',
    ],
    ['bad date form', { ...minimal(), launchDate: '20-11-2026' }, 'launchDate'],
    ['bad id prefix', { ...minimal(), id: 'draft-123' }, 'id'],
    ['blank id suffix', { ...minimal(), id: 'inquiry-' }, 'id'],
  ]

  for (const [label, body, field] of cases) {
    const result = validateInquiry(body)
    assert.equal(result.ok, false, label)
    assert.ok(result.errors[field], `${label} reports ${field}`)
  }

  const notObject = validateInquiry(null)
  assert.equal(notObject.ok, false)
  assert.ok(notObject.errors.body)
})

/* ---------- IP hashing ---------- */

test('client IP uses the first forwarded entry and never stores the raw value', () => {
  assert.equal(clientIp('203.0.113.5, 70.41.3.18', ''), '203.0.113.5')
  assert.equal(clientIp('', '::1'), '::1')
  assert.equal(clientIp(undefined, ''), 'unknown')
  assert.equal(clientIp(['198.51.100.4']), '198.51.100.4')

  const hash = hashIp('203.0.113.5', 'salt')
  assert.match(hash, /^[a-f0-9]{64}$/)
  assert.equal(hash, hashIp('203.0.113.5', 'salt'))
  assert.notEqual(hash, hashIp('203.0.113.5', 'other-salt'))
  assert.equal(hash.includes('203'), false)
})

/* ---------- Throttle ---------- */

test('throttle allows three requests per window and resets after 15 minutes', () => {
  let state = null
  for (let count = 1; count <= 3; count += 1) {
    const decision = throttleDecision(state, NOW)
    assert.equal(decision.allowed, true, `request ${count} allowed`)
    assert.equal(decision.count, count)
    state = {
      window_start: decision.windowStart,
      request_count: decision.count,
    }
  }

  const fourth = throttleDecision(state, NOW)
  assert.equal(fourth.allowed, false)
  assert.equal(fourth.count, 4)

  const justBefore = new Date('2026-11-20T10:14:59.999Z')
  assert.equal(throttleDecision(state, justBefore).allowed, false)

  const boundary = new Date('2026-11-20T10:15:00.000Z')
  const reset = throttleDecision(state, boundary)
  assert.equal(reset.allowed, true)
  assert.equal(reset.count, 1)
  assert.equal(reset.windowStart, '2026-11-20T10:15:00.000Z')

  // A malformed or future window starts over instead of blocking forever.
  assert.equal(
    throttleDecision({ window_start: 'nope', request_count: 3 }, NOW).allowed,
    true,
  )
  assert.equal(
    throttleDecision(
      { window_start: '2026-11-20T11:00:00.000Z', request_count: 3 },
      NOW,
    ).allowed,
    true,
  )
})

/* ---------- Request flow ---------- */

test('honeypot short-circuits before validation, throttle, insert, and email', async () => {
  const events = []
  const result = await processInquiry({
    body: { ...minimal(), website: 'https://spam.example' },
    ip: '203.0.113.5',
    now: NOW,
    deps: makeDeps(events),
  })

  assert.equal(result.status, 201)
  assert.deepEqual(result.body, { ok: true })
  assert.deepEqual(eventsOf(events), [])
})

test('an existing id is idempotent: 200 with no throttle, insert, or email', async () => {
  const events = []
  const deps = makeDeps(events)
  deps.findInquiry = async () => {
    events.push('find')
    return true
  }

  const result = await processInquiry({
    body: { ...minimal(), id: 'inquiry-existing' },
    ip: '203.0.113.5',
    now: NOW,
    deps,
  })

  assert.equal(result.status, 200)
  assert.deepEqual(result.body, {
    ok: true,
    id: 'inquiry-existing',
    duplicate: true,
  })
  assert.deepEqual(events, ['find'])
})

test('the inquiry is saved before email, and a failed email still returns 201', async () => {
  const events = []
  const saved = []
  const deps = makeDeps(events)
  deps.insertInquiry = async (record) => {
    events.push('insert')
    saved.push(record)
    return true
  }
  deps.sendNotification = async () => {
    events.push('email')
    throw new Error('EmailJS is not configured')
  }
  deps.logEmailFailure = (id, error) => {
    events.push('log')
    assert.equal(id, 'inquiry-generated1')
    assert.match(error.message, /not configured/)
  }

  const result = await processInquiry({
    body: minimal(),
    ip: '203.0.113.5',
    now: NOW,
    deps,
  })

  assert.equal(result.status, 201)
  assert.deepEqual(result.body, { ok: true, id: 'inquiry-generated1' })
  assert.deepEqual(events, ['find', 'throttle', 'insert', 'email', 'log'])
  assert.equal(saved.length, 1)
  assert.deepEqual(saved[0], {
    id: 'inquiry-generated1',
    fullName: 'Ana Cruz',
    email: 'ana@example.com',
    company: null,
    projectType: null,
    budgetRange: null,
    details: 'We need a booking system.',
    targetLaunchDate: null,
    status: 'new',
    submittedAt: NOW.toISOString(),
  })
})

test('a duplicate insert race returns 200 and does not email again', async () => {
  const events = []
  const deps = makeDeps(events)
  deps.insertInquiry = async () => {
    events.push('insert')
    return false
  }

  const result = await processInquiry({
    body: { ...minimal(), id: 'inquiry-race' },
    ip: '203.0.113.5',
    now: NOW,
    deps,
  })

  assert.equal(result.status, 200)
  assert.equal(result.body.duplicate, true)
  assert.deepEqual(events, ['find', 'throttle', 'insert'])
})

test('a denied throttle returns 429 before any insert', async () => {
  const events = []
  const deps = makeDeps(events)
  deps.consumeThrottle = async () => {
    events.push('throttle')
    return { allowed: false }
  }

  const result = await processInquiry({
    body: minimal(),
    ip: '203.0.113.5',
    now: NOW,
    deps,
  })

  assert.equal(result.status, 429)
  assert.deepEqual(events, ['find', 'throttle'])
})

test('invalid payloads stop before the database and return a field list', async () => {
  const events = []
  const result = await processInquiry({
    body: { ...minimal(), email: 'not-an-email' },
    ip: '203.0.113.5',
    now: NOW,
    deps: makeDeps(events),
  })

  assert.equal(result.status, 400)
  assert.equal(result.body.error, 'invalid inquiry')
  assert.ok(result.body.fields.email)
  assert.deepEqual(events, [])
})

/* ---------- EmailJS request shape ---------- */

test('EmailJS body carries the private key as accessToken and the template variables', () => {
  const record = inquiryRecord(
    validateInquiry({
      ...minimal(),
      business: 'Acme',
      service: 'Website',
      plan: 'Growth',
      launchDate: '2026-12-01',
    }).value,
    'inquiry-abc',
    NOW,
  )

  assert.deepEqual(
    emailNotification(record, {
      serviceId: 'service_test',
      templateId: 'template_test',
      publicKey: 'public_test',
      privateKey: 'private_test',
    }),
    {
      service_id: 'service_test',
      template_id: 'template_test',
      user_id: 'public_test',
      accessToken: 'private_test',
      template_params: {
        name: 'Ana Cruz',
        email: 'ana@example.com',
        business: 'Acme',
        service: 'Website',
        plan: 'Growth',
        message: 'We need a booking system.',
        launch_date: '2026-12-01',
        submitted_at: NOW.toISOString(),
      },
    },
  )
})

/* ---------- HTTP guard ---------- */

test('the endpoint allows POST only', async () => {
  const res = fakeRes()
  await handler({ method: 'GET', headers: {}, socket: {} }, res)

  assert.equal(res.statusCode, 405)
  assert.equal(res.headers.Allow, 'POST')
  assert.deepEqual(JSON.parse(res.body), { error: 'method not allowed' })
})

test('a missing INQUIRY_IP_SALT fails closed with 500', async () => {
  const previous = process.env.INQUIRY_IP_SALT
  const log = console.error
  delete process.env.INQUIRY_IP_SALT
  console.error = () => {}

  try {
    const res = fakeRes()
    await handler(
      { method: 'POST', headers: {}, socket: {}, body: minimal() },
      res,
    )
    assert.equal(res.statusCode, 500)
    assert.deepEqual(JSON.parse(res.body), {
      error: 'inquiry service is not configured',
    })
  } finally {
    console.error = log
    if (previous === undefined) delete process.env.INQUIRY_IP_SALT
    else process.env.INQUIRY_IP_SALT = previous
  }
})
