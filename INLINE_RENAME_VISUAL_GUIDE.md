# Inline Tree Rename - Visual Guide

## What Changed

### Before: Title Bar Rename
```
┌────────────────────────────────────┐
│ 📁 Untitled.md      ← Rename happened here
│ /Users/Documents/file.md           │
├────────────────────────────────────┤
│ 📝 file.md                         │
│ 📝 notes.md                        │
│ 📁 subfolder/                      │
│   📝 draft.md                      │
└────────────────────────────────────┘
```

### After: Inline Tree Rename
```
┌────────────────────────────────────┐
│ 📁 Workspace                       │
├────────────────────────────────────┤
│ 📝 [________old-name________] ← Editable input here!
│ 📝 notes.md                        │
│ 📁 subfolder/                      │
│   📝 draft.md                      │
└────────────────────────────────────┘
```

## Interaction Flow

### Step 1: Right-click File
```
┌────────────────────┐
│ 📝 myfile.md   <-- Right-click here
│ 📝 other.md    │
│ 📝 notes.md    │
└────────────────────┘
```

### Step 2: Context Menu Appears
```
┌────────────────────────┐
│ 📝 myfile.md       │    ┌──────────────┐
│ 📝 other.md        │    │ Cut     (⌘X) │
│ 📝 notes.md        │    │ Copy    (⌘C) │
│                    │    │ Paste   (⌘V) │
│                    │    │ Rename      ✓│  ← Click here
│                    │    │ Reveal      │
│                    │    │ Delete      │
│                    │    └──────────────┘
└────────────────────────┘
```

### Step 3: Rename Input Appears
```
┌──────────────────────────────┐
│ 📝 [___myfile.md___________]  ← Input field
│    ↑ text is selected          (ready to type)
│ 📝 other.md
│ 📝 notes.md
└──────────────────────────────┘
```

### Step 4: User Types New Name
```
┌──────────────────────────────┐
│ 📝 [_new_awesome_filename___]  ← User is typing
│ 📝 other.md
│ 📝 notes.md
└──────────────────────────────┘
```

### Step 5: Press Enter to Complete
```
┌──────────────────────────────┐
│ 📝 new_awesome_filename        ← Updated name
│    (input gone, file renamed)
│ 📝 other.md
│ 📝 notes.md
└──────────────────────────────┘
```

## Styling Details

### Rename Input Appearance
```css
┌─────────────────────────┐
│ [_________________] ← Editable input
│  ↑ Border on focus   ↑ Rounded corners
│  ↑ Matches tree font size & color
│  ↑ Padding inside
└─────────────────────────┘
```

### Focus State
```css
┌─────────────────────────┐
│ [_________________] ← Focus ring
│  ══════════════════   (2px shadow)
└─────────────────────────┘
```

## Keyboard Controls

| Key | Result |
|-----|--------|
| **Enter** | ✅ Confirm rename |
| **Escape** | ❌ Cancel (keeps old name) |
| **Tab/Click Away** | ✅ Confirm rename |

## Error Handling

### Same Name (No Change)
```
User types same name...
[___myfile.md___]
     ↓ press Enter
✓ Confirms without error
(name stays same)
```

### Failed Rename (e.g., file already exists)
```
[___new_name___]
     ↓ press Enter
✗ Rename fails
     ↓
[___old_name___]  ← Reverts to original
(shows error message)
```

### Empty Name
```
[___________]  ← User deletes all text
  ↓ press Enter
✓ No change (keeps old name)
```

## Mobile/Accessibility

- ✅ Full keyboard support
- ✅ Focus management
- ✅ ARIA labels preserved
- ✅ Semantic HTML (input element)
- ✅ Works in any tree depth level
- ✅ Works with all file types

## Performance

- ✅ Lightweight DOM manipulation
- ✅ No virtual list needed (inline editing)
- ✅ Instant user feedback
- ✅ Async rename (doesn't block UI)
