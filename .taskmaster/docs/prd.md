# PERSONAL CODING ACADEMY
# MASTER PRODUCT REQUIREMENTS DOCUMENT (PRD)

**Project:** Personal Coding Academy  
**Document:** Master Product Requirements & Technical Specification  
**Version:** 2.0  
**Status:** Proposed — Ready for Repository Audit and Technical Planning  
**Primary reference:** User-provided Codecademy screenshot  
**Target platform:** Browser-based web application  
**Initial audience:** Single personal user  
**Development approach:** Modular, phased, GitHub-managed development

---

# TABLE OF CONTENTS

1. Project Vision
2. Product Objectives
3. Core Product Principles
4. Reference Interface and User Experience
5. Application Navigation and Dashboard
6. Course Management System
7. Course Content Architecture
8. Lesson Viewer
9. Interactive Code Editor
10. Code Execution and Programming Languages
11. Exercise and Assessment System
12. Learning Progress and Persistence
13. Course Import and GitHub Integration
14. Independent Practice Environment
15. Project-Based Learning
16. Security Architecture
17. Technical Architecture and Technology Stack
18. Data Architecture
19. User Interface and Design System
20. Performance and Reliability
21. Deployment and Infrastructure
22. Testing and Quality Assurance
23. MVP Scope and Priorities
24. Development Roadmap
25. GitHub and Claude Code Development Workflow
26. Documentation Requirements
27. Acceptance Criteria
28. Future Expansion
29. Final Product Definition

---

# 1. PROJECT VISION

## 1.1 Overview

Build a personal, browser-based programming education platform inspired primarily by the interactive learning experience offered by Codecademy and freeCodeCamp.

The application should combine:

- Structured programming courses.
- Interactive lessons.
- Integrated code editors.
- Real-time code execution.
- Terminal and output panels.
- Automatic exercise evaluation.
- Course management.
- Learning progress tracking.
- Importable educational content.
- Independent programming practice.

The application should provide a centralized environment where the user can learn multiple programming languages without having to switch between different learning platforms or programming tools.

The ultimate objective is to create a personal alternative to Codecademy that the user controls, can extend indefinitely, and can populate with independently sourced educational material.

## 1.2 Core Concept

The application consists of two independent but connected components.

**Component A: Learning Platform**

The actual web application responsible for:
- Navigation.
- Course management.
- Lesson presentation.
- Interactive code editors.
- Code execution.
- Exercise evaluation.
- Progress tracking.
- Personal notes and saved work.

**Component B: Course Library**

An independent collection of educational content containing:
- Courses.
- Modules.
- Lessons.
- Explanations.
- Examples.
- Exercises.
- Starter code.
- Test cases.
- Projects.
- Supporting resources.

The Learning Platform must be capable of importing and interpreting content from the Course Library without requiring changes to the application's source code.

This separation is a fundamental architectural requirement.

## 1.3 Primary Success Scenario

A user should be able to:

1. Open the application.
2. Select a programming course.
3. Open a lesson.
4. Read the instructions.
5. Examine examples.
6. Write code in the integrated editor.
7. Execute the code.
8. View the results.
9. Correct errors.
10. Submit the exercise.
11. Receive automated feedback.
12. Complete the lesson.
13. Continue to the next lesson.

The experience should be continuous and integrated.

The user should not need to open a separate IDE, terminal, database application, or online compiler for ordinary course exercises.

---

# 2. PRODUCT OBJECTIVES

## 2.1 Primary Objectives

The platform must:

1. Reproduce the general three-panel Codecademy learning interface.
2. Support multiple programming languages through interchangeable execution engines.
3. Import structured courses from GitHub repositories.
4. Support uploading complete course packages through ZIP files.
5. Automatically generate course structures from standardized manifests.
6. Provide interactive programming exercises.
7. Evaluate exercise submissions automatically.
8. Track progress across courses.
9. Preserve user work between sessions.
10. Support independent programming practice outside structured courses.

## 2.2 Secondary Objectives

The platform should eventually support:

- Practical programming projects.
- Personal learning paths.
- Course prerequisites.
- Exercise hints.
- Solution explanations.
- Personal notes.
- Bookmarks.
- Learning analytics.
- Course revisions and updates.
- AI-assisted explanations.
- Additional programming languages.

## 2.3 Initial Learning Priorities

The application should initially be designed around these learning objectives:

| Priority | Technology | Learning objective |
|---|---|---|
| 1 | SQL | Database querying, manipulation, joins and reporting |
| 2 | Python | Programming fundamentals, automation and data processing |
| 3 | JavaScript | Programming fundamentals and browser development |
| 4 | TypeScript | Typed JavaScript and application development |
| 5 | Node.js | Backend programming and server-side development |
| 6 | HTML/CSS | Frontend development |
| 7 | Other languages | Future expansion |

These are initial priorities, not permanent restrictions.

The platform must remain language-independent at its core.

---

# 3. CORE PRODUCT PRINCIPLES

The following principles must guide all architectural and development decisions.

## 3.1 Content Independence

Courses must never be hardcoded into the main application.

The application should interpret standardized course files.

Adding a new course should not require modifying React components or application logic.

## 3.2 Modular Execution

Each programming language should have its own execution adapter.

The main playground interface should remain consistent regardless of which language is being used.

## 3.3 Interactive Learning

Lessons should encourage experimentation.

Users should be able to run code repeatedly, examine output, make corrections, and retry exercises.

## 3.4 Persistence

The application should automatically preserve:
- Learning progress.
- Current lesson.
- Exercise completion.
- Saved code.
- Personal notes.
- Course bookmarks.

## 3.5 Extensibility

New courses, languages, exercise types, and learning features should be introduced through modular components.

## 3.6 Simplicity

Prioritize the learning experience over unnecessary application features.

Do not introduce complicated infrastructure or dependencies unless there is a clear technical requirement.

## 3.7 Open-Source First

Prefer free and open-source technologies.

Avoid paid APIs, commercial code execution services, and subscription-dependent functionality unless explicitly approved.

## 3.8 No Premature AI Integration

