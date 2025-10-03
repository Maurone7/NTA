# Installation Instructions for macOS Unsigned Builds

If you downloaded a macOS build from the Releases page but haven't signed up for the Apple Developer Program (the $99/year fee), Apple Gatekeeper may prevent the app from opening and show a message such as "NTA.app is damaged and can't be opened." Notarization and Developer ID signing are only available to registered Apple Developers.

You can still run the app locally — here are safe, repeatable options you can publish alongside your release so users know what to do.

## 1) GUI (Recommended for Non-Technical Users)

- In Finder, control‑click (or right‑click) the app icon and choose "Open".
- A dialog will appear saying the app is from an unidentified developer; click "Open" to run it anyway. macOS will remember this choice for that app copy.

## 2) Terminal (One-Line: Remove Quarantine Attribute)

- This removes the quarantine flag for the downloaded app copy and allows it to run. Only run this if you trust the release source.

```bash
# After you expand the downloaded DMG/ZIP and have NTA.app in the current folder
xattr -r -d com.apple.quarantine ./NTA.app
open ./NTA.app
```

## 3) Small Installer Helper (Recommended to Ship in the Release as `install.sh`)

- Create a tiny script that moves the app to `/Applications`, removes quarantine, and opens it for the user. Example content you can include in the release:

```bash
#!/usr/bin/env bash
set -e

APP_NAME="NTA.app"
SRC_DIR="${1:-.}"
SRC_PATH="$SRC_DIR/$APP_NAME"

if [ ! -d "$SRC_PATH" ]; then
  echo "Cannot find $SRC_PATH"
  exit 1
fi

echo "Removing quarantine attribute..."
xattr -r -d com.apple.quarantine "$SRC_PATH" || true

echo "Moving to /Applications (may ask for admin password)..."
mv -f "$SRC_PATH" /Applications/

echo "Opening app..."
open "/Applications/$APP_NAME"

echo "Done."
```

- Make it executable and instruct users to run it after expanding the DMG/ZIP:

```bash
chmod +x install.sh
./install.sh
```

## Verification Commands (Optional, for Advanced Users)

```bash
# Check Gatekeeper assessment
spctl -a -v /path/to/NTA.app

# Check code signature (will fail for unsigned apps but useful to show the output)
codesign --verify -vvv --deep --strict /path/to/NTA.app || true
```

## Security & Distribution Notes

- These instructions let users run unsigned builds locally but do not replace proper code signing and notarization. For distribution to a broad audience (public releases), signing with a Developer ID certificate and notarizing through Apple is the recommended route.
- If you later join the Apple Developer Program, you can sign and notarize binaries so Gatekeeper won't require these manual steps.
- Include these instructions in your Release notes or attach `install.sh` and a short `INSTALL.md` to make the process smooth for non-technical users.