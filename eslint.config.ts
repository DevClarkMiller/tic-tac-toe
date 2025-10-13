import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import stylistic from '@stylistic/eslint-plugin'
import { defineConfig } from 'eslint/config';

export default defineConfig([
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  { 
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'], 
    plugins: { 
      js,
      '@stylistic': stylistic,
     }, 
    extends: ['js/recommended'], 
    languageOptions: { 
      globals: globals.browser 
    },
    rules: {
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/no-extra-semi': ['error', 'last'],
      '@stylistic/semi': ['error'],
      'react/react-in-jsx-scope': 'off',
      'react/prefer-stateless-function': 'error',
      'react/button-has-type': 'error',
      'react/no-unused-prop-types': 'error',
      'react/jsx-pascal-case': 'error',
      'react/jsx-no-script-url': 'error',
      'react/no-children-prop': 'error',
      'react/no-danger': 'error',
      'react/no-danger-with-children': 'error',
      'react/no-unstable-nested-components': ['error', { allowAsProps: true }],
      'react/jsx-fragments': 'error',
      'react/destructuring-assignment': [
        'error',
        'always',
        { destructureInSignature: 'always' },
      ],
      'react/jsx-no-leaked-render': ['error', { validStrategies: ['ternary'] }],
      'react/jsx-max-depth': ['error', { max: 5 }],
      'react/function-component-definition': [
        'warn',
        { namedComponents: 'arrow-function' },
      ],
      'react/jsx-key': [
        'error',
        {
          checkFragmentShorthand: true,
          checkKeyMustBeforeSpread: true,
          warnOnDuplicates: true,
        },
      ],
      'react/jsx-no-useless-fragment': 'warn',
      'react/jsx-curly-brace-presence': 'warn',
      'react/no-typos': 'warn',
      'react/display-name': 'warn',
      'react/self-closing-comp': 'warn',
      'react/jsx-sort-props': 'warn',
      'react/jsx-one-expression-per-line': 'off',
      'react/prop-types': 'off'
    }
  },
]);
