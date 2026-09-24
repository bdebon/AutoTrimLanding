import React, { useId } from "react";
import { color, wave } from "../tokens";

/**
 * A long stretch of real audio as the app draws it: bars on a fixed pitch, removed zones as
 * hatched bands behind them. Drawn as a handful of SVG paths, not one node per bar, so an
 * hour-long strip stays cheap to render every frame.
 *
 * One mapping places everything, bars, bands and ticks: strip time -> x, minus what the
 * closing zones have given back. A zone closing to nothing pulls both sides together by
 * exactly its width, and the time under `anchorX` never moves.
 */
export interface WaveZone {
  /** Strip seconds. Snapped to the bar grid so bars keep their pitch once it is closed. */
  start: number;
  end: number;
  /** Share of its width still there: 1 open, 0 closed. */
  remaining: number;
  /** Band visibility 0..1: lighter ground + hatch. It pops in with a small snap. */
  band: number;
  /** Opacity of the bars standing in the zone. */
  bars?: number;
  /** Colour of a 3 px edge on top of the band (ivory for what the AI found). */
  edge?: string;
}

export interface WaveTick {
  time: number;
  opacity: number;
}

export interface LongWaveProps {
  /** Amplitude 0..1 of each bar, from strip time 0. */
  amps: ArrayLike<number>;
  secondsPerBar: number;
  zones?: WaveZone[];
  ticks?: WaveTick[];
  tickColor?: string;
  /** Strip time that sits at `anchorX`. */
  anchorTime: number;
  /**
   * Or the same, on the closed clock (strip time minus what the zones gave back). A camera
   * moving across closed zones must move on this clock: on strip time it stalls every time
   * it crosses a zone that is no longer there.
   */
  anchorClosed?: number;
  anchorX: number;
  /** Midline of the bars, in frame pixels. */
  midline: number;
  /** Height of the bands (the track), in frame pixels. */
  trackHeight: number;
  scale: number;
  frameWidth: number;
  /** Bars outside zones. */
  barColor: string;
  /** Bars inside zones. */
  cutBarColor?: string;
  /** Share of the height a loud bar takes (the app: 0.44 of the track, each way). */
  maxHalf?: number;
  /** Raises amplitudes to this power: speech sits high in dB, this keeps the syllables. */
  contrast?: number;
  /** Bars only exist left of this x (the wave being written). */
  revealX?: number;
  opacity?: number;
}

const bar = (x: number, y: number, w: number, h: number, r: number) => {
  const rr = Math.min(r, w / 2, h / 2);
  return `M${x + rr} ${y}h${w - 2 * rr}a${rr} ${rr} 0 0 1 ${rr} ${rr}v${h - 2 * rr}a${rr} ${rr} 0 0 1 ${-rr} ${rr}h${-(w - 2 * rr)}a${rr} ${rr} 0 0 1 ${-rr} ${-rr}v${-(h - 2 * rr)}a${rr} ${rr} 0 0 1 ${rr} ${-rr}z`;
};

export function waveMapping(zones: WaveZone[], secondsPerBar: number) {
  const snapped = zones
    .map((z) => ({
      ...z,
      start: Math.round(z.start / secondsPerBar) * secondsPerBar,
      end: Math.max(Math.round(z.start / secondsPerBar) + 1, Math.round(z.end / secondsPerBar)) * secondsPerBar,
    }))
    .sort((a, b) => a.start - b.start);
  /** Strip time -> time once the zones have closed as far as they have. */
  const closed = (t: number) => {
    let given = 0;
    for (const z of snapped) {
      if (t <= z.start) break;
      given += (1 - z.remaining) * (Math.min(t, z.end) - z.start);
    }
    return t - given;
  };
  const zoneAt = (t: number) => {
    for (const z of snapped) {
      if (t < z.start) return -1;
      if (t < z.end) return snapped.indexOf(z);
    }
    return -1;
  };
  return { snapped, closed, zoneAt };
}

