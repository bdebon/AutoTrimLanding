import { useTranslations } from "next-intl";
import FaqItem from "./FaqItem";
import Section from "./Section";

export type FaqEntry = { q: string; a: string };

export default function Faq() {
  const t = useTranslations("landing.faq");
  const items = t.raw("items") as FaqEntry[];
  return (
    <Section id="faq" eyebrow={t("eyebrow")} title={t("title")} align="center" className="border-t border-at-hairline">
      <div className="mx-auto mt-10 max-w-3xl border-t border-at-border">
        {items.map((item, i) => (
          <FaqItem key={item.q} index={i} q={item.q} a={item.a} />
        ))}
      </div>
    </Section>
  );
}
