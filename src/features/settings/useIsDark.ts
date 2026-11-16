import { useEffect, useState } from 'react'

const read = () => document.documentElement.classList.contains('dark')

/** Tracks the app theme (the `dark` class set by applyTheme) so consumers re-render on change. */
export function useIsDark() {
  const [dark, setDark] = useState(read)
  useEffect(() => {
    const mo = new MutationObserver(() => setDark(read()))
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => mo.disconnect()
  }, [])
  return dark
}
