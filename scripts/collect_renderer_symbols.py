#!/usr/bin/env python3
import re,sys,subprocess
from pathlib import Path
root=Path('src/renderer')
pattern=re.compile(r"^(?:export\s+)?(?:async\s+)?function\s+([A-Za-z0-9_$]+)\s*\(|^const\s+([A-Za-z0-9_$]+)\s*=|^let\s+([A-Za-z0-9_$]+)\s*=|^var\s+([A-Za-z0-9_$]+)\s*=", re.M)

symbols={}
for p in root.rglob('*.js'):
    try:
        text=p.read_text(encoding='utf-8')
    except Exception:
        continue
    for m in pattern.finditer(text):
        name = next((g for g in m.groups() if g),None)
        if name:
            symbols.setdefault(name,[]).append(f"{p}:{text[:m.start()].count('\n')+1}")

# Now count occurrences across JS/MJS files in the repo by scanning (safer than running grep)
all_js = list(Path('.').rglob('*.js')) + list(Path('.').rglob('*.mjs'))
out=[]
for name,locs in sorted(symbols.items(), key=lambda x:len(x[1])):
    count = 0
    pat = re.compile(r"\\b"+re.escape(name)+r"\\b")
    for f in all_js:
        try:
            txt = f.read_text(encoding='utf-8', errors='ignore')
        except Exception:
            continue
        count += len(pat.findall(txt))
    out.append((name,count,locs))

# Print TSV header
print('symbol\tcount\tdefined_at')
for name,count,locs in out:
    print(f"{name}\t{count}\t{locs[0]}")
