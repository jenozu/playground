import { Link, useParams } from 'react-router-dom'
import { BookmarkButton } from '../../notes/BookmarkButton'
import { useCourses } from '../../../course-system/registry/useCourses'

export default function CourseDetailPage() {
  const { courseId } = useParams()
  const { courses, loading, error } = useCourses()
  if (loading) return <p>Loading course…</p>
  if (error) return <p role="alert">Could not load courses: {error}</p>
  const c = courses.find((r) => r.id === courseId)?.course
  if (!c)
    return (
      <section>
        <h1 className="text-2xl font-bold">Course not found</h1>
        <Link to="/courses" className="underline">Back to My Courses</Link>
      </section>
    )
  return (
    <section>
      <h1 className="text-2xl font-bold">{c.title}</h1>
      <p className="mt-1 text-slate-600">{c.description}</p>
      <div className="mt-2"><BookmarkButton courseId={c.id} label="course" /></div>
      {c.modules.map((m) => (
        <div key={m.id} className="mt-4">
          <h2 className="font-semibold">{m.title}</h2>
          <ul className="ml-5 list-disc">
            {m.lessons.map((l) => (
              <li key={l.id}>
                <Link to={`/courses/${c.id}/lessons/${l.id}`} className="underline">{l.title}</Link>
                <span className="text-sm text-slate-500"> · {l.estimatedMinutes} min</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  )
}
