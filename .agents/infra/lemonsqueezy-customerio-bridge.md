# Pont LemonSqueezy → Customer.io + PostHog + Meta (AutoTrim)

*Mis en place le 8 juillet 2026 (Customer.io), étendu le 7 octobre 2026 (PostHog). Testé de bout en bout : achat simulé signé → profil et événements dans Customer.io, événement `purchase_test` dans PostHog.*

Code source : `supabase/functions/lemonsqueezy-webhook/index.ts`, `meta.ts` pour Meta, et `lifetime-switch.ts` (abonné qui passe à la licence à vie).

## Architecture
```
LemonSqueezy (store AutoTrim 211235)
  └─ webhook id 117352  [order_created, subscription_cancelled, subscription_expired,
                         subscription_payment_success, subscription_payment_failed]
      └─ POST https://gvvldbuvgbribbothphm.supabase.co/functions/v1/lemonsqueezy-webhook
          (projet Supabase "autotrim", ref gvvldbuvgbribbothphm, eu-west-3, plan free 0€)
          ├─ vérifie la signature HMAC-SHA256 (X-Signature)
          ├─ filtre produits AutoTrim uniquement (637169 Perpetual, 637170 Subscription)
          ├─ achat de la licence à vie : résilie les abonnements du même email (API LemonSqueezy)
          ├─ pousse vers Customer.io EU (track-eu.customer.io), workspace AutoTrim 225012
          ├─ envoie l'achat à Meta (API Conversions), seulement avec le consentement pub
          └─ pousse les événements de revenu vers PostHog (us.i.posthog.com), projet 218035
```

## Taxonomie Customer.io (workspace 225012)
**Attributs profil** (identify par email) : `email`, `first_name`, `language` (fr|en), `license_type` (lifetime|monthly|annual), `country`, `subscription_status` (active|cancelled|none).

**Events** :
- `purchase` — props : `license_type`, `product_name`, `variant_name`, `total_usd`, `order_id`
- `subscription_cancelled` — props : `variant_name`, `ends_at` (aussi déclenché par subscription_expired)
- `subscription_payment_success` / `subscription_payment_failed` — props : `total_usd`

**Abonné qui passe à la licence à vie** (depuis le 25 octobre 2026, `lifetime-switch.ts`, seulement si `LS_API_KEY` est renseignée) : une commande payée de la licence à vie résilie les abonnements AutoTrim du même email (`DELETE /v1/subscriptions/:id` : l'abonnement reste valable jusqu'à la fin de la période payée, puis plus aucun prélèvement). La résiliation que LemonSqueezy renvoie ensuite (`subscription_cancelled`, puis `subscription_expired`) est ignorée dès que l'email possède une licence à vie : sinon l'event `subscription_cancelled` déclencherait l'Exit survey (automations #5 FR et #6 EN) chez quelqu'un qui vient d'acheter. L'app pré-remplit l'email du checkout quand un abonné achète la licence à vie depuis la fenêtre Licence, pour que les deux achats portent le même email.

**Routage langue** : pays du client LemonSqueezy (grâce à `LS_API_KEY`, depuis le 25 octobre 2026). Avant, et si l'appel échoue : TLD email .fr/.be → fr, sinon en.

## Taxonomie PostHog (projet 218035)
- `purchase` — à chaque commande. `distinct_id` = `visitor_id` des données du checkout s'il est présent (lien landing ou app avec attribution), sinon l'email de l'acheteur. Props : `revenue` (sous-total USD, avant remise et taxes), `net_revenue_usd` (encaissé hors taxes, remise déduite), `total_usd`, `license_type`, `product_name`, `variant_name`, `order_id`, `attribution` (`visitor_id` | `email_only`), `meta_capi` (voir Meta plus bas), `utm_*` du checkout. Pose `email`, `license_type`, `first_name` sur la personne, et `first_purchase_at` une seule fois.
- `subscription_renewed` — à chaque renouvellement (pas le premier paiement, déjà compté par `purchase`). `distinct_id` = email. Props : `revenue`, `net_revenue_usd`, `total_usd`.
- `subscription_cancelled` — `distinct_id` = email. Pas envoyé quand l'abonnement a été remplacé par la licence à vie.
- `subscription_switched_to_lifetime` — quand un achat de la licence à vie a résilié un abonnement. Même `distinct_id` que le `purchase`. Props : `subscriptions_cancelled`, `variant_name`, `ends_at`, `order_id`. Pose `subscription_status: none`.
- Tous ces événements portent `$geoip_disable: true` : envoyés depuis les serveurs de Supabase, PostHog les localisait aux États-Unis (Columbus). Le pays de l'acheteur passe par `buyer_country` (sur `purchase`, seulement si `LS_API_KEY` est renseignée).
- Les commandes LemonSqueezy en mode test produisent `purchase_test` / `*_test` et ne touchent pas Customer.io.

