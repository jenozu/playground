import { useEffect, useState } from 'react'
import { useCourses } from '../../../course-system/registry/useCourses'
import { coursePercent } from '../../learning-progress/calc'
import { completedIds, lastPosition, listLessonProgress, type LessonProgress } from '../../learning-progress/service'
import type { CourseSummary } from '../../courses/components/CourseCard'
import DashboardPage from './DashboardPage'

export default function LiveDashboard() {
  const { courses } = useCourses()
  const [prog, setProg] = useState<LessonProgress[]>([])
  useEffect(() => { listLessonProgress().then(setProg, () => {}) }, [])

  const to = (c: string, l: string) => `/courses/${c}/lessons/${l}`
  const info = courses.map(({ course: c }) => {
    const lessons = c.modules.flatMap((m) => m.lessons)
    const done = completedIds(prog, c.id)
    const summary: CourseSummary = {
      id: c.id, title: c.title, language: c.language, description: c.description, difficulty: c.difficulty,
      moduleCount: c.modules.length, lessonCount: lessons.length,
      completionPercent: coursePercent(c, done), lastAccessed: lastPosition(prog, c.id)?.lastAccessed.slice(0, 10),
    }
    return { c, lessons, done, summary }
  })

  const last = lastPosition(prog.filter((p) => info.some((i) => i.c.id === p.courseId)))
  const lastInfo = info.find((i) => i.c.id === last?.courseId)
  const lastLesson = lastInfo?.lessons.find((l) => l.id === last?.lessonId)
  const next = lastInfo?.lessons.find((l) => !lastInfo.done.has(l.id))

  const all = info.flatMap((i) => i.lessons)
  const doneCount = info.reduce((n, i) => n + i.lessons.filter((l) => i.done.has(l.id)).length, 0)
  const recent = prog
    .filter((p) => p.completed && p.completedAt)
    .sort((a, b) => b.completedAt!.localeCompare(a.completedAt!))
    .flatMap((p) => info.find((i) => i.c.id === p.courseId)?.lessons.find((l) => l.id === p.lessonId)?.title ?? [])
    .slice(0, 5)

  return (
    <DashboardPage
      continueLearning={lastInfo && lastLesson ? { title: lastLesson.title, courseTitle: lastInfo.c.title, to: to(lastInfo.c.id, lastLesson.id) } : undefined}
      activeCourses={info.filter((i) => prog.some((p) => p.courseId === i.c.id) && i.summary.completionPercent < 100).map((i) => i.summary)}
      overallPercent={all.length && prog.length ? Math.round((doneCount / all.length) * 100) : undefined}
      recentlyCompleted={recent}
      recommended={lastInfo && next ? { title: next.title, courseTitle: lastInfo.c.title, to: to(lastInfo.c.id, next.id) } : undefined}
    />
  )
}
