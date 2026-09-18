# React Boilerplate Developer Guidelines

React TypeScript boilerplate with CSS + Bootstrap, built with Bun and Vite.

This project uses Bun (not npm/pnpm/yarn).

## Commands

```sh
bun install                  # install dependencies
bun start                    # dev server at http://localhost:5173/
bun run build                # typecheck (tsc) + production build
bun run lint                 # ESLint
bun run test                 # Vitest (watch mode)
bun run test:coverage        # Vitest with coverage
bun run test ComponentName   # run a single test file
bun run i18n:extract         # extract i18n messages
```

## Pointers

- Coding style and component conventions: `docs/agents/coding-style.md`
- CI workflow: `.github/workflows/build.yml`
- Vite + Vitest config: `vite.config.ts`
- ESLint config: `eslint.config.js`
- TypeScript config: `tsconfig.json`
- i18n locale files: `src/i18n/locales/`
- MSW mock handlers: `src/mocks/handlers.ts`
- Gold-standard component test: `src/components/Counter.test.tsx`

## Editing Guidelines

- Prefer editing existing files over creating new ones
- Delete unused code completely (no commented-out leftovers)
- Only add comments where logic is not self-evident
- Commit messages: concise, English, focus on "why" over "what"
- Don't add dependencies without justification; check `package.json` first

## Claude Code Compatibility

`CLAUDE.md` is a symbolic link pointing to `AGENTS.md`. Edit `AGENTS.md` directly.

## Prevent Recurrence

- **Candidate**: Name who hits this again, in which file, on what change. No such scenario, nothing to propose.
- **Promote**: Offer the first tier that reaches them and only that one, pending confirmation — enforce it (assert/type/test) with its size quoted, else a comment at that site, else an agent-facing doc (`docs/agents/<topic>.md`, else `docs/agents/lessons-learned.md`) with one backtick-path line under Pointers and one sentence on why the tiers above cannot hold it.
- **Prune**: When adding to a file, audit the rest of it in the same pass. Drop entries once stale (obsolete version, now enforced, duplicated, or a transcript) — not by a fixed count.
