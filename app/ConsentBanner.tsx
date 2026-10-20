"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";
import {
  closeConsentSettings,
  consentSettingsOpen,
  getConsentState,
  saveConsent,
  subscribeConsent,
  type ConsentChoice,
  type ConsentState,
} from "@/lib/consent";

// The root layout sits outside the locale provider (the legal pages have none), so the
// banner carries its own strings, picked from the address.
const COPY = {
  en: {
    title: "Cookies",
    body: "With your consent, PostHog shows us how you found AutoTrim, and the Meta and Google tags measure our ads. No tracking cookie is set until you accept. Your videos never leave your computer.",
    accept: "Accept",
    refuse: "Refuse",
    choose: "Choose",
    privacy: "Privacy policy",
    analyticsTitle: "Audience measurement (PostHog)",
    analyticsBody: "Links your visit to the app you download and to a purchase, so we know which videos and pages bring people. Refused, your visits are only counted, with no cookie.",
    adsTitle: "Advertising (Meta, Google)",
    adsBody: "Measures the results of our ads and shows them to people likely to need AutoTrim.",
    save: "Save my choices",
    close: "Close",
  },
  fr: {
    title: "Cookies",
    body: "Avec votre accord, PostHog nous montre comment vous avez découvert AutoTrim, et les balises de Meta et Google mesurent nos publicités. Aucun cookie de suivi n’est déposé avant votre accord. Vos vidéos ne quittent jamais votre ordinateur.",
    accept: "Accepter",
    refuse: "Refuser",
    choose: "Choisir",
    privacy: "Politique de confidentialité",
    analyticsTitle: "Mesure d’audience (PostHog)",
    analyticsBody: "Relie votre visite à l’app que vous téléchargez et à un achat, pour savoir quelles vidéos et quelles pages amènent du monde. Refusée, vos visites sont seulement comptées, sans cookie.",
    adsTitle: "Publicité (Meta, Google)",
    adsBody: "Mesure les résultats de nos publicités et les montre aux personnes à qui AutoTrim peut servir.",
    save: "Enregistrer mes choix",
    close: "Fermer",
  },
  es: {
    title: "Cookies",
    body: "Con tu consentimiento, PostHog nos muestra cómo conociste AutoTrim, y las etiquetas de Meta y Google miden nuestros anuncios. No se instala ninguna cookie de seguimiento hasta que aceptes. Tus vídeos nunca salen de tu ordenador.",
    accept: "Aceptar",
    refuse: "Rechazar",
    choose: "Elegir",
    privacy: "Política de privacidad",
    analyticsTitle: "Medición de audiencia (PostHog)",
    analyticsBody: "Vincula tu visita con la app que descargas y con una compra, para saber qué vídeos y páginas nos traen usuarios. Si la rechazas, tus visitas solo se cuentan, sin cookies.",
    adsTitle: "Publicidad (Meta, Google)",
    adsBody: "Mide los resultados de nuestros anuncios y los muestra a quienes AutoTrim puede servir.",
    save: "Guardar mis opciones",
    close: "Cerrar",
  },
  zh: {
    title: "Cookie",
    body: "经您同意后，PostHog 帮助我们了解您是如何发现 AutoTrim 的，Meta 和 Google 的代码用于衡量我们的广告效果。在您同意之前，不会设置任何跟踪 Cookie。您的视频从不离开您的电脑。",
    accept: "接受",
    refuse: "拒绝",
    choose: "自定义",
    privacy: "隐私政策",
    analyticsTitle: "访问统计（PostHog）",
    analyticsBody: "将您的访问与您下载的应用及购买关联起来，让我们知道哪些视频和页面带来了用户。若拒绝，您的访问只会被计数，不使用 Cookie。",
    adsTitle: "广告（Meta、Google）",
    adsBody: "衡量我们的广告效果，并将广告展示给可能需要 AutoTrim 的人。",
    save: "保存我的选择",
    close: "关闭",
  },
} as const;

type Locale = keyof typeof COPY;

function localeFrom(pathname: string | null): Locale {
  const segment = pathname?.split("/")[1];
  return segment && segment in COPY ? (segment as Locale) : "en";
}

