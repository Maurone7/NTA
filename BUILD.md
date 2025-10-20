# Building Standalone Applications

This project uses electron-builder to create standalone applications that users can run without installing Node.js or Electron.

## Prerequisites

- Node.js (18+)
- npm

## Building

### Install dependencies (first time only)
```bash
npm install
```

### Build for macOS
```bash
npm run build:mac
```

This creates:
- `NoteTakingApp-1.0.0-x64.dmg` - DMG installer for Intel Macs
- `NoteTakingApp-1.0.0-arm64.dmg` - DMG installer for Apple Silicon Macs
- `NoteTakingApp-1.0.0-x64.zip` - ZIP archive for Intel Macs
- `NoteTakingApp-1.0.0-arm64.zip` - ZIP archive for Apple Silicon Macs

### Build for Windows
```bash
npm run build:win
```

### Build for Linux
```bash
npm run build:linux
```

### Build for all platforms
```bash
npm run build
```

## Distribution

The built applications are completely standalone and include:
- Electron runtime
- Node.js runtime
- All dependencies
- Your application code

Users can simply:
1. Download the appropriate `.dmg` file for their Mac
2. Open the DMG and drag the app to Applications
3. Run the app like any other macOS application

No additional software installation required!

## File Sizes

The standalone applications are approximately:
- macOS: ~95-100MB
- Windows: ~120-140MB
- Linux: ~110-130MB

This includes the entire Electron runtime and Node.js, making the app completely self-contained.