Limite actuelle : les achats faits depuis l'app n'ont pas de `visitor_id` (le bouton « Acheter » ouvre la boutique sans attribution), donc ils tombent sur une personne identifiée par l'email, séparée de la personne qui a utilisé l'app. Correctif côté app : ajouter `checkout[custom][visitor_id]` au lien d'achat, et poser l'email sur la personne PostHog à l'activation de licence.

## Meta (API Conversions)
Le checkout est chez LemonSqueezy, où le pixel ne tourne pas : sans cet envoi, Meta ne voit aucune vente. Le code est isolé dans `meta.ts` (rien n'y dépend de LemonSqueezy) pour le passage à Stripe.

- **Quand** : sur `order_created`, seulement si les données du checkout portent `ads_consent` (posé par le site quand la pub est autorisée : toujours hors Europe, sauf refus ; voir `lib/meta-click.ts` et `docs/tracking.md`). Les achats lancés depuis l'app le portent quand la visite d'origine l'avait (code du bouton Download, 90 jours après le téléchargement, statistiques d'usage activées : bdebon/AutoTrim#114) ; sinon, ils ne sont pas envoyés.
- **Quoi** : événement `Purchase`, `event_id` = id de la commande (Meta dédoublonne : un webhook renvoyé compte une fois), `value` = encaissé hors taxes en USD, email et pays hachés en SHA-256, `fbc` / `fbp` / user agent / page venus du checkout, `action_source: website`. Commande gratuite : pas envoyée.
- **Statut** : la propriété `meta_capi` de l'événement PostHog `purchase` dit ce qui s'est passé : `sent`, `no_consent`, `not_configured` (secrets absents), `test_skipped`, `free`, `failed` (erreur Meta, dans les logs de la fonction). La réponse du webhook le dit aussi (`ok purchase (Meta: sent)`), visible dans l'historique des livraisons du webhook chez LemonSqueezy.
- **Secrets** : `META_PIXEL_ID` (l'id du pixel), `META_CAPI_TOKEN` (jeton créé dans le Gestionnaire d'événements : pixel → Paramètres → API Conversions → Générer un jeton d'accès). Benjamin les ajoute lui-même ; ne jamais écrire le jeton ailleurs.
- **Tester** : ajouter le secret `META_TEST_EVENT_CODE` avec le code de l'onglet « Événements test » du Gestionnaire d'événements. Les commandes LemonSqueezy **en mode test** partent alors vers cet onglet seulement (sans ce secret, elles ne partent pas). Les vraies commandes ne portent jamais ce code. Les commandes du mode test de LemonSqueezy portent d'autres ids de produit, que le webhook ignore : pour tester, `node scripts/send-test-purchase.mjs` envoie à la fonction déployée une commande test signée (il demande le secret de signature du webhook, sans l'afficher), comme après une pub Meta avec consentement. Résultat attendu : `200 ok purchase (test mode, Customer.io skipped, Meta: sent)`, un `Purchase` dans l'onglet Événements test, et un `purchase_test` dans PostHog. Retirer ensuite `META_TEST_EVENT_CODE`.
- **Version d'API** : `META_API_VERSION` dans `meta.ts` (v26.0). Les versions de l'API Marketing expirent environ un an après la suivante (la v24.0 a expiré le 6 octobre 2026) : vérifier chaque année.

## Secrets
- Depuis le 21 octobre 2026, la version déployée est celle du repo (fonction version 4) : elle lit `CIO_SITE_ID`, `CIO_API_KEY` et `LS_SIGNING_SECRET` (plus `META_PIXEL_ID`, `META_CAPI_TOKEN` et `META_TEST_EVENT_CODE` pour Meta, voir plus haut) dans les secrets de la fonction (Dashboard Supabase → Edge Functions → Secrets). Les clés qui étaient écrites en dur dans l'ancienne version déployée y ont été déplacées. `LS_API_KEY` est renseignée depuis le 25 octobre 2026 (clé créée dans LemonSqueezy → Settings → API : elle a une date d'expiration, à renouveler). Sans elle, un achat de la licence à vie ne résilie pas l'abonnement, et il n'y a ni pays de l'acheteur (`buyer_country`) ni routage de langue par pays.
- **Ce repo est public** : ne jamais y écrire leurs valeurs.
- Déployer : `npx supabase@latest functions deploy lemonsqueezy-webhook --project-ref gvvldbuvgbribbothphm --no-verify-jwt --use-api`, depuis la racine du repo (après `npx supabase@latest login`). `--no-verify-jwt` est indispensable : LemonSqueezy appelle sans JWT.
- La clé PostHog `phc_…` est la clé publique du projet (la même que dans l'app et la landing) : elle ne permet que d'envoyer des événements.

## Keep-alive
`.github/workflows/ping-webhook.yml` — ping lundi + jeudi (le plan free Supabase pause les projets inactifs ~7 j).
