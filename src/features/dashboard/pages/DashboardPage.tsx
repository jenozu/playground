import { Link } from 'react-router-dom'
import CourseCard, { type CourseSummary } from '../../courses/components/CourseCard'

export interface LessonLink { title: string; courseTitle: string; to: string }

interface Props {
  activeCourses?: CourseSummary[]
  continueLearning?: LessonLink
  recentlyCompleted?: string[]
  recommended?: LessonLink
  overallPercent?: number
}

function Section({ title, empty, children }: { title: string; empty: string; children?: React.ReactNode }) {
  return (
    <section className="rounded border border-slate-300 p-4">
      <h2 className="font-semibold">{title}</h2>
      {children || <p className="mt-2 text-sm text-slate-600">{empty}</p>}
    </section>
  )
}

export default function DashboardPage({
  activeCourses = [], continueLearning, recentlyCompleted = [], recommended, overallPercent,
}: Props) {
  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-2 text-slate-600">Welcome back. Pick up where you left off.</p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Section title="Continue Learning" empty="Nothing to continue yet. Start a course to see it here.">
          {continueLearning && <p className="mt-2 text-sm"><Link to={continueLearning.to} className="underline">Continue: {continueLearning.title}</Link> ({continueLearning.courseTitle})</p>}
        </Section>
        <Section title="Overall progress" empty="No progress yet.">
          {overallPercent !== undefined && <p className="mt-2 text-sm">{overallPercent}% complete</p>}
        </Section>
        <Section title="Active courses" empty="No active courses.">
          {activeCourses.length > 0 && (
            <div className="mt-2 grid gap-2">{activeCourses.map((c) => <CourseCard key={c.id} course={c} />)}</div>
          )}
        </Section>
        <Section title="Recently completed" empty="No completed lessons yet.">
          {recentlyCompleted.length > 0 && (
            <ul className="mt-2 list-disc pl-5 text-sm">{recentlyCompleted.map((t) => <li key={t}>{t}</li>)}</ul>
          )}
        </Section>
        <Section title="Recommended next" empty="Recommendations appear once you have courses.">
          {recommended && <p className="mt-2 text-sm"><Link to={recommended.to} className="underline">{recommended.title}</Link> ({recommended.courseTitle})</p>}
        </Section>
        <Section title="Quick exercise" empty="">
          <p className="mt-2 text-sm"><Link to="/practice" className="underline">Try a quick exercise</Link></p>
        </Section>
      </div>
    </div>
  )
}
