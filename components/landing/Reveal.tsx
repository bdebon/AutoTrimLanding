"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * A fade-in on first view. The content is rendered visible (server, crawlers,
 * no JS); only an element still below the fold at mount is hidden, then revealed
 * when it scrolls in. Nothing moves under prefers-reduced-motion (globals.css).
 */
export default function Reveal({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "header" | "figure";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return; // already on screen
    el.classList.add("reveal");
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.classList.add("is-visible");
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Comp = Tag as any;
  return (
    <Comp ref={ref} className={className}>
      {children}
    </Comp>
  );
}
