// @ts-nocheck
import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';
// import prettierPlugin from 'eslint-plugin-prettier';

export default [
	// Base JS recommended rules
	js.configs.recommended,

	{
		files: ['**/*.{ts,tsx,js,jsx}'],
		ignores: ['node_modules/**', 'dist/**'],

		languageOptions: {
			parser: tsParser,
			parserOptions: {
				ecmaVersion: 2021,
				sourceType: 'module',
				ecmaFeatures: { jsx: true },
			},
			globals: { browser: true, jest: true },
		},

		plugins: {
			'@typescript-eslint': tseslint,
			react,
			'react-hooks': reactHooks,
			import: importPlugin,
			// prettier: prettierPlugin,
		},

		settings: {
			react: { version: 'detect' },
		},

		rules: {
			// General JS/TS
			'semi': ['error', 'always'],
			'@typescript-eslint/semi': [
				'error',
				'always',
				{ omitLastInOneLineBlock: true }
			],
			'no-unused-vars': [
				'error',
				{ argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
			],
			'no-console': 'off',
			'no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 0 }],
			'no-var': 'error',
			'no-new-object': 'error',
			'no-array-constructor': 'error',

			// React
			'react/prop-types': 'off',
			'react/display-name': 'off',
			'react/react-in-jsx-scope': 'off',
			'react/jsx-handler-names': [
				'error',
				{ eventHandlerPrefix: 'handle', eventHandlerPropPrefix: 'on' },
			],

			// React Hooks
			'react-hooks/rules-of-hooks': 'error',
			'react-hooks/exhaustive-deps': 'error',

			// // Prettier formatting
			// 'prettier/prettier': [
			// 	'error',
			// 	{
			// 		semi: true,
			// 		singleQuote: true,
			// 		endOfLine: 'auto', // ✅ fixes CRLF ␍ issues on Windows
			// 		useTabs: true,
			// 		tabWidth: 1,
			// 	},
			// ],
		},
	},
];
