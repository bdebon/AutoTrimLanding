// LemonSqueezy product checkouts. Buy links must point here, not at the store page
// (autotrim.lemonsqueezy.com): the store page drops query params, so the visitor id
// and UTMs never reach the checkout and every purchase loses its attribution.
export const CHECKOUT_URLS = {
  lifetime: "https://autotrim.lemonsqueezy.com/checkout/buy/e59b540f-d39d-4da6-89b0-ef622892ba02",
  // Monthly and yearly are two variants of this product, chosen on the checkout page.
  subscription: "https://autotrim.lemonsqueezy.com/checkout/buy/82609e0e-538b-4844-b693-7014159724be",
} as const;

export function checkoutUrlFor(plan: string): string {
  return plan === "lifetime" ? CHECKOUT_URLS.lifetime : CHECKOUT_URLS.subscription;
}
