import type { TestingConfig } from '@stencil/core/internal';

export const testingConfig: TestingConfig = {
  moduleNameMapper: {
    '@utils/test': ['<rootDir>/src/utils/__test__'],
  },
  reporters: 'jest-junit',
  /* coverage */
  coverageReporters: ['text-summary', 'lcov', 'clover', 'html'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.spec.{ts,tsx}',
    '!src/**/*.e2e.{ts,tsx}',
    '!src/**/__test__/**',
    '!src/**/__mocks__/**',
    '!src/**/types/**',
    '!src/**/index.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  /* e2e */
  browserHeadless: 'shell',
  browserSlowMo: 200,
  /* Setup before running the tests */
  // setupFilesAfterEnv: ['<rootDir>/src/testing/e2e-setup.ts'],
};
