# Coding Style Guide

This document covers project-specific coding conventions for the
react-showcase repository. Generic TypeScript and React best practices
(type safety, const over var, clean functions) are assumed; only
project-specific rules and patterns are recorded here.

## TypeScript

- Strict mode enabled (`tsconfig.json`)
- 2 spaces indentation
- ES6 modules (`import`/`export`)
- Arrow functions preferred for callbacks and event handlers

## React Components

- Always use functional components with hooks
- PascalCase for component names
- One component per file (unless tightly coupled)
- Use `FC<Props>` type annotation with destructured props

Example shape:

```typescript
import { FC } from 'react';

interface MyComponentProps {
  title: string;
  onClose?: () => void;
}

export const MyComponent: FC<MyComponentProps> = ({ title, onClose }) => {
  return (
    <div>
      <h1>{title}</h1>
      {onClose && <button onClick={onClose}>Close</button>}
    </div>
  );
};
```

## Imports & Exports

- Named exports only (no default exports)
- Group: React → External libraries → Local imports

## Testing

- Framework: Vitest + React Testing Library
- Test file pattern: `ComponentName.test.tsx` beside the component
- Test user interactions, not implementation details
- Mock external dependencies via MSW (`src/mocks/handlers.ts`)

## i18n

- Language files: `src/i18n/locales/`
- Use `useTranslation()` hook in components
- Extract messages: `bun run i18n:extract`
