import 'fake-indexeddb/auto'
import { describe, expect, it } from 'vitest'
import { exportData, importData, parseBackup } from './dataBackup'
import { notesRepo, progressRepo, codeRepo, bookmarksRepo, attemptsRepo } from '../../storage/repositories'

describe('data backup', () => {
  it('round-trips export -> import (replace)', async () => {
    await progressRepo.put({ id: 'p1', done: true })
    await notesRepo.put({ id: 'n1', text: '<script>x</script>' })
    await codeRepo.put({ id: 'c1', code: 'select 1' })
    await bookmarksRepo.put({ id: 'b1' })
    await attemptsRepo.put({ id: 'a1', passed: true })
    const before = await exportData()
    await notesRepo.put({ id: 'extra' })
    await importData(parseBackup(JSON.stringify(before)), 'replace')
    const after = await exportData()
    expect(after.stores).toEqual(before.stores)
  })
  it('merge keeps existing records', async () => {
    const b = parseBackup(JSON.stringify(await exportData()))
    await notesRepo.put({ id: 'keep' })
    await importData(b, 'merge')
    expect(await notesRepo.get('keep')).toBeDefined()
  })
  it('replace with an old file lacking attempts keeps existing attempts', async () => {
    await attemptsRepo.put({ id: 'keepa', passed: true })
    const old = { exportVersion: 1, exportedAt: 'x', stores: { progress: [], notes: [], code: [], bookmarks: [] } }
    await importData(parseBackup(JSON.stringify(old)), 'replace')
    expect(await attemptsRepo.get('keepa')).toBeDefined()
  })
  it('rejects malformed files and writes nothing', async () => {
    expect(() => parseBackup('nope')).toThrow(/valid JSON/)
    expect(() => parseBackup('{"exportVersion":1,"exportedAt":"x","stores":{"progress":[{"nid":1}]}}')).toThrow(/not a valid backup/)
    expect(() => parseBackup('{"exportVersion":9}')).toThrow(/not a valid backup/)
  })
})
