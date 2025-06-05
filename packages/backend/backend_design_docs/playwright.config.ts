import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    video: 'on-first-retry',
    // Enable offline mode by default
    offline: true,
    // Configure service worker
    serviceWorkers: 'block',
    // Visual regression settings
    screenshot: {
      mode: 'on',
      fullPage: true,
    },
    // Configure viewport for consistent screenshots
    viewport: { width: 1280, height: 800 },
    // Configure color scheme
    colorScheme: 'light',
  },
  projects: [
    {
      name: 'offline',
      testMatch: /.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        offline: true,
      },
    },
    {
      name: 'online',
      testMatch: /.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        offline: false,
      },
    },
    {
      name: 'visual-regression',
      testMatch: /.*visual-regression\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        offline: true,
        // Disable animations for consistent screenshots
        hasTouch: false,
        isMobile: false,
        // Configure screenshot settings
        screenshot: {
          mode: 'on',
          fullPage: true,
        },
      },
    },
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Desktop Firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'Desktop Safari',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  // Configure snapshot directory
  snapshotDir: './tests/e2e/snapshots',
  // Configure test timeout
  timeout: 30000,
  // Configure expect timeout
  expect: {
    timeout: 5000,
    toHaveScreenshot: {
      maxDiffPixels: 100,
      threshold: 0.2,
    },
  },
}) 