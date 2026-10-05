import { useTranslations } from "next-intl";
import CtaLink from "./CtaLink";
import Reveal from "./Reveal";
import Screenshot from "./Screenshot";
import Section from "./Section";
import { btn, capsuleLang } from "./ui";

export default function Timeline({ locale }: { locale: string }) {
  const t = useTranslations("landing");
  const nle = t.raw("timeline.nle") as string[];
  return (
    <Section
      id="timeline"
      eyebrow={t("timeline.eyebrow")}
      title={t("timeline.title")}
      body={t("timeline.body")}
      className="border-t border-at-hairline"
    >
      <div className="mt-10 grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <ul className="flex flex-wrap gap-2" aria-label="NLE">
            {nle.map((n) => (
              <li
                key={n}
                className="rounded-pill border border-at-border bg-at-chip px-4 py-2 font-ui text-[13.5px] font-medium text-at-text"
              >
                {n}
              </li>
            ))}
          </ul>
          <div className="mt-8 border-l-2 border-at-accent pl-5">
            <h3 className="font-display text-[22px] font-semibold leading-snug text-at-text sm:text-[24px]">{t("timeline.controlTitle")}</h3>
            <p className="mt-3 font-ui text-[15.5px] leading-relaxed text-at-muted">{t("timeline.controlBody")}</p>
          </div>
          <div className="mt-10">
            <CtaLink href={`/${locale}/download`} location="timeline" type="download" className={btn.ghost}>
              {t("cta.download")}
            </CtaLink>
          </div>
        </div>
        <Reveal className="lg:col-span-7">
          {/* The real export menu of the app (capture B); the drawn capsule #7 stays in the kit */}
          <Screenshot name="export" lang={capsuleLang(locale)} label={t("timeline.screenshot")} alt={t("timeline.screenshotAlt")} />
        </Reveal>
      </div>
    </Section>
  );
}
