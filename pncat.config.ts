import { defineConfig, mergeCatalogRules } from 'pncat'

export default defineConfig({
  catalogRules: mergeCatalogRules([
    {
      name: 'auth',
      match: [/better-auth/],
      priority: 0,
    },
    {
      name: 'export',
      match: ['puppeteer-core', /chromium/],
      priority: 0,
    },
    {
      name: 'next',
      match: [/next/],
    },
    {
      name: 'frontend',
      match: [/drag-and-drop/],
    },
    {
      name: 'utils',
      match: ['bcrypt'],
    },
  ]),
  postRun: 'eslint --fix "**/package.json" "**/pnpm-workspace.yaml"',
})
