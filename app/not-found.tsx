import Link from "next/link";
import Logo from "@/components/landing/Logo";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-at-app px-6 py-12 text-at-text">
      <div className="mx-auto max-w-3xl">
        <Logo href="/en" />
        <div className="py-28 sm:py-40">
          <p className="mb-5 text-sm tracking-widest text-at-accent">404</p>
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-6xl">This page got cut.</h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-at-muted">The page you’re looking for has moved or doesn’t exist. Let’s get you back to AutoTrim.</p>
          <Link href="/en" className="mt-8 inline-flex rounded-full bg-at-accent px-6 py-3 font-semibold text-at-on-accent hover:bg-[#FF7047]">Back to AutoTrim</Link>
        </div>
      </div>
    </main>
  );
}
