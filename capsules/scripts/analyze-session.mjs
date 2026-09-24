#!/usr/bin/env node
// A whole shoot, analysed the way AutoTrim v2 does it, reduced to what a capsule draws.
//
//   node scripts/analyze-session.mjs --out src/data/session.json \
//        [--transcripts .cache/transcripts] [--label "Tournage · 5 sept"] file1.mp4 file2.mp4 …
//
// Per file, a port of backend-rust (read it there if this ever disagrees):
//   1. auto_threshold.rs: 30 s from the middle, 100 Hz high-pass + 6 kHz low-pass (Butterworth
//      biquads), 25 ms frames every 10 ms, energy percentiles, the aggressiveness rule (0.65).
//   2. silence_detector.rs: ffmpeg silencedetect at that threshold, d = min silence (0.5 s),
//      speech = the gaps, padded (0.05 s before, 0.15 s after), merged, < 0.3 s dropped.
//   3. ai/mod.rs subtract_intervals: CrisperWhisper's [UH]/[UM] intervals (see
//      scripts/transcribe-session.py) cut out of the speech, with the app's safety rule.
// Defaults are the app's (frontend/src/App.tsx defaultSettings = the "vlog" preset).
// Stats are the app's recap cards (frontend/src/components/ProcessingQueue.tsx).
// Only numbers and a few words of transcript land in the output, never audio.
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { basename, join } from "node:path";

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  if (i < 0) return fallback;
  const value = args[i + 1];
  args.splice(i, 2);
  return value;
};
const out = opt("out", "session.json");
const transcripts = opt("transcripts");
const label = opt("label", "");
const files = args;
if (!files.length) {
  console.error("usage: analyze-session.mjs --out file.json [--transcripts dir] [--label text] files…");
  process.exit(1);
}

const SETTINGS = { aggressiveness: 0.65, minSilence: 0.5, paddingBefore: 0.05, paddingAfter: 0.15, minSpeech: 0.3 };
const ENVELOPE_PER_SECOND = 20;

// The app's own ffmpeg when installed, so silencedetect behaves identically
const appFfmpeg = join(homedir(), "Library/Application Support/AutoTrim/ffmpeg");
const FFMPEG = existsSync(join(appFfmpeg, "ffmpeg")) ? join(appFfmpeg, "ffmpeg") : "ffmpeg";
const FFPROBE = existsSync(join(appFfmpeg, "ffprobe")) ? join(appFfmpeg, "ffprobe") : "ffprobe";

const duration = (file) =>
  Number(execFileSync(FFPROBE, ["-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", file]).toString().trim());

const pcm = (file, from, length, rate) => {
  const a = ["-v", "error", "-threads", "0"];
  if (from !== undefined) a.push("-ss", String(from));
  a.push("-i", file);
  if (length !== undefined) a.push("-t", String(length));
  a.push("-vn", "-sn", "-dn", "-ac", "1", "-ar", String(rate), "-f", "f32le", "-");
  const raw = execFileSync(FFMPEG, a, { maxBuffer: 2 ** 31 });
  return new Float32Array(raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength));
};

// ---- 1. auto_threshold.rs -------------------------------------------------------------
function biquad(kind, fs, f0, q) {
  // RBJ cookbook, as the `biquad` crate computes them; Direct Form 2 Transposed
  const w0 = (2 * Math.PI * f0) / fs;
  const cos = Math.cos(w0);
  const alpha = Math.sin(w0) / (2 * q);
  const a0 = 1 + alpha;
  const [b0, b1, b2] = kind === "hp" ? [(1 + cos) / 2, -(1 + cos), (1 + cos) / 2] : [(1 - cos) / 2, 1 - cos, (1 - cos) / 2];
  const c = { b0: b0 / a0, b1: b1 / a0, b2: b2 / a0, a1: (-2 * cos) / a0, a2: (1 - alpha) / a0 };
  let s1 = 0;
  let s2 = 0;
  return (x) => {
    const y = c.b0 * x + s1;
    s1 = c.b1 * x - c.a1 * y + s2;
    s2 = c.b2 * x - c.a2 * y;
    return y;
  };
}

