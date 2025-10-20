# Auto-Update System

NoteTakingApp now includes an automatic update system that notifies users when new versions are available and allows them to update seamlessly.

## ✨ Features

- **Automatic update checking** on app launch and every 4 hours
- **Background downloads** with progress indicators
- **User-friendly notifications** with install/dismiss options
- **GitHub releases integration** for automatic distribution
- **Manual update checking** available

## 🔄 How It Works

### For Users:

1. **Automatic Notifications**: When a new version is available, a notification appears in the top-right corner
2. **Download Progress**: Users can see download progress in real-time
3. **Install & Restart**: Once downloaded, users can install with one click
4. **Dismiss Option**: Users can dismiss notifications and install later

### For Developers:

1. **Version Management**: Update the version number in `package.json`
2. **Build & Release**: Create builds and publish to GitHub Releases
3. **Automatic Distribution**: Users get notified automatically

## 🚀 Creating Updates

### Step 1: Update Version
```bash
# Edit package.json and bump the version number
"version": "1.1.0"  # From 1.0.0 to 1.1.0
```

### Step 2: Build New Version
```bash
npm run build:mac
```

### Step 3: Create GitHub Release
1. Go to: https://github.com/Maurone7/NoteTakingApp/releases/new
2. Create tag: `v1.1.0`
3. Release title: `NoteTakingApp v1.1.0`
4. Upload the DMG files from `dist/` folder:
   - `NoteTakingApp-1.1.0-arm64.dmg`
   - `NoteTakingApp-1.1.0-x64.dmg`
5. Include release notes describing what's new
6. Publish the release

### Step 4: Users Get Notified
- Existing users will automatically be notified of the update
- New downloads will get the latest version

## 📋 Update Process for Users

### When Update is Available:
```
📦 Update Available
A new version of NoteTakingApp is available.
[Download] [Later]
```

### During Download:
```
📦 Update Available  
Version 1.1.0 is available for download.
Downloading... 45%
[Later]
```

### Ready to Install:
```
📦 Update Available
Version 1.1.0 has been downloaded and is ready to install.
[Install & Restart] [Later]
```

## 🛠️ Technical Details

### Auto-Updater Configuration:
- **Provider**: GitHub Releases
- **Repository**: Maurone7/NoteTakingApp
- **Check Frequency**: App launch + every 4 hours
- **Update Files**: DMG and ZIP formats for macOS

### Update Notification UI:
- **Position**: Fixed top-right corner
- **Style**: Native macOS appearance with light/dark mode support
- **Animation**: Slides in from right
- **Progress**: Real-time download progress bar

### Security:
- **Code Signing**: Recommended for production releases
- **Entitlements**: Configured for macOS security requirements
- **Verification**: Auto-updater verifies file integrity

## 🔍 Testing Updates

### Local Testing:
1. Install current version (1.0.0)
2. Create new version (1.1.0) and release
3. Open the app - should show update notification
4. Test download and install process

### Version Management:
- **Semantic Versioning**: Major.Minor.Patch (e.g., 1.1.0)
- **Auto-increment**: Consider using `npm version` commands
- **Release Notes**: Always include what changed

## 📚 User Benefits

✅ **No Manual Checking**: Users don't need to visit websites to check for updates
✅ **Seamless Updates**: Download and install with minimal disruption  
✅ **Progress Feedback**: Users see download progress and status
✅ **User Control**: Users can choose when to install updates
✅ **Automatic Distribution**: Updates reach all users automatically

## 🔧 Troubleshooting

### Common Issues:
- **Update Check Fails**: Check internet connection and GitHub repository access
- **Download Stalls**: May be due to network issues or GitHub API limits
- **Install Fails**: Ensure app has proper permissions and isn't running multiple instances

### Debug Information:
- Check developer console for update-related logs
- Verify GitHub release includes proper DMG files
- Confirm version numbers are properly incremented

The auto-update system ensures users always have the latest features and bug fixes without manual intervention!