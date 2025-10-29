#!/bin/bash
# Test the tlmgr list --only-installed command directly

echo "=== Testing tlmgr list --only-installed ==="
tlmgr list --only-installed | head -5
echo ""
echo "=== Testing package detection for specific packages ==="
tlmgr list --only-installed | grep -E "^i (geometry|natbib|xcolor|tikz|pgfplots|beamer)" | head -10
echo ""
echo "=== Testing full regex match ==="
tlmgr list --only-installed | grep -E "^[i\s]+(geometry|natbib|xcolor)" | head -10
echo ""
echo "=== Counting total installed packages ==="
tlmgr list --only-installed | wc -l
