import assert from 'node:assert/strict'
import test from 'node:test'
import {
  authorizeAdmin,
  authorizeFactor,
  authorizeOwner,
  bearerToken,
  decodeJwtPayload,
  isHttpsUrl,
  isKnownIcon,
  isKnownResource,
  isCollectionResource,
  isDocumentResource,
  isSafeUrl,
  orderRecords,
  sanitizeSettingsDocument,
  sanitizeSiteDocument,
  validateRecord,
} from '../api/_lib/rules.mjs'
import { collectionMaps } from '../api/_lib/map.mjs'

const tokenFor = (payload) =>
  `header.${Buffer.from(JSON.stringify(payload)).toString('base64url')}.signature`

const validService = {
  id: 'test-service',
  icon: 'Layers',
  title: 'Test service',
  description: 'A description for the test service.',
  problem: 'A problem.',
  capabilities: ['One'],
  useCases: ['One'],
  audience: 'Small teams',
  displayOrder: 1,
  isPublished: true,
}

const validSite = {
  _note: 'must never be stored',
  name: 'Ordacy',
  tagline: 'Tagline',
  description: 'Description',
  siteUrl: 'https://ordacy.com',
  siteUrlPending: true,
  footerTagline: 'Footer',
  profileStats: { views: '1', projects: '2', likes: '3', _note: 'drop' },
  contact: {
    email: { value: null, pending: true, _note: 'drop' },
    phone: { value: '+63 900 000 0000', pending: false },
    location: { value: null, pending: true },
    responseTime: { value: '1 day', pending: false },
  },
  markets: ['Philippines', 'International'],
  unknown: 'drop',
}

test('resource whitelist is exact', () => {
  for (const name of [
    'projects',
    'testimonials',
    'services',
    'plans',
    'faqs',
    'team',
    'gallery',
    'inquiries',
    'pages',
    'seo',
    'site',
    'settings',
  ]) {
    assert.equal(isKnownResource(name), true, name)
  }

  for (const name of ['', 'admin', 'users', 'projects/../seo', '__proto__']) {
    assert.equal(isKnownResource(name), false, name)
  }

  assert.equal(isCollectionResource('projects'), true)
  assert.equal(isCollectionResource('site'), false)
  assert.equal(isDocumentResource('site'), true)
  assert.equal(isDocumentResource('settings'), true)
  assert.equal(isDocumentResource('projects'), false)
})

test('bearer token parsing', () => {
  assert.equal(bearerToken('Bearer abc.def.ghi'), 'abc.def.ghi')
  assert.equal(bearerToken('bearer abc'), 'abc')
  assert.equal(bearerToken('Basic abc'), null)
  assert.equal(bearerToken(undefined), null)
  assert.equal(bearerToken('Bearer'), null)
})

test('JWT payload decoding and the AAL2 gate', () => {
  assert.deepEqual(decodeJwtPayload(tokenFor({ aal: 'aal2' })), { aal: 'aal2' })
  assert.equal(decodeJwtPayload('not-a-jwt'), null)
  assert.equal(decodeJwtPayload('a.broken'), null)

  assert.deepEqual(authorizeAdmin(null), {
    ok: false,
    status: 401,
    error: 'unauthorized',
  })
  assert.deepEqual(authorizeAdmin({ aal: 'aal1' }), {
    ok: false,
    status: 403,
    error: 'mfa required',
  })
  assert.deepEqual(authorizeAdmin({}), {
    ok: false,
    status: 403,
    error: 'mfa required',
  })
  assert.deepEqual(authorizeAdmin({ aal: 'aal2' }), { ok: true })
})

test('record payload validation accepts complete records', () => {
  assert.equal(validateRecord('services', validService), null)
  assert.equal(
    validateRecord('testimonials', {
      id: 'testimonial',
      quote: 'Great work.',
      name: 'Client',
      role: 'Owner',
      company: 'Company',
      rating: null,
      initials: 'CL',
      status: 'approved',
      isPublished: true,
      displayOrder: 1,
      createdAt: '2026-01-01T00:00:00.000Z',
    }),
    null,
  )
  assert.equal(
    validateRecord('projects', {
      id: 'project',
      slug: 'project',
      title: 'Project',
      type: 'client-project',
      icon: 'Globe',
      category: 'Web',
      summary: 'Summary',
      details: 'Details',
      challenge: 'Challenge',
      solution: 'Solution',
      features: ['One'],
      image: { src: 'https://example.com/a.png', alt: 'A' },
      screenshots: [],
      url: null,
      isPublished: true,
      displayOrder: 1,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    }),
    null,
  )
})