AI tutoring may eventually be useful, but it is not necessary for the core product.

The first objective is to build a fully functional learning environment without relying on AI services.

---

# 4. REFERENCE INTERFACE AND USER EXPERIENCE

## 4.1 Primary Visual Reference

The user has provided a screenshot of Codecademy's Python learning environment.

This screenshot is the primary visual and functional reference for the lesson interface.

The application should recreate the general layout and interaction model, not necessarily copy Codecademy's branding, logos, proprietary assets, or exact styling.

The intended interface consists of three primary vertical panels.

### Panel A — Lesson Content

Located on the left.

Approximate initial width: 33%.

Contains:
- Lesson title.
- Estimated completion time.
- Educational explanations.
- Instructions.
- Examples.
- Code snippets.
- Images.
- Exercise descriptions.
- Lesson navigation.

The panel should scroll independently.

### Panel B — Code Editor

Located in the centre.

Approximate initial width: 34%.

Contains:
- File tabs.
- Code editor.
- Syntax highlighting.
- Line numbers.
- Code editing controls.
- Run functionality.
- Reset functionality.
- Submit functionality.

The editor should occupy the available vertical space.

### Panel C — Output / Terminal

Located on the right.

Approximate initial width: 33%.

Contains:
- Program output.
- SQL query results.
- Error messages.
- Python tracebacks.
- JavaScript console output.
- Exercise feedback.
- Execution status.

The output panel should scroll independently.

## 4.2 Reference Layout

The intended arrangement:

```text
┌───────────────────────────────────────────────────────────────┐
│                    APPLICATION HEADER                         │
│  Course Title       Progress       Settings       Profile      │
├──────────────────┬──────────────────┬───────────────────────────┤
│                  │                  │                           │
│  LESSON CONTENT  │   CODE EDITOR    │    OUTPUT / TERMINAL      │
│                  │                  │                           │
│  Lesson title    │   script.py      │    Execution results      │
│                  │                  │                           │
│  Explanations    │   1  print(...)  │    Hello World             │
│                  │   2              │                           │
│  Code examples   │   3              │    Errors / Tracebacks     │
│                  │                  │                           │
│  Instructions    │                  │                           │
│                  │                  │                           │
│  Exercise        │                  │                           │
│                  │                  │                           │
│                  │                  │                           │
│                  │                  │                           │
├──────────────────┴──────────────────┴───────────────────────────┤
│                    LESSON CONTROLS                              │
└───────────────────────────────────────────────────────────────┘
```

This is the primary learning interface.

The three panels should be visible simultaneously on standard desktop screens.

## 4.3 Resizable Panels

Users should be able to adjust the width of the three panels.

Requirements:
- Drag handles between panels.
- Minimum panel widths.
- Maximum panel widths.
- Adjustable proportions.
- Restore default layout.
- Persist panel preferences.

The application should not force users to work with fixed-width panels.

## 4.4 Independent Scrolling

Each panel should scroll independently.

For example:
- Scrolling lesson content must not move the editor.
- Scrolling terminal output must not move the lesson.
- Editing code must not interrupt lesson navigation.

This is an important usability requirement.

## 4.5 Responsive Behaviour

Desktop is the primary target.

On tablets:
- Allow panel resizing.
- Allow collapsing the lesson panel.
- Support switching between editor and output views if space is limited.

On mobile:
- Use stacked or tabbed panels.
- Provide access to lesson content, editor, and output.
- Avoid forcing the entire three-panel layout onto a narrow screen.

## 4.6 Header

The learning interface should include a compact header containing:

- Application navigation.
- Current course or lesson title.
- Course progress indicator.
- Lesson progress indicator.
- Settings.
- Optional help access.

An optional AI Learning Assistant button may be introduced later.

It is not required for the MVP.

## 4.7 Lesson Controls

The interface should provide:

- Previous lesson.
- Next lesson.
- Run.
- Submit.
- Reset.
- Save.
- Clear output.

Controls should appear in logical positions without cluttering the interface.

---

# 5. APPLICATION NAVIGATION AND DASHBOARD

## 5.1 Main Navigation

The main application should contain:

1. Dashboard
2. My Courses
3. Practice Playground
4. Projects
5. Progress
6. Settings

## 5.2 Dashboard

The dashboard is the primary landing page.

It should display:

- Welcome message.
- Continue Learning.
- Recently accessed course.
- Active courses.
- Overall progress.
- Recently completed lessons.
- Recommended next lesson.
- Quick access to independent practice.

Avoid excessive statistics or unnecessary gamification.

The dashboard should help the user quickly resume learning.

## 5.3 My Courses

Display all imported courses.

Each course card should contain:

- Course title.
- Programming language.
- Description.
- Difficulty.
- Number of modules.
- Number of lessons.
- Completion percentage.
- Last accessed date.

Users should be able to:

- Open courses.
- Search courses.
- Filter by language.
- Filter by difficulty.
- Refresh course content.
- Remove courses.
- View course details.

Course removal must not automatically destroy saved learning progress.

## 5.4 Progress Dashboard

Provide an overview of:

- Active courses.
- Completed courses.
- Completed modules.
- Completed lessons.
- Exercise success rate.
- Recently practiced languages.

Keep analytics practical and learning-oriented.

Do not introduce competitive leaderboards or streak-based pressure.

---

# 6. COURSE MANAGEMENT SYSTEM

## 6.1 Overview

The Course Management System is responsible for organizing all educational material.

It should operate independently of the visual lesson interface.

The course system must be capable of interpreting standardized course definitions.

## 6.2 Course Hierarchy

The standardized hierarchy should be:

```text
COURSE
│
├── MODULE 1
│   ├── LESSON 1
│   ├── LESSON 2
│   └── LESSON 3
│
├── MODULE 2
│   ├── LESSON 4
│   ├── LESSON 5
│   └── LESSON 6
│
└── MODULE 3
    ├── LESSON 7
    ├── LESSON 8
    └── PROJECT
```

Each course should support:
- Multiple modules.
- Multiple lessons per module.
- Optional exercises.
- Optional projects.
- Optional assessments.
- Optional prerequisites.

