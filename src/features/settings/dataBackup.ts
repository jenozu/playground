import { z } from 'zod'
import { getDb, type StoreName } from '../../storage/indexeddb/db'

export const BACKUP_STORES = ['progress', 'notes', 'code', 'bookmarks', 'attempts'] as const satisfies readonly StoreName[]
export const EXPORT_VERSION = 1

const record = z.looseObject({ id: z.string().min(1) })
const backupSchema = z.object({
  exportVersion: z.literal(EXPORT_VERSION),
  exportedAt: z.string(),
  stores: z.object({
    progress: z.array(record),
    notes: z.array(record),
    code: z.array(record),
    bookmarks: z.array(record),
    attempts: z.array(record).default([]),
  }),
})
export type Backup = z.infer<typeof backupSchema> & { /** stores actually present in the file; Replace only clears these */ present?: StoreName[] }

export async function exportData(): Promise<Backup> {
  const db = await getDb()
  const entries = await Promise.all(BACKUP_STORES.map(async (s) => [s, await db.getAll(s)] as const))
  return { exportVersion: EXPORT_VERSION, exportedAt: new Date().toISOString(), stores: Object.fromEntries(entries) as Backup['stores'] }
}

/** Parses and validates text; throws Error with a readable message. Writes nothing. */
export function parseBackup(text: string): Backup {
  let json: unknown
  try {
    json = JSON.parse(text)
  } catch {
    throw new Error('This file is not valid JSON.')
  }
  const r = backupSchema.safeParse(json)
  if (!r.success) throw new Error(`This is not a valid backup file: ${r.error.issues[0]?.path.join('.') || 'root'}: ${r.error.issues[0]?.message}`)
  const raw = (json as { stores: Record<string, unknown> }).stores
  return { ...r.data, present: BACKUP_STORES.filter((s) => s in raw) }
}

export const countsOf = (b: Backup) => BACKUP_STORES.map((s) => [s, b.stores[s].length] as const)

/** merge: backup records overwrite same-id records, others kept. replace: backup stores replace current ones. One transaction: all or nothing. */
export async function importData(b: Backup, mode: 'merge' | 'replace'): Promise<void> {
  const db = await getDb()
  const tx = db.transaction([...BACKUP_STORES], 'readwrite')
  for (const s of BACKUP_STORES) {
    const store = tx.objectStore(s)
    if (mode === 'replace' && (!b.present || b.present.includes(s))) await store.clear()
    for (const rec of b.stores[s]) await store.put(rec)
  }
  await tx.done
}
