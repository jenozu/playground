import 'fake-indexeddb/auto'
import { render, screen, within, fireEvent, waitFor, cleanup } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import initSqlJs, { type SqlJsStatic } from 'sql.js'
import { loadCourse, type CourseFiles } from '../../../course-system/parser'
import { createDb, execSql } from '../../../execution/adapters/sql/core'
import LessonPage from './LessonPage'

// Real bundled sql-fundamentals files; only the registry (IndexedDB) and the worker are swapped out.
const raw = import.meta.glob('../../../../public/courses/sql-fundamentals/**/*', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>
const PREFIX = '../../../../public/courses/sql-fundamentals/'
const files: CourseFiles = new Map(Object.entries(raw).map(([k, v]) => [k.slice(PREFIX.length), v]))
const loaded = loadCourse(files)
if (!loaded.ok) throw new Error('sql-fundamentals sample failed to load')
const course = loaded.course

vi.mock('../../../course-system/registry/useCourses', () => ({
  useCourses: () => ({ courses: [{ id: course.id, course, source: 'test', registeredAt: '' }], loading: false }),
}))
vi.mock('../../../course-system/registry', () => ({ getFiles: () => Promise.resolve(files) }))

// CodeMirror needs layout APIs jsdom lacks (getClientRects); the editor has its own tests.
vi.mock('../../../components/editor/CodeEditor', () => ({
  CodeEditor: (p: { value: string; onChange: (v: string) => void }) => (
    <textarea data-testid="code-editor" value={p.value} onChange={(e) => p.onChange(e.target.value)} />
  ),
}))

// The SQL engine normally runs in a Web Worker; here run() executes the same core in-process.
let SQL: SqlJsStatic
// exec.gate, when set, holds run() open so a test can inspect the page while a run is pending.
// exec.error, when set, makes run() reject. stop() releases a held run, like the real engine does.
const exec = vi.hoisted(() => ({
  gate: undefined as Promise<void> | undefined,
  release: undefined as (() => void) | undefined,
  error: undefined as Error | undefined,
  calls: 0,
  stops: 0,
}))
vi.mock('../../../execution/manager', () => ({
  run: async (_lang: string, code: string, opts: { options?: { dataset?: string } } = {}) => {
    exec.calls++
    if (exec.gate) await exec.gate
    if (exec.error) throw exec.error
    return execSql(createDb(SQL, opts.options?.dataset), code)
  },
  stop: async () => {
    exec.stops++
    exec.release?.()
  },
  reset: () => Promise.resolve(),
}))

beforeAll(async () => {
  SQL = await initSqlJs()
  // jsdom has no matchMedia: every query false = phone layout (all panels stay in the DOM)
  window.matchMedia = ((q: string) => ({
    matches: false,
    media: q,
    addEventListener() {},
    removeEventListener() {},
  })) as unknown as typeof window.matchMedia
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  exec.gate = undefined
  exec.release = undefined
  exec.error = undefined
  exec.calls = 0
  exec.stops = 0
})

const renderLesson = () =>
  render(
    <MemoryRouter initialEntries={['/courses/sql-fundamentals/lessons/lesson-02']}>
      <Routes>
        <Route path="/courses/:courseId/lessons/:lessonId" element={<LessonPage />} />
      </Routes>
    </MemoryRouter>,
  )

async function runQuery(sql: string) {
  fireEvent.change(await screen.findByTestId('code-editor'), { target: { value: sql } })
  fireEvent.click(screen.getByRole('button', { name: 'Run' }))
}

describe('LessonPage SQL output', () => {
  it('renders SELECT * results as a table with headers and one row per record', async () => {
    renderLesson()
    await runQuery('SELECT * FROM employees')
    const table = await screen.findByTestId('entry-table')
    const headers = within(table).getAllByRole('columnheader').map((h) => h.textContent)
    expect(headers).toEqual(['id', 'name', 'department_id', 'salary'])
    expect(table.querySelectorAll('tbody tr')).toHaveLength(6)
    expect(within(table).getByText('Alice')).toBeInTheDocument()
    expect(screen.getByTestId('output-text')).toHaveTextContent('6 row(s)')
  })

  it('zero-row SELECT shows the column headers, no rows and no "Query OK."', async () => {
    renderLesson()
    await runQuery('SELECT name, salary FROM employees WHERE salary > 1000000')
    const table = await screen.findByTestId('entry-table')
    expect(within(table).getAllByRole('columnheader').map((h) => h.textContent)).toEqual(['name', 'salary'])
    expect(table.querySelectorAll('tbody tr')).toHaveLength(0)
    expect(screen.getByTestId('output-text')).not.toHaveTextContent('Query OK.')
  })

  it('Clear output removes the table', async () => {
    renderLesson()
    await runQuery('SELECT * FROM employees')
    await screen.findByTestId('entry-table')
    fireEvent.click(screen.getByRole('button', { name: 'Clear output' }))
    await waitFor(() => expect(screen.queryByTestId('entry-table')).not.toBeInTheDocument())
  })
})

describe('LessonPage lesson list', () => {
  it('sql-fundamentals/lesson-02 renders without a React duplicate-key warning', async () => {
    const err = vi.spyOn(console, 'error').mockImplementation(() => {})
    renderLesson()
    await screen.findByText('Show solution', { exact: false })
    expect(err.mock.calls.filter((c) => /same key/i.test(c.map(String).join(' ')))).toEqual([])
  })
})

describe('LessonPage run lock', () => {
  it('while a run is pending Run and Submit are disabled and Stop is enabled; all reset after it settles', async () => {
    let release!: () => void
    exec.gate = new Promise<void>((r) => (release = r))
    renderLesson()
    await runQuery('SELECT * FROM employees')
    const run = screen.getByRole('button', { name: 'Run' })
    expect(run).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Stop' })).toBeEnabled()
    // a second Run while pending (fast double click) must not start a second execution
    fireEvent.click(run)
    expect(exec.calls).toBe(1)
    release()
    await waitFor(() => expect(screen.getByRole('button', { name: 'Run' })).toBeEnabled())
    expect(screen.getByRole('button', { name: 'Submit' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Stop' })).toBeDisabled()
    expect(screen.getByTestId('output-text')).toHaveTextContent('6 row(s)')
  })

  it('a run that rejects shows the error and frees Run, Submit and Stop', async () => {
    exec.error = new Error('engine crashed')
    renderLesson()
    await runQuery('SELECT * FROM employees')
    await waitFor(() => expect(screen.getByRole('button', { name: 'Run' })).toBeEnabled())
    expect(screen.getByRole('button', { name: 'Submit' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Stop' })).toBeDisabled()
    expect(screen.getByTestId('output-text')).toHaveTextContent('Error: engine crashed')
  })

  it('Stop during a run releases the run and leaves Run enabled and Stop disabled', async () => {
    exec.gate = new Promise<void>((r) => (exec.release = r))
    renderLesson()
    await runQuery('SELECT * FROM employees')
    fireEvent.click(screen.getByRole('button', { name: 'Stop' }))
    expect(exec.stops).toBe(1)
    await waitFor(() => expect(screen.getByRole('button', { name: 'Run' })).toBeEnabled())
    expect(screen.getByRole('button', { name: 'Submit' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Stop' })).toBeDisabled()
  })
})
