export interface EditorFile {
  id: string
  name: string
}

interface Props {
  files: EditorFile[]
  activeId: string
  onSelect: (id: string) => void
}

export function FileTabs({ files, activeId, onSelect }: Props) {
  return (
    <div role="tablist" className="flex border-b border-slate-300 dark:border-slate-700">
      {files.map((f) => (
        <button
          key={f.id}
          role="tab"
          aria-selected={f.id === activeId}
          onClick={() => onSelect(f.id)}
          className={`px-3 py-1 text-sm ${f.id === activeId ? 'border-b-2 border-blue-500 font-medium' : 'text-slate-500'}`}
        >
          {f.name}
        </button>
      ))}
    </div>
  )
}
