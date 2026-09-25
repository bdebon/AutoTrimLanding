/**
 * The ground behind the hero: a warm accent glow behind the title, a faint grain over the
 * whole area, and a hairline horizon under the copy. Nothing that moves after the entrance.
 */
export default function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        className="hero-glow absolute left-1/2 top-[38%] h-[70vh] w-[110vw] max-w-[1400px] -translate-x-1/2 -translate-y-[40%] rounded-[50%]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,91,46,0.22), rgba(255,91,46,0.07) 45%, rgba(10,10,11,0) 72%)",
          filter: "blur(24px)",
        }}
      />
      <svg className="absolute inset-0 h-full w-full opacity-[0.07] mix-blend-soft-light" xmlns="http://www.w3.org/2000/svg">
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
