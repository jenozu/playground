import { Link } from 'react-router-dom'

export interface CourseSummary {
  id: string
  title: string
  language: string
  description: string
  difficulty: string
  moduleCount: number
  lessonCount: number
  completionPercent: number
  lastAccessed?: string
}

export default function CourseCard({ course, onRemove }: { course: CourseSummary; onRemove?: (id: string) => void }) {
  return (
    <article className="rounded border border-slate-300 p-4">
      <h3 className="font-semibold"><Link to={`/courses/${course.id}`} className="underline">{course.title}</Link></h3>
      <p className="text-sm text-slate-600">
        {course.language} · {course.difficulty}
      </p>
      <p className="mt-2 text-sm">{course.description}</p>
      <p className="mt-2 text-sm text-slate-600">
        {course.moduleCount} modules · {course.lessonCount} lessons
      </p>
      <progress className="mt-2 w-full" max={100} value={course.completionPercent} aria-label="Completion" />
      <p className="text-sm">{course.completionPercent}% complete</p>
      <p className="text-xs text-slate-500">
        {course.lastAccessed ? `Last accessed ${course.lastAccessed}` : 'Not started yet'}
      </p>
      {onRemove && (
        <button type="button" className="mt-2 rounded border px-2 py-1 text-sm" onClick={() => onRemove(course.id)}>
          Remove
        </button>
      )}
    </article>
  )
}