## 6.3 Course Metadata

Each course should define:

- Unique course ID.
- Title.
- Description.
- Programming language.
- Difficulty.
- Version.
- Author or source.
- Estimated duration.
- Modules.
- Lessons.
- Prerequisites.
- Supporting resources.

## 6.4 Course Registration

Once imported, a course should automatically appear in My Courses.

The user should not need to manually create lessons or configure navigation.

The application should generate the course interface from the manifest.

---

# 7. COURSE CONTENT ARCHITECTURE

## 7.1 Standardized Course Format

Use JSON for course metadata and Markdown for educational content.

Use separate files for:
- Starter code.
- Test cases.
- Solutions.
- Supporting assets.

Recommended structure:

```text
coding-courses/
│
├── courses/
│
│   ├── sql-fundamentals/
│   │   ├── course.json
│   │   ├── assets/
│   │   ├── module-01/
│   │   │   ├── lesson-01.md
│   │   │   ├── lesson-01.sql
│   │   │   ├── lesson-01-tests.json
│   │   │   └── lesson-02.md
│   │   └── module-02/
│   │
│   ├── python-fundamentals/
│   │   ├── course.json
│   │   ├── module-01/
│   │   └── module-02/
│   │
│   └── javascript-fundamentals/
│       ├── course.json
│       └── module-01/
│
└── README.md
```

## 7.2 Course Manifest Example

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

The final schema should be formally documented and validated.

## 7.3 Lesson Content Format

Markdown should support:

- Headings.
- Paragraphs.
- Lists.
- Code blocks.
- Tables.
- Images.
- Links.
- Callout boxes.
- Exercise instructions.
- Embedded examples.

Example:

```markdown
# Introduction to Variables

Variables allow you to store information.

In Python, you can create a variable like this:

```python
name = "Andel"
print(name)
```

## Your Task

Create a variable called `language`.

Set it equal to `"Python"`.

Print the variable.
```

The lesson renderer should interpret the Markdown and present it inside the left-hand panel.

## 7.4 Content Independence

Adding or modifying educational material must not require modifying the application.

The course format should support future additions without breaking existing courses.

## 7.5 Stable Identifiers

Course, module, and lesson IDs must remain stable when content is updated.

This is necessary to preserve learning progress.

---

# 8. LESSON VIEWER

## 8.1 General Requirements

The lesson viewer is responsible for presenting educational content inside the left-hand panel.

It must support:
- Lesson titles.
- Estimated completion time.
- Explanations.
- Examples.
- Code blocks.
- Images.
- Tables.
- Lists.
- Instructions.
- Exercises.

## 8.2 Lesson Types

Support these lesson types:

1. Reading lesson.
2. Interactive coding lesson.
3. Guided exercise.
4. Multiple-choice lesson.
5. Debugging lesson.
6. Practical project.
7. Review lesson.

## 8.3 Lesson Navigation

Users should be able to:
- Move to previous lessons.
- Move to next lessons.
- Select lessons from the sidebar.
- Return to completed lessons.
- Resume their last position.

## 8.4 Lesson Completion

A lesson can be completed through:
- Successful exercise submission.
- Successful assessment.
- Explicit manual completion for reading-only lessons.

Completion should be saved automatically.

---

# 9. INTERACTIVE CODE EDITOR

## 9.1 Primary Requirements

The editor must closely resemble the centre panel of the provided Codecademy screenshot.

Recommended technology: CodeMirror 6.

Monaco may be considered if its functionality provides a significant advantage.

## 9.2 Required Features

- Syntax highlighting.
- Line numbers.
- Code editing.
- Auto-indentation.
- Basic autocomplete.
- Multiple file tabs.
- Copy and paste.
- Undo and redo.
- Keyboard shortcuts.
- Reset starter code.
- Save current code.
- Run code.
- Submit exercise.

## 9.3 File Management

The editor should support multiple files for future projects.

For initial lessons, a single file is sufficient.

The architecture should eventually support:
- Opening files.
- Creating files.
- Switching tabs.
- Saving changes.
- Resetting individual files.

## 9.4 Starter Code

Exercises may provide starter code.

The application should load this code automatically.

The original starter code must remain available for resetting.

The user's modifications must be preserved independently.

## 9.5 Editor Persistence

Working code should be saved automatically where practical.

The user should be able to leave a lesson and return without losing their work.

---

# 10. CODE EXECUTION AND PROGRAMMING LANGUAGES

## 10.1 Execution Architecture

Each language must use an independent execution adapter.

The user interface should not need to know the internal details of how a programming language executes.

Conceptual structure:

```text
CODE PLAYGROUND
│
├── Editor Interface
│
├── Execution Manager
│   │
│   ├── SQL Adapter
│   ├── Python Adapter
│   ├── JavaScript Adapter
│   ├── TypeScript Adapter
│   └── Future Adapters
│
└── Output Interface
```

## 10.2 Standard Execution Interface

Implement a common execution interface.

Conceptual example:

```typescript
interface ExecutionEngine {
  initialize(): Promise<void>;

  execute(
    code: string,
    options?: object
  ): Promise<{
    success: boolean;
    output: string;
    errors: string[];
    executionTime?: number;
  }>;

  reset(): Promise<void>;

  dispose(): Promise<void>;
}
```

The final implementation may extend this interface for test execution, multiple files, input streams, and language-specific functionality.

## 10.3 SQL Execution

Recommended engine: SQLite WASM or SQL.js.

Required features:

- Execute SQL statements.
- Create temporary databases.
- Create tables.
- Insert sample data.
- Run SELECT queries.
- Run JOIN queries.
- Run aggregate functions.
- Display tabular results.
- Display execution errors.
- Reset database state.
- Support exercise-specific datasets.

The SQL environment should be independent of the application's own storage.

The initial SQL environment should not require a PostgreSQL server.

A PostgreSQL execution environment may be considered later if specific courses require it.

## 10.4 Python Execution

Recommended engine: Pyodide.

Required features:

- Execute Python directly in the browser.
- Display print output.
- Display errors and tracebacks.
- Support variables.
- Support functions.
- Support loops.
- Support classes.
- Support standard library functionality.
- Support repeated execution.
- Support resetting the environment.
- Support exercise validation.

