import { defineConfig, devices } from '@playwright/test';
import { USERS } from './tests/utils/testData';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  workers: Object.values(USERS).length,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }]]
    : [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: process.env.BASE_URL,
    testIdAttribute: 'data-test',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'setup', testDir: './tests/setup', testMatch: '**/auth.setup.ts', use: { trace: 'off' } },
    ...Object.values(USERS).map((user) => ({
      name: `e2e:${user}`,
      testDir: './tests/specs',
      fullyParallel: false,
      grep: new RegExp(`@${user}`),
      use: { ...devices['Desktop Chrome'], currentUser: user },
      dependencies: ['setup'],
    })),
  ],
});
