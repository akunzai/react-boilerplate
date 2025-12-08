# AGENTS.md - AI Agent Guidelines

This document provides instructions and guidelines for AI agents (like Claude) working on this React Boilerplate project.

## Project Overview

- **Type**: React TypeScript Boilerplate
- **Package Manager**: [Bun](https://bun.sh/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Testing Framework**: [Vitest](https://vitest.dev/)
- **Runtime**: Bun (no Node.js dependency)

## Build & Development Instructions

### Prerequisites

Ensure you have the following installed:
- [Bun](https://bun.sh/) 1.3.4 or later
- Git

### Setting Up the Project

```bash
# Install dependencies
bun install

# Start development server (http://localhost:5173/)
bun start

# Build for production
bun run build

# Preview production build
bun run serve

# Run tests (watch mode)
bun run test

# Run tests with coverage report
bun run test:coverage

# Run ESLint
bun run lint

# Extract i18n messages
bun run i18n:extract

# Initialize MSW (Mock Service Worker)
bun run msw
```

### Important Commands

| Command | Purpose |
|---------|---------|
| `bun install` | Install dependencies using bun.lock |
| `bun install --frozen-lockfile` | Install with locked dependencies (CI/CD) |
| `bun start` | Run dev server with auto-reload |
| `bun run build` | Build TypeScript and bundle with Vite |
| `bun run test` | Run all tests in watch mode |
| `bun run test:coverage` | Run tests with coverage report |
| `bun run lint` | Check code style with ESLint |

## Coding Style Guide

### TypeScript/JavaScript

- **Language**: TypeScript (strict mode)
- **Style**: Enforce with ESLint
- **Format**: 2 spaces indentation
- **Imports**: Use ES6 modules (`import`/`export`)
- **Arrow Functions**: Preferred for callbacks and event handlers

#### Do's

```typescript
// Use type annotations
const count: number = 0;

// Use arrow functions
const handleClick = () => { /* ... */ };

// Use const for immutability
const config = { /* ... */ };

// Use proper typing
interface User {
  id: string;
  name: string;
}

// Destructure props
const MyComponent = ({ name, age }: Props) => {
  return <div>{name}</div>;
};
```

#### Don'ts

```typescript
// Avoid any type
const data: any = null; // ❌

// Avoid var
var count = 0; // ❌

// Avoid loose typing
const config = { /* ... */ }; // ❌ without type annotation

// Avoid function declarations in components
function MyComponent() { } // ❌
```

### React Components

- **Functional Components**: Always use functional components with hooks
- **Naming**: PascalCase for components
- **Files**: One component per file (unless tightly coupled)
- **Hooks**: Use standard React hooks (useState, useEffect, useContext, etc.)

#### Component Structure

```typescript
// File: src/components/MyComponent.tsx
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

### File Organization

```tree
src/
├── components/          # React components
│   ├── NavMenu.tsx
│   ├── Counter.tsx
│   └── ...
├── api/                 # API services and requests
│   ├── TodoService.ts
│   └── ...
├── hooks/               # Custom React hooks
├── i18n.ts              # i18n configuration
├── setupTests.ts        # Test setup
├── setupStoragePolyfill.ts  # Storage polyfill
├── App.tsx              # Root component
├── index.tsx            # Entry point
└── styles/              # Global styles (CSS)
```

### Testing

- **Framework**: [Vitest](https://vitest.dev/)
- **Testing Library**: [React Testing Library](https://testing-library.com/)
- **Coverage**: Track with codecov
- **Pattern**: Test file name = `ComponentName.test.tsx`

#### Test Example

```typescript
import { render, screen } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('should render title', () => {
    render(<MyComponent title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

### Imports & Exports

- Use named exports for components (not default exports)
- Use absolute imports where possible
- Group imports: React → External libraries → Local imports

```typescript
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { TodoService } from '../api/TodoService';
import { Button } from './Button';
```

## Code Quality Standards

### ESLint Configuration

The project enforces ESLint rules defined in `.eslintrc.json`. Run before committing:

```bash
bun run lint
```

### TypeScript Checks

The build process includes TypeScript compilation:

```bash
# Runs as part of: bun run build
tsc --noEmit
```

### Test Coverage

Maintain high test coverage. All public components and utilities should have tests.

```bash
bun run test:coverage
```

## Development Guidelines

### When Making Changes

1. **Before modifying files**: Read existing code to understand patterns and architecture
2. **Follow existing patterns**: Match the style of surrounding code
3. **Avoid over-engineering**: Keep solutions simple and focused
4. **No unnecessary refactoring**: Don't refactor code that isn't directly related to the task
5. **Minimal comments**: Only comment non-obvious logic

### Editing Existing Code

- Prefer editing existing files over creating new ones
- Don't add docstrings, comments, or type annotations to unchanged code
- Only add comments where logic isn't self-evident
- Delete unused code completely (no "// removed" comments)

### Creating New Files

Only create new files when absolutely necessary:

- New components require their own files
- Utility functions can be grouped in utilities directory
- Don't create documentation files unless explicitly requested

### Git Commits

- Write clear, concise commit messages (1-2 sentences)
- Focus on "why" rather than "what"
- Example: `Add dark mode toggle to application settings`

### Dependencies

- Don't add new dependencies without justification
- Prefer built-in solutions and existing libraries
- Check package.json for duplicates before adding

## Project-Specific Configuration

### Vite Configuration (vite.config.ts)

- Development server: Vite with HMR
- Build target: ESNext
- Test environment: jsdom with storage polyfill
- No warnings suppressed: `NODE_NO_WARNINGS=1` (jsdom/Bun compatibility)

### i18n Configuration

- Language files: `src/i18n/locales/`
- Default language: English
- Auto language detection enabled
- Use `useTranslation()` hook in components

### MSW (Mock Service Worker)

- Mock handlers: `src/mocks/handlers.ts`
- Browser setup: `public/mockServiceWorker.js` (auto-generated)
- Server setup in tests: `src/setupTests.ts`

## Common Tasks

### Adding a New Component

```bash
# 1. Create the component file
# File: src/components/MyNewComponent.tsx

import { FC } from 'react';

interface MyNewComponentProps {
  // Define props
}

export const MyNewComponent: FC<MyNewComponentProps> = (props) => {
  return <div>Component content</div>;
};

# 2. Create test file
# File: src/components/MyNewComponent.test.tsx

# 3. Test it
bun run test

# 4. Run linter
bun run lint
```

### Adding a New API Service

```typescript
// File: src/api/MyService.ts
export class MyService {
  static async fetch() {
    const response = await fetch('/api/endpoint');
    return response.json();
  }
}
```

### Adding Tests

- Use Vitest with React Testing Library
- Test user interactions, not implementation details
- Mock external dependencies
- Aim for high coverage but prioritize meaningful tests

## Troubleshooting

### Build Issues

1. Clear cache and reinstall:

   ```bash
   rm -rf node_modules bun.lock
   bun install
   ```

2. Check TypeScript errors:

   ```bash
   bun run build
   ```

### Test Issues

1. Run tests with verbose output:

   ```bash
   bun run test -- --reporter=verbose
   ```

2. Debug a specific test:

   ```bash
   bun run test MyComponent.test.tsx
   ```

### Linting Issues

```bash
bun run lint
```

## Resources

- [Bun Documentation](https://bun.sh/docs)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Vitest Documentation](https://vitest.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React i18next](https://react.i18next.com/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)

## Questions?

For questions about the project structure or development workflow, refer to the main [README.md](README.md) or examine existing code examples in the repository.
