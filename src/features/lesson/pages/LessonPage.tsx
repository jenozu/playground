import { useEffect, useRef, useState } from 'react'
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
  const [code, setCode] = useState('print("hello")')
  const [out, setOut] = useState('')
  const [note, setNote] = useState('')
  // ponytail: placeholder handlers; real execution/save/submit arrive in later phases
  const run = () => setOut(`Simulated output for:
${code}`)
  const controls: [string, () => void][] = [
    ['Previous', () => setNote('Previous lesson (placeholder)')],
    ['Next', () => setNote('Next lesson (placeholder)')],
    ['Run', run],
    ['Submit', () => setNote('Submit (placeholder)')],
    ['Reset', () => setCode('print("hello")')],
    ['Save', () => setNote('Saved (placeholder)')],
    ['Clear output', () => setOut('')],
  ]
  const filler = Array.from({ length: 60 }, (_, i) => `Placeholder lesson paragraph ${i + 1}.`)

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
              <section aria-label={names[i]} data-testid={`panel-${id}`} className="h-full overflow-auto p-3">
                <h2 className="font-semibold">{names[i]}</h2>
                {id === 'lesson' && filler.map((t) => <p key={t}>{t}</p>)}
                {id === 'editor' && (
                  <textarea
                    aria-label="Code"
                    className="mt-2 h-[200vh] w-full border font-mono dark:bg-slate-800"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    onKeyDown={(e) => {
                      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') run()
                    }}
                  />
                )}
                {id === 'output' && (
                  <>
                    <pre data-testid="output-text">{out}</pre>
                    {filler.map((t) => (
                      <p key={t} className="invisible">
                        {t}
                      </p>
                    ))}
                  </>
                )}
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
      <footer className="flex items-center gap-2 border-t border-slate-200 px-3 py-2 dark:border-slate-700">
        {controls.map(([label, fn]) => (
          <button key={label} type="button" className="rounded border px-2 py-1 text-sm" onClick={fn}>
            {label}
          </button>
        ))}
        <span className="text-sm" role="status">
          {note}
        </span>
      </footer>
    </div>
  )
}
