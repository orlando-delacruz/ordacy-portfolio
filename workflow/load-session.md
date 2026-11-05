# Load Session Workflow

Run by `/load`. Goal: restore the previous session's context AND verify it against the real project. Read-only: do not edit files (including `SESSION.md`) and do not start implementing unless the user's message explicitly asks.

## Steps
1. **Read `workflow/SESSION.md` first.** If missing, say no previous context was found and continue with a normal investigation.
2. **Instructions**: read `CLAUDE.md`, `AGENTS.md`, applicable `.claude/` project instructions, and only docs relevant to the saved task. Follow instruction precedence (e.g. AGENTS.md over CLAUDE.md if they conflict and the project says so).
3. **Investigate progressively** (don't read the whole repo; don't re-read files):
   - root structure, real stack and config (`package.json` etc.)
   - files/components named in the saved context
   - dependencies of those files as findings require
   - `git status --short`, staged/unstaged diffs, untracked files, `git log` recent history (compare against saved Git state; find changes since the save date)
   - confirm that claimed implementations exist; check whether pending tasks are still relevant
4. **Reconcile** each important saved claim as: **Confirmed**, **Outdated**, **Unverified**, or **New** (changes found since the save). Source code and current Git state win over SESSION.md.
5. **Report** (concise):
```
# Session Restored
## Previous Objective
## Verified Project State
## Changes Since Previous Save
## Completed Work
## Pending Tasks
## Issues and Risks
## Recommended Next Step
```
Include the execution profile line only if the project's instructions require it. Suggest running `/save` afterwards if SESSION.md is outdated.
