#!/usr/bin/env python3
"""Hesitations of a whole session, the way AutoTrim v2 finds them: CrisperWhisper 2.0 small,
verbatim mode, [UH]/[UM] tags with word timestamps. Runs in the bench's venv, offline, CPU:

    ../../AutoTrim/scripts/crisperwhisper-demo/.venv/bin/python scripts/transcribe-session.py \\
        --out .cache/transcripts ~/Movies/OBS/2025-09-05_*.mp4

Loads the model once, writes one JSON per file (same shape as the bench's *.verbatim.json).
Files already transcribed are skipped, so an interrupted run resumes.
"""
import argparse, json, os, subprocess, sys, tempfile, time
from pathlib import Path

# The bench lives in the app repo: next to this one (…/AutoTrim) or where AUTOTRIM_REPO points.
APP_REPO = Path(os.environ.get("AUTOTRIM_REPO", Path(__file__).resolve().parents[3] / "AutoTrim"))
BENCH = APP_REPO / "scripts" / "crisperwhisper-demo"
if not BENCH.is_dir():
    sys.exit(f"CrisperWhisper bench not found at {BENCH}; set AUTOTRIM_REPO to the AutoTrim repo")
sys.path.insert(0, str(BENCH))
import demo  # noqa: E402  (classify, merge_intervals, TAG_RE)

ap = argparse.ArgumentParser()
ap.add_argument("files", nargs="+", type=Path)
ap.add_argument("--out", type=Path, required=True)
ap.add_argument("--lang", default="fr")
ap.add_argument("--size", default="small")
args = ap.parse_args()
args.out.mkdir(parents=True, exist_ok=True)

from crisperwhisper import CrisperWhisperModel  # noqa: E402

model = None
for src in args.files:
    dst = args.out / f"{src.stem}.json"
    if dst.exists():
        print(f"skip {src.name}", flush=True)
        continue
    if model is None:
        model = CrisperWhisperModel(args.size, backend="transformers", device="cpu", compute_type="float32")
    with tempfile.TemporaryDirectory() as tmp:
        wav = Path(tmp) / "a.wav"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(src), "-vn", "-ac", "1", "-ar", "16000",
                        "-c:a", "pcm_s16le", str(wav)], check=True)
        t0 = time.perf_counter()
        result = model.transcribe(wav, language=args.lang, mode="verbatim", word_timestamps=True)
        took = time.perf_counter() - t0
    words = [{"word": w.word, "start": w.start, "end": w.end, "kind": demo.classify(w.word, args.lang)}
             for w in (result.words or [])]
    fillers = [w for w in words if w["kind"] == "filler" and w["start"] is not None and w["end"] is not None]
    dst.write_text(json.dumps({
        "source": src.name,
        "model": f"nyralabs/CrisperWhisper2.0_{args.size}",
        "audio_duration_s": result.duration,
        "filler_intervals": [{"start": round(s, 3), "end": round(e, 3), "text": t}
                             for s, e, t in demo.merge_intervals(fillers)],
        "words": words,
    }, ensure_ascii=False))
    print(f"{src.name}: {len(fillers)} hesitations, {result.duration:.0f}s audio in {took:.0f}s", flush=True)
