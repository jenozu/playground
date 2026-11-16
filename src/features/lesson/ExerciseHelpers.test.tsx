import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Hints, Solution, shouldReset } from "./ExerciseHelpers";

describe("ExerciseHelpers", () => {
  it("reveals hints one at a time", () => {
    render(<Hints hints={["one", "two"]} />);
    expect(screen.queryByText("one")).toBeNull();
    fireEvent.click(screen.getByText(/Show hint/));
    expect(screen.getByText("one")).toBeTruthy();
    expect(screen.queryByText("two")).toBeNull();
    fireEvent.click(screen.getByText(/Show next hint/));
    expect(screen.getByText("two")).toBeTruthy();
    expect(screen.queryByText(/Show next hint/)).toBeNull();
  });

  it("solution stays hidden when confirm is declined", () => {
    render(<Solution solution="SELECT 1" confirm={() => false} />);
    fireEvent.click(screen.getByText("Show solution"));
    expect(screen.queryByText("SELECT 1")).toBeNull();
  });

  it("showing the solution leaves the editor text unchanged", () => {
    function Harness() {
      const [code, setCode] = useState("SELECT * FROM my_edit");
      return (
        <>
          <textarea aria-label="editor" value={code} onChange={(e) => setCode(e.target.value)} />
          <Solution solution="SELECT 1" confirm={() => true} />
        </>
      );
    }
    render(<Harness />);
    fireEvent.click(screen.getByText("Show solution"));
    expect(screen.getByTestId("solution").textContent).toContain("SELECT 1");
    expect((screen.getByLabelText("editor") as HTMLTextAreaElement).value).toBe("SELECT * FROM my_edit");
  });

  it("reset of unedited code needs no confirm", () => {
    const confirm = vi.fn(() => false);
    expect(shouldReset("starter", "starter", confirm)).toBe(true);
    expect(confirm).not.toHaveBeenCalled();
  });

  it("reset of edited code asks; declining keeps edits, accepting restores starter", () => {
    expect(shouldReset("edited", "starter", () => false)).toBe(false);
    const confirm = vi.fn(() => true);
    expect(shouldReset("edited", "starter", confirm)).toBe(true);
    expect(confirm).toHaveBeenCalledOnce();
  });
});
