import type { Config } from 'jest';

const config: Config = {
	preset: 'ts-jest',
	testEnvironment: 'jsdom',

	// Transform TS and TSX with Babel
	transform: {
		'^.+\\.(t|j)sx?$': [
			'babel-jest',
			{
				presets: [
					'@babel/preset-env',
					['@babel/preset-react', { runtime: 'automatic' }], // ✅ automatic JSX transform
					'@babel/preset-typescript',
				],
				// Remove this plugin — it forces old JSX transform
				// plugins: ['@babel/plugin-transform-react-jsx'],
			},
		],
	},

	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
		'^@game/(.*)$': '<rootDir>/src/game/$1',
		'^@models/(.*)$': '<rootDir>/src/models/$1',
		'^@components/(.*)$': '<rootDir>/src/component/$1',
		'^@context/(.*)$': '<rootDir>/src/context/$1',
		'^@helpers/(.*)$': '<rootDir>/src/helpers/$1',
		'^@workers/(.*)$': '<rootDir>/src/workers/$1',
		'\\.(css|less|scss|sass)$': 'identity-obj-proxy',
		'\\.(png|jpg|jpeg|svg|gif)$': '<rootDir>/__mocks__/fileMock.ts',
	},

	testMatch: ['**/__tests__/**/*.test.(ts|tsx)', '**/src/**/*.test.(ts|tsx)'],
	setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};

export default config;
