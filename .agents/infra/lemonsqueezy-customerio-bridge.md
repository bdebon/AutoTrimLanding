# Pont LemonSqueezy → Customer.io + PostHog (AutoTrim)

*Mis en place le 8 juillet 2026 (Customer.io), étendu le 7 octobre 2026 (PostHog). Testé de bout en bout : achat simulé signé → profil et événements dans Customer.io, événement `purchase_test` dans PostHog.*

Code source : `supabase/functions/lemonsqueezy-webhook/index.ts`.

## Architecture
```
LemonSqueezy (store AutoTrim 211235)
  └─ webhook id 117352  [order_created, subscription_cancelled, subscription_expired,
                         subscription_payment_success, subscription_payment_failed]
      └─ POST https://gvvldbuvgbribbothphm.supabase.co/functions/v1/lemonsqueezy-webhook
          (projet Supabase "autotrim", ref gvvldbuvgbribbothphm, eu-west-3, plan free 0€)
          ├─ vérifie la signature HMAC-SHA256 (X-Signature)
          ├─ filtre produits AutoTrim uniquement (637169 Perpetual, 637170 Subscription)
          ├─ pousse vers Customer.io EU (track-eu.customer.io), workspace AutoTrim 225012
          └─ pousse les événements de revenu vers PostHog (us.i.posthog.com), projet 218035
```

## Taxonomie Customer.io (workspace 225012)
**Attributs profil** (identify par email) : `email`, `first_name`, `language` (fr|en), `license_type` (lifetime|monthly|annual), `country`, `subscription_status` (active|cancelled|none).

**Events** :
- `purchase` — props : `license_type`, `product_name`, `variant_name`, `total_usd`, `order_id`
- `subscription_cancelled` — props : `variant_name`, `ends_at` (aussi déclenché par subscription_expired)
- `subscription_payment_success` / `subscription_payment_failed` — props : `total_usd`

**Routage langue** : pays de la carte (si LS_API_KEY renseignée — pas encore fait, fallback actuel : TLD email .fr/.be → fr, sinon en).

## Taxonomie PostHog (projet 218035)
- `purchase` — à chaque commande. `distinct_id` = `visitor_id` des données du checkout s'il est présent (lien landing ou app avec attribution), sinon l'email de l'acheteur. Props : `revenue` (hors taxes, USD), `total_usd`, `license_type`, `product_name`, `variant_name`, `order_id`, `attribution` (`visitor_id` | `email_only`), `utm_*` du checkout. Pose `email`, `license_type`, `first_name` sur la personne, et `first_purchase_at` une seule fois.
- `subscription_renewed` — à chaque renouvellement (pas le premier paiement, déjà compté par `purchase`). `distinct_id` = email.
- `subscription_cancelled` — `distinct_id` = email.
- Les commandes LemonSqueezy en mode test produisent `purchase_test` / `*_test` et ne touchent pas Customer.io.

Limite actuelle : les achats faits depuis l'app n'ont pas de `visitor_id` (le bouton « Acheter » ouvre la boutique sans attribution), donc ils tombent sur une personne identifiée par l'email, séparée de la personne qui a utilisé l'app. Correctif côté app : ajouter `checkout[custom][visitor_id]` au lien d'achat, et poser l'email sur la personne PostHog à l'activation de licence.

## Secrets
- La version déployée contient encore les credentials en dur (Customer.io tracking Site ID + API key, secret de signature LemonSqueezy).
- La version du repo les lit dans l'environnement de la fonction, parce que **ce repo est public** : ne jamais y écrire leurs valeurs. Pour déployer la version du repo : Dashboard Supabase → Edge Functions → Secrets → ajouter `CIO_SITE_ID`, `CIO_API_KEY`, `LS_SIGNING_SECRET` (et `LS_API_KEY` si besoin), puis redéployer.
- La clé PostHog `phc_…` est la clé publique du projet (la même que dans l'app et la landing) : elle ne permet que d'envoyer des événements.

## Keep-alive
`.github/workflows/ping-webhook.yml` — ping lundi + jeudi (le plan free Supabase pause les projets inactifs ~7 j).
