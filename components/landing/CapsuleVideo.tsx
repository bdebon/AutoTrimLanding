"use client";

import { useEffect, useRef, useState } from "react";
import WaveBands from "./WaveBands";

export type CapsuleSource = { src: string; type: string };

type Props = {
  name: string;
  title: string;
  label: string;
  pendingLabel: string;
  playLabel: string;
  pauseLabel: string;
  sources: CapsuleSource[];
  poster: string | null;
  /** Load the poster eagerly (the hero, above the fold). */
  priority?: boolean;
  /** On phones, show the poster and a play button instead of autoplaying. */
  tapOnMobile?: boolean;
};

const frame =
  "@container relative w-full overflow-hidden rounded-card-lg border border-at-border bg-at-stage aspect-video";

/**
 * A capsule: a muted looping video that only plays while on screen.
 * Falls back to its poster under prefers-reduced-motion (a play button then
 * starts it), and to a drawn placeholder when no render exists yet.
 */
export default function CapsuleVideo({
  name,
  title,
  label,
  pendingLabel,
  playLabel,
  pauseLabel,
  sources,
  poster,
  priority = false,
  tapOnMobile = false,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [manual, setManual] = useState(false); // reduced motion or phone: play on tap only
  const [playing, setPlaying] = useState(false);
  const [inView, setInView] = useState(false);

  const hasVideo = sources.length > 0;

  useEffect(() => {
    if (!hasVideo) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const phone = tapOnMobile && window.matchMedia("(max-width: 767px)").matches;
    const update = () => setManual(mq.matches || phone);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [hasVideo, tapOnMobile]);

  useEffect(() => {
    const el = boxRef.current;
    if (!el || !hasVideo || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => setInView(entries.some((e) => e.isIntersecting)),
      { threshold: 0.2, rootMargin: "120px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasVideo]);

  // Autoplay while visible, pause when scrolled away. Never under manual mode.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !hasVideo) return;
    if (manual) {
      if (!playing) v.pause();
      return;
    }
    if (inView) {
      v.muted = true;
      v.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      v.pause();
      setPlaying(false);
    }
  }, [inView, manual, hasVideo, playing]);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.muted = true;
      v.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  if (!hasVideo) {
    return (
      <figure ref={boxRef} className={frame} data-capsule={name}>
        {poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={poster}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover"
            loading={priority ? "eager" : "lazy"}
            decoding="async"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col">
            <div className="flex items-start justify-between p-[4cqi]">
              <span className="font-ui text-[clamp(10px,1.6cqi,12px)] font-semibold uppercase tracking-[0.12em] text-at-dim">
                {label}
              </span>
              <span className="rounded-pill border border-at-border bg-at-chip px-3 py-1 font-ui text-[clamp(10px,1.6cqi,12px)] text-at-dim">
                {pendingLabel}
              </span>
            </div>
            <div className="flex flex-1 items-center px-2 sm:px-4">
              <WaveBands seed={name} />
            </div>
            <figcaption className="p-[4cqi] pt-0">
              <span className="line-clamp-2 font-display text-[clamp(15px,3.6cqi,30px)] font-bold leading-tight text-at-text">
                {title}
              </span>
            </figcaption>
          </div>
        )}
      </figure>
    );
  }

  return (
    <figure ref={boxRef} className={`${frame} group`} data-capsule={name}>
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        muted
        loop
        playsInline
        preload={priority ? "metadata" : "none"}
        poster={poster ?? undefined}
        aria-label={title}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        {sources.map((s) => (
          <source key={s.src} src={s.src} type={s.type} />
        ))}
      </video>
      {manual && (
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? pauseLabel : playLabel}
          className={`absolute inset-0 flex items-center justify-center transition-opacity ${
            playing ? "opacity-0 focus-visible:opacity-100" : "opacity-100"
          }`}
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-pill bg-at-accent text-at-on-accent shadow-lg">
            {playing ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M8 5v14M16 5v14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M7 4.5v15a1 1 0 0 0 1.5.87l13-7.5a1 1 0 0 0 0-1.74l-13-7.5A1 1 0 0 0 7 4.5Z" />
              </svg>
            )}
          </span>
        </button>
      )}
    </figure>
  );
}
