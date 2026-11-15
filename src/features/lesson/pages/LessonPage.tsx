import { useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Group, Panel, Separator, type GroupImperativeHandle, type Layout } from 'react-resizable-panels'
import { DEFAULT_PREFERENCES, usePreferences } from '../../settings/usePreferences'

const IDS = ['lesson', 'editor', 'output']
const toLayout = (w: number[]): Layout => Object.fromEntries(IDS.map((id, i) => [id, w[i]]))
const names = ['Lesson', 'Editor', 'Output']

export default function LessonPage() {
  const { courseId, lessonId } = useParams()
  const { prefs, loaded, update } = usePreferences()
  const group = useRef<GroupImperativeHandle>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])

  const save = (l: Layout) => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => void update({ panelWidths: IDS.map((id) => l[id]) }), 400)
  }
  const restore = () => {
    group.current?.setLayout(toLayout(DEFAULT_PREFERENCES.panelWidths))
    void update({ panelWidths: DEFAULT_PREFERENCES.panelWidths })
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <header className="flex items-center gap-4 border-b border-slate-200 px-3 py-2 dark:border-slate-700">
        <Link to="/courses" className="underline">
          &larr; Courses
        </Link>
        <h1 className="flex-1 truncate font-semibold">
          {courseId} / {lessonId}
        </h1>
        <span className="text-sm">Course 0%</span>
        <span className="text-sm">Lesson 0%</span>
        <button type="button" className="rounded border px-2 py-1 text-sm" onClick={restore}>
          Restore default layout
        </button>
        <Link to="/settings" className="underline">
          Settings
        </Link>
      </header>
      {loaded && (
        <Group
          groupRef={group}
          orientation="horizontal"
          className="min-h-0 flex-1"
          defaultLayout={toLayout(prefs.panelWidths)}
          onLayoutChanged={save}
        >
          {IDS.map((id, i) => (
            <Panel key={id} id={id} minSize="20" maxSize="60" className="overflow-auto">
              <section aria-label={names[i]} data-testid={`panel-${id}`} className="h-full p-3">
                <h2 className="font-semibold">{names[i]}</h2>
              </section>
            </Panel>
          )).flatMap((p, i) =>
            i < 2
              ? [
                  p,
                  <Separator
                    key={`sep${i}`}
                    data-testid={`handle-${i}`}
                    className="w-1.5 bg-slate-200 hover:bg-blue-400 dark:bg-slate-700"
                  />,
                ]
              : [p],
          )}
        </Group>
      )}
    </div>
  )
}
