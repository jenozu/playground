import 'fake-indexeddb/auto'
import { describe, expect, it } from 'vitest'
import { coursePercent, isModuleComplete, modulePercent, successRate } from './calc'
import { completeLesson, completedIds, lastPosition, listLessonProgress, recordAttempt, touchLesson } from './service'
import type { Course } from '../../types/course'

const l = (id: string) => ({ id, title: id, type: 'reading', content: '', exercises: [] })
const course = { id: 'c', modules: [{ id: 'm1', lessons: [l('a'), l('b')] }, { id: 'm2', lessons: [l('c'), l('d')] }] } as unknown as Course

describe('calc', () => {
  it('percent math and module completion', () => {
    const done = new Set(['a', 'b', 'c'])
    expect(coursePercent(course, done)).toBe(75)
    expect(modulePercent(course.modules[1], done)).toBe(50)
    expect(isModuleComplete(course.modules[0], done)).toBe(true)
    expect(isModuleComplete(course.modules[1], done)).toBe(false)
    expect(coursePercent(course, new Set())).toBe(0)
    expect(successRate([{ passed: true }, { passed: false }, { passed: false }, { passed: true }])).toBe(50)
    expect(successRate([])).toBe(0)
  })
})

describe('service', () => {
  it('failing attempt is recorded but does not complete; passing completes; survives re-read', async () => {
    await recordAttempt('c', 'a', [{ passed: true }, { passed: false }])
    expect(completedIds(await listLessonProgress('c'), 'c').size).toBe(0)
    await recordAttempt('c', 'a', [{ passed: true }])
    expect(completedIds(await listLessonProgress('c'), 'c')).toEqual(new Set(['a']))
  })
  it('last position is the latest touched lesson', async () => {
    await completeLesson('c', 'b')
    await touchLesson('c', 'd')
    const ps = await listLessonProgress('c')
    expect(lastPosition(ps, 'c')?.lessonId).toBe('d')
    expect(completedIds(ps, 'c')).toEqual(new Set(['a', 'b']))
  })
})
