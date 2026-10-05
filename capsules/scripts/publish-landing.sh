#!/bin/bash
# Turns the renders of capsules/out/ into what the landing plays from public/capsules/:
# a web MP4 (H.264, crf 21, faststart) and a WebP poster per capsule and language. No WebM:
# on this flat, dark footage VP9 came out larger than the H.264 file, so the landing plays MP4. Usage: scripts/publish-landing.sh [name…] (default: every capsule).
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=../public/capsules
mkdir -p "$OUT"
# landing name → render id (lowercase composition id) → poster second
SPECS=(
  "hero:hero:12"
  "euh:euh:3.3"
  "multicam-drop:multicamdrop:5.2"
  "multicam-mic:multicammic:3.3"
  "multicam-follow:multicamfollow:2.2"
  "timeline:timeline:5.2"
  "video:video:2.7"
  "preview:preview:5.5"
  "local:local:3.0"
)
wanted=("$@")
for spec in "${SPECS[@]}"; do
  IFS=: read -r name id at <<<"$spec"
  if [ ${#wanted[@]} -gt 0 ] && [[ ! " ${wanted[*]} " =~ " $name " ]]; then continue; fi
  for lang in fr en; do
    src="out/$id-$lang.mp4"
    [ -f "$src" ] || { echo "skip $name-$lang (no $src)"; continue; }
    ffmpeg -v error -y -i "$src" -c:v libx264 -preset slow -crf 21 -pix_fmt yuv420p -movflags +faststart -an "$OUT/$name-$lang.mp4"
    # The poster: a frame as PNG, then WebP through sharp (this ffmpeg has no libwebp)
    ffmpeg -v error -y -ss "$at" -i "$src" -frames:v 1 "out/$id-$lang.poster.png"
    node -e 'require("../node_modules/sharp")(process.argv[1]).resize(1280,720).webp({quality:82}).toFile(process.argv[2]).then(()=>{})' "out/$id-$lang.poster.png" "$OUT/$name-$lang.webp"
    rm -f "out/$id-$lang.poster.png"
    echo "$name-$lang  mp4 $(stat -f %z "$OUT/$name-$lang.mp4")B"
  done
done
