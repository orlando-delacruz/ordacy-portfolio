# Save Session Workflow

Run by `/save`. Goal: update `workflow/SESSION.md` so a fresh session can continue accurately.

## Rules (hard)
- The ONLY file you may write is `workflow/SESSION.md`.
- Never commit, stage, unstage, reset, stash, checkout, or resolve conflicts. Git use is read-only.
- Never modify source code. Never include secrets, keys, tokens, passwords.
- Don't paste whole source files or noisy terminal output. Don't invent or claim unverified work.

## Steps
1. **Read existing** `workflow/SESSION.md` (if present) to merge, not overwrite.
2. **Conversation context**: from this session capture objective, requirements/constraints, decisions + reasoning, agreed approach, completed work (with evidence), current status, pending tasks, bugs/blockers, technical findings, relevant files/components, commands run + results, verification done, next steps.
3. **Git** (skip with a note if not a repo): run `git status --short`, `git diff --stat`, `git diff`, `git diff --cached --stat`, `git diff --cached`, and list untracked files (read only the relevant ones, briefly). Record staged / unstaged / untracked, key implementation details, and incomplete or risky changes. Also consider relevant ignored/untracked files that are safe to read.
4. **Merge** into the template below:
   - Keep still-relevant confirmed decisions, unresolved issues, and warnings.
   - Update outdated implementation details; prefer the latest verified state.
   - Remove tasks only if confirmed done or irrelevant. Dedupe; keep the file concise.
5. **Write** `workflow/SESSION.md` with `Last Updated` as a real date/time with timezone offset (run `Get-Date -Format o` or `date -Iseconds`).
6. **Report** briefly: what was saved, Git state summary, and anything uncertain.

## SESSION.md template
```
# Session Context
## Last Updated
## Project Overview
## Current Objective
## Requirements and Constraints
## Decisions Made
## Completed Work
## Current Implementation State
## Git Changes
## Important Files
## Issues and Blockers
## Testing and Verification
## Pending Tasks
## Next Recommended Steps
## Important Warnings
```
