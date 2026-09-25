/**
 * The ground behind the hero: a faint grain and a soft fall from the panel tone to the app
 * ground. No glow, nothing that moves after the entrance.
 */
export default function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, var(--at-bg-panel) 0%, var(--at-bg-app) 70%)" }} />
      <svg className="absolute inset-0 h-full w-full opacity-[0.05] mix-blend-soft-light" xmlns="http://www.w3.org/2000/svg">
        <filter id="hero-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#hero-grain)" />
      </svg>
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-at-border-hi to-transparent" />
    </div>
  );
}
