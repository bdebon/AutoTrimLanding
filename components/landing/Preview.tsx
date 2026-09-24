import { useTranslations } from "next-intl";
import Capsule from "./Capsule";
import Quote from "./Quote";
import Reveal from "./Reveal";
import Section from "./Section";
import { capsuleLang } from "./ui";

/** The three states of the app's preview timeline, drawn by the band rule: kept is a
 * clean dark band with accent bars, removed is lighter and hatched, a hesitation is a
 * removed band with an ivory marker above it. */
function Legend({ kept, silence, hesitation }: { kept: string; silence: string; hesitation: string }) {
  const swatch = "relative h-7 w-12 shrink-0 overflow-hidden rounded-[6px]";
  const bars = (color: string, heights: number[]) => (
    <span className="absolute inset-0 flex items-center justify-center gap-[3px]" aria-hidden="true">
      {heights.map((h, i) => (
        <span key={i} className="w-[4px] rounded-[2px]" style={{ height: `${h}%`, background: color }} />
      ))}
    </span>
  );
  return (
    <ul className="flex flex-wrap gap-x-8 gap-y-3">
      <li className="flex items-center gap-3">
        <span className={`${swatch} bg-at-wave-kept-band`}>{bars("var(--at-accent)", [40, 70, 55, 80, 45])}</span>
        <span className="font-ui text-[14px] text-at-muted">{kept}</span>
      </li>
      <li className="flex items-center gap-3">
        <span className={`${swatch} at-cut-band`}>{bars("var(--at-wave-cut-bar)", [12, 16, 10, 14, 12])}</span>
        <span className="font-ui text-[14px] text-at-muted">{silence}</span>
      </li>
      <li className="flex items-center gap-3">
        <span className={`${swatch} at-cut-band`}>
          <span className="absolute inset-x-1 top-0.5 h-[3px] rounded-full bg-at-ivory" aria-hidden="true" />
          {bars("var(--at-wave-cut-bar)", [45, 50, 48, 52, 46])}
        </span>
        <span className="font-ui text-[14px] text-at-muted">{hesitation}</span>
      </li>
    </ul>
  );
}

export default function Preview({ locale }: { locale: string }) {
  const t = useTranslations("landing");
  const lang = capsuleLang(locale);
  return (
    <Section
      id="preview"
      eyebrow={t("preview.eyebrow")}
      title={t("preview.title")}
      body={t("preview.body")}
      className="border-t border-at-hairline"
    >
      <Reveal className="mt-10">
        <Capsule name="preview" lang={lang} number={9} title={t("preview.capsuleMain")} />
      </Reveal>
      <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <Legend
          kept={t("preview.legend.kept")}
          silence={t("preview.legend.silence")}
          hesitation={t("preview.legend.hesitation")}
        />
        <div className="md:max-w-sm">
          <Quote
            text={t("preview.quote")}
            name={t("preview.quoteName")}
            role={t("preview.quoteRole")}
            avatar="/assets/img/izayi.jpg"
            compact
          />
        </div>
      </div>
    </Section>
  );
}
