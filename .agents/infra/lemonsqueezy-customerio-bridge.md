# Pont LemonSqueezy → Customer.io (AutoTrim)

*Mis en place le 8 juillet 2026. Testé de bout en bout (achat simulé signé → profil + event dans CIO → 200).*

## Architecture
```
LemonSqueezy (store AutoTrim 211235)
  └─ webhook id 117352  [order_created, subscription_cancelled, subscription_expired,
                         subscription_payment_success, subscription_payment_failed]
      └─ POST https://gvvldbuvgbribbothphm.supabase.co/functions/v1/lemonsqueezy-webhook
          (projet Supabase "autotrim", ref gvvldbuvgbribbothphm, eu-west-3, plan free 0€)
          ├─ vérifie la signature HMAC-SHA256 (X-Signature)
          ├─ filtre produits AutoTrim uniquement (637169 Perpetual, 637170 Subscription)
          └─ pousse vers Customer.io EU (track-eu.customer.io), workspace AutoTrim 225012
```

## Taxonomie Customer.io (workspace 225012)
**Attributs profil** (identify par email) : `email`, `first_name`, `language` (fr|en), `license_type` (lifetime|monthly|annual), `country`, `subscription_status` (active|cancelled|none).

**Events** :
- `purchase` — props : `license_type`, `product_name`, `variant_name`, `total_usd`, `order_id`
- `subscription_cancelled` — props : `variant_name`, `ends_at` (aussi déclenché par subscription_expired)
- `subscription_payment_success` / `subscription_payment_failed` — props : `total_usd`

**Routage langue** : pays de la carte (si LS_API_KEY renseignée dans la fonction — pas encore fait, fallback actuel : TLD email .fr/.be → fr, sinon en).

## Secrets
- Credentials CIO Tracking (Site ID + API key) et secret de signature LS : **inline dans le code de la fonction** (v1 pragmatique — clé tracking = ingest-only, risque faible). Durcissement possible plus tard via `supabase secrets set`.
- Le code déployé est visible dans le dashboard Supabase → Edge Functions → lemonsqueezy-webhook.
- ⚠️ La constante `LS_API_KEY` est vide : la renseigner (clé API LemonSqueezy) améliorera le routage langue via le pays du client.

## Keep-alive
`.github/workflows/ping-webhook.yml` — ping lundi + jeudi (le plan free Supabase pause les projets inactifs ~7 j).

## À faire avant activation des campagnes CIO
1. Vérifier le domaine d'envoi `getautotrim.app` dans CIO (Settings → Email → domains) — enregistrements DNS à ajouter dans Cloudflare.
2. Review + activation des 6 campagnes draft (post-achat FR/EN, upgrade lifetime J+30 FR/EN, exit survey FR/EN).
3. Optionnel : backfill des ~100 clients historiques (import CSV depuis LemonSqueezy avec attributs language/license_type).
