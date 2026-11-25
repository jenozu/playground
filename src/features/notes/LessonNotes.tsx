import { useEffect, useRef, useState } from 'react'
import { getNote, saveNote } from './service'

/** Plain textarea, debounced autosave, flushed on unmount. Mount with key=course/lesson. */
export function LessonNotes({ courseId, lessonId }: { courseId: string; lessonId: string }) {
  const [text, setText] = useState('')
  const [loaded, setLoaded] = useState(false)
  const pending = useRef<string>()
  const timer = useRef<ReturnType<typeof setTimeout>>()
  const flush = () => {
    clearTimeout(timer.current)
    if (pending.current !== undefined) void saveNote(courseId, lessonId, pending.current).catch(() => {})
    pending.current = undefined
  }
  useEffect(() => {
    void getNote(courseId, lessonId).then((t) => { setText((cur) => cur || t); setLoaded(true) }, () => setLoaded(true))
    return flush
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, lessonId])
  return (
    <div className="mt-3">
      <label className="text-sm font-semibold" htmlFor="lesson-notes">Notes</label>
      <textarea
        id="lesson-notes" disabled={!loaded} value={text} rows={4}
        className="mt-1 w-full rounded border p-2 text-sm dark:bg-slate-900"
        onChange={(e) => {
          setText(e.target.value)
          pending.current = e.target.value
          clearTimeout(timer.current)
          timer.current = setTimeout(flush, 500)
        }}
      />
    </div>
  )
}
