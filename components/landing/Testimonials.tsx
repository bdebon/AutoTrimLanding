import { useTranslations } from "next-intl";
import Quote from "./Quote";
import Reveal from "./Reveal";
import Section from "./Section";

/**
 * Who can be quoted today (brief §4.8). `pending: true` keeps a quote out of the page
 * until its author confirms: flip it to `false` to publish.
 */
const TESTIMONIALS: { key: string; avatar: string | null; pending: boolean; href?: string }[] = [
  { key: "vince", avatar: null, pending: false, href: "https://katanaworks.dev" }, // explicit permission, asked for this credit and link
  { key: "james", avatar: null, pending: false }, // explicit permission
  { key: "theo", avatar: "/assets/img/theo.jpg", pending: false }, // already published
  { key: "robin", avatar: "/assets/img/robin.jpg", pending: false }, // already published
  { key: "izayi", avatar: "/assets/img/izayi.jpg", pending: false }, // already published
  { key: "georgia", avatar: null, pending: true }, // waiting for Georgia's confirmation
];

export default function Testimonials() {
  const t = useTranslations("landing.testimonials");
  const live = TESTIMONIALS.filter((item) => !item.pending);
  return (
    <Section
      id="testimonials"
      eyebrow={t("eyebrow")}
      title={t("title")}
      align="center"
      className="border-t border-at-hairline"
    >
      <Reveal className="mt-12 grid gap-4 md:grid-cols-2 md:gap-5">
        {live.map((item) => (
          <Quote
            key={item.key}
            text={t(`items.${item.key}.text`)}
            name={t(`items.${item.key}.name`)}
            role={t(`items.${item.key}.role`)}
            avatar={item.avatar}
            href={item.href}
          />
        ))}
      </Reveal>
    </Section>
  );
}
