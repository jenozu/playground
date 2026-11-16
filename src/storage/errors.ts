export type StorageErrorKind = 'quota' | 'unavailable' | 'unknown';

/** Typed error the UI can show instead of a raw DOMException. */
export class StorageError extends Error {
  constructor(public kind: StorageErrorKind, public cause?: unknown) {
    super(
      kind === 'quota'
        ? 'Browser storage is full.'
        : kind === 'unavailable'
          ? 'Browser storage is unavailable (private mode or blocked).'
          : 'Storage operation failed.',
    );
    this.name = 'StorageError';
  }
}

export function toStorageError(e: unknown): StorageError {
  if (e instanceof StorageError) return e;
  const name = (e as { name?: string })?.name;
  if (name === 'QuotaExceededError') return new StorageError('quota', e);
  if (name === 'SecurityError' || name === 'InvalidStateError' || name === 'UnknownError')
    return new StorageError('unavailable', e);
  return new StorageError('unknown', e);
}
