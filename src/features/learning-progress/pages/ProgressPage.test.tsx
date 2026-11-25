import 'fake-indexeddb/auto'
import { render, screen, waitFor } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import type { Course } from '../../../course-system/schema'
import { completeLesson, recordAttempt } from '../service'
import ProgressPage from './ProgressPage'

const l = (id: string) => ({ id, title: id, type: 'reading', content: '', exercises: [] })
const course = { id: 'c', title: 'Course C', language: 'sql', modules: [{ id: 'm1', lessons: [l('a'), l('b')] }, { id: 'm2', lessons: [l('c')] }] } as unknown as Course
vi.mock('../../../course-system/registry/useCourses', () => ({ useCourses: () => ({ courses: [{ course }] }) }))

it('shows counts from seeded progress', async () => {
  await completeLesson('c', 'a')
  await completeLesson('c', 'b')
  await recordAttempt('c', 'a', [{ passed: true }])
  await recordAttempt('c', 'c', [{ passed: false }])
  render(<ProgressPage />)
  const v = (k: string) => screen.getByTestId(`stat-${k}`)
  await waitFor(() => expect(v('Completed lessons').textContent).toBe('2'))
  await waitFor(() => expect(v('Success rate').textContent).toBe('50%'))
  expect(v('Completed modules').textContent).toBe('1')
  expect(v('Active courses').textContent).toBe('1')
  expect(v('Recent languages').textContent).toBe('sql')
  expect(screen.getByText('67%')).toBeTruthy()
})
