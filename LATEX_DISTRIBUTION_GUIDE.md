# LaTeX Distribution Picker - Visual Guide

## Quick Comparison Table

| Feature | BasicTeX | MacTeX-No-GUI | TinyTeX |
|---------|----------|---------------|---------|
| **Size** | 400 MB ⭐ | 2.0 GB | 50 MB |
| **Install Time** | 2-5 min ⭐ | 15-30 min | 1-2 min |
| **Essential Packages** | ✅ All | ✅ All | ⚠️ Minimal |
| **Extra Packages** | 📦 Auto-install | ✅ Pre-installed | 📦 Auto-install |
| **Good For** | Most documents ⭐ | Everything possible | Minimal setups |
| **Recommended** | ✅ YES | For power users | For minimalists |

---

## Dialog Mockup

```
╔══════════════════════════════════════════════════════════════╗
║           Choose LaTeX Distribution                          ║
║                                                              ║
║ Which LaTeX version would you like to install?              ║
║                                                              ║
║ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ║
║ 📦 BasicTeX (Recommended)                                    ║
║    • Size: 400 MB | Time: 2-5 minutes                       ║
║    • Has all essential LaTeX packages                       ║
║    • Auto-installs additional packages as needed            ║
║    • Perfect balance of size & capability                  ║
║                                                              ║
║ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ║
║ 📚 MacTeX-No-GUI (Full)                                      ║
║    • Size: 2.0 GB | Time: 15-30 minutes                     ║
║    • Has every LaTeX package ever created                   ║
║    • No need to download packages later                     ║
║    • Use if you need obscure packages                       ║
║                                                              ║
║ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ║
║ 💨 TinyTeX (Minimal)                                         ║
║    • Size: 50 MB | Time: 1-2 minutes                        ║
║    • Only installs what you actually use                    ║
║    • Starts very small, grows over time                     ║
║    • Best for minimal installations                         ║
║                                                              ║
║ [BasicTeX (Recommended)]  [MacTeX-No-GUI]  [TinyTeX] [Cancel]║
╚══════════════════════════════════════════════════════════════╝
```

---

## User Flow

```
1. User attempts LaTeX export
   ↓
2. LaTeX not detected
   ↓
3. Toast notification appears
   "LaTeX not installed. [Install]"
   ↓
4. User clicks [Install]
   ↓
5. Distribution picker dialog shows
   
   ┌─────────────────────────────┐
   │ Choose Distribution:        │
   │                             │
   │ [BasicTeX] ← Recommended    │
   │ [MacTeX-No-GUI]            │
   │ [TinyTeX]                  │
   │ [Cancel]                   │
   └─────────────────────────────┘
   ↓
6. User selects distribution
   ↓
7. Confirmation dialog
   
   ┌─────────────────────────────┐
   │ Install BasicTeX?           │
   │ Size: 400 MB                │
   │ Time: 2-5 minutes           │
   │                             │
   │ [Install Background] [Cancel]
   └─────────────────────────────┘
   ↓
8. Installation runs in background
   (App continues to work)
   ↓
9. Status message shows progress
   ↓
10. Installation completes
    (User restarts app)
    ↓
11. LaTeX detected ✓
    Next export uses native PDF
```

---

## Distribution Decision Tree

```
                    Install LaTeX?
                         │
            ┌────────────┼────────────┐
            │            │            │
        Do you know    Minimal       Power
        what you       setup?        user?
        need?          │             │
            │          │             │
            NO         YES           YES
            │          │             │
            │          ▼             ▼
            │       TinyTeX      MacTeX-No-GUI
            │       (50 MB)      (2 GB)
            │
            │ Most users choose...
            ▼
         BasicTeX ⭐
         (400 MB)
         
         Why BasicTeX?
         ✓ 5x smaller than MacTeX
         ✓ 2-5 minute install
         ✓ Smart package auto-install
         ✓ Perfect for 99% of documents
```

---

## Installation Size Comparison

```
TinyTeX         BasicTeX        MacTeX-No-GUI
┌──────┐        ┌────────────┐  ┌──────────────────────────────┐
│ 50   │        │    400     │  │         2,000               │
│ MB   │        │    MB      │  │         MB                  │
└──────┘        └────────────┘  └──────────────────────────────┘
 Initial         Recommended      Full Suite
 Grows to:       Grows to:        Fixed at:
 500-1000 MB     1-1.5 GB        2.0 GB
 
 Time:           Time:            Time:
 1-2 min         2-5 min          15-30 min
```