function useConsentView(): { state: ConsentState; settings: boolean } | null {
  const state = useSyncExternalStore(subscribeConsent, getConsentState, () => null);
  const settings = useSyncExternalStore(subscribeConsent, consentSettingsOpen, () => false);
  return state ? { state, settings } : null;
}

const button =
  "inline-flex h-11 flex-1 items-center justify-center rounded-pill border border-at-border-hi bg-at-card-hi px-5 font-ui text-[14.5px] font-semibold text-at-text transition-colors hover:border-at-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-at-accent";

/**
 * Shown to visitors who must be asked (lib/consent.ts) until they answer, and to anyone who
 * opens it from the footer. Refuse weighs exactly as much as Accept.
 */
export default function ConsentBanner() {
  const view = useConsentView();
  const pathname = usePathname();
  const t = COPY[localeFrom(pathname)];
  const [choosing, setChoosing] = useState(false);
  const [draft, setDraft] = useState<ConsentChoice>({ analytics: false, ads: false });

  const open = view !== null && (view.settings || (view.state.required && view.state.choice === null));

  // From the footer, the choices open directly, set as they are now
  useEffect(() => {
    if (!view?.settings) return;
    setDraft(view.state.choice ?? { analytics: !view.state.required, ads: !view.state.required });
    setChoosing(true);
  }, [view?.settings, view?.state]);

  if (!open) return null;

  const decide = (choice: ConsentChoice) => {
    saveConsent(choice);
    setChoosing(false);
    // Counts how often each choice is made; cookieless when analytics is refused
    if (posthog.__loaded) posthog.capture("consent_saved", { analytics: choice.analytics, ads: choice.ads });
  };

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="consent-title"
      className="fixed inset-x-4 bottom-4 z-[100] max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-card-lg border border-at-border bg-at-card p-5 shadow-[0_24px_80px_#000a] sm:inset-x-auto sm:left-6 sm:bottom-6 sm:w-[420px]"
    >
      <div className="flex items-start justify-between gap-4">
        <h2 id="consent-title" className="font-display text-[17px] font-semibold text-at-text">{t.title}</h2>
        {view.settings && (
          <button type="button" onClick={() => { setChoosing(false); closeConsentSettings(); }} className="font-ui text-[13px] text-at-dim hover:text-at-text">
            {t.close}
          </button>
        )}
      </div>
      <p className="mt-2 font-ui text-[13.5px] leading-[1.5] text-at-muted">
        {t.body}{" "}
        <Link href="/privacy" className="text-at-text underline underline-offset-2 hover:text-at-accent">{t.privacy}</Link>
      </p>

      {choosing && (
        <div className="mt-4 space-y-3">
          {(["analytics", "ads"] as const).map((purpose) => (
            <label key={purpose} className="flex cursor-pointer items-start gap-3 rounded-tile border border-at-border bg-at-inset p-3">
              <input
                type="checkbox"
                checked={draft[purpose]}
                onChange={(e) => setDraft({ ...draft, [purpose]: e.target.checked })}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--at-accent)]"
              />
              <span>
                <span className="block font-ui text-[14px] font-semibold text-at-text">
                  {purpose === "analytics" ? t.analyticsTitle : t.adsTitle}
                </span>
                <span className="mt-1 block font-ui text-[12.5px] leading-[1.45] text-at-dim">
                  {purpose === "analytics" ? t.analyticsBody : t.adsBody}
                </span>
              </span>
            </label>
          ))}
        </div>
      )}

      <div className="mt-4 flex gap-3">
        <button type="button" className={button} onClick={() => decide({ analytics: false, ads: false })}>{t.refuse}</button>
        <button type="button" className={button} onClick={() => decide({ analytics: true, ads: true })}>{t.accept}</button>
      </div>
      {choosing ? (
        <button type="button" onClick={() => decide(draft)} className={`${button} mt-3 w-full`}>{t.save}</button>
      ) : (
        <button type="button" onClick={() => setChoosing(true)} className="mt-3 font-ui text-[13px] text-at-dim underline underline-offset-2 hover:text-at-text">
          {t.choose}
        </button>
      )}
    </div>
  );
}
