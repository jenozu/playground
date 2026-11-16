import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Group,
  Panel,
  Separator,
  type GroupImperativeHandle,
  type Layout,
} from "react-resizable-panels";
import {
  DEFAULT_PREFERENCES,
  usePreferences,
} from "../../settings/usePreferences";
import { CodeEditor } from "../../../components/editor/CodeEditor";
import { FileTabs } from "../../../components/editor/FileTabs";

const IDS = ["lesson", "editor", "output"];
const toLayout = (w: number[]): Layout =>
  Object.fromEntries(IDS.map((id, i) => [id, w[i]]));
const names = ["Lesson", "Editor", "Output"];

const query = (q: string) => window.matchMedia(q).matches;
const getMode = () =>
  query("(min-width: 1024px)")
    ? "wide"
    : query("(min-width: 768px)")
      ? "tablet"
      : "phone";
function useMode() {
  const [m, setM] = useState(getMode);
  useEffect(() => {
    const f = () => setM(getMode());
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);
  return m;
}

export default function LessonPage() {
  const { courseId, lessonId } = useParams();
  const { prefs, loaded, update } = usePreferences();
  const group = useRef<GroupImperativeHandle>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const [code, setCode] = useState('print("hello")');
  const [out, setOut] = useState("");
  const [note, setNote] = useState("");
  // ponytail: placeholder handlers; real execution/save/submit arrive in later phases
  const run = () =>
    setOut(`Simulated output for:
${code}`);
  const controls: [string, () => void][] = [
    ["Previous", () => setNote("Previous lesson (placeholder)")],
    ["Next", () => setNote("Next lesson (placeholder)")],
    ["Run", run],
    ["Submit", () => setNote("Submit (placeholder)")],
    ["Reset", () => setCode('print("hello")')],
    ["Save", () => setNote("Saved (placeholder)")],
    ["Clear output", () => setOut("")],
  ];
  const mode = useMode();
  const [tab, setTab] = useState("editor");
  const [showLesson, setShowLesson] = useState(true);
  // phone: Lesson|Code|Output; tablet: lesson is a toggle, Code|Output tabs
  const tabs = (
    mode === "phone"
      ? [
          ["lesson", "Lesson"],
          ["editor", "Code"],
          ["output", "Output"],
        ]
      : [
          ["editor", "Code"],
          ["output", "Output"],
        ]
  ) as [string, string][];
  const filler = Array.from(
    { length: 60 },
    (_, i) => `Placeholder lesson paragraph ${i + 1}.`,
  );

  const panel = (id: string, i: number, hide = false) => (
    <section
      key={id}
      aria-label={names[i]}
      data-testid={`panel-${id}`}
      className={`h-full overflow-auto p-3 ${hide ? "hidden" : ""}`}
    >
      <h2 className="font-semibold">{names[i]}</h2>
      {id === "lesson" && filler.map((t) => <p key={t}>{t}</p>)}
      {id === "editor" && (
        <div className="mt-2 flex h-[calc(100%-2rem)] flex-col border">
          <FileTabs
            files={[{ id: "main", name: "main.py" }]}
            activeId="main"
            onSelect={() => {}}
          />
          <div className="min-h-0 flex-1">
            <CodeEditor
              value={code}
              onChange={setCode}
              onRun={run}
              language="python"
              fontSize={prefs.fontSize}
              fontFamily={prefs.fontFamily}
              dark={document.documentElement.classList.contains("dark")}
            />
          </div>
        </div>
      )}
      {id === "output" && (
        <>
          <pre data-testid="output-text">{out}</pre>
          {filler.map((t) => (
            <p key={t} className="invisible">
              {t}
            </p>
          ))}
        </>
      )}
    </section>
  );

  const save = (l: Layout) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(
      () => void update({ panelWidths: IDS.map((id) => l[id]) }),
      400,
    );
  };
  const restore = () => {
    group.current?.setLayout(toLayout(DEFAULT_PREFERENCES.panelWidths));
    void update({ panelWidths: DEFAULT_PREFERENCES.panelWidths });
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <header className="flex flex-wrap items-center gap-4 border-b border-slate-200 px-3 py-2 dark:border-slate-700">
        <Link to="/courses" className="underline">
          &larr; Courses
        </Link>
        <h1 className="flex-1 truncate font-semibold">
          {courseId} / {lessonId}
        </h1>
        <span className="text-sm">Course 0%</span>
        <span className="text-sm">Lesson 0%</span>
        <button
          type="button"
          className="rounded border px-2 py-1 text-sm"
          onClick={restore}
        >
          Restore default layout
        </button>
        <Link to="/settings" className="underline">
          Settings
        </Link>
      </header>
      {loaded && mode === "wide" && (
        <Group
          groupRef={group}
          orientation="horizontal"
          className="min-h-0 flex-1"
          defaultLayout={toLayout(prefs.panelWidths)}
          onLayoutChanged={save}
        >
          {IDS.map((id, i) => (
            <Panel
              key={id}
              id={id}
              minSize="20"
              maxSize="60"
              className="overflow-auto"
            >
              {panel(id, i)}
            </Panel>
          )).flatMap((p, i) =>
            i < 2
              ? [
                  p,
                  <Separator
                    key={`sep${i}`}
                    data-testid={`handle-${i}`}
                    className="w-1.5 bg-slate-200 hover:bg-blue-400 dark:bg-slate-700"
                  />,
                ]
              : [p],
          )}
        </Group>
      )}
      {loaded && mode !== "wide" && (
        <>
          <div role="tablist" className="flex gap-1 border-b px-2 py-1">
            {mode === "tablet" && (
              <button
                type="button"
                className="rounded border px-2 py-1 text-sm"
                aria-pressed={showLesson}
                onClick={() => setShowLesson((v) => !v)}
              >
                {showLesson ? "Hide lesson" : "Show lesson"}
              </button>
            )}
            {tabs.map(([id, label]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tab === id}
                className={`rounded px-3 py-1 text-sm ${tab === id ? "bg-blue-600 text-white" : "border"}`}
                onClick={() => setTab(id)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex min-h-0 flex-1">
            {IDS.map((id, i) => {
              const hide =
                id === "lesson"
                  ? mode === "tablet"
                    ? !showLesson
                    : tab !== id
                  : tab !== id;
              return (
                <div
                  key={id}
                  className={`min-h-0 min-w-0 ${hide ? "hidden" : id === "lesson" && mode === "tablet" ? "w-2/5" : "flex-1"}`}
                >
                  {panel(id, i)}
                </div>
              );
            })}
          </div>
        </>
      )}
      <footer className="flex flex-wrap items-center gap-2 border-t border-slate-200 px-3 py-2 dark:border-slate-700">
        {controls.map(([label, fn]) => (
          <button
            key={label}
            type="button"
            className="rounded border px-2 py-1 text-sm"
            onClick={fn}
          >
            {label}
          </button>
        ))}
        <span className="text-sm" role="status">
          {note}
        </span>
      </footer>
    </div>
  );
}
