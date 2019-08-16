module.exports = {
  clearMocks: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/'],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  testEnvironment: 'node',
  testMatch: ['<rootDir>/__tests__/src/**/*.{js,jsx,ts,tsx}'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['./__tests__/setupTests.ts'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/index.ts',
    '!src/hooks/index.ts',
    '!src/components/index.ts',
    '!src/context/**/*Context.ts',
    '!src/errors/QueryError.ts'
  ],
  coverageDirectory: './coverage/',
  collectCoverage: true,
};
