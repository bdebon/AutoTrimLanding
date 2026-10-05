#!/usr/bin/env node
// Turns a real recording into the data a capsule draws: a loudness envelope (100 values
// per second, 0..1) and, when given, the word timings of a transcript.
//
//   node scripts/extract-envelope.mjs <audio-or-video> --out src/data/name.json \
//        [--words transcript.json] [--from 0] [--to 12]
//
// The audio is decoded by ffmpeg (any format it reads). The transcript is the JSON the
// CrisperWhisper bench in the app repo writes (AutoTrim/scripts/crisperwhisper-demo/out/*.verbatim.json): a
// `words` array of { word, start, end, kind }. Only numbers land in the output, never
// the audio itself, so the JSON can be committed.
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { basename } from "node:path";

const args = process.argv.slice(2);
const input = args[0];
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : fallback;
};
if (!input || input.startsWith("--")) {
  console.error("usage: extract-envelope.mjs <audio> --out file.json [--words transcript.json] [--from s] [--to s]");
  process.exit(1);
}
const out = opt("out", "envelope.json");
const from = Number(opt("from", "0"));
const to = opt("to") ? Number(opt("to")) : undefined;

const RATE = 16000;
const PER_SECOND = 100;
// Silence is the room, not digital zero: the floor sits just above the recording's own
// noise (its quietest 8 % of windows), never deeper than -54 dB under the loudest window.
const DEEPEST_FLOOR_DB = -54;
const NOISE_PERCENTILE = 0.08;
const NOISE_MARGIN_DB = 3;

const ffArgs = ["-v", "error", "-ss", String(from)];
if (to !== undefined) ffArgs.push("-to", String(to));
ffArgs.push("-i", input, "-ac", "1", "-ar", String(RATE), "-f", "f32le", "-");
const raw = execFileSync("ffmpeg", ffArgs, { maxBuffer: 1 << 30 });
const samples = new Float32Array(raw.buffer, raw.byteOffset, raw.byteLength / 4);

const hop = RATE / PER_SECOND;
const rms = [];
for (let i = 0; i + hop <= samples.length; i += hop) {
  let sum = 0;
  for (let j = i; j < i + hop; j++) sum += samples[j] * samples[j];
  rms.push(Math.sqrt(sum / hop));
}
const peak = Math.max(...rms);
const toDb = (v) => 20 * Math.log10(Math.max(v, 1e-9) / peak);
const sorted = rms.map(toDb).sort((a, b) => a - b);
const floorDb = Math.max(DEEPEST_FLOOR_DB, sorted[Math.floor(sorted.length * NOISE_PERCENTILE)] + NOISE_MARGIN_DB);
const envelope = rms.map((v) => {
  const level = 1 - toDb(v) / floorDb;
  return Math.round(Math.min(1, Math.max(0, level)) * 1000) / 1000;
});

let words;
const wordsPath = opt("words");
if (wordsPath) {
  const transcript = JSON.parse(readFileSync(wordsPath, "utf8"));
  words = transcript.words
    .map((w) => ({
      text: w.word,
      start: Math.round((w.start - from) * 1000) / 1000,
      end: Math.round((w.end - from) * 1000) / 1000,
      filler: w.kind === "filler",
    }))
    .filter((w) => w.end > 0 && (to === undefined || w.start < to - from));
}

writeFileSync(
  out,
  JSON.stringify({ source: basename(input), perSecond: PER_SECOND, duration: envelope.length / PER_SECOND, words, envelope }) + "\n"
);
console.log(`${out}: ${envelope.length} values (${(envelope.length / PER_SECOND).toFixed(2)} s)${words ? `, ${words.length} words` : ""}`);
