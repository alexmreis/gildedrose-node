import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

export default {
  roots: ['<rootDir>/app', '<rootDir>/test/jest', '<rootDir>/web/test'],
  collectCoverage: true,
  collectCoverageFrom: ['app/**/*.ts', 'web/src/**/*.{ts,tsx}', '!web/src/main.tsx', '!web/src/browser-sound.ts'],
  coverageDirectory: 'coverage',
  coverageProvider: 'babel',
  coverageReporters: ['text', 'lcov', 'json-summary'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
};
