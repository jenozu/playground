import { useEffect, useState } from 'react'
import { isBookmarked, toggleBookmark } from './service'

export function BookmarkButton({ courseId, lessonId, label }: { courseId: string; lessonId?: string; label: string }) {
  const [on, setOn] = useState(false)
  useEffect(() => { void isBookmarked(courseId, lessonId).then(setOn, () => {}) }, [courseId, lessonId])
  return (
    <button
      type="button" aria-pressed={on} aria-label={`Bookmark ${label}`}
      className="rounded border px-2 py-1 text-sm"
      onClick={() => void toggleBookmark(courseId, lessonId).then(setOn, () => {})}
    >
      {on ? '★ Bookmarked' : '☆ Bookmark'}
    </button>
  )
}
