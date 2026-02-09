# Resumify - Claude AI Guidelines

## Project Overview

Block-based resume builder with Next.js, TypeScript, and monorepo architecture.

## Project Structure

```sh
resumify/
├── src/                      # Main app (App Router, components, lib)
├── packages/                 # Monorepo workspace packages
│   ├── ai/                   # AI functionality
│   ├── api/                  # API client implementation
│   ├── auth/                 # Authentication (Better Auth)
│   ├── chatbot/              # Chatbot
│   ├── database/             # Database schema & migrations
│   ├── i18n/                 # Internationalization
│   ├── shadcn/               # Shared UI components
│   ├── shared/               # Shared utilities & types
│   ├── store/                # State management
│   ├── themes/               # Theme configurations
│   └── ui/                   # Base UI components
├── eslint.config.mjs
├── tsconfig.json
└── pnpm-workspace.yaml
```

## How to Find Code

1. **UI Components priority:**
   - Check `@resumify/ui` first
   - If not found, import from `@resumify/shadcn/components/ui`
   - If still not found, **ask user before creating new ones**
2. **Other utilities** - check `packages/shared/`, `packages/auth/` etc.
3. **Search with Grep** - find keywords across the codebase
4. **Follow import patterns** - workspace packages use `@resumify/<package-name>`

## Coding Rules

### 1. Comments
- **NO CHINESE COMMENTS** - English only
- Write **only when necessary** (complex logic, non-obvious code, workarounds)
- Skip redundant comments for self-explanatory code

### 2. Pre-Execution Workflow
**Before completing any task, MUST run:**
```sh
pnpm lint --fix
pnpm typecheck
```

### 3. Internationalization (i18n)
- **Always use `useTranslations()` WITHOUT parameters**
- **Write full translation paths**, e.g., `t('theme.single')` instead of `t('single')`
- Wrong: `const t = useTranslations('theme')` then `t('single')`
- Correct: `const t = useTranslations()` then `t('theme.single')`

### 4. Code Style
- Follow existing patterns in the codebase
- No `any` types
- Prefer functional components & hooks
