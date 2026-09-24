"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/tracking";

/** Fires `section_viewed` once for the element that contains it. */
export default function TrackView({ section }: { section: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current?.parentElement;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          trackEvent("section_viewed", { section });
          io.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [section]);

  return <span ref={ref} hidden />;
}
