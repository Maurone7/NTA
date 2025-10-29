# TeX Live Version Mismatch Fix

## Problem

When attempting to install LaTeX packages using the in-app installer on macOS with outdated TeX Live, the following error occurs:

```
tlmgr: Local TeX Live (2023) is older than remote repository (2025).
Cross release updates are only supported with
  update-tlmgr-latest(.sh/.exe) --update
See https://tug.org/texlive/upgrade.html for details.
```

This prevents automatic package installation and requires manual intervention.

## Root Cause

The TeX Live installation on the system is from 2023, but the remote repository is from 2025. TeX Live requires the local manager (`tlmgr`) to be updated before cross-release package installations can proceed.

## Solution Implemented

### Backend Changes (src/main.js)

Modified the `app:installLatexPackages` handler to:

1. **Detect version mismatches early** - Before attempting package installation, run `tlmgr update --self` to check the repository compatibility
2. **Capture error messages** - Parse output for "cross release updates" or "older than remote" indicators
3. **Return informative error** - If mismatch detected, return `needsTlmgrUpdate: true` with instructions instead of failing silently

**Code Changes:**
```javascript
// Check for version mismatch first
const versionResult = await runTlmgr(['update', '--self']);
const combinedOutput = (versionResult.stdout + versionResult.stderr).toLowerCase();

if (combinedOutput.includes('cross release updates') || combinedOutput.includes('older than remote')) {
  return {
    success: false,
    needsTlmgrUpdate: true,
    error: `Your TeX Live (2023) is older than the remote repository (2025). Please run these commands...`
  };
}
```

### Frontend Changes (src/renderer/app.js)

Added handler for the `needsTlmgrUpdate` response:

1. **Display clear alert** - Shows user-friendly instructions to run the update commands
2. **Provide exact commands** - Lists the exact `tlmgr` commands to fix the issue
3. **Guide next steps** - Instructs user to restart the app after updating

**Handler Code:**
```javascript
} else if (result.needsTlmgrUpdate) {
  // Handle TeX Live version mismatch
  setStatus('TeX Live update required', false);
  alert('Your TeX Live installation is outdated.\n\nPlease run these commands in Terminal:\n\n' + 
    'sudo tlmgr update --self\n' +
    'sudo tlmgr update --all\n\n' +
    'After updating, restart the app and try installing packages again.\n\n' +
    (result.error ? 'Details: ' + result.error : ''));
}
```

## User Workflow

1. **Open a .tex file** with missing packages (e.g., natbib, geometry, xcolor)
2. **Purple warning banner appears** with "Install Missing" button
3. **Click "Install Missing"**
4. **App detects version mismatch** and displays alert with instructions:
   ```
   Your TeX Live installation is outdated.
   
   Please run these commands in Terminal:
   
   sudo tlmgr update --self
   sudo tlmgr update --all
   
   After updating, restart the app and try installing packages again.
   ```
5. **User runs commands in Terminal** with sudo password
6. **Restart the app** (Cmd+Q and reopen, or just click "Install Missing" again)
7. **Click "Install Missing"** again
8. **Installation succeeds** - terminal opens with tlmgr output showing package installation

## Technical Details

### Detection Mechanism

The fix uses `tlmgr update --self` as a diagnostic:
- **TeX Live current**: Command succeeds silently, installation proceeds normally
- **TeX Live outdated**: Command fails with error message about version mismatch

### Output Parsing

Checks for specific error indicators:
- `"cross release updates"` - TeX Live version too old for remote repository
- `"older than remote"` - Explicit version comparison result

### Error Flow

When mismatch detected:
1. Main process sets `needsTlmgrUpdate: true` in response
2. Renderer checks for this flag after IPC response
3. User sees alert with exact commands needed
4. After user runs commands and restarts, next attempt succeeds

## Files Modified

1. **src/main.js** (lines 804-831)
   - Added `runTlmgr()` helper function
   - Added version mismatch detection before package installation
   - Updated error handling for cross-release update errors

2. **src/renderer/app.js** (lines 23090-23097)
   - Added `else if (result.needsTlmgrUpdate)` handler
   - Displays user-friendly alert with update instructions
   - Sets appropriate status message

## Testing

To test this fix:

1. Have TeX Live 2023 installed (or any version older than the remote repository)
2. Open a .tex file with packages like `natbib`, `geometry`, or `xcolor`
3. See purple warning banner with "Install Missing" button
4. Click "Install Missing"
5. See alert with update instructions
6. Run the suggested commands in Terminal:
   ```bash
   sudo tlmgr update --self
   sudo tlmgr update --all
   ```
7. Restart the app
8. Click "Install Missing" again
9. Installation should now proceed to terminal with package download/install

## Fallback Behavior

If for any reason the version check fails:
- `needsTlmgrUpdate` is not set
- Normal `needsSudo` flow is triggered
- User gets instructions to run command manually in terminal

This ensures backward compatibility and graceful degradation.

## References

- TeX Live Upgrade Guide: https://tug.org/texlive/upgrade.html
- TeX Live Cross-Release Updates: Documentation about managing multiple TeX Live versions