Where practical, use Web Workers to prevent long-running execution from freezing the main interface.

The system must be able to terminate runaway execution.

Document Pyodide compatibility limitations for packages that require native operating-system dependencies.

## 10.5 JavaScript Execution

Use a restricted browser execution context.

Required features:

- Execute JavaScript.
- Capture console output.
- Capture errors.
- Reset execution context.
- Support repeated execution.
- Support automatic exercise testing.

Do not execute arbitrary submitted JavaScript directly in the main application's privileged context.

## 10.6 TypeScript Execution

Use the TypeScript compiler to transform TypeScript into JavaScript.

Execute compiled code in the same restricted environment as JavaScript.

## 10.7 Future Node.js Support

Node.js requires additional infrastructure because it involves server-side runtime capabilities.

Do not attempt to simulate a complete Node.js environment using ordinary browser JavaScript.

When introduced, Node.js should use an isolated server-side execution environment.

This must be a separate development phase.

---

# 11. OUTPUT AND TERMINAL PANEL

## 11.1 Overview

The right-hand panel should reproduce the functionality of the output area shown in the Codecademy reference.

It should remain visible beside the editor.

## 11.2 Required Output Types

- Standard output.
- SQL results.
- Error messages.
- Tracebacks.
- Console logs.
- Warnings.
- Exercise evaluation results.

## 11.3 Output Formatting

The output panel should support:
- Monospaced text.
- Syntax-aware error formatting where practical.
- Scrollable output.
- Clear output.
- Execution status.
- Execution time.
- Success/failure indicators.

## 11.4 Error Handling

Errors should be displayed in an understandable manner.

Examples:

Python:

```text
NameError:
name 'test' is not defined
```

SQL:

```text
Error:
no such table: employees
```

The original technical error should remain accessible.

The platform should not replace useful technical information with vague messages.

## 11.5 Execution Controls

The user should be able to:
- Run code.
- Stop execution where supported.
- Clear output.
- Reset execution state.
- Submit an exercise.

---

# 12. EXERCISE AND ASSESSMENT SYSTEM

## 12.1 Exercise Types

Support:

1. Write code from instructions.
2. Complete missing code.
3. Fix broken code.
4. Predict program output.
5. Multiple-choice questions.
6. SQL query challenges.
7. Debugging exercises.
8. Practical programming tasks.

## 12.2 Evaluation

Exercises should support predefined tests.

Example:

```python
def add(a, b):
    return a + b
```

Possible tests:

```python
assert add(2, 3) == 5
assert add(10, 20) == 30
assert add(-1, 1) == 0
```

The application should display:
- Passed tests.
- Failed tests.
- Expected output where appropriate.
- Actual output.
- Relevant error messages.

## 12.3 Run Versus Submit

These must be separate operations.

**Run:**
- Executes the user's code.
- Displays results.
- Does not automatically mark the exercise complete.

**Submit:**
- Executes the code.
- Runs evaluation tests.
- Determines whether the exercise requirements are satisfied.
- Updates progress when successful.

## 12.4 Hints

Exercises may contain progressive hints.

For example:
- Hint 1: General direction.
- Hint 2: Relevant concept.
- Hint 3: More detailed guidance.

Hints should not automatically reveal the solution.

## 12.5 Solutions

Official solutions should be accessible when appropriate.

The system should distinguish between:
- User code.
- Starter code.
- Official solutions.

---

# 13. LEARNING PROGRESS AND PERSISTENCE

## 13.1 Progress Tracking

Track:

- Imported courses.
- Active courses.
- Completed courses.
- Completed modules.
- Completed lessons.
- Exercise attempts.
- Successful submissions.
- Last accessed lesson.
- Last activity date.

## 13.2 Automatic Saving

The platform should automatically save:
- Current lesson.
- Lesson completion.
- Working code.
- Exercise results.
- Notes.
- Bookmarks.

Saving should not require the user to manually click a Save button after every action.

## 13.3 Continue Learning

The dashboard should provide a Continue Learning shortcut.

It should return the user to:
- Their last active course.
- Their last accessed lesson.
- Their saved working code.

## 13.4 Personal Notes

Users should be able to save notes against individual lessons.

Notes should be editable and persistent.

## 13.5 Storage

Use IndexedDB initially.

Create an abstraction layer so a database can be introduced later.

Potential future database:
- PostgreSQL.
- Neon.
- Supabase.

## 13.6 Data Export

Eventually provide a way to export:
- Learning progress.
- Notes.
- Saved code.
- Bookmarks.
- Course completion records.

This prevents unnecessary dependence on a single browser or storage implementation.

---

# 14. COURSE IMPORT AND GITHUB INTEGRATION

## 14.1 Supported Import Methods

The platform must support two initial methods.

**Method A: GitHub repository**

**Method B: ZIP upload**

Both should use the same internal course validation and registration system.

## 14.2 GitHub Import

The user provides a GitHub repository URL.

The application should:

1. Validate the URL.
2. Retrieve the repository contents.
3. Locate course manifests.
4. Parse course metadata.
5. Validate referenced files.
6. Generate an import preview.
7. Register the course.
8. Make it available in My Courses.

Initially, public repositories should be supported.

Private repositories may be added later using secure authorization and minimum required permissions.

The importer must never automatically execute scripts from imported repositories.

## 14.3 ZIP Import

The user uploads a ZIP containing a standardized course package.

The application should:

1. Accept the archive.
2. Validate file type and size.
3. Extract it safely.
4. Locate the manifest.
5. Validate the course structure.
6. Identify missing files.
7. Generate an import preview.
8. Register the course.

## 14.4 Import Validation

The system must identify:

- Missing manifests.
- Invalid JSON.
- Unsupported course versions.
- Missing lesson files.
- Missing exercise files.
- Invalid file references.
- Unsupported programming languages.

Provide useful error messages.

## 14.5 Course Updates

The application should eventually support refreshing existing GitHub courses.

