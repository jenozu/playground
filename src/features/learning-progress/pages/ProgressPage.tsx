import { useEffect, useState } from 'react'
import { useCourses } from '../../../course-system/registry/useCourses'
import { attemptsRepo } from '../../../storage/repositories'
import { coursePercent, isCourseComplete, isModuleComplete, successRate, type Attempt } from '../calc'
import { completedIds, listLessonProgress, type LessonProgress } from '../service'

export default function ProgressPage() {
  const { courses } = useCourses()
  const [prog, setProg] = useState<LessonProgress[]>([])
  const [attempts, setAttempts] = useState<Attempt[]>([])
  useEffect(() => {
    listLessonProgress().then(setProg, () => {})
    attemptsRepo.list().then((a) => setAttempts(a as unknown as Attempt[]), () => {})
  }, [])

  const info = courses.map(({ course: c }) => ({ c, done: completedIds(prog, c.id) }))
  const started = info.filter((i) => prog.some((p) => p.courseId === i.c.id))
  const completed = started.filter((i) => isCourseComplete(i.c, i.done))
  const mods = info.flatMap((i) => i.c.modules.filter((m) => isModuleComplete(m, i.done)))
  const lessonCount = info.reduce((n, i) => n + i.done.size, 0)
  const langOf = (id: string) => info.find((i) => i.c.id === id)?.c.language
  const recentLangs = [...new Set(
    [...attempts].sort((a, b) => b.at.localeCompare(a.at)).flatMap((a) => langOf(a.courseId) ?? []),
  )].slice(0, 3)

  const stat = (label: string, value: string | number) => (
    <div className="rounded border border-slate-200 p-3">
      <div className="text-sm text-slate-600">{label}</div>
      <div className="text-xl font-semibold" data-testid={`stat-${label}`}>{value}</div>
    </div>
  )

  return (
    <section>
      <h1 className="text-2xl font-bold">Progress</h1>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {stat('Active courses', started.length - completed.length)}
        {stat('Completed courses', completed.length)}
        {stat('Completed modules', mods.length)}
        {stat('Completed lessons', lessonCount)}
        {stat('Success rate', attempts.length ? `${successRate(attempts)}%` : 'n/a')}
        {stat('Recent languages', recentLangs.join(', ') || 'none yet')}
      </div>
      <ul className="mt-6 space-y-3">
        {started.map(({ c, done }) => (
          <li key={c.id}>
            <div className="flex justify-between text-sm"><span>{c.title}</span><span>{coursePercent(c, done)}%</span></div>
            <div className="h-2 rounded bg-slate-200">
              <div className="h-2 rounded bg-blue-600" style={{ width: `${coursePercent(c, done)}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
