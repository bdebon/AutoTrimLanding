import { ArrowDown, ArrowUpRight, Play } from "lucide-react";
import { useTranslations } from "next-intl";
import Capsule from "./Capsule";
import CtaLink from "./CtaLink";
import HeroBackdrop from "./HeroBackdrop";
import HeroTimeline from "./HeroTimeline";
import { HeroDemo, HeroDemoLink } from "./HeroDemo";
import Sentences from "./Sentences";
import TrackView from "./TrackView";
import { btn, capsuleLang, container } from "./ui";

export default function Hero({ locale }: { locale: string }) {
  const t = useTranslations("landing");
  return (
    <section id="hero" className="hero-composition relative isolate">
      <HeroBackdrop />
      <TrackView section="hero" />
      <div className={container}>
        <div className="hero-heading-grid">
          <div>
            <p className="hero-eyebrow"><span />{t("hero.eyebrow")}<span className="hero-eyebrow-divider" />{t("hero.introLabel")}</p>
            <h1 className="hero-title font-display"><Sentences text={t("hero.title")} /></h1>
          </div>
          <div className="hero-introduction">
            <p className="hero-description">{t("hero.body")}</p>
            <div className="hero-actions">
              <CtaLink href={`/${locale}/download`} location="hero" type="download" className={btn.primary}>
                {t("cta.download")}<ArrowUpRight size={17} aria-hidden="true" />
              </CtaLink>
              <HeroDemoLink>{t("cta.more")}<ArrowDown size={15} aria-hidden="true" /></HeroDemoLink>
            </div>
            <p className="hero-platforms"><span className="text-at-muted">{t("hero.freeTrial")}</span><span aria-hidden="true"> · </span>{t("cta.platforms")}</p>
          </div>
        </div>
        <HeroTimeline />
        <HeroDemo>
          <summary><Play size={14} aria-hidden="true" />{t("hero.fullDemo")}<span>30 s</span></summary>
          <div className="mt-6">
            <Capsule name="hero" lang={capsuleLang(locale)} number={1} title={t("hero.capsuleTitle")} tapOnMobile />
          </div>
        </HeroDemo>
      </div>
    </section>
  );
}
