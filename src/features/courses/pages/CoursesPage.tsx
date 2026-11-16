import { useEffect, useState } from 'react'
import { coursePercent } from '../../learning-progress/calc'
import { listLessonProgress, completedIds, lastPosition } from '../../learning-progress/service'
import CourseCard, { type CourseSummary } from '../components/CourseCard'
import { useCourses } from '../../../course-system/registry/useCourses'
import { remove } from '../../../course-system/registry'

export default function CoursesPage({ courses = [], onRemove, onRefresh }: { courses?: CourseSummary[]; onRemove?: (id: string) => void; onRefresh?: () => void }) {
  const [q, setQ] = useState('')
  const [language, setLanguage] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const shown = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(q.toLowerCase()) &&
      (!language || c.language === language) &&
      (!difficulty || c.difficulty === difficulty),
  )
  const langs = [...new Set(courses.map((c) => c.language))]
  const diffs = [...new Set(courses.map((c) => c.difficulty))]
  return (
    <section>
      <h1 className="text-2xl font-bold">My Courses</h1>
      <div className="mt-4 flex flex-wrap gap-2">
        <input type="search" aria-label="Search courses" placeholder="Search courses" value={q}
          onChange={(e) => setQ(e.target.value)} className="rounded border px-2 py-1" />
        <select aria-label="Language" value={language} onChange={(e) => setLanguage(e.target.value)} className="rounded border px-2 py-1">
          <option value="">All languages</option>
          {langs.map((l) => <option key={l}>{l}</option>)}
        </select>
        <select aria-label="Difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="rounded border px-2 py-1">
          <option value="">All difficulties</option>
          {diffs.map((d) => <option key={d}>{d}</option>)}
        </select>
        {onRefresh && (
          <button type="button" className="rounded border px-2 py-1" onClick={onRefresh}>Refresh</button>
        )}
      </div>
      {courses.length === 0 ? (
        <p className="mt-4 text-slate-600">No courses yet. Imported courses will appear here.</p>
      ) : shown.length === 0 ? (
        <p className="mt-4 text-slate-600">No courses match your filters.</p>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((c) => <CourseCard key={c.id} course={c} onRemove={onRemove} />)}
        </div>
      )}
    </section>
  )
}

export function RegisteredCoursesPage() {
  const { courses, loading, error } = useCourses()
  const [removed, setRemoved] = useState<string[]>([])
  const [note, setNote] = useState('')
  const [prog, setProg] = useState<Awaited<ReturnType<typeof listLessonProgress>>>([])
  useEffect(() => { listLessonProgress().then(setProg, () => {}) }, [])
  if (loading) return <p>Loading courses…</p>
  if (error) return <p role="alert">Could not load courses: {error}</p>
  const summaries: CourseSummary[] = courses.filter((r) => !removed.includes(r.id)).map(({ course: c }) => ({
    id: c.id, title: c.title, language: c.language, description: c.description, difficulty: c.difficulty,
    moduleCount: c.modules.length, lessonCount: c.modules.reduce((n, m) => n + m.lessons.length, 0),
    completionPercent: coursePercent(c, completedIds(prog, c.id)),
    lastAccessed: lastPosition(prog, c.id)?.lastAccessed.slice(0, 10),
  }))
  const onRemove = async (id: string) => {
    if (!window.confirm('Remove this course? Your progress, notes and saved code are kept.')) return
    await remove(id)
    setRemoved((r) => [...r, id])
  }
  // ponytail: refresh is a placeholder until course update/import (phase 7)
  return (
    <>
      <CoursesPage courses={summaries} onRemove={(id) => void onRemove(id)} onRefresh={() => setNote('Refresh is not available yet.')} />
      {note && <p role="status" className="mt-2 text-sm">{note}</p>}
    </>
  )
}
