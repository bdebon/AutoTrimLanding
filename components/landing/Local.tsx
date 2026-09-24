import { useTranslations } from "next-intl";
import Capsule from "./Capsule";
import Quote from "./Quote";
import Reveal from "./Reveal";
import Section from "./Section";
import { body, capsuleLang, eyebrow } from "./ui";

export default function Local({ locale }: { locale: string }) {
  const t = useTranslations("landing");
  return (
    <Section id="local" className="border-t border-at-hairline">
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <p className={eyebrow}>{t("local.eyebrow")}</p>
          <h2 className="mt-4 font-display text-[32px] font-bold leading-[1.05] text-at-text sm:text-[40px] lg:text-[48px]">
            {t("local.title")}
          </h2>
          <p className={`${body} mt-6`}>{t("local.body")}</p>
          <p className="mt-8 font-display text-[22px] font-semibold text-at-text sm:text-[24px]">{t("local.line")}</p>
          <div className="mt-8">
            <Quote
              text={t("local.quote")}
              name={t("local.quoteName")}
              role={t("local.quoteRole")}
              compact
            />
          </div>
        </div>
        <Reveal className="lg:col-span-7">
          <Capsule name="local" lang={capsuleLang(locale)} number={10} title={t("local.capsuleTitle")} />
        </Reveal>
      </div>
    </Section>
  );
}
