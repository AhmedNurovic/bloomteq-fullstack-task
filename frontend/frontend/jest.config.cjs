module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^.+\\.(svg)$': '<rootDir>/__mocks__/svgMock.js',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^./viteEnv$': '<rootDir>/__mocks__/viteEnv.ts',
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest',
  },
  testMatch: [
    '<rootDir>/src/**/*.test.ts',
    '<rootDir>/src/**/*.test.tsx'
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(@testing-library|react|react-dom)/)'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleDirectories: [
    "node_modules",
    "<rootDir>/node_modules",
    "<rootDir>/../node_modules"
  ],
}; 