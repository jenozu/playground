import 'fake-indexeddb/auto'
import { describe, it, expect } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { usePreferences, DEFAULT_PREFERENCES } from './usePreferences'

window.matchMedia ??= ((q: string) => ({ matches: false, media: q }) as MediaQueryList) as typeof window.matchMedia

describe('usePreferences', () => {
  it('defaults, persists across remount, resets', async () => {
    const a = renderHook(() => usePreferences())
    await waitFor(() => expect(a.result.current.loaded).toBe(true))
    expect(a.result.current.prefs).toEqual(DEFAULT_PREFERENCES)
    await act(() => a.result.current.update({ theme: 'dark', fontSize: 18 }))
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem('pca-theme')).toBe('dark')
    a.unmount()

    const b = renderHook(() => usePreferences())
    await waitFor(() => expect(b.result.current.prefs.fontSize).toBe(18))
    expect(b.result.current.prefs.theme).toBe('dark')
    await act(() => b.result.current.reset())
    expect(b.result.current.prefs).toEqual(DEFAULT_PREFERENCES)
  })
})
