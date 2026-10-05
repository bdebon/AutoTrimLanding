/** Spanish and Chinese currently use the English creative, like the landing artwork. */
export function socialImage(locale: string, page = "home") {
  return `/og/${page}-${locale === "fr" ? "fr" : "en"}.png`;
}
