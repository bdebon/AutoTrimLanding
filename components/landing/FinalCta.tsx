import { useTranslations } from "next-intl";
import CtaLink from "./CtaLink";
import TrackView from "./TrackView";
import { btn, container } from "./ui";

export default function FinalCta({ locale }: { locale: string }) {
  const t = useTranslations("landing");
  return (
    <section id="final" className="border-t border-at-hairline py-24 md:py-32">
      <TrackView section="final" />
      <div className={`${container} text-center`}>
        <h2 className="font-display text-[36px] font-bold leading-[1.02] text-at-text sm:text-[48px] lg:text-[64px]">
          {t("final.title")}
        </h2>
        <p className="mt-4 font-ui text-[17px] text-at-muted">{t("final.sub")}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <CtaLink href={`/${locale}/download`} location="final" type="download" className={btn.primary}>
            {t("cta.download")}
          </CtaLink>
          <CtaLink href={`/${locale}/pricing`} location="final" type="pricing" className={btn.ghost}>
            {t("cta.pricing")}
          </CtaLink>
        </div>
        <p className="mt-4 font-ui text-[12.5px] text-at-dim">{t("cta.platforms")}</p>
      </div>
    </section>
  );
}
