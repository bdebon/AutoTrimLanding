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
    { name: "multicam-drop", number: 3, title: t("multicam.capsules.drop"), detail: t("multicam.details.drop") },
    { name: "multicam-mic", number: 4, title: t("multicam.capsules.mic"), detail: t("multicam.details.mic") },
    { name: "multicam-follow", number: 5, title: t("multicam.capsules.follow"), detail: t("multicam.details.follow") },
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
          <div key={c.name}>
            <Capsule name={c.name} lang={lang} number={c.number} title={c.title} />
            <h3 className="mt-5 md:min-h-[2.5em] font-display text-[20px] font-semibold leading-tight text-at-text">{c.title}</h3>
            <p className="mt-2 font-ui text-[14.5px] leading-relaxed text-at-muted">{c.detail}</p>
          </div>
        ))}
      </Reveal>
      <div className="mx-auto mt-10 grid max-w-4xl items-stretch gap-4 md:grid-cols-2">
        <p className="self-center border-l-2 border-at-accent py-2 pl-5 font-ui text-[15px] leading-relaxed text-at-muted">
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
