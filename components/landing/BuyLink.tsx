"use client";

import { Suspense, useEffect, useState, type ReactNode } from "react";
import { useAttribution } from "@/hooks/useAttribution";
import { checkoutUrlFor } from "@/lib/checkout";
import { trackEvent } from "@/lib/tracking";

function BuyLinkInner({ plan, className, children }: { plan: string; className?: string; children: ReactNode }) {
  const { buildLemonSqueezyUrl } = useAttribution();
  const base = checkoutUrlFor(plan);
  // The attribution lives in localStorage: resolve it after hydration so the
  // server and the client render the same href.
  const [href, setHref] = useState(base);
  useEffect(() => setHref(buildLemonSqueezyUrl(base)), [buildLemonSqueezyUrl, base]);
  return (
    <a
      href={href}
      className={className}
      onClick={(e) => {
        // Rebuild at click time: PostHog may not have loaded yet when the effect ran
        e.currentTarget.href = buildLemonSqueezyUrl(base);
        trackEvent("cta_clicked", { location: "pricing", type: "buy", plan });
      }}
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
        <a href={checkoutUrlFor(props.plan)} className={props.className}>
          {props.children}
        </a>
      }
    >
      <BuyLinkInner {...props} />
    </Suspense>
  );
}
