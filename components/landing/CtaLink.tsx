"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { trackEvent } from "@/lib/tracking";

/** A link that reports `cta_clicked` with where it sits on the page. */
export default function CtaLink({
  href,
  location,
  type = "download",
  className,
  children,
}: {
  href: string;
  location: string;
  type?: "download" | "pricing" | "buy";
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => trackEvent("cta_clicked", { location, type })}
    >
      {children}
    </Link>
  );
}
