import assert from 'node:assert/strict'
import test from 'node:test'
import {
  BACKUP_KEEP,
  backupFileName,
  backupFileNames,
  retentionPlan,
} from '../api/_lib/backup.mjs'

test('backup files are dated in UTC under the backups prefix', () => {
  assert.equal(
    backupFileName(new Date('2026-11-21T03:00:00.000Z')),
    'backups/2026-11-21.json',
  )
  assert.equal(
    backupFileName(new Date('2026-12-31T23:59:59.999Z')),
    'backups/2026-12-31.json',
  )
})

test('relative and full storage names are both recognized', () => {
  assert.deepEqual(
    backupFileNames([
      '2026-11-21.json',
      'backups/2026-11-20.json',
      '2026-11-19.json',
      'notes.txt',
      'backups/2026-11-19.json',
    ]),
    [
      'backups/2026-11-21.json',
      'backups/2026-11-20.json',
      'backups/2026-11-19.json',
    ],
  )
})

test('retention keeps the newest eight dated backups', () => {
  const names = Array.from(
    { length: 11 },
    (_, index) => `2026-11-${String(index + 1).padStart(2, '0')}.json`,
  )

  const removed = retentionPlan(names)

  assert.deepEqual(removed, [
    'backups/2026-11-03.json',
    'backups/2026-11-02.json',
    'backups/2026-11-01.json',
  ])
  assert.equal(names.length - removed.length, BACKUP_KEEP)
})

test('retention ignores non-backup files and leaves fewer than eight alone', () => {
  assert.deepEqual(
    retentionPlan(['2026-11-01.json', 'readme.txt', 'folder/2026-11-02.json']),
    [],
  )
  assert.deepEqual(retentionPlan([]), [])
  assert.deepEqual(retentionPlan(null), [])
})

test('a custom keep count is honored for the pure plan', () => {
  assert.deepEqual(
    retentionPlan(
      ['2026-11-01.json', '2026-11-02.json', '2026-11-03.json'],
      2,
    ),
    ['backups/2026-11-01.json'],
  )
})
