import { useState } from 'react'
import { usePreferences, type Preferences } from '../usePreferences'
import { countsOf, exportData, importData, parseBackup, type Backup } from '../dataBackup'

const field = 'mt-1 block rounded border border-slate-300 bg-white p-2 dark:border-slate-600 dark:bg-slate-800'

function DataBackup() {
  const [pending, setPending] = useState<Backup | null>(null)
  const [msg, setMsg] = useState('')
  async function doExport() {
    const url = URL.createObjectURL(new Blob([JSON.stringify(await exportData(), null, 2)], { type: 'application/json' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `learning-data-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }
  async function pick(file?: File) {
    setPending(null)
    if (!file) return
    try {
      setPending(parseBackup(await file.text()))
      setMsg('')
    } catch (e) {
      setMsg((e as Error).message)
    }
  }
  async function apply(mode: 'merge' | 'replace') {
    if (!pending) return
    if (mode === 'replace' && !window.confirm('Replace ALL current progress, notes, code, bookmarks and attempts with this backup? This cannot be undone.')) return
    try {
      await importData(pending, mode)
      setMsg(`Import complete (${mode}). Reload the page to see it everywhere.`)
      setPending(null)
    } catch (e) {
      setMsg(`Import failed, nothing was changed: ${(e as Error).message}`)
    }
  }
  return (
    <section className="space-y-2 border-t pt-4">
      <h2 className="text-lg font-semibold">Data</h2>
      <button type="button" className="rounded border px-3 py-2" onClick={() => void doExport()}>Export learning data</button>
      <label className="block">
        Import backup (.json)
        <input type="file" accept="application/json,.json" className="mt-1 block" onChange={(e) => void pick(e.target.files?.[0])} />
      </label>
      {pending && (
        <div className="space-y-2">
          <p>Backup contains: {countsOf(pending).map(([s, n]) => `${n} ${s}`).join(', ')}.</p>
          <button type="button" className="mr-2 rounded border px-3 py-2" onClick={() => void apply('merge')}>Merge</button>
          <button type="button" className="rounded border px-3 py-2" onClick={() => void apply('replace')}>Replace</button>
        </div>
      )}
      {msg && <p role="status">{msg}</p>}
    </section>
  )
}

export default function SettingsPage() {
  const { prefs, update, reset } = usePreferences()
  return (
    <section className="max-w-md space-y-4">
      <h1 className="text-2xl font-bold">Settings</h1>
      <label className="block">
        Theme
        <select className={field} value={prefs.theme} onChange={(e) => update({ theme: e.target.value as Preferences['theme'] })}>
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>
      <label className="block">
        Editor font size
        <input
          type="number"
          min={10}
          max={32}
          className={field}
          value={prefs.fontSize}
          onChange={(e) => update({ fontSize: Math.min(32, Math.max(10, Number(e.target.value) || 14)) })}
        />
      </label>
      <label className="block">
        Editor font
        <select className={field} value={prefs.fontFamily} onChange={(e) => update({ fontFamily: e.target.value })}>
          <option value="JetBrains Mono, monospace">JetBrains Mono</option>
          <option value="Fira Code, monospace">Fira Code</option>
          <option value="monospace">System monospace</option>
        </select>
      </label>
      <label className="block">
        Default practice language
        <select
          className={field}
          value={prefs.practiceLanguage}
          onChange={(e) => update({ practiceLanguage: e.target.value as Preferences['practiceLanguage'] })}
        >
          <option value="python">Python</option>
          <option value="sql">SQL</option>
          <option value="javascript">JavaScript</option>
        </select>
      </label>
      <button type="button" className="rounded border px-3 py-2" onClick={() => reset()}>
        Restore defaults
      </button>
      <DataBackup />
    </section>
  )
}
