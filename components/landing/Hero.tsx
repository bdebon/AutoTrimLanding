import { useTranslations } from "next-intl";
import Capsule from "./Capsule";
import CtaLink from "./CtaLink";
import HeroBackdrop from "./HeroBackdrop";
import Sentences from "./Sentences";
import TrackView from "./TrackView";
import { btn, body, capsuleLang, container, eyebrow } from "./ui";

/** Entrance timing of one hero element: delay (ms), duration (s), distance (px). Opacity and
 * a whole-pixel translation only: a scale re-rasterises text and video at the end and reads
 * as a one-pixel jump. */
const rise = (d: number, dur: number, dy: number) =>
  ({ "--d": `${d}ms`, "--dur": `${dur}s`, "--dy": `${dy}px` } as React.CSSProperties);

export default function Hero({ locale }: { locale: string }) {
  const t = useTranslations("landing");
  return (
    <section id="hero" className="relative isolate pt-32 pb-16 md:pt-40 md:pb-24">
      <HeroBackdrop />
      <TrackView section="hero" />
      <div className={container}>
        <div className="mx-auto max-w-3xl text-center">
          <p className={`${eyebrow} hero-in`} style={rise(0, 0.4, 6)}>{t("hero.eyebrow")}</p>
          <h1 className="mt-5 font-display text-[40px] font-bold leading-[1.02] text-at-text sm:text-[56px] lg:text-[72px]">
            <Sentences text={t("hero.title")} lineClassName="hero-in" lineDelays={[60, 170]} />
          </h1>
          <p className={`${body} hero-in mx-auto mt-6 max-w-2xl`} style={rise(300, 0.55, 10)}>{t("hero.body")}</p>

          {/* The real hour of the capsule, in tabular display figures */}
          <p style={rise(420, 0.5, 8)} className="hero-in mt-8 flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 font-display text-[19px] font-bold tabular-nums text-at-text sm:text-[22px]">
            <span>
              <span className="text-at-muted">{t("hero.proof.before")}</span>
              <span aria-hidden="true" className="mx-2 text-at-dim">→</span>
              <span className="hero-accent text-at-accent" style={{ "--d": "520ms" } as React.CSSProperties}>{t("hero.proof.after")}</span>
            </span>
            <span aria-hidden="true" className="text-at-faint">·</span>
            <span>{t("hero.proof.shorter")}</span>
            <span aria-hidden="true" className="text-at-faint">·</span>
            <span>{t("hero.proof.cuts")}</span>
          </p>
          <p className="hero-in mt-1 font-ui text-[13.5px] text-at-dim" style={rise(560, 0.45, 4)}>{t("hero.proof.note")}</p>

          <div className="hero-in mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row" style={rise(620, 0.5, 8)}>
            <CtaLink href={`/${locale}/download`} location="hero" type="download" className={btn.primary}>
              {t("cta.download")}
            </CtaLink>
            <a href="#silences" className={btn.ghost}>
              {t("cta.more")}
            </a>
          </div>
          <p className="hero-in mt-4 font-ui text-[12.5px] text-at-dim" style={rise(700, 0.45, 4)}>{t("cta.platforms")}</p>
        </div>

        <div className="hero-in mx-auto mt-12 max-w-[1100px] md:mt-16" style={rise(520, 0.9, 24)}>
          <Capsule
            name="hero"
            lang={capsuleLang(locale)}
            number={1}
            title={t("hero.capsuleTitle")}
            priority
            tapOnMobile
          />
        </div>
      </div>
    </section>
  );
}
