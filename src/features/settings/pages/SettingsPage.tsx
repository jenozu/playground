import { usePreferences, type Preferences } from '../usePreferences'

const field = 'mt-1 block rounded border border-slate-300 bg-white p-2 dark:border-slate-600 dark:bg-slate-800'

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
    </section>
  )
}
