import { useCallback, useEffect, useState } from 'react'
import { preferencesRepo } from '../../storage/repositories'

export type Theme = 'system' | 'light' | 'dark'
export interface Preferences {
  theme: Theme
  fontSize: number
  fontFamily: string
  practiceLanguage: 'python' | 'sql' | 'javascript'
  panelWidths: number[]
}

export const DEFAULT_PREFERENCES: Preferences = {
  theme: 'system',
  fontSize: 14,
  fontFamily: 'JetBrains Mono, monospace',
  practiceLanguage: 'python',
  panelWidths: [33, 34, 33],
}

const ID = 'app'
export const THEME_CACHE_KEY = 'pca-theme' // read synchronously by index.html to avoid a flash

export function applyTheme(theme: Theme) {
  const dark = theme === 'dark' || (theme === 'system' && matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.classList.toggle('dark', dark)
  try {
    localStorage.setItem(THEME_CACHE_KEY, theme)
  } catch {
    /* cache only; IndexedDB is the source of truth */
  }
}

export function usePreferences() {
  const [prefs, setPrefs] = useState<Preferences>(DEFAULT_PREFERENCES)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let live = true
    preferencesRepo
      .get(ID)
      .then((rec) => {
        if (!live) return
        const p = { ...DEFAULT_PREFERENCES, ...(rec as Partial<Preferences> | undefined) }
        setPrefs(p)
        applyTheme(p.theme)
      })
      .catch(() => {})
      .finally(() => live && setLoaded(true))
    return () => {
      live = false
    }
  }, [])

  const save = useCallback(async (next: Preferences) => {
    setPrefs(next)
    applyTheme(next.theme)
    await preferencesRepo.put({ id: ID, ...next })
  }, [])

  const update = useCallback((patch: Partial<Preferences>) => save({ ...prefs, ...patch }), [prefs, save])
  const reset = useCallback(() => save(DEFAULT_PREFERENCES), [save])

  return { prefs, loaded, update, reset }
}
