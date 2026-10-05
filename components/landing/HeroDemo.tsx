"use client";

import { useEffect, useRef, type ReactNode } from "react";

const DEMO_ID = "demo";

export function HeroDemoLink({ children }: { children: ReactNode }) {
  return (
    <a
      href={`#${DEMO_ID}`}
      className="hero-more"
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        const demo = document.getElementById(DEMO_ID);
        if (!(demo instanceof HTMLDetailsElement)) return;

        event.preventDefault();
        // Expand before measuring the scroll destination, and move keyboard focus too.
        demo.open = true;
        demo.querySelector("summary")?.focus({ preventScroll: true });
        if (window.location.hash !== `#${DEMO_ID}`) {
          window.history.pushState(window.history.state, "", `#${DEMO_ID}`);
        }
        demo.scrollIntoView({ block: "start" });
      }}
    >
      {children}
    </a>
  );
}

export function HeroDemo({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const revealFromHash = () => {
      if (window.location.hash !== `#${DEMO_ID}` || !ref.current) return;
      ref.current.open = true;
      ref.current.scrollIntoView({ block: "start" });
    };

    // A copied demo link or browser history should reveal the content too.
    revealFromHash();
    window.addEventListener("hashchange", revealFromHash);
    return () => window.removeEventListener("hashchange", revealFromHash);
  }, []);

  return <details ref={ref} id={DEMO_ID} className="hero-full-demo">{children}</details>;
}
