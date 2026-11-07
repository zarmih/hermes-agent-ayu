#!/usr/bin/env bash
set -euo pipefail

# ─────────────────────────────────────────────────────────────────────────────
# Hermes Agent — Ayu Theme & Syntax Highlighting Installer
# ─────────────────────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HERMES_HOME="${HERMES_HOME:-$HOME/.hermes}"
HERMES_REPO="${HERMES_REPO:-$HERMES_HOME/hermes-agent}"
CONFIG_FILE="$HERMES_HOME/config.yaml"
SKINS_DIR="$HERMES_HOME/skins"
THEME_SOURCE="$SCRIPT_DIR/skins/ayu-hermes.yaml"
PATCH_FILE="$SCRIPT_DIR/patches/ayu-syntax-highlighting.patch"

echo "=== Installing Ayu Hermes Theme & Syntax Highlighting ==="

# 1. Install skin file
mkdir -p "$SKINS_DIR"
cp "$THEME_SOURCE" "$SKINS_DIR/ayu-hermes.yaml"
echo "✓ Installed skin to $SKINS_DIR/ayu-hermes.yaml"

# 2. Check and patch hermes-agent checkout if present
if [[ -d "$HERMES_REPO" ]]; then
  echo "Checking Hermes Agent repository at $HERMES_REPO..."
  cd "$HERMES_REPO"

  # Check if patch is already applied
  if git apply --reverse --check "$PATCH_FILE" >/dev/null 2>&1; then
    echo "✓ Syntax highlighting patch is already applied."
  else
    echo "Applying syntax highlighting patch..."
    if git apply --check "$PATCH_FILE" >/dev/null 2>&1; then
      git apply "$PATCH_FILE"
      echo "✓ Patch applied cleanly."
    else
      echo "⚠ Notice: Patch check failed (possibly already partially applied). Checking git status..."
      git status -s
    fi
  fi

  # 3. Build TUI bundle
  if [[ -d "$HERMES_REPO/ui-tui" ]]; then
    echo "Rebuilding Hermes TUI bundle..."
    (cd "$HERMES_REPO/ui-tui" && npm run build)
    echo "✓ TUI bundle rebuilt (ui-tui/dist/entry.js)."
  fi
else
  echo "ℹ Hermes checkout directory ($HERMES_REPO) not found; skipping source patch."
fi

# 4. Activate in ~/.hermes/config.yaml
if [[ -f "$CONFIG_FILE" ]]; then
  if grep -q "skin: ayu-hermes" "$CONFIG_FILE"; then
    echo "✓ Config already set to skin: ayu-hermes"
  else
    echo "Updating skin in $CONFIG_FILE..."
    # Make backup
    cp "$CONFIG_FILE" "$CONFIG_FILE.bak-$(date +%s)"
    sed -i '' -e 's/^[[:space:]]*skin:[[:space:]].*/  skin: ayu-hermes/' "$CONFIG_FILE" || \
    sed -i -e 's/^[[:space:]]*skin:[[:space:]].*/  skin: ayu-hermes/' "$CONFIG_FILE"
    echo "✓ Activated skin: ayu-hermes in config.yaml"
  fi
fi

# 5. Restart gateway daemon if running
if command -v hermes >/dev/null 2>&1; then
  echo "Restarting Hermes gateway service..."
  hermes gateway restart 2>&1 || true
  echo "✓ Gateway restart requested."
fi

echo ""
echo "=== Installation complete! ==="
echo "Launch Hermes with: hermes"