Requirements:
- Detect new versions.
- Identify modified lessons.
- Identify added lessons.
- Preserve stable lesson IDs.
- Preserve user progress.
- Avoid overwriting user code.
- Display an update summary.

---

# 15. INDEPENDENT PRACTICE ENVIRONMENT

## 15.1 Overview

The platform must offer a Practice Playground separate from structured courses.

This allows users to experiment without following lesson instructions.

## 15.2 Requirements

The user should be able to:

- Select a programming language.
- Open a blank editor.
- Write code.
- Execute code.
- View results.
- Reset the environment.
- Save work.
- Reopen previous practice sessions.

## 15.3 Initial Languages

- SQL.
- Python.
- JavaScript.

Additional languages should become available when their execution adapters are implemented.

## 15.4 SQL Practice

Allow users to create their own temporary tables and datasets.

Provide a way to reset the database.

## 15.5 Python Practice

Provide a blank Python environment with the same execution engine used by structured lessons.

---

# 16. PROJECT-BASED LEARNING

## 16.1 Overview

The platform should eventually support larger assignments that combine concepts from multiple lessons.

Examples:

- Build a Python file organizer.
- Create a SQL reporting system.
- Develop a JavaScript calculator.
- Build a small database application.

## 16.2 Project Structure

Projects may contain:

- Project description.
- Learning objectives.
- Requirements.
- Multiple files.
- Starter code.
- Optional milestones.
- Evaluation tests.
- Official solution.

## 16.3 Project Progress

Track:
- Project status.
- Completed milestones.
- Saved files.
- Submission results.

This is a future expansion, not a prerequisite for the first MVP.

---

# 17. SECURITY ARCHITECTURE

Security must be designed into the application from the beginning.

The application executes user-written code and imports external course material.

These are separate security concerns.

## 17.1 Execution Isolation

The main application must never directly execute arbitrary submitted code on its server.

Browser-based execution should be preferred for the initial release.

For future server-side execution:
- Use isolated environments.
- Restrict filesystem access.
- Restrict network access.
- Apply CPU limits.
- Apply memory limits.
- Apply execution timeouts.
- Restrict process creation.
- Prevent access to application secrets.
- Prevent access to Docker sockets.
- Avoid privileged containers.

Docker containers alone must not be assumed to provide sufficient isolation for arbitrary untrusted code.

Evaluate gVisor or Firecracker before introducing multi-user server-side execution.

## 17.2 Browser Security

Requirements:
- Restrict JavaScript execution contexts.
- Avoid exposing application credentials.
- Use sandboxed iframes where appropriate.
- Use Web Workers for supported execution workloads.
- Implement execution timeouts.
- Terminate runaway workers.
- Avoid exposing privileged application objects.
- Use appropriate Content Security Policy rules.

WebAssembly should not be treated as a complete security solution by itself.

## 17.3 Resource Restrictions

For server-side execution, configure:
- Maximum memory.
- CPU limits.
- Maximum execution time.
- Maximum process count.
- Temporary storage limits.
- Concurrent execution limits.

The limits should be configurable by execution profile.

## 17.4 Network Restrictions

Server-side execution should have no unrestricted access to:
- The application database.
- Internal VPS services.
- Host networking.
- Private network resources.
- Application secrets.

External network access should be blocked by default.

## 17.5 Course Import Security

Imported content must be treated as untrusted.

Requirements:
- Validate file paths.
- Prevent ZIP path traversal.
- Sanitize Markdown.
- Prevent unsafe HTML execution.
- Limit archive sizes.
- Limit extracted file counts.
- Reject unsupported file types.
- Never automatically execute installation scripts.
- Never automatically execute imported commands.

## 17.6 Credential Security

GitHub tokens and other credentials must never be placed inside:
- Frontend source code.
- Public course repositories.
- Imported course files.
- Client-accessible configuration.

Use minimum required permissions.

---

# 18. TECHNICAL ARCHITECTURE AND TECHNOLOGY STACK

## 18.1 Recommended Stack

| Component | Technology | Purpose |
|---|---|---|
| Frontend | React | Application interface |
| Programming language | TypeScript | Application logic |
| Styling | Tailwind CSS | Interface styling |
| Code editor | CodeMirror 6 | Embedded editor |
| Lesson renderer | React Markdown | Lesson content |
| SQL | SQL.js / SQLite WASM | SQL execution |
| Python | Pyodide | Python execution |
| JavaScript | Browser runtime | JavaScript execution |
| TypeScript | TypeScript compiler | TypeScript execution |
| Storage | IndexedDB | Local persistence |
| Course format | JSON + Markdown | Course structure |
| Course repository | GitHub | Educational content |
| Archive import | ZIP parsing library | Course uploads |
| Hosting | Vercel / Hostinger | Deployment |

The architecture agent should validate the current versions and compatibility of dependencies before implementation.

## 18.2 Proposed Application Structure

```text
coding-academy/
│
├── src/
│   │
│   ├── app/
│   │   ├── routing/
│   │   └── providers/
│   │
│   ├── components/
│   │   ├── layout/
│   │   ├── dashboard/
│   │   ├── courses/
│   │   ├── lessons/
│   │   ├── editor/
│   │   ├── terminal/
│   │   └── progress/
│   │
│   ├── features/
│   │   ├── course-management/
│   │   ├── course-import/
│   │   ├── lesson-viewer/
│   │   ├── exercise-evaluation/
│   │   ├── learning-progress/
│   │   └── practice-playground/
│   │
│   ├── execution/
│   │   ├── interfaces/
│   │   ├── manager/
│   │   └── adapters/
│   │       ├── sql/
│   │       ├── python/
│   │       ├── javascript/
│   │       └── typescript/
│   │
│   ├── course-system/
│   │   ├── parser/
│   │   ├── validator/
│   │   ├── registry/
│   │   └── schema/
│   │
│   ├── storage/
│   │   ├── indexeddb/
│   │   └── repositories/
│   │
│   ├── hooks/
│   ├── types/
│   ├── utils/
│   └── styles/
│
├── public/
│
├── docs/
│
├── tests/
│
├── README.md
└── package.json
```

