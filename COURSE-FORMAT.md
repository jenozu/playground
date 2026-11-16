# Course format

Stub. The authoritative description is PRD section 7; the zod schema in `src/course-system/schema/` will become the source of truth once implemented.

A course is a folder (or ZIP / GitHub repo) with a `course.json` manifest and Markdown lesson files. IDs for course, module and lesson are stable keys for progress and must not be derived from titles or order. Imported Markdown is untrusted: no raw HTML.
