#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

cd "$ROOT_DIR"

python3 -m venv .piper-venv
.piper-venv/bin/python -m pip install --upgrade pip piper-tts
mkdir -p models/piper
.piper-venv/bin/python -m piper.download_voices --download-dir models/piper fr_FR-siwis-medium

echo "Piper setup complete."
echo "Next: node scripts/generate_piper_audio.mjs"
