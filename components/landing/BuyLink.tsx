"use client";

import { Suspense, type ReactNode } from "react";
import { useAttribution } from "@/hooks/useAttribution";
import { trackEvent } from "@/lib/tracking";

function BuyLinkInner({ plan, className, children }: { plan: string; className?: string; children: ReactNode }) {
  const { buildLemonSqueezyUrl } = useAttribution();
  return (
    <a
      href={buildLemonSqueezyUrl()}
      className={className}
      onClick={() => trackEvent("cta_clicked", { location: "pricing", type: "buy", plan })}
    >
      {children}
    </a>
  );
}

/** The Lemon Squeezy checkout link, with the visitor's attribution attached. */
export default function BuyLink(props: { plan: string; className?: string; children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <a href="https://autotrim.lemonsqueezy.com/" className={props.className}>
          {props.children}
        </a>
      }
    >
      <BuyLinkInner {...props} />
    </Suspense>
  );
}