function autoThreshold(file, total) {
  const a = SETTINGS.aggressiveness;
  const rate = 16000;
  const sampleLength = Math.min(30, total);
  const samples = pcm(file, Math.max(0, (total - sampleLength) / 2), sampleLength, rate);
  const hp = biquad("hp", rate, 100, 0.707);
  const lp = biquad("lp", rate, 6000, 0.707);
  const filtered = samples.map((x) => lp(hp(x)));
  const size = Math.floor(0.025 * rate);
  const hop = Math.floor(0.01 * rate);
  const energies = [];
  for (let pos = 0; pos + size <= filtered.length; pos += hop) {
    let sum = 0;
    for (let i = pos; i < pos + size; i++) sum += filtered[i] * filtered[i];
    energies.push(20 * Math.log10(Math.max(Math.sqrt(sum / size), 1e-10)));
  }
  const sorted = [...energies].sort((x, y) => x - y);
  const at = (p) => sorted[Math.floor(sorted.length * p)];
  const noise = at(0.05);
  const median = at(0.5);
  const p75 = at(0.75);
  const speech = at(0.95);
  const range = speech - noise;
  const concentration = (p75 - median) / (speech - noise);
  const baseFactor = 0.4 + a * 0.5;
  if (range < 15) return Math.min(noise + range * Math.min(baseFactor + 0.1, 0.95), -35 + a * 20);
  if (range > 40) {
    let t;
    if (concentration > 0.15) {
      if (a < 0.3) t = median;
      else if (a < 0.7) t = median + (p75 - median) * ((a - 0.3) / 0.4);
      else t = p75 - (1 - a) * 5;
    } else t = median + (p75 - median) * baseFactor;
    return Math.min(Math.max(t, -40 + a * 20), -15 + a * 10);
  }
  return Math.min(Math.max(noise + range * baseFactor, -35 + a * 17), -20 + a * 12);
}

// ---- 2. silence_detector.rs -----------------------------------------------------------
function silences(file, threshold) {
  const run = spawnSync(FFMPEG, ["-threads", "0", "-i", file, "-vn", "-sn", "-dn", "-ar", "16000", "-ac", "1",
    "-af", `silencedetect=noise=${threshold}dB:d=${SETTINGS.minSilence}`, "-f", "null", "-"], { encoding: "utf8", maxBuffer: 2 ** 28 });
  if (run.status !== 0 && run.status !== 1) throw new Error(`ffmpeg silencedetect failed on ${file}: ${run.stderr.slice(-400)}`);
  const log = run.stderr;
  const found = [];
  let start = null;
  for (const line of log.split("\n")) {
    const s = line.match(/silence_start: (-?[\d.]+)/);
    if (s) start = Number(s[1]);
    const e = line.match(/silence_end: ([\d.]+)/);
    if (e && start !== null) {
      found.push([Math.max(0, start), Number(e[1])]);
      start = null;
    }
  }
  return found;
}

function speechSegments(silence, total) {
  if (!silence.length) return [[0, total]];
  const segments = [];
  let current = 0;
  for (const [start, end] of silence) {
    if (start > current) segments.push([Math.max(0, current - SETTINGS.paddingBefore), start + SETTINGS.paddingAfter]);
    current = end;
  }
  if (current < total) segments.push([Math.max(0, current - SETTINGS.paddingBefore), total]);
  segments.sort((a, b) => a[0] - b[0]);
  const merged = [segments[0].slice()];
  for (const seg of segments.slice(1)) {
    const last = merged[merged.length - 1];
    if (seg[0] <= last[1]) last[1] = Math.max(last[1], seg[1]);
    else merged.push(seg.slice());
  }
  return merged.filter(([s, e]) => e - s >= SETTINGS.minSpeech);
}

// ---- 3. ai/mod.rs subtract_intervals ------------------------------------------------------
function subtract(segments, removals, minLen) {
  const rs = removals.map((r) => r.slice()).sort((a, b) => a[0] - b[0]);
  const merged = [];
  for (const [s, e] of rs) {
    if (!merged.length || s > merged[merged.length - 1][1]) merged.push([s, e]);
    else merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], e);
  }
  const outSegs = [];
  for (const [segStart, segEnd] of segments) {
    let cursor = segStart;
    for (const [rStart, rEnd] of merged) {
      if (rEnd <= segStart || rStart >= segEnd) continue;
      const removalStart = Math.max(rStart, segStart);
      const removalEnd = Math.min(rEnd, segEnd);
      if (removalStart > cursor) {
        // The app's safety rule: under 1 s from the end of a segment longer than 3 s, keep it whole
        if (segEnd - removalStart < 1 && removalStart - segStart > 3) {
          outSegs.push([segStart, segEnd]);
          cursor = segEnd;
          continue;
        }
        if (removalStart - cursor >= minLen) outSegs.push([cursor, removalStart]);
      }
      cursor = Math.max(removalEnd, cursor);
      if (cursor >= segEnd) break;
    }
    if (cursor < segEnd && segEnd - cursor >= minLen) outSegs.push([cursor, segEnd]);
  }
  if (!outSegs.length) return outSegs;
  outSegs.sort((a, b) => a[0] - b[0]);
  const joined = [outSegs[0].slice()];
  for (const seg of outSegs.slice(1)) {
    const last = joined[joined.length - 1];
    if (seg[0] - last[1] <= 0.05) last[1] = Math.max(last[1], seg[1]);
    else joined.push(seg.slice());
  }
  return joined;
}