This is a proposed structure, not a mandatory file-by-file implementation.

The architecture agent may adjust it if the actual implementation benefits from a different arrangement.

## 18.3 Architectural Requirements

- Separate UI components from business logic.
- Separate execution engines from the editor.
- Separate course content from application source code.
- Separate course parsing from course rendering.
- Separate exercise evaluation from code execution.
- Separate persistence logic from UI components.
- Use shared TypeScript interfaces.
- Avoid circular dependencies.
- Avoid unnecessary global state.
- Use reusable components.

---

# 19. USER INTERFACE AND DESIGN SYSTEM

## 19.1 General Style

The application should have a modern, professional developer-tool aesthetic.

The Codecademy screenshot is the main functional and layout reference.

However, the application should have its own visual identity.

## 19.2 Design Priorities

- Clear typography.
- Readable lesson content.
- Comfortable code editor.
- High-contrast output panel.
- Minimal unnecessary decoration.
- Consistent spacing.
- Accessible controls.
- Responsive design.

## 19.3 Theme Support

Support:
- Dark theme.
- Light theme.

The editor and terminal should have independently configurable themes if practical.

## 19.4 User Preferences

Persist:
- Theme.
- Panel widths.
- Preferred editor font size.
- Preferred editor font.
- Editor layout.
- Default programming language for practice.

---

# 20. PERFORMANCE AND RELIABILITY

## 20.1 General Performance

The application should load quickly and remain responsive.

Requirements:
- Lazy-load execution engines.
- Avoid loading Pyodide until required.
- Avoid loading unnecessary course content.
- Cache reusable course assets.
- Minimize unnecessary re-renders.
- Keep execution off the main UI thread where practical.

## 20.2 Execution Performance

The interface should remain responsive while code executes.

Long-running code must be interruptible where the execution environment supports termination.

## 20.3 Error Recovery

The application should gracefully handle:
- Execution failures.
- Course import failures.
- Missing assets.
- Invalid manifests.
- Storage errors.
- Browser refreshes.
- Interrupted sessions.

User progress should not be lost because an individual exercise fails.

---

# 21. DEPLOYMENT AND INFRASTRUCTURE

## 21.1 Hosting

The platform should support deployment to:

- Vercel.
- Existing Hostinger VPS infrastructure.

Prefer the simplest reliable deployment option.

Do not introduce unnecessary hosting dependencies.

## 21.2 Self-Hosting

Maintain compatibility with eventual VPS deployment.

Requirements:
- Configurable environment variables.
- No hardcoded hosting provider dependencies.
- Documented installation process.
- Documented deployment process.
- Documented backup process.
- No mandatory paid services.

## 21.3 Initial Infrastructure

The MVP should not require:
- Kubernetes.
- Multiple servers.
- Dedicated code execution servers.
- Paid database services.
- Commercial code execution APIs.

Browser-based execution should handle the initial supported languages.

## 21.4 Backups

Maintain:
- Application source code in GitHub.
- Course content in GitHub.
- Exportable user progress.
- Recoverable saved code and notes.

---

# 22. TESTING AND QUALITY ASSURANCE

## 22.1 Unit Testing

Test:
- Course manifest parsing.
- Course validation.
- Lesson navigation.
- Exercise evaluation.
- Execution adapters.
- Progress calculations.
- Data persistence.

## 22.2 Integration Testing

Test:
- Course importing.
- Lesson rendering.
- Code execution.
- Exercise submission.
- Progress saving.
- Code restoration.
- Course updates.

## 22.3 Security Testing

Test:
- Malicious Markdown.
- Invalid ZIP files.
- Path traversal.
- Infinite loops.
- Excessive memory consumption.
- Attempts to access restricted browser resources.
- Unauthorized access to application data.

## 22.4 User Acceptance Testing

Use realistic learning scenarios.

Example:

1. Import a Python course.
2. Open the first lesson.
3. Read the instructions.
4. Modify the starter code.
5. Execute the program.
6. View the output.
7. Submit the exercise.
8. Receive feedback.
9. Complete the lesson.
10. Close the application.
11. Reopen the application.
12. Verify that progress and code remain saved.

Repeat with SQL.

## 22.5 Visual Testing

The three-panel learning interface must be compared against the supplied Codecademy screenshot.

Verify:
- Panel proportions.
- Independent scrolling.
- Editor positioning.
- Terminal positioning.
- Lesson readability.
- Responsive behaviour.
- Panel resizing.

The reference image should remain available as a project design reference.

---

# 23. MVP SCOPE AND PRIORITIES

The MVP should deliver a working learning platform, not a fully featured commercial education system.

## 23.1 Mandatory MVP Features

| Feature | Priority |
|---|---|
| Dashboard | P0 |
| Course library | P0 |
| Three-panel lesson interface | P0 |
| Resizable panels | P0 |
| Independent scrolling | P0 |
| Markdown lesson renderer | P0 |
| Course manifest parser | P0 |
| Course navigation | P0 |
| CodeMirror integration | P0 |
| SQL execution | P0 |
| Python execution | P0 |
| Output/terminal panel | P0 |
| Run functionality | P0 |
| Exercise submission | P0 |
| Basic automated evaluation | P0 |
| Progress persistence | P0 |
| Saved working code | P0 |
| GitHub public course import | P0 |
| ZIP course import | P0 |
| JavaScript execution | P1 |
| Personal notes | P1 |
| Independent playground | P1 |
| Dark/light themes | P1 |

P0 features are required for the initial functional release.

P1 features should be implemented after the core learning experience works.

## 23.2 Explicitly Excluded from MVP

Do not implement:

- Multi-user accounts.
- Public registration.
- Subscription payments.
- Social features.
- Leaderboards.
- AI tutors.
- AI-generated courses.
- Public course publishing.
- Cloud synchronization.
- Advanced analytics.
- Full Node.js execution.
- Complex container orchestration.

These should remain future possibilities.

---

# 24. DEVELOPMENT ROADMAP

Development must follow controlled phases.

Each phase must have:
- Defined objectives.
- Defined deliverables.
- Dependencies.
- Acceptance criteria.
- Tests.

