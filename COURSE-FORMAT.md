# Course format

Courses are plain files: a `course.json` manifest plus Markdown/code/test files. The schema lives in
`src/course-system/schema/index.ts` (zod, `schemaVersion` 1) and is the source of truth. Unknown fields are
allowed (forward compatibility). Changing this format needs owner approval.

## Layout

```text
sql-fundamentals/
  course.json
  assets/
  module-01/
    lesson-01.md
    lesson-01.sql
    lesson-01-tests.json
```

All paths in `course.json` are relative to the course folder. Absolute paths and `..` are rejected.

## IDs

`id` fields (course, module, lesson) are lowercase slugs: `^[a-z0-9]+(-[a-z0-9]+)*$`. They are the keys for saved
progress, so never change them when editing content, and never derive them from titles or positions.

## course.json

| Field | Req | Description |
|---|---|---|
| `schemaVersion` | no | `1` (default) |
| `id` | yes | course slug |
| `title` | yes | display title |
| `version` | yes | semver, e.g. `1.0.0` |
| `language` | yes | `sql`, `python` or `javascript` |
| `description` | yes | short summary |
| `difficulty` | yes | `beginner`, `intermediate`, `advanced` |
| `estimatedHours` | yes | positive number |
| `author`, `source` | no | strings |
| `prerequisites` | no | array of strings (course ids or free text) |
| `resources` | no | array of `{ title, url }` |
| `modules` | yes | non-empty array of modules |

### Module

| Field | Req | Description |
|---|---|---|
| `id` | yes | slug, unique within the course |
| `title` | yes | |
| `lessons` | yes | non-empty array of lessons |

### Lesson

| Field | Req | Description |
|---|---|---|
| `id` | yes | slug, unique within the module |
| `title` | yes | |
| `type` | no | `reading` (default), `coding`, `guided`, `multiple-choice`, `debugging`, `project`, `review` |
| `content` | yes | path to the lesson Markdown (no raw HTML; it is sanitized) |
| `estimatedMinutes` | yes | positive number |
| `exercise` | no | see below |

### Exercise

| Field | Req | Description |
|---|---|---|
| `type` | yes | `sql`, `python` or `javascript` |
| `starter` | yes | path to starter code |
| `tests` | yes | path to the tests JSON |
| `solution` | no | path to the solution |
| `hints` | no | array of strings, shown progressively |
| `dataset` | no | path to a SQL file that sets up the database (SQL lessons) |

## Example (PRD 7.2)

```json
{
  "id": "python-fundamentals",
  "title": "Python Fundamentals",
  "version": "1.0.0",
  "language": "python",
  "description": "Learn Python programming from beginner level.",
  "difficulty": "beginner",
  "estimatedHours": 30,
  "modules": [
    {
      "id": "module-01",
      "title": "Python Basics",
      "lessons": [
        {
          "id": "lesson-01",
          "title": "Hello World",
          "content": "module-01/lesson-01.md",
          "estimatedMinutes": 10,
          "exercise": {
            "type": "python",
            "starter": "module-01/lesson-01.py",
            "tests": "module-01/lesson-01-tests.json",
            "solution": "module-01/lesson-01-solution.py"
          }
        }
      ]
    }
  ]
}
```

## Test files (`*-tests.json`)

Shape: `{ "language": "...", "tests": [ ... ] }`, at least one test, each with a `name`.

- **sql**: each test has `expectedRows` (array of row arrays; optional `expectedColumns`, `orderMatters`) and/or
  `checkQuery` (a query run after the user's SQL).
- **python / javascript**: each test has `assert` (a named snippet appended to the user's code) and/or
  `expectedStdout`.

```json
{ "language": "python", "tests": [ { "name": "prints the language", "expectedStdout": "Python\n" } ] }
```
