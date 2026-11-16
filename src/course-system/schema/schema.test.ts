import { describe, expect, it } from 'vitest'
import { parseCourse, testFileSchema } from './index'

const valid = (): Record<string, unknown> => ({
  id: 'python-fundamentals',
  title: 'Python Fundamentals',
  version: '1.0.0',
  language: 'python',
  description: 'Learn Python programming from beginner level.',
  difficulty: 'beginner',
  estimatedHours: 30,
  modules: [
    {
      id: 'module-01',
      title: 'Python Basics',
      lessons: [
        {
          id: 'lesson-01',
          title: 'Hello World',
          content: 'module-01/lesson-01.md',
          estimatedMinutes: 10,
          exercise: {
            type: 'python',
            starter: 'module-01/lesson-01.py',
            tests: 'module-01/lesson-01-tests.json',
            solution: 'module-01/lesson-01-solution.py',
          },
        },
      ],
    },
  ],
})

type Path = (string | number)[]
// Walk to the parent of the last key; test fixtures only, so the casts are safe.
const parent = (c: unknown, path: Path) =>
  path.slice(0, -1).reduce((o, k) => (o as Record<string | number, unknown>)[k], c) as Record<string | number, unknown>
const omit = (c: unknown, path: Path) => delete parent(c, path)[path[path.length - 1]]
const set = (c: unknown, path: Path, v: unknown) => (parent(c, path)[path[path.length - 1]] = v)
const errorsOf = (c: unknown) => {
  const r = parseCourse(c)
  return r.ok ? [] : r.errors
}

describe('course schema', () => {
  it('accepts the PRD 7.2 example and unknown fields', () => {
    const c = valid()
    c.extra = 1
    expect(parseCourse(c).ok).toBe(true)
  })

  const omissions: Path[] = [
    ['id'],
    ['title'],
    ['version'],
    ['language'],
    ['description'],
    ['difficulty'],
    ['estimatedHours'],
    ['modules'],
    ['modules', 0, 'id'],
    ['modules', 0, 'lessons', 0, 'content'],
    ['modules', 0, 'lessons', 0, 'estimatedMinutes'],
    ['modules', 0, 'lessons', 0, 'exercise', 'tests'],
  ]
  it.each(omissions.map((p) => [p.join('.'), p] as const))('fails with a path when %s is missing', (name, path) => {
    const c = valid()
    omit(c, path)
    expect(errorsOf(c).some((e) => e.startsWith(name + ':'))).toBe(true)
  })

  it('rejects bad slugs and path traversal', () => {
    const c = valid()
    set(c, ['modules', 0, 'id'], 'Module 01')
    set(c, ['modules', 0, 'lessons', 0, 'content'], '../x.md')
    expect(errorsOf(c).length).toBe(2)
  })

  it('rejects duplicate module ids, pointing at the duplicate', () => {
    const c = valid()
    const mods = c.modules as unknown[]
    mods.push(structuredClone(mods[0]))
    expect(errorsOf(c)).toEqual(['modules.1.id: duplicate id "module-01"'])
  })

  it('rejects duplicate lesson ids within a module', () => {
    const c = valid()
    const lessons = parent(c, ['modules', 0, 'lessons', 0]) as unknown as unknown[]
    lessons.push(structuredClone(lessons[0]))
    expect(errorsOf(c)).toEqual(['modules.0.lessons.1.id: duplicate id "lesson-01"'])
  })

  it('allows only http(s) resource urls', () => {
    const c = valid()
    set(c, ['resources'], [
      { title: 'ok', url: 'https://docs.python.org/3/' },
      { title: 'xss', url: 'javascript:alert(1)' },
      { title: 'data', url: 'data:text/html,<script>1</script>' },
      { title: 'junk', url: 'not a url' },
    ])
    expect(errorsOf(c)).toEqual([
      'resources.1.url: must be an http(s) URL',
      'resources.2.url: must be an http(s) URL',
      'resources.3.url: must be an http(s) URL',
    ])
  })

  it('validates test files per language', () => {
    const ok = (v: unknown) => testFileSchema.safeParse(v).success
    expect(ok({ language: 'sql', tests: [{ name: 'a', checkQuery: 'select 1' }] })).toBe(true)
    expect(ok({ language: 'python', tests: [{ name: 'a', assert: 'assert x == 1' }] })).toBe(true)
    expect(ok({ language: 'python', tests: [{ name: 'a' }] })).toBe(false)
  })
})
