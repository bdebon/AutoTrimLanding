#!/usr/bin/env node
// The files of one multicam take, reduced to what a capsule draws: kind, length, offset on the
// group's clock, and a loudness envelope (10 values a second; null for a camera with no sound).
//
//   node scripts/analyze-multicam.mjs <folder> --take take1 --out src/data/multicam.json \
//        cam_wide.mp4 cam_julie.mp4 cam_marc_C0001.mp4 cam_marc_C0002.mp4 mic_marc.wav mic_julie.wav
//
// Offsets come from the folder's truth.json (scripts/multicam-fixtures/make_fixtures.py),
// the same ground truth the app's sync tests check against.
import { execFileSync, spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  if (i < 0) return fallback;
  const value = args[i + 1];
  args.splice(i, 2);
  return value;
};
const out = opt("out", "multicam.json");
const take = opt("take", "take1");
const [folder, ...names] = args;
const truthFile = JSON.parse(readFileSync(join(folder, "truth.json"), "utf8"));
const truth = truthFile[take];
const PER_SECOND = 10;

const files = names.map((name) => {
  const path = join(folder, name);
  const duration = Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path]).toString());
  const hasAudio = !(truth.no_audio ?? []).includes(name);
  let envelope = null;
  if (hasAudio) {
    const run = spawnSync("ffmpeg", ["-v", "error", "-i", path, "-vn", "-ac", "1", "-ar", "8000", "-f", "f32le", "-"], { maxBuffer: 2 ** 30 });
    const raw = run.stdout;
    const samples = new Float32Array(raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength));
    const hop = 8000 / PER_SECOND;
    const rms = [];
    for (let i = 0; i + hop <= samples.length; i += hop) {
      let sum = 0;
      for (let j = i; j < i + hop; j++) sum += samples[j] * samples[j];
      rms.push(Math.sqrt(sum / hop));
    }
    const peak = Math.max(...rms);
    envelope = rms.map((v) => Math.round(Math.max(0, 1 + (20 * Math.log10(Math.max(v, 1e-9) / peak)) / 45) * 99));
  }
  return {
    name,
    kind: /\.(wav|mp3|m4a|aac|flac)$/i.test(name) ? "mic" : "camera",
    duration: Math.round(duration * 1000) / 1000,
    offset: truth.offsets_s[name] ?? 0,
    hasAudio,
    envelope,
  };
});

// Who speaks when, on the reference clock: the montage and the cuts of the timeline
const speech = Object.fromEntries(Object.entries(truth.speech ?? {}).map(([who, lines]) => [who, lines.map(([s, e, text]) => ({ start: s, end: e, text }))]));
writeFileSync(out, JSON.stringify({ take, reference: truth.reference, frameRate: truthFile.frame_rate ?? truth.frame_rate, files, speech }) + "\n");
console.log(files.map((f) => `${f.name} ${f.kind} ${f.duration}s @${f.offset}s${f.hasAudio ? "" : " (no audio)"}`).join("\n"));
