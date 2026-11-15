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

export default function CourseCard({ course }: { course: CourseSummary }) {
  return (
    <article className="rounded border border-slate-300 p-4">
      <h3 className="font-semibold">{course.title}</h3>
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
    </article>
  )
}
