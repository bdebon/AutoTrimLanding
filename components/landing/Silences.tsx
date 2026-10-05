import { useTranslations } from "next-intl";
import Section from "./Section";
import Screenshot from "./Screenshot";
import Reveal from "./Reveal";
import { capsuleLang } from "./ui";

type Stat = { value: string; label: string };

export default function Silences({ locale }: { locale: string }) {
  const t = useTranslations("landing");
  const stats = t.raw("silences.stats") as Stat[];
  return (
    <Section id="silences" eyebrow={t("silences.eyebrow")} title={t("silences.title")} body={t("silences.body")}>
      <div className="mt-12 grid items-start gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <p className="font-display text-[22px] font-semibold leading-snug text-at-text sm:text-[24px]">
            {t("silences.proof")}
          </p>
          <dl className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {stats.map((s) => (
              <div key={s.label} className="rounded-card border border-at-border bg-at-card px-5 py-4">
                <dt className="font-ui text-[11px] font-semibold uppercase tracking-[0.12em] text-at-dim">
                  {s.label}
                </dt>
                <dd className="mt-1 font-display text-[24px] font-bold tabular-nums leading-none text-at-text">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <Reveal className="lg:col-span-7">
          <Screenshot name="session" lang={capsuleLang(locale)} label={t("silences.screenshot")} alt={t("silences.screenshotAlt")} />
        </Reveal>
      </div>
    </Section>
  );
}