const overlap = (a, b) => Math.max(0, Math.min(a[1], b[1]) - Math.max(a[0], b[0]));
const length = (segs) => segs.reduce((sum, [s, e]) => sum + (e - s), 0);
const round = (x) => Math.round(x * 1000) / 1000;

// ---- Session -------------------------------------------------------------------------------
const analysed = [];
for (const file of files) {
  const total = duration(file);
  const threshold = autoThreshold(file, total);
  const speech = speechSegments(silences(file, threshold), total);

  let hesitations = [];
  const transcriptPath = transcripts && join(transcripts, `${basename(file).replace(/\.[^.]+$/, "")}.json`);
  if (transcriptPath && existsSync(transcriptPath)) {
    const transcript = JSON.parse(readFileSync(transcriptPath, "utf8"));
    const words = transcript.words.filter((w) => w.start != null && w.end != null);
    hesitations = transcript.filler_intervals.map((f) => {
      // A few real words around it, for the transcript line of the capsule
      const before = words.filter((w) => w.end <= f.start + 0.01 && w.kind === "word").slice(-5).map((w) => w.word.trim());
      const after = words.filter((w) => w.start >= f.end - 0.01 && w.kind === "word").slice(0, 5).map((w) => w.word.trim());
      return { start: f.start, end: f.end, before: before.join(" "), after: after.join(" ") };
    });
  }
  const kept = subtract(speech, hesitations.map((h) => [h.start, h.end]), SETTINGS.minSpeech);
  // A hesitation counts when it actually took something out of the speech
  const applied = hesitations.filter((h) => speech.some((s) => overlap(s, [h.start, h.end]) > 0) && !kept.some((k) => overlap(k, [h.start, h.end]) > 0.02));

  // Envelope at 20 values a second, normalised over the whole session afterwards
  const samples = pcm(file, undefined, undefined, 16000);
  const hop = 16000 / ENVELOPE_PER_SECOND;
  const rms = [];
  for (let i = 0; i + hop <= samples.length; i += hop) {
    let sum = 0;
    for (let j = i; j < i + hop; j++) sum += samples[j] * samples[j];
    rms.push(Math.sqrt(sum / hop));
  }
  analysed.push({ file, total, threshold, speech, kept, hesitations: applied, rms });
  console.log(`${basename(file)}: ${total.toFixed(1)} s, threshold ${threshold.toFixed(1)} dB, ` +
    `after silences ${length(speech).toFixed(1)} s, kept ${length(kept).toFixed(1)} s, ${applied.length}/${hesitations.length} hesitations, ${Math.max(0, kept.length - 1)} cuts`);
}

const allDb = analysed.flatMap((f) => f.rms.map((v) => 20 * Math.log10(Math.max(v, 1e-9)))).sort((a, b) => a - b);
const peakDb = allDb[Math.floor(allDb.length * 0.999)];
const floorDb = allDb[Math.floor(allDb.length * 0.08)] + 3;
const level = (v) => {
  const db = 20 * Math.log10(Math.max(v, 1e-9));
  return Math.round(Math.min(1, Math.max(0, (db - floorDb) / (peakDb - floorDb))) * 99);
};

const source = analysed.reduce((sum, f) => sum + f.total, 0);
const afterSilences = analysed.reduce((sum, f) => sum + length(f.speech), 0);
const final = analysed.reduce((sum, f) => sum + length(f.kept), 0);
const result = {
  label,
  settings: SETTINGS,
  hesitationModel: "CrisperWhisper 2.0 small (transformers, CPU)",
  envelopePerSecond: ENVELOPE_PER_SECOND,
  totals: {
    files: analysed.length,
    source: round(source),
    afterSilences: round(afterSilences),
    final: round(final),
    removed: round(source - final),
    silenceRemoved: round(source - afterSilences),
    hesitationRemoved: round(afterSilences - final),
    hesitations: analysed.reduce((n, f) => n + f.hesitations.length, 0),
    // The recap cards of the app
    shorterPercent: Math.round(((source - final) / source) * 100),
    cuts: analysed.reduce((n, f) => n + Math.max(0, f.kept.length - 1), 0),
    editingSaved: round(analysed.reduce((sum, f) => sum + Math.max(0, f.total * 1.61 - 25), 0)),
  },
  files: analysed.map((f) => ({
    name: basename(f.file),
    duration: round(f.total),
    thresholdDb: Math.round(f.threshold * 10) / 10,
    speech: f.speech.map(([s, e]) => [round(s), round(e)]),
    kept: f.kept.map(([s, e]) => [round(s), round(e)]),
    hesitations: f.hesitations.map((h) => ({ ...h, start: round(h.start), end: round(h.end) })),
    envelope: f.rms.map(level),
  })),
};
writeFileSync(out, JSON.stringify(result) + "\n");
console.log(JSON.stringify(result.totals, null, 2));
