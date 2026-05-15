module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

    /**
     * Design-system contract: feature/app code must import UI primitives
     * from `@/shared/ui` only. HeroUI is an implementation engine hidden
     * behind that facade — leaking it would re-create the duplication this
     * library was built to eliminate.
     *
     * Legitimate exceptions (allowed via overrides below):
     *   - src/shared/components/ui/**  — the facade itself
     *   - src/App.tsx                  — HeroUIProvider (engine wiring root)
     *   - tailwind.config.ts           — heroui() theme plugin
     */
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: '@heroui/react',
            message:
              'Do not import from "@heroui/react" directly. Use "@/shared/ui" instead — that is the only public UI surface for feature code.',
          },
        ],
      },
    ],
  },
  overrides: [
    {
      files: ['src/shared/components/ui/**/*.{ts,tsx}'],
      rules: { 'no-restricted-imports': 'off' },
    },
    {
      files: ['src/App.tsx'],
      rules: { 'no-restricted-imports': 'off' },
    },
    {
      files: ['tailwind.config.ts'],
      rules: { 'no-restricted-imports': 'off' },
    },
  ],
};
