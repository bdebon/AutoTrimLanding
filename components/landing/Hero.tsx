import { useTranslations } from "next-intl";
import Capsule from "./Capsule";
import CtaLink from "./CtaLink";
import HeroBackdrop from "./HeroBackdrop";
import Sentences from "./Sentences";
import TrackView from "./TrackView";
import { btn, body, capsuleLang, container, eyebrow } from "./ui";

/** Entrance timing of one hero element: delay (ms), duration (s), distance (px), starting scale. */
const rise = (d: number, dur: number, dy: number, fromScale = 1) =>
  ({ "--d": `${d}ms`, "--dur": `${dur}s`, "--dy": `${dy}px`, "--from-scale": fromScale } as React.CSSProperties);

export default function Hero({ locale }: { locale: string }) {
  const t = useTranslations("landing");
  return (
    <section id="hero" className="relative isolate pt-32 pb-16 md:pt-40 md:pb-24">
      <HeroBackdrop />
      <TrackView section="hero" />
      <div className={container}>
        <div className="mx-auto max-w-3xl text-center">
          <p className={`${eyebrow} hero-in`} style={rise(0, 0.6, 8)}>{t("hero.eyebrow")}</p>
          <h1 className="mt-5 font-display text-[40px] font-bold leading-[1.02] text-at-text sm:text-[56px] lg:text-[72px]">
            <Sentences text={t("hero.title")} lineClassName="hero-in" lineDelays={[120, 320]} />
          </h1>
          <p className={`${body} hero-in mx-auto mt-6 max-w-2xl`} style={rise(700, 0.9, 12)}>{t("hero.body")}</p>

          {/* The real hour of the capsule, in tabular display figures */}
          <p style={rise(1000, 0.8, 10)} className="hero-in mt-8 flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 font-display text-[19px] font-bold tabular-nums text-at-text sm:text-[22px]">
            <span>
              <span className="text-at-muted">{t("hero.proof.before")}</span>
              <span aria-hidden="true" className="mx-2 text-at-dim">→</span>
              <span className="hero-accent text-at-accent" style={{ "--d": "1250ms" } as React.CSSProperties}>{t("hero.proof.after")}</span>
            </span>
            <span aria-hidden="true" className="text-at-faint">·</span>
            <span>{t("hero.proof.shorter")}</span>
            <span aria-hidden="true" className="text-at-faint">·</span>
            <span>{t("hero.proof.cuts")}</span>
          </p>
          <p className="hero-in mt-1 font-ui text-[13.5px] text-at-dim" style={rise(1400, 0.7, 6)}>{t("hero.proof.note")}</p>

          <div className="hero-in mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row" style={rise(1550, 0.8, 10, 0.97)}>
            <CtaLink href={`/${locale}/download`} location="hero" type="download" className={btn.primary}>
              {t("cta.download")}
            </CtaLink>
            <a href="#silences" className={btn.ghost}>
              {t("cta.more")}
            </a>
          </div>
          <p className="hero-in mt-4 font-ui text-[12.5px] text-at-dim" style={rise(1750, 0.7, 6)}>{t("cta.platforms")}</p>
        </div>

        <div className="hero-in mx-auto mt-12 max-w-[1100px] md:mt-16" style={rise(1300, 1.4, 40, 0.985)}>
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
