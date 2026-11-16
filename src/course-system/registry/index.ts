import { coursesRepo, courseFilesRepo, preferencesRepo } from '../../storage/repositories'
import { loadCourse, type CourseFiles, type LoadResult } from '../parser'
import type { Course } from '../schema'

// Registry over IndexedDB. remove() deletes the course and its files only:
// progress, code and notes are keyed by stable ids and stay put (PRD 5.3).

export type CourseRecord = { id: string; course: Course; source: string; registeredAt: string }
type FilesRecord = { id: string; files: [string, string | Uint8Array][] }

export async function register(result: LoadResult, source: string): Promise<CourseRecord> {
  if (!result.ok) throw new Error('Cannot register an invalid course')
  const { course, files } = result
  const rec: CourseRecord = { id: course.id, course, source, registeredAt: new Date().toISOString() }
  await courseFilesRepo.put({ id: course.id, files: [...files] } as FilesRecord)
  await coursesRepo.put(rec)
  return rec
}

export const list = () => coursesRepo.list() as Promise<CourseRecord[]>
export const get = (id: string) => coursesRepo.get(id) as Promise<CourseRecord | undefined>

export async function getFiles(id: string): Promise<CourseFiles | undefined> {
  const r = (await courseFilesRepo.get(id)) as FilesRecord | undefined
  return r && new Map(r.files)
}

export async function remove(id: string): Promise<void> {
  await coursesRepo.delete(id)
  await courseFilesRepo.delete(id)
}

// Bundled samples: public/courses/index.json lists folder names. Each folder is fetched
// (course.json, then every file it references) and run through loadCourse like any import.
const BASE = `${import.meta.env.BASE_URL}courses/`

async function fetchText(url: string): Promise<string> {
  const r = await fetch(url)
  if (!r.ok) throw new Error(`${r.status} ${url}`)
  return r.text()
}

function referenced(manifest: unknown): string[] {
  const out: string[] = []
  const mods = (manifest as { modules?: { lessons?: Record<string, unknown>[] }[] })?.modules
  for (const m of Array.isArray(mods) ? mods : [])
    for (const l of Array.isArray(m?.lessons) ? m.lessons : []) {
      const ex = (l?.exercise ?? {}) as Record<string, unknown>
      for (const p of [l?.content, ex.starter, ex.tests, ex.solution, ex.dataset])
        if (typeof p === 'string') out.push(p)
    }
  return out
}

export async function loadSample(folder: string): Promise<LoadResult> {
  const root = `${BASE}${encodeURIComponent(folder)}/`
  const manifest = await fetchText(`${root}course.json`)
  const files: CourseFiles = new Map([['course.json', manifest]])
  let json: unknown
  try { json = JSON.parse(manifest) } catch { return loadCourse(files) } // validator reports it
  for (const p of referenced(json)) {
    if (p.split('/').includes('..') || p.startsWith('/')) continue // validator reports it
    try { files.set(p, await fetchText(root + p.split('/').map(encodeURIComponent).join('/'))) } catch { /* validator reports missing-file */ }
  }
  return loadCourse(files)
}

export async function loadBundledSamples(): Promise<void> {
  if (await preferencesRepo.get('samplesLoaded')) return
  let folders: unknown
  try { folders = JSON.parse(await fetchText(`${BASE}index.json`)) } catch (e) {
    console.warn('No bundled course index', e)
    return
  }
  if (!Array.isArray(folders)) return
  for (const f of folders) {
    if (typeof f !== 'string') continue
    try {
      const res = await loadSample(f)
      if (res.ok) await register(res, `bundled:${f}`)
      else console.warn(`Sample course "${f}" is invalid`, res.errors)
    } catch (e) {
      console.warn(`Sample course "${f}" could not be loaded`, e)
    }
  }
  await preferencesRepo.put({ id: 'samplesLoaded', value: true })
}
