import { useTranslations } from "next-intl";
import Capsule from "./Capsule";
import Quote from "./Quote";
import Reveal from "./Reveal";
import Section from "./Section";
import { capsuleLang } from "./ui";

export default function Multicam({ locale }: { locale: string }) {
  const t = useTranslations("landing");
  const lang = capsuleLang(locale);
  const capsules = [
    { name: "multicam-drop", number: 3, title: t("multicam.capsules.drop") },
    { name: "multicam-mic", number: 4, title: t("multicam.capsules.mic") },
    { name: "multicam-follow", number: 5, title: t("multicam.capsules.follow") },
  ];
  return (
    <Section
      id="multicam"
      eyebrow={t("multicam.eyebrow")}
      title={t("multicam.title")}
      body={t("multicam.body")}
      align="center"
      narrow
      className="border-t border-at-hairline"
    >
      <Reveal className="mt-12 grid gap-4 md:grid-cols-3 md:gap-5">
        {capsules.map((c) => (
          <Capsule key={c.name} name={c.name} lang={lang} number={c.number} title={c.title} />
        ))}
      </Reveal>
      <div className="mx-auto mt-10 grid max-w-4xl items-stretch gap-4 md:grid-cols-2">
        <p className="rounded-card-lg border border-at-border bg-at-panel p-6 font-ui text-[15px] leading-[1.55] text-at-muted">
          {t("multicam.truth")}
        </p>
        <Quote
          text={t("multicam.quote")}
          name={t("multicam.quoteName")}
          role={t("multicam.quoteRole")}
          avatar="/assets/img/theo.jpg"
          compact
        />
      </div>
    </Section>
  );
}
