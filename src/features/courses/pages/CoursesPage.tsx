import { useState } from 'react'
import CourseCard, { type CourseSummary } from '../components/CourseCard'
import { useCourses } from '../../../course-system/registry/useCourses'

export default function CoursesPage({ courses = [] }: { courses?: CourseSummary[] }) {
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
      </div>
      {courses.length === 0 ? (
        <p className="mt-4 text-slate-600">No courses yet. Imported courses will appear here.</p>
      ) : shown.length === 0 ? (
        <p className="mt-4 text-slate-600">No courses match your filters.</p>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((c) => <CourseCard key={c.id} course={c} />)}
        </div>
      )}
    </section>
  )
}

export function RegisteredCoursesPage() {
  const { courses, loading, error } = useCourses()
  if (loading) return <p>Loading courses…</p>
  if (error) return <p role="alert">Could not load courses: {error}</p>
  const summaries: CourseSummary[] = courses.map(({ course: c }) => ({
    id: c.id, title: c.title, language: c.language, description: c.description, difficulty: c.difficulty,
    moduleCount: c.modules.length, lessonCount: c.modules.reduce((n, m) => n + m.lessons.length, 0),
    completionPercent: 0, // progress wiring is phase 6
  }))
  return <CoursesPage courses={summaries} />
}
