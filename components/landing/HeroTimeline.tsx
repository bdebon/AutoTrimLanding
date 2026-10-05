"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight, Check, RotateCcw, Scissors } from "lucide-react";
import type { CSSProperties } from "react";
import { PulseTile } from "./Logo";

// An illustrative excerpt, not a waveform reconstructed from the measured hour.
const segments = [
  { type: "voice", width: 15, seed: 3 },
  { type: "silence", width: 10, seed: 0 },
  { type: "voice", width: 12, seed: 7 },
  { type: "hesitation", width: 6, seed: 8 },
  { type: "voice", width: 14, seed: 11 },
  { type: "silence", width: 14, seed: 0 },
  { type: "voice", width: 12, seed: 19 },
  { type: "hesitation", width: 4, seed: 2 },
  { type: "voice", width: 13, seed: 23 },
];

function Wave({ seed, quiet = false }: { seed: number; quiet?: boolean }) {
  return <svg viewBox="0 0 120 100" preserveAspectRatio="none" aria-hidden="true">
    {Array.from({ length: 25 }, (_, i) => {
      const height = quiet ? 2 : Math.round(9 + Math.abs(Math.sin(i * 1.73 + seed) * Math.cos(i * 0.31 + seed)) * 78);
      return <rect key={i} x={i * 4.8 + 1} y={(100 - height) / 2} width="2.6" height={height} rx="1.3" />;
    })}
  </svg>;
}

export default function HeroTimeline() {
  const t = useTranslations("landing.hero");
  const [phase, setPhase] = useState(3);
  const [run, setRun] = useState(0);
  const [playing, setPlaying] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) return;
    setPhase(0);
    setPlaying(false);
    const timers: ReturnType<typeof setTimeout>[] = [];
    // Start only when the waveform can actually be seen, especially on phones.
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || motion.matches) return;
      observer.disconnect();
      setPlaying(true);
      timers.push(
        setTimeout(() => setPhase(1), 1400),
        setTimeout(() => setPhase(2), 2400),
        setTimeout(() => setPhase(3), 3400),
      );
    }, { threshold: 0.65 });
    if (trackRef.current) observer.observe(trackRef.current);
    const settle = () => {
      if (motion.matches) { timers.forEach(clearTimeout); observer.disconnect(); setPhase(3); }
    };
    motion.addEventListener("change", settle);
    return () => { timers.forEach(clearTimeout); observer.disconnect(); motion.removeEventListener("change", settle); };
  }, [run]);

  const replay = () => { if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) setRun(n => n + 1); };
  const labels = [t("demo.raw"), t("demo.silences"), t("demo.hesitations"), t("demo.done")];

  return (
    <div className="hero-editor" data-phase={phase} data-playing={playing}>
      <div className="hero-editor-top">
        <div className="hero-editor-brand"><PulseTile /><span>AutoTrim<span className="hero-editor-subtitle">{t("demo.label")}</span></span></div>
        <button type="button" onClick={replay} className="hero-replay" disabled={phase !== 3}><RotateCcw size={14} aria-hidden="true" />{t("demo.replay")}</button>
      </div>
      <div className="hero-editor-content">
        <div className="hero-story-heading">
          <div><span className="hero-story-kicker">{t("demo.kicker")}</span><p className="font-display" aria-live="polite" aria-atomic="true">{labels[phase]}</p></div>
          <span className="hero-step-count font-display">0{phase === 0 ? 1 : phase === 1 ? 2 : 3}<span> / 03</span></span>
        </div>
        <div className="hero-ruler" aria-hidden="true"><span>00:00</span><span>00:15</span><span>00:30</span><span>00:45</span><span>01:00</span></div>
        <div ref={trackRef} className="hero-track" aria-hidden="true">
          <div className="hero-track-segments">
            {segments.map((segment, i) => <div key={i} className={`hero-segment hero-segment-${segment.type}`} style={{ "--segment-width": `${segment.width}%` } as CSSProperties}>
              <div className="hero-segment-inner">
                {segment.type !== "voice" && <span className="hero-cut-label">{segment.type === "silence" ? t("demo.silence") : t("demo.um")}</span>}
                <Wave seed={segment.seed} quiet={segment.type === "silence"} />
              </div>
            </div>)}
          </div>
          <div key={run} className="hero-playhead"><Scissors size={14} /></div>
          <div className="hero-track-end"><Check size={19} /></div>
        </div>
        <div className="hero-track-caption"><span><i />{t("demo.kept")}</span><span><i className="hero-legend-cut" />{t("demo.removed")}</span><span className="hero-illustration-note">{t("demo.illustration")}</span></div>
      </div>
      <div className="hero-editor-result">
        <div><span className="hero-result-label">{t("proof.note")}</span><p className="hero-result-time font-display"><span>{t("proof.before")}</span><ArrowRight size={20} aria-hidden="true" /><strong>{t("proof.after")}</strong></p></div>
        <div className="hero-result-proof"><strong className="font-display">{t("proof.shorter")}</strong><span>{t("proof.cuts")}</span></div>
        <div className="hero-result-message"><span><Check size={15} aria-hidden="true" />{t("demo.ready")}</span><small>{t("ownership")}</small></div>
      </div>
    </div>
  );
}
