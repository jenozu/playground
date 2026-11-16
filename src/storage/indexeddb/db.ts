import { openDB, type IDBPDatabase } from 'idb';
import { toStorageError } from '../errors';

export const DB_NAME = 'coding-academy';
export const DB_VERSION = 1;
export const STORES = [
  'preferences', 'courses', 'courseFiles', 'progress', 'code',
  'notes', 'bookmarks', 'practiceSessions', 'attempts',
] as const;
export type StoreName = (typeof STORES)[number];

/** Additive upgrade: only creates missing stores, never deletes. Future versions add `if (oldVersion < N)` blocks. */
function upgrade(db: IDBPDatabase) {
  for (const s of STORES) {
    if (!db.objectStoreNames.contains(s)) db.createObjectStore(s, { keyPath: 'id' });
  }
}

let dbPromise: Promise<IDBPDatabase> | undefined;

export function getDb(): Promise<IDBPDatabase> {
  dbPromise ??= openDB(DB_NAME, DB_VERSION, { upgrade }).catch((e) => {
    dbPromise = undefined;
    throw toStorageError(e);
  });
  return dbPromise;
}
