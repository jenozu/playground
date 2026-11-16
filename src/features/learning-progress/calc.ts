import type { Course, Module } from '../../types/course'

export interface Attempt {
  id: string
  courseId: string
  lessonId: string
  at: string
  passed: boolean
  testsPassed: number
  testsTotal: number
}

const pct = (done: number, total: number) => (total ? Math.round((done / total) * 100) : 0)

/** done = set of completed lesson ids for this course */
export const modulePercent = (m: Module, done: Set<string>) =>
  pct(m.lessons.filter((l) => done.has(l.id)).length, m.lessons.length)

export const isModuleComplete = (m: Module, done: Set<string>) =>
  m.lessons.length > 0 && m.lessons.every((l) => done.has(l.id))

export const coursePercent = (c: Course, done: Set<string>) => {
  const ls = c.modules.flatMap((m) => m.lessons)
  return pct(ls.filter((l) => done.has(l.id)).length, ls.length)
}

export const isCourseComplete = (c: Course, done: Set<string>) => coursePercent(c, done) === 100

export const successRate = (attempts: Pick<Attempt, 'passed'>[]) =>
  pct(attempts.filter((a) => a.passed).length, attempts.length)
