import { describe, expect, it } from 'vitest'
import { loadCourse, type CourseFiles } from './parser'
import { testFileSchema } from './schema'

// Loads the bundled public/courses folders from disk through the validator.
const raw = import.meta.glob('../../public/courses/**/*', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
const PREFIX = '../../public/courses/'
const folders = JSON.parse(raw[`${PREFIX}index.json`]) as string[]

describe('bundled sample courses', () => {
  it('index lists both samples', () => {
    expect(folders).toEqual(['sql-fundamentals', 'python-fundamentals'])
  })
  for (const f of folders) {
    it(`${f} loads with zero errors and valid test files`, () => {
      const files: CourseFiles = new Map()
      for (const [k, v] of Object.entries(raw)) if (k.startsWith(`${PREFIX}${f}/`)) files.set(k.slice(`${PREFIX}${f}/`.length), v)
      const res = loadCourse(files)
      expect(res.ok && res.warnings).toEqual([])
      if (!res.ok) return
      const lessons = res.course.modules.flatMap((m) => m.lessons)
      expect(res.course.modules).toHaveLength(2)
      expect(lessons).toHaveLength(5)
      expect(lessons.filter((l) => !l.exercise)).toHaveLength(1)
      for (const l of lessons)
        if (l.exercise) expect(testFileSchema.safeParse(JSON.parse(files.get(l.exercise.tests) as string)).success).toBe(true)
    })
  }
})