test('record payload validation rejects missing or mistyped fields', () => {
  assert.match(
    validateRecord('services', { ...validService, title: undefined }),
    /title is required/,
  )
  assert.match(
    validateRecord('services', { ...validService, isPublished: 'yes' }),
    /isPublished has an invalid value/,
  )
  assert.match(
    validateRecord('services', { ...validService, id: '../escape' }),
    /id has an invalid value/,
  )
  assert.match(
    validateRecord('projects', {
      ...validProject(),
      type: 'sample',
    }),
    /type has an invalid value/,
  )
  assert.match(
    validateRecord('testimonials', {
      ...validTestimonial(),
      rating: 6,
    }),
    /rating has an invalid value/,
  )
  assert.match(validateRecord('services', null), /must be an object/)
  assert.match(validateRecord('unknown', {}), /unknown resource/)
})

test('PATCH validation checks only supplied fields', () => {
  assert.equal(
    validateRecord('services', { isPublished: false }, { partial: true }),
    null,
  )
  assert.match(
    validateRecord('services', { displayOrder: 'first' }, { partial: true }),
    /displayOrder has an invalid value/,
  )
})

test('site document is rebuilt field by field', () => {
  const clean = sanitizeSiteDocument(validSite)
  assert.deepEqual(clean, {
    name: 'Ordacy',
    tagline: 'Tagline',
    description: 'Description',
    siteUrl: 'https://ordacy.com',
    siteUrlPending: true,
    footerTagline: 'Footer',
    profileStats: { views: '1', projects: '2', likes: '3' },
    contact: {
      email: { value: null, pending: true },
      phone: { value: '+63 900 000 0000', pending: false },
      location: { value: null, pending: true },
      responseTime: { value: '1 day', pending: false },
    },
    markets: ['Philippines', 'International'],
  })
  assert.equal('_note' in clean, false)
  assert.equal('unknown' in clean, false)
  assert.equal('_note' in clean.profileStats, false)
  assert.equal('_note' in clean.contact.email, false)
})

test('settings document stores only inquiriesPageSize', () => {
  assert.deepEqual(
    sanitizeSettingsDocument({
      _note: 'drop',
      inquiriesPageSize: 15,
      extra: true,
    }),
    { inquiriesPageSize: 15 },
  )
  assert.throws(
    () => sanitizeSettingsDocument({ inquiriesPageSize: 'many' }),
    /inquiriesPageSize/,
  )
  assert.throws(() => sanitizeSiteDocument({ name: 'Only a name' }), /site\./)
})

test('list ordering is deterministic and follows displayOrder', () => {
  assert.deepEqual(
    orderRecords('services', [
      { id: 'second', displayOrder: 2 },
      { id: 'first', displayOrder: 1 },
    ]).map((record) => record.id),
    ['first', 'second'],
  )
  assert.deepEqual(
    orderRecords('pages', [{ id: 'contact' }, { id: 'home' }, { id: 'about' }])
      .map((record) => record.id),
    ['home', 'about', 'contact'],
  )
})

function validProject() {
  return {
    id: 'project',
    slug: 'project',
    title: 'Project',
    type: 'client-project',
    icon: 'Globe',
    category: 'Web',
    summary: 'Summary',
    details: 'Details',
    challenge: 'Challenge',
    solution: 'Solution',
    features: ['One'],
    image: { src: 'https://example.com/a.png', alt: 'A' },
    screenshots: [],
    url: null,
    isPublished: true,
    displayOrder: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  }
}

function validTestimonial() {
  return {
    id: 'testimonial',
    quote: 'Great work.',
    name: 'Client',
    role: 'Owner',
    company: 'Company',
    rating: 5,
    initials: 'CL',
    status: 'approved',
    isPublished: true,
    displayOrder: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
  }
}

/* ---------- Owner allowlist and factor pin ---------- */

