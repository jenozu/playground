import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import CourseCard from './CourseCard'
import CoursesPage from '../pages/CoursesPage'
import DashboardPage from '../../dashboard/pages/DashboardPage'

const course = { id: 'c', title: 'SQL Basics', language: 'SQL', description: 'Learn SQL', difficulty: 'Beginner',
  moduleCount: 3, lessonCount: 12, completionPercent: 25, lastAccessed: '2026-01-01' }

test('CourseCard shows its fields', () => {
  render(<CourseCard course={course} />)
  expect(screen.getByText('SQL Basics')).toBeInTheDocument()
  expect(screen.getByText('3 modules · 12 lessons')).toBeInTheDocument()
  expect(screen.getByText('25% complete')).toBeInTheDocument()
})

test('My Courses empty state and filters', () => {
  const { unmount } = render(<CoursesPage />)
  expect(screen.getByLabelText('Search courses')).toBeInTheDocument()
  expect(screen.getByText(/No courses yet/)).toBeInTheDocument()
  unmount()
  render(<CoursesPage courses={[course]} />)
  expect(screen.getByText('SQL Basics')).toBeInTheDocument()
})

test('Dashboard shows empty states', () => {
  render(<MemoryRouter><DashboardPage /></MemoryRouter>)
  for (const h of ['Continue Learning', 'Active courses', 'Overall progress', 'Recently completed', 'Recommended next'])
    expect(screen.getByRole('heading', { name: h })).toBeInTheDocument()
  expect(screen.getByText(/Nothing to continue yet/)).toBeInTheDocument()
})
