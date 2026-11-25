import { bookmarksRepo, notesRepo } from '../../storage/repositories'

// Stable ids only (course/lesson), never titles or positions.
const noteKey = (c: string, l: string) => `note:${c}/${l}`
export const bookmarkKey = (c: string, l?: string) => (l ? `lesson:${c}/${l}` : `course:${c}`)

export interface Bookmark { id: string; courseId: string; lessonId?: string }

export async function getNote(c: string, l: string) {
  return ((await notesRepo.get(noteKey(c, l))) as { text?: string } | undefined)?.text ?? ''
}
export const saveNote = (c: string, l: string, text: string) =>
  notesRepo.put({ id: noteKey(c, l), courseId: c, lessonId: l, text, updatedAt: new Date().toISOString() })

export const listBookmarks = async () => (await bookmarksRepo.list()) as unknown as Bookmark[]
export const isBookmarked = async (c: string, l?: string) => !!(await bookmarksRepo.get(bookmarkKey(c, l)))
export async function toggleBookmark(c: string, l?: string) {
  const id = bookmarkKey(c, l)
  if (await bookmarksRepo.get(id)) { await bookmarksRepo.delete(id); return false }
  await bookmarksRepo.put({ id, courseId: c, ...(l ? { lessonId: l } : {}) })
  return true
}