test('owner allowlist fails closed', () => {
  assert.deepEqual(authorizeOwner('user-1', 'user-1'), { ok: true })
  assert.deepEqual(authorizeOwner('user-2', 'user-1'), {
    ok: false,
    status: 403,
    error: 'forbidden',
  })
  assert.equal(authorizeOwner('user-1', undefined).ok, false)
  assert.equal(authorizeOwner('user-1', '').ok, false)
  assert.equal(authorizeOwner('user-1', ' user-1 ').ok, false)
  assert.equal(authorizeOwner(undefined, 'user-1').ok, false)
})

test('factor pin accepts only the sole verified TOTP factor', () => {
  const pinned = { id: 'factor-a', factor_type: 'totp', status: 'verified' }

  assert.deepEqual(authorizeFactor([pinned], 'factor-a'), { ok: true })
  // Unverified extra factors may remain.
  assert.deepEqual(
    authorizeFactor(
      [pinned, { id: 'factor-c', factor_type: 'totp', status: 'unverified' }],
      'factor-a',
    ),
    { ok: true },
  )

  // Any extra verified factor of any type denies the pinned factor too.
  assert.equal(
    authorizeFactor(
      [pinned, { id: 'factor-b', factor_type: 'totp', status: 'verified' }],
      'factor-a',
    ).ok,
    false,
  )
  assert.equal(
    authorizeFactor(
      [pinned, { id: 'factor-d', factor_type: 'phone', status: 'verified' }],
      'factor-a',
    ).ok,
    false,
  )
  assert.equal(
    authorizeFactor(
      [{ id: 'factor-b', factor_type: 'totp', status: 'verified' }],
      'factor-a',
    ).ok,
    false,
  )
  assert.equal(
    authorizeFactor(
      [{ id: 'factor-a', factor_type: 'totp', status: 'unverified' }],
      'factor-a',
    ).ok,
    false,
  )
  assert.equal(
    authorizeFactor(
      [{ id: 'factor-a', factor_type: 'phone', status: 'verified' }],
      'factor-a',
    ).ok,
    false,
  )
  assert.equal(authorizeFactor([pinned], 'missing').ok, false)
  assert.equal(authorizeFactor([pinned], undefined).ok, false)
  assert.equal(authorizeFactor(null, 'factor-a').ok, false)
  assert.equal(authorizeFactor([{}], 'factor-a').ok, false)
})

/* ---------- Icons and URLs ---------- */

test('icon allowlist matches the app icons', () => {
  assert.equal(isKnownIcon('Layers'), true)
  assert.equal(isKnownIcon('MessageSquareQuote'), true)
  assert.equal(isKnownIcon('NotAnIcon'), false)
  assert.equal(isKnownIcon(''), false)

  assert.match(
    validateRecord('services', { ...validService, icon: 'NotAnIcon' }),
    /icon has an invalid value/,
  )
  assert.match(
    validateRecord('plans', { ...validPlan(), ctaIcon: 'javascript:x' }),
    /ctaIcon has an invalid value/,
  )
  assert.match(
    validateRecord('faqs', {
      id: 'faq',
      icon: 'NotAnIcon',
      category: 'General',
      question: 'Question?',
      answer: 'Answer.',
      featured: false,
      pricingPage: false,
      displayOrder: 1,
      isPublished: true,
    }),
    /icon has an invalid value/,
  )

  const page = validPage()
  page.sections[0].actions[0].icon = 'NotAnIcon'
  assert.match(validateRecord('pages', page), /pages\.sections has an invalid value/)
})

