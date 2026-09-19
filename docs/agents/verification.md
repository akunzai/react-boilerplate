# Verification

How an agent exercises a change in this repo before it reaches review.
Human setup narrative lives in `README.md`; this file holds only what an
agent needs.

## Starting the environment

This is a front-end showcase application with no server stack to start.
The gate command runs without a listening process:

```sh
bun run build && bun run lint && bun run test:coverage
```

<!-- drift:forge github -->
<!-- drift:entrypoint-cmd bun run build && bun run lint && bun run test:coverage -->

It never prompts. A step needing a human aborts non-zero naming the
prerequisite — see Human prerequisites below. If starting the dev server (`bun start`), pass `-- --no-open` in headless or agent environments to prevent launching a local browser window.

**Proof it ran**: all three commands exit zero. `bun run build` runs
`tsc && vite build`, producing artifacts in `dist/`. `bun run
test:coverage` prints a coverage table to stdout.

## Checks

| What                        | Command                      |
| --------------------------- | ---------------------------- |
| TypeScript + Vite build     | `bun run build`              |
| Oxlint                      | `bun run lint`               |
| Oxfmt check                 | `bun run format:check`       |
| Vitest with coverage        | `bun run test:coverage`      |
| Playwright E2E tests        | `bun run test:e2e`           |
| Single test file            | `bun run test ComponentName` |
| Dev server (headless/agent) | `bun run start -- --no-open` |

## Human prerequisites

Run once, by a person. The start command fails until they are done.

- [ ] Install [Bun](https://bun.sh/) 1.4.2 or later (or run `mise install`)
- [ ] Run `bun install`

## Capturing evidence

This project has no automated visual evidence path. Test output from
`bun run test:coverage` serves as verification evidence.

**This document is where the capture rules live**, and the request
document points here rather than restating them. A capture taken on the
developer's own machine carries their account's data, username, and home
paths as readily as a shared environment does. Assert on the frame, a
marker, or fixture data, and crop or mask what the tool happened to be
showing.

The app uses i18next with locale files in `src/locales/`.
UI locale: **`en`**. The app picks it from the browser's
language detection via `i18next-browser-languagedetector`; browser
automation defaults to `en-US`, which matches.

## Not verified

Nothing is recorded as unverifiable. All three gate commands
(`build`, `lint`, `test:coverage`) run locally without external
dependencies.

A gap you could have closed is not a gap. Run the check whose dependency
you have already seen running, and report a check you skipped as untried,
rather than recording it here as one this repo cannot run.
