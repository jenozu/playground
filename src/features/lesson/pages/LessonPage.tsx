import { run as runCode, reset as resetEngine } from "../../../execution/manager";
import { testFileSchema } from "../../../course-system/schema";
import { emitIfPassed, evaluateSql } from "../../exercise-evaluation/sql";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
import { useIsDark } from "../../settings/useIsDark";
import { CodeEditor } from "../../../components/editor/CodeEditor";
import { FileTabs } from "../../../components/editor/FileTabs";
import { useCourses } from "../../../course-system/registry/useCourses";
import { getFiles } from "../../../course-system/registry";
import type { CourseFiles } from "../../../course-system/parser";
import { Hints, Solution, shouldReset } from "../ExerciseHelpers";
import { Entry } from "../../../components/terminal/OutputPanel";
import { LessonMarkdown } from "../../lesson-viewer/LessonMarkdown";

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

const text = (v: string | Uint8Array | undefined) =>
  typeof v === "string" ? v : v ? new TextDecoder().decode(v) : undefined;

export default function LessonPage() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { courses, loading, error } = useCourses();
  const course = courses.find((r) => r.id === courseId)?.course;
  // result is keyed by course id so a stale course never shows
  const [res, setRes] = useState<{ id: string; files?: CourseFiles }>();
  useEffect(() => {
    let live = true;
    if (course && courseId)
      getFiles(courseId).then(
        (f) => live && setRes({ id: courseId, files: f ?? undefined }),
        () => live && setRes({ id: courseId }),
      );
    return () => {
      live = false;
    };
  }, [course, courseId]);
  const cur = res?.id === courseId ? res : undefined;
  const files = cur?.files;
  const filesErr = !!cur && !cur.files;
  const flat = (course?.modules ?? []).flatMap((m) =>
    m.lessons.map((l) => ({ m, l })),
  );
  const idx = flat.findIndex((x) => x.l.id === lessonId);
  const lesson = flat[idx]?.l;
  const markdown = text(files?.get(lesson?.content ?? ""));
  const starter = text(files?.get(lesson?.exercise?.starter ?? ""));
  const solution = text(files?.get(lesson?.exercise?.solution ?? ""));
  // blob URLs for binary course files (images); revoked when the course changes or on unmount
  const assets = useMemo(() => {
    const m = new Map<string, string>();
    files?.forEach((v, k) => {
      if (typeof v !== "string") m.set(k, URL.createObjectURL(new Blob([v as BlobPart])));
    });
    return m;
  }, [files]);
  useEffect(() => () => assets.forEach((u) => URL.revokeObjectURL(u)), [assets]);
  const resolveAsset = (src: string) => {
    const parts = (lesson?.content ?? "").split("/").slice(0, -1);
    for (const p of src.split("/")) {
      if (p === "..") parts.pop();
      else if (p !== ".") parts.push(p);
    }
    return assets.get(parts.join("/")) ?? assets.get(src);
  };
  const go = (d: number) => {
    const t = flat[idx + d];
    if (t) void navigate(`/courses/${courseId}/lessons/${t.l.id}`);
  };
  const { prefs, loaded, update } = usePreferences();
  const isDark = useIsDark();
  const group = useRef<GroupImperativeHandle>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const key = `${courseId}/${lessonId}`;
  const [edit, setEdit] = useState<{ key: string; v: string }>();
  const code = edit?.key === key ? edit.v : (starter ?? "");
  const setCode = (v: string) => setEdit({ key, v });
  const [out, setOut] = useState("");
  const [tables, setTables] = useState<{ columns: string[]; rows: unknown[][] }[]>([]);
  const [note, setNote] = useState("");
  // ponytail: placeholder save/submit; arrive in later phases
  const run = async () => {
    const r = await runCode(lesson?.exercise?.type ?? course!.language, code, {
      onStatus: (s) => s !== "done" && (setTables([]), setOut(s === "loading" ? "Loading engine..." : "Running...")),
      options: { dataset: text(files?.get(lesson?.exercise?.dataset ?? "")) || undefined },
    });
    const t = r.tables ?? (r.table ? [r.table] : []);
    setTables(t);
    setOut([r.output, ...r.errors].filter(Boolean).join("\n") || "(no output)");
  };
  const submit = async () => {
    const ex = lesson?.exercise;
    const tf = testFileSchema.safeParse(JSON.parse(text(files?.get(ex?.tests ?? "")) || "null"));
    if (!ex || !tf.success) return setOut("No tests for this lesson.");
    if (tf.data.language !== "sql") return setOut("Submit is not available for this language yet.");
    const options = { dataset: text(files?.get(ex.dataset ?? "")) || undefined };
    const results = await evaluateSql(tf.data.tests, code, {
      reset: () => resetEngine("sql"),
      exec: (c) => runCode("sql", c, { options }),
    });
    const line = (r: (typeof results)[number]) =>
      `${r.passed ? "PASS" : "FAIL"} ${r.name}` +
      (r.passed ? "" : `\n  expected: ${r.expected ?? ""}\n  actual: ${r.actual ?? r.error ?? ""}`);
    setTables([]);
    setOut(results.map(line).join("\n"));
    emitIfPassed(results, window, { courseId, lessonId });
  };
  const controls: [string, () => void][] = [
    ["Previous", () => go(-1)],
    ["Next", () => go(1)],
    ["Run", () => void run()],
    ["Submit", () => void submit()],
    [
      "Reset",
      () => {
        if (shouldReset(code, starter ?? "")) setCode(starter ?? "");
      },
    ],
    ["Save", () => setNote("Saved (placeholder)")],
    ["Clear output", () => (setOut(""), setTables([]))],
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
    (_, i) => `Placeholder output padding ${i + 1}.`,
  );

  if (loading || (course && !files && !filesErr)) return <p className="p-4">Loading lesson…</p>;
  if (error || filesErr)
    return (
      <p role="alert" className="p-4">
        Could not load this course{error ? `: ${error}` : "."} <Link to="/courses" className="underline">Courses</Link>
      </p>
    );
  if (!course || !lesson)
    return (
      <section className="p-4">
        <h1 className="text-2xl font-bold">Lesson not found</h1>
        <Link to="/courses" className="underline">Back to My Courses</Link>
      </section>
    );

  const panel = (id: string, i: number, hide = false) => (
    <section
      key={id}
      aria-label={names[i]}
      data-testid={`panel-${id}`}
      className={`h-full overflow-auto p-3 ${hide ? "hidden" : ""}`}
    >
      <h2 className="font-semibold">{names[i]}</h2>
      {id === "lesson" && (
        <>
          <details className="mb-3 rounded border p-2">
            <summary className="cursor-pointer text-sm">Lessons</summary>
            {course!.modules.map((m) => (
              <div key={m.id} className="mt-2">
                <p className="text-sm font-semibold">{m.title}</p>
                <ul className="ml-4 list-disc text-sm">
                  {m.lessons.map((l) => (
                    <li key={l.id}>
                      <Link
                        to={`/courses/${courseId}/lessons/${l.id}`}
                        aria-current={l.id === lessonId ? "page" : undefined}
                        className={l.id === lessonId ? "font-bold underline" : "underline"}
                      >
                        {l.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </details>
          {markdown === undefined ? (
            <p role="alert">This lesson&apos;s content file is missing.</p>
          ) : (
            <LessonMarkdown
              markdown={markdown}
              title={lesson!.title}
              estimatedMinutes={lesson!.estimatedMinutes}
              resolveAsset={resolveAsset}
            />
          )}
          <Hints key={key} hints={lesson!.exercise?.hints ?? []} />
          {solution !== undefined && <Solution key={`sol-${key}`} solution={solution} />}
        </>
      )}
      {id === "editor" && (
        <div className="mt-2 flex h-[calc(100%-2rem)] flex-col border">
          <FileTabs
            files={[{ id: "main", name: lesson!.exercise?.starter.split("/").pop() ?? "main" }]}
            activeId="main"
            onSelect={() => {}}
          />
          <div className="min-h-0 flex-1">
            <CodeEditor
              value={code}
              onChange={setCode}
              onRun={() => void run()}
              language={lesson!.exercise?.type ?? course!.language}
              fontSize={prefs.fontSize}
              fontFamily={prefs.fontFamily}
              dark={isDark}
            />
          </div>
        </div>
      )}
      {id === "output" && (
        <>
          <pre data-testid="output-text">{out}</pre>
          {tables.map((t, i) => (
            <Entry key={i} e={{ type: "table", ...t }} />
          ))}
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
          {course.title} / {lesson.title}
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
