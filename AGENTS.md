# React Showcase Developer Guidelines

Modern React showcase app with CSS + Bootstrap, built with Bun and Vite.

This project uses Bun (not npm/pnpm/yarn).

## Commands

```sh
bun start                    # dev server at http://localhost:5173/ (use -- --no-open in headless/agent environments)
bun run test <ComponentName> # run a single test file (e.g. bun run test TodoList)
bun run i18n:extract         # extract i18n translation keys
```

Verification, build, lint, and coverage commands are defined in `docs/agents/verification.md`.

## Pointers

- Coding style and component conventions: `docs/agents/coding-style.md`
- When filing or triaging an issue, read `docs/agents/issue-tracker.md`
- When opening a pull request, read `docs/agents/pull-request.md`
- Before running or reporting verification, read `docs/agents/verification.md`
- Gold-standard component test: `src/components/TodoList.test.tsx`
- MSW mock handlers: `src/mocks/handlers.ts`
- i18n locale files: `src/locales/`
- CI workflow: `.github/workflows/build.yml`

## Prevent Recurrence

- **Candidate**: Name who hits this again, in which file, on what change. No such scenario, nothing to propose.
- **Promote**: Offer the first tier that reaches them and only that one, pending confirmation — enforce it (assert/type/test) with its size quoted, else a comment at that site, else an agent-facing doc (`docs/agents/<topic>.md`, else `docs/agents/lessons-learned.md`) with one backtick-path line under Pointers and one sentence on why the tiers above cannot hold it.
- **Prune**: When adding to a file, audit the rest of it in the same pass. Drop entries once stale (obsolete version, now enforced, duplicated, or a transcript) — not by a fixed count.