export const LongWave: React.FC<LongWaveProps> = ({
  amps,
  secondsPerBar,
  zones = [],
  ticks = [],
  tickColor = color.ivory,
  anchorTime,
  anchorClosed,
  anchorX,
  midline,
  trackHeight,
  scale: s,
  frameWidth,
  barColor,
  cutBarColor = color.waveCutBar,
  maxHalf = wave.maxHalf,
  contrast = 2,
  revealX = Infinity,
  opacity = 1,
}) => {
  const id = useId().replace(/:/g, "");
  const pitch = wave.barPitch * s;
  const barWidth = wave.barWidth * s;
  const pps = pitch / secondsPerBar;
  const { snapped, closed, zoneAt } = waveMapping(zones, secondsPerBar);
  const origin = anchorClosed ?? closed(anchorTime);
  const xOf = (t: number) => anchorX + (closed(t) - origin) * pps;
  const half = trackHeight * maxHalf;
  const top = midline - trackHeight / 2;

  // Bars: the kept ones in one path, the ones in each zone in a path of their own (they fade)
  let kept = "";
  const inZone: string[] = snapped.map(() => "");
  // Visible bars, from what is on screen on the closed clock. Strip time is never before its
  // closed time, and at most what the zones gave back after it.
  const given = snapped.reduce((sum, z) => sum + (1 - z.remaining) * (z.end - z.start), 0);
  const closedFirst = origin - (anchorX + pitch) / pps - 1;
  const closedLast = origin + (frameWidth - anchorX + pitch) / pps + 1;
  const firstBar = Math.max(0, Math.floor(closedFirst / secondsPerBar));
  const lastBar = Math.min(amps.length - 1, Math.ceil((closedLast + given) / secondsPerBar));
  for (let i = firstBar; i <= lastBar; i++) {
    const t = (i + 0.5) * secondsPerBar;
    const x = xOf(t);
    if (x < -pitch || x > frameWidth + pitch || x > revealX) continue;
    const h = Math.max(s, Math.pow(Math.min(1, Math.max(0, amps[i])), contrast) * half);
    const path = bar(x - barWidth / 2, midline - h, barWidth, h * 2, s);
    const z = zoneAt(t);
    if (z < 0) kept += path;
    else inZone[z] += path;
  }

  const tile = wave.hatchTile * s;
  const edge = wave.edge * s;
  return (
    <svg width={frameWidth} height={trackHeight + 20 * s} style={{ position: "absolute", left: 0, top: top - 10 * s, overflow: "visible", opacity }}>
      <defs>
        <pattern id={`h-${id}`} width={tile} height={tile} patternUnits="userSpaceOnUse">
          <rect width={tile} height={tile} fill={color.waveCutBand} />
          {[-tile, 0, tile].map((shift) => (
            <line key={shift} x1={shift} y1={0} x2={shift + tile} y2={tile} stroke={color.waveCutHatch} strokeWidth={wave.hatchStroke * s} strokeLinecap="square" />
          ))}
        </pattern>
      </defs>
      <g transform={`translate(0 ${10 * s})`}>
        {/* 1. Bands, each anchored on its own centre so its hatch never slides */}
        {snapped.map((z, i) => {
          if (z.band <= 0) return null;
          const x0 = xOf(z.start);
          const x1 = xOf(z.end);
          const w = x1 - x0;
          if (w < 0.5 || x1 < 0 || x0 > frameWidth) return null;
          const pop = 0.7 + 0.3 * Math.min(1, z.band);
          return (
            <g key={i} transform={`translate(${(x0 + x1) / 2} ${trackHeight / 2})`} opacity={Math.min(1, z.band)}>
              <rect x={-w / 2} y={(-trackHeight / 2) * pop} width={w} height={trackHeight * pop} fill={`url(#h-${id})`} />
              {z.edge ? <rect x={-w / 2} y={(-trackHeight / 2) * pop} width={w} height={edge} fill={z.edge} /> : null}
            </g>
          );
        })}
        {/* 2. Bars on top */}
        <g transform={`translate(0 ${-(midline - trackHeight / 2)})`}>
          <path d={kept} fill={barColor} />
          {inZone.map((d, i) =>
            d && (snapped[i].bars ?? 1) > 0 ? <path key={i} d={d} fill={snapped[i].band > 0 ? cutBarColor : barColor} opacity={snapped[i].bars ?? 1} /> : null
          )}
        </g>
        {/* 3. Ticks above the track: where something was taken out */}
        {ticks.map((tick, i) =>
          tick.opacity > 0 ? (
            <rect key={i} x={xOf(tick.time) - 1.5 * s} y={-8 * s} width={3 * s} height={5 * s} rx={s} fill={tickColor} opacity={tick.opacity} />
          ) : null
        )}
      </g>
    </svg>
  );
};
