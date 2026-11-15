import 'fake-indexeddb/auto';
import { describe, expect, it } from 'vitest';
import { getDb, STORES } from './indexeddb/db';
import { progressRepo } from './repositories';
import { toStorageError } from './errors';

describe('storage', () => {
  it('creates all stores', async () => {
    const db = await getDb();
    expect([...db.objectStoreNames].sort()).toEqual([...STORES].sort());
  });
  it('get/put/list/delete', async () => {
    await progressRepo.put({ id: 'a', done: true });
    expect(await progressRepo.get('a')).toEqual({ id: 'a', done: true });
    expect(await progressRepo.list()).toHaveLength(1);
    await progressRepo.delete('a');
    expect(await progressRepo.get('a')).toBeUndefined();
  });
  it('maps quota errors', () => {
    const e = toStorageError(Object.assign(new Error('x'), { name: 'QuotaExceededError' }));
    expect(e.kind).toBe('quota');
  });
});
