/** Warm light and editing guides tie the hero to the app's timeline. */
export default function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="hero-backdrop pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="hero-backdrop-light" />
      <div className="hero-backdrop-grid" />
    </div>
  );
}
