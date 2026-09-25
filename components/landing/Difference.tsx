import { useTranslations } from "next-intl";
import Link from "next/link";
import Reveal from "./Reveal";
import Section from "./Section";

type Item = { title: string; body: string };

const ICONS = [
  // shield: local
  <path key="a" d="M12 3l7 2.6v5.8c0 4.3-3 7.9-7 9.6-4-1.7-7-5.3-7-9.6V5.6z" />,
  // stacked lanes: one timeline
  <g key="b">
    <rect x="3" y="5" width="18" height="4.5" rx="1.5" />
    <rect x="3" y="14.5" width="18" height="4.5" rx="1.5" />
    <path d="M8 9.5v5M14 9.5v5" />
  </g>,
  // key: yours for good
  <g key="c">
    <circle cx="8.5" cy="12" r="4" />
    <path d="M12.5 12h8M17.5 12v3M20.5 12v2.5" />
  </g>,
];

/** The three things the competition does not do: local, one timeline for every clip, a licence for life. */
export default function Difference({ locale }: { locale: string }) {
  const t = useTranslations("landing.difference");
  const items = t.raw("items") as Item[];
  return (
    <Section id="difference" eyebrow={t("eyebrow")} title={t("title")} align="center" className="border-t border-at-hairline">
      <Reveal className="mt-12 grid gap-4 md:grid-cols-3 md:gap-5">
        {items.map((item, i) => (
          <article key={item.title} className={`flex flex-col gap-4 rounded-card-lg border p-6 sm:p-7 ${i === 2 ? "border-at-accent-soft-border bg-at-accent-surface" : "border-at-border bg-at-card"}`}>
            <span className={`flex h-11 w-11 items-center justify-center rounded-tile ${i === 2 ? "bg-at-accent text-at-on-accent" : "bg-at-chip text-at-accent"}`} aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                {ICONS[i]}
              </svg>
            </span>
            <h3 className="font-display text-[22px] font-bold leading-tight text-at-text">{item.title}</h3>
            <p className={`font-ui text-[15.5px] leading-[1.55] ${i === 2 ? "text-at-accent-soft-text" : "text-at-muted"}`}>{item.body}</p>
          </article>
        ))}
      </Reveal>
      <p className="mt-8 text-center">
        <Link href={`/${locale}/pricing`} className="font-ui text-[14px] text-at-muted underline decoration-at-border-hi underline-offset-4 hover:text-at-text">
          {t("link")}
        </Link>
      </p>
    </Section>
  );
}
