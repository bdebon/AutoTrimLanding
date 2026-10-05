"use client";

import { trackEvent } from "@/lib/tracking";

export default function FaqItem({ index, q, a }: { index: number; q: string; a: string }) {
  return (
    <details
      className="faq-item group border-b border-at-border"
      onToggle={(e) =>
        trackEvent("faq_toggled", {
          question_index: index,
          question: q,
          action: (e.currentTarget as HTMLDetailsElement).open ? "open" : "close",
        })
      }
    >
      <summary className="flex items-center justify-between gap-6 py-5 text-left">
        <h3 className="font-ui text-[17px] font-semibold leading-snug text-at-text">{q}</h3>
        <span className="faq-plus flex h-8 w-8 shrink-0 items-center justify-center rounded-pill border border-at-border bg-at-chip text-at-muted" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1.5v11M1.5 7h11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </span>
      </summary>
      <p className="pb-6 pr-14 font-ui text-[16px] leading-[1.55] text-at-muted">{a}</p>
    </details>
  );
}
