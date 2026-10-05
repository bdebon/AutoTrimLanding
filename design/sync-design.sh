#!/usr/bin/env bash
# Re-copies the design source of truth from the AutoTrim app repo into ./design/.
# The app is the source of truth; never edit design/tokens.css or design/HANDOFF.md by hand.
#
#   ./design/sync-design.sh                 # app repo next to this one (../AutoTrim)
#   AUTOTRIM_REPO=/path/to/AutoTrim ./design/sync-design.sh
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP="${AUTOTRIM_REPO:-$(cd "$HERE/../.." && pwd)/AutoTrim}"
TOKENS="$APP/frontend/src/styles/tokens.css"
HANDOFF="$APP/design/redesign-2026-09/HANDOFF.md"

[ -f "$TOKENS" ]  || { echo "tokens.css not found at $TOKENS (set AUTOTRIM_REPO)"; exit 1; }
[ -f "$HANDOFF" ] || { echo "HANDOFF.md not found at $HANDOFF (set AUTOTRIM_REPO)"; exit 1; }

cp "$TOKENS" "$HERE/tokens.css"
{
  echo "<!-- Copy of AutoTrim/design/redesign-2026-09/HANDOFF.md, synced by design/sync-design.sh on $(date +%Y-%m-%d). Do not edit here. -->"
  echo
  cat "$HANDOFF"
} > "$HERE/HANDOFF.md"

echo "synced from $APP"
echo "  tokens.css  <- frontend/src/styles/tokens.css"
echo "  HANDOFF.md  <- design/redesign-2026-09/HANDOFF.md"
echo "artboards (not copied, read them in place):"
ls "$APP/design/redesign-2026-09/artboards" | sed 's/^/  /'
