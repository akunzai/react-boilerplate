# Issue tracker: GitHub

**This file is English throughout**, sample blocks included, so it reads
one way to every model, whatever language the repo chose for its issues.

Issues live as GitHub issues. Use the `gh` CLI for all
operations; it infers the repo when run inside a clone.

Write issue titles and descriptions in **English**.

## Conventions

- **Create**: `gh issue create --title "..." --body "..."`. Use a heredoc for multi-line bodies.
- **Read**: `gh issue view <number> --comments`
- **List**: `gh issue list --state open --json number,title,labels`
- **Comment**: `gh issue comment <number> --body "..."`
- **Label**: `gh issue edit <number> --add-label "..."`
- **Close**: `gh issue close <number>`

Use a concise descriptive title with no Conventional Commit prefix.

## Description shape

1. Open with what a product manager or a new engineer would observe: the
   symptom or the request, in plain language. Skip file paths and
   function names unless the reader cannot otherwise locate the issue.
2. Add a visual the forge renders inline — a screenshot or recording for
   a UI bug, a Mermaid diagram for a flow or state problem. In a Mermaid
   label, write a path parameter as `:id`, not `{id}`, and break lines
   with `<br/>`, not `\n`. Skip formats
   the description editor cannot render, such as a link to an external
   artifact or a raw HTML or SVG file. Upload it with the repeatable `--attach` flag
   (`gh issue create --attach './bug.png#The error state'`);
   alt text follows the path after `#`. Only when capture is genuinely
   impossible, leave `<!-- screenshot pending: <what it should show> -->`
   rather than omitting it silently.
3. Close with a collapsed technical section, so it does not push the
   human summary below the fold:

```markdown
<details>
<summary>Technical details</summary>

<everything an implementer needs — for example, suspected cause, related
code paths, repro commands, log excerpts>

</details>
```

**No personally identifiable information in any attachment**; use test
data, masking, or cropping.

## Spec issues

An issue an agent will implement from carries a different shape, because
its reader is building rather than triaging. Acceptance criteria stay
above the fold; only background goes into `<details>`.

```markdown
<one paragraph: the observable outcome>

## Acceptance criteria

- [ ] <checkable statement about observable behaviour>
- [ ] <one per criterion; a reviewer can tick these without reading code>

## Scope

- In: <paths or areas>
- Out: <what this issue deliberately does not change>

## Verification

<how to prove it works, per `docs/agents/verification.md`>

<details>
<summary>Technical details</summary>

<only background — for example, related code paths, prior art, log
excerpts, open questions>

</details>
```

Use the vocabulary the project already defines for its domain, so the
issue, the tests, and the code name the same things.

An issue with unanswered open questions is not ready to implement. Say
so in the issue rather than letting an agent guess.

## Labels

This repo's own labels, read from `gh label list --limit 100`. Do not
invent labels; when a label really is missing, that is a conversation
with the maintainer.

- **Applied when it applies**:
  - `bug` — something isn't working
  - `enhancement` — new feature or request
  - `documentation` — improvements or additions to documentation
  - `dependencies` — pull requests that update a dependency file
  - `javascript` — pull requests that update JavaScript code
  - `github_actions` — pull requests that update GitHub Actions code
  - `good first issue` — good for newcomers
  - `help wanted` — extra attention is needed
  - `question` — further information is requested

## When a skill says "publish to the issue tracker"

Create a GitHub issue.

## When a skill says "fetch the relevant ticket"

Run `gh issue view <number> --comments`.
