import assert from 'node:assert/strict'
import test from 'node:test'
import { createIconFallback } from '../src/data/icon-fallback.mjs'

const fallback = { name: 'fallback' }

test('an unknown icon resolves to the fallback', () => {
  const resolve = createIconFallback(fallback, () => {})
  assert.equal(resolve('NoSuchIcon', 'services.icon'), fallback)
})

test('the same field and value warns once', () => {
  const messages = []
  const resolve = createIconFallback(fallback, (message) =>
    messages.push(message),
  )
  resolve('NoSuchIcon', 'services.icon')
  resolve('NoSuchIcon', 'services.icon')
  resolve('NoSuchIcon', 'services.icon')

  assert.equal(messages.length, 1)
  assert.match(messages[0], /NoSuchIcon/)
  assert.match(messages[0], /services\.icon/)
})

test('a different value or field warns separately', () => {
  const messages = []
  const resolve = createIconFallback(fallback, (message) =>
    messages.push(message),
  )
  resolve('NoSuchIcon', 'services.icon')
  resolve('AnotherIcon', 'services.icon')
  resolve('NoSuchIcon', 'faqs.icon')

  assert.equal(messages.length, 3)
})

test('the helper never throws and keeps returning the fallback', () => {
  const resolve = createIconFallback(fallback, () => {})
  assert.doesNotThrow(() => resolve('', 'plans.ctaIcon'))
  assert.equal(resolve('', 'plans.ctaIcon'), fallback)
})
