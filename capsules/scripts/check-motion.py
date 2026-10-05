#!/usr/bin/env python3
"""Finds judder in a rendered capsule: frames that stand still between moving frames, and
frames that move much more than their neighbours. Motion design must not have either.

    python3 scripts/check-motion.py out/hero-fr.mp4 2.9 7.5 [y height]
"""
import subprocess, sys

path, start, length = sys.argv[1], float(sys.argv[2]), float(sys.argv[3])
y = int(sys.argv[4]) if len(sys.argv) > 4 else 0
h = int(sys.argv[5]) if len(sys.argv) > 5 else 1080
W, H = 480, max(1, h // 4)
raw = subprocess.run(
    ["ffmpeg", "-v", "error", "-ss", str(start), "-t", str(length), "-i", path,
     "-vf", f"crop=1920:{h}:0:{y},format=gray,scale={W}:{H}", "-f", "rawvideo", "-"],
    capture_output=True, check=True).stdout
n = W * H
frames = [raw[i:i + n] for i in range(0, len(raw) - n + 1, n)]
diff = [sum(abs(a - b) for a, b in zip(frames[i], frames[i - 1])) / n for i in range(1, len(frames))]
times = [start + (i + 1) / 60 for i in range(len(diff))]
stalls = [round(times[k], 3) for k in range(1, len(diff) - 1) if diff[k] < 0.05 and diff[k - 1] > 1 and diff[k + 1] > 1]
spikes = [round(times[k], 3) for k in range(1, len(diff) - 1) if diff[k] > 1.5 and diff[k] > 1.8 * max(diff[k - 1], diff[k + 1])]
print(f"{path} {start}-{start + length}s: {len(stalls)} stalls {stalls}, {len(spikes)} spikes {spikes}")
