import { attemptsRepo, progressRepo } from '../../storage/repositories'
import type { Attempt } from './calc'

// Keys are stable ids (course/lesson), never titles or positions.
const key = (courseId: string, lessonId: string) => `lesson:${courseId}/${lessonId}`
const now = () => new Date().toISOString()

export interface LessonProgress {
  id: string
  courseId: string
  lessonId: string
  completed: boolean
  completedAt?: string
  lastAccessed: string
}

export async function touchLesson(courseId: string, lessonId: string) {
  const old = (await progressRepo.get(key(courseId, lessonId))) as unknown as LessonProgress | undefined
  await progressRepo.put({ completed: false, ...old, id: key(courseId, lessonId), courseId, lessonId, lastAccessed: now() })
}

export async function completeLesson(courseId: string, lessonId: string) {
  const old = (await progressRepo.get(key(courseId, lessonId))) as unknown as LessonProgress | undefined
  if (old?.completed) return
  await progressRepo.put({ ...old, id: key(courseId, lessonId), courseId, lessonId, completed: true, completedAt: now(), lastAccessed: now() })
}

export async function recordAttempt(courseId: string, lessonId: string, results: { passed: boolean }[]) {
  const testsPassed = results.filter((r) => r.passed).length
  const passed = results.length > 0 && testsPassed === results.length
  const a: Attempt = { id: crypto.randomUUID(), courseId, lessonId, at: now(), passed, testsPassed, testsTotal: results.length }
  await attemptsRepo.put(a as unknown as { id: string })
  if (passed) await completeLesson(courseId, lessonId)
  return a
}

export async function listLessonProgress(courseId?: string) {
  const all = (await progressRepo.list()) as unknown as LessonProgress[]
  return all.filter((p) => p.lessonId && (!courseId || p.courseId === courseId))
}

export const completedIds = (ps: LessonProgress[], courseId: string) =>
  new Set(ps.filter((p) => p.courseId === courseId && p.completed).map((p) => p.lessonId))

/** Most recently accessed lesson: where to resume. */
export const lastPosition = (ps: LessonProgress[], courseId?: string) =>
  ps.filter((p) => !courseId || p.courseId === courseId).sort((a, b) => b.lastAccessed.localeCompare(a.lastAccessed))[0]
