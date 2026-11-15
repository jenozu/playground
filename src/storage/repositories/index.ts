import { getDb, type StoreName } from '../indexeddb/db';
import { toStorageError } from '../errors';

/** Persistence contract; a server DB can implement this later. Records are keyed by a stable string `id`. */
export interface Repository<T extends { id: string }> {
  get(id: string): Promise<T | undefined>;
  put(value: T): Promise<void>;
  list(): Promise<T[]>;
  delete(id: string): Promise<void>;
}

async function run<R>(fn: () => Promise<R>): Promise<R> {
  try {
    return await fn();
  } catch (e) {
    throw toStorageError(e);
  }
}

export function createRepository<T extends { id: string }>(store: StoreName): Repository<T> {
  return {
    get: (id) => run(async () => (await getDb()).get(store, id) as Promise<T | undefined>),
    put: (v) => run(async () => void (await (await getDb()).put(store, v))),
    list: () => run(async () => (await getDb()).getAll(store) as Promise<T[]>),
    delete: (id) => run(async () => (await getDb()).delete(store, id)),
  };
}

type Rec = { id: string; [k: string]: unknown };
export const preferencesRepo = createRepository<Rec>('preferences');
export const coursesRepo = createRepository<Rec>('courses');
export const courseFilesRepo = createRepository<Rec>('courseFiles');
export const progressRepo = createRepository<Rec>('progress');
export const codeRepo = createRepository<Rec>('code');
export const notesRepo = createRepository<Rec>('notes');
export const bookmarksRepo = createRepository<Rec>('bookmarks');
export const practiceSessionsRepo = createRepository<Rec>('practiceSessions');
export const attemptsRepo = createRepository<Rec>('attempts');
