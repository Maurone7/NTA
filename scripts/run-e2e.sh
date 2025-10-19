#!/bin/bash
# Run the Playwright test and always clean up Electron processes afterward
echo "Running E2E test..."
npx playwright test tests/e2e/right-sidebar-resize.spec.js --workers=1 --trace=on
exit_code=$?
echo "Test finished with exit code $exit_code, cleaning up Electron processes..."
node scripts/cleanup-electron.js
exit $exit_code