---

## Which Should I Choose?

### 👤 Typical User: Choose **BasicTeX**
- Writing thesis or paper
- Compiling technical documents
- Want fast, lightweight install
- Don't have lots of extra disk space

**Result:** 400 MB download, 2-5 minutes, done! ✓

### 🔬 Academic/Power User: Choose **MacTeX-No-GUI**
- Working with many specialized packages
- Publishing papers with custom requirements
- Need to guarantee package availability
- Have the disk space

**Result:** 2 GB download, 15-30 minutes, everything included ✓

### 💾 Space-Constrained: Choose **TinyTeX**
- Minimal disk space available
- Docker containers
- CI/CD pipelines
- Need ultra-fast install

**Result:** 50 MB download, 1-2 minutes, grow as needed ✓

---

## Real-World Scenarios

### Scenario 1: Writing a simple thesis
```
User → BasicTeX (400 MB)
Time: 2-5 minutes
Result: ✓ Works perfectly
```

### Scenario 2: Academic paper with complex formatting
```
User → BasicTeX (400 MB)
First compile: Works ✓
Uses special package:
  → System detects missing
  → Auto-installs it
  → Tries again
Result: ✓ Works automatically
```

### Scenario 3: Publishing house needs everything possible
```
User → MacTeX-No-GUI (2 GB)
Time: 15-30 minutes
Result: ✓ Every package available
```

### Scenario 4: CI/CD container needs LaTeX
```
User → TinyTeX (50 MB)
Time: 1-2 minutes
Result: ✓ Minimal footprint
```

---

## FAQ: Which is Right for Me?

**Q: I'm not sure which one to pick**
> A: Choose **BasicTeX** (the default). It's recommended for a reason—it works for 99% of use cases while being 5x smaller and super fast.

**Q: I want the smallest possible installation**
> A: Choose **TinyTeX** (50 MB). Packages auto-install when needed.

**Q: I want everything pre-installed, disk space is no issue**
> A: Choose **MacTeX-No-GUI** (2 GB). No surprises about missing packages.

**Q: I have limited internet bandwidth**
> A: Choose **TinyTeX** (50 MB) or **BasicTeX** (400 MB). Avoid MacTeX-No-GUI.

**Q: I have fast internet but limited disk space**
> A: Choose **TinyTeX** (50 MB) and let packages auto-install.

**Q: I'm in academia and want to be safe**
> A: Choose **MacTeX-No-GUI** (2 GB). Peace of mind > disk space.

---

## Technical Details

### How BasicTeX Auto-Install Works
```
pdflatex finds missing package
      ↓
tlmgr (TeX package manager) detects it
      ↓
Auto-downloads from CTAN (package repository)
      ↓
Installs in background
      ↓
Compilation retries
      ↓
✓ Success
```

### Why MacTeX-No-GUI is Bigger
```
BasicTeX:     ~400 MB
  + Most common packages
  + Basic fonts
  
MacTeX-No-GUI: ~2000 MB (5x larger)
  + BasicTeX (400 MB)
  + Every possible package from CTAN
  + Extensive font collections
  + All optional add-ons
  + Everything "just in case"
```

### TinyTeX Magic
```
TinyTeX:      ~50 MB
  + Minimal core
  + Shell scripts for installing packages
  
As you compile documents:
  → Package needed?
  → tlmgr downloads it
  → System caches it
  → Next time: already there
  
Final size: 500 MB - 1 GB (after real usage)
```

---

## Summary

✅ **Three options to choose from:**
- **BasicTeX** (400 MB) - Recommended ⭐
- **MacTeX-No-GUI** (2 GB) - Full suite
- **TinyTeX** (50 MB) - Minimal

✅ **Clear information in dialog:**
- Size comparison
- Installation time
- Feature descriptions
- Recommended option highlighted

✅ **Easy decision:**
- Most users: Pick default (BasicTeX)
- Power users: Pick full (MacTeX-No-GUI)
- Minimalists: Pick tiny (TinyTeX)

**Result:** Users get exactly what they need! 🎯
