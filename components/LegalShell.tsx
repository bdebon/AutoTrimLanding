import Link from "next/link";
import Logo from "./landing/Logo";

/** The legal routes live outside the locale provider; keep their navigation standalone. */
export default function LegalShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-at-app text-at-text">
      <header className="border-b border-at-border bg-at-panel">
        <nav className="mx-auto flex h-[72px] max-w-4xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8" aria-label="Main">
          <Logo href="/en" />
          <Link href="/en" className="text-sm text-at-muted hover:text-at-accent">Back to AutoTrim</Link>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="border-t border-at-border py-8">
        <nav aria-label="Legal" className="mx-auto flex max-w-4xl flex-wrap gap-x-6 gap-y-3 px-4 text-sm text-at-muted sm:px-6 lg:px-8">
          <Link href="/terms">Terms</Link><Link href="/privacy">Privacy</Link><Link href="/refund">Refunds</Link><Link href="/legal">Legal notice</Link>
        </nav>
      </footer>
    </div>
  );
}