test('URL fields allow http(s) and rooted paths, reject dangerous schemes', () => {
  assert.equal(isSafeUrl('https://example.com/a.png'), true)
  assert.equal(isSafeUrl('http://example.com'), true)
  assert.equal(isSafeUrl('/contact'), true)
  assert.equal(isSafeUrl('/team/orlando#skills'), true)
  assert.equal(isSafeUrl('#inquiry-form'), true)
  assert.equal(isSafeUrl('javascript:alert(1)'), false)
  assert.equal(isSafeUrl('JavaScript:alert(1)'), false)
  assert.equal(isSafeUrl('data:text/html,<script>'), false)
  assert.equal(isSafeUrl('//evil.example/a.png'), false)
  assert.equal(isSafeUrl('/\\evil.example/a.png'), false)
  assert.equal(isSafeUrl(' https://example.com'), false)
  assert.equal(isSafeUrl('https://'), false)
  assert.equal(isSafeUrl(''), false)

  assert.equal(isHttpsUrl('https://ordacy.com'), true)
  assert.equal(isHttpsUrl('http://ordacy.com'), false)
  assert.equal(isHttpsUrl('/relative'), false)
  assert.equal(isHttpsUrl('javascript:alert(1)'), false)

  assert.match(
    validateRecord('projects', {
      ...validProject(),
      url: 'javascript:alert(1)',
    }),
    /projects\.url has an invalid value/,
  )
  assert.match(
    validateRecord('projects', {
      ...validProject(),
      screenshots: [{ src: 'javascript:alert(1)', alt: 'Shot' }],
    }),
    /screenshots has an invalid value/,
  )
  assert.match(
    validateRecord('team', {
      ...validTeamMember(),
      resumeUrl: 'javascript:alert(1)',
    }),
    /resumeUrl has an invalid value/,
  )
  assert.match(
    validateRecord('team', {
      ...validTeamMember(),
      avatar: { src: 'javascript:alert(1)', alt: 'Avatar' },
    }),
    /avatar has an invalid value/,
  )
  assert.match(
    validateRecord('gallery', {
      id: 'image',
      src: 'javascript:alert(1)',
      title: 'Image',
      alt: 'Alt text',
      caption: null,
      displayOrder: 1,
      isPublished: true,
      createdAt: '2026-01-01T00:00:00.000Z',
    }),
    /gallery\.src has an invalid value/,
  )
  assert.match(
    validateRecord('seo', {
      ...validSeo(),
      canonical: 'javascript:alert(1)',
    }),
    /canonical has an invalid value/,
  )
  assert.match(
    validateRecord('seo', { ...validSeo(), ogImage: 'javascript:alert(1)' }),
    /ogImage has an invalid value/,
  )

  const page = validPage()
  page.sections[0].actions[0].to = 'javascript:alert(1)'
  assert.match(validateRecord('pages', page), /pages\.sections has an invalid value/)

  // Relative paths remain valid where the UI stores them.
  assert.equal(
    validateRecord('projects', {
      ...validProject(),
      image: { src: '/projects/shot.png', alt: 'Shot' },
      screenshots: [{ src: '/projects/two.png', alt: 'Two' }],
    }),
    null,
  )
})

test('siteUrl must be an absolute https URL', () => {
  assert.equal(sanitizeSiteDocument(validSite).siteUrl, 'https://ordacy.com')
  assert.throws(
    () => sanitizeSiteDocument({ ...validSite, siteUrl: 'http://ordacy.com' }),
    /absolute https URL/,
  )
  assert.throws(
    () =>
      sanitizeSiteDocument({
        ...validSite,
        siteUrl: 'javascript:alert(1)',
      }),
    /absolute https URL/,
  )
  assert.throws(
    () => sanitizeSiteDocument({ ...validSite, siteUrl: '/local' }),
    /absolute https URL/,
  )
})

/* ---------- Team nested shapes ---------- */

test('team nested shapes reject empty objects and wrong types', () => {
  assert.equal(validateRecord('team', validTeamMember()), null)

  for (const key of [
    'experience',
    'education',
    'certifications',
    'skillGroups',
  ]) {
    assert.match(
      validateRecord('team', { ...validTeamMember(), [key]: [{}] }),
      new RegExp(key),
      key,
    )
    assert.match(
      validateRecord('team', { ...validTeamMember(), [key]: 'wrong' }),
      new RegExp(key),
      key,
    )
  }

  const team = validTeamMember()
  team.experience = [{ role: 'Developer', organization: 'Studio', period: '2020' }]
  assert.match(validateRecord('team', team), /experience/)

  team.experience = validTeamMember().experience
  team.education = [
    {
      credential: 'BSc',
      school: 'University',
      period: '2016–2020',
      details: ['line one', 'line two'],
    },
  ]
  assert.match(validateRecord('team', team), /education/)

  team.education = validTeamMember().education
  team.certifications = [
    { name: 'Cert', issuer: 'Board', year: 2024 },
  ]
  assert.match(validateRecord('team', team), /certifications/)

  team.certifications = validTeamMember().certifications
  team.skillGroups = [{ label: 'Frontend', items: 'React' }]
  assert.match(validateRecord('team', team), /skillGroups/)
})

