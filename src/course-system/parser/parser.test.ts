import { describe, expect, it } from 'vitest'
import { loadCourse, type CourseFiles } from '.'

const manifest = (over: Record<string, unknown> = {}, ex: Record<string, unknown> = {}) =>
  JSON.stringify({
    id: 'c', title: 'C', version: '1.0.0', language: 'sql', description: 'd', difficulty: 'beginner', estimatedHours: 1,
    modules: [{ id: 'm', title: 'M', lessons: [{ id: 'l', title: 'L', type: 'coding', content: 'l.md', estimatedMinutes: 5,
      exercise: { type: 'sql', starter: 's.sql', tests: 't.json', solution: 'sol.sql', ...ex } }] }],
    ...over,
  })
const full = (m = manifest()): CourseFiles =>
  new Map([['course.json', m], ['l.md', '#'], ['s.sql', ''], ['t.json', '{}'], ['sol.sql', '']])
const codes = (f: CourseFiles) => {
  const r = loadCourse(f)
  return r.ok ? [] : r.errors.map((e) => e.code)
}

describe('loadCourse', () => {
  it('loads a valid course', () => {
    const r = loadCourse(full())
    expect(r.ok && r.course.id).toBe('c')
  })
  it('missing-manifest', () => expect(codes(new Map())).toEqual(['missing-manifest']))
  it('invalid-json with line/col', () => {
    const r = loadCourse(new Map([['course.json', '{\n"a": }']]))
    expect(!r.ok && r.errors[0].code).toBe('invalid-json')
  })
  it('unsupported-version', () => expect(codes(full(manifest({ schemaVersion: 2 })))).toEqual(['unsupported-version']))
  it('missing lesson file', () => {
    const f = full(); f.delete('l.md')
    expect(codes(f)).toEqual(['missing-file'])
  })
  it('missing exercise file', () => {
    const f = full(); f.delete('t.json')
    expect(codes(f)).toEqual(['missing-file'])
  })
  it.each(['../x', '/etc/passwd', 'a\\b', 'C:/x'])('invalid-path %s', (p) => {
    expect(codes(full(manifest({}, { starter: p })))).toContain('invalid-path')
  })
  it('unsupported-language', () => {
    expect(codes(full(manifest({ language: 'ruby' })))).toContain('unsupported-language')
    expect(codes(full(manifest({}, { type: 'ruby' })))).toContain('unsupported-language')
  })
})
