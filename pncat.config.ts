import { defineConfig, mergeCatalogRules } from 'pncat'

export default defineConfig({
  catalogRules: mergeCatalogRules([
    {
      name: 'ai',
      match: [
        'ai',
        /ai-sdk/,
      ],
      priority: 0,
    },
    {
      name: 'frontend',
      match: [
        /dnd-kit/,
        /streamdown/,
        'class-variance-authority',
        'clsx',
        'cmdk',
        'motion',
        'radix-ui',
        'sonner',
        'tailwind-merge',
        'tw-animate-css',
        'use-stick-to-bottom',
        'vaul',
      ],
    },
  ]),
  postRun: 'eslint --fix "**/package.json" "**/pnpm-workspace.yaml"',
})
