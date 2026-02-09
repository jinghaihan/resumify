import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'eslint-config-hyoban'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig(
  {
    formatters: true,
    sortImports: 'perfectionist',
    typescript: {
      overrides: {
        'ts/consistent-type-definitions': ['error', 'interface'],
      },
    },
    react: {
      overrides: {
        'react-refresh/only-export-components': 'off',
        'react-hooks-extra/no-direct-set-state-in-use-effect': 'warn',
      },
    },
    nextjs: true,
    tailwindcss: {
      settings: {
        entryPoint: resolve(__dirname, 'src', 'assets', 'globals.css'),
      },
      overrides: {
        'tailwindcss/no-unknown-classes': 'off',
        'better-tailwindcss/enforce-consistent-line-wrapping': 'error',
      },
    },
    ignores: [
      // Default ignores of eslint-config-next:
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      'types/*.d.ts',

      // Shadcn UI
      'packages/shadcn/src/components/ui/**',
      // AI Elements
      'packages/shadcn/src/components/ai-elements/**',
    ],
  },
  {
    rules: {
      'pnpm/yaml-enforce-settings': 'off',
    },
  },
)
