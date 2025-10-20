/** @type {import('@playwright/test').PlaywrightTestConfig} */
module.exports = {
  testDir: 'tests/e2e',
  testMatch: '*.js',
  timeout: 30 * 1000,
  use: {
    headless: false,
    viewport: { width: 1280, height: 800 }
  }
};
