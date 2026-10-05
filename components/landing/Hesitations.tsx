import { useTranslations } from "next-intl";
import Capsule from "./Capsule";
import Section from "./Section";
import Reveal from "./Reveal";
import { body, capsuleLang, eyebrow } from "./ui";

export default function Hesitations({ locale }: { locale: string }) {
  const t = useTranslations("landing");
  return (
    <Section id="hesitations" className="border-t border-at-hairline">
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
        <Reveal className="lg:col-span-7">
          <Capsule name="euh" lang={capsuleLang(locale)} number={2} title={t("hesitations.capsuleTitle")} />
        </Reveal>
        <div className="lg:col-span-5">
          <p className={eyebrow}>{t("hesitations.eyebrow")}</p>
          <h2 className="mt-4 font-display text-[72px] font-bold leading-none text-at-text sm:text-[96px] lg:text-[112px]">
            {t("hesitations.title")}
          </h2>
          <p className={`${body} mt-6`}>{t("hesitations.body")}</p>
          {/* Ivory: what the AI found. Text on ivory is dark. */}
          <p className="mt-8 inline-flex items-center gap-2 rounded-pill bg-at-ivory px-4 py-2 font-display text-[15px] font-semibold tabular-nums text-at-on-accent">
            {t("hesitations.proof")}
          </p>
        </div>
      </div>
    </Section>
  );
}
