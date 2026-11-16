import 'fake-indexeddb/auto'
import { describe, expect, it } from 'vitest'
import { loadCourse } from '../parser'
import { progressRepo } from '../../storage/repositories'
import { get, getFiles, list, register, remove } from '.'

const manifest = {
  id: 'c1', title: 'C', version: '1.0.0', language: 'sql', description: 'd', difficulty: 'beginner', estimatedHours: 1,
  modules: [{ id: 'm1', title: 'M', lessons: [{ id: 'l1', title: 'L', content: 'l1.md', estimatedMinutes: 5 }] }],
}

describe('registry', () => {
  it('registers, lists, removes and keeps progress', async () => {
    const res = loadCourse(new Map([['course.json', JSON.stringify(manifest)], ['l1.md', '# hi']]))
    expect(res.ok).toBe(true)
    await register(res, 'test')
    await progressRepo.put({ id: 'c1/l1', done: true })
    expect((await list()).map((r) => r.id)).toEqual(['c1'])
    expect((await get('c1'))?.source).toBe('test')
    expect((await getFiles('c1'))?.get('l1.md')).toBe('# hi')
    await remove('c1')
    expect(await list()).toEqual([])
    expect(await getFiles('c1')).toBeUndefined()
    expect(await progressRepo.get('c1/l1')).toEqual({ id: 'c1/l1', done: true })
  })
})
