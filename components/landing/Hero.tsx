import { useTranslations } from "next-intl";
import Capsule from "./Capsule";
import CtaLink from "./CtaLink";
import Sentences from "./Sentences";
import TrackView from "./TrackView";
import { btn, body, capsuleLang, container, eyebrow } from "./ui";

export default function Hero({ locale }: { locale: string }) {
  const t = useTranslations("landing");
  return (
    <section id="hero" className="relative pt-32 pb-16 md:pt-40 md:pb-24">
      <TrackView section="hero" />
      <div className={container}>
        <div className="mx-auto max-w-3xl text-center">
          <p className={eyebrow}>{t("hero.eyebrow")}</p>
          <h1 className="mt-5 font-display text-[40px] font-bold leading-[1.02] text-at-text sm:text-[56px] lg:text-[72px]">
            <Sentences text={t("hero.title")} />
          </h1>
          <p className={`${body} mx-auto mt-6 max-w-2xl`}>{t("hero.body")}</p>

          {/* The real hour of the capsule, in tabular display figures */}
          <p className="mt-8 flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 font-display text-[19px] font-bold tabular-nums text-at-text sm:text-[22px]">
            <span>
              <span className="text-at-muted">{t("hero.proof.before")}</span>
              <span aria-hidden="true" className="mx-2 text-at-dim">→</span>
              <span className="text-at-accent">{t("hero.proof.after")}</span>
            </span>
            <span aria-hidden="true" className="text-at-faint">·</span>
            <span>{t("hero.proof.shorter")}</span>
            <span aria-hidden="true" className="text-at-faint">·</span>
            <span>{t("hero.proof.cuts")}</span>
          </p>
          <p className="mt-1 font-ui text-[13.5px] text-at-dim">{t("hero.proof.note")}</p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <CtaLink href={`/${locale}/download`} location="hero" type="download" className={btn.primary}>
              {t("cta.download")}
            </CtaLink>
            <a href="#silences" className={btn.ghost}>
              {t("cta.more")}
            </a>
          </div>
          <p className="mt-4 font-ui text-[12.5px] text-at-dim">{t("cta.platforms")}</p>
        </div>

        <div className="mx-auto mt-12 max-w-[1100px] md:mt-16">
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
