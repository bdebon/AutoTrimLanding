/**
 * The app's waveform, drawn in SVG for the capsule placeholders.
 *
 * Rules kept from the app (design/HANDOFF.md): kept vs removed is carried by the
 * BAND behind the bars, never by the bars; a removed band is lighter than the well
 * and hatched, both at once; one hatch per band; bars are 4 px with a 3 px gutter;
 * a hesitation is a removed band told apart by an ivory marker above it.
 */

type Zone = { from: number; to: number; kind: "silence" | "hesitation" };

function rng(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return () => {
    h += h << 13; h ^= h >>> 7; h += h << 3; h ^= h >>> 17; h += h << 5;
    return ((h >>> 0) % 10000) / 10000;
  };
}

export default function WaveBands({
  seed,
  width = 800,
  height = 160,
  bars = 96,
  className = "",
}: {
  seed: string;
  width?: number;
  height?: number;
  bars?: number;
  className?: string;
}) {
  const rand = rng(seed);
  const pad = 24;
  const barW = 4;
  const gutter = 3;
  const pitch = barW + gutter;
  const usable = width - pad * 2;
  const count = Math.min(bars, Math.floor(usable / pitch));
  const left = pad + (usable - count * pitch + gutter) / 2;
  const mid = height / 2;
  const wellH = height - 24;
  const hatchId = `hatch-${seed.replace(/[^a-z0-9]/gi, "")}`;

  // Two or three silences and one hesitation, as fractions of the bar count.
  const zones: Zone[] = [];
  let cursor = 0.08 + rand() * 0.1;
  const n = 2 + Math.round(rand());
  for (let i = 0; i < n; i++) {
    const len = 0.06 + rand() * 0.08;
    zones.push({ from: cursor, to: Math.min(0.96, cursor + len), kind: "silence" });
    cursor += len + 0.16 + rand() * 0.14;
    if (cursor > 0.9) break;
  }
  const hFrom = 0.55 + rand() * 0.2;
  const inSilence = zones.some((z) => hFrom < z.to && hFrom + 0.05 > z.from);
  if (!inSilence) zones.push({ from: hFrom, to: hFrom + 0.045, kind: "hesitation" });

  const zoneAt = (i: number) => {
    const f = i / count;
    return zones.find((z) => f >= z.from && f < z.to) ?? null;
  };

  // A speech-like envelope: a few slow waves plus noise, quiet in the silences.
  const heights: number[] = [];
  const phase = rand() * 6;
  for (let i = 0; i < count; i++) {
    const t = i / count;
    const env = 0.45 + 0.35 * Math.sin(t * 19 + phase) * Math.sin(t * 7 + 1.3) + 0.2 * Math.sin(t * 43 + phase * 2);
    const noise = 0.75 + rand() * 0.5;
    const z = zoneAt(i);
    const h = z?.kind === "silence" ? 0.05 + rand() * 0.06 : z ? Math.max(0.3, env) : Math.max(0.08, env * noise);
    heights.push(Math.min(1, h));
  }

  const maxBar = wellH - 28;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern id={hatchId} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="6" height="6" fill="var(--at-wave-cut-band)" />
          <rect width="2" height="6" fill="var(--at-wave-cut-hatch)" />
        </pattern>
      </defs>

      {/* The well, then the kept band over its whole width */}
      <rect x={pad - 8} y={mid - wellH / 2} width={usable + 16} height={wellH} rx="9" fill="var(--at-wave-well)" />
      <rect x={pad - 8} y={mid - wellH / 2} width={usable + 16} height={wellH} rx="9" fill="var(--at-wave-kept-band)" />

      {/* Removed bands: lighter and hatched, one pattern per band */}
      {zones.map((z, i) => {
        const x = left + Math.round(z.from * count) * pitch - gutter / 2;
        const w = Math.max(3, (Math.round(z.to * count) - Math.round(z.from * count)) * pitch);
        return (
          <g key={i}>
            <rect x={x} y={mid - wellH / 2} width={w} height={wellH} fill={`url(#${hatchId})`} />
            {z.kind === "hesitation" && (
              <rect x={x} y={mid - wellH / 2 - 10} width={w} height="5" rx="2.5" fill="var(--at-ivory)" />
            )}
          </g>
        );
      })}

      {/* Bars on top of the bands: accent when kept, noise floor when removed */}
      {heights.map((h, i) => {
        const z = zoneAt(i);
        const bh = Math.max(3, h * maxBar);
        return (
          <rect
            key={i}
            x={left + i * pitch}
            y={mid - bh / 2}
            width={barW}
            height={bh}
            rx="2"
            fill={z ? "var(--at-wave-cut-bar)" : "var(--at-accent)"}
          />
        );
      })}
    </svg>
  );
}