## PHASE 0 — REPOSITORY AUDIT AND TECHNICAL PLANNING

Before writing application code:

1. Inspect the existing repository.
2. Identify existing code.
3. Identify existing documentation.
4. Identify existing dependencies.
5. Identify any existing prototypes.
6. Determine whether reusable components already exist.
7. Identify technical risks.
8. Compare the current repository against this PRD.

Deliverables:
- Repository audit report.
- Existing functionality inventory.
- Architecture proposal.
- Updated implementation roadmap.
- Task breakdown.
- Dependency analysis.

Do not blindly create a new project if an existing repository already contains useful work.

Do not overwrite existing work without approval.

## PHASE 1 — APPLICATION FOUNDATION

Build:
- Application shell.
- Main navigation.
- Dashboard.
- Course library.
- Settings.
- Responsive layout.

Acceptance criteria:
- Application runs.
- Navigation works.
- Main layouts render correctly.
- No major runtime errors.

## PHASE 2 — THREE-PANEL LEARNING INTERFACE

This phase is particularly important.

Build the Codecademy-inspired learning interface.

Implement:
- Left lesson panel.
- Centre code editor panel.
- Right output panel.
- Resizable panels.
- Independent scrolling.
- Header.
- Lesson controls.
- Responsive layouts.

Initially, use placeholder lesson content and simulated output if necessary.

Do not delay the visual foundation until every execution engine is ready.

Acceptance criteria:
- Three panels display simultaneously.
- Each panel scrolls independently.
- Panel widths can be adjusted.
- Editor and output remain properly aligned.
- Layout matches the reference design's interaction model.

## PHASE 3 — COURSE SYSTEM

Implement:
- Course schema.
- Manifest parser.
- Course registry.
- Module navigation.
- Lesson loading.
- Markdown renderer.
- Sample courses.

Acceptance criteria:
- Courses load from structured files.
- Modules and lessons appear automatically.
- Invalid manifests produce useful errors.
- Adding lessons does not require modifying application code.

## PHASE 4 — SQL PLAYGROUND

Implement:
- CodeMirror.
- SQL execution engine.
- SQL result tables.
- Output panel.
- Error handling.
- Exercise evaluation.
- Database reset.

Acceptance criteria:
- SQL queries execute.
- Results display correctly.
- Errors display clearly.
- Exercises can be evaluated.
- Database resets correctly.

## PHASE 5 — PYTHON PLAYGROUND

Implement:
- Pyodide.
- Python adapter.
- Standard output capture.
- Error capture.
- Execution termination.
- Reset functionality.
- Python exercises.

Acceptance criteria:
- Python executes in the browser.
- Output appears in the terminal panel.
- Errors are displayed.
- Runaway execution can be stopped.
- Main interface remains responsive.

## PHASE 6 — LEARNING PROGRESS

Implement:
- Lesson completion.
- Exercise attempts.
- Saved code.
- Continue Learning.
- Progress dashboard.
- Notes.
- Bookmarks.

Acceptance criteria:
- Progress persists after refresh.
- Saved code can be restored.
- Lesson completion is accurate.
- No unnecessary data loss.

## PHASE 7 — COURSE IMPORT

Implement:
- GitHub public repository import.
- ZIP upload.
- Manifest validation.
- Import preview.
- Course registration.
- Course updates.

Acceptance criteria:
- A valid course can be imported without application code changes.
- Invalid imports are rejected safely.
- Existing progress is preserved during compatible updates.

## PHASE 8 — JAVASCRIPT AND INDEPENDENT PRACTICE

Implement:
- JavaScript adapter.
- Practice Playground.
- Blank editor sessions.
- Saved practice sessions.

Acceptance criteria:
- Independent JavaScript execution works.
- Users can practice without opening a course.
- Saved sessions can be restored.

## PHASE 9 — STABILIZATION AND DEPLOYMENT

Implement:
- Production deployment.
- Security review.
- Performance review.
- Backup procedures.
- Documentation.
- User acceptance testing.

Acceptance criteria:
- Application is reliably deployable.
- Core functionality works.
- Security requirements are reviewed.
- Documentation is complete.

---

# 25. GITHUB AND CLAUDE CODE DEVELOPMENT WORKFLOW

## 25.1 Development Philosophy

Use a controlled, incremental development process.

Do not attempt to implement the entire PRD in one enormous coding session.

The coding agent should work through the development phases and verify each phase before continuing.

## 25.2 Repository Structure

Recommended separate repositories:

**Repository 1: coding-academy**

Contains:
- Application source code.
- Execution adapters.
- Course management.
- UI components.
- Documentation.
- Tests.

**Repository 2: coding-courses**

Contains:
- Course manifests.
- Lessons.
- Exercises.
- Tests.
- Solutions.
- Educational assets.

The application must not require the course repository to be bundled into its source code.

## 25.3 Git Workflow

Use:
- Main branch for stable code.
- Feature branches for new functionality.
- Logical commits.
- Pull requests for significant features.
- Tests before merging.

Never overwrite stable functionality without understanding the consequences.

## 25.4 Task Management

Use a structured task-management system such as Taskmaster.

Every task should contain:

- Unique task ID.
- Description.
- Priority.
- Dependencies.
- Acceptance criteria.
- Implementation details.
- Testing requirements.
- Completion status.

Tasks should be small enough to implement and verify independently.

## 25.5 AI Agent Instructions

The primary coding agent must:

1. Read the complete PRD before implementation.
2. Audit the existing repository.
3. Identify reusable work.
4. Propose an architecture.
5. Break development into manageable phases.
6. Identify technical risks.
7. Establish a testing strategy.
8. Avoid implementing future features prematurely.
9. Keep documentation updated.
10. Report blockers and decisions requiring user approval.

## 25.6 Architecture Decisions

The coding agent must not independently introduce major architectural changes without documenting them.

Examples:
- Replacing the editor technology.
- Changing the course manifest structure.
- Introducing a paid service.
- Moving execution from browser to server.
- Introducing a mandatory database.
- Changing the hosting architecture.

These decisions require explicit justification and user approval.

