import { parseCourse, type Course } from '../schema'

// Loads one course from a virtual file map (bundled, GitHub or ZIP). Pure, no DOM.
// Input is untrusted: paths are checked here and again by the schema.

export type CourseFiles = Map<string, string | Uint8Array>
export type LoadErrorCode =
  | 'missing-manifest'
  | 'invalid-json'
  | 'unsupported-version'
  | 'unsupported-language'
  | 'invalid-path'
  | 'missing-file'
  | 'invalid-manifest'
export type LoadError = { code: LoadErrorCode; path: string; message: string }
export type LoadResult =
  | { ok: true; course: Course; files: CourseFiles; warnings: string[] }
  | { ok: false; errors: LoadError[] }

export const SUPPORTED_SCHEMA_VERSIONS = [1]
export const SUPPORTED_LANGUAGES = ['sql', 'python', 'javascript']
const MANIFEST = 'course.json'

// No "..", no leading "/" or "\", no backslash, no drive letter, no NUL.
export function isSafePath(p: string): boolean {
  return (
    p.length > 0 &&
    !/^([a-zA-Z]:|[\\/])/.test(p) &&
    !p.includes('\\') &&
    !p.includes('\0') &&
    !p.split('/').includes('..')
  )
}

function jsonErrorMessage(text: string, e: unknown): string {
  const msg = e instanceof Error ? e.message : String(e)
  const m = /position (\d+)/.exec(msg)
  if (!m) return msg
  const before = text.slice(0, Number(m[1])).split('\n')
  return `${msg} (line ${before.length}, column ${before[before.length - 1].length + 1})`
}

export function loadCourse(files: CourseFiles): LoadResult {
  const raw = files.get(MANIFEST)
  if (raw === undefined) {
    return { ok: false, errors: [{ code: 'missing-manifest', path: MANIFEST, message: 'course.json not found at the course root' }] }
  }
  const text = typeof raw === 'string' ? raw : new TextDecoder().decode(raw)
  let json: unknown
  try {
    json = JSON.parse(text.replace(/^\uFEFF/, ''))
  } catch (e) {
    return { ok: false, errors: [{ code: 'invalid-json', path: MANIFEST, message: jsonErrorMessage(text, e) }] }
  }

  const v = (json as { schemaVersion?: unknown } | null)?.schemaVersion
  if (v !== undefined && !SUPPORTED_SCHEMA_VERSIONS.includes(v as number)) {
    return {
      ok: false,
      errors: [{ code: 'unsupported-version', path: 'schemaVersion', message: `schemaVersion ${JSON.stringify(v)} is not supported (supported: ${SUPPORTED_SCHEMA_VERSIONS.join(', ')})` }],
    }
  }

  const r = parseCourse(json)
  if (!r.ok) {
    return {
      ok: false,
      errors: r.errors.map((line) => {
        const i = line.indexOf(': ')
        const path = line.slice(0, i)
        const message = line.slice(i + 2)
        const isLang = path === 'language' || /(^|\.)exercise\.type$/.test(path)
        const code: LoadErrorCode = message.includes('relative path') ? 'invalid-path' : isLang ? 'unsupported-language' : 'invalid-manifest'
        return { code, path, message }
      }),
    }
  }

  const course = r.course
  const errors: LoadError[] = []
  const warnings: string[] = []
  const check = (p: string | undefined, path: string) => {
    if (p === undefined) return
    if (!isSafePath(p)) errors.push({ code: 'invalid-path', path, message: `unsafe path "${p}"` })
    else if (!files.has(p)) errors.push({ code: 'missing-file', path, message: `file not found: ${p}` })
  }
  course.modules.forEach((m, mi) =>
    m.lessons.forEach((l, li) => {
      const base = `modules.${mi}.lessons.${li}`
      check(l.content, `${base}.content`)
      if (l.exercise) {
        const e = l.exercise
        check(e.starter, `${base}.exercise.starter`)
        check(e.tests, `${base}.exercise.tests`)
        check(e.solution, `${base}.exercise.solution`)
        check(e.dataset, `${base}.exercise.dataset`)
        if (!e.solution) warnings.push(`${base}: exercise has no solution file`)
      }
    }),
  )
  if (errors.length) return { ok: false, errors }
  return { ok: true, course, files, warnings }
}
