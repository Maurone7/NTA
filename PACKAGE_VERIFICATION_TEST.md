# Package Verification Test

This document tests the new package verification system that:
1. Queries tlmgr for actually installed packages
2. Filters out packages that are confirmed installed
3. Only warns about packages that are in the .tex file but not installed

## Test Case 1: Installed Packages
This uses packages that are confirmed installed in the system:

$$
\usepackage{geometry}
\usepackage{natbib}
\usepackage{xcolor}
\begin{equation}
y = mx + b
\end{equation}
$$

**Expected Result**: No warning banner should appear because these packages are installed.

## Test Case 2: Mixed Packages
This uses a mix of installed and potentially missing packages:

$$
\usepackage{tikz}
\usepackage{pgfplots}
\usepackage{geometry}
$$

**Expected Result**: Warning banner should appear for tikz and pgfplots if they're not installed, but NOT for geometry since it is installed.

## Test Case 3: No Packages
Plain LaTeX with no package imports:

$$
\frac{1}{2} + \frac{1}{3} = \frac{5}{6}
$$

**Expected Result**: No warning banner should appear.

## Verification Steps

1. **Open this document** in the app
2. **Check for warning banner** - should only appear for actually-missing packages
3. **Dismiss the warning** manually with the dismiss button
4. **Reload the document** - warning should not reappear for this note
5. **Check another note** - the dimissed state should not affect other notes

## Related Issues Addressed

- **Issue**: App warning persists even after manually installing packages via `sudo tlmgr install`
- **Cause**: Detection was static, only checking whitelist without verifying actual system installation
- **Fix**: New `app:checkInstalledLatexPackages` IPC handler queries `tlmgr list --only-installed`
- **Result**: Only packages that are actually missing from the system trigger the warning

## System Information

Check these packages on your system:
```
tlmgr list --only-installed | grep -E "(geometry|natbib|xcolor|tikz|pgfplots)"
```

Should see:
- `geometry`: installed (usually included in basic TeX Live)
- `natbib`: installed (usually included)
- `xcolor`: installed (usually included)
- `tikz`: may or may not be installed
- `pgfplots`: may or may not be installed