/* ---------- Map round-trips ---------- */

test('collection maps round-trip both directions', () => {
  const records = {
    pages: validPage(),
    services: validService,
    plans: validPlan(),
    faqs: {
      id: 'faq',
      icon: 'CircleHelp',
      category: 'General',
      question: 'Question?',
      answer: 'Answer.',
      featured: true,
      pricingPage: false,
      displayOrder: 1,
      isPublished: true,
    },
    projects: validProject(),
    testimonials: validTestimonial(),
    team: validTeamMember(),
    gallery: {
      id: 'image',
      src: '/images/gallery/a.jpg',
      title: 'Image',
      alt: 'Alt text',
      caption: null,
      displayOrder: 1,
      isPublished: true,
      createdAt: '2026-01-01T00:00:00.000Z',
    },
    inquiries: {
      id: 'inquiry',
      fullName: 'Person',
      email: 'person@example.com',
      company: null,
      projectType: 'Website',
      budgetRange: null,
      details: 'Project details.',
      targetLaunchDate: null,
      status: 'new',
      submittedAt: '2026-01-01T00:00:00.000Z',
    },
    seo: validSeo(),
  }

  for (const [resource, record] of Object.entries(records)) {
    const map = collectionMaps[resource]
    assert.ok(map, `${resource} has a map`)
    assert.deepEqual(map.fromRow(map.toRow(record)), record, resource)
    assert.equal(map.toRow(record).id, record.id, `${resource} id`)
  }
})

function validPlan() {
  return {
    id: 'growth',
    name: 'Growth',
    icon: 'Rocket',
    category: 'Website',
    prices: { PHP: 'PHP 10,000', USD: '$200' },
    positioning: 'For growing teams.',
    fits: ['Small teams'],
    cta: 'Start',
    ctaIcon: 'Rocket',
    displayOrder: 1,
    isPublished: true,
  }
}

function validPage() {
  return {
    id: 'home',
    label: 'Homepage',
    path: '/',
    header: {
      eyebrow: 'Eyebrow',
      title: 'Title',
      description: 'Description',
    },
    sections: [
      {
        id: 'hero',
        label: 'Hero',
        eyebrow: null,
        title: 'Hero title',
        description: null,
        actions: [{ label: 'Contact', to: '/contact', icon: 'Globe' }],
        mobile: {
          eyebrow: 'Mobile',
          title: 'Mobile title',
          description: 'Mobile description',
        },
        items: [{ title: 'One', text: 'Two' }],
      },
    ],
  }
}

function validTeamMember() {
  return {
    id: 'team-member',
    slug: 'team-member',
    name: 'Team Member',
    role: 'Developer',
    initials: 'TM',
    avatar: {
      src: '/images/team/member.jpg',
      darkSrc: '/images/team/member-dark.jpg',
      alt: 'Team member',
    },
    resumeUrl: '/documents/member.pdf',
    headline: 'Headline',
    summary: 'Summary',
    facts: [{ label: 'Focus', value: 'Automation' }],
    skills: ['React'],
    skillGroups: [{ label: 'Frontend', items: ['React', 'TypeScript'] }],
    experience: [
      {
        role: 'Developer',
        organization: 'Studio',
        period: '2020–2024',
        summary: 'Built sites.',
      },
    ],
    education: [
      {
        credential: 'BSc',
        school: 'University',
        period: '2016–2020',
        details: 'Line one.\nLine two.',
      },
    ],
    certifications: [{ name: 'Cert', issuer: 'Board', year: '2024' }],
    languages: ['English'],
    displayOrder: 1,
    isPublished: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  }
}

function validSeo() {
  return {
    id: 'home',
    path: '/',
    title: 'Title',
    description: 'Description',
    canonical: null,
    ogTitle: null,
    ogDescription: null,
    ogImage: null,
    noindex: false,
  }
}