---

# 26. DOCUMENTATION REQUIREMENTS

Maintain the following documents:

| Document | Purpose |
|---|---|
| PRD.md | Master product requirements |
| ARCHITECTURE.md | Application architecture |
| COURSE-FORMAT.md | Course manifest and file format |
| SECURITY.md | Security architecture and controls |
| DEVELOPMENT.md | Development setup and workflow |
| TASKS.md | Implementation backlog |
| README.md | Project overview and setup |
| CHANGELOG.md | Changes between versions |
| DECISIONS.md | Important architectural decisions |

Documentation must reflect the actual implementation.

Do not document features as completed before they have been implemented and tested.

---

# 27. ACCEPTANCE CRITERIA

The initial product is considered successfully delivered when all mandatory requirements below are satisfied.

## Interface

- [ ] Three-panel Codecademy-inspired interface.
- [ ] Independent lesson, editor, and output panels.
- [ ] Adjustable panel widths.
- [ ] Responsive desktop layout.
- [ ] Functional lesson navigation.

## Courses

- [ ] Course manifest system.
- [ ] Module navigation.
- [ ] Lesson loading.
- [ ] Markdown rendering.
- [ ] Course validation.
- [ ] Sample SQL course.
- [ ] Sample Python course.

## Execution

- [ ] SQL execution.
- [ ] Python execution.
- [ ] Output display.
- [ ] Error display.
- [ ] Reset functionality.
- [ ] Execution termination where supported.
- [ ] Automated exercise evaluation.

## Persistence

- [ ] Lesson progress saved.
- [ ] Exercise results saved.
- [ ] Working code saved.
- [ ] Continue Learning works.
- [ ] Data survives browser refresh.

## Import

- [ ] GitHub course import.
- [ ] ZIP course import.
- [ ] Course validation.
- [ ] Course registration.
- [ ] Adding courses does not require modifying application code.

## Security

- [ ] Submitted code is not executed directly by the application server.
- [ ] Browser execution is appropriately isolated.
- [ ] Execution timeouts are implemented.
- [ ] Imported content is validated.
- [ ] ZIP extraction is protected against path traversal.
- [ ] Secrets are not exposed to execution environments.

## Deployment

- [ ] Application builds successfully.
- [ ] Application deploys successfully.
- [ ] Documentation is complete.
- [ ] Backup and recovery procedures are documented.

---

# 28. FUTURE EXPANSION

These features should be considered only after the core platform is stable.

## 28.1 Additional Programming Languages

Potential additions:
- TypeScript.
- Node.js.
- HTML/CSS.
- Bash.
- C/C++.
- Java.
- Additional database engines.

Each language should use an appropriate execution adapter.

## 28.2 AI Learning Assistant

Potential capabilities:
- Explain programming concepts.
- Explain error messages.
- Provide progressive hints.
- Review code.
- Recommend additional exercises.
- Generate revision questions.

AI should be optional.

The platform must remain functional without AI services.

## 28.3 Course Authoring

A graphical course editor could eventually allow the user to create:
- Courses.
- Modules.
- Lessons.
- Exercises.
- Tests.
- Solutions.
- Projects.

## 28.4 Advanced Execution Environments

Potential capabilities:
- Multi-file projects.
- Package installation.
- Terminal access.
- Node.js server execution.
- Isolated Docker environments.
- Stronger sandboxing using gVisor or Firecracker.

These require additional security and infrastructure planning.

## 28.5 Learning Paths

Allow courses to be organized into larger learning paths.

Example:

**Software Development Learning Path**

1. SQL Fundamentals.
2. Database Design.
3. Python Fundamentals.
4. JavaScript.
5. TypeScript.
6. Node.js.
7. API Development.
8. Application Development.

## 28.6 Cloud Synchronization

Potential future features:
- User accounts.
- Multi-device synchronization.
- Remote progress storage.
- Cloud backups.

These are not necessary for the personal MVP.

---

# 29. FINAL PRODUCT DEFINITION

The finished product should function as a personal, modular coding academy.

It should provide a learning experience closely resembling Codecademy's three-panel interface while allowing the user to control the courses, curriculum, programming environments, and educational content.

The application must have a stable core that can grow independently through additional courses and execution engines.

The most important architectural distinction is:

**The application is the learning platform. The course repository is the educational content. The execution engines are the programming environments.**

These three systems must remain modular.

The application should allow the user to:

- Import an entirely new programming course.
- Automatically load its lessons and exercises.
- Read instructions in the left panel.
- Write code in the centre panel.
- Execute code and view results in the right panel.
- Submit exercises and receive feedback.
- Save progress and continue later.
- Practice independently.
- Expand into additional programming languages.

The application should not need to be rewritten whenever a new course is added.

## PRIMARY SUCCESS METRIC

A user can import a properly structured programming course from GitHub or a ZIP file, open it in the application, and work through its lessons using an integrated, functional coding environment without modifying the application's source code.

## FINAL DEVELOPMENT PRIORITY

Build the Codecademy-style three-panel learning experience first, establish the modular course system second, and integrate the programming execution engines and course-import capabilities in controlled phases.

The objective is not to build every possible feature immediately.

The objective is to build a reliable foundation that can support years of programming education and continued development.

---

**END OF MASTER PRODUCT REQUIREMENTS DOCUMENT — VERSION 2.0**
---

## Decision log
- 2026-11-15: PRD adopted for build (master-harness bootstrap) - phases follow section 24 roadmap.
- 2026-11-15: Hosting (Vercel vs owner's VPS) deferred to phase 9 by the owner - until then merging to main deploys nothing.
- 2026-11-15: Single-repo layout for now: app at repo root (Vite), sample courses as static files under `public/courses/` loaded via the same manifest loader an imported course uses - keeps 3.1 content independence; a separate `coding-courses` repo (25.2) is a human step when ready.
- 2026-11-15: Owner approved adding `@codemirror/theme-one-dark` (CodeMirror 6 stays the editor): a shared theme hook so the editor's dark mode follows the app theme live instead of only on mount. Replaces the editor's hand-rolled dark styling; from the parking lot.
