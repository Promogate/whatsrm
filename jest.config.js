const { pathsToModuleNameMapper } = require('ts-jest');
// Importando o tsconfig de forma diferente para evitar o erro de parse
const tsconfig = require('./tsconfig.json');

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: './tsconfig.json',
      },
    ],
  },
  moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  setupFiles: ['<rootDir>/src/infrastructure/config/ModuleAlias.ts'],
  moduleDirectories: ['node_modules', '<rootDir>'],
  testMatch: [
    '**/*.spec.ts',
    '**/*.test.ts'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/'
  ]
};