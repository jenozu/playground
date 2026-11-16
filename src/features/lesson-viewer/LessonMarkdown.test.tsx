import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LessonMarkdown, safeUrl } from "./LessonMarkdown";

const md = (s: string, p = {}) =>
  render(<LessonMarkdown markdown={s} {...p} />);

describe("LessonMarkdown", () => {
  it("renders table, code, title and minutes", () => {
    const { container } = md(
      "| a | b |\n|---|---|\n| 1 | 2 |\n\n```sql\nSELECT 1;\n```",
      {
        title: "T",
        estimatedMinutes: 5,
      },
    );
    expect(container.querySelector("table")).toBeTruthy();
    expect(container.querySelector("pre code")?.textContent).toContain(
      "SELECT 1;",
    );
    expect(screen.getByText("T")).toBeTruthy();
    expect(screen.getByText("5 min")).toBeTruthy();
  });

  it("resolves relative images via resolveAsset", () => {
    const { container } = md("![x](img/a.png)", {
      resolveAsset: (p: string) => `blob:${p}`,
    });
    expect(container.querySelector("img")?.getAttribute("src")).toBe(
      "blob:img/a.png",
    );
  });

  it("neutralises scripts, raw html and javascript: links", () => {
    const { container } = md(
      '<script>alert(1)</script>\n\n<img src=x onerror="alert(1)">\n\n[bad](javascript:alert(1)) [bad2](java\tscript:alert(1)) [ok](https://e.com)',
    );
    expect(container.querySelector("script")).toBeNull();
    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector("[onerror]")).toBeNull();
    const hrefs = [...container.querySelectorAll("a")].map((a) =>
      a.getAttribute("href"),
    );
    expect(hrefs.some((h) => h?.includes("javascript"))).toBe(false);
    const ok = container.querySelector('a[href="https://e.com"]');
    expect(ok?.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("renders callouts", () => {
    const { container } = md("> [!WARNING]\n> careful");
    const bq = container.querySelector("blockquote");
    expect(bq?.getAttribute("data-callout")).toBe("warning");
    expect(bq?.textContent).not.toContain("[!WARNING]");
  });

  it("highlights fenced code as inert spans", () => {
    const { container } = md("```sql\nSELECT '<b>x</b>' -- hi\n```");
    const code = container.querySelector("pre code")!;
    expect(code.querySelector("span.text-purple-400")?.textContent).toBe(
      "SELECT",
    );
    expect(code.querySelector("span.text-green-400")?.textContent).toBe(
      "'<b>x</b>'",
    );
    expect(code.querySelector("b")).toBeNull();
  });

  it("treats prototype-key fence languages as plain text", () => {
    const { container } = md(
      "```constructor\nx = 1\n```\n\n```__proto__\ny = 2\n```\n\n```toString\nz\n```",
    );
    const codes = [...container.querySelectorAll("pre code")];
    expect(codes.map((c) => c.textContent)).toEqual(["x = 1\n", "y = 2\n", "z\n"]);
    expect(container.querySelector("pre code span")).toBeNull();
  });

  it("drops protocol-relative URLs, including backslash variants", () => {
    for (const u of ["//evil.com", "/\\evil.com", "\\/evil.com", "\\\\evil.com"])
      expect(safeUrl(u)).toBe("");
    expect(safeUrl("/img/a.png")).toBe("/img/a.png");
    expect(safeUrl("img/a.png")).toBe("img/a.png");
  });

  it("opens only absolute http(s) links in a new tab", () => {
    const { container } = md("[rel](lesson2.md) [abs](https://e.com)");
    const [rel, abs] = container.querySelectorAll("a");
    expect(rel.getAttribute("target")).toBeNull();
    expect(abs.getAttribute("target")).toBe("_blank");
  });
});
