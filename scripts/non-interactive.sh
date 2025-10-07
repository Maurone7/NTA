#!/bin/bash

# Non-interactive development script
# Sets all environment variables for non-interactive operation

export CI=true
export NPM_CONFIG_YES=true
export GIT_ASKPASS=echo
export GIT_CONFIG_GLOBAL=/tmp/gitconfig-noninteractive
export NODE_ENV=production

# Create a temporary git config that disables prompts
cat > /tmp/gitconfig-noninteractive << EOF
[core]
	askPass = echo
[credential]
	helper = store
[push]
	default = simple
EOF

echo "Running in non-interactive mode..."
echo "CI=$CI"
echo "NPM_CONFIG_YES=$NPM_CONFIG_YES"

# Execute the provided command
exec "$@"

# Cleanup
rm -f /tmp/gitconfig-noninteractive