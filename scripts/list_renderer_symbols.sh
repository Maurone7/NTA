#!/usr/bin/env bash
set -euo pipefail
ROOT="/Users/mauro/Desktop/NoteTakingApp"
cd "$ROOT"
TMP=/tmp/nta_syms.txt
# extract top-level symbols from src/renderer
find src/renderer -type f \( -name '*.js' -o -name '*.mjs' \) -print0 \
  | xargs -0 sed -n -E \
    -e "s/^[[:space:]]*(export[[:space:]]+)?(async[[:space:]]+)?function[[:space:]]+([A-Za-z0-9_$]+).*/\3/p" \
    -e "s/^[[:space:]]*const[[:space:]]+([A-Za-z0-9_$]+).*/\1/p" \
    -e "s/^[[:space:]]*let[[:space:]]+([A-Za-z0-9_$]+).*/\1/p" \
    -e "s/^[[:space:]]*var[[:space:]]+([A-Za-z0-9_$]+).*/\1/p" \
  | sed '/^$/d' | sort -u > "$TMP"

echo "symbols found: $(wc -l < "$TMP")"
echo -e "symbol\tcount\tdefined_at"
while read -r sym; do
  count=$(grep -R --line-number --exclude-dir=node_modules --include='*.js' --include='*.mjs' -w "$sym" src 2>/dev/null || true)
  ccount=$(echo "$count" | sed '/^$/d' | wc -l)
  def=$(grep -R --line-number --exclude-dir=node_modules -n -E "^[[:space:]]*(export[[:space:]]+)?(async[[:space:]]+)?function[[:space:]]+${sym}[[:space:]]*\(|^[[:space:]]*const[[:space:]]+${sym}[[:space:]]*=|^[[:space:]]*let[[:space:]]+${sym}[[:space:]]*=|^[[:space:]]*var[[:space:]]+${sym}[[:space:]]*=" src/renderer 2>/dev/null | head -n1 || true)
  printf "%s\t%d\t%s\n" "$sym" "$ccount" "${def:-unknown}"
done < "$TMP" | sort -k2,2n -t$'\t' | sed -n '1,200p'
